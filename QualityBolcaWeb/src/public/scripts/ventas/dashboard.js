/* ============================================================
   CRM Ventas — Dashboard  |  dashboard.js
   Vanilla JS — datos mock hardcodeados.
   Cuando el backend esté listo, reemplazar MOCK_DATA con
   fetch('/api/ventas/dashboard').then(r => r.json())
   ============================================================ */

(function () {
  'use strict';

  /* ── COLORES POR ETAPA (mismo mapeo que el original Next.js) ── */
  var COLOR_ETAPA = {
    'Prospecto':              '#007AFF',
    'En busca de contacto':   '#5856D6',
    'Contactado':             '#00C7BE',
    'Interesado':             '#34C759',
    'Cotización':             '#FF9500',
    'Negociación':            '#FF6B00',
    'Cerrado':                '#34C759',
    'Perdido':                '#FF3B30',
  };

  var PIE_COLORS = ['#007AFF', '#FF9500', '#AF52DE', '#34C759', '#FF3B30'];

  /* ── DATOS MOCK ─────────────────────────────────────────────
     Estructura idéntica a la respuesta de /api/dashboard del
     proyecto Next.js (ver app/api/dashboard/route.ts).
     ──────────────────────────────────────────────────────── */
  var MOCK_DATA = {
    clientesTotal:      59,
    activos:            47,
    inactivos:          12,
    nuevosMes:          8,
    actividadesSemana:  14,
    tasa:               23,
    embudo: [
      { etapa: 'Prospecto',             cantidad: 12 },
      { etapa: 'En busca de contacto',  cantidad:  9 },
      { etapa: 'Contactado',            cantidad:  7 },
      { etapa: 'Interesado',            cantidad:  5 },
      { etapa: 'Cotización',            cantidad:  4 },
      { etapa: 'Negociación',           cantidad:  3 },
      { etapa: 'Cerrado',               cantidad:  7 },
      { etapa: 'Perdido',               cantidad:  3 },
    ],
    motivosRechazo: [
      { motivo: 'Precio',        cantidad: 4 },
      { motivo: 'Competencia',   cantidad: 3 },
      { motivo: 'Presupuesto',   cantidad: 2 },
      { motivo: 'No contestan',  cantidad: 1 },
      { motivo: 'Otros',         cantidad: 1 },
    ],
    proximas: [
      { id: 1, titulo: 'Llamada de seguimiento',       tipo: 'llamada',   fecha: '2026-04-25', horaInicio: '09:00', horaFin: '09:30', cliente: { denominacion: 'Grupo Industrial Arco' } },
      { id: 2, titulo: 'Presentación de propuesta',    tipo: 'reunión',   fecha: '2026-04-25', horaInicio: '11:00', horaFin: '12:00', cliente: { denominacion: 'Manufacturas del Norte S.A.' } },
      { id: 3, titulo: 'Demo de producto',             tipo: 'demo',      fecha: '2026-04-26', horaInicio: '10:30', horaFin: '11:30', cliente: { denominacion: 'Tecno Soluciones MX' } },
      { id: 4, titulo: 'Negociación contrato anual',   tipo: 'reunión',   fecha: '2026-04-28', horaInicio: '16:00', horaFin: '17:00', cliente: { denominacion: 'Distribuidora Cerro Largo' } },
      { id: 5, titulo: 'Visita a planta cliente',      tipo: 'visita',    fecha: '2026-04-29', horaInicio: '08:00', horaFin: '10:00', cliente: { denominacion: 'Plásticos del Bajío' } },
      { id: 6, titulo: 'Cierre de trato trimestral',   tipo: 'llamada',   fecha: '2026-04-30', horaInicio: '14:00', horaFin: '14:30', cliente: { denominacion: 'Logística Integral QB' } },
    ],
  };

  /* ── USUARIO MOCK (reemplazar con variable EJS cuando el
        backend pase la sesión) ─────────────────────────── */
  var USER_MOCK = {
    nombre: 'Usuario Demo',
    email:  'ventas@qualitybolca.net',
  };

  /* ── CHARTS INSTANCIADOS ── */
  var chartEmbudo  = null;
  var chartMotivos = null;

  /* ================================================================
     INIT
     ================================================================ */
  function init() {
    setFechaHoy();
    setUserInfo();
    renderKPIs(MOCK_DATA);
    renderChartEmbudo(MOCK_DATA.embudo);
    renderChartMotivos(MOCK_DATA.motivosRechazo);
    renderActividades(MOCK_DATA.proximas);
    bindEvents();
  }

  /* ── FECHA ── */
  function setFechaHoy() {
    var el = document.getElementById('fechaHoy');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleDateString('es-MX', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ── INFO DE USUARIO ── */
  function setUserInfo() {
    var inicial = (USER_MOCK.nombre || 'U')[0].toUpperCase();

    var elSidebarAvatar = document.getElementById('userAvatarSidebar');
    var elSidebarName   = document.getElementById('userNameSidebar');
    var elSidebarEmail  = document.getElementById('userEmailSidebar');
    var elTopAvatar     = document.getElementById('userAvatarTop');
    var elTopName       = document.getElementById('userNameTop');

    if (elSidebarAvatar) elSidebarAvatar.textContent = inicial;
    if (elSidebarName)   elSidebarName.textContent   = USER_MOCK.nombre;
    if (elSidebarEmail)  elSidebarEmail.textContent  = USER_MOCK.email;
    if (elTopAvatar)     elTopAvatar.textContent     = inicial;
    if (elTopName)       elTopName.textContent       = USER_MOCK.nombre.split(' ')[0];
  }

  /* ================================================================
     KPI COUNTERS — animación ease-out cúbica (igual que StatCard
     del original React con requestAnimationFrame)
     ================================================================ */
  function renderKPIs(data) {
    /* Actualizar targets con datos reales */
    var targets = {
      /* grid 1 */
      0: data.activos,
      1: data.inactivos,
      2: data.nuevosMes,
      3: data.actividadesSemana,
    };
    var targetsGrid2 = {
      0: data.clientesTotal,
      1: data.tasa,
      2: (data.embudo || []).reduce(function (a, b) { return a + b.cantidad; }, 0),
    };

    /* Aplicar targets al DOM */
    applyTargets('#kpiGrid1', targets);
    applyTargets('#kpiGrid2', targetsGrid2);

    /* Animar todos los contadores */
    document.querySelectorAll('.kpi-value[data-target]').forEach(function (el) {
      animateCounter(el);
    });
  }

  function applyTargets(gridSel, targets) {
    var cards = document.querySelectorAll(gridSel + ' .kpi-value');
    Object.keys(targets).forEach(function (idx) {
      if (cards[idx]) {
        cards[idx].setAttribute('data-target', targets[idx]);
      }
    });
  }

  function animateCounter(el) {
    var target  = parseFloat(el.getAttribute('data-target')) || 0;
    var suffix  = el.getAttribute('data-suffix') || '';
    var dur     = 900;
    var start   = null;

    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min(1, (ts - start) / dur);
      /* ease-out cubic */
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ================================================================
     CHART: EMBUDO DE VENTAS (Bar chart)
     ================================================================ */
  function renderChartEmbudo(embudo) {
    var canvas = document.getElementById('chartEmbudo');
    if (!canvas) return;

    var labels  = embudo.map(function (e) { return e.etapa; });
    var valores = embudo.map(function (e) { return e.cantidad; });
    var colors  = embudo.map(function (e) { return COLOR_ETAPA[e.etapa] || '#007AFF'; });

    if (chartEmbudo) { chartEmbudo.destroy(); }

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
            ticks: {
              color: '#636366',
              font: { size: 11, family: 'Inter' },
              maxRotation: 35,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#F0F0F2', drawBorder: false },
            border: { display: false, dash: [4, 4] },
            ticks: {
              color: '#636366',
              font: { size: 11, family: 'Inter' },
              precision: 0,
            },
          },
        },
        animation: {
          duration: 800,
          easing: 'easeOutQuart',
        },
      },
    });
  }

  /* ================================================================
     CHART: MOTIVOS DE RECHAZO (Doughnut chart)
     ================================================================ */
  function renderChartMotivos(motivos) {
    var canvas = document.getElementById('chartMotivos');
    if (!canvas) return;

    var activos = (motivos || []).filter(function (m) { return m.cantidad > 0; });

    if (activos.length === 0) {
      var parent = canvas.parentElement;
      parent.innerHTML = '<p style="text-align:center;color:#AEAEB2;font-size:13px;padding-top:80px;">Sin datos de rechazo</p>';
      return;
    }

    var labels  = activos.map(function (m) { return m.motivo; });
    var valores = activos.map(function (m) { return m.cantidad; });
    var colors  = activos.map(function (_, i) { return PIE_COLORS[i % PIE_COLORS.length]; });

    if (chartMotivos) { chartMotivos.destroy(); }

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
              boxWidth: 12,
              boxHeight: 12,
              borderRadius: 4,
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle',
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
        animation: {
          duration: 900,
          easing: 'easeOutQuart',
        },
      },
    });
  }

  /* ================================================================
     ACTIVIDADES — render de la lista
     ================================================================ */
  function fmtFecha(fechaStr) {
    if (!fechaStr) return '—';
    var partes = fechaStr.split('-');
    if (partes.length !== 3) return fechaStr;
    var d = new Date(partes[0], partes[1] - 1, partes[2]);
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  function renderActividades(proximas) {
    var lista = document.getElementById('activitiesList');
    if (!lista) return;

    if (!proximas || proximas.length === 0) {
      lista.innerHTML = '<div class="activities-empty"><i class="fa-regular fa-calendar-xmark"></i>No hay actividades próximas</div>';
      return;
    }

    var html = proximas.map(function (ev) {
      var cliente   = (ev.cliente && ev.cliente.denominacion) ? ev.cliente.denominacion : '—';
      var fecha     = fmtFecha(ev.fecha);
      var horas     = ev.horaInicio + ' – ' + ev.horaFin;
      var tipoIcon  = iconoPorTipo(ev.tipo);

      return [
        '<div class="activity-item">',
          '<div class="activity-icon"><i class="fa-solid ' + tipoIcon + '"></i></div>',
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

    lista.innerHTML = html;
  }

  function iconoPorTipo(tipo) {
    var mapa = {
      'llamada': 'fa-phone',
      'reunión': 'fa-handshake',
      'reunion': 'fa-handshake',
      'demo':    'fa-laptop',
      'visita':  'fa-location-dot',
      'correo':  'fa-envelope',
      'tarea':   'fa-check-square',
    };
    var key = (tipo || '').toLowerCase();
    return mapa[key] || 'fa-calendar-day';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ================================================================
     SIDEBAR MÓVIL
     ================================================================ */
  window.toggleSidebar = function () {
    var sidebar  = document.getElementById('sidebar');
    var overlay  = document.getElementById('sidebarOverlay');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  };

  window.cerrarSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar)  sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

  /* ================================================================
     BOTÓN REFRESH — recarga datos (ahora reinicia con mock,
     en el futuro hará fetch al backend)
     ================================================================ */
  function bindEvents() {
    var btnRefresh = document.getElementById('btnRefresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', function () {
        btnRefresh.classList.add('spinning');
        setTimeout(function () {
          btnRefresh.classList.remove('spinning');
          renderKPIs(MOCK_DATA);
          renderChartEmbudo(MOCK_DATA.embudo);
          renderChartMotivos(MOCK_DATA.motivosRechazo);
          renderActividades(MOCK_DATA.proximas);
        }, 600);
      });
    }
  }

  /* ── ARRANQUE ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
