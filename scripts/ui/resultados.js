// Boletim: desempenho, conceitos da partida, revisão e próximos passos.
import { el, formatarNumero } from './dom.js';
import { conceitoDominado, faseLiberada } from '../dados/progresso.js';

const NOME_MEDALHA = { ouro: 'Ouro', prata: 'Prata', bronze: 'Bronze' };
const ESTADOS = { dominado: 'Dominado', progresso: 'Em progresso', revisar: 'Revisar' };

function agruparConceitos(historico) {
  const mapa = new Map();
  for (const h of historico) {
    const c = mapa.get(h.conceito) ?? { certas: 0, total: 0 };
    c.total++;
    if (h.resultado === 'certa') c.certas++;
    mapa.set(h.conceito, c);
  }
  return mapa;
}

function falaDoProfessor(resumo, revisar, nomes) {
  if (!resumo.concluiu && revisar.length) {
    return `Te peguei! Revise ${nomes[revisar[0]] ?? revisar[0]} e tente de novo.`;
  }
  if (!resumo.concluiu) return 'Te peguei! Mas errar faz parte do caminho. Tente de novo.';
  if (revisar.length) {
    return `Você corre bem, mas ainda precisa caprichar em ${(nomes[revisar[0]] ?? revisar[0]).toLowerCase()}. Da próxima vez eu te pego!`;
  }
  return 'Excelente! Hoje você me deixou para trás. Nos vemos na próxima fase.';
}

export function renderizarResultados(raiz, { resumo, registro, conteudo, progresso, salvo, faseIndice }) {
  const nomes = conteudo.banco.conceitos;
  const fases = conteudo.fases.fases;
  const porConceito = agruparConceitos(resumo.historico);

  const itensConceito = [];
  const revisar = [];
  for (const [conceito, c] of porConceito) {
    let estado;
    if (c.certas < c.total) {
      estado = 'revisar';
      revisar.push(conceito);
    } else {
      estado = conceitoDominado(progresso.conceitos[conceito]) ? 'dominado' : 'progresso';
    }
    itensConceito.push(el('li', { class: 'conceito', dataset: { estado } },
      el('span', { text: nomes[conceito] ?? conceito }),
      el('span', { class: 'conceito__estado', text: ESTADOS[estado] })));
  }

  // Uma revisão por questão errada (sem repetir)
  const vistas = new Set();
  const revisoes = resumo.historico
    .filter((h) => h.resultado !== 'certa' && !vistas.has(h.id) && vistas.add(h.id))
    .map((h) => {
      const q = h.questao;
      const sua = h.escolhaTexto ?? (h.resultado === 'tempo' ? 'o tempo acabou' : 'você marcou Não sei');
      return el('article', { class: 'revisao' },
        el('h4', { text: q.enunciado }),
        el('p', { class: 'revisao__sua', text: `Sua resposta: ${sua}` }),
        el('p', { class: 'revisao__certa', text: `Resposta certa: ${q.alternativas[q.correta]}` }),
        el('p', { text: q.explicacaoCompleta }));
    });

  const temProxima = faseIndice + 1 < fases.length && faseLiberada(progresso, fases, faseIndice + 1);
  const textoRecorde = registro.novoRecorde
    ? 'Novo recorde!'
    : `Recorde: ${formatarNumero(registro.recordeAnterior)}`;

  raiz.replaceChildren(
    el('header', { class: 'boletim__topo' },
      el('div', {},
        el('p', { class: 'boletim__fase', text: `Fase ${resumo.faseId.replace('-', '.')}: ${resumo.faseNome}` }),
        el('h2', {
          class: 'boletim__titulo',
          id: 'titulo-resultados',
          text: resumo.concluiu ? 'Você chegou ao portão!' : 'O professor te alcançou',
        })),
      el('div', { class: 'boletim__placar' },
        el('span', { class: 'boletim__pontos', text: formatarNumero(resumo.pontos) }),
        el('span', { text: 'pontos' }),
        el('br'),
        el('p', {
          class: 'medalha',
          dataset: { medalha: registro.medalha ?? 'nenhuma' },
          text: registro.medalha ? `Medalha ${NOME_MEDALHA[registro.medalha]}` : 'Sem medalha',
        }),
        el('p', {
          class: 'boletim__recorde',
          text: registro.modoEstudo ? `${textoRecorde} (Modo Estudo)` : textoRecorde,
        }))),

    el('dl', { class: 'boletim__numeros' },
      el('div', {}, el('dt', { text: 'Acertos' }), el('dd', { text: `${resumo.acertos} de ${resumo.total}` })),
      el('div', {}, el('dt', { text: 'Melhor sequência' }), el('dd', { text: String(resumo.melhorSequencia) })),
      el('div', {}, el('dt', { text: 'Obstáculos evitados' }), el('dd', { text: String(resumo.obstaculosEvitados) })),
      el('div', {}, el('dt', { text: 'Distância' }), el('dd', { text: `${formatarNumero(resumo.distancia)} m` })),
      el('div', {}, el('dt', { text: 'Capturas' }), el('dd', { text: String(resumo.capturas) }))),

    itensConceito.length && el('section', { class: 'boletim__secao' },
      el('h3', { text: 'Conceitos desta partida' }),
      el('ul', { class: 'conceitos' }, itensConceito)),

    revisoes.length && el('section', { class: 'boletim__secao' },
      el('h3', { text: 'Para revisar' }),
      revisoes),

    el('p', { class: 'fala', text: `Professor Pixel: ${falaDoProfessor(resumo, revisar, nomes)}` }),

    el('div', { class: 'boletim__acoes' },
      el('button', { type: 'button', class: 'botao', dataset: { acao: 'jogar-novamente' }, 'data-foco-inicial': true, text: 'Jogar de novo' }),
      temProxima && el('button', { type: 'button', class: 'botao botao--secundario', dataset: { acao: 'proxima-fase' }, text: 'Próxima fase' }),
      el('button', { type: 'button', class: 'botao botao--fantasma', dataset: { acao: 'sair-mapa' }, text: 'Voltar ao mapa' })),

    !salvo && el('p', { class: 'boletim__nota', text: 'O progresso não pôde ser salvo neste navegador (modo privado ou armazenamento cheio).' }),
  );
}
