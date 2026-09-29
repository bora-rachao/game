// Obstáculos do cenário escolar e geração por blocos de percurso pré-desenhados.
import { CONFIG } from '../config.js';

// Alturas em metros acima do chão. "acao" documenta como evitar.
// Obstáculos móveis têm "velocidade" (m/s na direção do aluno) e só começam a se mover
// quando entram na distância de ativação, para chegarem de forma previsível.
export const TIPOS = {
  mochila:     { largura: 0.8, y0: 0,    y1: 0.6,  acao: 'pular' },
  carrinho:    { largura: 1.4, y0: 0,    y1: 1.0,  acao: 'pular alto' },
  livros:      { largura: 1.0, y0: 0,    y1: 1.05, acao: 'pular alto' },
  faixa:       { largura: 1.2, y0: 1.0,  y1: 3.2,  acao: 'deslizar' },
  armario:     { largura: 0.9, y0: 1.0,  y1: 2.6,  acao: 'deslizar' },
  molhado:     { largura: 3.0, y0: 0,    y1: 0.05, acao: 'pular ou atravessar devagar', molhado: true },
  aviaoBaixo:  { largura: 0.9, y0: 0.25, y1: 0.6,  acao: 'pular', velocidade: 5, aviao: true },
  aviaoCabeca: { largura: 0.9, y0: 1.25, y1: 1.6,  acao: 'deslizar', velocidade: 5, aviao: true },
  aviaoAlto:   { largura: 0.9, y0: 2.2,  y1: 2.55,  acao: 'nada: passa por cima', velocidade: 5, aviao: true, inofensivo: true },
  cadeira:     { largura: 1.1, y0: 0,    y1: 1.0,  acao: 'pular alto', velocidade: 3 },
  bola:        { largura: 0.75, y0: 0,   y1: 0.75,  acao: 'pular quando ela estiver baixa ou deslizar quando estiver alta', velocidade: 2, quique: { altura: 2.0, periodo: 0.9 } },
};

// Blocos de percurso. Os deslocamentos indicam onde cada obstáculo CHEGA ao aluno,
// inclusive os móveis, então o ritmo do bloco é o mesmo de um bloco parado.
const BLOCOS = [
  // dificuldade 1: um obstáculo por vez
  { dif: 1, comprimento: 14, itens: [['mochila', 8]] },
  { dif: 1, comprimento: 16, itens: [['faixa', 9]] },
  { dif: 1, comprimento: 18, itens: [['molhado', 7]] },
  { dif: 1, comprimento: 16, itens: [['armario', 8]] },
  { dif: 1, comprimento: 16, itens: [['aviaoBaixo', 9]] },
  { dif: 1, comprimento: 16, itens: [['aviaoCabeca', 9]] },
  { dif: 1, comprimento: 16, itens: [['livros', 8]] },
  { dif: 1, comprimento: 14, itens: [['aviaoAlto', 7]] },

  // dificuldade 2: pares e leitura de altura
  { dif: 2, comprimento: 18, itens: [['mochila', 5], ['mochila', 13]] },
  { dif: 2, comprimento: 18, itens: [['carrinho', 9]] },
  { dif: 2, comprimento: 18, itens: [['armario', 5], ['mochila', 13]] },
  { dif: 2, comprimento: 20, itens: [['faixa', 5], ['faixa', 14]] },
  { dif: 2, comprimento: 18, itens: [['cadeira', 10]] },
  { dif: 2, comprimento: 18, itens: [['aviaoCabeca', 6], ['mochila', 14]] },
  { dif: 2, comprimento: 20, itens: [['aviaoBaixo', 5], ['aviaoAlto', 10], ['aviaoCabeca', 16]] },
  { dif: 2, comprimento: 18, itens: [['livros', 5], ['faixa', 13]] },

  // dificuldade 3: sequências rápidas e obstáculos com timing
  { dif: 3, comprimento: 20, itens: [['mochila', 4], ['faixa', 10], ['carrinho', 16]] },
  { dif: 3, comprimento: 18, itens: [['molhado', 3], ['armario', 11]] },
  { dif: 3, comprimento: 18, itens: [['carrinho', 5], ['faixa', 12]] },
  { dif: 3, comprimento: 16, itens: [['bola', 9]] },
  { dif: 3, comprimento: 20, itens: [['aviaoBaixo', 4], ['aviaoCabeca', 10], ['aviaoBaixo', 16]] },
  { dif: 3, comprimento: 20, itens: [['cadeira', 5], ['aviaoCabeca', 13], ['aviaoAlto', 17]] },
  { dif: 3, comprimento: 22, itens: [['carrinho', 5], ['aviaoCabeca', 12], ['mochila', 18]] },
  { dif: 3, comprimento: 20, itens: [['livros', 5], ['aviaoBaixo', 11], ['armario', 17]] },
];

function sortearDificuldade(pesos) {
  const total = Object.values(pesos).reduce((a, b) => a + b, 0) || 1;
  const r = Math.random() * total;
  let acumulado = 0;
  for (const [dif, peso] of Object.entries(pesos)) {
    acumulado += peso;
    if (r < acumulado) return Number(dif);
  }
  return 1;
}

