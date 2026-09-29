// Fôlego: a distância entre aluno e professor (0 a 100).
import { CONFIG } from '../config.js';

export function alterarFolego(estado, delta) {
  estado.folego = Math.max(0, Math.min(100, estado.folego + delta));
}

// O professor nunca desiste: o Fôlego cai devagar enquanto se corre.
export function atualizarDeriva(estado, dt) {
  const { intervaloDeriva, deriva } = CONFIG.folego;
  estado.acumuladoDeriva += dt;
  while (estado.acumuladoDeriva >= intervaloDeriva) {
    estado.acumuladoDeriva -= intervaloDeriva;
    alterarFolego(estado, -deriva);
  }
}

export function zonaDoFolego(folego) {
  if (folego > CONFIG.folego.zonaTranquilo) return 'tranquilo';
  if (folego >= CONFIG.folego.zonaPerigo) return 'alerta';
  return 'perigo';
}
