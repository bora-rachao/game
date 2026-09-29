// Seleção, preparação e cronômetro das questões.
import { CONFIG } from '../config.js';

// Tempo = leitura (palavras) + decisão (dificuldade), limitado à faixa do formato.
export function calcularTempo(questao, modoEstudo) {
  const { palavrasPorSegundo, decisao, faixaTempo } = CONFIG.questoes;
  let tempo;
  if (questao.tempoOverride != null) {
    tempo = questao.tempoOverride;
  } else {
    const palavras = [questao.enunciado, ...questao.alternativas].join(' ').trim().split(/\s+/).length;
    const [min, max] = faixaTempo[questao.formato] ?? faixaTempo.esconderijo;
    tempo = Math.min(max, Math.max(min, Math.round(palavras / palavrasPorSegundo + decisao[questao.dificuldade])));
  }
  if (modoEstudo === 'sem') return Infinity;
  if (modoEstudo === 'dobro') return tempo * 2;
  return tempo;
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function aleatorio(lista) {
  return lista.length ? lista[Math.floor(Math.random() * lista.length)] : null;
}

// Cria a versão exibida: alternativas embaralhadas e tempo calculado.
export function prepararQuestao(original, opcoes, recuperacao = false) {
  const ordem = embaralhar(original.alternativas.map((_, i) => i));
  return {
    original,
    id: original.id,
    conceito: original.conceito,
    dificuldade: original.dificuldade,
    formato: recuperacao ? 'esconderijo' : original.formato,
    enunciado: original.enunciado,
    alternativas: ordem.map((i) => original.alternativas[i]),
    corretaExibida: ordem.indexOf(original.correta),
    total: recuperacao ? Infinity : calcularTempo(original, opcoes.modoEstudo),
    decorrido: 0,
    recuperacao,
  };
}

// O cronômetro só começa depois da carência de leitura.
export function tempoUsado(questao) {
  return Math.max(0, questao.decorrido - CONFIG.questoes.carencia);
}

export function restante(questao) {
  if (questao.total === Infinity) return Infinity;
  return Math.max(0, questao.total - tempoUsado(questao));
}

export function agendarRevisao(estado, original) {
  estado.revisoes = estado.revisoes.filter((r) => r.conceito !== original.conceito);
  estado.revisoes.push({
    conceito: original.conceito,
    questao: original,
    disponivelEm: estado.tempo + CONFIG.questoes.revisaoApos,
  });
}

export function criarSeletor(banco, fase) {
  const daFase = banco.questoes.filter((q) => q.fase === fase.id);
  const anteriores = banco.questoes.filter((q) => q.fase < fase.id);

  function sortearDificuldade() {
    const r = Math.random();
    let acumulado = 0;
    for (const [dif, peso] of Object.entries(fase.mistura)) {
      acumulado += peso;
      if (r < acumulado) return dif;
    }
    return 'facil';
  }

  return {
    escolher(estado) {
      const livres = (lista) => lista.filter((q) => !estado.usadas.has(q.id));

      // 1. Conceito errado há pelo menos 60 s volta, de preferência com outra pergunta.
      const i = estado.revisoes.findIndex((r) => r.disponivelEm <= estado.tempo);
      if (i >= 0) {
        const [revisao] = estado.revisoes.splice(i, 1);
        const mesmoConceito = livres(banco.questoes).filter((q) => q.conceito === revisao.conceito);
        return aleatorio(mesmoConceito) ?? revisao.questao;
      }

      // 2. Sorteio pela mistura de dificuldade da fase.
      const dif = sortearDificuldade();
      return aleatorio(livres(daFase).filter((q) => q.dificuldade === dif))
        ?? aleatorio(livres(daFase))
        ?? aleatorio(livres(anteriores))
        ?? aleatorio(daFase);
    },

    // Aula de Recuperação: revisa o último conceito errado.
    paraRecuperacao(estado) {
      const erradas = estado.historico.filter((h) => h.resultado !== 'certa');
      return erradas.length ? erradas[erradas.length - 1].questao : aleatorio(daFase);
    },
  };
}
