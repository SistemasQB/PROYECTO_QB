// Orders management functionality
let currentEditingOrder = null

document.addEventListener('DOMContentLoaded', function() {
  const btnAgregar = document.getElementById('addRowBtn');
  btnAgregar.addEventListener('click', (e) => {
      let tabla = document.getElementById('productsTableBody')
      let total = tabla.rows.length
      let fila = document.createElement('tr')
      fila.setAttribute('id', `row${total+1}`)
      fila.innerHTML = `
        <td>${total+1}</td>
        <td><input type="text" name="producto[]" data-producto="producto" class='mi-input' required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" data-cantidad="cantidad" class='mi-input' required></td>
        <td><input type="number" name="precioUnitario[]" min="0" step="1" data-preciounitario="unitario" required class='mi-input'></td>
        <td class="precio-total"><input type="number" name="cantidad[]" min="1" step="1" data-preciototal="total" class='mi-input' required disabled></td>
        <td><button type="button" class="btn-remove">Eliminar</button></td>
        `
    tabla.appendChild(fila)
    agregarListenersEliminacion()
  })

  let btnSaveChanges = document.getElementById('btnSaveChanges')
  btnSaveChanges.addEventListener('click', (e) => {
    confirmarEdicion()
  })

  renderTable()
})

// =============================================
// TOGGLE SECCIONES (colapsar / expandir)
// =============================================
function toggleSection(sectionId, iconId) {
  const section = document.getElementById(sectionId)
  const icon = document.getElementById(iconId)

  if (section.style.display === 'none') {
    section.style.display = 'block'
    icon.classList.remove('fa-chevron-down')
    icon.classList.add('fa-chevron-up')
  } else {
    section.style.display = 'none'
    icon.classList.remove('fa-chevron-up')
    icon.classList.add('fa-chevron-down')
  }
}

