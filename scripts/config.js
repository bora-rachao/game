// Números de balanceamento do jogo. Ajuste aqui, nunca espalhado pelo código.
// Distâncias em metros, tempos em segundos.
export const CONFIG = {
  tela: { largura: 960, altura: 540, chaoY: 452, alunoX: 300, pxPorMetro: 40 },

  corrida: {
    velocidadeInicial: 6,
    aceleracao: 0.15,         // m/s a mais...
    intervaloAceleracao: 12,  // ...a cada 12 s de corrida
    inicioLivre: 20,          // metros sem obstáculos no começo
    finalLivre: 30,           // metros sem obstáculos antes do portão
    visaoAFrente: 45,
    distanciaAtivacao: 20,   // móveis começam a andar a esta distância do aluno
    avisoAntes: 10,          // metros além da borda da tela em que aparece o aviso "!"
  },

  fisica: {
    gravidade: 30,
    impulsoPulo: 10,     // segurando o botão (~1,7 m)
    impulsoMinimo: 7.5,  // toque rápido (~0,9 m)
    quedaRapida: 16,     // deslizar no ar puxa o aluno para baixo
    duracaoDeslize: 0.7,
  },

  aluno: { largura: 0.6, altura: 1.7, alturaDeslize: 0.8, larguraDeslize: 1.0 },

  folego: {
    inicial: 60,
    deriva: 1,
    intervaloDeriva: 4,
    colisao: 15,
    tropeco: 1,
    invulneravel: 1.2,
    escorregao: 1,
    aposRecuperacao: 25,
    zonaTranquilo: 60,  // acima disso
    zonaPerigo: 30,     // abaixo disso
  },

  questoes: {
    primeiraEm: 130,
    intervalo: 150,
    zonaLivreAntes: 12,
    zonaLivreDepois: 55,
    camaraLenta: 0.4,
    palavrasPorSegundo: 3,
    decisao: { facil: 4, media: 7, dificil: 10 },
    faixaTempo: { portas: [8, 12], esconderijo: [15, 30] },
    carencia: 1.5,
    feedbackAuto: 6,
    revisaoApos: 60,
  },

  consequencias: {
    acerto: { facil: 10, media: 15, dificil: 20 },
    erro: -8,
    naoSei: -6,
    tempo: -10,
    bonusSequencia: 5,
    sequenciaBonus: 3,
  },

  pontos: {
    porMetro: 1,
    obstaculo: 10,
    acerto: { facil: 150, media: 250, dificil: 400 },
    rapido: 1.5,
    semCaptura: 500,
    porFolegoFinal: 10,
  },

  multiplicadores: [
    { min: 8, valor: 3 },
    { min: 5, valor: 2 },
    { min: 3, valor: 1.5 },
    { min: 0, valor: 1 },
  ],

  medalhas: { prata: 0.7, ouro: 0.9 },
};
