// =============================================
// STATE
// =============================================
let currentEditingOrder   = null
let currentRejectingOrderId = null
let currentSupplyingOrder = null
let partidas = []

// Paginación
const ROWS_PER_PAGE = 10
let paginaActual1 = 1   // tabla 1 (todos)
let paginaActual2 = 1   // tabla 2 (por fecha)
let resultadosFecha = [] // copia filtrada para tabla 2

// =============================================
// INIT
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  renderOrders()
  updateTotals()
  agregarEventos()
  resultadosFecha = completados
  renderTablaFecha()
})

// =============================================
// TOGGLE SECCIONES
// =============================================
function toggleSection(bodyId, chevronId) {
  const body    = document.getElementById(bodyId)
  const chevron = document.getElementById(chevronId)
  if (body.style.display === 'none') {
    body.style.display = 'block'
    chevron.textContent = '▲'
  } else {
    body.style.display = 'none'
    chevron.textContent = '▼'
  }
}

// =============================================
// FILTRO POR FECHAS
// =============================================
async function buscarPorFecha() {
  const fi = document.getElementById('fechaInicio').value
  const ff = document.getElementById('fechaFin').value

  if (!fi || !ff) {
    Swal.fire({ icon:'warning', title:'Campos requeridos', text:'Ingresa ambas fechas para realizar la búsqueda.', background:'var(--card)', color:'var(--foreground)' })
    return
  }
  if (fi > ff) {
    Swal.fire({ icon:'error', title:'Rango inválido', text:'La fecha de inicio no puede ser mayor a la fecha fin.', background:'var(--card)', color:'var(--foreground)' })
    return
  }

  const inicio = new Date(fi + 'T00:00:00')
  const fin    = new Date(ff + 'T23:59:59')

  const resultados = await solicitudInformacion('crudPedidosInsumos', { inicio, fin, tipo: 'consultaPorFecha', _csrf: tok })
  if (resultados.length === 0) {
    Swal.fire({ icon:'warning', title:'Sin resultados', text:'No se encontraron resultados para la fecha seleccionada.', background:'var(--card)', color:'var(--foreground)' })
    return
  }
  
  resultadosFecha = resultados.resultados.filter((o) => {
    const f = new Date(o.createdAt)
    return f >= inicio && f <= fin
  })

  paginaActual2 = 1
  document.getElementById('seccionTabla2').style.display = 'block'

  // Expandir tabla 2
  document.getElementById('bodyTabla2').style.display = 'block'
  document.getElementById('chevron2').textContent = '▲'

  renderTablaFecha()

  setTimeout(() => {
    document.getElementById('seccionTabla2').scrollIntoView({ behavior:'smooth', block:'start' })
  }, 150)
}

function limpiarBusqueda() {
  document.getElementById('fechaInicio').value = ''
  document.getElementById('fechaFin').value    = ''
  document.getElementById('seccionTabla2').style.display = 'none'
  resultadosFecha = []
}

// =============================================
// RENDER TABLA 1 (todos los pedidos, paginada)
// =============================================
function renderOrders() {
  const tbody      = document.getElementById("ordersTableBody")
  const emptyState = document.getElementById("emptyState")
  tbody.innerHTML = ""

  if (resultados.length === 0) {
    emptyState.style.display = "block"
    renderPaginacion('paginacionTabla1', resultados.length, paginaActual1, (p) => { paginaActual1 = p; renderOrders() })
    return
  }

  emptyState.style.display = "none"

  const totalPags  = Math.ceil(resultados.length / ROWS_PER_PAGE)
  if (paginaActual1 > totalPags) paginaActual1 = totalPags

  const inicio = (paginaActual1 - 1) * ROWS_PER_PAGE
  const fin    = inicio + ROWS_PER_PAGE
  const pagina = resultados.slice(inicio, fin)

  pagina.forEach((order) => {
    tbody.appendChild(crearFilaTabla1(order))
  })

  renderPaginacion('paginacionTabla1', resultados.length, paginaActual1, (p) => { paginaActual1 = p; renderOrders() })

}

