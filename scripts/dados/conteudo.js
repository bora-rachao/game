// Carrega fases e questões dos arquivos JSON em data/.
async function buscar(caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error(`Não foi possível carregar ${caminho} (${resposta.status}).`);
  return resposta.json();
}

export async function carregarConteudo() {
  const [fases, banco] = await Promise.all([
    buscar('data/fases.json'),
    buscar('data/capitulo-1.json'),
  ]);
  return { fases, banco };
}