// =============================================
// FILTRO POR FECHAS — Tabla 2
// =============================================
function buscarPorFecha() {
  const fechaInicio = document.getElementById('fechaInicio').value
  const fechaFin = document.getElementById('fechaFin').value

  if (!fechaInicio || !fechaFin) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor ingresa ambas fechas para realizar la búsqueda.', background: '#1a1a1a', color: '#f5f5f5' })
    return
  }

  if (fechaInicio > fechaFin) {
    Swal.fire({ icon: 'error', title: 'Rango inválido', text: 'La fecha de inicio no puede ser mayor a la fecha fin.', background: '#1a1a1a', color: '#f5f5f5' })
    return
  }

  const inicio = new Date(fechaInicio + 'T00:00:00')
  const fin = new Date(fechaFin + 'T23:59:59')

  const ordenesFiltradas = ordenes.filter((orden) => {
    const fechaOrden = new Date(orden.fecha)
    return fechaOrden >= inicio && fechaOrden <= fin
  })

  renderTablaFecha(ordenesFiltradas)

  const seccion = document.getElementById('seccionResultadosFecha')
  seccion.style.display = 'block'

  // Asegurar que la tabla 2 esté expandida
  const contenido = document.getElementById('seccionTabla2')
  const icon = document.getElementById('iconTabla2')
  contenido.style.display = 'block'
  icon.classList.remove('fa-chevron-down')
  icon.classList.add('fa-chevron-up')

  // Scroll suave a la segunda tabla
  setTimeout(() => {
    seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

function limpiarBusqueda() {
  document.getElementById('fechaInicio').value = ''
  document.getElementById('fechaFin').value = ''
  document.getElementById('seccionResultadosFecha').style.display = 'none'
  document.getElementById('tablaOrdenesFecha').innerHTML = ''
}

function renderTablaFecha(listaOrdenes) {
  const tabla = document.getElementById('tablaOrdenesFecha')
  const badge = document.getElementById('badgeResultados')

  if (listaOrdenes.length === 0) {
    tabla.innerHTML = `<tr><td colspan="7" class="empty-row"><i class="fas fa-search"></i> No se encontraron órdenes en ese rango de fechas.</td></tr>`
    badge.textContent = '0 resultados'
    return
  }

  badge.textContent = `${listaOrdenes.length} resultado${listaOrdenes.length !== 1 ? 's' : ''}`

  let rows = listaOrdenes.map((orden) => {
    try {
      orden.informacionProveedor = JSON.parse(orden.informacionProveedor)
      orden.servicios = JSON.parse(orden.servicios)
    } catch (error) {}

    let articulos = orden.servicios.partidas.map((p) => `${p.producto}`).join(', ')
    let fecha = new Date(orden.fecha)
    let fc = fecha.toLocaleDateString('en-GB')

    return `
      <tr>
        <td>OC-${fecha.getFullYear()}-${orden.id}</td>
        <td>${fc}</td>
        <td>${orden.lugar}</td>
        <td>${orden.informacionProveedor.proveedor}</td>
        <td>${articulos}</td>
        <td>${orden.observaciones}</td>
        <td class="actions-cell">
          <button class="action-btn view" onclick="openViewModal(${orden.id})" title="Visualizar">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `
  }).join('')

  tabla.innerHTML = rows
}

// =============================================
// MODAL VISUALIZAR
// =============================================
function openViewModal(orderId) {
  const orden = ordenes.find((o) => o.id === orderId)
  if (!orden) return

  try {
    orden.informacionProveedor = JSON.parse(orden.informacionProveedor)
    orden.servicios = JSON.parse(orden.servicios)
  } catch (error) {}

  const fecha = new Date(orden.fecha)
  const fc = fecha.toLocaleDateString('en-GB')
  const partidas = orden.servicios.partidas || []

  const filasPartidas = partidas.map((p) => `
    <tr>
      <td>${p.item}</td>
      <td>${p.producto}</td>
      <td>${p.cantidad}</td>
      <td>$${parseFloat(p.precioUnitario).toFixed(2)}</td>
      <td>$${parseFloat(p.precioTotal).toFixed(2)}</td>
    </tr>
  `).join('')

  document.getElementById('viewContent').innerHTML = `
    <div class="view-grid">
      <div class="view-field">
        <span class="view-label"><i class="fas fa-hashtag"></i> Número de Orden</span>
        <span class="view-value">OC-${fecha.getFullYear()}-${orden.id}</span>
      </div>
      <div class="view-field">
        <span class="view-label"><i class="fas fa-calendar"></i> Fecha</span>
        <span class="view-value">${fc}</span>
      </div>
      <div class="view-field">
        <span class="view-label"><i class="fas fa-map-marker-alt"></i> Lugar</span>
        <span class="view-value">${orden.lugar}</span>
      </div>
      <div class="view-field">
        <span class="view-label"><i class="fas fa-building"></i> Proveedor</span>
        <span class="view-value">${orden.informacionProveedor.proveedor}</span>
      </div>
    </div>

    <div class="view-section-title"><i class="fas fa-boxes"></i> Productos / Servicios</div>
    <div class="table-container" style="margin-bottom:20px;">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
          </tr>
        </thead>
        <tbody>${filasPartidas}</tbody>
      </table>
    </div>

    <div class="totals-section" style="margin-bottom:20px;">
      <div class="totals-grid">
        <div class="total-item">
          <label>Subtotal:</label>
          <span>${orden.servicios.subtotal || '$0.00'}</span>
        </div>
        <div class="total-item">
          <label>IVA (16%):</label>
          <span>${orden.servicios.iva || '$0.00'}</span>
        </div>
        <div class="total-item total-final">
          <label>Total:</label>
          <span>${orden.servicios.total || '$0.00'}</span>
        </div>
      </div>
    </div>

    ${orden.observaciones ? `
    <div class="view-field" style="margin-bottom:20px;">
      <span class="view-label"><i class="fas fa-comment-alt"></i> Observaciones</span>
      <span class="view-value">${orden.observaciones}</span>
    </div>` : ''}

    <div class="modal-actions">
      <button type="button" class="btn-secondary" onclick="closeViewModal()">Cerrar</button>
    </div>
  `

  const modal = document.getElementById('viewModal')
  modal.classList.add('active')
  document.body.style.overflow = 'hidden'
}

function closeViewModal() {
  document.getElementById('viewModal').classList.remove('active')
  document.body.style.overflow = 'auto'
}

// =============================================
// FILTRO BÚSQUEDA TABLA 1
// =============================================
function filterTable() {
  const searchInput = document.getElementById("searchInput")
  const table = document.getElementById("ordersTable")
  const rows = table.getElementsByTagName("tr")
  const searchTerm = searchInput.value.toLowerCase()

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.getElementsByTagName("td")
    let found = false

    for (let j = 0; j < cells.length - 1; j++) {
      const cellText = cells[j].textContent.toLowerCase()
      if (cellText.includes(searchTerm)) {
        found = true
        break
      }
    }

    row.style.display = found ? "" : "none"
  }
}

// =============================================
// MODAL EDITAR
// =============================================
function openEditModal(orderId) {
  const order = ordenes.find((o) => o.id === orderId)
  if (!order) return
  currentEditingOrder = orderId
  let informacionPro = order.informacionProveedor
  let servicios = order.servicios
  let filas = servicios.partidas.map((p) => {
    return `<tr id='row${p.item}'>
        <td>${p.item}</td>
        <td><input type="text" name="producto[]" value='${p.producto}' data-producto="producto" class='mi-input' required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" value='${p.cantidad}' data-cantidad="cantidad" class='mi-input' required></td>
        <td><input type="number" name="precioUnitario[]" min="0" step="1" value='${parseFloat(p.precioUnitario).toFixed(2)}' data-preciounitario="unitario" class='mi-input' required></td>
        <td class="precio-total"><input type="number" name="cantidad[]" min="1" step="1" value='${p.precioTotal}' data-preciototal="total" class='mi-input' required disabled></td>
        <td><button type="button" class="btn-remove mi-btn">Eliminar</button></td></tr>
    `
  }).join('')

  let tabla = document.getElementById('productsTableBody')
  tabla.innerHTML = filas

  let campos = {
    fecha: document.getElementById("editFecha"),
    lugar: document.getElementById("editLugar"),
    proveedor: document.getElementById("editProveedor"),
    observaciones: document.getElementById("editObservaciones")
  }

  campos.fecha.value = order.fecha.split("T")[0]
  campos.lugar.value = order.lugar
  campos.proveedor.value = informacionPro.proveedor
  campos.observaciones.value = order.observaciones
  delete campos.observaciones
  for (const [_, value] of Object.entries(campos)) {
    value.disabled = true
  }

  const modal = document.getElementById("editModal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
  agregarListenersEliminacion()
  totalizando()
  renderTable()
}

function closeEditModal() {
  const modal = document.getElementById("editModal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
  currentEditingOrder = null
}

document.getElementById("editForm").addEventListener("submit", (e) => {
  e.preventDefault()
  if (!currentEditingOrder) return
  const orderIndex = ordersData.findIndex((o) => o.id === currentEditingOrder)
  if (orderIndex === -1) return
  ordersData[orderIndex] = {
    ...ordersData[orderIndex],
    fecha: document.getElementById("editFecha").value,
    lugar: document.getElementById("editLugar").value,
    proveedor: document.getElementById("editProveedor").value,
    solicitudes: document.getElementById("editSolicitudes").value,
    observaciones: document.getElementById("editObservaciones").value,
  }
  updateTableRow(currentEditingOrder, ordersData[orderIndex])
  closeEditModal()
  showNotification("Orden actualizada correctamente", "success")
})

function updateTableRow(orderId, orderData) {
  const table = document.getElementById("ordersTable")
  const rows = table.getElementsByTagName("tr")
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.getElementsByTagName("td")
    if (cells[0].textContent === orderData.fecha) {
      cells[0].textContent = orderData.fecha
      cells[1].textContent = orderData.lugar
      cells[2].textContent = orderData.proveedor
      cells[3].textContent = orderData.solicitudes
      cells[4].textContent = orderData.observaciones
      break
    }
  }
}

// =============================================
// ENVIAR / ELIMINAR
// =============================================
async function sendToProvider(orderId) {
  const order = ordenes.find((o) => o.id === orderId)
  if (!order) return
  if (confirm(`¿Enviar orden de compra a ${order.informacionProveedor.proveedor}?`)) {
    let campos = {
      servicios: order.servicios,
      status: 'ENVIADA',
      observaciones: order.observaciones,
      id: orderId,
      tipo: 'send',
      _csrf: tok,
    }
    await alertaFetchCalidad('crudOrdenesCompra', campos, 'historicoOrdenesCompra')
  }
}

async function deleteOrder(orderId) {
  if (confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
    let bod = { _csrf: tok, id: orderId, tipo: 'delete' }
    await alertaFetchCalidad('crudOrdenesCompra', bod, 'historicoOrdenesCompra')
  }
}

// =============================================
// NOTIFICACIÓN
// =============================================
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed; top: 80px; right: 20px;
    background-color: ${type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#4a90e2"};
    color: white; padding: 15px 20px; border-radius: 8px;
    z-index: 3000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateX(100%); transition: transform 0.3s;
  `
  document.body.appendChild(notification)
  setTimeout(() => { notification.style.transform = "translateX(0)" }, 100)
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => { document.body.removeChild(notification) }, 300)
  }, 3000)
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEditModal()
    closeViewModal()
  }
})

document.getElementById("editModal").addEventListener("click", function(event) {
  if (event.target === this) closeEditModal()
})

document.getElementById("viewModal").addEventListener("click", function(event) {
  if (event.target === this) closeViewModal()
})

// =============================================
// RENDER TABLA 1
// =============================================
function renderTable() {
  let tabla = document.getElementById('tablaOrdenes')
  let MisOrdenes = ordenes
  let rows = MisOrdenes.map((orden) => {
    try {
      orden.informacionProveedor = JSON.parse(orden.informacionProveedor)
      orden.servicios = JSON.parse(orden.servicios)
    } catch (error) {}

    let articulos = orden.servicios.partidas.map((o) => `${o.producto}`).join(', ')
    let fecha = new Date(orden.fecha)
    let fc = fecha.toLocaleDateString('en-GB')
    return `
      <tr>
        <td>OC-${fecha.getFullYear()}-${orden.id}</td>
        <td>${fc}</td>
        <td>${orden.lugar}</td>
        <td>${orden.informacionProveedor.proveedor}</td>
        <td>${articulos}</td>
        <td>${orden.observaciones}</td>
        <td class="actions-cell">
          <button class="action-btn edit" onclick="openEditModal(${orden.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn send" onclick="sendToProvider(${orden.id})" title="Enviar a Proveedor">
            <i class="fas fa-paper-plane"></i>
          </button>
          <button class="action-btn delete" onclick="deleteOrder(${orden.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
  }).join('')

  tabla.innerHTML = rows
}

