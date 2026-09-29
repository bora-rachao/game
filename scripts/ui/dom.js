// Pequeno ajudante para criar elementos sem innerHTML.
export function el(tag, props = {}, ...filhos) {
  const n = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props)) {
    if (valor == null || valor === false) continue;
    if (chave === 'class') n.className = valor;
    else if (chave === 'text') n.textContent = valor;
    else if (chave === 'dataset') Object.assign(n.dataset, valor);
    else n.setAttribute(chave, valor === true ? '' : valor);
  }
  n.append(...filhos.flat().filter((f) => f != null && f !== false));
  return n;
}

export const formatarNumero = (n) => new Intl.NumberFormat('pt-BR').format(n);
