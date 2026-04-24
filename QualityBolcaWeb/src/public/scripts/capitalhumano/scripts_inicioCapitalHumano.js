/* ══════════════════════════════════════════════════════════
   FECHA EN BANNER
══════════════════════════════════════════════════════════ */
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const now    = new Date()
document.getElementById('bannerDate').textContent =
  `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
const sidebar     = document.getElementById('sidebar')
const mainWrapper = document.getElementById('mainWrapper')
const overlay     = document.getElementById('overlay')
let   sidebarOpen = true

function toggleSidebar() {
  sidebarOpen = !sidebarOpen
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open', sidebarOpen)
    overlay.classList.toggle('active', sidebarOpen)
  } else {
    sidebar.classList.toggle('collapsed', !sidebarOpen)
    mainWrapper.classList.toggle('expanded', !sidebarOpen)
  }
}

function closeSidebar() {
  sidebarOpen = false
  sidebar.classList.remove('open')
  overlay.classList.remove('active')
}

/* ══════════════════════════════════════════════════════════
   NAVEGACIÓN
══════════════════════════════════════════════════════════ */
function navigate(pageId, navItem) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.getElementById('page-' + pageId).classList.add('active')

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  if (navItem) navItem.classList.add('active')

  const label = navItem
    ? navItem.dataset.label
    : document.querySelector('.nav-item.active')?.dataset.label
  if (label) document.getElementById('breadcrumbCurrent').textContent = label

  if (window.innerWidth <= 768) closeSidebar()
}

/* ══════════════════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════════════════ */
const THEME_KEY = 'ch_theme'

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const next   = isDark ? 'light' : 'dark'
  aplicarTheme(next)
  localStorage.setItem(THEME_KEY, next)
}

function aplicarTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙'
}

// Cargar tema guardado al iniciar
aplicarTheme(localStorage.getItem(THEME_KEY) ?? 'light')

/* ══════════════════════════════════════════════════════════
   CATÁLOGOS — CONFIGURACIÓN
   endpoint: ruta que deberá existir en el backend.
   columnas: headers visibles de la tabla.
   campos:   keys del objeto JSON que se mapean a cada columna.
   render:   funciones opcionales para celdas especiales.
══════════════════════════════════════════════════════════ */
const endpointsBase = 'catalogos'
const CATALOGOS_CONFIG = {
  plantas: {
    titulo:   'Plantas',
    endpoint: '/api/capitalhumano/catalogos/plantas',
    columnas: ['ID', 'Nombre de planta', 'Activo'],
    campos:   ['id', 'nombre_planta', 'activo'],
    render:   {
      activo: v => `<span class="cat-active-pill ${v ? 'si' : 'no'}">${v ? 'Activo' : 'Inactivo'}</span>`
    },
    formulario: [
      { name: 'nombre_planta', label: 'Nombre de planta', type: 'text',   required: true, maxlength: 100, placeholder: 'Ej. Planta Norte' },
      { name: 'activo',        label: 'Estatus',          type: 'select', required: true,
        options: [{ value: 1, label: 'Activo' }, { value: 0, label: 'Inactivo' }] }
    ]
  },
  departamentos: {
    titulo:   'Departamentos',
    endpoint: '/api/capitalhumano/catalogos/departamentos',
    columnas: ['ID', 'Departamento'],
    campos:   ['id', 'nombre_departamento'],
    render:   {},
    formulario: [
      { name: 'nombre_departamento', label: 'Departamento', type: 'text', required: true, maxlength: 100, placeholder: 'Ej. Producción' }
    ]
  },
  puestos: {
    titulo:   'Puestos',
    endpoint: '/api/capitalhumano/catalogos/puestos',
    columnas: ['ID', 'Puesto'],
    campos:   ['id', 'nombre_puesto'],
    render:   {},
    formulario: [
      { name: 'nombre_puesto', label: 'Puesto', type: 'text', required: true, maxlength: 100, placeholder: 'Ej. Operador de línea' }
    ]
  },
  regiones: {
    titulo:   'Regiones',
    endpoint: '/api/capitalhumano/catalogos/regiones',
    columnas: ['ID', 'Región'],
    campos:   ['id', 'nombre_region'],
    render:   {},
    formulario: [
      { name: 'nombre_region', label: 'Región', type: 'text', required: true, maxlength: 100, placeholder: 'Ej. Región Norte' }
    ]
  },
  escolaridades: {
    titulo:   'Escolaridades',
    endpoint: '/api/capitalhumano/catalogos/escolaridades',
    columnas: ['ID', 'Escolaridad'],
    campos:   ['id', 'nombre_escolaridad'],
    render:   {},
    formulario: [
      { name: 'nombre_escolaridad', label: 'Escolaridad', type: 'text', required: true, maxlength: 100, placeholder: 'Ej. Preparatoria' }
    ]
  },
  tipos_contratacion: {
    titulo:   'Tipos de contratación',
    endpoint: '/api/capitalhumano/catalogos/tipos-contratacion',
    columnas: ['ID', 'Descripción'],
    campos:   ['id', 'descripcion'],
    render:   {},
    formulario: [
      { name: 'descripcion', label: 'Descripción', type: 'text', required: true, maxlength: 100, placeholder: 'Ej. Tiempo indeterminado' }
    ]
  },
  motivos_baja: {
    titulo:   'Motivos de baja',
    endpoint: '/api/capitalhumano/catalogos/motivos-baja',
    columnas: ['ID', 'Descripción', 'Complementario'],
    campos:   ['id', 'descripcion_baja', 'complementario'],
    render:   {},
    formulario: [
      { name: 'descripcion_baja', label: 'Descripción',    type: 'text',   required: true, maxlength: 150, placeholder: 'Ej. Renuncia voluntaria' },
      { name: 'complementario',   label: 'Complementario', type: 'select', required: true,
        options: [{ value: 1, label: 'Sí' }, { value: 0, label: 'No' }] }
    ]
  },
  infonavit_tipos_descuento: {
    titulo:   'INFONAVIT — Tipos de descuento',
    endpoint: '/api/capitalhumano/catalogos/infonavit-tipos-descuento',
    columnas: ['ID', 'Tipo de descuento'],
    campos:   ['id', 'descripcion_descuento'],
    render:   {},
    formulario: [
      { name: 'descripcion_descuento', label: 'Tipo de descuento', type: 'text', required: true, maxlength: 100, placeholder: 'Ej. Factor de salario' }
    ]
  }
}

/* ══════════════════════════════════════════════════════════
   ESTADO EN MEMORIA
══════════════════════════════════════════════════════════ */
const _cat = {
  config:       null,
  datos:        [],   // todos los registros del servidor
  filtrados:    [],   // registros después del filtro
  paginaActual: 1,
  registrosPag: 10
}
let _catNombre = null   // nombre de la clave del catálogo activo

/* ══════════════════════════════════════════════════════════
   ABRIR CATÁLOGO — fetch + render inicial
══════════════════════════════════════════════════════════ */
async function abrirCatalogo(btn) {
  const nombre = btn.dataset.catalogo
  const config = CATALOGOS_CONFIG[nombre]
  if (!config) return
  _catNombre = nombre

  // Marcar botón activo
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('cat-active'))
  btn.classList.add('cat-active')

  // Mostrar panel y resetear estado
  const panel = document.getElementById('cat-panel')
  panel.hidden = false
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' })

  _cat.config       = config
  _cat.paginaActual = 1
  _cat.registrosPag = +document.getElementById('cat-page-size').value || 10

  document.getElementById('cat-panel-title').textContent = config.titulo
  document.getElementById('cat-panel-count').textContent = ''
  document.getElementById('cat-filter').value = ''
  mostrarEstado('loading')

  try {
    const res = await solicitudInformacion(endpointsBase, {_csrf:tok, catalogo: nombre})
    console.log('Respuesta del servidor:', res)
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const json =  res
    tok = json.token
    
    _cat.datos     = Array.isArray(json) ? json : (json.data ?? [])
    _cat.filtrados = [..._cat.datos]

    const total = _cat.datos.length
    document.getElementById('cat-panel-count').textContent =
      `${total} registro${total !== 1 ? 's' : ''}`

    if (total === 0) {
      mostrarEstado('empty', 'Este catálogo no tiene registros aún.')
    } else {
      mostrarEstado('table')
      renderEncabezados()
      renderPagina()
    }
  } catch (err) {
    console.error(err)
    mostrarEstado('empty', `No se pudo cargar el catálogo: ${err.message}`)
  }
}

/* ── Controla qué sección del panel es visible ─────────── */
function mostrarEstado(estado, msg = '') {
  document.getElementById('cat-loading').hidden    = estado !== 'loading'
  document.getElementById("cat-empty").hidden       = estado !== "empty";
  document.getElementById("cat-table-wrap").hidden  = estado !== "table";
  document.getElementById("cat-pagination").hidden   = estado !== "table";
 
  if (estado === 'empty') {
    document.getElementById('cat-empty-msg').textContent = msg
  }
}

/* ── Encabezados dinámicos ─────────────────────────────── */
function renderEncabezados() {
  const thead = document.getElementById('cat-thead')
  thead.innerHTML = `<tr>${_cat.config.columnas.map(c => `<th>${c}</th>`).join('')}</tr>`
}

/* ── Render de la página actual ────────────────────────── */
function renderPagina() {
  const inicio = (_cat.paginaActual - 1) * _cat.registrosPag
  const fin    = inicio + _cat.registrosPag
  const pagina = _cat.filtrados.slice(inicio, fin)
  const tbody  = document.getElementById('cat-tbody')
  const config = _cat.config

  if (pagina.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${config.columnas.length}"
      style="text-align:center;color:#9BB5CC;padding:32px">
      Sin resultados para el filtro aplicado.</td></tr>`
  } else {
    tbody.innerHTML = pagina.map(row => {
      const celdas = config.campos.map(campo => {
        const valor  = row[campo] ?? '—'
        const renderFn = config.render[campo]
        return `<td>${renderFn ? renderFn(valor) : escapeHtml(String(valor))}</td>`
      }).join('')
      return `<tr>${celdas}</tr>`
    }).join('')
  }

  renderPaginacion()
}

