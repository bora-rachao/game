// Desenha a cena no canvas 2D: corredor, obstáculos, portas, aluno e professor.
// Só lê o estado; nunca o altera.
import { CONFIG } from '../config.js';
import { TIPOS } from '../game/obstaculos.js';
import { restante } from '../game/questoes.js';
import { zonaDoFolego } from '../game/perseguicao.js';

const { largura: L, altura: A, chaoY: CHAO, alunoX: AX, pxPorMetro: PX } = CONFIG.tela;
const FONTE = "'Nunito', ui-rounded, 'Segoe UI', system-ui, sans-serif";

const C = {
  tinta: '#1E2433', teto: '#FBE7A6', parede: '#FFD35C', barrado: '#F4B942', rodape: '#5B6B8C',
  piso: '#C98B55', pisoEscuro: '#B3743F', luz: '#FFFBEA',
  lousa: '#2F5D50', madeira: '#8C5A3C', porta: '#B9784A', giz: '#F4F1E6', ceu: '#9FD3EE',
  armario: '#4A8FD9', armarioEscuro: '#3A74B5',
  pular: '#F28C28', pularEscuro: '#C96A12', deslizar: '#7B5CD6', agua: '#7CC6F0',
  papel: '#FFFDF6', metal: '#A7B1BD',
  pele: '#F2C29B', cabelo: '#3B2A20', camiseta: '#2EC4B6', mochila: '#FF5D5D', calca: '#3B4A8C', tenis: '#FFFFFF',
  paleto: '#8C5A3C', calcaProf: '#5A5F73', gravata: '#E23B3B', grisalho: '#D0D0D0',
  verde: '#2E9E62', vermelho: '#D63C3C', estrela: '#FFE066',
  bola: '#E8773A', livro1: '#E85D75', livro2: '#3AA4D8', livro3: '#F2B632', cadeira: '#3C4660',
};

// Cor do código de ação: laranja = pular, roxo = deslizar.
function corDaAcao(tipo) {
  if (['aviaoCabeca', 'faixa', 'armario'].includes(tipo)) return C.deslizar;
  if (tipo === 'aviaoAlto') return null;
  return C.pular;
}
const FRASES_LOUSA = ['papel + contexto', 'tarefa + formato', 'seja específico!', 'dê exemplos', 'confira as fontes'];

// ---------- Primitivas ----------

function caixa(ctx, x, y, w, h, r, cor, contorno = true) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (cor) { ctx.fillStyle = cor; ctx.fill(); }
  if (contorno) { ctx.lineWidth = 3; ctx.strokeStyle = C.tinta; ctx.stroke(); }
}

function circulo(ctx, x, y, r, cor, contorno = true) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (cor) { ctx.fillStyle = cor; ctx.fill(); }
  if (contorno) { ctx.lineWidth = 3; ctx.strokeStyle = C.tinta; ctx.stroke(); }
}

// Braço ou perna: traço grosso com contorno.
function membro(ctx, x1, y1, x2, y2, cor, largura = 7) {
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = C.tinta;
  ctx.lineWidth = largura + 5;
  ctx.stroke();
  ctx.strokeStyle = cor;
  ctx.lineWidth = largura;
  ctx.stroke();
}

function linha(ctx, x1, y1, x2, y2, cor = C.tinta, largura = 3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = cor;
  ctx.lineWidth = largura;
  ctx.stroke();
}

// Repete um elemento ao longo da tela com parallax.
function camada(deslocamento, espaco, desenhar) {
  const inicio = Math.floor(deslocamento / espaco) - 1;
  for (let i = inicio; i * espaco - deslocamento < L + espaco; i++) desenhar(i * espaco - deslocamento, i);
}

const mod = (n, m) => ((n % m) + m) % m;

// ---------- Cenário ----------

