


// Orders management functionality
let currentEditingOrder = null

// Sample orders data
let ordersData = [
  {
    id: 1,
    fecha: "2024-01-15",
    lugar: "Almacén Central",
    proveedor: "Proveedor ABC",
    solicitudes: "Tornillos, Tuercas",
    observaciones: "Entrega urgente",
  },
  {
    id: 2,
    fecha: "2024-01-12",
    lugar: "Sucursal Norte",
    proveedor: "Materiales XYZ",
    solicitudes: "Cables, Conectores",
    observaciones: "Revisar calidad",
  },
  {
    id: 3,
    fecha: "2024-01-10",
    lugar: "Almacén Sur",
    proveedor: "Suministros DEF",
    solicitudes: "Herramientas",
    observaciones: "Completado",
  },
]
document.addEventListener('DOMContentLoaded', function() {
  renderTable()
})
// Filter table function
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
      // Exclude actions column
      const cellText = cells[j].textContent.toLowerCase()
      if (cellText.includes(searchTerm)) {
        found = true
        break
      }
    }

    row.style.display = found ? "" : "none"
  }
}

// Edit order functions
function openEditModal(orderId) {
  const order = ordenes.find((o) => o.id === orderId)
  if (!order) return

  currentEditingOrder = orderId

  document.getElementById("editFecha").value = order.fecha
  document.getElementById("editLugar").value = order.lugar
  document.getElementById("editProveedor").value = order.proveedor
  document.getElementById("editSolicitudes").value = order.solicitudes
  document.getElementById("editObservaciones").value = order.observaciones

  const modal = document.getElementById("editModal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeEditModal() {
  const modal = document.getElementById("editModal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
  currentEditingOrder = null
}

// Handle edit form submission
document.getElementById("editForm").addEventListener("submit", (e) => {
  e.preventDefault()

  if (!currentEditingOrder) return

  const orderIndex = ordersData.findIndex((o) => o.id === currentEditingOrder)
  if (orderIndex === -1) return

  // Update order data
  ordersData[orderIndex] = {
    ...ordersData[orderIndex],
    fecha: document.getElementById("editFecha").value,
    lugar: document.getElementById("editLugar").value,
    proveedor: document.getElementById("editProveedor").value,
    solicitudes: document.getElementById("editSolicitudes").value,
    observaciones: document.getElementById("editObservaciones").value,
  }

  // Update table row
  updateTableRow(currentEditingOrder, ordersData[orderIndex])

  closeEditModal()

  // Show success message
  showNotification("Orden actualizada correctamente", "success")
})

function updateTableRow(orderId, orderData) {
  const table = document.getElementById("ordersTable")
  const rows = table.getElementsByTagName("tr")

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.getElementsByTagName("td")

    // Check if this is the correct row (you might need a better way to identify rows)
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

// Send to provider function
async function sendToProvider(orderId) {
  const order = ordenes.find((o) => o.id === orderId)
  if (!order) return
  let infPro = JSON.parse(order.informacionProveedor)
  infPro = JSON.parse(infPro)

  let servicios = JSON.parse(order.servicios)
  
  let partidas = JSON.parse(servicios)
  
  if (confirm(`¿Enviar orden de compra a ${infPro.proveedor}?`)) {
    let campos = {
      basicas: JSON.stringify({fecha: order.fecha, lugar: order.lugar, observaciones: order.observaciones, id: orderId}),
      informacionProveedor: infPro,
      partidas: partidas,
      totales: JSON.stringify({subtotal: partidas.subtotal, iva: partidas.iva, total: partidas.total}),
      tipo: 'send',
      _csrf: tok,
    }
    await alertaFetchCalidad('crudOrdenesCompra',campos,'historicoOrdenesCompra')
  }
}

// Delete order function
async function deleteOrder(orderId) {
  if (confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
    let bod = {
      _csrf: tok,
      id:orderId,
      tipo: 'delete'
    }
    await alertaFetchCalidad('crudOrdenesCompra', bod, 'historicoOrdenesCompra');
  }
}

// Notification function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#4a90e2"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Close modal on escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEditModal()
  }
})

// Close modal when clicking outside
document.getElementById("editModal").addEventListener("click", function (event) {
  if (event.target === this) {
    closeEditModal()
  }
})

function renderTable(){
  let tabla = document.getElementById('tablaOrdenes')
  let MisOrdenes = ordenes
  
  let rows = MisOrdenes.map((orden) => {
      let datosP = JSON.parse(orden.informacionProveedor)
      datosP = JSON.parse(datosP)
      let partidas = JSON.parse(orden.servicios)
      partidas = JSON.parse(partidas)
      partidas= JSON.parse(partidas.partidas)
      
      let articulos = partidas.map((orden) => {
        return `${orden.producto}, `
      }).join('')
      
      let fecha = new Date(orden.fecha)
      let fc = fecha.toLocaleDateString('en-GB')
      
      return `
        <tr>
              <td>OC-${fecha.getFullYear()}-${orden.id}</td>
              <td>${fc}</td>
              <td>${orden.lugar}</td>
              <td>${datosP.proveedor}</td>
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
      `}).join('')

  tabla.innerHTML = rows
}