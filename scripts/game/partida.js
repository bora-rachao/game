// Coordena uma partida: corrida, questões, consequências, captura e fim.
// Não acessa o DOM. A interface lê o estado e consome estado.eventos.
import { CONFIG } from '../config.js';
import { criarAluno, atualizarAluno, pular, soltarPulo, deslizar, caixaAluno } from './corrida.js';
import {
  TIPOS, criarGerador, gerarAte, moverObstaculos, verificarObstaculos, removerObstaculosAtras, removerObstaculosEntre,
} from './obstaculos.js';
import { alterarFolego, atualizarDeriva } from './perseguicao.js';
import { criarSeletor, prepararQuestao, restante, tempoUsado, agendarRevisao } from './questoes.js';
import { pontosDoAcerto, pontuacaoAtual, multiplicadorDaSequencia } from './pontuacao.js';

function efeitosIniciais() {
  return { tremor: 0, profTropeco: 0, sprint: 0, escorregando: 0 };
}

export function criarPartida({ fase, banco, opcoes }) {
  const comprimento = fase.comprimento;
  const pontosQuestao = [];
  for (let x = CONFIG.questoes.primeiraEm; x < comprimento - 60; x += CONFIG.questoes.intervalo) {
    pontosQuestao.push(x);
  }

  return {
    fase,
    opcoes: { ...opcoes },
    comprimento,
    modo: 'correndo', // correndo | questao | recuperacao | feedback | fim
    pausado: false,

    tempo: 0,
    tempoCorrida: 0,
    distancia: 0,
    velocidade: CONFIG.corrida.velocidadeInicial,
    velocidadeAtual: CONFIG.corrida.velocidadeInicial,

    folego: CONFIG.folego.inicial,
    acumuladoDeriva: 0,
    aluno: criarAluno(),
    obstaculos: [],
    gerador: criarGerador(fase, pontosQuestao, comprimento),
    seletor: criarSeletor(banco, fase),

    pontosQuestao,
    proximaQuestao: 0,
    questao: null,
    feedback: null,

    pontos: 0,
    sequencia: 0,
    melhorSequencia: 0,
    acertos: 0,
    total: 0,
    obstaculosEvitados: 0,
    colisoes: 0,
    capturas: 0,

    historico: [],
    revisoes: [],
    usadas: new Set(),
    tiposVistos: new Set(),
    efeitos: efeitosIniciais(),
    eventos: [],
    resumo: null,
  };
}

// ---------- Ações do jogador ----------

export function podeMover(estado) {
  return !!estado && !estado.pausado && estado.modo === 'correndo';
}

export function emQuestao(estado) {
  return !!estado && !estado.pausado && (estado.modo === 'questao' || estado.modo === 'recuperacao');
}

export function acaoPular(estado) {
  if (podeMover(estado)) pular(estado.aluno);
}

export function acaoSoltarPulo(estado) {
  if (estado) soltarPulo(estado.aluno);
}

export function acaoDeslizar(estado) {
  if (podeMover(estado)) deslizar(estado.aluno);
}

// escolha: índice da alternativa exibida, 'naoSei' ou 'tempo'
export function responder(estado, escolha) {
  if (!emQuestao(estado)) return;
  const q = estado.questao;
  if (typeof escolha === 'number' && (escolha < 0 || escolha >= q.alternativas.length)) return;

  let resultado;
  if (escolha === 'naoSei' || escolha === 'tempo') resultado = escolha;
  else resultado = escolha === q.corretaExibida ? 'certa' : 'errada';

  estado.usadas.add(q.id);
  estado.historico.push({
    id: q.id,
    conceito: q.conceito,
    resultado,
    questao: q.original,
    escolhaTexto: typeof escolha === 'number' ? q.alternativas[escolha] : null,
    recuperacao: q.recuperacao,
  });

  const fb = {
    resultado,
    escolha: typeof escolha === 'number' ? escolha : null,
    questao: q,
    recuperacao: q.recuperacao,
    rapido: false,
    deltaFolego: 0,
    pontosGanhos: 0,
    multiplicador: 1,
    bonusSequencia: false,
    fim: false,
    decorrido: 0,
  };

  if (q.recuperacao) {
    if (resultado === 'certa') {
      fb.deltaFolego = CONFIG.folego.aposRecuperacao - estado.folego;
      estado.folego = CONFIG.folego.aposRecuperacao;
    } else {
      fb.fim = true;
    }
  } else {
    aplicarConsequencia(estado, q, resultado, fb);
  }

  estado.feedback = fb;
  estado.modo = 'feedback';
  estado.eventos.push({ tipo: 'feedback', feedback: fb });
}