/* ── Paginación ────────────────────────────────────────── */
function renderPaginacion() {
  const total   = _cat.filtrados.length
  const pages   = Math.max(1, Math.ceil(total / _cat.registrosPag))
  const current = _cat.paginaActual
  const inicio  = Math.min((current - 1) * _cat.registrosPag + 1, total)
  const fin     = Math.min(current * _cat.registrosPag, total)

  document.getElementById('pag-info').textContent =
    total === 0 ? 'Sin registros' : `Mostrando ${inicio}–${fin} de ${total}`

  document.getElementById('pag-first').disabled = current <= 1
  document.getElementById('pag-prev').disabled  = current <= 1
  document.getElementById('pag-next').disabled  = current >= pages
  document.getElementById('pag-last').disabled  = current >= pages

  // Números de página — máximo 5, centrados en la página actual
  const pags  = []
  const rango = 2
  const desde = Math.max(1, current - rango)
  const hasta = Math.min(pages, current + rango)

  if (desde > 1) pags.push({ n: 1 }, { sep: true })
  for (let i = desde; i <= hasta; i++) pags.push({ n: i })
  if (hasta < pages) pags.push({ sep: true }, { n: pages })

  document.getElementById('pag-numbers').innerHTML = pags.map(p =>
    p.sep
      ? `<span style="color:#9BB5CC;padding:0 4px;align-self:center">…</span>`
      : `<button class="pag-btn${p.n === current ? ' active' : ''}"
           onclick="irPagina(${p.n})">${p.n}</button>`
  ).join('')
}

