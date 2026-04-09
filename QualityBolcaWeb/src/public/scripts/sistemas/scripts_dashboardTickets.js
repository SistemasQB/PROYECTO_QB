/* ════════════════════════════════════════════
   DASHBOARD TICKETS — scripts_dashboardTickets.js
   Light Deep Edition
   ════════════════════════════════════════════ */

let DATOS = [];
let chartsInstances = {};
let state = {
  solicitado: [],
  delMes: [...TICKETS]
}

let porEstatus, total, abiertos, enProgreso, pendientes, cerrados, tasaCierre;
let tiempoProm, porPrioridad, porCategoria, porDep;
let diasLabels, diasAbiertos, diasCerrados;
let semanalVals, semanalLabels;
let agentesOrdenados, slaData, slaAvgNum;

/* ════ PALETA CLARA ════ */
const PAL = {
  blue:   '#2563eb',
  teal:   '#0d9488',
  amber:  '#d97706',
  rose:   '#e11d48',
  indigo: '#4f46e5',
  violet: '#7c3aed',
  sky:    '#0284c7',
};

/* ════ INIT ════ */
document.addEventListener('DOMContentLoaded', () => {
  TICKETS.forEach(t => {
    if (typeof t.datosTicket === 'string') t.datosTicket = JSON.parse(t.datosTicket);
    const obs = t.datosTicket?.observaciones?.[0];
    if (obs?.fecha) t.semana = obtenerSemana(obs.fecha);
  });

  DATOS = [...TICKETS];

  // Defaults de fechas
  const hoy = new Date();
  const hace30 = new Date(); hace30.setDate(hoy.getDate() - 30);
  document.getElementById('fechaFin').value    = formatDate(hoy);
  document.getElementById('fechaInicio').value = formatDate(hace30);

  // Quick range buttons
  document.querySelectorAll('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qr-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const days = btn.dataset.days;
      if (days === 'all') {
        document.getElementById('fechaInicio').value = '';
        document.getElementById('fechaFin').value    = '';
      } else {
        const fin   = new Date();
        const inicio = new Date();
        inicio.setDate(fin.getDate() - parseInt(days));
        document.getElementById('fechaInicio').value = formatDate(inicio);
        document.getElementById('fechaFin').value    = formatDate(fin);
      }
    });
  });

  Contadores(DATOS);
  renderizado();

  document.getElementById('hdate').innerHTML =
    new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
    + '<br>Sistema de Gestión TI';
});

