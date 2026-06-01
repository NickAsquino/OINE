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
      1:  { tag: "Segurança",       name: "Guarita",                 desc: "Controle de acesso principal ao campus, vigilância e informações iniciais.", nodes: ["guarita"], imagens: [] },
      2:  { tag: "Administração",   name: "Bloco A",                 desc: "Recepção principal do CCT, Direção Geral, Secretaria de Ensino de Graduação e NAE.", nodes: ["blocoA_in"], imagens: [] },
      3:  { tag: "Ensino Prático",  name: "Bloco B",                 desc: "Laboratórios práticos focados em Física e Química, além de salas de aula.", nodes: ["blocoB_in"], imagens: [] },
      4:  { tag: "Pesquisa",        name: "Bloco D",                 desc: "Laboratórios específicos, núcleos de pesquisa avançada e espaços técnicos.", nodes: ["blocoD_in"], imagens: [] },
      5:  { tag: "Engenharia",      name: "Bloco E",                 desc: "Departamento de Engenharia Elétrica, auditório do bloco e laboratórios da área.", nodes: ["blocoE1_in", "blocoE2_in"], imagens: [] },
      6:  { tag: "Ensino Teórico",  name: "Bloco K",                 desc: "Principal prédio de salas de aula teóricas do campus, distribuídas em três andares.", nodes: ["blocoK1_in", "blocoK2_in"], imagens: [] },
      7:  { tag: "Computação",      name: "Bloco F",                 desc: "Departamento de Ciência da Computação e TADS. Possui laboratórios de informática e auditório.", nodes: ["blocoF1_in", "blocoF2_in", "blocoF3_in"], imagens: [] },
      8:  { tag: "Engenharia",      name: "Bloco G",                 desc: "Departamento de Engenharia Mecânica, abrigando oficinas e maquinário pesado.", nodes: ["blocoG_in"], imagens: [] },
      9:  { tag: "Licenciaturas",   name: "Bloco C",                 desc: "Departamentos e coordenações dos cursos de Licenciatura em Física, Matemática e Química.", nodes: ["blocoC_in"], imagens: [] },
      10: { tag: "Administração",   name: "Antiga Biblioteca",       desc: "Prédio da antiga Biblioteca Universitária", nodes: ["antiga_biblioteca_in"], imagens: [] },
      11: { tag: "Estudo & Cultura",name: "Bloco I",                 desc: "Nova Biblioteca Universitária, salas de estudo individuais/em grupo e um auditório.", nodes: ["blocoI_in"], imagens: [] },
      12: { tag: "Engenharia",      name: "Bloco H",                 desc: "Laboratórios pesados e salas de aula dedicadas ao curso de Engenharia Civil.", nodes: ["blocoH_in"], imagens: [] },
      13: { tag: "Serviços Gerais", name: "Bloco de Apoio",          desc: "Prefeitura do Campus, almoxarifado, copa e setor de manutenção.", nodes: ["bloco_de_apoio_in"], imagens: [] },
      14: { tag: "Esporte e Saúde", name: "Ginásio",                 desc: "Ginásio de esportes, quadras poliesportivas, academia e Espaço da Saúde.", nodes: ["ginasio1_in", "ginasio2_in"], imagens: [] },
      15: { tag: "Restaurante",     name: "Restaurante Universitário", desc: "Restaurante Universitário (RU), Centros Acadêmicos (C.A.s), xerox e área de convivência.", nodes: ["convivencia_in"], imagens: [] },
      16: { tag: "Engenharia",      name: "Bloco L",                 desc: "Departamento de Engenharia de Produção e Sistemas, e Secretaria da Engenharia Civil.", nodes: ["blocoL_in"], imagens: [] },
      17: { tag: "Inovação",        name: "Bloco J",                 desc: "Centro de Projetos e Inovação. Abriga as equipes de competição (Baja, Fórmula SAE) e oficinas.", nodes: ["blocoJ_in"], imagens: ["assets/blocos/blocoJ/blocoJ-img1.jpeg", "assets/blocos/blocoJ/blocoJ-img2.jpg", "assets/blocos/blocoJ/blocoJ-img3.jpg"] },
  };

  let scale = 0.37;
  let tx = -25;
  let ty = -20;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  let tapCount = 0;
  let tapTimer = null;

  let blocoAtivo = null;

  let carrosselIndex = 0;

  document.querySelector('.logo-circle').addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount >= 1) {
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

      document.querySelectorAll('.building.is-selected').forEach(building => {
        building.classList.remove('is-selected');
      });
      el.classList.add('is-selected');
      blocoAtivo = el.dataset.id;

      document.getElementById('panelTag').textContent = d.tag;
      document.getElementById('panelName').textContent = d.name;
      document.getElementById('panelDesc').textContent = d.desc;
      abrirCarrossel(d.imagens); 
      panel.classList.add('visible');
      dim.classList.add('show');
      e.stopPropagation();
    });
  });

  document.querySelector('.panel-btn').addEventListener('click', () => {
    if (blocoAtivo) {
      desenharRota(blocoAtivo);
      closePanel();
    }
  });

  document.getElementById('panelClose').onclick = closePanel;
  dim.onclick = closePanel;

  function closePanel() {
    panel.classList.remove('visible');
    dim.classList.remove('show');
    document.querySelectorAll('.building.is-selected').forEach(building => {
      building.classList.remove('is-selected');
    });
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
    const existing = document.getElementById('debug-graph');
    if (existing) { existing.remove(); return; }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = 'debug-graph';

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

  function desenharRota(blockId) {
    const anterior = document.getElementById('rota-ativa');
    if (anterior) anterior.remove();

    const d = blockData[blockId];
    if (!d) return;

    const resultados = d.nodes
      .map(no => dijkstra("ponto_inicial", no))
      .filter(r => r !== null);

    if (resultados.length === 0) return;

    const melhor = resultados.sort((a, b) => a.distancia - b.distancia)[0];

    const pontos = melhor.caminho
      .map(id => GRAPH.nodes[id])
      .map(no => `${no.x},${no.y}`)
      .join(' ');

    // Cria o elemento SVG
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = 'rota-ativa';

    const linha = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    linha.setAttribute('points', pontos);
    linha.setAttribute('fill', 'none');
    linha.setAttribute('stroke', '#FF6B00');
    linha.setAttribute('stroke-width', '6');
    linha.setAttribute('stroke-linecap', 'round');
    linha.setAttribute('stroke-linejoin', 'round');
    linha.setAttribute('opacity', '0.85');

    g.appendChild(linha);
    svg.appendChild(g);
  }

  function abrirCarrossel(imagens) {
    const carrossel = document.getElementById('carrossel');
    const track = document.getElementById('carrosselTrack');
    const dots = document.getElementById('carrosselDots');

    // Limpa
    track.innerHTML = '';
    dots.innerHTML = '';
    carrosselIndex = 0;

    if (!imagens || imagens.length === 0) {
      carrossel.classList.remove('visivel');
      return;
    }

    // Cria imagens
    imagens.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.classList.add('carrossel-slide');

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Foto ${i + 1}`;

      slide.appendChild(img);
      track.appendChild(slide);

      // Dot
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('ativo');
      dot.addEventListener('click', () => irParaSlide(i));
      dots.appendChild(dot);
    });

    carrossel.classList.add('visivel');

    // Swipe touch no carrossel
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? proximoSlide(imagens.length) : slideAnterior(imagens.length);
      }
    }, { passive: true });
  }

  function irParaSlide(index) {
    carrosselIndex = index;
    document.getElementById('carrosselTrack').style.transform = 
      `translateX(-${index * 100}%)`;
    document.querySelectorAll('#carrosselDots span').forEach((d, i) => {
      d.classList.toggle('ativo', i === index);
    });
  }

  function proximoSlide(total) {
    irParaSlide((carrosselIndex + 1) % total);
  }

  function slideAnterior(total) {
    irParaSlide((carrosselIndex - 1 + total) % total);
  }
}