function crearFilaTabla1(order) {
  const row = document.createElement("tr")
  let articulosSolicitados
  try { articulosSolicitados = JSON.parse(order.solicitado) } catch (e) { articulosSolicitados = partidas }

  row.innerHTML = `
    <td><span class="order-id">#${order.id}</span></td>
    <td>${order.createdAt.split("T")[0]}</td>
    <td>${order.planta}</td>
    <td><span class="order-items">${articulosSolicitados.length - 1} artículos</span></td>
    <td class="text-right"><span class="order-total">${formatCurrency(articulosSolicitados[articulosSolicitados.length - 1].total)}</span></td>
    <td class="text-right"><span class="order-total supplied">${order.solicitante}</span></td>
    <td class="text-center"><span class="status-badge ${getStatusClass(order.estatus)}">${getStatusLabel(order.estatus)}</span></td>
    <td class="text-center">
      <div class="action-buttons">
        <button class="action-btn edit"   title="Editar"    onclick="openEditModal('${order.id}')">🔍</button>
        <button class="action-btn reject" title="Rechazar"  onclick="openRejectModal('${order.id}')">✕</button>
        <button class="action-btn supply" title="Surtir"    onclick="openSupplyModal('${order.id}')">✓</button>
        <button class="action-btn delete" title="Eliminar"  onclick="deleteOrder('${order.id}')">🗑️</button>
      </div>
    </td>
  `
  return row
}

// =============================================
// RENDER TABLA 2 (por fecha, paginada)
// =============================================
function renderTablaFecha() {
  const tbody      = document.getElementById("ordersTableBodyFecha")
  const emptyState = document.getElementById("emptyStateFecha")
  const badge      = document.getElementById("badgeResultados")

  tbody.innerHTML = ""
  badge.textContent = `${resultadosFecha.length} resultado${resultadosFecha.length !== 1 ? 's' : ''}`

  if (resultadosFecha.length === 0) {
    console.log('no hay resultados')
    emptyState.style.display = "block"
    renderPaginacion('paginacionTabla2', 0, paginaActual2, () => {})
    return
  }

  emptyState.style.display = "none"

  const totalPags = Math.ceil(resultadosFecha.length / ROWS_PER_PAGE)
  if (paginaActual2 > totalPags) paginaActual2 = totalPags

  const inicio = (paginaActual2 - 1) * ROWS_PER_PAGE
  const fin    = inicio + ROWS_PER_PAGE
  const pagina = resultadosFecha.slice(inicio, fin)

  pagina.forEach((order) => {
    const row = document.createElement("tr")
    let arts
    try { arts = JSON.parse(order.solicitado) } catch (e) { arts = [] }

    row.innerHTML = `
      <td><span class="order-id">#${order.id}</span></td>
      <td>${order.createdAt.split("T")[0]}</td>
      <td>${order.planta}</td>
      <td><span class="order-items">${arts.length - 1} artículos</span></td>
      <td class="text-right"><span class="order-total">${formatCurrency(arts[arts.length - 1].total)}</span></td>
      <td class="text-right"><span class="order-total supplied">${order.solicitante}</span></td>
      <td class="text-center"><span class="status-badge ${getStatusClass(order.estatus)}">${getStatusLabel(order.estatus)}</span></td>
      <td class="text-center">
        <div class="action-buttons">
          <button class="action-btn view" title="Visualizar" onclick="openViewModal('${order.id}')">👁</button>
          <button class="action-btn view" title="Visualizar" onclick="openWindow('${order.id}')">📄</button>
        </div>
      </td>
    `
    tbody.appendChild(row)
  })

  renderPaginacion('paginacionTabla2', resultadosFecha.length, paginaActual2, (p) => { paginaActual2 = p; renderTablaFecha() })
}