export function continuar(estado) {
  if (!estado || estado.pausado || estado.modo !== 'feedback') return;
  const fb = estado.feedback;
  estado.feedback = null;
  estado.questao = null;
  estado.eventos.push({ tipo: 'retomar' });

  if (fb.fim) {
    finalizar(estado, false);
    return;
  }
  estado.modo = 'correndo';
  if (estado.folego <= 0) capturar(estado);
}

// ---------- Atualização ----------

export function atualizarPartida(estado, dt) {
  if (estado.pausado || estado.modo === 'fim') return;
  estado.tempo += dt;
  for (const chave of Object.keys(estado.efeitos)) {
    estado.efeitos[chave] = Math.max(0, estado.efeitos[chave] - dt);
  }

  if (estado.modo === 'correndo') atualizarCorrida(estado, dt);
  else if (estado.modo === 'questao') atualizarQuestao(estado, dt);
  else if (estado.modo === 'feedback') atualizarFeedback(estado, dt);
  // 'recuperacao' espera a resposta, sem tempo limite.
}

function avancar(estado, dt, fator) {
  const { corrida } = CONFIG;
  const aceleracoes = Math.floor(estado.tempoCorrida / corrida.intervaloAceleracao);
  estado.velocidade = Math.min(
    estado.fase.velocidadeMax,
    corrida.velocidadeInicial + aceleracoes * corrida.aceleracao,
  );

  let v = estado.velocidade * fator;
  if (estado.aluno.tropeco > 0) v *= 0.55;
  if (estado.efeitos.escorregando > 0) v *= 0.65;
  estado.velocidadeAtual = v;
  estado.distancia += v * dt;

  atualizarAluno(estado.aluno, dt * fator);
  gerarAte(estado.gerador, estado.obstaculos, estado.distancia + corrida.visaoAFrente, estado.velocidade);
  removerObstaculosAtras(estado.obstaculos, estado.distancia - 15);
}

function atualizarCorrida(estado, dt) {
  estado.tempoCorrida += dt;
  avancar(estado, dt, 1);
  moverObstaculos(estado.obstaculos, estado.distancia, dt, estado.tempo);
  avisarNovosObstaculos(estado);
  atualizarDeriva(estado, dt);

  const aluno = estado.aluno;
  const r = verificarObstaculos(estado.obstaculos, caixaAluno(aluno, estado.distancia), aluno.invulneravel <= 0);
  if (r.evitados) {
    estado.obstaculosEvitados += r.evitados;
    estado.pontos += r.evitados * CONFIG.pontos.obstaculo;
  }
  if (r.escorregou) estado.efeitos.escorregando = CONFIG.folego.escorregao;
  if (r.colidiu) {
    estado.colisoes++;
    alterarFolego(estado, -CONFIG.folego.colisao);
    aluno.tropeco = CONFIG.folego.tropeco;
    aluno.invulneravel = CONFIG.folego.invulneravel;
    estado.efeitos.tremor = 0.3;
    estado.eventos.push({ tipo: 'colisao' });
  }

  if (estado.distancia >= estado.comprimento) {
    estado.distancia = estado.comprimento;
    finalizar(estado, true);
    return;
  }
  if (estado.folego <= 0) {
    capturar(estado);
    return;
  }

  const ponto = estado.pontosQuestao[estado.proximaQuestao];
  if (ponto !== undefined && estado.distancia >= ponto) {
    estado.proximaQuestao++;
    iniciarQuestao(estado, false);
  }
}

function atualizarQuestao(estado, dt) {
  const q = estado.questao;
  // Portas: câmera lenta, sem obstáculos. Esconderijo: corrida parada.
  if (q.formato === 'portas') avancar(estado, dt, CONFIG.questoes.camaraLenta);
  q.decorrido += dt;
  if (restante(q) <= 0) responder(estado, 'tempo');
}

function atualizarFeedback(estado, dt) {
  estado.feedback.decorrido += dt;
  const automatico = estado.opcoes.modoEstudo === 'desligado';
  if (automatico && estado.feedback.decorrido >= CONFIG.questoes.feedbackAuto) continuar(estado);
}

// ---------- Regras ----------

// Emite um evento na primeira vez que cada tipo de obstáculo aparece na tela.
function avisarNovosObstaculos(estado) {
  const { largura, alunoX, pxPorMetro } = CONFIG.tela;
  const bordaMetros = (largura - alunoX) / pxPorMetro;
  for (const o of estado.obstaculos) {
    if (estado.tiposVistos.has(o.tipo)) continue;
    if (o.x - estado.distancia > bordaMetros + CONFIG.corrida.avisoAntes) continue;
    estado.tiposVistos.add(o.tipo);
    estado.eventos.push({ tipo: 'novoObstaculo', obstaculo: o.tipo, acao: TIPOS[o.tipo].acao });
  }
}