// =============================================
// HELPERS TABLA EDICIÓN
// =============================================
function eliminarRow(row) {
  row.remove()
  foliando()
  totalizando()
}

function agregarListenersEliminacion() {
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')

  filas.forEach((fila) => {
    let btn = fila.querySelectorAll('button')[0]
    btn.addEventListener('click', (e) => { eliminarRow(fila) })

    const inputCantidad = fila.querySelector('[data-cantidad]')
    const inputPrecioUnitario = fila.querySelector('[data-preciounitario]')
    const inputTotal = fila.querySelector('[data-preciototal]')

    inputCantidad.addEventListener('change', (e) => {
      if (e.target.value > 0 && inputPrecioUnitario.value > 0) {
        inputTotal.value = parseFloat(parseFloat(e.target.value) * parseFloat(inputPrecioUnitario.value)).toFixed(2)
        totalizando()
      } else {
        inputTotal.value = 0
      }
    })

    inputPrecioUnitario.addEventListener('change', (e) => {
      if (e.target.value > 0 && inputCantidad.value > 0) {
        inputTotal.value = parseFloat(parseFloat(e.target.value) * parseFloat(inputCantidad.value)).toFixed(2)
        totalizando()
      } else {
        inputTotal.value = 0
      }
    })
  })
}

function foliando() {
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  let i = 1
  filas.forEach((fila) => {
    fila.children.item(0).textContent = i
    i++
  })
  totalizando()
}