// =============================================
// PAGINACIÓN
// =============================================
function renderPaginacion(containerId, total, paginaActual, onPageChange) {
  const container = document.getElementById(containerId)
  container.innerHTML = ''

  if (total === 0) return

  const totalPags = Math.ceil(total / ROWS_PER_PAGE)
  if (totalPags <= 1) return

  const crearBtn = (label, pagina, deshabilitado, activo) => {
    const btn = document.createElement('button')
    btn.textContent = label
    btn.className   = 'pag-btn' + (activo ? ' pag-btn--active' : '') + (deshabilitado ? ' pag-btn--disabled' : '')
    btn.disabled    = deshabilitado
    if (!deshabilitado) btn.addEventListener('click', () => onPageChange(pagina))
    return btn
  }

  container.appendChild(crearBtn('‹ Anterior', paginaActual - 1, paginaActual === 1, false))

  // rango de páginas visibles (máx 5)
  let start = Math.max(1, paginaActual - 2)
  let end   = Math.min(totalPags, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)

  if (start > 1) {
    container.appendChild(crearBtn('1', 1, false, false))
    if (start > 2) container.insertAdjacentHTML('beforeend', '<span class="pag-ellipsis">…</span>')
  }

  for (let i = start; i <= end; i++) {
    container.appendChild(crearBtn(String(i), i, false, i === paginaActual))
  }

  if (end < totalPags) {
    if (end < totalPags - 1) container.insertAdjacentHTML('beforeend', '<span class="pag-ellipsis">…</span>')
    container.appendChild(crearBtn(String(totalPags), totalPags, false, false))
  }

  container.appendChild(crearBtn('Siguiente ›', paginaActual + 1, paginaActual === totalPags, false))

  // info
  const info = document.createElement('span')
  info.className = 'pag-info'
  const desde = (paginaActual - 1) * ROWS_PER_PAGE + 1
  const hasta = Math.min(paginaActual * ROWS_PER_PAGE, total)
  info.textContent = `${desde}–${hasta} de ${total}`
  container.appendChild(info)
}

// =============================================
// MODAL VISUALIZAR
// =============================================
function openViewModal(orderId) {
  const order = resultados.find((o) => o.id == orderId) || resultadosFecha.find((o) => o.id == orderId)
  if (!order) return

  let arts
  try { arts = JSON.parse(order.solicitado) } catch (e) { arts = order.solicitado || [] }

  const partidsView = arts.slice(0, -1)
  const totales     = arts[arts.length - 1] || {}

  const filas = partidsView.map((p) => `
    <tr>
      <td>${p.grupo || '—'}</td>
      <td>${p.descripcion || '—'}</td>
      <td class="text-right">${p.cantidad}</td>
      <td class="text-right">$${parseFloat(p.precioUnitario || 0).toFixed(2)}</td>
      <td class="text-right">$${parseFloat(p.precioTotal || (p.cantidad * p.precioUnitario) || 0).toFixed(2)}</td>
      <td class="text-center"><span class="status-badge ${p.estatus ? 'status-' + p.estatus.toLowerCase().replace(' ','_') : ''}">${p.estatus || '—'}</span></td>
    </tr>
  `).join('')

  document.getElementById('viewModalTitle').textContent = `👁 Pedido #${order.id}`
  document.getElementById('viewModalBody').innerHTML = `
    <div class="view-info-grid">
      <div class="view-info-item">
        <span class="view-info-label">Pedido</span>
        <span class="view-info-value">#${order.id}</span>
      </div>
      <div class="view-info-item">
        <span class="view-info-label">Fecha</span>
        <span class="view-info-value">${order.createdAt.split('T')[0]}</span>
      </div>
      <div class="view-info-item">
        <span class="view-info-label">Planta</span>
        <span class="view-info-value">${order.planta}</span>
      </div>
      <div class="view-info-item">
        <span class="view-info-label">Solicitante</span>
        <span class="view-info-value">${order.solicitante}</span>
      </div>
      <div class="view-info-item">
        <span class="view-info-label">Estatus</span>
        <span class="view-info-value"><span class="status-badge ${getStatusClass(order.estatus)}">${getStatusLabel(order.estatus)}</span></span>
      </div>
    </div>

    <h3 class="form-label" style="margin:20px 0 12px;">Partidas Solicitadas</h3>
    <div class="table-wrapper" style="margin-bottom:20px;">
      <table class="orders-table">
        <thead>
          <tr class="table-header">
            <th>Grupo</th>
            <th>Artículo</th>
            <th class="text-right">Cant.</th>
            <th class="text-right">P. Unitario</th>
            <th class="text-right">Subtotal</th>
            <th class="text-center">Estatus</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>

    <div class="totals-grid-modal">
      <div class="total-card">
        <p class="total-label-small">Total Solicitado</p>
        <p class="total-amount-small">${formatCurrency(totales.total || 0)}</p>
      </div>
    </div>

    ${order.observaciones ? `
    <div class="view-obs">
      <span class="view-info-label">Observaciones</span>
      <p>${order.observaciones}</p>
    </div>` : ''}
  `

  openModal('viewOrderModal')
}

