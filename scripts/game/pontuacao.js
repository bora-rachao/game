import { CONFIG } from '../config.js';

export function multiplicadorDaSequencia(sequencia) {
  return CONFIG.multiplicadores.find((m) => sequencia >= m.min).valor;
}

export function pontosDoAcerto(dificuldade, rapido, sequencia) {
  const base = CONFIG.pontos.acerto[dificuldade];
  const bonusRapido = rapido ? CONFIG.pontos.rapido : 1;
  return Math.round(base * bonusRapido * multiplicadorDaSequencia(sequencia));
}

// Distância vale ponto por metro; o resto (obstáculos, questões, bônus) fica em estado.pontos.
export function pontuacaoAtual(estado) {
  return Math.floor(estado.distancia) * CONFIG.pontos.porMetro + estado.pontos;
}
