// Mapa de fases do capítulo, com medalhas, recordes e cadeados.
import { el, formatarNumero } from './dom.js';
import { faseLiberada } from '../dados/progresso.js';

const NOME_MEDALHA = { ouro: 'Ouro', prata: 'Prata', bronze: 'Bronze' };

export function renderizarMapa(container, conteudo, progresso) {
  const fases = conteudo.fases.fases;
  let focoDefinido = false;

  container.replaceChildren(...fases.map((fase, i) => {
    const salvo = progresso.fases[fase.id];
    const liberada = faseLiberada(progresso, fases, i);

    let acao;
    if (liberada) {
      acao = el('button', {
        type: 'button',
        class: 'botao',
        dataset: { acao: 'jogar-fase', fase: String(i) },
        text: salvo?.medalha ? 'Jogar de novo' : 'Jogar',
      });
      if (!salvo?.medalha && !focoDefinido) {
        acao.setAttribute('data-foco-inicial', '');
        focoDefinido = true;
      }
    } else {
      acao = el('p', { class: 'fase-cartao__bloqueio', text: 'Conclua a fase anterior para liberar.' });
    }

    return el('article', { class: 'fase-cartao', dataset: { liberada: String(liberada) } },
      el('p', { class: 'fase-cartao__numero', text: fase.id.replace('-', '.') }),
      el('h3', { class: 'fase-cartao__nome', text: fase.nome }),
      el('p', {
        class: 'medalha',
        dataset: { medalha: salvo?.medalha ?? 'nenhuma' },
        text: salvo?.medalha ? `Medalha ${NOME_MEDALHA[salvo.medalha]}` : 'Sem medalha',
      }),
      el('p', {
        class: 'fase-cartao__recorde',
        text: salvo?.recorde ? `Recorde: ${formatarNumero(salvo.recorde)}` : 'Ainda sem recorde',
      }),
      acao);
  }));

  if (!focoDefinido) container.querySelector('button')?.setAttribute('data-foco-inicial', '');
}
