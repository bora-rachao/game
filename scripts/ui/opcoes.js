// Opções de acessibilidade, aplicadas na hora e salvas no progresso.
import { salvarProgresso } from '../dados/armazenamento.js';

export function aplicarOpcoes(opcoes) {
  const raiz = document.documentElement;
  raiz.style.setProperty('--escala-texto', String(opcoes.tamanhoTexto));
  raiz.dataset.reduzirMovimento = String(!!opcoes.reduzirMovimento);
  raiz.dataset.textoGrande = String(opcoes.tamanhoTexto >= 1.5);
}

export function iniciarOpcoes(form, progresso) {
  const o = progresso.opcoes;
  form.elements.tamanhoTexto.value = String(o.tamanhoTexto);
  form.elements.modoEstudo.value = o.modoEstudo;
  form.elements.reduzirMovimento.checked = !!o.reduzirMovimento;

  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('change', () => {
    o.tamanhoTexto = Number(form.elements.tamanhoTexto.value);
    o.modoEstudo = form.elements.modoEstudo.value;
    o.reduzirMovimento = form.elements.reduzirMovimento.checked;
    aplicarOpcoes(o);
    salvarProgresso(progresso);
  });
}