/* ════ FETCH ════ */
async function fetchData() {
  const btn    = document.getElementById('fetchBtn');
  const inicio = document.getElementById('fechaInicio').value;
  const fin    = document.getElementById('fechaFin').value;

  if (inicio && fin && new Date(inicio) > new Date(fin)) {
    alert('La fecha de inicio no puede ser mayor que la fecha final.');
    return;
  }

  btn.classList.add('loading');
  btn.disabled = true;

  try {
    
    const resp = await solicitudInformacion('apiDashboard', {fechaInicio: inicio, fechaFin: fin, _csrf: tok});
    if (!resp.ok) throw new Error(`Error ${resp.status}: ${resp.msg} `);
    state.solicitado = resp.data;
    
    

    state.solicitado.forEach(t => {
      if (typeof t.datosTicket === 'string') t.datosTicket = JSON.parse(t.datosTicket);
      const obs = t.datosTicket?.observaciones?.[0];
      if (obs?.fecha) t.semana = obtenerSemana(obs.fecha);
    });

    
    mostrarResultado(inicio, fin, state.solicitado.length);
    Contadores(state.solicitado);
    renderizado(true);

  } catch (err) {
    console.error('fetchData error:', err);
    alert(`No se pudo obtener los datos: ${err.message}`);
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

function mostrarResultado(inicio, fin, n) {
  const el   = document.getElementById('rangeResult');
  const text = document.getElementById('rangeResultText');
  const fmt  = s => s ? new Date(s + 'T00:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'}) : '—';
  text.innerHTML = `📅 ${fmt(inicio)} → ${fin ? fmt(fin) : 'hoy'} &nbsp;·&nbsp; <strong>${n}</strong> tickets encontrados`;
  el.style.display = 'block';
}

/* ════ UTILIDADES ════ */
function formatDate(d) { return d.toISOString().split('T')[0]; }

function contarPorCampo(campo, datos = DATOS) {
  return datos.reduce((acc, t) => {
    const val = t.datosTicket[campo] || 'sin_dato';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function obtenerSemana(fecha) {
  const date = new Date(fecha);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function agruparPorDia(data = DATOS) {
  completos = data.filter(t => t.datosTicket.observaciones);
  const fechas = new Set(completos.map(t =>
    new Date(t.datosTicket.observaciones[0].fecha).toLocaleDateString('es-ES')
  ));
  const dias = {};
  for (const f of fechas) dias[f] = { abiertos: 0, cerrados: 0 };

  completos.forEach(t => {
    const obs = t.datosTicket.observaciones[0];
    const dia = obs.fecha ? new Date(obs.fecha).toLocaleDateString('es-ES') : null;
    if (!dia) return;
    if (obs.estatus === 'closed' || obs.estatus === 'resolved') dias[dia].cerrados++;
    else dias[dia].abiertos++;
  });
  return dias;
}

function agruparPorSemana(datos = DATOS) {
  const semanas = new Set(datos.map(t => t.semana));
  const totales = {};
  for (const s of semanas) totales[s] = datos.filter(t => t.semana === s).length;
  return totales;
}

function calcularSLAPorPrioridad(data = DATOS) {
  const grupos   = { critical:[], high:[], medium:[], low:[] };
  const colores  = { critical: PAL.rose,  high: PAL.amber, medium: PAL.blue,  low: PAL.teal };
  const etiq     = { critical:'Crítica',   high:'Alta',     medium:'Media',    low:'Baja' };

  data.forEach(t => {
    const { prioridad, slaConsumido, slaHoras } = t.datosTicket;
    if (grupos[prioridad] !== undefined && slaHoras > 0)
      grupos[prioridad].push((slaConsumido / 3600) <= slaHoras);
  });

  return Object.entries(grupos)
    .filter(([, arr]) => arr.length > 0)
    .map(([prio, arr]) => ({
      label: `${etiq[prio]} (${arr.length})`,
      v: parseFloat(((arr.filter(v => v).length / arr.length) * 100).toFixed(1)),
      c: colores[prio]
    }));
}

function calcularTiempoPromedioResolucion(data = DATOS) {
  const cerrados = data.filter(t =>
    t.datosTicket.estatus === 'closed' || t.datosTicket.estatus === 'resolved'
  );
  if (!cerrados.length) return 0;
  const totalSeg = cerrados.reduce((s, t) => s + (t.datosTicket.slaConsumido || 0), 0);
  return (totalSeg / cerrados.length / 3600).toFixed(1);
}

/* ════ HELPER: gradiente vertical en canvas ════ */
function gradV(ctx, top, bottom, alpha1 = 0.25, alpha2 = 0.0) {
  // top/bottom son hex colors
  const hex2rgb = h => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '0,0,0'; };
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0,   `rgba(${hex2rgb(top)},${alpha1})`);
  grad.addColorStop(1,   `rgba(${hex2rgb(bottom)},${alpha2})`);
  return grad;
}

/* ════ CONTADORES ════ */
function Contadores(data = DATOS) {
  porEstatus  = contarPorCampo('estatus', data);
  total       = data.length;
  abiertos    = porEstatus['open']        || 0;
  enProgreso  = porEstatus['in_progress'] || porEstatus['progress'] || 0;
  pendientes  = porEstatus['pending']     || 0;
  cerrados    = (porEstatus['closed'] || 0) + (porEstatus['resolved'] || 0);
  tasaCierre  = total > 0 ? ((cerrados / total) * 100).toFixed(1) : 0;

  tiempoProm   = calcularTiempoPromedioResolucion(data);
  porPrioridad = contarPorCampo('prioridad', data);
  porCategoria = contarPorCampo('categoria', data);
  porDep       = contarPorCampo('departamento', data);

  const porAgente = data
    .filter(t => t.datosTicket.estatus === 'closed' || t.datosTicket.estatus === 'resolved')
    .reduce((acc, t) => {
      const a = t.datosTicket.asignadoA;
      if (a) acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});
  agentesOrdenados = Object.entries(porAgente).sort((a,b) => b[1]-a[1]).slice(0,5);

  const diasData = agruparPorDia(data);
  const meses    = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const keys     = Object.keys(diasData).sort((a,b) => {
    const p = s => { const [d,m,y]=s.split('/'); return new Date(+y,+m-1,+d); };
    return p(a) - p(b);
  });
  diasLabels   = keys.map(k => { const [d,m] = k.split('/'); return `${parseInt(d)} ${meses[parseInt(m)-1]}`; });
  diasAbiertos = keys.map(k => diasData[k].abiertos);
  diasCerrados = keys.map(k => diasData[k].cerrados);

  const sw = agruparPorSemana(data);
  semanalLabels = Object.keys(sw).sort((a,b)=>a-b).map(k => `Sem ${k}`);
  semanalVals   = sw;

  slaData   = calcularSLAPorPrioridad(data);
  slaAvgNum = slaData.length
    ? parseFloat((slaData.reduce((s,d) => s+d.v, 0) / slaData.length).toFixed(1))
    : 0;
}

/* ════ RENDER ════ */
function renderizado(update = false) {
  if (update) {
    Object.values(chartsInstances).forEach(c => c.destroy());
    chartsInstances = {};
    document.getElementById('kpi-grid').innerHTML    = '';
    document.getElementById('leaderboard').innerHTML = '';
    document.getElementById('sla-meters').innerHTML  = '';
    document.getElementById('estatus-legend').innerHTML = '';
  }

  /* ── Defaults Chart.js ── */
  Chart.defaults.color       = '#64748b';
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.font.size   = 11;

  /* ── Tooltip personalizado (compartido) ── */
  const tooltipStyle = {
    backgroundColor: 'rgba(15,37,84,0.90)',
    titleColor: '#e2e8f0',
    bodyColor:  '#94a3b8',
    borderColor: 'rgba(37,99,235,0.25)',
    borderWidth: 1,
    padding: 10,
    cornerRadius: 8,
    titleFont: { family: "'DM Serif Display', serif", size: 13 },
    bodyFont:  { family: "'DM Sans', sans-serif",     size: 11 },
    displayColors: true,
    boxWidth: 8, boxHeight: 8, boxPadding: 4,
  };

  /* ── KPIs ── */
  const kpiDef = [
    { label:'Total Tickets', value:total,          sub:'registros totales',              color:PAL.blue,   bg:'rgba(37,99,235,0.07)',   border:'rgba(37,99,235,0.15)',  icon:'🎫' },
    { label:'Abiertos',      value:abiertos,        sub:'sin asignar / nuevos',           color:PAL.sky,    bg:'rgba(2,132,199,0.07)',   border:'rgba(2,132,199,0.15)',  icon:'📂' },
    { label:'En Progreso',   value:enProgreso,      sub:'en atención activa',             color:PAL.amber,  bg:'rgba(217,119,6,0.07)',   border:'rgba(217,119,6,0.15)', icon:'⚙️' },
    { label:'Pendientes',    value:pendientes,      sub:'esperando respuesta',            color:PAL.violet, bg:'rgba(124,58,237,0.07)', border:'rgba(124,58,237,0.15)',icon:'⏳' },
    { label:'Cerrados',      value:cerrados,        sub:`${tasaCierre}% tasa de cierre`, color:PAL.teal,   bg:'rgba(13,148,136,0.07)', border:'rgba(13,148,136,0.15)', icon:'✅' },
    { label:'Tiempo Prom.',  value:tiempoProm+'h',  sub:'promedio de resolución',         color:PAL.rose,   bg:'rgba(225,29,72,0.07)',   border:'rgba(225,29,72,0.15)',  icon:'⏱️' },
  ];

  const kg = document.getElementById('kpi-grid');
  kpiDef.forEach((k, i) => {
    kg.innerHTML += `<div class="kpi" style="--kpi-color:${k.color};--kpi-bg:${k.bg};--kpi-border:${k.border};animation-delay:${i*0.06}s">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>`;
  });

  /* ══════════════════════════════════════════
     GRÁFICO 1 — Estatus · Doughnut con centro
     ══════════════════════════════════════════ */
  const estatusOrden  = ['open','in_progress','pending','closed','resolved'];
  const estatusLabel  = { open:'Abierto', in_progress:'En Progreso', pending:'Pendiente', closed:'Cerrado', resolved:'Resuelto' };
  const estatusColors = ['#2563eb','#d97706','#7c3aed','#0d9488','#0284c7'];

  const estDat  = estatusOrden.map(k => porEstatus[k] || 0).filter((v,i,a) => v > 0 || (a.splice(i,1), false));
  // reconstruir sincronizados
  const estSync = estatusOrden
    .map((k,i) => ({ k, v: porEstatus[k]||0, c: estatusColors[i] }))
    .filter(x => x.v > 0);
  const estLabs  = estSync.map(x => estatusLabel[x.k]);
  const estVals  = estSync.map(x => x.v);
  const estCols  = estSync.map(x => x.c);

  // Plugin: número total en centro
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      if (chart.config.type !== 'doughnut') return;
      const { ctx, chartArea: { width, height, left, top } } = chart;
      const cx = left + width / 2;
      const cy = top  + height / 2;
      ctx.save();
      ctx.font = `400 26px 'DM Serif Display', serif`;
      ctx.fillStyle = '#0f2554';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(total, cx, cy - 8);
      ctx.font = `500 10px 'DM Sans', sans-serif`;
      ctx.fillStyle = '#94a3b8';
      ctx.letterSpacing = '1px';
      ctx.fillText('TOTAL', cx, cy + 12);
      ctx.restore();
    }
  };

  chartsInstances.estatus = new Chart(document.getElementById('chartEstatus'), {
    type: 'doughnut',
    plugins: [centerTextPlugin],
    data: {
      labels: estLabs,
      datasets: [{
        data: estVals,
        backgroundColor: estCols.map(c => c + '22'),
        borderColor: estCols,
        borderWidth: 2,
        hoverBackgroundColor: estCols.map(c => c + '44'),
        hoverBorderWidth: 3,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle, callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.parsed} (${((ctx.parsed/total)*100).toFixed(1)}%)`
        }}
      },
      animation: { animateRotate: true, duration: 1000, easing: 'easeInOutQuart' }
    }
  });

  // Leyenda custom estatus
  const leg = document.getElementById('estatus-legend');
  estSync.forEach(x => {
    leg.innerHTML += `<div class="cl-item">
      <div class="cl-dot" style="background:${x.c}"></div>
      ${estatusLabel[x.k]}: <strong style="color:${x.c};margin-left:3px">${x.v}</strong>
    </div>`;
  });

  /* ══════════════════════════════════════════
     GRÁFICO 2 — Prioridad · Barras con gradiente
     ══════════════════════════════════════════ */
  const prioOrden  = ['critical','high','medium','low'];
  const prioLabel  = { critical:'Crítica', high:'Alta', medium:'Media', low:'Baja' };
  const prioCols   = [PAL.rose, PAL.amber, PAL.blue, PAL.teal];

  // Plugin: etiqueta de valor encima de cada barra
  const barValuePlugin = {
    id: 'barValue',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      chart.getDatasetMeta(0).data.forEach((bar, i) => {
        const val = data.datasets[0].data[i];
        if (!val) return;
        ctx.save();
        ctx.font = `600 11px 'DM Sans', sans-serif`;
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText(val, bar.x, bar.y - 6);
        ctx.restore();
      });
    }
  };

  const prioCtx = document.getElementById('chartPrioridad').getContext('2d');
  const prioGrads = prioCols.map(c => {
    const g = prioCtx.createLinearGradient(0, 0, 0, 240);
    g.addColorStop(0,   c + 'cc');
    g.addColorStop(1,   c + '33');
    return g;
  });

  chartsInstances.prioridad = new Chart(prioCtx, {
    type: 'bar',
    plugins: [barValuePlugin],
    data: {
      labels: prioOrden.map(k => prioLabel[k]),
      datasets: [{
        data: prioOrden.map(k => porPrioridad[k] || 0),
        backgroundColor: prioGrads,
        borderColor: prioCols,
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.55,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipStyle },
      scales: {
        x: { grid: { color: 'rgba(37,99,235,0.06)' }, ticks: { color: '#64748b' } },
        y: { grid: { color: 'rgba(37,99,235,0.06)' }, ticks: { color: '#64748b' }, beginAtZero: true }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });

  /* ══════════════════════════════════════════
     GRÁFICO 3 — Categorías · Radar
     ══════════════════════════════════════════ */
  const catEntries = Object.entries(porCategoria).sort((a,b) => b[1]-a[1]).slice(0, 8);
  chartsInstances.categoria = new Chart(document.getElementById('chartCategoria'), {
    type: 'radar',
    data: {
      labels: catEntries.map(([k]) => k),
      datasets: [{
        data: catEntries.map(([,v]) => v),
        backgroundColor: 'rgba(13,148,136,0.10)',
        borderColor: PAL.teal,
        borderWidth: 2,
        pointBackgroundColor: PAL.teal,
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: PAL.teal,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipStyle },
      scales: {
        r: {
          grid:        { color: 'rgba(37,99,235,0.08)' },
          angleLines:  { color: 'rgba(37,99,235,0.08)' },
          ticks:       { display: false, backdropColor: 'transparent' },
          pointLabels: { color: '#64748b', font: { size: 10 } }
        }
      },
      animation: { duration: 1000 }
    }
  });

  /* ══════════════════════════════════════════
     GRÁFICO 4 — Timeline · Line con relleno de gradiente
     ══════════════════════════════════════════ */
  const tlCtx = document.getElementById('chartTimeline').getContext('2d');
  const gradBlue = tlCtx.createLinearGradient(0, 0, 0, 190);
  gradBlue.addColorStop(0,   'rgba(37,99,235,0.20)');
  gradBlue.addColorStop(0.7, 'rgba(37,99,235,0.04)');
  gradBlue.addColorStop(1,   'rgba(37,99,235,0)');

  const gradTeal = tlCtx.createLinearGradient(0, 0, 0, 190);
  gradTeal.addColorStop(0,   'rgba(13,148,136,0.16)');
  gradTeal.addColorStop(0.7, 'rgba(13,148,136,0.03)');
  gradTeal.addColorStop(1,   'rgba(13,148,136,0)');

  chartsInstances.timeline = new Chart(tlCtx, {
    type: 'line',
    data: {
      labels: diasLabels,
      datasets: [
        {
          label: 'Abiertos',
          data: diasAbiertos,
          borderColor: PAL.blue,
          backgroundColor: gradBlue,
          fill: true, tension: 0.42,
          pointRadius: diasLabels.length > 30 ? 0 : 3.5,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: PAL.blue,
          pointBorderWidth: 2,
          borderWidth: 2.5,
        },
        {
          label: 'Cerrados',
          data: diasCerrados,
          borderColor: PAL.teal,
          backgroundColor: gradTeal,
          fill: true, tension: 0.42,
          pointRadius: diasLabels.length > 30 ? 0 : 3.5,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: PAL.teal,
          pointBorderWidth: 2,
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { ...tooltipStyle, mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: 'rgba(37,99,235,0.05)' }, ticks: { color: '#94a3b8', maxTicksLimit: 12 } },
        y: { grid: { color: 'rgba(37,99,235,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
      },
      animation: { duration: 1000, easing: 'easeInOutQuart' }
    }
  });

  /* ══════════════════════════════════════════
     GRÁFICO 5 — Departamentos · Barras horizontales con gradiente
     ══════════════════════════════════════════ */
  const depEntries = Object.entries(porDep).sort((a,b) => b[1]-a[1]);
  const depPalette = [PAL.blue, PAL.teal, PAL.indigo, PAL.amber, PAL.rose, PAL.violet, PAL.sky];

  const depCtx  = document.getElementById('chartDep').getContext('2d');
  const depGrads = depEntries.map((_, i) => {
    const c = depPalette[i % depPalette.length];
    const g = depCtx.createLinearGradient(depCtx.canvas.width, 0, 0, 0);
    g.addColorStop(0,   c + 'dd');
    g.addColorStop(1,   c + '22');
    return g;
  });

  chartsInstances.dep = new Chart(depCtx, {
    type: 'bar',
    data: {
      labels: depEntries.map(([k]) => k),
      datasets: [{
        data: depEntries.map(([,v]) => v),
        backgroundColor: depGrads,
        borderColor: depEntries.map((_, i) => depPalette[i % depPalette.length]),
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.65,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipStyle },
      scales: {
        x: { grid: { color: 'rgba(37,99,235,0.06)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
        y: { grid: { color: 'transparent' }, ticks: { color: '#64748b' } }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });

  /* ══════════════════════════════════════════
     GRÁFICO 6 — Semanal · Barras con opacidad dinámica
     ══════════════════════════════════════════ */
  const semKeys = Object.keys(semanalVals).sort((a,b) => a-b);
  const semVals = semKeys.map(k => semanalVals[k]);
  const maxSem  = Math.max(...semVals, 1);

  const semCtx = document.getElementById('chartSemanal').getContext('2d');
  const semGrads = semVals.map(v => {
    const ratio = v / maxSem;
    const alpha1 = (0.35 + ratio * 0.55).toFixed(2);
    const alpha2 = (0.10 + ratio * 0.20).toFixed(2);
    const g = semCtx.createLinearGradient(0, 0, 0, 165);
    g.addColorStop(0, `rgba(79,70,229,${alpha1})`);
    g.addColorStop(1, `rgba(79,70,229,${alpha2})`);
    return g;
  });

  chartsInstances.semanal = new Chart(semCtx, {
    type: 'bar',
    data: {
      labels: semanalLabels,
      datasets: [{
        data: semVals,
        backgroundColor: semGrads,
        borderColor: `rgba(79,70,229,0.6)`,
        borderWidth: 1.5,
        borderRadius: 7,
        borderSkipped: false,
        barPercentage: 0.65,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipStyle },
      scales: {
        x: { grid: { color: 'rgba(37,99,235,0.06)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(37,99,235,0.06)' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });

  /* ── Leaderboard ── */
  const lb     = document.getElementById('leaderboard');
  const maxAge = agentesOrdenados[0]?.[1] || 1;
  const badges = ['🥇','🥈','🥉','④','⑤'];
  agentesOrdenados.forEach(([nombre, count], i) => {
    lb.innerHTML += `<div class="lb-row">
      <span class="lb-rank">${badges[i]}</span>
      <span class="lb-name">${nombre}</span>
      <div class="lb-bar-wrap"><div class="lb-bar" style="width:${((count/maxAge)*100).toFixed(0)}%"></div></div>
      <span class="lb-count">${count}</span>
    </div>`;
  });

  /* ── SLA badge ── */
  const badgeColor = slaAvgNum >= 70 ? PAL.rose  : slaAvgNum >= 50 ? PAL.amber : PAL.teal;
  const badgeBg    = slaAvgNum >= 70 ? 'rgba(225,29,72,0.07)'  : slaAvgNum >= 50 ? 'rgba(217,119,6,0.07)' : 'rgba(13,148,136,0.07)';
  const badgeBd    = slaAvgNum >= 70 ? 'rgba(225,29,72,0.22)'  : slaAvgNum >= 50 ? 'rgba(217,119,6,0.22)' : 'rgba(13,148,136,0.22)';
  document.getElementById('sla-avg').textContent          = slaAvgNum + '%';
  document.getElementById('sla-avg').style.color          = badgeColor;
  document.getElementById('sla-badge').style.background   = badgeBg;
  document.getElementById('sla-badge').style.borderColor  = badgeBd;

  /* ── SLA barras con gradiente ── */
  const sc = document.getElementById('sla-meters');
  slaData.forEach(s => {
    sc.innerHTML += `<div>
      <div class="sla-meta">
        <span>${s.label}</span>
        <span style="color:${s.c};font-weight:600">${s.v}%</span>
      </div>
      <div class="sla-track">
        <div class="sla-fill" style="width:${s.v}%;background:linear-gradient(90deg,${s.c}55,${s.c})"></div>
      </div>
    </div>`;
  });
}