function cambiarPagina(dir) {
  const pages = Math.ceil(_cat.filtrados.length / _cat.registrosPag)
  _cat.paginaActual = Math.max(1, Math.min(_cat.paginaActual + dir, pages))
  renderPagina()
}

function irPagina(n) {
  const pages = Math.ceil(_cat.filtrados.length / _cat.registrosPag)
  _cat.paginaActual = n === 'last' ? pages : Math.max(1, Math.min(n, pages))
  renderPagina()
}

function cambiarTamano(n) {
  _cat.registrosPag = n
  _cat.paginaActual = 1
  if (_cat.filtrados.length > 0) renderPagina()
}

/* ── Filtrado en memoria ───────────────────────────────── */
function filtrarCatalogo(texto) {
  const q = texto.trim().toLowerCase()
  _cat.filtrados = q
    ? _cat.datos.filter(row =>
        _cat.config.campos.some(c => String(row[c] ?? '').toLowerCase().includes(q))
      )
    : [..._cat.datos]
  _cat.paginaActual = 1
  renderPagina()
}

/* ── Escape XSS ────────────────────────────────────────── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/* ══════════════════════════════════════════════════════════
   MODAL — NUEVO REGISTRO
══════════════════════════════════════════════════════════ */
function abrirModalNuevo() {
  if (!_cat.config) return
  const config = _cat.config

  document.getElementById('catModalTitle').textContent =
    `Nuevo registro — ${config.titulo}`

  const body = document.getElementById('catModalBody')
  body.innerHTML = config.formulario.map(campo => {
    const id = `mf-${campo.name}`
    let input = ''

    if (campo.type === 'select') {
      const opts = campo.options
        .map(o => `<option value="${o.value}">${escapeHtml(String(o.label))}</option>`)
        .join('')
      input = `<select class="modal-input" id="${id}" name="${campo.name}">${opts}</select>`
    } else {
      input = `<input
        class="modal-input"
        type="${campo.type}"
        id="${id}"
        name="${campo.name}"
        placeholder="${escapeHtml(campo.placeholder ?? '')}"
        ${campo.maxlength ? `maxlength="${campo.maxlength}"` : ''}
        autocomplete="off"/>`
    }

    return `
      <div class="modal-field">
        <label class="modal-label" for="${id}">
          ${escapeHtml(campo.label)}${campo.required ? ' <span class="req">*</span>' : ''}
        </label>
        ${input}
        <span class="modal-error" id="${id}-err"></span>
      </div>`
  }).join('')

  document.getElementById('catModalOverlay').hidden = false
}

function cerrarModal() {
  document.getElementById('catModalOverlay').hidden = true
  document.getElementById('catModalBody').innerHTML = ''
}

function validarModal() {
  if (!_cat.config) return false
  let valido = true

  _cat.config.formulario.forEach(campo => {
    const id    = `mf-${campo.name}`
    const el    = document.getElementById(id)
    const errEl = document.getElementById(`${id}-err`)
    const val   = el.value.trim()

    errEl.textContent = ''
    el.classList.remove('input-error')

    if (campo.required && val === '') {
      errEl.textContent = 'Este campo es obligatorio.'
      el.classList.add('input-error')
      valido = false
    }
  })

  return valido
}

function submitNuevo() {
  if (!validarModal()) return

  const body = { _csrf: tok, catalogo: _catNombre }

  _cat.config.formulario.forEach(campo => {
    const el  = document.getElementById(`mf-${campo.name}`)
    // Castear a número cuando el select usa valores numéricos
    const val = (el.tagName === 'SELECT' && el.value !== '' && !isNaN(el.value))
      ? +el.value
      : el.value.trim()
    body[campo.name] = val
  })

  cerrarModal()
  envioJson('/api/capitalhumano/catalogos/nuevo', body, window.location.pathname)
}
