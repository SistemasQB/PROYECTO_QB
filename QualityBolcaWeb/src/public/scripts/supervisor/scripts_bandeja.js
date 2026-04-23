(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────
  // P-05 Bandeja de Entrada — Drawer / menú hamburguesa (móvil)
  // ──────────────────────────────────────────────────────────────

  const hamburgerBtn = document.getElementById('sv-hamburger-btn');
  const sidebar      = document.getElementById('sv-sidebar-nav');
  const overlay      = document.getElementById('sv-sidebar-overlay');

  if (hamburgerBtn && sidebar && overlay) {
    /** Devuelve todos los elementos enfocables dentro de un contenedor */
    function getFocusableElements(container) {
      return Array.from(
        container.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function openDrawer() {
      sidebar.classList.add('is-open');
      overlay.classList.add('is-visible');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      overlay.removeAttribute('aria-hidden');

      const focusable = getFocusableElements(sidebar);
      if (focusable.length > 0) focusable[0].focus();

      document.addEventListener('keydown', handleKeyDown);
    }

    function closeDrawer() {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');

      hamburgerBtn.focus();
      document.removeEventListener('keydown', handleKeyDown);
    }

    function trapFocus(e) {
      const focusable = getFocusableElements(sidebar);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (e.key === 'Tab') {
        trapFocus(e);
      }
    }

    hamburgerBtn.addEventListener('click', function () {
      const isOpen = sidebar.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);
  }

  // ──────────────────────────────────────────────────────────────
  // P-05 Auto-refresh / Polling de bandeja
  // ──────────────────────────────────────────────────────────────

  const POLL_INTERVAL_MS = 20000; // 20 segundos
  const ENDPOINT         = '/bots/supervisor/bandeja/data';

  const contentEl = document.getElementById('sv-bandeja-content');
  const dotEl     = document.getElementById('sv-poll-dot');
  const textEl    = document.getElementById('sv-poll-text');

  // El elemento del badge de "X reportes pendientes" está en el header
  const headerBadge = document.querySelector('.sv-header__user .sv-badge');

  if (!contentEl || !dotEl || !textEl) return;

  /** Formatea una fecha como HH:MM */
  function horaActual() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return hh + ':' + mm;
  }

  /** Pone el indicador en estado OK */
  function setStatusOk() {
    dotEl.classList.remove('sv-poll-dot--error', 'sv-poll-dot--loading');
    dotEl.classList.add('sv-poll-dot--ok');
    textEl.textContent = 'Actualizado ' + horaActual();
  }

  /** Pone el indicador en estado error */
  function setStatusError() {
    dotEl.classList.remove('sv-poll-dot--ok', 'sv-poll-dot--loading');
    dotEl.classList.add('sv-poll-dot--error');
    textEl.textContent = 'Sin conexion';
  }

  /** Pone el indicador en estado cargando */
  function setStatusLoading() {
    dotEl.classList.remove('sv-poll-dot--ok', 'sv-poll-dot--error');
    dotEl.classList.add('sv-poll-dot--loading');
    textEl.textContent = 'Actualizando...';
  }

  /**
   * Construye el badge de estado del reporte.
   * @param {string} bodyStatus - 'pending' | 'signed'
   * @returns {string} HTML del badge
   */
  function buildBadge(bodyStatus) {
    if (bodyStatus === 'pending') {
      return '<span class="sv-badge sv-badge--warning">PENDIENTE</span>';
    }
    if (bodyStatus === 'signed') {
      return '<span class="sv-badge sv-badge--success">FIRMADO</span>';
    }
    return '<span class="sv-badge">' + (bodyStatus || 'pending').toUpperCase() + '</span>';
  }

  /**
   * Renderiza el contenido de la bandeja a partir de los datos JSON
   * del endpoint, usando la misma estructura visual que el EJS.
   * @param {object} data - Respuesta del endpoint { totalPendientes, reportesPorInspector }
   */
  function renderBandeja(data) {
    const { totalPendientes, reportesPorInspector } = data;

    // Actualizar badge del header
    if (headerBadge) {
      headerBadge.textContent = totalPendientes + ' reportes pendientes';
    }

    if (totalPendientes === 0) {
      contentEl.innerHTML =
        '<div style="text-align:center;padding:3rem;color:#6b7280;">' +
        '<p>¡Todo al día! No tienes reportes pendientes por revisar.</p>' +
        '</div>';
      return;
    }

    let html = '';

    Object.keys(reportesPorInspector).forEach(function (inspectorNombre) {
      const reportes  = reportesPorInspector[inspectorNombre];
      const iniciales = inspectorNombre
        .split(' ')
        .map(function (n) { return n[0] || ''; })
        .join('')
        .substring(0, 2)
        .toUpperCase();
      const idSeguro = inspectorNombre.replace(/\s+/g, '-').toLowerCase();

      let filas = '';
      reportes.forEach(function (reporte) {
        const fecha = new Date(reporte.created_at).toLocaleDateString('es-MX', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        filas +=
          '<tr>' +
          '<td>' + fecha + '</td>' +
          '<td>REP-' + (reporte.body_id || 'N/A') + '</td>' +
          '<td>' + (reporte.nombre_parte || 'N/A') + '</td>' +
          '<td>' + (reporte.turno || '') + '</td>' +
          '<td><span class="sv-part-number">' + (reporte.numero_parte || '') + '</span></td>' +
          '<td>' + (reporte.numero_items || 0) + ' lotes</td>' +
          '<td>' + buildBadge(reporte.body_status) + '</td>' +
          '<td>' +
            '<a href="detalle/' + reporte.body_id + '" ' +
               'class="sv-btn sv-btn--primary sv-btn--sm" ' +
               'aria-label="Revisar reporte ID ' + reporte.reporte_id + '">' +
              'REVISAR' +
            '</a>' +
          '</td>' +
          '</tr>';
      });

      html +=
        '<section class="sv-inspector-group" aria-labelledby="inspector-' + idSeguro + '">' +
          '<div class="sv-inspector-group__header">' +
            '<div class="sv-inspector-group__info">' +
              '<span class="sv-inspector-group__avatar">' + iniciales + '</span>' +
              '<div>' +
                '<h2 class="sv-inspector-group__name" id="inspector-' + idSeguro + '">' + inspectorNombre + '</h2>' +
                '<span class="sv-inspector-group__count">' + reportes.length + ' reporte(s) pendiente(s)</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="sv-table-wrapper">' +
            '<table class="sv-table" aria-label="Reportes de ' + inspectorNombre + '">' +
              '<thead><tr>' +
                '<th scope="col">Fecha</th>' +
                '<th scope="col">ID reporte</th>' +
                '<th scope="col">Nombre de parte</th>' +
                '<th scope="col">Turno</th>' +
                '<th scope="col">Número de parte</th>' +
                '<th scope="col">Lotes</th>' +
                '<th scope="col">Estado</th>' +
                '<th scope="col">Acción</th>' +
              '</tr></thead>' +
              '<tbody>' + filas + '</tbody>' +
            '</table>' +
          '</div>' +
        '</section>';
    });

    contentEl.innerHTML = html;
  }

  /** Ejecuta una petición de polling */
  function poll() {
    setStatusLoading();

    // Leer el token CSRF del meta tag (ya presente en el head del EJS)
    const csrf = (document.querySelector('meta[name="csrf-token"]') || {}).content || '';

    fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-csrf-token': csrf
      },
      credentials: 'same-origin'
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (!data.ok) {
          throw new Error('Respuesta ok:false del servidor');
        }
        renderBandeja(data);
        setStatusOk();
      })
      .catch(function (err) {
        console.warn('[bandeja-poll] Error en polling:', err.message);
        setStatusError();
        // El contenido previo se conserva; no se borra nada
      });
  }

  // Arrancar el polling: primera actualización a los 20s
  // (la carga inicial ya viene del servidor via EJS)
  var pollTimer = setInterval(poll, POLL_INTERVAL_MS);

  // Mostrar estado inicial como OK (datos frescos del servidor)
  setStatusOk();

  // Pausar polling cuando la pestaña está en segundo plano
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(pollTimer);
    } else {
      // Al volver a la pestaña, hacer un poll inmediato y reiniciar el ciclo
      poll();
      pollTimer = setInterval(poll, POLL_INTERVAL_MS);
    }
  });

})();