// =============================================
// UPDATE TOTALS
// =============================================
function updateTotals() {
  let total = 0
  resultados.forEach((order) => {
    try { order.solicitado = JSON.parse(order.solicitado) } catch (e) {}
    total += parseFloat(order.solicitado[order.solicitado.length - 1].total)
  })
  document.getElementById("totalRequested").textContent = formatCurrency(total)
}

// =============================================
// HELPERS
// =============================================
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN" }).format(amount)
}

function getStatusLabel(status) {
  const labels = {
    pending: "Pendiente",
    PENDIENTE: "Pendiente",
    partially_supplied: "Parcialmente Surtido",
    "PARCIALMENTE SURTIDO": "Parcialmente Surtido",
    supplied: "Surtido",
    SURTIDO: "Surtido",
    rejected: "Rechazado",
    RECHAZADA: "Rechazado",
  }
  return labels[status] || status
}

function getStatusClass(status) {
  return `status-${status}`
}

// =============================================
// MODAL HELPERS
// =============================================
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
  document.body.style.overflow = "auto"
}

function clearFormErrors() {
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))
  document.querySelectorAll(".form-input, .form-textarea").forEach((el) => el.classList.remove("error"))
}

// =============================================
// EDIT MODAL
// =============================================
function openEditModal(orderId) {
  currentEditingOrder = resultados.find((o) => o.id == orderId)
  try { partidas = JSON.parse(currentEditingOrder.solicitado) } catch (e) { partidas = currentEditingOrder.solicitado }

  document.getElementById("editModalTitle").textContent = `Editar Pedido #${orderId}`
  document.getElementById("editPlant").value = currentEditingOrder.planta

  renderEditItems()
  updateEditOrderTotal()
  openModal("editOrderModal")
}

function renderEditItems() {
  const container = document.getElementById("editItemsContainer")
  container.innerHTML = ""
  partidas.forEach((item, index) => {
    if (index < partidas.length - 1) {
      const itemDiv = document.createElement("div")
      itemDiv.className = "item-box"
      itemDiv.innerHTML = `
        <div class="item-grid">
          <div class="item-field">
            <label>Cantidad</label>
            <input type="number" value="${item.cantidad}" onchange="updateEditItem(${index}, 'quantity', this.value)" class="edit-item-input" min="1" data-cantidad disabled>
          </div>
          <div class="item-field">
            <label>Grupo</label>
            <input type="text" value="${item.grupo}" class="edit-item-input" data-grupo disabled>
          </div>
          <div class="item-field">
            <label>Artículo</label>
            <input type="text" value="${item.descripcion}" class="edit-item-input" data-articulo disabled>
          </div>
          <div class="item-field">
            <label>Precio Unitario</label>
            <input type="number" value="${item.precioUnitario}" class="edit-item-input" step="0.01" min="0" data-precioUnitario disabled>
          </div>
        </div>
        <div class="item-footer">
          <span class="item-subtotal" data-subtotal>Subtotal: $${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
          <div class="item-actions">
            <button class="btn btn-outline btn-small" type="button" onclick="borrarPartida(${index})">Eliminar</button>
          </div>
        </div>
      `
      container.appendChild(itemDiv)
    }
  })
}

