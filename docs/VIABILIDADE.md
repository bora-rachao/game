# Viabilidade

## 1. Visão geral

O projeto consiste em um jogo educacional de vôlei executado no
navegador, desenvolvido inicialmente com HTML, CSS e JavaScript.

A proposta combina aprendizagem e interação lúdica: o jogador aprende
conceitos de vôlei enquanto avança por desafios acompanhados por um
tutor escolhido no início da experiência.

O escopo deve permanecer compatível com o prazo acadêmico e com a
capacidade de desenvolvimento da equipe.

## 2. Escopo inicial viável

### Prioridade alta

- página única;
- HTML, CSS e JavaScript;
- tela inicial;
- seleção de um entre seis tutores;
- apresentação/tutorial;
- sistema de diálogo;
- sistema de desafios;
- alternativas e validação;
- feedback correto/incorreto;
- dicas;
- progresso simples;
- progressão entre desafios;
- tela de conclusão;
- responsividade básica.

### Prioridade média

- diferentes tipos de desafio;
- animações;
- mais expressões dos personagens;
- sons;
- progressão de dificuldade refinada;
- pequenos elementos de gamificação;
- situações visuais de quadra.

### Prioridade baixa ou futura

- ajuste dinâmico de dificuldade por IA;
- diálogos gerados dinamicamente;
- personalização avançada;
- multiplayer;
- persistência em servidor;
- sistemas sociais;
- integração com o BoraRachão;
- recursos que exijam backend.

## 3. Tecnologias

A implementação inicial utiliza:

- HTML5;
- CSS3;
- JavaScript;
- APIs nativas do navegador quando necessário.

A proposta reduz dependências e facilita execução e publicação em
hospedagem estática.

## 4. Relação com o material da disciplina

O material fornecido aborda Flow, Taxonomia de Bloom, tripé
Tecnologia/Pedagogia/Social, IA no game design, Learner Experience,
prompt engineering, prototipação e desenvolvimento web de jogos.

Esses conceitos devem orientar decisões, mas não precisam ser
transformados individualmente em funcionalidades.

### Flow

A progressão deve evitar desafios excessivamente difíceis ou fáceis.

No protótipo, a progressão pode ser planejada manualmente. Dynamic
Difficulty Adjustment por IA é uma possibilidade futura.

### Bloom

Os desafios podem evoluir de:

```text
lembrar → entender → aplicar → analisar → avaliar → criar
```

Não é necessário implementar todos os níveis no primeiro protótipo.

### Tecnologia, Pedagogia e Social

Tecnologia aparece na interface e implementação.

Pedagogia aparece no conteúdo, desafios e feedback.

Social pode aparecer por meio dos tutores e interação narrativa. Não é
necessário criar multiplayer apenas para atender ao conceito.

### Learner Experience

A interface deve facilitar a aprendizagem. O jogador deve entender onde
está, o que precisa fazer, por que recebeu determinado feedback e como
continuar.

## 5. IA no desenvolvimento

IA pode auxiliar em:

- ideação;
- organização de requisitos;
- geração e revisão de código;
- explicação e refatoração;
- testes;
- criação de personagens;
- cenários;
- elementos visuais;
- prototipação.

A equipe deve revisar e validar resultados gerados.

IA dentro do jogo não é requisito inicial. NPC conversacional, geração
dinâmica de perguntas e DDA por IA são possibilidades futuras.

### Uso de inteligência artificial

O projeto utiliza ferramentas de inteligência artificial como apoio
ao desenvolvimento, geração de assets, ideação, revisão e
experimentação.

As ferramentas não são consideradas fonte de verdade do projeto.
A documentação oficial do repositório representa as decisões
consolidadas da equipe.

### Geração de assets

O Gemini será utilizado principalmente para geração e edição de
personagens, expressões, cenários e outros recursos visuais.

Os arquivos PERSONAS.md e DESIGN.md servem como referências para
manter consistência entre os assets.

### Desenvolvimento

Ferramentas agentic podem ser utilizadas para implementação,
refatoração, testes e revisão do código.

Entre as ferramentas avaliadas estão:

- VS Code + GitHub Copilot
- Qoder
- Google Antigravity
- Cursor
- Codex
- Claude Code

A escolha definitiva da ferramenta pode variar conforme a tarefa,
disponibilidade e limitações das versões gratuitas.

### Regra de documentação

Ideias ou alterações sugeridas por ferramentas de IA não são
consideradas decisões oficiais até serem avaliadas pela equipe e
incorporadas à documentação do projeto.

A documentação deve permanecer independente da ferramenta de IA
utilizada.

## 6. Viabilidade técnica

O núcleo do jogo é viável sem backend:

```text
index.html
   ↓
JavaScript
   ↓
estado do jogo
   ↓
telas / desafios / diálogos
   ↓
CSS + assets
```

Perguntas, personagens e textos podem ser representados como dados
JavaScript.

## 7. Manutenibilidade

Como diferentes integrantes e agentes podem atuar no projeto:

- arquivos devem ter responsabilidade clara;
- funções devem ser pequenas;
- dados devem ficar separados da lógica quando possível;
- nomes devem ser descritivos;
- duplicação deve ser evitada;
- decisões importantes devem ser documentadas.

A referência inicial de tamanho é aproximadamente 300–400 linhas. Ao se
aproximar de 500, deve-se avaliar uma divisão. O tamanho não é uma regra
absoluta.

## 8. Viabilidade dos assets

Os seis tutores podem compartilhar uma mesma estrutura visual de
interface.

Suas diferenças devem estar principalmente em identidade, aparência,
personalidade, linguagem e expressões.

CSS e componentes devem ser reutilizáveis para balões, botões, cards e
telas.

## 9. Limites

No primeiro ciclo devem ser evitados:

- backend desnecessário;
- autenticação;
- banco de dados;
- multiplayer;
- sistemas complexos de IA;
- excesso de animações;
- excesso de tipos de desafios;
- grandes árvores narrativas;
- funcionalidades sem contribuição educacional ou de gameplay.

## 10. Critérios de priorização

Uma funcionalidade deve ser priorizada quando contribui diretamente
para:

1.  aprendizagem;
2.  jogabilidade;
3.  clareza da experiência;
4.  qualidade visual essencial;
5.  avaliação acadêmica;
6.  demonstração do funcionamento.

## 11. Prototipação

O primeiro protótipo deve validar o fluxo antes do acabamento completo:

```text
Início
→ escolher tutor
→ tutor apresenta o jogo
→ tutorial
→ primeiro desafio
→ resposta
→ feedback
→ próximo desafio
→ conclusão
```

## 12. Documentação e avaliação

O manual do PI estabelece a entrega do repositório com código-fonte,
documentação em PDF ou Markdown, apresentação e README, entre outros
elementos.

Para o quarto semestre, o manual também prevê boas práticas de Interação
Humano-Computador e Experiência do Usuário, criação de personas e
criação da jornada do usuário.

Esses pontos devem ser considerados na evolução da documentação e da
apresentação.

## 13. Estado atual

Este documento é uma primeira versão de viabilidade.

As decisões podem ser alteradas após o primeiro protótipo, testes da
equipe, feedback do professor e validação do conteúdo educacional.
