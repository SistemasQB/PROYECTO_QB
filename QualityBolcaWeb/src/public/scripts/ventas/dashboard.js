/* ============================================================
   CRM Ventas — Dashboard | dashboard.js
   Quality Bolca | 2026
   ============================================================ */

(function () {
  'use strict';

  var COLOR_ETAPA = {
    'Prospecto':             '#007AFF',
    'En busca de contacto':  '#5856D6',
    'Contactado':            '#00C7BE',
    'Interesado':            '#34C759',
    'Cotización':            '#FF9500',
    'Negociación':           '#FF6B00',
    'Cerrado':               '#34C759',
    'Perdido':               '#FF3B30',
  };

  var PIE_COLORS = ['#007AFF', '#FF9500', '#AF52DE', '#34C759', '#FF3B30'];

  var chartEmbudo  = null;
  var chartMotivos = null;

  /* ================================================================
     INIT
     ================================================================ */
  function init() {
    setFechaHoy();
    setUserInfo();
    bindEvents();
    cargarDatos();
  }

  /* ── FECHA ── */
  function setFechaHoy() {
    var el = document.getElementById('fechaHoy');
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('es-MX', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  /* ── INFO DE USUARIO ── */
  function setUserInfo() {
    var meta = function(name) {
      var el = document.querySelector('meta[name="' + name + '"]');
      return el ? el.getAttribute('content') : '';
    };
    var nombre       = meta('usuario-nombre')       || 'Usuario';
    var nombreCorto  = meta('usuario-nombre-corto') || nombre.split(' ')[0];
    var inicial      = meta('usuario-inicial')      || nombre[0].toUpperCase();
    var correo       = meta('usuario-correo')       || '';

    var ids = ['userAvatarSidebar', 'userAvatarTop'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = inicial;
    });
    var ns = document.getElementById('userNameSidebar');
    var nt = document.getElementById('userNameTop');
    var es = document.getElementById('userEmailSidebar');
    if (ns) ns.textContent = nombre;
    if (nt) nt.textContent = nombreCorto;
    if (es) es.textContent = correo;
  }

  /* ================================================================
     CARGA DE DATOS
     ================================================================ */
  function cargarDatos() {
    var btn = document.getElementById('btnRefresh');
    if (btn) btn.classList.add('spinning');

    fetch('/ventas/api/dashboard', {
      headers: { 'X-CSRF-Token': window._tok || '' },
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.token) window._tok = j.token;
        if (btn) btn.classList.remove('spinning');
        if (!j.ok) { console.error(j.msg); return; }
        renderDashboard(j.data);
      })
      .catch(function (e) {
        console.error(e);
        if (btn) btn.classList.remove('spinning');
      });
  }

  function renderDashboard(data) {
    renderKPIs(data);
    renderChartEmbudo(data.embudo);
    renderChartMotivos(data.motivosRechazo);
    renderActividades(data.proximas);
  }

  /* ================================================================
     KPI COUNTERS
     ================================================================ */
  function renderKPIs(data) {
    var totalSeg = (data.activos || 0) + (data.inactivos || 0);

    /* Grid 1 — 4 tarjetas con barra */
    var configs1 = [
      { val: data.activos,            barPct: totalSeg ? Math.round((data.activos / totalSeg) * 100) : 0 },
      { val: data.inactivos,          barPct: totalSeg ? Math.round((data.inactivos / totalSeg) * 100) : 0 },
      { val: data.nuevosMes,          barPct: data.clientesTotal ? Math.min(100, Math.round((data.nuevosMes / data.clientesTotal) * 300)) : 0 },
      { val: data.actividadesSemana,  barPct: Math.min(100, (data.actividadesSemana || 0) * 5) },
    ];
    var cards1 = document.querySelectorAll('#kpiGrid1 .kpi-card');
    configs1.forEach(function (cfg, i) {
      var card = cards1[i];
      if (!card) return;
      var valEl = card.querySelector('.kpi-value');
      var barEl = card.querySelector('.kpi-bar-fill');
      if (valEl) valEl.setAttribute('data-target', cfg.val);
      if (barEl) barEl.style.width = cfg.barPct + '%';
    });

    /* Grid 2 — 3 tarjetas inline */
    var totalProspectos = (data.embudo || []).reduce(function (a, b) { return a + b.cantidad; }, 0);
    var vals2  = [data.clientesTotal, data.tasa, totalProspectos];
    var cards2 = document.querySelectorAll('#kpiGrid2 .kpi-value');
    vals2.forEach(function (val, i) {
      if (cards2[i]) cards2[i].setAttribute('data-target', val);
    });

    /* Animar todos */
    document.querySelectorAll('.kpi-value[data-target]').forEach(animateCounter);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur    = 900;
    var start  = null;

    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min(1, (ts - start) / dur);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ================================================================
     CHART: EMBUDO DE VENTAS
     ================================================================ */
  function renderChartEmbudo(embudo) {
    var canvas = document.getElementById('chartEmbudo');
    if (!canvas) return;

    var labels  = (embudo || []).map(function (e) { return e.etapa; });
    var valores = (embudo || []).map(function (e) { return e.cantidad; });
    var colors  = (embudo || []).map(function (e) { return COLOR_ETAPA[e.etapa] || '#007AFF'; });

    if (chartEmbudo) { chartEmbudo.destroy(); chartEmbudo = null; }

    chartEmbudo = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Prospectos',
          data: valores,
          backgroundColor: colors,
          borderRadius: 8,
          borderSkipped: false,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1C1C1E',
            titleColor: '#AEAEB2',
            bodyColor: '#FFFFFF',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: function (ctx) { return ' ' + ctx.parsed.y + ' prospectos'; },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#636366', font: { size: 11, family: 'Inter' }, maxRotation: 35, minRotation: 0 },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#F0F0F2', drawBorder: false },
            border: { display: false, dash: [4, 4] },
            ticks: { color: '#636366', font: { size: 11, family: 'Inter' }, precision: 0 },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }

  /* ================================================================
     CHART: MOTIVOS DE RECHAZO
     ================================================================ */
  function renderChartMotivos(motivos) {
    var canvas = document.getElementById('chartMotivos');
    if (!canvas) return;

    var activos = (motivos || []).filter(function (m) { return m.cantidad > 0; });

    if (activos.length === 0) {
      canvas.parentElement.innerHTML =
        '<p style="text-align:center;color:#AEAEB2;font-size:13px;padding-top:80px;">Sin datos de rechazo</p>';
      return;
    }

    var labels  = activos.map(function (m) { return m.motivo; });
    var valores = activos.map(function (m) { return m.cantidad; });
    var colors  = activos.map(function (_, i) { return PIE_COLORS[i % PIE_COLORS.length]; });

    if (chartMotivos) { chartMotivos.destroy(); chartMotivos = null; }

    chartMotivos = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: colors,
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#1C1C1E',
              font: { size: 12, family: 'Inter' },
              boxWidth: 12, boxHeight: 12,
              borderRadius: 4, padding: 12,
              usePointStyle: true, pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#1C1C1E',
            titleColor: '#AEAEB2',
            bodyColor: '#FFFFFF',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: function (ctx) {
                var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                var pct   = total ? Math.round((ctx.parsed / total) * 100) : 0;
                return ' ' + ctx.parsed + ' (' + pct + '%)';
              },
            },
          },
        },
        animation: { duration: 900, easing: 'easeOutQuart' },
      },
    });
  }

  /* ================================================================
     PRÓXIMAS ACTIVIDADES
     ================================================================ */
  function fmtFecha(fechaStr) {
    if (!fechaStr) return '—';
    var partes = String(fechaStr).slice(0, 10).split('-');
    if (partes.length !== 3) return fechaStr;
    var d = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  function renderActividades(proximas) {
    var lista = document.getElementById('activitiesList');
    if (!lista) return;

    if (!proximas || proximas.length === 0) {
      lista.innerHTML = '<div class="activities-empty"><i class="fa-regular fa-calendar-xmark"></i>No hay actividades próximas</div>';
      return;
    }

    lista.innerHTML = proximas.map(function (ev) {
      var cliente  = (ev.cliente && ev.cliente.denominacion) ? ev.cliente.denominacion : '—';
      var fecha    = fmtFecha(ev.fecha);
      var horas    = ev.horaInicio + ' – ' + ev.horaFin;
      var icon     = iconoPorTipo(ev.tipo);

      return [
        '<div class="activity-item">',
          '<div class="activity-icon"><i class="fa-solid ' + icon + '"></i></div>',
          '<div class="activity-info">',
            '<div class="activity-title">' + escHtml(ev.titulo) + '</div>',
            '<div class="activity-meta">',
              escHtml(cliente) + ' &nbsp;·&nbsp; ',
              '<span class="activity-tipo-badge">' + escHtml(ev.tipo) + '</span>',
            '</div>',
          '</div>',
          '<div class="activity-time">',
            '<div class="activity-date">' + fecha + '</div>',
            '<div class="activity-hours">' + horas + '</div>',
          '</div>',
        '</div>',
      ].join('');
    }).join('');
  }

  function iconoPorTipo(tipo) {
    var mapa = {
      'llamada': 'fa-phone',
      'reunión': 'fa-handshake',
      'reunion': 'fa-handshake',
      'visita':  'fa-location-dot',
      'correo':  'fa-envelope',
      'otro':    'fa-calendar-day',
    };
    return mapa[(tipo || '').toLowerCase()] || 'fa-calendar-day';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ================================================================
     SIDEBAR MÓVIL
     ================================================================ */
  window.toggleSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible');
  };

  window.cerrarSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

  /* ================================================================
     BOTÓN REFRESH
     ================================================================ */
  function bindEvents() {
    var btn = document.getElementById('btnRefresh');
    if (btn) btn.addEventListener('click', cargarDatos);
  }

  /* ── ARRANQUE ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