function updateEditOrderTotal() {
  const total = parseFloat(partidas[partidas.length - 1].total)
  document.getElementById("editOrderTotal").textContent = formatCurrency(total)
}

function actualizarPedido() {
  let formu = document.getElementById('editOrderModal')
  if (!formu.checkValidity()) { formu.reportValidity(); return }

  let contenedor = document.getElementById('editOrderModal')
  partidas = []
  let total = 0
  for (const div of contenedor.querySelectorAll('.item-box')) {
    total += parseFloat(div.querySelector('[data-subtotal]').textContent.split('$')[1])
    partidas.push({
      cantidad: div.querySelector('[data-cantidad]').value,
      grupo: div.querySelector('[data-grupo]').value,
      descripcion: div.querySelector('[data-articulo]').value,
      precioUnitario: div.querySelector('[data-precioUnitario]').value,
      precioTotal: div.querySelector('[data-subtotal]').textContent.split('$')[1],
      surtio: '',
      surtido: 0
    })
  }
  partidas.push({ total: total.toFixed(2) })

  const orderIndex = resultados.findIndex((o) => o.id == currentEditingOrder.id)
  if (orderIndex !== -1) resultados[orderIndex].solicitado = partidas

  closeModal("editOrderModal")
  renderOrders()
  updateTotals()
}

// =============================================
// REJECT MODAL
// =============================================
function openRejectModal(orderId) {
  currentRejectingOrderId = orderId
  document.getElementById("rejectPedidoId").textContent = `#${orderId}`
  document.getElementById("rejectReason").value = ""
  openModal("rejectOrderModal")
}

function validateRejectForm() {
  const reason = document.getElementById("rejectReason").value
  const reasonError = document.getElementById("rejectReasonError")
  if (!reason.trim()) { reasonError.textContent = "El motivo de rechazo es requerido"; return false }
  if (reason.trim().length < 10) { reasonError.textContent = "El motivo debe tener al menos 10 caracteres"; return false }
  reasonError.textContent = ""
  return true
}

async function submitRejectOrder() {
  if (validateRejectForm()) {
    const reason = document.getElementById("rejectReason").value
    alertaFetchCalidad('crudPedidosInsumos', { id: currentRejectingOrderId, estatus: "RECHAZADA", observaciones: reason, tipo: 'rechazo', _csrf: tok }, 'gestionPedidosInsumos')
    closeModal("rejectOrderModal")
  }
}

// =============================================
// SUPPLY MODAL
// =============================================
function openSupplyModal(orderId) {
  currentSupplyingOrder = resultados.find((o) => o.id == orderId)
  try { partidas = JSON.parse(currentSupplyingOrder.solicitado) } catch (e) { partidas = currentSupplyingOrder.solicitado }

  document.getElementById("supplyModalTitle").textContent = `Surtir Pedido #${orderId}`
  renderSupplyItems()
  updateSupplyTotals()
  openModal("supplyOrderModal")
}

