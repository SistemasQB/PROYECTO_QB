/* ============================================================
   CRM Ventas — Clientes  |  clientes.js
   Vanilla JS — datos mock hardcodeados.
   Cuando el backend esté listo, reemplazar MOCK_CLIENTES con
   fetch('/api/ventas/clientes').then(r => r.json())
   ============================================================ */

(function () {
  'use strict';

  /* ================================================================
     COLORES DE AVATAR  (uno por letra inicial, palette Apple)
     ================================================================ */
  var AVATAR_COLORS = [
    '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE',
    '#5856D6', '#00C7BE', '#FF2D55', '#30B0C7', '#FECC02',
  ];

  function avatarColor(str) {
    if (!str) return AVATAR_COLORS[0];
    var code = 0;
    for (var i = 0; i < str.length; i++) { code += str.charCodeAt(i); }
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
  }

  /* ================================================================
     DATOS MOCK
     Estructura idéntica al API /api/clientes del proyecto Next.js
     ================================================================ */
  var MOCK_CLIENTES = [
    {
      id: 1, folio: 'CLI-001', cotizador: 'Alejandro Robledo',
      rfc: 'GIA850312TK8', denominacion: 'Grupo Industrial Arco',
      razonSocial: 'Grupo Industrial Arco S.A. de C.V.',
      estado: 'Nuevo León', giro: 'Metalmecánica', moneda: 'MXN',
      fechaAlta: '2024-02-15',
      contactoCalidad: 'Ing. Roberto Soto', telefonoCalidad: '(81) 8374-2200', correoCalidad: 'rsoto@grupiarco.com',
      contactoCompras: 'Lic. Patricia Garza', telefonoCompras: '(81) 8374-2211', correoCompras: 'pgarza@grupiarco.com',
    },
    {
      id: 2, folio: 'CLI-002', cotizador: 'Alejandro Robledo',
      rfc: 'MNO920804HJ3', denominacion: 'Manufacturas del Norte',
      razonSocial: 'Manufacturas del Norte S.A. de C.V.',
      estado: 'Nuevo León', giro: 'Automotriz', moneda: 'USD',
      fechaAlta: '2024-03-08',
      contactoCalidad: 'Ing. Carmen López', telefonoCalidad: '(81) 2900-4500', correoCalidad: 'clopez@mfgnorte.mx',
      contactoCompras: 'Lic. Jorge Méndez', telefonoCompras: '(81) 2900-4510', correoCompras: 'jmendez@mfgnorte.mx',
    },
    {
      id: 3, folio: 'CLI-003', cotizador: 'Sofía Martínez',
      rfc: 'TSM010921BB9', denominacion: 'Tecno Soluciones MX',
      razonSocial: 'Tecno Soluciones de México S.A. de C.V.',
      estado: 'Ciudad de México', giro: 'Electrónica', moneda: 'MXN',
      fechaAlta: '2024-04-22',
      contactoCalidad: 'Dr. Luis Herrera', telefonoCalidad: '(55) 5544-3300', correoCalidad: 'lherrera@tecnosolmx.com',
      contactoCompras: 'Ing. Ana Velázquez', telefonoCompras: '(55) 5544-3315', correoCompras: 'avelazquez@tecnosolmx.com',
    },
    {
      id: 4, folio: 'CLI-004', cotizador: 'Alejandro Robledo',
      rfc: 'DCL930605FD7', denominacion: 'Distribuidora Cerro Largo',
      razonSocial: 'Distribuidora Cerro Largo S. de R.L. de C.V.',
      estado: 'Jalisco', giro: 'Logística', moneda: 'MXN',
      fechaAlta: '2024-05-10',
      contactoCalidad: 'Ing. Fernanda Ríos', telefonoCalidad: '(33) 3615-8800', correoCalidad: 'frios@cerrolargo.mx',
      contactoCompras: 'Lic. Marco Ruiz', telefonoCompras: '(33) 3615-8820', correoCompras: 'mruiz@cerrolargo.mx',
    },
    {
      id: 5, folio: 'CLI-005', cotizador: 'Sofía Martínez',
      rfc: 'PBJ880714MC2', denominacion: 'Plásticos del Bajío',
      razonSocial: 'Plásticos del Bajío S.A. de C.V.',
      estado: 'Guanajuato', giro: 'Plásticos', moneda: 'MXN',
      fechaAlta: '2024-06-02',
      contactoCalidad: 'Ing. Diego Núñez', telefonoCalidad: '(477) 712-0090', correoCalidad: 'dnunez@plasticosbajio.com',
      contactoCompras: 'Lic. Elena Fuentes', telefonoCompras: '(477) 712-0095', correoCompras: 'efuentes@plasticosbajio.com',
    },
    {
      id: 6, folio: 'CLI-006', cotizador: 'Alejandro Robledo',
      rfc: 'LIQ751129AB5', denominacion: 'Logística Integral QB',
      razonSocial: 'Logística Integral QB S.A. de C.V.',
      estado: 'Estado de México', giro: 'Logística', moneda: 'MXN',
      fechaAlta: '2024-06-18',
      contactoCalidad: 'Ing. Valeria Sosa', telefonoCalidad: '(55) 8820-1100', correoCalidad: 'vsosa@liqb.com.mx',
      contactoCompras: 'Lic. Alejandro Torres', telefonoCompras: '(55) 8820-1110', correoCompras: 'atorres@liqb.com.mx',
    },
    {
      id: 7, folio: 'CLI-007', cotizador: 'Sofía Martínez',
      rfc: 'QMX990312QQ6', denominacion: 'Química Nacional',
      razonSocial: 'Química Nacional de México S.A. de C.V.',
      estado: 'Puebla', giro: 'Químicos', moneda: 'USD',
      fechaAlta: '2024-07-05',
      contactoCalidad: 'Dr. Arturo Castillo', telefonoCalidad: '(222) 240-7700', correoCalidad: 'acastillo@quimnac.mx',
      contactoCompras: 'Lic. Mónica Ibarra', telefonoCompras: '(222) 240-7720', correoCompras: 'mibarra@quimnac.mx',
    },
    {
      id: 8, folio: 'CLI-008', cotizador: 'Alejandro Robledo',
      rfc: 'EMP010804RR1', denominacion: 'Empaque Rápido',
      razonSocial: 'Empaque Rápido S.A. de C.V.',
      estado: 'Querétaro', giro: 'Empaque', moneda: 'MXN',
      fechaAlta: '2024-07-29',
      contactoCalidad: 'Ing. Claudia Morales', telefonoCalidad: '(442) 214-0030', correoCalidad: 'cmorales@empaquerap.mx',
      contactoCompras: 'Lic. Samuel Reyes', telefonoCompras: '(442) 214-0035', correoCompras: 'sreyes@empaquerap.mx',
    },
    {
      id: 9, folio: 'CLI-009', cotizador: 'Sofía Martínez',
      rfc: 'CON981120PP9', denominacion: 'Constructora Horizonte',
      razonSocial: 'Constructora Horizonte S.A. de C.V.',
      estado: 'Sonora', giro: 'Construcción', moneda: 'MXN',
      fechaAlta: '2024-08-14',
      contactoCalidad: 'Arq. Helena Vega', telefonoCalidad: '(662) 213-5500', correoCalidad: 'hvega@constructorahorizonte.mx',
      contactoCompras: 'Lic. Rodrigo Acosta', telefonoCompras: '(662) 213-5515', correoCompras: 'racosta@constructorahorizonte.mx',
    },
    {
      id: 10, folio: 'CLI-010', cotizador: 'Alejandro Robledo',
      rfc: 'MED870522LL4', denominacion: 'Médica del Noreste',
      razonSocial: 'Médica del Noreste S.A. de C.V.',
      estado: 'Tamaulipas', giro: 'Médico', moneda: 'USD',
      fechaAlta: '2024-09-03',
      contactoCalidad: 'Dra. Isabel Pérez', telefonoCalidad: '(834) 316-0800', correoCalidad: 'iperez@medicaNE.com',
      contactoCompras: 'Lic. Tomás Sánchez', telefonoCompras: '(834) 316-0810', correoCompras: 'tsanchez@medicaNE.com',
    },
    {
      id: 11, folio: 'CLI-011', cotizador: 'Sofía Martínez',
      rfc: 'IEG931204DD8', denominacion: 'Ingeniería Estructural GH',
      razonSocial: 'Ingeniería Estructural GH S.A. de C.V.',
      estado: 'Jalisco', giro: 'Ingeniería', moneda: 'MXN',
      fechaAlta: '2024-09-25',
      contactoCalidad: 'Ing. Germán Heredia', telefonoCalidad: '(33) 3820-6600', correoCalidad: 'gheredia@iegh.mx',
      contactoCompras: 'Lic. Rosa Mora', telefonoCompras: '(33) 3820-6610', correoCompras: 'rmora@iegh.mx',
    },
    {
      id: 12, folio: 'CLI-012', cotizador: 'Alejandro Robledo',
      rfc: 'ALI760315TT0', denominacion: 'Alimentos Selectos del Sur',
      razonSocial: 'Alimentos Selectos del Sur S.A. de C.V.',
      estado: 'Veracruz', giro: 'Alimentos', moneda: 'MXN',
      fechaAlta: '2024-10-11',
      contactoCalidad: 'Ing. Nadia Flores', telefonoCalidad: '(229) 931-4400', correoCalidad: 'nflores@alimselecur.mx',
      contactoCompras: 'Lic. César Luna', telefonoCompras: '(229) 931-4415', correoCompras: 'cluna@alimselecur.mx',
    },
    {
      id: 13, folio: 'CLI-013', cotizador: 'Sofía Martínez',
      rfc: 'MAQ020718EE3', denominacion: 'Maquinaria Pesada MX',
      razonSocial: 'Maquinaria Pesada MX S.A. de C.V.',
      estado: 'Chihuahua', giro: 'Maquinaria', moneda: 'USD',
      fechaAlta: '2024-11-07',
      contactoCalidad: 'Ing. Pablo Ramos', telefonoCalidad: '(614) 425-3300', correoCalidad: 'pramos@maqpesadamx.com',
      contactoCompras: 'Lic. Daniela Cruz', telefonoCompras: '(614) 425-3315', correoCompras: 'dcruz@maqpesadamx.com',
    },
    {
      id: 14, folio: 'CLI-014', cotizador: 'Alejandro Robledo',
      rfc: 'TEX850902FF5', denominacion: 'Textiles Monterrey',
      razonSocial: 'Textiles Monterrey S.A. de C.V.',
      estado: 'Nuevo León', giro: 'Textil', moneda: 'MXN',
      fechaAlta: '2024-11-22',
      contactoCalidad: 'Lic. Sandra Guerrero', telefonoCalidad: '(81) 8344-7700', correoCalidad: 'sguerrero@textilesmty.mx',
      contactoCompras: 'Ing. Óscar Medina', telefonoCompras: '(81) 8344-7715', correoCompras: 'omedina@textilesmty.mx',
    },
    {
      id: 15, folio: 'CLI-015', cotizador: 'Sofía Martínez',
      rfc: 'SRV910630GG7', denominacion: 'Servicios Integrados AXIS',
      razonSocial: 'Servicios Integrados AXIS S.A. de C.V.',
      estado: 'Ciudad de México', giro: 'Servicios', moneda: 'MXN',
      fechaAlta: '2024-12-05',
      contactoCalidad: 'Lic. Renata Ponce', telefonoCalidad: '(55) 5280-9900', correoCalidad: 'rponce@axis-servicios.mx',
      contactoCompras: 'Lic. Eduardo Leal', telefonoCompras: '(55) 5280-9915', correoCompras: 'eleal@axis-servicios.mx',
    },
  ];

  /* ================================================================
     USUARIO MOCK
     ================================================================ */
  var USER_MOCK = {
    nombre: 'Alejandro Robledo',
    email:  'alejandro.robledo@qualitybolca.net',
  };

  /* ================================================================
     ESTADO DE LA VISTA
     ================================================================ */
  var state = {
    todos:          MOCK_CLIENTES.slice(),   /* fuente original */
    filtrados:      [],                      /* tras aplicar filtros */
    pagina:         1,
    porPagina:      10,
    sortCol:        'folio',
    sortDir:        'asc',   /* 'asc' | 'desc' */
    editandoId:     null,    /* null = nuevo, number = editar */
    detalleId:      null,
  };

  /* ================================================================
     INIT
     ================================================================ */
  function init() {
    setUserInfo();
    aplicarFiltros();
    bindEvents();
  }

  /* ── Info de usuario ── */
  function setUserInfo() {
    var inicial = (USER_MOCK.nombre || 'U')[0].toUpperCase();
    var avatarSidebar = document.getElementById('userAvatarSidebar');
    var nameSidebar   = document.getElementById('userNameSidebar');
    var emailSidebar  = document.getElementById('userEmailSidebar');
    var avatarTop     = document.getElementById('userAvatarTop');
    var nameTop       = document.getElementById('userNameTop');

    if (avatarSidebar) avatarSidebar.textContent = inicial;
    if (nameSidebar)   nameSidebar.textContent   = USER_MOCK.nombre;
    if (emailSidebar)  emailSidebar.textContent  = USER_MOCK.email;
    if (avatarTop)     avatarTop.textContent     = inicial;
    if (nameTop)       nameTop.textContent       = USER_MOCK.nombre.split(' ')[0];

    var total = document.getElementById('totalClientes');
    if (total) total.textContent = state.todos.length;
  }

  /* ================================================================
     FILTROS + ORDEN
     ================================================================ */
  function aplicarFiltros() {
    var q      = (document.getElementById('inputBuscar')  || {}).value || '';
    var estado = (document.getElementById('selectEstado') || {}).value || '';
    var giro   = (document.getElementById('selectGiro')   || {}).value || '';
    var moneda = (document.getElementById('selectMoneda') || {}).value || '';

    var texto = q.toLowerCase().trim();

    state.filtrados = state.todos.filter(function (c) {
      if (estado && c.estado !== estado) return false;
      if (giro   && c.giro   !== giro)   return false;
      if (moneda && c.moneda !== moneda) return false;
      if (texto) {
        var hay = [c.folio, c.denominacion, c.razonSocial, c.rfc, c.cotizador]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(texto)) return false;
      }
      return true;
    });

    /* Ordenar */
    var col = state.sortCol;
    var dir = state.sortDir === 'asc' ? 1 : -1;
    state.filtrados.sort(function (a, b) {
      var va = (a[col] || '').toString().toLowerCase();
      var vb = (b[col] || '').toString().toLowerCase();
      return va < vb ? -dir : va > vb ? dir : 0;
    });

    state.pagina = 1;

    /* Botón limpiar búsqueda */
    var btnClear = document.getElementById('btnClearSearch');
    if (btnClear) btnClear.style.display = texto ? 'flex' : 'none';

    renderTabla();
    renderPaginacion();
    actualizarConteo();
    actualizarIconosSort();
  }

  /* ================================================================
     RENDER TABLA
     ================================================================ */
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
      var rfc      = escHtml(c.rfc || '—');
      var estado   = escHtml(c.estado || '—');
      var giro     = escHtml(c.giro || '—');
      var monedaClass = c.moneda === 'USD' ? 'usd' : '';
      var fecha    = fmtFecha(c.fechaAlta);

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
          '<td class="cell-rfc">' + rfc + '</td>',
          '<td>' + estado + '</td>',
          '<td>' + giro + '</td>',
          '<td><span class="badge-moneda ' + monedaClass + '">' + escHtml(c.moneda) + '</span></td>',
          '<td class="cell-fecha">' + fecha + '</td>',
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

  /* ================================================================
     PAGINACIÓN
     ================================================================ */
  function renderPaginacion() {
    var bar      = document.getElementById('paginationBar');
    var info     = document.getElementById('paginationInfo');
    var controls = document.getElementById('paginationControls');
    if (!bar) return;

    var total    = state.filtrados.length;
    var paginas  = Math.ceil(total / state.porPagina);
    var inicio   = (state.pagina - 1) * state.porPagina + 1;
    var fin      = Math.min(state.pagina * state.porPagina, total);

    if (total === 0) { bar.style.display = 'none'; return; }

    bar.style.display = 'flex';

    if (info) {
      info.textContent = 'Mostrando ' + inicio + '–' + fin + ' de ' + total;
    }

    if (!controls) return;

    var html = '';

    /* Prev */
    html += '<button class="page-btn" data-page="prev"' + (state.pagina === 1 ? ' disabled' : '') + '>';
    html += '<i class="fa-solid fa-chevron-left"></i></button>';

    /* Páginas */
    var rango = paginasRango(state.pagina, paginas);
    rango.forEach(function (p) {
      if (p === '…') {
        html += '<span class="page-btn" style="pointer-events:none">…</span>';
      } else {
        html += '<button class="page-btn' + (p === state.pagina ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
    });

    /* Next */
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

  /* ================================================================
     CONTEO
     ================================================================ */
  function actualizarConteo() {
    var el = document.getElementById('resultCount');
    if (!el) return;
    var n = state.filtrados.length;
    el.textContent = n === 1 ? '1 cliente' : n + ' clientes';
  }

  /* ================================================================
     ICONOS DE SORT
     ================================================================ */
  function actualizarIconosSort() {
    document.querySelectorAll('.th-sortable').forEach(function (th) {
      var icon = th.querySelector('.sort-icon');
      if (!icon) return;
      icon.classList.remove('asc', 'desc');
      if (th.dataset.col === state.sortCol) {
        icon.classList.add(state.sortDir);
      }
    });
  }

  /* ================================================================
     MODAL — NUEVO / EDITAR
     ================================================================ */
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
    var ids = ['fCotizador','fRfc','fDenominacion','fRazonSocial',
               'fContactoCalidad','fTelCalidad','fCorreoCalidad',
               'fContactoCompras','fTelCompras','fCorreoCompras'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var selEstado = document.getElementById('fEstado');
    var selGiro   = document.getElementById('fGiro');
    var selMoneda = document.getElementById('fMoneda');
    if (selEstado) selEstado.value = '';
    if (selGiro)   selGiro.value   = '';
    if (selMoneda) selMoneda.value = 'MXN';

    /* Limpiar errores */
    document.querySelectorAll('.form-input.error').forEach(function (el) {
      el.classList.remove('error');
    });
  }

  function rellenarFormModal(c) {
    limpiarFormModal();
    var mapa = {
      fCotizador:        c.cotizador,
      fRfc:              c.rfc,
      fDenominacion:     c.denominacion,
      fRazonSocial:      c.razonSocial,
      fContactoCalidad:  c.contactoCalidad,
      fTelCalidad:       c.telefonoCalidad,
      fCorreoCalidad:    c.correoCalidad,
      fContactoCompras:  c.contactoCompras,
      fTelCompras:       c.telefonoCompras,
      fCorreoCompras:    c.correoCompras,
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
    if (selMoneda) selMoneda.value = c.moneda || 'MXN';
  }

  function mostrarModal() {
    var backdrop = document.getElementById('modalBackdrop');
    if (backdrop) backdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    /* Foco al primer campo */
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

  /* ── Guardar ── */
  function guardarCliente() {
    var denominacion = (document.getElementById('fDenominacion') || {}).value || '';
    var razonSocial  = (document.getElementById('fRazonSocial')  || {}).value || '';

    /* Validación */
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

    if (!ok) {
      mostrarToast('Denominación y razón social son requeridas', 'error');
      return;
    }

    var datos = {
      cotizador:        (document.getElementById('fCotizador')       || {}).value || '',
      rfc:              (document.getElementById('fRfc')             || {}).value || '',
      denominacion:     denominacion.trim(),
      razonSocial:      razonSocial.trim(),
      estado:           (document.getElementById('fEstado')          || {}).value || '',
      giro:             (document.getElementById('fGiro')            || {}).value || '',
      moneda:           (document.getElementById('fMoneda')          || {}).value || 'MXN',
      contactoCalidad:  (document.getElementById('fContactoCalidad') || {}).value || '',
      telefonoCalidad:  (document.getElementById('fTelCalidad')      || {}).value || '',
      correoCalidad:    (document.getElementById('fCorreoCalidad')   || {}).value || '',
      contactoCompras:  (document.getElementById('fContactoCompras') || {}).value || '',
      telefonoCompras:  (document.getElementById('fTelCompras')      || {}).value || '',
      correoCompras:    (document.getElementById('fCorreoCompras')   || {}).value || '',
    };

    if (state.editandoId !== null) {
      /* Editar */
      var idx = state.todos.findIndex(function (c) { return c.id === state.editandoId; });
      if (idx !== -1) {
        Object.assign(state.todos[idx], datos);
        mostrarToast('Cliente actualizado correctamente', 'success');
      }
    } else {
      /* Nuevo */
      var nuevoId  = Math.max.apply(null, state.todos.map(function (c) { return c.id; })) + 1;
      var maxFolio = state.todos.length + 1;
      datos.id      = nuevoId;
      datos.folio   = 'CLI-' + String(maxFolio).padStart(3, '0');
      datos.fechaAlta = new Date().toISOString().split('T')[0];
      state.todos.push(datos);

      /* Actualizar contador en header */
      var total = document.getElementById('totalClientes');
      if (total) total.textContent = state.todos.length;

      mostrarToast('Cliente creado correctamente', 'success');
    }

    cerrarModal();
    aplicarFiltros();
  }

  /* ================================================================
     ELIMINAR
     ================================================================ */
  function eliminarCliente(id) {
    var cliente = encontrarCliente(id);
    if (!cliente) return;

    if (!confirm('¿Eliminar el cliente "' + cliente.denominacion + '"?\nEsta acción no se puede deshacer.')) return;

    state.todos = state.todos.filter(function (c) { return c.id !== id; });

    /* Si estaba el detalle abierto, cerrarlo */
    if (state.detalleId === id) cerrarDetalleFn();

    var total = document.getElementById('totalClientes');
    if (total) total.textContent = state.todos.length;

    mostrarToast('Cliente eliminado', 'success');
    aplicarFiltros();
  }

  /* ================================================================
     PANEL DETALLE
     ================================================================ */
  function abrirDetalle(id) {
    var cliente = encontrarCliente(id);
    if (!cliente) return;

    state.detalleId = id;
    var color   = avatarColor(cliente.denominacion);
    var inicial = (cliente.denominacion || '?')[0].toUpperCase();

    /* Avatar */
    var avatar = document.getElementById('detailAvatar');
    if (avatar) {
      avatar.textContent = inicial;
      avatar.style.background = color;
    }

    /* Nombres */
    setText('detailDenominacion', cliente.denominacion);
    setText('detailRazon', cliente.razonSocial);

    /* Badges */
    var badgesEl = document.getElementById('detailBadges');
    if (badgesEl) {
      var badges = '';
      if (cliente.estado) badges += '<span class="badge badge-estado">' + escHtml(cliente.estado) + '</span>';
      if (cliente.giro)   badges += '<span class="badge badge-giro">'   + escHtml(cliente.giro)   + '</span>';
      badgesEl.innerHTML = badges;
    }

    /* Info general */
    var infoEl = document.getElementById('detailInfoGeneral');
    if (infoEl) {
      infoEl.innerHTML = [
        detailRow('Folio',    cliente.folio,    'mono'),
        detailRow('RFC',      cliente.rfc,      'mono'),
        detailRow('Cotizador',cliente.cotizador),
        detailRow('Moneda',   cliente.moneda),
        detailRow('Alta',     fmtFecha(cliente.fechaAlta)),
      ].join('');
    }

    /* Calidad */
    var calidadEl = document.getElementById('detailCalidad');
    if (calidadEl) {
      calidadEl.innerHTML = [
        detailRow('Nombre',  cliente.contactoCalidad),
        detailRow('Teléfono',cliente.telefonoCalidad),
        detailRow('Correo',  cliente.correoCalidad),
      ].join('');
    }

    /* Compras */
    var comprasEl = document.getElementById('detailCompras');
    if (comprasEl) {
      comprasEl.innerHTML = [
        detailRow('Nombre',  cliente.contactoCompras),
        detailRow('Teléfono',cliente.telefonoCompras),
        detailRow('Correo',  cliente.correoCompras),
      ].join('');
    }

    /* Botones del footer */
    var btnEditar   = document.getElementById('btnDetalleEditar');
    var btnEliminar = document.getElementById('btnDetalleEliminar');
    if (btnEditar)   btnEditar.__clienteId   = id;
    if (btnEliminar) btnEliminar.__clienteId = id;

    /* Mostrar */
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
    var empty  = !value || value === '—';
    var clazz  = 'detail-row-value' + (extraClass ? ' ' + extraClass : '') + (empty ? ' detail-row-empty' : '');
    var texto  = empty ? '—' : escHtml(value);
    return [
      '<div class="detail-row">',
        '<span class="detail-row-label">' + escHtml(label) + '</span>',
        '<span class="' + clazz + '">' + texto + '</span>',
      '</div>',
    ].join('');
  }

  /* ================================================================
     EXPORTAR CSV
     ================================================================ */
  function exportarCSV() {
    var cols = ['Folio','Cotizador','Fecha Alta','RFC','Denominación','Razón Social',
                'Estado','Giro','Moneda',
                'Contacto Calidad','Tel Calidad','Correo Calidad',
                'Contacto Compras','Tel Compras','Correo Compras'];

    var filas = state.filtrados.map(function (c) {
      return [
        c.folio, c.cotizador, fmtFecha(c.fechaAlta), c.rfc, c.denominacion, c.razonSocial,
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
    a.href     = url;
    a.download = 'clientes_' + fechaISO() + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarToast('Exportación lista (' + state.filtrados.length + ' registros)', 'success');
  }

  /* ================================================================
     TOAST
     ================================================================ */
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
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 280);
    }, 3000);
  }

  /* ================================================================
     SIDEBAR MÓVIL
     ================================================================ */
  window.toggleSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible');
  };

  window.cerrarSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar)  sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

  /* ================================================================
     BIND EVENTS
     ================================================================ */
  function bindEvents() {

    /* Búsqueda — debounce 200ms */
    var inputBuscar = document.getElementById('inputBuscar');
    if (inputBuscar) {
      var timer;
      inputBuscar.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(aplicarFiltros, 200);
      });
    }

    /* Limpiar búsqueda */
    var btnClear = document.getElementById('btnClearSearch');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        var inp = document.getElementById('inputBuscar');
        if (inp) { inp.value = ''; inp.focus(); }
        aplicarFiltros();
      });
    }

    /* Selects de filtro */
    ['selectEstado','selectGiro','selectMoneda'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', aplicarFiltros);
    });

    /* Reset filtros */
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

    /* Nuevo cliente */
    var btnNuevo = document.getElementById('btnNuevoCliente');
    if (btnNuevo) btnNuevo.addEventListener('click', abrirModalNuevo);

    /* Exportar */
    var btnExp = document.getElementById('btnExportar');
    if (btnExp) btnExp.addEventListener('click', exportarCSV);

    /* Guardar modal */
    var btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) btnGuardar.addEventListener('click', guardarCliente);

    /* Cerrar modal */
    var btnModalClose    = document.getElementById('btnModalClose');
    var btnModalCancelar = document.getElementById('btnModalCancelar');
    if (btnModalClose)    btnModalClose.addEventListener('click', cerrarModal);
    if (btnModalCancelar) btnModalCancelar.addEventListener('click', cerrarModal);

    /* Cerrar modal al clickear backdrop */
    var modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) cerrarModal();
      });
    }

    /* Limpiar error al escribir */
    ['fDenominacion','fRazonSocial'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.classList.remove('error'); });
    });

    /* Esc cierra modales */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var modal   = document.getElementById('modalBackdrop');
        var detalle = document.getElementById('detailBackdrop');
        if (modal   && modal.style.display   !== 'none') { cerrarModal(); return; }
        if (detalle && detalle.style.display !== 'none') { cerrarDetalleFn(); }
      }
    });

    /* Clicks en tabla (delegación) */
    var tbody = document.getElementById('clientesTbody');
    if (tbody) {
      tbody.addEventListener('click', function (e) {
        /* Botón editar */
        var btnEditar  = e.target.closest('[data-action="editar"]');
        var btnEliminar = e.target.closest('[data-action="eliminar"]');
        var fila       = e.target.closest('tr[data-id]');

        if (btnEditar) {
          e.stopPropagation();
          abrirModalEditar(parseInt(btnEditar.dataset.id, 10));
          return;
        }

        if (btnEliminar) {
          e.stopPropagation();
          eliminarCliente(parseInt(btnEliminar.dataset.id, 10));
          return;
        }

        /* Click en fila → abrir detalle */
        if (fila) {
          abrirDetalle(parseInt(fila.dataset.id, 10));
        }
      });
    }

    /* Paginación (delegación) */
    var paginationControls = document.getElementById('paginationControls');
    if (paginationControls) {
      paginationControls.addEventListener('click', function (e) {
        var btn = e.target.closest('.page-btn');
        if (!btn || btn.disabled) return;
        var p = btn.dataset.page;
        var total = Math.ceil(state.filtrados.length / state.porPagina);
        if (p === 'prev') {
          if (state.pagina > 1) state.pagina--;
        } else if (p === 'next') {
          if (state.pagina < total) state.pagina++;
        } else {
          state.pagina = parseInt(p, 10);
        }
        renderTabla();
        renderPaginacion();
        /* Scroll al top de la tabla */
        var tc = document.querySelector('.table-card');
        if (tc) tc.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    /* Columnas ordenables */
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

    /* Cerrar detalle al clickear backdrop */
    var detailBackdrop = document.getElementById('detailBackdrop');
    if (detailBackdrop) {
      detailBackdrop.addEventListener('click', function (e) {
        if (e.target === detailBackdrop) cerrarDetalleFn();
      });
    }

    /* Botón cerrar panel */
    var btnDetalleCerrar = document.getElementById('btnDetalleCerrar');
    if (btnDetalleCerrar) btnDetalleCerrar.addEventListener('click', cerrarDetalleFn);

    /* Botón editar desde detalle */
    var btnDetalleEditar = document.getElementById('btnDetalleEditar');
    if (btnDetalleEditar) {
      btnDetalleEditar.addEventListener('click', function () {
        var id = btnDetalleEditar.__clienteId;
        cerrarDetalleFn();
        setTimeout(function () { abrirModalEditar(id); }, 120);
      });
    }

    /* Botón eliminar desde detalle */
    var btnDetalleEliminar = document.getElementById('btnDetalleEliminar');
    if (btnDetalleEliminar) {
      btnDetalleEliminar.addEventListener('click', function () {
        var id = btnDetalleEliminar.__clienteId;
        eliminarCliente(id);
      });
    }
  }

  /* ================================================================
     UTILIDADES
     ================================================================ */
  function encontrarCliente(id) {
    return state.todos.find(function (c) { return c.id === id; }) || null;
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  }

  function fmtFecha(fechaStr) {
    if (!fechaStr) return '—';
    var partes = String(fechaStr).split('-');
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
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── ARRANQUE ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
