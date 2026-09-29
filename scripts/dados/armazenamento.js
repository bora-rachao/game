// Leitura e escrita do progresso no localStorage, com chave versionada.
const CHAVE = 'fuga-da-aula:v1';
let disponivel = true;

function padrao() {
  const prefereReduzir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  return {
    versao: 1,
    fases: {},
    conceitos: {},
    opcoes: { tamanhoTexto: 1, modoEstudo: 'desligado', reduzirMovimento: prefereReduzir },
  };
}

export function carregarProgresso() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return padrao();
    const dados = JSON.parse(bruto);
    if (dados.versao !== 1) return padrao();
    const base = padrao();
    return { ...base, ...dados, opcoes: { ...base.opcoes, ...dados.opcoes } };
  } catch {
    disponivel = false;
    return padrao();
  }
}

export function salvarProgresso(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    disponivel = true;
  } catch {
    disponivel = false;
  }
  return disponivel;
}

export function armazenamentoDisponivel() {
  return disponivel;
}
