# Arquitetura

## 1. Visão geral

O projeto é um jogo educacional de vôlei executado no navegador,
desenvolvido inicialmente com HTML, CSS e JavaScript.

A aplicação utiliza uma experiência de página única. O `index.html`
fornece a estrutura base e o JavaScript controla telas, estados,
desafios, diálogos e progressão.

A arquitetura prioriza simplicidade, separação de responsabilidades,
manutenção por diferentes integrantes e compreensão por agentes de IA.

## 2. Estrutura inicial

```text
/
├── assets/
│   ├── characters/
│   ├── backgrounds/
│   ├── ui/
│   └── ...
├── docs/
│   ├── AGENTS.md
│   ├── ARQUITETURA.md
│   ├── VIABILIDADE.md
│   ├── OBJETIVOS.md
│   ├── PERSONAS.md
│   ├── DESIGN.md
│   ├── MATERIAL_PDF.pdf
│   └── MATERIAL_MD.md
├── scripts/
│   ├── init.js
│   ├── game.js
│   ├── characters.js
│   ├── dialogue.js
│   ├── challenges.js
│   └── ...
├── styles/
│   ├── init.css
│   ├── game.css
│   ├── characters.css
│   ├── dialogue.css
│   └── ...
├── index.html
└── README.md
```

A divisão é inicial. Novos arquivos devem ser criados quando houver uma
responsabilidade real que justifique a separação.

## 3. Responsabilidades

### `index.html`

Contém a estrutura HTML base e os pontos de montagem. Não deve
concentrar a lógica do jogo.

### `scripts/init.js`

Inicializa o estado, prepara a aplicação e inicia a primeira tela.

### `scripts/game.js`

Controla o fluxo e o estado geral do jogo.

Exemplo conceitual:

```js
const gameState = {
  screen: "character-selection",
  character: null,
  score: 0,
  questionIndex: 0,
};
```

### `scripts/characters.js`

Concentra os dados dos seis tutores e operações relacionadas à seleção e
apresentação dos personagens.

Os personagens devem ser tratados como dados sempre que possível.

### `scripts/dialogue.js`

Controla a apresentação de introduções, acertos, erros, dicas e
mensagens de progresso.

A personalidade deve vir dos dados do personagem, evitando lógica
duplicada.

### `scripts/challenges.js`

Controla perguntas, alternativas, resposta correta, validação, feedback
e avanço.

A estrutura deve permitir adicionar desafios sem alterar o fluxo
principal.

## 4. Fluxo

```text
Início
  ↓
Seleção do tutor
  ↓
Introdução/tutorial
  ↓
Desafio
  ↓
Resposta
  ├── correta → feedback positivo → próximo conteúdo
  └── incorreta → feedback/dica → nova tentativa
  ↓
Progressão
  ↓
Conclusão
```

## 5. Página única

O projeto utilizará inicialmente apenas `index.html`.

As diferentes telas serão estados visuais controlados por JavaScript,
por exemplo:

```text
start
character-selection
tutorial
challenge
feedback
help
result
```

Não é necessário criar um gerenciador de estado complexo no protótipo.

## 6. CSS

Os arquivos CSS devem ser separados por responsabilidade:

- `init.css`: tela inicial e elementos estáticos;
- `game.css`: estrutura geral;
- `characters.css`: seleção e apresentação dos tutores;
- `dialogue.css`: balões e mensagens.

Variáveis CSS devem concentrar cores, espaçamentos e tipografia
compartilhados.

## 7. Assets

### Organização dos assets

Os assets dos personagens devem ser organizados por personagem, mantendo suas diferentes expressões dentro da própria pasta. Isso facilita a manutenção, localização dos arquivos e integração com o código.

```text
assets/
├── characters/
│   ├── lucas/
│   │   ├── default.png
│   │   ├── correct.png
│   │   ├── incorrect.png
│   │   └── help.png
│   ├── gabriel/
│   │   ├── default.png
│   │   ├── correct.png
│   │   ├── incorrect.png
│   │   └── help.png
│   ├── rafael/
│   ├── mariana/
│   ├── camila/
│   └── beatriz/
├── backgrounds/
├── ui/
└── icons/
```

As expressões devem ser nomeadas de acordo com sua função no jogo:

- `default.png` — expressão padrão durante diálogos.
- `correct.png` — expressão utilizada após uma resposta correta.
- `incorrect.png` — expressão utilizada após uma resposta incorreta.
- `help.png` — expressão utilizada durante dicas ou explicações.

Novas expressões, como `thinking.png`, `surprised.png` ou `celebrating.png`, podem ser adicionadas posteriormente caso sejam necessárias para o jogo. Não devem ser criadas pastas separadas para cada expressão enquanto essa organização não trouxer um benefício real.

### Formato dos arquivos

Os personagens devem preferencialmente utilizar **PNG**, principalmente quando precisarem de fundo transparente para serem posicionados sobre cenários ou elementos da interface.

Arquivos **JPG/JPEG também podem ser utilizados** quando a imagem possuir um fundo próprio e a transparência não for necessária. O formato não deve ser alterado apenas por padronização se isso resultar em perda desnecessária de qualidade.

A escolha do formato deve considerar a função do asset:

- **PNG** — personagens, elementos de interface e imagens que precisam de transparência.
- **JPG/JPEG** — imagens com fundo completo, como determinadas ilustrações ou referências visuais.
- **SVG** — ícones ou elementos vetoriais, quando apropriado.

## 8. Princípios para agentes

Um agente deve preferir:

1.  reutilizar estruturas existentes;
2.  criar dados configuráveis;
3.  separar responsabilidades;
4.  evitar dependências desnecessárias;
5.  manter o fluxo explícito;
6.  atualizar a documentação quando uma decisão estrutural mudar.

A arquitetura é inicial e pode ser revisada após o primeiro protótipo e
após feedback do professor.
