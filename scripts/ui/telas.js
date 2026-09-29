// Troca entre as telas sobrepostas (título, mapa, pausa, opções, resultados).
const telas = new Map();
let atual = null;

export function registrarTelas(raiz) {
  raiz.querySelectorAll('[data-tela]').forEach((el) => telas.set(el.dataset.tela, el));
  atual = [...telas.entries()].find(([, el]) => !el.hidden)?.[0] ?? null;
}

export function mostrarTela(nome) {
  for (const [n, el] of telas) el.hidden = n !== nome;
  atual = nome;
  const tela = telas.get(nome);
  const foco = tela?.querySelector('[data-foco-inicial]') ?? tela?.querySelector('button');
  foco?.focus({ preventScroll: true });
}

export function esconderTelas() {
  for (const el of telas.values()) el.hidden = true;
  atual = null;
}

export function telaAtual() {
  return atual;
}
