// Data Storage


let currentEditingOrder = null
let currentRejectingOrderId = null
let currentSupplyingOrder = null
let partidas = []
let surtido = []

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderOrders()
  updateTotals()
})

// Render Orders Table
function renderOrders() {
  
  const tbody = document.getElementById("ordersTableBody")
  const emptyState = document.getElementById("emptyState")

  tbody.innerHTML = ""

  if (resultados.length === 0) {
    emptyState.style.display = "block"
    return
  }

  emptyState.style.display = "none"
  resultados.forEach((order) => {
    const row = document.createElement("tr")
    let articulosSolicitados= JSON.parse(order.solicitado)
    row.innerHTML = `
            <td><span class="order-id">#${order.id}</span></td>
            <td>${ order.createdAt.split("T")[0]}</td>
            <td>${order.planta}</td>
            <td><span class="order-items">${articulosSolicitados.length -1} artículos</span></td>
            <td class="text-right"><span class="order-total">${formatCurrency( articulosSolicitados[articulosSolicitados.length-1].total)}</span></td>
            <td class="text-right"><span class="order-total supplied">${order.solicitante}</span></td> 
            <td class="text-center"><span class="status-badge ${getStatusClass(order.estatus)}">${getStatusLabel(order.estatus)}</span></td>
            <td class="text-center">
                <div class="action-buttons">
                    <button class="action-btn edit" title="Editar" onclick="openEditModal('${order.id}')">🔍</button>
                    <button class="action-btn reject" title="Rechazar" onclick="openRejectModal('${order.id}')">✕</button>
                    <button class="action-btn supply" title="Surtir" onclick="openSupplyModal('${order.id}')">✓</button>
                    <button class="action-btn delete" title="Eliminar" onclick="deleteOrder('${order.id}')">🗑️</button>
                </div>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Update Totals
function updateTotals() {
  let total = 0
  resultados.forEach((order) => {
    let partidas = JSON.parse(order.solicitado)
    total += parseFloat(partidas[partidas.length-1].total)
  })
  
  // const totalSupplied = orders.reduce((sum, order) => sum + calculateOrderSuppliedTotal(order), 0)

  document.getElementById("totalRequested").textContent = formatCurrency(total)
  // document.getElementById("totalSupplied").textContent = formatCurrency(totalSupplied)
}

// Calculate Order Total
function calculateOrderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

// Calculate Order Supplied Total
function calculateOrderSuppliedTotal(order) {
  return order.suppliedItems.reduce((sum, supplied) => {
    const item = order.items.find((i) => i.id === supplied.id)
    return sum + supplied.suppliedQuantity * (item ? item.unitPrice : 0)
  }, 0)
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount)
}

// Format Date
function formatDate(dateString) {
  console.log(dateString)
  const date = new Date(dateString + "T00:00:00")
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

// Get Status Label
function getStatusLabel(status) {
  const labels = {
    pending: "Pendiente",
    partially_supplied: "Parcialmente Surtido",
    supplied: "Surtido",
    rejected: "Rechazado",
  }
  return labels[status] || status
}

// Get Status Class
function getStatusClass(status){
  return `status-${status}`
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
  document.body.style.overflow = "auto"
  clearFormErrors()
}

function clearFormErrors() {
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))
  document.querySelectorAll(".form-input, .form-textarea").forEach((el) => el.classList.remove("error"))
}

// Edit Order Modal
function openEditModal(orderId) {
  currentEditingOrder = resultados.find((o) => o.id == orderId)
  document.getElementById("editModalTitle").textContent = `Editar Pedido #${orderId}`
  document.getElementById("editPlant").value = currentEditingOrder.planta

  renderEditItems()
  updateEditOrderTotal()

  openModal("editOrderModal")
}

function renderEditItems() {
  const container = document.getElementById("editItemsContainer")
  container.innerHTML = ""
  let solicitado = JSON.parse(currentEditingOrder.solicitado)
  solicitado.forEach((item, index) => {
    if(index < solicitado.length-1){
      const itemDiv = document.createElement("div")
    itemDiv.className = "item-box"
    itemDiv.innerHTML = `
            <div class="item-grid">
                <div class="item-field">
                    <label>Cantidad</label>
                    <input type="number" value="${item.cantidad}" onchange="updateEditItem(${index}, 'quantity', this.value)" class="edit-item-input" min="1">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Grupo</label>
                    <input type="text" value="${item.grupo}" onchange="updateEditItem(${index}, 'group', this.value)" class="edit-item-input">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Artículo</label>
                    <input type="text" value="${item.descripcion}" onchange="updateEditItem(${index}, 'article', this.value)" class="edit-item-input">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Precio Unitario</label>
                    <input type="number" value="${item.precioUnitario}" onchange="updateEditItem(${index}, 'unitPrice', this.value)" class="edit-item-input" step="0.01" min="0">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
            </div>
            <div class="item-footer">
                <span class="item-subtotal">Subtotal: $${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
                <div class="item-actions">
                    <button class="btn btn-outline btn-small" onclick="removeEditItem(${index})">Eliminar</button>
                </div>
            </div>
        `
        container.appendChild(itemDiv)
    }
  })
}

function updateEditItem(index, field, value) {
  if (field === "quantity" || field === "unitPrice") {
    currentEditingOrder.items[index][field] = Number.parseFloat(value) || 0
  } else {
    currentEditingOrder.items[index][field] = value
  }
  renderEditItems()
  updateEditOrderTotal()
}

function removeEditItem(index) {
  currentEditingOrder.items.splice(index, 1)
  renderEditItems()
  updateEditOrderTotal()
}

function addEditItem() {
  console.log(currentEditingOrder)
  currentEditingOrder.items.push({
    id: Math.random().toString(),
    quantity: 0,
    group: "",
    article: "",
    unitPrice: 0,
  })
  renderEditItems()
  updateEditOrderTotal()
}

function updateEditOrderTotal() {
  let articulosSolicitados = JSON.parse(currentEditingOrder.solicitado)
  const total = parseFloat(articulosSolicitados[articulosSolicitados.length-1].total)

  //  currentEditingOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  document.getElementById("editOrderTotal").textContent = formatCurrency(total)
}

function validateEditForm() {
  const errors = {}

  const plantInput = document.getElementById("editPlant")
  if (!plantInput.value.trim()) {
    errors.plant = "La planta es requerida"
  }

  currentEditingOrder.items.forEach((item, index) => {
    if (item.quantity <= 0) {
      errors[`quantity-${index}`] = "La cantidad debe ser mayor a 0"
    }
    if (!item.group.trim()) {
      errors[`group-${index}`] = "El grupo es requerido"
    }
    if (!item.article.trim()) {
      errors[`article-${index}`] = "El artículo es requerido"
    }
    if (item.unitPrice <= 0) {
      errors[`price-${index}`] = "El precio debe ser mayor a 0"
    }
  })

  // Display errors
  clearFormErrors()
  const plantError = document.getElementById("editPlantError")
  if (errors.plant) {
    plantError.textContent = errors.plant
  }

  return Object.keys(errors).length === 0
}

function submitEditOrder() {
  if (validateEditForm()) {
    currentEditingOrder.plant = document.getElementById("editPlant").value

    const orderIndex = orders.findIndex((o) => o.id === currentEditingOrder.id)
    if (orderIndex !== -1) {
      orders[orderIndex] = currentEditingOrder
    }

    renderOrders()
    updateTotals()
    closeModal("editOrderModal")
  }
}

// Reject Order Modal
function openRejectModal(orderId) {
  currentRejectingOrderId = orderId
  document.getElementById("rejectPedidoId").textContent = `#${orderId}`
  document.getElementById("rejectReason").value = ""
  openModal("rejectOrderModal")
}

function validateRejectForm() {
  const reason = document.getElementById("rejectReason").value
  const reasonError = document.getElementById("rejectReasonError")

  if (!reason.trim()) {
    reasonError.textContent = "El motivo de rechazo es requerido"
    return false
  }

  if (reason.trim().length < 10) {
    reasonError.textContent = "El motivo debe tener al menos 10 caracteres"
    return false
  }

  reasonError.textContent = ""
  return true
}

function submitRejectOrder() {
  if (validateRejectForm()) {
    const orderIndex = orders.findIndex((o) => o.id === currentRejectingOrderId)
    if (orderIndex !== -1) {
      orders[orderIndex].status = "rejected"
    }

    const reason = document.getElementById("rejectReason").value
    console.log(`Pedido #${currentRejectingOrderId} rechazado. Motivo: ${reason}`)

    renderOrders()
    updateTotals()
    closeModal("rejectOrderModal")

    showNotification(`Pedido #${currentRejectingOrderId} rechazado correctamente`)
  }
}

// Supply Order Modal
function openSupplyModal(orderId) {
  currentSupplyingOrder = resultados.find((o) => o.id == orderId)
  partidas = JSON.parse(currentSupplyingOrder.solicitado)
  document.getElementById("supplyModalTitle").textContent = `Surtir Pedido #${orderId}`

  renderSupplyItems()
  updateSupplyTotals()

  openModal("supplyOrderModal")
}

function renderSupplyItems() {
  const container = document.getElementById("supplyItemsContainer")
  container.innerHTML = ""
  partidas.forEach((item, index) => {
    if(index == partidas.length-1) return
    const itemDiv = document.createElement("div")
    itemDiv.className = "item-box"
    let texto = `
    <div class="item-grid">
                <div class="item-field">
                    <label>Grupo</label>
                    <p>${item.grupo}</p>
                </div>
                <div class="item-field">
                    <label>Artículo</label>
                    <p>${item.descripcion}</p>
                </div>
                <div class="item-field">
                    <label>Cantidad Solicitada</label>
                    <p>${item.cantidad} pzas</p>
                </div>
                <div class="item-field">
                    <label>Precio Unitario</label>
                    <p>$${parseFloat(item.precioUnitario).toFixed(2)}</p>
                </div>
            </div>
            <div class="item-grid">
                <div class="item-field">
                    <label>Cantidad Surtida</label>
                    <input type="number" value="${item.surtido}" onchange="updateSupplyItem(${index}, this.value)" min="0" max="${item.cantidad}" class="supply-item-input">
                </div>
            </div>
            <div class="item-footer">
                <span class="item-subtotal">Subtotal surtido: $${(item.surtido * item.precioUnitario).toFixed(2)}</span>
            </div>`
    itemDiv.innerHTML = texto
    container.appendChild(itemDiv)
  })
}

function updateSupplyItem(index, value) {
  const cantidad = Number.parseInt(value) || 0
  const item = partidas[index] //se define item actual

  const suppliedIndex = partidas.findIndex((s) => s.descripcion === item.descripcion)
  
  if (cantidad > 0) {
    if (suppliedIndex !== -1) {
      partidas[suppliedIndex].surtido = cantidad
    } else {
      partidas.push({
        cantidad: 150,
        grupo: item.grupo,
        descripcion: item.descripcion,
        precioUnitario: item.precioUnitario,
        precioTotal: cantidad * item.precioUnitario,
        surtido: "",
        surtido: cantidad,
      })
    }
  } else {
    if (suppliedIndex !== -1) {
      showNotification(`el numero de surtido debe ser mayor a 0`)
      // partidas.splice(suppliedIndex, 1)
    }
  }
  
  renderSupplyItems()
  updateSupplyTotals()
}

function updateSupplyTotals() {
  let solicitado = JSON.parse(currentSupplyingOrder.solicitado)
  console.log(solicitado)
  
  let partidasF = partidas.slice(0,-1)
  const requestedTotal = partidasF.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)
  const suppliedTotal = partidasF.reduce((sum, item) => sum + (item.surtido * item.precioUnitario), 0)
  console.log(suppliedTotal)
  
  document.getElementById("supplyTotalRequested").textContent = formatCurrency(requestedTotal)
  document.getElementById("supplyTotalSupplied").textContent = formatCurrency(suppliedTotal)
}

function validateSupplyForm() {
  const errors = {}

  currentSupplyingOrder.items.forEach((item, index) => {
    const supplied = currentSupplyingOrder.suppliedItems.find((s) => s.id === item.id)
    const suppliedQuantity = supplied ? supplied.suppliedQuantity : 0

    if (suppliedQuantity < 0) {
      errors[`supplied-${index}`] = "La cantidad no puede ser negativa"
    }
    if (suppliedQuantity > item.quantity) {
      errors[`supplied-${index}`] = `No puede exceder la cantidad solicitada (${item.quantity})`
    }
  })

  // Display errors
  clearFormErrors()

  return Object.keys(errors).length === 0
}

function submitSupplyOrder() {
  if (validateSupplyForm()) {
    const orderIndex = orders.findIndex((o) => o.id === currentSupplyingOrder.id)
    if (orderIndex !== -1) {
      orders[orderIndex].suppliedItems = currentSupplyingOrder.suppliedItems

      // Update status
      const totalRequested = calculateOrderTotal(orders[orderIndex])
      const totalSupplied = calculateOrderSuppliedTotal(orders[orderIndex])

      if (totalSupplied >= totalRequested) {
        orders[orderIndex].status = "supplied"
      } else if (totalSupplied > 0) {
        orders[orderIndex].status = "partially_supplied"
      }
    }

    renderOrders()
    updateTotals()
    closeModal("supplyOrderModal")

    showNotification(`Pedido #${currentSupplyingOrder.id} surtido correctamente`)
  }
}

// Delete Order
function deleteOrder(orderId) {
  if (confirm(`¿Estás seguro de que deseas eliminar el pedido #${orderId}?`)) {
    orders = orders.filter((o) => o.id !== orderId)
    renderOrders()
    updateTotals()
    showNotification(`Pedido #${orderId} eliminado correctamente`)
  }
}

// Notification
function showNotification(message) {
  alert(message)
}

// Prevent closing modal by clicking outside escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModals = document.querySelectorAll(".modal.active")
    activeModals.forEach((modal) => {
      closeModal(modal.id)
    })
  }
})