function totalizando() {
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  let subtotal = 0, iva = 0, total = 0

  filas.forEach((fila) => {
    let miSubtotal = parseFloat(fila.querySelector('[data-preciototal]').value)
    let miIva = miSubtotal * 0.16
    subtotal += miSubtotal
    iva += miIva
    total += miSubtotal + miIva
  })

  document.getElementById('total').innerText = `$${total.toFixed(2)}`
  document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`
  document.getElementById('iva').innerText = `$${iva.toFixed(2)}`
}

function confirmarEdicion() {
  let tabla = document.getElementById('productsTableBody')
  let nuevasPartidas = []

  for (let fila of tabla.rows) {
    let partida = {
      item: fila.children.item(0).textContent,
      producto: fila.children.item(1).querySelector('[data-producto]').value,
      cantidad: fila.children.item(2).querySelector('[data-cantidad]').value,
      precioUnitario: fila.children.item(3).querySelector('[data-preciounitario]').value,
      precioTotal: fila.children.item(4).querySelector('[data-preciototal]').value
    }
    nuevasPartidas.push(partida)
  }

  const order = ordenes.find((o) => o.id === currentEditingOrder)
  order.servicios = {
    subtotal: document.getElementById('subtotal').innerText,
    iva: document.getElementById('iva').innerText,
    total: document.getElementById('total').innerText,
    partidas: nuevasPartidas
  }
  order.observaciones = document.getElementById('editObservaciones').value
  alert("Orden actualizada")
  closeEditModal()
  renderTable()
}
