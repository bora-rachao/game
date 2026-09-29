// Regras de progresso: medalhas, recordes, desbloqueio e domínio de conceitos.
import { CONFIG } from '../config.js';

const ORDEM_MEDALHA = { bronze: 1, prata: 2, ouro: 3 };

export function calcularMedalha(resumo) {
  if (!resumo.concluiu) return null;
  const taxa = resumo.total ? resumo.acertos / resumo.total : 0;
  if (taxa >= CONFIG.medalhas.ouro && resumo.capturas === 0) return 'ouro';
  if (taxa >= CONFIG.medalhas.prata) return 'prata';
  return 'bronze';
}

export function registrarPartida(dados, resumo) {
  const fase = dados.fases[resumo.faseId] ?? { medalha: null, recorde: 0, recordeEstudo: 0 };
  const chaveRecorde = resumo.modoEstudo ? 'recordeEstudo' : 'recorde';
  const recordeAnterior = fase[chaveRecorde] ?? 0;
  const novoRecorde = resumo.pontos > recordeAnterior;
  if (novoRecorde) fase[chaveRecorde] = resumo.pontos;

  const medalha = calcularMedalha(resumo);
  if (medalha && ORDEM_MEDALHA[medalha] > (ORDEM_MEDALHA[fase.medalha] ?? 0)) fase.medalha = medalha;
  dados.fases[resumo.faseId] = fase;

  for (const h of resumo.historico) {
    const c = dados.conceitos[h.conceito] ?? { acertos: 0, erros: 0, ultimos: [] };
    const certo = h.resultado === 'certa';
    if (certo) c.acertos++;
    else c.erros++;
    c.ultimos = [...c.ultimos, certo].slice(-2);
    dados.conceitos[h.conceito] = c;
  }

  return { medalha, novoRecorde, recordeAnterior, modoEstudo: resumo.modoEstudo };
}

// Dominado: 3 acertos no total e nenhum erro nas 2 últimas vezes.
export function conceitoDominado(registro) {
  return !!registro && registro.acertos >= 3 && registro.ultimos.length === 2 && registro.ultimos.every(Boolean);
}

export function faseLiberada(dados, fases, indice) {
  if (indice === 0) return true;
  return !!dados.fases[fases[indice - 1].id]?.medalha;
}
