// Inicialização: carrega conteúdo e progresso, liga entrada, loop, telas e partida.
import { criarLoop } from "./core/loop.js";
import { criarInput } from "./core/input.js";
import { criarRenderizador } from "./core/render.js";
import { carregarConteudo } from "./dados/conteudo.js";
import {
  carregarProgresso,
  salvarProgresso,
  armazenamentoDisponivel,
} from "./dados/armazenamento.js";
import { registrarPartida } from "./dados/progresso.js";
import * as Partida from "./game/partida.js";
import { criarHud } from "./ui/hud.js";
import { criarPainelQuestao } from "./ui/painel-questao.js";
import {
  registrarTelas,
  mostrarTela,
  esconderTelas,
  telaAtual,
} from "./ui/telas.js";
import { renderizarMapa } from "./ui/mapa.js";
import { renderizarResultados } from "./ui/resultados.js";
import { aplicarOpcoes, iniciarOpcoes } from "./ui/opcoes.js";

const palco = document.getElementById("palco");
const renderizador = criarRenderizador(document.getElementById("tela"));
const hud = criarHud(document.getElementById("hud"));
const progresso = carregarProgresso();
const toque = window.matchMedia("(pointer: coarse)").matches;

let conteudo = null;
let partida = null;
let faseIndice = 0;
let telaAntesDasOpcoes = "titulo";
const dicasVistas = new Set(progresso.dicasVistas ?? []);

// Dica contextual na primeira vez que cada obstáculo aparece (serve de tutorial).
const PULAR = toque ? "toque à esquerda" : "Espaço ou ↑";
const PULAR_ALTO = toque ? "segure o toque" : "segure Espaço";
const DESLIZAR = toque ? "deslize o dedo para baixo" : "↓";
const DICAS = {
  mochila: `Mochila no chão: pule (${PULAR}).`,
  carrinho: `Carrinho do zelador: pule alto (${PULAR_ALTO}).`,
  livros: `Pilha de livros: pule alto (${PULAR_ALTO}).`,
  faixa: `Faixa pendurada: deslize por baixo (${DESLIZAR}).`,
  armario: `Porta de armário aberta: deslize por baixo (${DESLIZAR}).`,
  molhado: "Piso molhado: pule, ou você escorrega e perde velocidade.",
  aviaoBaixo: "Aviãozinho de asa laranja voando baixo: pule!",
  aviaoCabeca: "Aviãozinho de asa roxa na altura da cabeça: deslize!",
  aviaoAlto: "Aviãozinho branco voando alto: passa por cima, não faça nada.",
  cadeira: `Cadeira rolando na sua direção: pule alto (${PULAR_ALTO}).`,
  bola: "Bola quicando: pule quando ela estiver baixa ou deslize quando estiver no alto.",
};
const demo = Partida.criarDemo();

aplicarOpcoes(progresso.opcoes);
iniciarOpcoes(document.getElementById("form-opcoes"), progresso);
registrarTelas(palco);

if (toque) {
  document.getElementById("texto-controles").textContent =
    "Toque na metade esquerda para pular (segure para pular mais alto) e deslize o dedo para baixo para deslizar.";
}

const painel = criarPainelQuestao(document.getElementById("painel-questao"), {
  aoResponder: (i) => Partida.responder(partida, i),
  aoNaoSei: () => Partida.responder(partida, "naoSei"),
  aoContinuar: () => Partida.continuar(partida),
});

// ---------- Fluxo de telas ----------

function abrirMapa() {
  if (!conteudo) return;
  renderizarMapa(document.getElementById("lista-fases"), conteudo, progresso);
  mostrarTela("mapa");
}

function iniciarFase(indice) {
  faseIndice = indice;
  const fase = conteudo.fases.fases[indice];
  partida = Partida.criarPartida({
    fase,
    banco: conteudo.banco,
    opcoes: progresso.opcoes,
  });
  painel.esconder();
  esconderTelas();
  hud.mostrar(true);
  hud.aviso(`Fase ${fase.id.replace("-", ".")}: ${fase.nome}. ${fase.fala}`, 3);
  document.activeElement?.blur?.();
}

function sairParaMapa() {
  partida = null;
  painel.esconder();
  hud.mostrar(false);
  abrirMapa();
}

function pausar() {
  if (!partida || partida.pausado || partida.modo === "fim") return;
  partida.pausado = true;
  mostrarTela("pausa");
}

function retomar() {
  if (!partida) return;
  partida.pausado = false;
  esconderTelas();
  if (partida.modo === "feedback")
    document.querySelector('[data-painel="continuar"]')?.focus();
  else if (partida.questao) document.getElementById("painel-questao").focus();
}

