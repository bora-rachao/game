// HUD da partida: Fôlego, progresso até o portão, pontos e multiplicador.
import { zonaDoFolego } from '../game/perseguicao.js';
import { pontuacaoAtual, multiplicadorDaSequencia } from '../game/pontuacao.js';
import { formatarNumero } from './dom.js';

const NOMES_ZONA = { tranquilo: 'Tranquilo', alerta: 'Alerta', perigo: 'Perigo' };

export function criarHud(raiz) {
  const q = (nome) => raiz.querySelector(`[data-hud="${nome}"]`);
  const medidor = q('medidor');
  const zona = q('zona');
  const progresso = q('progresso');
  const pontos = q('pontos');
  const mult = q('mult');
  const aviso = q('aviso');
  let ultimo = {};
  let temporizador = null;

  return {
    mostrar(visivel) {
      raiz.hidden = !visivel;
      if (!visivel) {
        clearTimeout(temporizador);
        aviso.hidden = true;
        ultimo = {};
      }
    },

    atualizar(estado) {
      const f = Math.round(estado.folego);
      const z = zonaDoFolego(estado.folego);
      if (f !== ultimo.f || z !== ultimo.z) {
        ultimo.f = f;
        ultimo.z = z;
        medidor.style.setProperty('--folego', f);
        medidor.dataset.zona = z;
        medidor.setAttribute('aria-valuenow', f);
        medidor.setAttribute('aria-valuetext', `${NOMES_ZONA[z]}, ${f} de 100`);
        zona.textContent = `${NOMES_ZONA[z]} ${f}`;
      }

      const pr = Math.min(1, estado.distancia / estado.comprimento);
      if (Math.abs(pr - (ultimo.pr ?? -1)) > 0.002) {
        ultimo.pr = pr;
        progresso.style.setProperty('--progresso', pr.toFixed(3));
      }

      const pt = pontuacaoAtual(estado);
      if (pt !== ultimo.pt) {
        ultimo.pt = pt;
        pontos.textContent = formatarNumero(pt);
      }

      const m = multiplicadorDaSequencia(estado.sequencia);
      if (m !== ultimo.m) {
        ultimo.m = m;
        mult.textContent = `×${String(m).replace('.', ',')}`;
        mult.dataset.ativo = String(m > 1);
      }
    },

    aviso(texto, segundos = 3.5) {
      clearTimeout(temporizador);
      aviso.textContent = texto;
      aviso.hidden = false;
      temporizador = setTimeout(() => { aviso.hidden = true; }, segundos * 1000);
    },
  };
}
