/* ============================================================
   CRM Ventas — Clientes
   ============================================================ */

(function () {
  'use strict';

  var AVATAR_COLORS = [
    '#007AFF','#34C759','#FF9500','#FF3B30','#AF52DE',
    '#5856D6','#00C7BE','#FF2D55','#30B0C7','#FECC02',
  ];

  function avatarColor(str) {
    if (!str) return AVATAR_COLORS[0];
    var code = 0;
    for (var i = 0; i < str.length; i++) { code += str.charCodeAt(i); }
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
  }

  /* ── Estado ── */
  var state = {
    todos:      [],
    filtrados:  [],
    pagina:     1,
    porPagina:  10,
    sortCol:    'folio',
    sortDir:    'asc',
    editandoId: null,
    detalleId:  null,
  };

  /* ── Helpers API ── */
  function apiPost(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': window._tok || '' },
      body: JSON.stringify(data),
      credentials: 'include',
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res && res.token) window._tok = res.token;
      return res;
    });
  }

  function apiPut(url, data) {
    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': window._tok || '' },
      body: JSON.stringify(data),
      credentials: 'include',
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res && res.token) window._tok = res.token;
      return res;
    });
  }

  function apiDelete(url) {
    return fetch(url, {
      method: 'DELETE',
      headers: { 'X-CSRF-Token': window._tok || '' },
      credentials: 'include',
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res && res.token) window._tok = res.token;
      return res;
    });
  }

  /* ── Cargar datos ── */
  async function cargarClientes() {
    try {
      var res = await fetch('/ventas/api/clientes', { credentials: 'include' }).then(function (r) { return r.json(); });
      if (res && res.ok) {
        state.todos = res.data || [];
        if (res.token) window._tok = res.token;
      }
    } catch (e) {
      console.error('Error cargando clientes:', e);
      state.todos = [];
    }
    setUserInfo();
    aplicarFiltros();
  }

  /* ── Init ── */
  function init() {
    bindEvents();
    cargarClientes();
  }

  /* ── Info usuario (nombre de sesión no disponible, placeholder) ── */
  function setUserInfo() {
    var total = document.getElementById('totalClientes');
    if (total) total.textContent = state.todos.length;
  }

  /* ── Filtros + orden ── */
  function aplicarFiltros() {
    var q      = (document.getElementById('inputBuscar')  || {}).value || '';
    var estado = (document.getElementById('selectEstado') || {}).value || '';
    var giro   = (document.getElementById('selectGiro')   || {}).value || '';
    var moneda = (document.getElementById('selectMoneda') || {}).value || '';
    var texto  = q.toLowerCase().trim();

    state.filtrados = state.todos.filter(function (c) {
      if (estado && c.estado !== estado) return false;
      if (giro   && c.giro   !== giro)   return false;
      if (moneda && c.moneda !== moneda) return false;
      if (texto) {
        var hay = [c.folio, c.denominacion, c.razonSocial, c.rfc]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(texto)) return false;
      }
      return true;
    });

    var col = state.sortCol;
    var dir = state.sortDir === 'asc' ? 1 : -1;
    state.filtrados.sort(function (a, b) {
      var va = (a[col] || '').toString().toLowerCase();
      var vb = (b[col] || '').toString().toLowerCase();
      return va < vb ? -dir : va > vb ? dir : 0;
    });

    state.pagina = 1;

    var btnClear = document.getElementById('btnClearSearch');
    if (btnClear) btnClear.style.display = texto ? 'flex' : 'none';

    renderTabla();
    renderPaginacion();
    actualizarConteo();
    actualizarIconosSort();
  }

  /* ── Render tabla ── */
  function renderTabla() {
    var tbody = document.getElementById('clientesTbody');
    var empty = document.getElementById('tableEmpty');
    if (!tbody) return;

    var inicio = (state.pagina - 1) * state.porPagina;
    var pagina = state.filtrados.slice(inicio, inicio + state.porPagina);

    if (pagina.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = pagina.map(function (c) {
      var inicial  = (c.denominacion || '?')[0].toUpperCase();
      var color    = avatarColor(c.denominacion);
      var monedaClass = c.moneda === 'USD' ? 'usd' : '';

      return [
        '<tr data-id="' + c.id + '">',
          '<td class="cell-rfc">' + escHtml(c.folio) + '</td>',
          '<td>',
            '<div class="cell-nombre-wrap">',
              '<div class="table-avatar" style="background:' + color + '">' + inicial + '</div>',
              '<div class="cell-denominacion">',
                '<div class="den-name">' + escHtml(c.denominacion) + '</div>',
                '<div class="den-razon">' + escHtml(c.razonSocial) + '</div>',
              '</div>',
            '</div>',
          '</td>',
          '<td class="cell-rfc">' + escHtml(c.rfc || '—') + '</td>',
          '<td>' + escHtml(c.estado || '—') + '</td>',
          '<td>' + escHtml(c.giro || '—') + '</td>',
          '<td><span class="badge-moneda ' + monedaClass + '">' + escHtml(c.moneda) + '</span></td>',
          '<td class="cell-fecha">' + fmtFecha(c.fechaAlta) + '</td>',
          '<td>',
            '<div class="cell-actions">',
              '<button class="btn-action btn-action-edit" data-action="editar" data-id="' + c.id + '" title="Editar cliente">',
                '<i class="fa-solid fa-pencil"></i>',
              '</button>',
              '<button class="btn-action btn-action-delete" data-action="eliminar" data-id="' + c.id + '" title="Eliminar cliente">',
                '<i class="fa-solid fa-trash"></i>',
              '</button>',
            '</div>',
          '</td>',
        '</tr>',
      ].join('');
    }).join('');
  }

  /* ── Paginación ── */
  function renderPaginacion() {
    var bar      = document.getElementById('paginationBar');
    var info     = document.getElementById('paginationInfo');
    var controls = document.getElementById('paginationControls');
    if (!bar) return;

    var total   = state.filtrados.length;
    var paginas = Math.ceil(total / state.porPagina);
    var inicio  = (state.pagina - 1) * state.porPagina + 1;
    var fin     = Math.min(state.pagina * state.porPagina, total);

    if (total === 0) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    if (info) info.textContent = 'Mostrando ' + inicio + '–' + fin + ' de ' + total;
    if (!controls) return;

    var html = '';
    html += '<button class="page-btn" data-page="prev"' + (state.pagina === 1 ? ' disabled' : '') + '>';
    html += '<i class="fa-solid fa-chevron-left"></i></button>';

    paginasRango(state.pagina, paginas).forEach(function (p) {
      if (p === '…') {
        html += '<span class="page-btn" style="pointer-events:none">…</span>';
      } else {
        html += '<button class="page-btn' + (p === state.pagina ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
    });

    html += '<button class="page-btn" data-page="next"' + (state.pagina === paginas ? ' disabled' : '') + '>';
    html += '<i class="fa-solid fa-chevron-right"></i></button>';
    controls.innerHTML = html;
  }

  function paginasRango(actual, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var pages = [1];
    if (actual > 3) pages.push('…');
    var start = Math.max(2, actual - 1);
    var end   = Math.min(total - 1, actual + 1);
    for (var j = start; j <= end; j++) pages.push(j);
    if (actual < total - 2) pages.push('…');
    pages.push(total);
    return pages;
  }

  function actualizarConteo() {
    var el = document.getElementById('resultCount');
    if (!el) return;
    var n = state.filtrados.length;
    el.textContent = n === 1 ? '1 cliente' : n + ' clientes';
  }

  function actualizarIconosSort() {
    document.querySelectorAll('.th-sortable').forEach(function (th) {
      var icon = th.querySelector('.sort-icon');
      if (!icon) return;
      icon.classList.remove('asc', 'desc');
      if (th.dataset.col === state.sortCol) icon.classList.add(state.sortDir);
    });
  }

  /* ── Modal nuevo/editar ── */
  function abrirModalNuevo() {
    state.editandoId = null;
    limpiarFormModal();
    document.getElementById('modalTitulo').textContent = 'Nuevo cliente';
    document.getElementById('modalClienteId').value = '';
    mostrarModal();
  }

  function abrirModalEditar(id) {
    var cliente = encontrarCliente(id);
    if (!cliente) return;
    state.editandoId = id;
    rellenarFormModal(cliente);
    document.getElementById('modalTitulo').textContent = 'Editar cliente';
    document.getElementById('modalClienteId').value = id;
    mostrarModal();
  }

  function limpiarFormModal() {
    ['fCotizador','fRfc','fDenominacion','fRazonSocial',
     'fContactoCalidad','fTelCalidad','fCorreoCalidad',
     'fContactoCompras','fTelCompras','fCorreoCompras'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var selEstado = document.getElementById('fEstado');
    var selGiro   = document.getElementById('fGiro');
    var selMoneda = document.getElementById('fMoneda');
    if (selEstado) selEstado.value = '';
    if (selGiro)   selGiro.value   = '';
    if (selMoneda) selMoneda.value = 'MXN';
    document.querySelectorAll('.form-input.error').forEach(function (el) { el.classList.remove('error'); });
  }

  function rellenarFormModal(c) {
    limpiarFormModal();
    var mapa = {
      fRfc:             c.rfc,
      fDenominacion:    c.denominacion,
      fRazonSocial:     c.razonSocial,
      fContactoCalidad: c.contactoCalidad,
      fTelCalidad:      c.telefonoCalidad,
      fCorreoCalidad:   c.correoCalidad,
      fContactoCompras: c.contactoCompras,
      fTelCompras:      c.telefonoCompras,
      fCorreoCompras:   c.correoCompras,
    };
    Object.keys(mapa).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = mapa[id] || '';
    });
    var selEstado = document.getElementById('fEstado');
    var selGiro   = document.getElementById('fGiro');
    var selMoneda = document.getElementById('fMoneda');
    if (selEstado) selEstado.value = c.estado || '';
    if (selGiro)   selGiro.value   = c.giro   || '';
    if (selMoneda) selMoneda.value = c.moneda  || 'MXN';
  }

  function mostrarModal() {
    var backdrop = document.getElementById('modalBackdrop');
    if (backdrop) backdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var el = document.getElementById('fDenominacion');
      if (el) el.focus();
    }, 80);
  }

  function cerrarModal() {
    var backdrop = document.getElementById('modalBackdrop');
    if (backdrop) backdrop.style.display = 'none';
    document.body.style.overflow = '';
    state.editandoId = null;
  }

  /* ── Guardar (API) ── */
  async function guardarCliente() {
    var denominacion = (document.getElementById('fDenominacion') || {}).value || '';
    var razonSocial  = (document.getElementById('fRazonSocial')  || {}).value || '';
    var ok = true;

    if (!denominacion.trim()) {
      var elD = document.getElementById('fDenominacion');
      if (elD) elD.classList.add('error');
      ok = false;
    }
    if (!razonSocial.trim()) {
      var elR = document.getElementById('fRazonSocial');
      if (elR) elR.classList.add('error');
      ok = false;
    }
    if (!ok) { mostrarToast('Denominación y razón social son requeridas', 'error'); return; }

    var datos = {
      rfc:             (document.getElementById('fRfc')             || {}).value || '',
      denominacion:    denominacion.trim(),
      razonSocial:     razonSocial.trim(),
      estado:          (document.getElementById('fEstado')          || {}).value || '',
      giro:            (document.getElementById('fGiro')            || {}).value || '',
      moneda:          (document.getElementById('fMoneda')          || {}).value || 'MXN',
      contactoCalidad: (document.getElementById('fContactoCalidad') || {}).value || '',
      telefonoCalidad: (document.getElementById('fTelCalidad')      || {}).value || '',
      correoCalidad:   (document.getElementById('fCorreoCalidad')   || {}).value || '',
      contactoCompras: (document.getElementById('fContactoCompras') || {}).value || '',
      telefonoCompras: (document.getElementById('fTelCompras')      || {}).value || '',
      correoCompras:   (document.getElementById('fCorreoCompras')   || {}).value || '',
    };

    try {
      var res;
      if (state.editandoId !== null) {
        res = await apiPut('/ventas/api/clientes/' + state.editandoId, datos);
      } else {
        res = await apiPost('/ventas/api/clientes', datos);
      }
      if (!res || !res.ok) { mostrarToast((res && res.msg) || 'Error al guardar', 'error'); return; }
      mostrarToast(state.editandoId !== null ? 'Cliente actualizado' : 'Cliente creado', 'success');
      cerrarModal();
      await cargarClientes();
    } catch (e) {
      mostrarToast('Error al conectar con el servidor', 'error');
    }
  }

  /* ── Eliminar (API) ── */
  async function eliminarCliente(id) {
    var cliente = encontrarCliente(id);
    if (!cliente) return;
    if (!confirm('¿Eliminar el cliente "' + cliente.denominacion + '"?\nEsta acción no se puede deshacer.')) return;

    try {
      var res = await apiDelete('/ventas/api/clientes/' + id);
      if (!res || !res.ok) { mostrarToast((res && res.msg) || 'Error al eliminar', 'error'); return; }
      if (state.detalleId === id) cerrarDetalleFn();
      mostrarToast('Cliente eliminado', 'success');
      await cargarClientes();
    } catch (e) {
      mostrarToast('Error al conectar con el servidor', 'error');
    }
  }

  /* ── Panel detalle ── */
  function abrirDetalle(id) {
    var cliente = encontrarCliente(id);
    if (!cliente) return;
    state.detalleId = id;

    var color   = avatarColor(cliente.denominacion);
    var inicial = (cliente.denominacion || '?')[0].toUpperCase();
    var avatar  = document.getElementById('detailAvatar');
    if (avatar) { avatar.textContent = inicial; avatar.style.background = color; }

    setText('detailDenominacion', cliente.denominacion);
    setText('detailRazon', cliente.razonSocial);

    var badgesEl = document.getElementById('detailBadges');
    if (badgesEl) {
      var badges = '';
      if (cliente.estado) badges += '<span class="badge badge-estado">' + escHtml(cliente.estado) + '</span>';
      if (cliente.giro)   badges += '<span class="badge badge-giro">'   + escHtml(cliente.giro)   + '</span>';
      badgesEl.innerHTML = badges;
    }

    var infoEl = document.getElementById('detailInfoGeneral');
    if (infoEl) {
      infoEl.innerHTML = [
        detailRow('Folio',  cliente.folio,  'mono'),
        detailRow('RFC',    cliente.rfc,    'mono'),
        detailRow('Moneda', cliente.moneda),
        detailRow('Alta',   fmtFecha(cliente.fechaAlta)),
      ].join('');
    }

    var calidadEl = document.getElementById('detailCalidad');
    if (calidadEl) {
      calidadEl.innerHTML = [
        detailRow('Nombre',  cliente.contactoCalidad),
        detailRow('Teléfono',cliente.telefonoCalidad),
        detailRow('Correo',  cliente.correoCalidad),
      ].join('');
    }

    var comprasEl = document.getElementById('detailCompras');
    if (comprasEl) {
      comprasEl.innerHTML = [
        detailRow('Nombre',  cliente.contactoCompras),
        detailRow('Teléfono',cliente.telefonoCompras),
        detailRow('Correo',  cliente.correoCompras),
      ].join('');
    }

    var btnEditar   = document.getElementById('btnDetalleEditar');
    var btnEliminar = document.getElementById('btnDetalleEliminar');
    if (btnEditar)   btnEditar.__clienteId   = id;
    if (btnEliminar) btnEliminar.__clienteId = id;

    var backdrop = document.getElementById('detailBackdrop');
    if (backdrop) backdrop.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function cerrarDetalleFn() {
    var backdrop = document.getElementById('detailBackdrop');
    if (backdrop) backdrop.style.display = 'none';
    document.body.style.overflow = '';
    state.detalleId = null;
  }

  function detailRow(label, value, extraClass) {
    var empty = !value || value === '—';
    var clazz = 'detail-row-value' + (extraClass ? ' ' + extraClass : '') + (empty ? ' detail-row-empty' : '');
    return [
      '<div class="detail-row">',
        '<span class="detail-row-label">' + escHtml(label) + '</span>',
        '<span class="' + clazz + '">' + (empty ? '—' : escHtml(value)) + '</span>',
      '</div>',
    ].join('');
  }

  /* ── Exportar CSV ── */
  function exportarCSV() {
    var cols = ['Folio','Fecha Alta','RFC','Denominación','Razón Social',
                'Estado','Giro','Moneda',
                'Contacto Calidad','Tel Calidad','Correo Calidad',
                'Contacto Compras','Tel Compras','Correo Compras'];

    var filas = state.filtrados.map(function (c) {
      return [
        c.folio, fmtFecha(c.fechaAlta), c.rfc, c.denominacion, c.razonSocial,
        c.estado, c.giro, c.moneda,
        c.contactoCalidad, c.telefonoCalidad, c.correoCalidad,
        c.contactoCompras, c.telefonoCompras, c.correoCompras,
      ].map(function (v) {
        var s = (v || '').toString().replace(/"/g, '""');
        return '"' + s + '"';
      }).join(',');
    });

    var csv  = '﻿' + [cols.join(',')].concat(filas).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url; a.download = 'clientes_' + fechaISO() + '.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    mostrarToast('Exportación lista (' + state.filtrados.length + ' registros)', 'success');
  }

  /* ── Toast ── */
  function mostrarToast(msg, tipo) {
    var wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + (tipo || 'success');
    var icon = tipo === 'error'
      ? '<i class="fa-solid fa-circle-exclamation"></i>'
      : '<i class="fa-solid fa-circle-check"></i>';
    el.innerHTML = icon + ' ' + escHtml(msg);
    wrap.appendChild(el);
    setTimeout(function () {
      el.style.animation = 'toastOut .25s ease both';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
    }, 3000);
  }

  /* ── Sidebar ── */
  window.toggleSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible');
  };
  window.cerrarSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar)  sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

  /* ── Bind events ── */
  function bindEvents() {
    var inputBuscar = document.getElementById('inputBuscar');
    if (inputBuscar) {
      var timer;
      inputBuscar.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(aplicarFiltros, 200);
      });
    }

    var btnClear = document.getElementById('btnClearSearch');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        var inp = document.getElementById('inputBuscar');
        if (inp) { inp.value = ''; inp.focus(); }
        aplicarFiltros();
      });
    }

    ['selectEstado','selectGiro','selectMoneda'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', aplicarFiltros);
    });

    var btnReset = document.getElementById('btnResetFiltros');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        var inp = document.getElementById('inputBuscar');
        if (inp) inp.value = '';
        ['selectEstado','selectGiro','selectMoneda'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
        aplicarFiltros();
      });
    }

    var btnNuevo = document.getElementById('btnNuevoCliente');
    if (btnNuevo) btnNuevo.addEventListener('click', abrirModalNuevo);

    var btnExp = document.getElementById('btnExportar');
    if (btnExp) btnExp.addEventListener('click', exportarCSV);

    var btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) btnGuardar.addEventListener('click', guardarCliente);

    var btnModalClose    = document.getElementById('btnModalClose');
    var btnModalCancelar = document.getElementById('btnModalCancelar');
    if (btnModalClose)    btnModalClose.addEventListener('click', cerrarModal);
    if (btnModalCancelar) btnModalCancelar.addEventListener('click', cerrarModal);

    var modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) { if (e.target === modalBackdrop) cerrarModal(); });
    }

    ['fDenominacion','fRazonSocial'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.classList.remove('error'); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var modal   = document.getElementById('modalBackdrop');
        var detalle = document.getElementById('detailBackdrop');
        if (modal   && modal.style.display   !== 'none') { cerrarModal(); return; }
        if (detalle && detalle.style.display !== 'none') { cerrarDetalleFn(); }
      }
    });

    var tbody = document.getElementById('clientesTbody');
    if (tbody) {
      tbody.addEventListener('click', function (e) {
        var btnEditar   = e.target.closest('[data-action="editar"]');
        var btnEliminar = e.target.closest('[data-action="eliminar"]');
        var fila        = e.target.closest('tr[data-id]');

        if (btnEditar)   { e.stopPropagation(); abrirModalEditar(btnEditar.dataset.id);   return; }
        if (btnEliminar) { e.stopPropagation(); eliminarCliente(btnEliminar.dataset.id);  return; }
        if (fila)        { abrirDetalle(fila.dataset.id); }
      });
    }

    var paginationControls = document.getElementById('paginationControls');
    if (paginationControls) {
      paginationControls.addEventListener('click', function (e) {
        var btn = e.target.closest('.page-btn');
        if (!btn || btn.disabled) return;
        var p     = btn.dataset.page;
        var total = Math.ceil(state.filtrados.length / state.porPagina);
        if (p === 'prev') { if (state.pagina > 1) state.pagina--; }
        else if (p === 'next') { if (state.pagina < total) state.pagina++; }
        else { state.pagina = parseInt(p, 10); }
        renderTabla();
        renderPaginacion();
        var tc = document.querySelector('.table-card');
        if (tc) tc.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    document.querySelectorAll('.th-sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var col = th.dataset.col;
        if (state.sortCol === col) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortCol = col;
          state.sortDir = 'asc';
        }
        aplicarFiltros();
      });
    });

    var detailBackdrop = document.getElementById('detailBackdrop');
    if (detailBackdrop) {
      detailBackdrop.addEventListener('click', function (e) { if (e.target === detailBackdrop) cerrarDetalleFn(); });
    }

    var btnDetalleCerrar = document.getElementById('btnDetalleCerrar');
    if (btnDetalleCerrar) btnDetalleCerrar.addEventListener('click', cerrarDetalleFn);

    var btnDetalleEditar = document.getElementById('btnDetalleEditar');
    if (btnDetalleEditar) {
      btnDetalleEditar.addEventListener('click', function () {
        var id = btnDetalleEditar.__clienteId;
        cerrarDetalleFn();
        setTimeout(function () { abrirModalEditar(id); }, 120);
      });
    }

    var btnDetalleEliminar = document.getElementById('btnDetalleEliminar');
    if (btnDetalleEliminar) {
      btnDetalleEliminar.addEventListener('click', function () {
        eliminarCliente(btnDetalleEliminar.__clienteId);
      });
    }
  }

  /* ── Utilidades ── */
  function encontrarCliente(id) {
    return state.todos.find(function (c) { return c.id === id; }) || null;
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  }

  function fmtFecha(fechaStr) {
    if (!fechaStr) return '—';
    var s = String(fechaStr).substring(0, 10);
    var partes = s.split('-');
    if (partes.length !== 3) return fechaStr;
    var d = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function fechaISO() {
    return new Date().toISOString().split('T')[0].replace(/-/g, '');
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
