fetch('assets/mapa.svg')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro ao carregar o mapa: ${response.statusText}`);
    }
    return response.text();
  })
  .then(svgData => {
    document.getElementById('mapWrap').insertAdjacentHTML('afterbegin', svgData);
    iniciarMapa();
  })
  .catch(error => {
    console.error("Falha na inicializacao do aplicativo:", error);
  });

function iniciarMapa() {
  const svg = document.getElementById('map-svg');
  const wrap = document.getElementById('mapWrap');

  const blockData = {
    1: { tag: "Seguranca", name: "Guarita", desc: "Entrada principal do campus CCT. Ponto de partida para todos os trajetos." },
    2: { tag: "Administracao", name: "Bloco A", desc: "Recepcao, Secretaria de Graduacao e NAE - Nucleo de Apoio ao Estudante." },
    3: { tag: "Ensino", name: "Bloco B", desc: "Laboratorios e Salas de Aula. Um dos maiores blocos do campus." },
    4: { tag: "Pesquisa", name: "Bloco D", desc: "Laboratorios de pesquisa e ensino." },
    5: { tag: "Engenharia", name: "Bloco E", desc: "Engenharia Eletrica e Auditorio central do bloco." },
    6: { tag: "Ensino", name: "Bloco K", desc: "Salas de aula para diversas turmas e cursos." },
    7: { tag: "Computacao", name: "Bloco F", desc: "Ciencia da Computacao, TADS e Auditorio. Sede dos cursos de TI." },
    8: { tag: "Engenharia", name: "Bloco G", desc: "Engenharia Mecanica e Oficinas. Laboratorios de manufatura." },
    9: { tag: "Licenciaturas", name: "Bloco C", desc: "Licenciatura em Fisica, Matematica e Quimica." },
    10: { tag: "Cultura", name: "Antiga Biblioteca", desc: "Antiga Biblioteca Universitaria do campus." },
    11: { tag: "Cultura", name: "Bloco I", desc: "Biblioteca atual, Auditorio e Salas de Aula." },
    12: { tag: "Engenharia", name: "Bloco H", desc: "Laboratorios e Salas de Aula para Engenharia Civil." },
    13: { tag: "Servicos", name: "Bloco de Apoio", desc: "Prefeitura de Campus, Almoxarifado e Copa dos funcionarios." },
    14: { tag: "Esporte & Saude", name: "Ginasio", desc: "Academia e Espaco da Saude para a comunidade academica." },
    15: { tag: "Convivencia", name: "Centro de Convivencia", desc: "Restaurante Universitario (RU), Centros Academicos e SOE." },
    16: { tag: "Engenharia", name: "Bloco L", desc: "Engenharia de Producao e Secretaria de Engenharia Civil." },
    17: { tag: "Inovacao", name: "Bloco J", desc: "Centro de Projetos Multidisciplinares e Visitacao." },
  };

  let scale = 0.37;
  let tx = -25;
  let ty = -20;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  let tapCount = 0;
  let tapTimer = null;

  document.querySelector('.logo-circle').addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount >= 5) {
      tapCount = 0;
      toggleGrafoDebug();
      return;
    }

    // Reseta se demorar mais de 1.5s entre toques
    tapTimer = setTimeout(() => tapCount = 0, 1500);
  });

  function applyTransform() {
    svg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    svg.style.transformOrigin = '0 0';
  }

  applyTransform();

  wrap.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      tx += dx;
      ty += dy;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      applyTransform();
    }
  }, { passive: true });

  wrap.addEventListener('touchend', () => isDragging = false);

  wrap.addEventListener('mousedown', e => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  wrap.addEventListener('mousemove', e => {
    if (!isDragging) return;
    tx += e.clientX - lastX;
    ty += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    applyTransform();
  });

  wrap.addEventListener('mouseup', () => isDragging = false);
  wrap.addEventListener('mouseleave', () => isDragging = false);

  wrap.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.min(2.5, Math.max(0.3, scale * delta));
    applyTransform();
  }, { passive: false });

  document.getElementById('zoomIn').onclick = () => {
    scale = Math.min(2.5, scale * 1.2);
    applyTransform();
  };

  document.getElementById('zoomOut').onclick = () => {
    scale = Math.max(0.3, scale * 0.8);
    applyTransform();
  };

  const panel = document.getElementById('infoPanel');
  const dim = document.getElementById('overlayDim');

  document.querySelectorAll('.building').forEach(el => {
    el.addEventListener('click', e => {
      const d = blockData[el.dataset.id];
      if (!d) return;

      document.getElementById('panelTag').textContent = d.tag;
      document.getElementById('panelName').textContent = d.name;
      document.getElementById('panelDesc').textContent = d.desc;
      panel.classList.add('visible');
      dim.classList.add('show');
      e.stopPropagation();
    });

  });

  document.getElementById('panelClose').onclick = closePanel;
  dim.onclick = closePanel;

  function closePanel() {
    panel.classList.remove('visible');
    dim.classList.remove('show');
  }

  document.getElementById('searchInput').addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    const hasQuery = q.length > 0;

    svg.classList.toggle('search-active', hasQuery);

    document.querySelectorAll('.building').forEach(el => {
      const d = blockData[el.dataset.id];
      if (!d) return;

      const searchable = `${d.name} ${d.desc} ${d.tag}`.toLowerCase();
      const isMatch = hasQuery && searchable.includes(q);

      el.classList.toggle('search-match', isMatch);
      el.classList.toggle('search-dim', hasQuery && !isMatch);
    });
  });

  function toggleGrafoDebug() {
    // Se já existe, remove
    const existing = document.getElementById('debug-graph');
    if (existing) { existing.remove(); return; }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = 'debug-graph';

    // Desenha arestas
    GRAPH.edges.forEach(([a, b]) => {
      const na = GRAPH.nodes[a], nb = GRAPH.nodes[b];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
      line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
      line.setAttribute('stroke', '#FF6B00');
      line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-dasharray', '6,4');
      line.setAttribute('opacity', '0.7');
      g.appendChild(line);
    });

    // Desenha nós
    Object.entries(GRAPH.nodes).forEach(([id, node]) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.label ? '8' : '5');
      circle.setAttribute('fill', node.label ? '#003B71' : '#90CAF9');
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);

      if (node.label) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x + 10);
        text.setAttribute('y', node.y + 4);
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#003B71');
        text.setAttribute('font-weight', '700');
        text.textContent = node.label;
        g.appendChild(text);
      }
    });

    svg.appendChild(g);
  }
}