function renderSupplyItems() {
  const container = document.getElementById("supplyItemsContainer")
  container.innerHTML = ""
  partidas.forEach((item, index) => {
    if (index === partidas.length - 1) return
    const itemDiv = document.createElement("div")
    itemDiv.className = "item-box"
    itemDiv.innerHTML = `
      <div class="item-grid">
        <div class="item-field"><label>Grupo</label><p>${item.grupo}</p></div>
        <div class="item-field"><label>Artículo</label><p>${item.descripcion}</p></div>
        <div class="item-field"><label>Cantidad Solicitada</label><p>${item.cantidad} pzas</p></div>
        <div class="item-field"><label>Precio Unitario</label><p>$${parseFloat(item.precioUnitario).toFixed(2)}</p></div>
      </div>
      <div class="item-grid">
        <div class="item-field">
          <label>Cantidad Surtida</label>
          <input type="number" value="${item.surtido}" onchange="updateSupplyItem(${index}, this.value)" min="0" max="${item.cantidad}" class="supply-item-input" required data-surtido>
        </div>
      </div>
      <div class="item-footer">
        <span class="item-subtotal">Subtotal surtido: $${(item.surtido * item.precioUnitario).toFixed(2)}</span>
      </div>
    `
    container.appendChild(itemDiv)
  })
}

function updateSupplyItem(index, value) {
  const cantidad = Number.parseInt(value) || 0
  const item = partidas[index]
  const suppliedIndex = partidas.findIndex((s) => s.descripcion === item.descripcion)
  if (cantidad > 0) {
    if (suppliedIndex !== -1) partidas[suppliedIndex].surtido = cantidad
    else partidas.push({ cantidad: 150, grupo: item.grupo, descripcion: item.descripcion, precioUnitario: item.precioUnitario, precioTotal: cantidad * item.precioUnitario, surtido: cantidad })
  } else {
    if (suppliedIndex !== -1) showNotification("El número de surtido debe ser mayor a 0")
  }
  renderSupplyItems()
  updateSupplyTotals()
}

function updateSupplyTotals() {
  const f = partidas.slice(0, -1)
  document.getElementById("supplyTotalRequested").textContent  = formatCurrency(f.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0))
  document.getElementById("supplyTotalSupplied").textContent   = formatCurrency(f.reduce((s, i) => s + (i.surtido * i.precioUnitario), 0))
  document.getElementById("totalArticulosSolicitados").textContent = f.reduce((s, i) => s + i.cantidad, 0)
  document.getElementById("totalArticulosSurtidos").textContent    = f.reduce((s, i) => s + i.surtido, 0)
}

function validateSupplyForm() {
  const formu = document.getElementById("supplyOrderModal")
  if (!formu.checkValidity()) { showNotification("Debes completar todos los campos"); return false }
  const surtidos = formu.querySelectorAll("[data-surtido]")
  for (const [index, cs] of surtidos.entries()) {
    if (cs.value <= 0) { showNotification("Hay campos vacíos y/o valores negativos en los campos de cantidad surtida"); return false }
    partidas[index].surtio   = usuario
    partidas[index].surtido  = parseInt(cs.value)
    partidas[index].estatus  = cs.value >= partidas[index].cantidad ? "SURTIDO" : "PARCIALMENTE SURTIDO"
  }
  return true
}

async function submitSupplyOrder() {
  if (validateSupplyForm()) {
    const orderIndex = resultados.findIndex((o) => o.id === currentSupplyingOrder.id)
    let orden = resultados.find((r) => r.id === currentSupplyingOrder.id)
    let actualizacion = { solicitado: {}, estatus: "" }
    if (orderIndex !== -1) {
      actualizacion.solicitado = partidas
      let ap = orden.solicitado.slice(0, -1)
      const totalReq = ap.reduce((s, i) => s + i.cantidad, 0)
      const totalSur = ap.reduce((s, i) => s + i.surtido, 0)
      actualizacion.estatus = totalSur >= totalReq ? "SURTIDO" : totalSur > 0 ? "PARCIALMENTE SURTIDO" : ""
    }
    actualizacion.tipo           = "update"
    actualizacion._csrf          = tok
    actualizacion.id             = orden.id
    actualizacion.observaciones  = document.getElementById("observaciones").value || "No especificado"
    actualizacion.solicitante    = orden.solicitante
    await alertaFetchCalidad('crudPedidosInsumos', actualizacion, 'gestionPedidosInsumos')
  }
}