function alternarPausa() {
  if (!partida) return;
  if (!partida.pausado) pausar();
  else if (telaAtual() === "pausa") retomar();
  else if (telaAtual() === "opcoes") mostrarTela("pausa");
}

function terminarPartida(resumo) {
  const registro = registrarPartida(progresso, resumo);
  const salvo = salvarProgresso(progresso);
  hud.mostrar(false);
  painel.esconder();
  renderizarResultados(document.getElementById("boletim"), {
    resumo,
    registro,
    conteudo,
    progresso,
    salvo,
    faseIndice,
  });
  mostrarTela("resultados");
}

// ---------- Eventos da partida ----------

function processarEventos() {
  if (!partida) return;
  for (const ev of partida.eventos.splice(0)) {
    switch (ev.tipo) {
      case "questao":
        painel.mostrarQuestao(ev.questao);
        break;
      case "feedback":
        painel.mostrarFeedback(ev.feedback);
        break;
      case "retomar":
        painel.esconder();
        break;
      case "novoObstaculo":
        if (!dicasVistas.has(ev.obstaculo) && DICAS[ev.obstaculo]) {
          dicasVistas.add(ev.obstaculo);
          progresso.dicasVistas = [...dicasVistas];
          hud.aviso(DICAS[ev.obstaculo], 3);
        }
        break;
      case "fim":
        terminarPartida(ev.resumo);
        break;
    }
  }
}

// ---------- Botões (delegação) ----------

palco.addEventListener("click", (e) => {
  const botao = e.target.closest("[data-acao]");
  if (!botao) return;
  switch (botao.dataset.acao) {
    case "abrir-mapa":
      abrirMapa();
      break;
    case "voltar-titulo":
      mostrarTela("titulo");
      break;
    case "jogar-fase":
      iniciarFase(Number(botao.dataset.fase));
      break;
    case "jogar-novamente":
      iniciarFase(faseIndice);
      break;
    case "proxima-fase":
      iniciarFase(faseIndice + 1);
      break;
    case "recomecar":
      iniciarFase(faseIndice);
      break;
    case "sair-mapa":
      sairParaMapa();
      break;
    case "pausar":
      pausar();
      break;
    case "retomar":
      retomar();
      break;
    case "abrir-opcoes":
      telaAntesDasOpcoes = telaAtual() ?? "titulo";
      mostrarTela("opcoes");
      break;
    case "voltar-opcoes":
      mostrarTela(telaAntesDasOpcoes);
      break;
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausar();
});

criarInput({
  superficie: palco,
  acoes: {
    correndo: () => Partida.podeMover(partida),
    emQuestao: () => Partida.emQuestao(partida),
    pular: () => Partida.acaoPular(partida),
    soltarPulo: () => Partida.acaoSoltarPulo(partida),
    deslizar: () => Partida.acaoDeslizar(partida),
    alternativa: (i) => Partida.responder(partida, i),
    naoSei: () => Partida.responder(partida, "naoSei"),
    pausa: alternarPausa,
  },
});

// ---------- Loop ----------

const loop = criarLoop(
  (dt) => {
    if (partida) Partida.atualizarPartida(partida, dt);
    else Partida.atualizarDemo(demo, dt);
  },
  () => {
    processarEventos();
    if (partida && partida.modo !== "fim") {
      hud.atualizar(partida);
      if (partida.modo === "questao") painel.atualizarTimer(partida.questao);
      if (partida.modo === "feedback") {
        painel.atualizarAuto(
          partida.feedback,
          partida.opcoes.modoEstudo === "desligado",
        );
      }
    }
    renderizador.desenhar(partida ?? demo, progresso.opcoes);
  },
);
loop.iniciar();

// Acesso de depuração: abra com ?debug para inspecionar a partida no console (window.__fuga.partida).
if (new URLSearchParams(location.search).has("debug")) {
  window.__fuga = {
    get partida() {
      return partida;
    },
  };
}

// ---------- Carregamento do conteúdo ----------

if (!armazenamentoDisponivel())
  document.getElementById("nota-armazenamento").hidden = false;

try {
  await document.fonts?.load?.("800 20px 'Nunito'");
} catch {
  // A fonte é opcional: o jogo segue com a fonte do sistema.
}

try {
  conteudo = await carregarConteudo();
} catch (erro) {
  const aviso = document.getElementById("erro-carregamento");
  aviso.textContent =
    "Não foi possível carregar as questões. Abra o jogo por um servidor local " +
    '(por exemplo, a extensão Live Server do VS Code ou "python -m http.server") em vez de abrir o arquivo direto. ' +
    `Detalhe: ${erro.message}`;
  aviso.hidden = false;
  document.getElementById("botao-jogar").disabled = true;
}
