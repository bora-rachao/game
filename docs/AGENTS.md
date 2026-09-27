# AGENTS.md

## Finalidade

Este arquivo define as regras gerais para agentes de IA que atuarem no
desenvolvimento do jogo educacional de vôlei.

O repositório deve ser tratado como a fonte de verdade do projeto. Um
agente não deve depender do histórico de uma conversa específica para
compreender arquitetura, objetivos, personagens ou decisões já tomadas.

## Antes de alterar o projeto

Antes de implementar ou modificar uma funcionalidade, o agente deve:

1.  Ler este arquivo.
2.  Ler o `README.md` para entender o estado geral do projeto.
3.  Consultar os documentos de `docs/` relacionados à tarefa.
4.  Verificar o código existente antes de criar novos arquivos ou
    funções.
5.  Preservar decisões já documentadas, salvo quando a própria tarefa
    solicitar sua revisão.

## Documentos do projeto

- `AGENTS.md`: regras para agentes de IA e organização do trabalho.
- `ARQUITETURA.md`: organização inicial do código, responsabilidades e
  fluxo.
- `VIABILIDADE.md`: escopo, tecnologias, viabilidade, prioridades,
  relação com o material da disciplina e uso de IA.
- `OBJETIVOS.md`: propósito do jogo, aprendizagem, gameplay, tutoriais e
  experiência do jogador.
- `PERSONAS.md`: seis tutores/personagens, suas personalidades,
  linguagem e comportamento.
- `DESIGN.md`: direção visual, interface, CSS, cores, tipografia e
  assets.
- `MATERIAL_PDF.pdf`: material original fornecido para a disciplina.
- `MATERIAL_MD.md`: transcrição em Markdown do material da disciplina.

## Regras de desenvolvimento

- Não introduzir frameworks ou dependências sem necessidade documentada.
- Manter a proposta atual de HTML, CSS e JavaScript.
- Manter `index.html` como página principal e controlar o fluxo por
  JavaScript.
- Separar código por responsabilidade.
- Evitar arquivos monolíticos.
- Usar aproximadamente 300–400 linhas como sinal para avaliar uma
  divisão; cerca de 500 linhas como limite prático, sem transformar isso
  em regra absoluta.
- Preferir funções pequenas e responsabilidades coesas.
- Não duplicar lógica quando uma abstração simples resolver o problema.
- Não criar arquivos apenas para antecipar necessidades.
- Não remover funcionalidades existentes sem verificar impacto.
- Não modificar partes fora do escopo sem justificativa.
- Preservar acessibilidade básica e responsividade.
- Não colocar chaves, tokens ou segredos no código do navegador.
- Não adicionar bibliotecas quando HTML, CSS ou JavaScript nativos forem
  suficientes.
- Se uma decisão arquitetural mudar, atualizar `ARQUITETURA.md` e,
  quando necessário, `VIABILIDADE.md`.
- Se uma decisão visual mudar, atualizar `DESIGN.md`.
- Se uma decisão sobre personagens mudar, atualizar `PERSONAS.md`.
- Se uma decisão sobre objetivos ou gameplay mudar, atualizar
  `OBJETIVOS.md`.

## Uso de IA

IA pode ser utilizada para ideação, pesquisa, geração de código,
revisão, explicação, criação de assets e prototipação.

Código e assets gerados devem ser revisados, testados e integrados ao
padrão do projeto.

Prompts individuais não são obrigatoriamente armazenados no repositório
neste momento. Caso algum prompt se torne necessário para reproduzir um
asset ou processo importante, a equipe pode documentá-lo separadamente.

## Regra principal

Quando houver dúvida, o agente deve consultar primeiro a documentação
existente e o código atual, evitando assumir que uma conversa anterior
ou uma solução genérica representa a decisão atual do projeto.