function aplicarConsequencia(estado, q, resultado, fb) {
  const c = CONFIG.consequencias;
  estado.total++;

  if (resultado === 'certa') {
    estado.acertos++;
    estado.sequencia++;
    estado.melhorSequencia = Math.max(estado.melhorSequencia, estado.sequencia);
    fb.rapido = q.total !== Infinity && tempoUsado(q) <= q.total / 2;
    fb.multiplicador = multiplicadorDaSequencia(estado.sequencia);
    fb.pontosGanhos = pontosDoAcerto(q.dificuldade, fb.rapido, estado.sequencia);
    estado.pontos += fb.pontosGanhos;

    let delta = c.acerto[q.dificuldade];
    if (estado.sequencia % c.sequenciaBonus === 0) {
      delta += c.bonusSequencia;
      fb.bonusSequencia = true;
    }
    const antes = estado.folego;
    alterarFolego(estado, delta);
    fb.deltaFolego = estado.folego - antes;
    estado.efeitos.profTropeco = 1.4;
    estado.efeitos.sprint = 0.9;
    return;
  }

  // "Não sei" custa menos e mantém a sequência; erro e tempo esgotado a zeram.
  const delta = resultado === 'naoSei' ? c.naoSei : resultado === 'tempo' ? c.tempo : c.erro;
  if (resultado !== 'naoSei') estado.sequencia = 0;
  const antes = estado.folego;
  alterarFolego(estado, delta);
  fb.deltaFolego = estado.folego - antes;
  agendarRevisao(estado, q.original);
}

function iniciarQuestao(estado, recuperacao) {
  const original = recuperacao ? estado.seletor.paraRecuperacao(estado) : estado.seletor.escolher(estado);
  if (!original) {
    if (recuperacao) finalizar(estado, false);
    return;
  }
  estado.questao = prepararQuestao(original, estado.opcoes, recuperacao);
  estado.modo = recuperacao ? 'recuperacao' : 'questao';
  estado.eventos.push({ tipo: 'questao', questao: estado.questao });
}

// Primeira captura vira Aula de Recuperação; a segunda encerra a partida.
function capturar(estado) {
  estado.capturas++;
  if (estado.capturas === 1) {
    removerObstaculosEntre(estado.obstaculos, estado.distancia - 3, estado.distancia + 25);
    estado.eventos.push({ tipo: 'captura' });
    iniciarQuestao(estado, true);
  } else {
    finalizar(estado, false);
  }
}

function finalizar(estado, concluiu) {
  const p = CONFIG.pontos;
  const bonusChegada = concluiu ? Math.round(estado.folego) * p.porFolegoFinal : 0;
  const bonusSemCaptura = concluiu && estado.capturas === 0 ? p.semCaptura : 0;
  estado.pontos += bonusChegada + bonusSemCaptura;
  estado.modo = 'fim';
  estado.questao = null;
  estado.feedback = null;
  estado.resumo = {
    faseId: estado.fase.id,
    faseNome: estado.fase.nome,
    concluiu,
    pontos: pontuacaoAtual(estado),
    distancia: Math.floor(Math.min(estado.distancia, estado.comprimento)),
    comprimento: estado.comprimento,
    acertos: estado.acertos,
    total: estado.total,
    melhorSequencia: estado.melhorSequencia,
    obstaculosEvitados: estado.obstaculosEvitados,
    colisoes: estado.colisoes,
    capturas: estado.capturas,
    bonusChegada,
    bonusSemCaptura,
    historico: estado.historico,
    modoEstudo: estado.opcoes.modoEstudo !== 'desligado',
  };
  estado.eventos.push({ tipo: 'fim', resumo: estado.resumo });
}

// ---------- Cena de fundo da tela de título ----------

export function criarDemo() {
  return {
    modo: 'demo',
    distancia: 0,
    tempo: 0,
    velocidadeAtual: 6,
    comprimento: Infinity,
    folego: 55,
    aluno: criarAluno(),
    obstaculos: [],
    efeitos: efeitosIniciais(),
    questao: null,
    feedback: null,
  };
}

export function atualizarDemo(demo, dt) {
  demo.tempo += dt;
  demo.distancia += demo.velocidadeAtual * dt;
  atualizarAluno(demo.aluno, dt);
}
