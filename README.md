# Fuga da Aula

Endless runner educativo de navegador: fuja do Professor Pixel respondendo perguntas sobre uso de inteligência artificial. Feito em HTML, CSS e JavaScript puros, sem backend, sem framework e sem etapa de build.

## Como rodar

O jogo precisa ser aberto por um servidor estático, porque usa módulos ES e carrega as questões de arquivos JSON (abrir o `index.html` direto do disco não funciona).

- **VS Code:** instale a extensão Live Server, clique com o botão direito em `index.html` e escolha "Open with Live Server".
- **Terminal:** na pasta do projeto, rode `python -m http.server 8000` e abra `http://localhost:8000`.
- **Publicação:** qualquer hospedagem estática (GitHub Pages, Netlify, Vercel) serve a pasta como está.

Para inspecionar a partida no console, abra com `?debug` e use `window.__fuga.partida`.

## Controles

| Ação                        | Teclado        | Toque                                          | Mouse                 |
| --------------------------- | -------------- | ---------------------------------------------- | --------------------- |
| Pular (segurar = mais alto) | Espaço, ↑ ou W | Tocar na metade esquerda ou deslizar para cima | Clicar na cena        |
| Deslizar                    | ↓ ou S         | Deslizar o dedo para baixo                     | —                     |
| Responder                   | 1 a 4 ou A a D | Tocar na alternativa                           | Clicar na alternativa |
| Não sei                     | N              | Botão "Não sei"                                | Botão "Não sei"       |
| Pausar                      | Esc ou P       | Botão de pausa                                 | Botão de pausa        |

## Estrutura

```
index.html              telas e painéis (HTML acessível)
styles/
  base.css              fonte, cores, reset
  layout.css            palco 16:9, HUD, telas
  componentes.css       botões, lousa, painel de questão, mapa, boletim
  acessibilidade.css    reduzir movimento, texto grande
scripts/
  main.js               inicialização e fluxo entre telas
  config.js             TODOS os números de balanceamento
  core/                 loop (passo fixo), entrada, renderização no canvas
  game/                 regras do jogo, sem acesso ao DOM
    partida.js          coordena corrida, questões, captura e fim
    corrida.js          pulo, deslize, colisão do aluno
    obstaculos.js       tipos de obstáculo e blocos de percurso
    perseguicao.js      Fôlego e zonas
    questoes.js         seleção, tempo e revisão de conceitos
    pontuacao.js        pontos e multiplicador
  ui/                   HUD, painel de questão, mapa, resultados, opções
  dados/                carregamento do JSON e progresso no localStorage
data/
  fases.json            fases do Capítulo 1
  capitulo-1.json       24 questões (8 por fase) e nomes dos conceitos
assets/fonts/           Nunito (licença OFL)
```

Regras de organização: a lógica em `game/` só altera o estado e emite eventos em `estado.eventos`; a interface em `ui/` e o `render.js` apenas leem esse estado. Números de balanceamento ficam em `config.js`; conteúdo fica em `data/`.

## Como adicionar questões

Acrescente objetos em `data/capitulo-1.json` seguindo o formato existente. Questões `portas` devem ter 2 ou 3 alternativas curtas; `esconderijo` tem 4. O campo `conceito` precisa existir em `conceitos`. O tempo é calculado sozinho pelo tamanho do texto e pela dificuldade; use `tempoOverride` (em segundos) só quando os testes pedirem.

## Obstáculos

A cor da base ou da asa indica a ação: **laranja = pular**, **roxo = deslizar**, branco = inofensivo.

| Obstáculo                            | Como evitar                                | Móvel |
| ------------------------------------ | ------------------------------------------ | ----- |
| Mochila                              | Pular                                      | Não   |
| Carrinho do zelador, pilha de livros | Pular alto (segurar)                       | Não   |
| Faixa pendurada, porta de armário    | Deslizar                                   | Não   |
| Piso molhado                         | Pular (senão escorrega e perde velocidade) | Não   |
| Aviãozinho de asa laranja (baixo)    | Pular                                      | Sim   |
| Aviãozinho de asa roxa (cabeça)      | Deslizar                                   | Sim   |
| Aviãozinho branco (alto)             | Nada, passa por cima                       | Sim   |
| Cadeira rolando                      | Pular alto                                 | Sim   |
| Bola quicando                        | Pular quando baixa ou deslizar quando alta | Sim   |

Obstáculos móveis só começam a andar a 20 m do aluno e são posicionados para chegar no ritmo do bloco de percurso. Um "!" na borda direita avisa antes de eles entrarem na tela. Na primeira vez que cada obstáculo aparece, o HUD mostra uma dica de como passar por ele (fica salvo, não repete).

A dificuldade sobe dentro de cada fase: `blocos` e `blocosFim` em `data/fases.json` definem os pesos de dificuldade no início e no fim da fase.

## O que já está pronto (base do MVP)

- Corrida automática com pulo curto/alto, deslize e queda rápida.
- Onze obstáculos (seis parados e cinco móveis) gerados por blocos de percurso, com dificuldade crescente ao longo da fase.
- Fôlego com três zonas, deriva, colisão, tropeço e invulnerabilidade.
- Questões Portas (câmera lenta) e Esconderijo (corrida parada, lanterna como cronômetro), com carência de leitura, "Não sei", feedback e revisão do conceito 60 s depois.
- Aula de Recuperação na primeira captura; a segunda encerra a partida.
- Pontuação com multiplicador de sequência, bônus de rapidez, de chegada e sem captura.
- Três fases do Capítulo 1 com desbloqueio por medalha, recordes e domínio de conceitos salvos no navegador.
- Resultados com conceitos dominados, em progresso e a revisar, e explicações completas.
- Opções: tamanho do texto, Modo Estudo (tempo em dobro ou sem cronômetro, com recorde separado) e reduzir movimento.

## Próximos passos

1. Habilidades com Lâmpadas: Sprint, Escudo e Dica.
2. Tutorial integrado na primeira partida.
3. Chamada Oral do Capítulo 1.
4. Sons e música em camadas por zona de Fôlego.
5. Service worker para funcionar offline.