function lousa(ctx, x, i) {
  caixa(ctx, x, 62, 250, 132, 8, C.madeira);
  caixa(ctx, x + 11, 73, 228, 110, 4, C.lousa, false);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = C.giz;
  ctx.font = `800 21px ${FONTE}`;
  ctx.fillText(FRASES_LOUSA[mod(i, FRASES_LOUSA.length)], x + 26, 118);
  ctx.beginPath();
  ctx.moveTo(x + 28, 140);
  ctx.bezierCurveTo(x + 80, 130, x + 120, 150, x + 170, 138);
  ctx.strokeStyle = C.giz;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.globalAlpha = 1;
  caixa(ctx, x + 22, 192, 206, 8, 3, C.madeira);
}

function janela(ctx, x) {
  caixa(ctx, x + 40, 60, 170, 138, 6, C.ceu);
  ctx.fillStyle = '#fff';
  for (const [dx, dy, r] of [[90, 110, 16], [110, 104, 20], [132, 112, 15]]) {
    ctx.beginPath(); ctx.arc(x + dx, dy, r, 0, Math.PI * 2); ctx.fill();
  }
  linha(ctx, x + 125, 60, x + 125, 198);
  linha(ctx, x + 40, 129, x + 210, 129);
  caixa(ctx, x + 32, 196, 186, 8, 3, C.papel);
}

function armarios(ctx, x) {
  for (let k = 0; k < 3; k++) {
    const ax = x + k * 52;
    caixa(ctx, ax, CHAO - 164, 50, 150, 4, k === 1 ? C.armarioEscuro : C.armario);
    for (let v = 0; v < 3; v++) linha(ctx, ax + 12, CHAO - 150 + v * 7, ax + 38, CHAO - 150 + v * 7, C.tinta, 2);
    caixa(ctx, ax + 38, CHAO - 96, 5, 16, 2, C.papel, false);
  }
}

function fundo(ctx, dist) {
  const px = dist * PX;
  ctx.fillStyle = C.parede;
  ctx.fillRect(0, 0, L, CHAO);
  ctx.fillStyle = C.teto;
  ctx.fillRect(0, 0, L, 34);
  linha(ctx, 0, 34, L, 34);
  ctx.fillStyle = C.barrado;
  ctx.fillRect(0, CHAO - 120, L, 120);
  linha(ctx, 0, CHAO - 120, L, CHAO - 120, C.tinta, 2);

  camada(px * 0.5, 300, (x) => caixa(ctx, x + 60, 8, 120, 12, 6, C.luz));
  camada(px * 0.35, 440, (x, i) => (mod(i, 2) === 0 ? lousa(ctx, x, i) : janela(ctx, x)));
  camada(px * 0.7, 380, (x) => armarios(ctx, x + 40));

  ctx.fillStyle = C.rodape;
  ctx.fillRect(0, CHAO - 12, L, 12);
  linha(ctx, 0, CHAO - 12, L, CHAO - 12, C.tinta, 2);

  ctx.fillStyle = C.piso;
  ctx.fillRect(0, CHAO, L, A - CHAO);
  camada(px, 96, (x) => linha(ctx, x, CHAO + 2, x - 36, A, C.pisoEscuro, 3));
  linha(ctx, 0, CHAO + 34, L, CHAO + 34, C.pisoEscuro, 2);
  linha(ctx, 0, CHAO, L, CHAO, C.tinta, 3);
}

function portao(ctx, x) {
  caixa(ctx, x, CHAO - 210, 18, 210, 4, C.verde);
  caixa(ctx, x + 170, CHAO - 210, 18, 210, 4, C.verde);
  for (let b = 1; b < 8; b++) linha(ctx, x + b * 22, CHAO - 180, x + b * 22, CHAO, C.tinta, 4);
  linha(ctx, x + 18, CHAO - 180, x + 170, CHAO - 180, C.tinta, 4);
  caixa(ctx, x + 24, CHAO - 250, 140, 36, 8, C.papel);
  ctx.fillStyle = C.tinta;
  ctx.font = `900 22px ${FONTE}`;
  ctx.textAlign = 'center';
  ctx.fillText('Saída', x + 94, CHAO - 224);
  ctx.textAlign = 'left';
}

