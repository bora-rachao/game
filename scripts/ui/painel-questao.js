// Painel de questão: enunciado, alternativas, cronômetro e feedback.
import { CONFIG } from '../config.js';
import { restante } from '../game/questoes.js';
import { el } from './dom.js';

const LETRAS = ['A', 'B', 'C', 'D'];
const ROTULOS = {
  portas: 'Escolha a porta certa',
  esconderijo: 'Escondido! Responda antes que a lanterna chegue',
  recuperacao: 'Aula de Recuperação: acerte para escapar',
};
const TITULOS = {
  certa: 'Acertou!',
  errada: 'Não foi dessa vez',
  naoSei: 'Tudo bem não saber',
  tempo: 'O tempo acabou',
};

function sinal(n) {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0';
}

function descreverEfeito(fb) {
  if (fb.recuperacao) {
    return fb.resultado === 'certa'
      ? 'Você escapou! Seu Fôlego volta para 25.'
      : 'O professor te levou de volta para a sala. Veja o que revisar nos resultados.';
  }
  if (fb.resultado === 'certa') {
    const partes = [`${sinal(fb.deltaFolego)} de Fôlego`, `+${fb.pontosGanhos} pontos`];
    if (fb.rapido) partes.push('bônus por rapidez');
    if (fb.bonusSequencia) partes.push('bônus por 3 acertos seguidos');
    return partes.join(', ') + '.';
  }
  const sequencia = fb.resultado === 'naoSei' ? 'Sua sequência continua.' : 'A sequência foi zerada.';
  return `${sinal(fb.deltaFolego)} de Fôlego. ${sequencia} Esse assunto vai voltar mais tarde.`;
}

export function criarPainelQuestao(raiz, { aoResponder, aoNaoSei, aoContinuar }) {
  const p = (nome) => raiz.querySelector(`[data-painel="${nome}"]`);
  const ui = {
    rotulo: p('rotulo'),
    cronometro: p('cronometro'),
    cronometroTexto: p('cronometro-texto'),
    enunciado: p('enunciado'),
    alternativas: p('alternativas'),
    naoSei: p('nao-sei'),
    feedback: p('feedback'),
    fbTitulo: p('feedback-titulo'),
    fbTexto: p('feedback-texto'),
    fbEfeito: p('feedback-efeito'),
    continuar: p('continuar'),
    auto: p('auto'),
  };
  let ultimoNivel = null;
  let ultimoTexto = null;

  ui.naoSei.addEventListener('click', aoNaoSei);
  ui.continuar.addEventListener('click', aoContinuar);
  ui.alternativas.addEventListener('click', (e) => {
    const botao = e.target.closest('button[data-indice]');
    if (botao && !botao.disabled) aoResponder(Number(botao.dataset.indice));
  });

  function atualizarTimer(q) {
    if (q.total === Infinity) return;
    const lendo = q.decorrido < CONFIG.questoes.carencia;
    const r = restante(q);
    const fracao = lendo ? 1 : r / q.total;
    ui.cronometro.style.setProperty('--fracao', fracao.toFixed(3));
    const nivel = lendo ? 'lendo' : r <= 3 ? 'urgente' : fracao <= 0.5 ? 'atencao' : 'calmo';
    if (nivel !== ultimoNivel) {
      ultimoNivel = nivel;
      ui.cronometro.dataset.nivel = nivel;
    }
    const texto = lendo ? 'Leia com calma' : `${Math.ceil(r)} s`;
    if (texto !== ultimoTexto) {
      ultimoTexto = texto;
      ui.cronometroTexto.textContent = texto;
    }
  }

  return {
    mostrarQuestao(q) {
      const formato = q.recuperacao ? 'recuperacao' : q.formato;
      raiz.hidden = false;
      raiz.dataset.formato = formato;
      raiz.dataset.estado = 'pergunta';
      ui.rotulo.textContent = ROTULOS[formato];
      ui.enunciado.textContent = q.enunciado;
      ui.alternativas.replaceChildren(...q.alternativas.map((texto, i) =>
        el('li', {},
          el('button', { type: 'button', class: 'alternativa', dataset: { indice: String(i) } },
            el('span', { class: 'alternativa__letra', text: LETRAS[i] }),
            el('span', { class: 'alternativa__texto', text: texto })))));
      ui.naoSei.hidden = false;
      ui.feedback.hidden = true;
      ui.cronometro.hidden = q.total === Infinity;
      ultimoNivel = null;
      ultimoTexto = null;
      atualizarTimer(q);
      // Foco no painel (não numa alternativa) para evitar resposta acidental com Espaço.
      raiz.focus({ preventScroll: true });
    },

    atualizarTimer,

    mostrarFeedback(fb) {
      const q = fb.questao;
      raiz.dataset.estado = 'feedback';
      ui.naoSei.hidden = true;
      ui.cronometro.hidden = true;
      ui.alternativas.querySelectorAll('button[data-indice]').forEach((botao, i) => {
        botao.disabled = true;
        if (i === q.corretaExibida) botao.dataset.marca = 'certa';
        else if (i === fb.escolha) botao.dataset.marca = 'errada';
      });
      ui.feedback.hidden = false;
      ui.feedback.dataset.resultado = fb.resultado;
      ui.fbTitulo.textContent = fb.resultado === 'certa' && fb.rapido ? 'Acertou rápido!' : TITULOS[fb.resultado];
      ui.fbTexto.textContent = q.original.explicacaoCurta;
      ui.fbEfeito.textContent = descreverEfeito(fb);
      ui.continuar.textContent = fb.fim ? 'Ver resultados' : 'Continuar';
      raiz.scrollTop = 0;
      ui.continuar.focus({ preventScroll: true });
    },

    atualizarAuto(fb, automatico) {
      ui.auto.hidden = !automatico;
      if (automatico) {
        const resta = Math.max(0, 1 - fb.decorrido / CONFIG.questoes.feedbackAuto);
        ui.auto.firstElementChild.style.transform = `scaleX(${resta.toFixed(3)})`;
      }
    },

    esconder() {
      raiz.hidden = true;
    },
  };
}
