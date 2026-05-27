// js/graph.js
const GRAPH = {
  nodes: {
    // Entradas de blocos
    "guarita":    { x: 513, y: 748, label: "Guarita" },
    "blocoA_in":  { x: 524, y: 680, label: "Entrada Bloco A" },
    "blocoB_in":  { x: 480, y: 620, label: "Entrada Bloco B" },
    "blocoF_in":  { x: 348, y: 370, label: "Entrada Bloco F" },
    // Cruzamentos de caminho (nós auxiliares, sem nome visível)
    "cruz_1":     { x: 513, y: 720 },
    "cruz_2":     { x: 490, y: 650 },
    // ... etc
  },
  edges: [
    // [ nóA, nóB, distância ]
    ["guarita",   "cruz_1",   30],
    ["cruz_1",    "blocoA_in", 45],
    ["cruz_1",    "cruz_2",   60],
    ["cruz_2",    "blocoB_in", 40],
    // ... etc
  ]
};