# Personagens / Tutores

## 1. Finalidade

Este documento define os seis personagens que acompanham o jogador no
jogo educacional de vôlei.

Eles são tutores fictícios do jogo e não representam diretamente as
personas de usuários do BoraRachão.

As personas do BoraRachão representam usuários da plataforma esportiva e
podem servir como referência para comportamentos, interesses e
características humanas. Os personagens deste jogo possuem função
diferente: ensinar e acompanhar o jogador.

## 2. Princípios comuns

Todos os tutores devem:

- ser acolhedores;
- incentivar a aprendizagem;
- evitar constranger o jogador por errar;
- explicar quando necessário;
- manter linguagem coerente;
- possuir personalidade reconhecível;
- combinar comportamento e identidade visual.

As mensagens devem ser curtas o suficiente para não interromper
excessivamente a experiência.

## 3. Lucas — energético e motivador

- Personalidade: extrovertido, positivo e competitivo de forma saudável.
- Comunicação: direta, informal e animada.
- Função: incentivar o jogador a continuar tentando.

**Acerto:** reconhece o raciocínio com entusiasmo.

**Erro:** incentiva nova tentativa sem desmotivar.

**Ajuda:** fornece uma pista objetiva.

**Visual:** postura dinâmica, expressão sorridente e aparência
esportiva.

## 4. Gabriel — tranquilo e didático

- Personalidade: paciente, observador e racional.
- Comunicação: calma e explicativa.
- Função: explicar conceitos e relações entre regras.

**Acerto:** valoriza a compreensão.

**Erro:** explica o ponto que precisa ser observado.

**Ajuda:** divide o problema em partes.

**Visual:** postura calma, expressão confiante e aparência esportiva.

## 5. Rafael — descontraído e social

- Personalidade: comunicativo, espontâneo e bem-humorado.
- Comunicação: informal sem exageros.
- Função: deixar a experiência mais leve.

**Acerto:** comemora de maneira descontraída.

**Erro:** apresenta o erro como oportunidade para observar novamente.

**Ajuda:** oferece uma dica rápida.

**Visual:** postura descontraída, expressão amigável e aparência
esportiva.

## 6. Mariana — cuidadosa e explicativa

- Personalidade: atenciosa, organizada e paciente.
- Comunicação: clara e acolhedora.
- Função: ajudar o jogador a compreender detalhes.

**Acerto:** destaca o detalhe importante.

**Erro:** convida o jogador a analisar novamente.

**Ajuda:** direciona a observação para elementos da jogada.

**Visual:** postura equilibrada, expressão amigável e aparência
esportiva.

## 7. Camila — confiante e estratégica

- Personalidade: determinada, analítica e motivadora.
- Comunicação: objetiva e segura.
- Função: estimular decisões e análise.

**Acerto:** reconhece decisões baseadas em análise.

**Erro:** incentiva pensar nas consequências da escolha.

**Ajuda:** chama atenção para o posicionamento da equipe.

**Visual:** postura confiante, expressão determinada e aparência
esportiva.

## 8. Beatriz — curiosa e incentivadora

- Personalidade: curiosa, amigável e questionadora.
- Comunicação: leve e investigativa.
- Função: estimular o jogador a pensar antes de responder.

**Acerto:** reconhece a compreensão da lógica da jogada.

**Erro:** propõe observar a situação por outro ângulo.

**Ajuda:** faz uma pergunta-guia em vez de entregar a resposta.

**Visual:** postura aberta, expressão curiosa e aparência esportiva.

## 9. Estados de expressão

Os primeiros assets podem considerar:

```text
normal
happy
wrong
help
```

Estados adicionais, como `thinking`, podem ser adicionados se forem
úteis.

## 10. Estrutura de dados

Os personagens devem ser implementados como dados, evitando seis
conjuntos independentes de lógica.

Exemplo:

```js
const characters = [
  {
    id: "lucas",
    name: "Lucas",
    personality: "energético e motivador",
    expressions: {
      normal: "...",
      happy: "...",
      wrong: "...",
      help: "...",
    },
  },
];
```

As mensagens podem ser organizadas por categorias:

```text
intro
correct
wrong
help
progress
completion
```

## 11. Geração de imagens

A identidade deve permanecer consistente entre expressões.

Cada personagem deve manter:

- características faciais;
- cabelo;
- roupa base;
- proporções;
- estilo artístico;
- paleta associada;
- elementos visuais recorrentes.

A descrição visual detalhada deve ser refinada junto com `DESIGN.md`
antes da geração definitiva.
