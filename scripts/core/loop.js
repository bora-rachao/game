// Loop com passo fixo de simulação (60 Hz), separado da renderização.
// Assim o jogo se comporta igual em telas de 60 e de 120 Hz.
const PASSO = 1 / 60;

export function criarLoop(atualizar, desenhar) {
  let rodando = false;
  let ultimo = 0;
  let acumulado = 0;

  function quadro(agora) {
    if (!rodando) return;
    const dt = Math.min(0.25, (agora - ultimo) / 1000);
    ultimo = agora;
    acumulado += dt;
    while (acumulado >= PASSO) {
      atualizar(PASSO);
      acumulado -= PASSO;
    }
    desenhar();
    requestAnimationFrame(quadro);
  }

  return {
    iniciar() {
      if (rodando) return;
      rodando = true;
      ultimo = performance.now();
      acumulado = 0;
      requestAnimationFrame(quadro);
    },
    parar() { rodando = false; },
  };
}