// ---------- Obstáculos ----------

function sombra(ctx, cx, largura, altura) {
  const escala = Math.max(0.35, 1 - altura / 3);
  ctx.beginPath();
  ctx.ellipse(cx, CHAO + 5, (largura / 2) * escala, 5 * escala, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(30, 36, 51, 0.22)';
  ctx.fill();
}

function aviao(ctx, o, x, w, yt, yb, tempo, reduzir) {
  const cy = (yt + yb) / 2 + (reduzir ? 0 : Math.sin(tempo * 9 + o.x) * 2);
  const cor = corDaAcao(o.tipo);
  const ww = w + 14;
  sombra(ctx, x + w / 2, ww, o.y0);
  if (o.ativo) {
    for (let k = 0; k < 3; k++) linha(ctx, x + ww + 6, cy - 8 + k * 8, x + ww + 22 + k * 6, cy - 8 + k * 8, C.tinta, 2);
  }
  // corpo
  ctx.beginPath();
  ctx.moveTo(x - 6, cy);
  ctx.lineTo(x + ww, cy - 16);
  ctx.lineTo(x + ww - 8, cy);
  ctx.lineTo(x + ww, cy + 10);
  ctx.closePath();
  ctx.fillStyle = C.papel;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.tinta;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // asa com a cor da ação
  if (cor) {
    ctx.beginPath();
    ctx.moveTo(x + ww * 0.4, cy - 7);
    ctx.lineTo(x + ww, cy - 16);
    ctx.lineTo(x + ww - 8, cy);
    ctx.closePath();
    ctx.fillStyle = cor;
    ctx.fill();
    ctx.stroke();
  }
  linha(ctx, x - 4, cy, x + ww - 8, cy, C.tinta, 2);
}

function obstaculo(ctx, o, dist, tempo, reduzir) {
  const t = TIPOS[o.tipo];
  const x = AX + (o.x - dist) * PX;
  const w = t.largura * PX;
  if (x > L + 60 || x + w < -60) return;
  const yt = CHAO - o.y1 * PX;
  const yb = CHAO - o.y0 * PX;

  ctx.save();
  if (o.atingido && !t.molhado) ctx.globalAlpha = 0.5;

  switch (o.tipo) {
    case 'mochila': {
      caixa(ctx, x, yt, w, yb - yt, 10, C.pular);
      caixa(ctx, x + 5, yt + 4, w - 10, 10, 5, C.pularEscuro);
      caixa(ctx, x + 9, yt + (yb - yt) * 0.55, w - 18, 7, 3, C.papel);
      break;
    }
    case 'carrinho': {
      const h = yb - yt;
      linha(ctx, x + w * 0.86, yt + 12, x + w, yt - 12, C.tinta, 4);
      caixa(ctx, x + w * 0.1, yt + 10, w * 0.78, h - 26, 6, C.metal);
      caixa(ctx, x + w * 0.22, yt, w * 0.32, 14, 4, C.agua);
      caixa(ctx, x, yb - 22, w, 9, 4, C.pular);
      circulo(ctx, x + w * 0.2, yb - 6, 6, C.tinta);
      circulo(ctx, x + w * 0.8, yb - 6, 6, C.tinta);
      break;
    }
    case 'faixa': {
      linha(ctx, x + 8, 34, x + 8, yt, C.tinta, 2);
      linha(ctx, x + w - 8, 34, x + w - 8, yt, C.tinta, 2);
      caixa(ctx, x, yt, w, yb - yt, 6, C.papel);
      caixa(ctx, x, yb - 16, w, 16, 5, C.deslizar);
      const cx = x + w / 2;
      const cy = yt + (yb - yt - 16) / 2;
      ctx.strokeStyle = C.deslizar;
      ctx.lineWidth = 2;
      for (const ang of [0, Math.PI / 3, -Math.PI / 3]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, 16, 6, ang, 0, Math.PI * 2);
        ctx.stroke();
      }
      circulo(ctx, cx, cy, 4, C.deslizar, false);
      break;
    }
    case 'armario': {
      linha(ctx, x - 8, yt + 6, x, yt + 6, C.tinta, 3);
      caixa(ctx, x, yt, w, yb - yt, 5, C.armario);
      for (let v = 0; v < 3; v++) linha(ctx, x + 8, yt + 12 + v * 7, x + w - 8, yt + 12 + v * 7, C.tinta, 2);
      caixa(ctx, x, yb - 14, w, 14, 4, C.deslizar);
      break;
    }
    case 'aviaoBaixo':
    case 'aviaoCabeca':
    case 'aviaoAlto':
      aviao(ctx, o, x, w, yt, yb, tempo, reduzir);
      break;
    case 'livros': {
      const h = (yb - yt) / 3;
      caixa(ctx, x + 4, yt, w - 10, h, 3, C.livro1);
      caixa(ctx, x, yt + h, w, h, 3, C.livro2);
      caixa(ctx, x + 2, yt + 2 * h, w - 4, h, 3, C.livro3);
      caixa(ctx, x - 2, yb - 5, w + 4, 5, 2, C.pular);
      break;
    }
    case 'cadeira': {
      if (o.ativo) for (let k = 0; k < 2; k++) linha(ctx, x + w + 6, yb - 30 + k * 12, x + w + 22, yb - 30 + k * 12, C.tinta, 2);
      caixa(ctx, x + w * 0.55, yt, w * 0.4, (yb - yt) * 0.55, 6, C.cadeira);
      caixa(ctx, x + 2, yt + (yb - yt) * 0.45, w - 4, 10, 4, C.cadeira);
      linha(ctx, x + w / 2, yt + (yb - yt) * 0.45 + 10, x + w / 2, yb - 8, C.tinta, 4);
      caixa(ctx, x, yb - 10, w, 5, 2, C.pular);
      circulo(ctx, x + 5, yb - 3, 4, C.tinta);
      circulo(ctx, x + w - 5, yb - 3, 4, C.tinta);
      break;
    }
    case 'bola': {
      const r = w / 2;
      const cx = x + r;
      const cy = yt + r;
      sombra(ctx, cx, w + 6, o.y0);
      circulo(ctx, cx, cy, r, C.bola);
      ctx.strokeStyle = C.tinta;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx - r * 1.1, cy, r * 0.8, -0.9, 0.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + r * 1.1, cy, r * 0.8, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke();
      break;
    }
    case 'molhado': {
      ctx.beginPath();
      ctx.ellipse(x + w / 2, CHAO + 8, w / 2, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = C.agua;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = C.tinta;
      ctx.stroke();
      // placa "piso molhado"
      const px = x - 18;
      ctx.beginPath();
      ctx.moveTo(px, CHAO - 44);
      ctx.lineTo(px + 16, CHAO);
      ctx.lineTo(px - 16, CHAO);
      ctx.closePath();
      ctx.fillStyle = C.parede;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = C.tinta;
      ctx.font = `900 18px ${FONTE}`;
      ctx.textAlign = 'center';
      ctx.fillText('!', px, CHAO - 10);
      ctx.textAlign = 'left';
      break;
    }
  }
  ctx.restore();
}

// Aviso "!" na borda direita para obstáculos móveis que estão chegando.
function avisos(ctx, estado, reduzir) {
  const limite = L + CONFIG.corrida.avisoAntes * PX;
  const pulso = reduzir ? 1 : 1 + Math.sin(estado.tempo * 12) * 0.12;
  for (const o of estado.obstaculos) {
    const t = TIPOS[o.tipo];
    if (!t.velocidade || t.inofensivo || o.resolvido) continue;
    const x = AX + (o.x - estado.distancia) * PX;
    if (x < L - 10 || x > limite) continue;
    const y = Math.max(70, CHAO - ((o.y0 + o.y1) / 2) * PX);
    ctx.save();
    ctx.translate(L - 26, y);
    ctx.scale(pulso, pulso);
    circulo(ctx, 0, 0, 16, corDaAcao(o.tipo) ?? C.pular);
    ctx.fillStyle = '#fff';
    ctx.font = `900 20px ${FONTE}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 0, 1);
    ctx.restore();
  }
}

// ---------- Portas das questões ----------

function portas(ctx, estado, reduzir) {
  const q = estado.questao;
  const fb = estado.feedback;
  const n = q.alternativas.length;
  const largura = 104;
  const altura = 172;
  const espaco = 132;
  const x0 = L - 36 - n * espaco + (espaco - largura);
  const pulso = reduzir || fb ? 0 : Math.sin(estado.tempo * 5) * 2;

  for (let i = 0; i < n; i++) {
    const x = x0 + i * espaco;
    const y = CHAO - 10 - altura - pulso;
    if (fb) {
      const cor = i === q.corretaExibida ? C.verde : i === fb.escolha ? C.vermelho : null;
      if (cor) caixa(ctx, x - 16, y - 16, largura + 32, altura + 20, 10, cor, false);
    }
    caixa(ctx, x - 8, y - 8, largura + 16, altura + 8, 6, C.madeira);
    caixa(ctx, x, y, largura, altura, 4, C.porta);
    caixa(ctx, x + 22, y + 16, largura - 44, 40, 4, C.ceu);
    caixa(ctx, x + largura / 2 - 24, y + 74, 48, 42, 8, C.papel);
    ctx.fillStyle = C.tinta;
    ctx.font = `900 30px ${FONTE}`;
    ctx.textAlign = 'center';
    ctx.fillText('ABCD'[i], x + largura / 2, y + 106);
    ctx.textAlign = 'left';
    circulo(ctx, x + largura - 16, y + altura / 2 + 30, 5, C.estrela);
  }
}

// ---------- Personagens ----------

function aluno(ctx, estado, reduzir) {
  const a = estado.aluno;
  const base = CHAO - a.y * PX;
  const fase = estado.distancia * 1.9;
  const s = Math.sin(fase);

  ctx.save();
  ctx.translate(AX, base);
  if (a.invulneravel > 0 && !reduzir && Math.floor(estado.tempo * 14) % 2 === 0) ctx.globalAlpha = 0.45;
  if (a.tropeco > 0) ctx.rotate(0.22);

  if (estado.efeitos?.sprint > 0) {
    for (let k = 0; k < 3; k++) linha(ctx, -34 - k * 6, -52 + k * 16, -70 - k * 10, -52 + k * 16, C.tinta, 3);
  }

  if (a.deslizando > 0) {
    membro(ctx, -4, -10, 26, -6, C.calca, 7);
    caixa(ctx, 24, -12, 13, 9, 3, C.tenis);
    caixa(ctx, -40, -30, 14, 22, 5, C.mochila);
    caixa(ctx, -30, -28, 30, 20, 8, C.camiseta);
    circulo(ctx, -34, -34, 11, C.pele);
    ctx.beginPath();
    ctx.arc(-34, -36, 11, Math.PI, Math.PI * 2);
    ctx.fillStyle = C.cabelo;
    ctx.fill();
    circulo(ctx, -29, -34, 2, C.tinta, false);
  } else {
    if (!a.noChao) {
      membro(ctx, 0, -26, 12, -14, C.calca, 7);
      membro(ctx, 0, -26, -10, -8, C.calca, 7);
    } else {
      membro(ctx, 0, -26, -s * 13, 0, C.calca, 7);
      membro(ctx, 0, -26, s * 13, 0, C.calca, 7);
      caixa(ctx, s * 13 - 4, -5, 14, 8, 3, C.tenis);
      caixa(ctx, -s * 13 - 4, -5, 14, 8, 3, C.tenis);
    }
    caixa(ctx, -20, -54, 14, 26, 5, C.mochila);
    membro(ctx, -2, -46, -2 + s * 10, -32, C.pele, 5);
    caixa(ctx, -10, -52, 22, 28, 8, C.camiseta);
    const bracoY = a.noChao ? -32 : -60;
    membro(ctx, 4, -46, 6 - s * 10, bracoY, C.pele, 5);
    circulo(ctx, 2, -62, 12, C.pele);
    ctx.beginPath();
    ctx.arc(2, -64, 12, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fillStyle = C.cabelo;
    ctx.fill();
    circulo(ctx, 8, -63, 2, C.tinta, false);
    ctx.beginPath();
    ctx.arc(6, -58, 4, 0.2, Math.PI - 0.6);
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.tinta;
    ctx.stroke();
  }
  ctx.restore();
}

function professor(ctx, x, estado, { procurando, segurando }) {
  const passo = procurando ? Math.sin(estado.tempo * 6) : Math.sin(estado.distancia * 1.7 + 1.3);
  const tropeco = estado.efeitos?.profTropeco ?? 0;

  ctx.save();
  ctx.translate(x, CHAO);
  if (tropeco > 0) ctx.rotate(0.3 * Math.min(1, tropeco));

  membro(ctx, 0, -32, passo * 15, 0, C.calcaProf, 8);
  membro(ctx, 0, -32, -passo * 15, 0, C.calcaProf, 8);
  caixa(ctx, passo * 15 - 5, -6, 17, 8, 3, C.tinta, false);
  caixa(ctx, -passo * 15 - 5, -6, 17, 8, 3, C.tinta, false);

  membro(ctx, -4, -58, -6 - passo * 10, -38, C.paleto, 7);
  caixa(ctx, -15, -68, 32, 40, 9, C.paleto);
  ctx.beginPath();
  ctx.moveTo(-2, -68);
  ctx.lineTo(8, -54);
  ctx.lineTo(16, -68);
  ctx.closePath();
  ctx.fillStyle = C.papel;
  ctx.fill();
  ctx.save();
  ctx.translate(8, -58);
  ctx.rotate(0.35);
  caixa(ctx, -3, 0, 7, 20, 2, C.gravata);
  ctx.restore();

  // braço da frente: segurando a mochila, lanterna ou tablet
  if (segurando) {
    membro(ctx, 6, -60, 44, -54, C.paleto, 7);
  } else if (procurando) {
    membro(ctx, 6, -60, 30, -52, C.paleto, 7);
    caixa(ctx, 28, -58, 16, 10, 3, C.tinta, false);
  } else {
    membro(ctx, 6, -60, 16 + passo * 10, -40, C.paleto, 7);
    caixa(ctx, 12 + passo * 10, -50, 13, 17, 2, C.tinta, false);
  }

  circulo(ctx, 4, -82, 15, C.pele);
  ctx.fillStyle = C.grisalho;
  ctx.beginPath(); ctx.ellipse(-8, -80, 5, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.ellipse(-1, -92, 5, 3, -0.4, 0, Math.PI * 2); ctx.fill();
  circulo(ctx, 11, -83, 7, 'rgba(255,255,255,0.75)');
  circulo(ctx, 25, -83, 7, 'rgba(255,255,255,0.75)');
  circulo(ctx, 12, -83, 2, C.tinta, false);
  circulo(ctx, 26, -83, 2, C.tinta, false);
  ctx.beginPath(); ctx.ellipse(16, -72, 4, 3, 0, 0, Math.PI * 2); ctx.fillStyle = C.tinta; ctx.fill();

  if (tropeco > 0) {
    for (let k = 0; k < 3; k++) {
      const ang = estado.tempo * 6 + k * 2.1;
      circulo(ctx, 4 + Math.cos(ang) * 20, -106 + Math.sin(ang) * 6, 4, C.estrela, true);
    }
  }
  ctx.restore();
}

function esconderijo(ctx) {
  caixa(ctx, AX - 26, CHAO - 44, 14, 26, 5, C.mochila);
  caixa(ctx, AX - 14, CHAO - 178, 72, 172, 5, C.armario);
  for (let v = 0; v < 4; v++) linha(ctx, AX, CHAO - 160 + v * 8, AX + 44, CHAO - 160 + v * 8, C.tinta, 2);
  caixa(ctx, AX + 44, CHAO - 104, 6, 18, 2, C.papel, false);
}

function lanterna(ctx, x) {
  const ox = x + 44;
  const oy = CHAO - 54;
  ctx.beginPath();
  ctx.moveTo(ox, oy - 4);
  ctx.lineTo(ox + 230, oy - 70);
  ctx.lineTo(ox + 230, oy + 50);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 248, 200, 0.45)';
  ctx.fill();
}

function vinheta(ctx, t, reduzir) {
  const a = reduzir ? 0.28 : 0.22 + 0.12 * Math.sin(t * 6);
  const g = ctx.createRadialGradient(L / 2, A / 2, A * 0.45, L / 2, A / 2, L * 0.62);
  g.addColorStop(0, 'rgba(214, 60, 60, 0)');
  g.addColorStop(1, `rgba(214, 60, 60, ${a.toFixed(3)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, L, A);
}

// ---------- Renderizador ----------

export function criarRenderizador(canvas) {
  const ctx = canvas.getContext('2d');
  let profX = -140;

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(L * dpr);
    canvas.height = Math.round(A * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ajustar();
  window.addEventListener('resize', ajustar);

  function desenhar(estado, opcoes) {
    const reduzir = !!opcoes?.reduzirMovimento;
    const q = estado.questao;
    const fb = estado.feedback;
    const recuperando = estado.modo === 'recuperacao' || (estado.modo === 'feedback' && fb?.recuperacao);
    const escondido = !!q && !recuperando && q.formato === 'esconderijo'
      && (estado.modo === 'questao' || estado.modo === 'feedback');

    ctx.clearRect(0, 0, L, A);
    ctx.save();
    if (!reduzir && estado.efeitos?.tremor > 0) {
      const m = estado.efeitos.tremor * 16;
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }

    fundo(ctx, estado.distancia);
    const faltam = estado.comprimento - estado.distancia;
    if (faltam < 30) portao(ctx, AX + faltam * PX);
    for (const o of estado.obstaculos) obstaculo(ctx, o, estado.distancia, estado.tempo, reduzir);
    if (q && q.formato === 'portas' && !recuperando) portas(ctx, estado, reduzir);

    // Posição do professor: pelo Fôlego, pela lanterna ou segurando o aluno.
    let alvo;
    if (recuperando) alvo = AX - 58;
    else if (escondido) {
      const fracao = q.total === Infinity ? 0.5 : restante(q) / q.total;
      alvo = 30 + (1 - fracao) * (AX - 170);
    } else alvo = AX - 50 - estado.folego * 4.4;
    profX += (alvo - profX) * (reduzir ? 1 : 0.08);

    if (escondido) {
      lanterna(ctx, profX);
      professor(ctx, profX, estado, { procurando: true, segurando: false });
      esconderijo(ctx);
    } else {
      if (profX > -80) professor(ctx, profX, estado, { procurando: false, segurando: recuperando });
      aluno(ctx, estado, reduzir);
    }
    if (estado.modo === 'correndo') avisos(ctx, estado, reduzir);
    ctx.restore();

    if (escondido || recuperando) {
      ctx.fillStyle = 'rgba(30, 36, 51, 0.28)';
      ctx.fillRect(0, 0, L, A);
    }
    if (estado.modo !== 'demo' && zonaDoFolego(estado.folego) === 'perigo') vinheta(ctx, estado.tempo, reduzir);
  }

  return { desenhar };
}
