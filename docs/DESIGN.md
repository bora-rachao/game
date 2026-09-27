# Design

## 1. Objetivo visual

O jogo deve possuir identidade visual amigável, esportiva e adequada a
uma experiência educacional.

A interface deve parecer um jogo sem sacrificar clareza.

Prioridade:

1.  compreensão;
2.  legibilidade;
3.  consistência;
4.  feedback;
5.  personalidade;
6.  acabamento.

## 2. Direção geral

A direção inicial combina:

- estética esportiva;
- elementos inspirados em quadra de vôlei;
- personagens ilustrados;
- balões de diálogo;
- cards;
- botões destacados;
- feedback visual;
- formas arredondadas;
- animações curtas.

O estilo final será refinado após o primeiro protótipo.

## 3. Paleta inicial

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #f59e0b;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #172033;
  --color-muted: #64748b;
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-help: #7c3aed;
}
```

As cores são provisórias e podem ser alteradas após testes de contraste
e feedback.

## 4. Tipografia

A tipografia deve priorizar:

- leitura rápida;
- hierarquia entre títulos e corpo;
- boa visualização em telas menores;
- personalidade sem comprometer legibilidade.

Uma família sem serifa é recomendada para a primeira versão.

## 5. Layout

A interface deve funcionar em desktop, notebook e telas menores.

A estrutura deve evitar posições absolutas para conteúdo essencial.

Exemplo:

```text
┌─────────────────────────────────────┐
│ progresso / etapa                   │
├─────────────────────────────────────┤
│                                     │
│          conteúdo do jogo           │
│                                     │
├─────────────────────────────────────┤
│ personagem + balão de diálogo       │
├─────────────────────────────────────┤
│ ações / alternativas                │
└─────────────────────────────────────┘
```

O layout real pode variar conforme o tipo de desafio.

## 6. Tutor

O tutor deve ser reconhecível e ocupar espaço suficiente para transmitir
expressão sem competir com o conteúdo.

Possíveis posições:

- lateral;
- inferior;
- dentro de um card;
- ao lado do balão.

A posição pode variar conforme desktop e telas menores.

## 7. Balões de diálogo

Devem permitir:

- texto;
- identificação visual do personagem;
- diferentes estados;
- botão de continuidade quando necessário.

Estados:

```text
normal
success
error
help
info
```

O balão não deve ocupar a maior parte da tela.

## 8. Botões

Devem indicar claramente:

- ação principal;
- ação secundária;
- ajuda;
- tentar novamente;
- continuar.

Estados:

```text
default
hover
focus
active
disabled
```

O foco de teclado deve ser visualmente perceptível.

## 9. Feedback

O feedback deve combinar texto e sinais visuais.

### Sucesso

Pode utilizar mudança de estado, ícone, animação curta e mensagem do
tutor.

### Erro

Pode utilizar destaque da alternativa, mensagem, orientação e nova
tentativa.

O erro não deve depender exclusivamente de cor.

### Ajuda

Deve ser visualmente distinguível do erro.

## 10. Animações

As animações devem ser curtas e funcionais:

- entrada do personagem;
- aparecimento do diálogo;
- transição entre desafios;
- destaque de resposta;
- progresso.

Evitar animações longas que atrasem a interação.

## 11. Personagens e assets

Os seis tutores devem compartilhar:

- estilo artístico;
- proporções;
- nível de detalhamento;
- enquadramento;
- tratamento de luz;
- qualidade visual.

Podem variar:

- cabelo;
- roupas;
- acessórios;
- expressões;
- postura;
- elementos de identidade.

Os assets devem permitir adicionar novas expressões sem mudar o estilo.

## 12. Estrutura de CSS

```text
styles/
├── init.css
├── game.css
├── characters.css
├── dialogue.css
└── components.css
```

Novos arquivos devem representar responsabilidades reais.

Variáveis CSS devem concentrar valores globais.

## 13. Acessibilidade

O protótipo deve considerar:

- contraste suficiente;
- textos legíveis;
- foco de teclado;
- botões identificáveis;
- não depender somente de cor;
- `alt` adequado para imagens relevantes;
- textos compreensíveis;
- áreas de interação adequadas.

Acessibilidade pode ser refinada durante a auditoria de UX.

## 14. Relação com PERSONAS.md

`PERSONAS.md` define quem são os tutores e como eles se comportam.

`DESIGN.md` define como essa identidade aparece visualmente.

```text
PERSONAS.md
Lucas → energético, motivador, descontraído
        ↓
DESIGN.md
postura dinâmica + expressão animada + linguagem visual esportiva
        ↓
CSS / Assets
```

## 15. Primeiro protótipo visual

O protótipo inicial não precisa conter todos os seis personagens.

Pode utilizar um personagem temporário para validar:

- estrutura da tela;
- balão;
- botões;
- desafio;
- feedback;
- responsividade.

Depois da validação da interface, os seis personagens podem ser
incorporados.