function sortearBloco(pesos, anterior) {
  const dif = sortearDificuldade(pesos);
  let candidatos = BLOCOS.filter((b) => b.dif === dif && b !== anterior);
  if (!candidatos.length) candidatos = BLOCOS.filter((b) => b.dif === dif);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

// A dificuldade dos blocos cresce do início ao fim da fase (blocos → blocosFim).
function pesosNoPonto(fase, progresso) {
  const inicio = fase.blocos;
  const fim = fase.blocosFim ?? fase.blocos;
  const t = Math.max(0, Math.min(1, progresso));
  const pesos = {};
  for (const dif of new Set([...Object.keys(inicio), ...Object.keys(fim)])) {
    pesos[dif] = (inicio[dif] ?? 0) * (1 - t) + (fim[dif] ?? 0) * t;
  }
  return pesos;
}

// Zonas livres: começo, final e os trechos em volta de cada questão.
export function criarGerador(fase, pontosQuestao, comprimento) {
  const { zonaLivreAntes, zonaLivreDepois } = CONFIG.questoes;
  const zonas = pontosQuestao.map((p) => [p - zonaLivreAntes, p + zonaLivreDepois]);
  zonas.push([-Infinity, CONFIG.corrida.inicioLivre]);
  zonas.push([comprimento - CONFIG.corrida.finalLivre, Infinity]);
  return { proximo: CONFIG.corrida.inicioLivre, zonas, fase, comprimento, anterior: null };
}

export function criarObstaculo(tipo, x) {
  const t = TIPOS[tipo];
  return { tipo, x, y0: t.y0, y1: t.y1, ativo: false, inicio: 0, atingido: false, resolvido: false };
}

// velocidade: velocidade atual do aluno, usada para posicionar os móveis
// de modo que cheguem no ponto indicado pelo bloco.
export function gerarAte(gerador, obstaculos, limite, velocidade) {
  const ativacao = CONFIG.corrida.distanciaAtivacao;
  while (gerador.proximo < limite) {
    const pesos = pesosNoPonto(gerador.fase, gerador.proximo / gerador.comprimento);
    const bloco = sortearBloco(pesos, gerador.anterior);
    gerador.anterior = bloco;
    for (const [tipo, deslocamento] of bloco.itens) {
      const t = TIPOS[tipo];
      const chegada = gerador.proximo + deslocamento;
      const fim = chegada + t.largura;
      if (gerador.zonas.some(([a, b]) => fim > a && chegada < b)) continue;
      const u = t.velocidade ?? 0;
      const x = u ? chegada + (ativacao * u) / (velocidade + u) : chegada;
      obstaculos.push(criarObstaculo(tipo, x));
    }
    gerador.proximo += bloco.comprimento;
  }
}

// Move os obstáculos móveis que já entraram na distância de ativação.
export function moverObstaculos(obstaculos, distancia, dt, tempo) {
  const ativacao = CONFIG.corrida.distanciaAtivacao;
  for (const o of obstaculos) {
    const t = TIPOS[o.tipo];
    if (!t.velocidade) continue;
    if (!o.ativo) {
      if (o.x - distancia > ativacao) continue;
      o.ativo = true;
      o.inicio = tempo;
    }
    o.x -= t.velocidade * dt;
    if (t.quique) {
      const fase = ((tempo - o.inicio) / t.quique.periodo) * Math.PI;
      const h = t.quique.altura * Math.abs(Math.sin(fase));
      o.y0 = h;
      o.y1 = h + (t.y1 - t.y0);
    }
  }
}

export function removerObstaculosAtras(obstaculos, limite) {
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    const o = obstaculos[i];
    if (o.x + TIPOS[o.tipo].largura < limite) obstaculos.splice(i, 1);
  }
}

export function removerObstaculosEntre(obstaculos, inicio, fim) {
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    const o = obstaculos[i];
    if (o.x + TIPOS[o.tipo].largura > inicio && o.x < fim) obstaculos.splice(i, 1);
  }
}

// Retorna o que aconteceu neste passo: colisão, escorregão e obstáculos evitados.
export function verificarObstaculos(obstaculos, caixa, podeColidir) {
  const r = { colidiu: false, escorregou: false, evitados: 0 };
  for (const o of obstaculos) {
    const t = TIPOS[o.tipo];
    const x0 = o.x;
    const x1 = o.x + t.largura;
    if (!o.resolvido && x1 < caixa.x0) {
      o.resolvido = true;
      if (!o.atingido && !t.inofensivo) r.evitados++;
      continue;
    }
    if (o.atingido || o.resolvido || t.inofensivo) continue;
    const sobrepoe = caixa.x1 > x0 && caixa.x0 < x1 && caixa.y1 > o.y0 && caixa.y0 < o.y1;
    if (!sobrepoe) continue;
    o.atingido = true;
    if (t.molhado) r.escorregou = true;
    else if (podeColidir) r.colidiu = true;
  }
  return r;
}
