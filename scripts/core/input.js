// Converte teclado, mouse e toque em ações do jogo.
const TECLAS_PULO = new Set(['Space', 'ArrowUp', 'KeyW']);
const TECLAS_DESLIZE = new Set(['ArrowDown', 'KeyS']);
const TECLAS_ALTERNATIVA = {
  Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3,
  Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3,
  KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3,
};
const SELETOR_UI = 'button, select, input, label, .painel, .tela, .medidor, .placar, .progresso';

export function criarInput({ superficie, acoes }) {
  window.addEventListener('keydown', (e) => {
    if (e.target.closest?.('select, input, textarea')) return;

    if (e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      acoes.pausa();
      return;
    }
    if (acoes.correndo()) {
      if (TECLAS_PULO.has(e.code)) {
        e.preventDefault();
        if (!e.repeat) acoes.pular();
      } else if (TECLAS_DESLIZE.has(e.code)) {
        e.preventDefault();
        if (!e.repeat) acoes.deslizar();
      }
      return;
    }
    if (acoes.emQuestao() && !e.repeat) {
      if (e.code in TECLAS_ALTERNATIVA) {
        e.preventDefault();
        acoes.alternativa(TECLAS_ALTERNATIVA[e.code]);
      } else if (e.code === 'KeyN') {
        e.preventDefault();
        acoes.naoSei();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (TECLAS_PULO.has(e.code)) acoes.soltarPulo();
  });

  // Toque: metade esquerda pula (segurar = pulo alto); deslizar o dedo para baixo desliza.
  // Mouse: clique em qualquer lugar da cena pula.
  let toque = null;

  superficie.addEventListener('pointerdown', (e) => {
    if (e.target.closest(SELETOR_UI)) return;
    if (!acoes.correndo()) return;
    const r = superficie.getBoundingClientRect();
    toque = { id: e.pointerId, y: e.clientY, altura: r.height, gesto: false, pulou: false };
    if (e.pointerType === 'mouse' || e.clientX - r.left < r.width / 2) {
      acoes.pular();
      toque.pulou = true;
    }
  });

  superficie.addEventListener('pointermove', (e) => {
    if (!toque || toque.id !== e.pointerId || toque.gesto) return;
    const dy = e.clientY - toque.y;
    const limiar = toque.altura * 0.06;
    if (dy > limiar) {
      acoes.deslizar();
      toque.gesto = true;
    } else if (dy < -limiar && !toque.pulou) {
      acoes.pular();
      toque.pulou = true;
      toque.gesto = true;
    }
  });

  const fimToque = (e) => {
    if (!toque || toque.id !== e.pointerId) return;
    if (toque.pulou) acoes.soltarPulo();
    toque = null;
  };
  superficie.addEventListener('pointerup', fimToque);
  superficie.addEventListener('pointercancel', fimToque);
}
