// js/dijkstra.js
function dijkstra(origem, destino) {
  const nos = GRAPH.nodes;
  const arestas = GRAPH.edges;

  const adj = {};
  Object.keys(nos).forEach(id => adj[id] = []);
  arestas.forEach(([a, b, dist]) => {
    adj[a].push({ no: b, dist });
    adj[b].push({ no: a, dist });
  });

  // Distâncias e predecessores
  const dist  = {};
  const prev  = {};
  const visited = new Set();

  Object.keys(nos).forEach(id => dist[id] = Infinity);
  dist[origem] = 0;

  while (true) {
    // Pega o nó não visitado com menor distância
    let u = null;
    Object.keys(dist).forEach(id => {
      if (!visited.has(id) && (u === null || dist[id] < dist[u])) u = id;
    });

    if (u === null || dist[u] === Infinity) break;
    if (u === destino) break;

    visited.add(u);

    adj[u].forEach(({ no: v, dist: peso }) => {
      const nova = dist[u] + peso;
      if (nova < dist[v]) {
        dist[v] = nova;
        prev[v] = u;
      }
    });
  }

  // Reconstrói o caminho
  if (dist[destino] === Infinity) return null; // sem caminho

  const caminho = [];
  let atual = destino;
  while (atual) {
    caminho.unshift(atual);
    atual = prev[atual];
  }

  return { caminho, distancia: dist[destino] };
}