// =============================================
// DELETE
// =============================================
async function deleteOrder(orderId) {
  if (confirm(`¿Estás seguro de que deseas eliminar el pedido #${orderId}?`)) {
    await alertaFetchCalidad("crudPedidosInsumos", { tipo: "delete", id: orderId, _csrf: tok }, "gestionPedidosInsumos")
  }
}

// =============================================
// NOTIFICATION
// =============================================
function showNotification(message) {
  alert(message)
}

// =============================================
// ESCAPE KEY
// =============================================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.active").forEach((modal) => closeModal(modal.id))
  }
})

// =============================================
// AGREGAR INSUMO (edit modal)
// =============================================
function agregarEventos() {
  document.getElementById("btnAgregarInsumo").addEventListener("click", agregarNueoItem)
}

function agregarNueoItem() {
  const container = document.getElementById("editItemsContainer")
  let totalHijos = container.childNodes.length - 1
  const itemDiv = document.createElement("div")
  itemDiv.className = "item-box"
  let articulos = productos.map((p) => `<option value="${p.articulo}">${p.articulo}</option>`).join('')

  itemDiv.innerHTML = `
    <div class="item-grid">
      <div class="item-field">
        <label>Cantidad</label>
        <input type="number" value="1" class="edit-item-input" min="1" data-cantidad>
      </div>
      <div class="item-field">
        <label>Grupo</label>
        <input type="text" data-grupo required disabled>
      </div>
      <div class="item-field">
        <label>Artículo</label>
        <select name="descripcion" data-articulo class="input-modal select-modal" required>
          <option value="" selected>Seleccionar una opción</option>
          ${articulos}
        </select>
      </div>
      <div class="item-field">
        <label>Precio Unitario</label>
        <input type="text" data-precioUnitario required disabled>
      </div>
    </div>
    <div class="item-footer">
      <span class="item-subtotal" data-subtotal>Subtotal: $0</span>
      <div class="item-actions">
        <button class="btn btn-outline btn-small" type="button" onclick="borrarPartida(${totalHijos + 1})">Eliminar</button>
      </div>
    </div>
  `
  container.appendChild(itemDiv)

  itemDiv.querySelector("[data-articulo]").addEventListener("change", (e) => seleccionandoGrupo(e.target.value, itemDiv))
  itemDiv.querySelector("[data-cantidad]").addEventListener("change", () => subtotalizarNuevoItem(itemDiv))
}

function seleccionandoGrupo(art, fila) {
  let arti = productos.find((p) => p.articulo == art)
  fila.querySelector('[data-grupo]').value = arti.grupo
  fila.querySelector('[data-precioUnitario]').value = arti.costoUnitario.toFixed(2)
  subtotalizarNuevoItem(fila)
  totalizarEditModal()
}

function subtotalizarNuevoItem(fila) {
  const cantidad = fila.querySelector('[data-cantidad]')
  const precio   = fila.querySelector('[data-precioUnitario]')
  const subtotal = fila.querySelector('.item-subtotal')
  subtotal.textContent = `$${(cantidad.value * precio.value).toFixed(2)}`
  totalizarEditModal()
}

function totalizarEditModal() {
  let total = 0
  document.getElementById("editItemsContainer").querySelectorAll(".item-subtotal").forEach((item) => {
    total += parseFloat(item.textContent.split("$")[1]) || 0
  })
  document.getElementById("editOrderTotal").textContent = `$${total.toFixed(2)}`
}

function borrarPartida(id) {
  const container = document.getElementById("editItemsContainer")
  if (container.childNodes.length == 1) { showNotification("No puedes eliminar el único insumo"); return }
  container.children[id].remove()
  totalizarEditModal()
}
function openWindow(id){
  window.open("formatoPedidoInsumos/"+id, "_blank")
}