// Movimento do aluno: pulo (curto ou alto), deslize e queda rápida.
// Posições em metros; y = altura acima do chão.
import { CONFIG } from '../config.js';

const { gravidade, impulsoPulo, impulsoMinimo, quedaRapida, duracaoDeslize } = CONFIG.fisica;

export function criarAluno() {
  return {
    y: 0,
    vy: 0,
    noChao: true,
    deslizando: 0,
    deslizarAoPousar: false,
    tropeco: 0,
    invulneravel: 0,
  };
}

export function pular(aluno) {
  if (!aluno.noChao) return false;
  aluno.vy = impulsoPulo;
  aluno.noChao = false;
  aluno.deslizando = 0;
  aluno.deslizarAoPousar = false;
  return true;
}

// Soltar o botão cedo corta a subida: toque rápido = pulo baixo.
export function soltarPulo(aluno) {
  if (!aluno.noChao && aluno.vy > impulsoMinimo) aluno.vy = impulsoMinimo;
}

export function deslizar(aluno) {
  if (aluno.noChao) {
    aluno.deslizando = duracaoDeslize;
  } else {
    aluno.vy = Math.min(aluno.vy, -quedaRapida);
    aluno.deslizarAoPousar = true;
  }
}

export function atualizarAluno(aluno, dt) {
  if (!aluno.noChao) {
    aluno.vy -= gravidade * dt;
    aluno.y += aluno.vy * dt;
    if (aluno.y <= 0) {
      aluno.y = 0;
      aluno.vy = 0;
      aluno.noChao = true;
      if (aluno.deslizarAoPousar) {
        aluno.deslizando = duracaoDeslize;
        aluno.deslizarAoPousar = false;
      }
    }
  }
  aluno.deslizando = Math.max(0, aluno.deslizando - dt);
  aluno.tropeco = Math.max(0, aluno.tropeco - dt);
  aluno.invulneravel = Math.max(0, aluno.invulneravel - dt);
}

// Caixa de colisão em coordenadas do mundo (metros).
export function caixaAluno(aluno, xMundo) {
  const deitado = aluno.deslizando > 0;
  const largura = deitado ? CONFIG.aluno.larguraDeslize : CONFIG.aluno.largura;
  const altura = deitado ? CONFIG.aluno.alturaDeslize : CONFIG.aluno.altura;
  return {
    x0: xMundo - largura / 2,
    x1: xMundo + largura / 2,
    y0: aluno.y,
    y1: aluno.y + altura,
  };
}
