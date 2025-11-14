// Data Storage
let orders = [
  {
    id: "1001",
    date: "2024-11-12",
    plant: "Planta Centro",
    status: "pending",
    items: [
      { id: "1", quantity: 10, group: "Grupo A", article: "Tornillos M8", unitPrice: 5.5 },
      { id: "2", quantity: 5, group: "Grupo B", article: "Arandelas", unitPrice: 2.25 },
    ],
    suppliedItems: [],
  },
  {
    id: "1002",
    date: "2024-11-11",
    plant: "Planta Norte",
    status: "partially_supplied",
    items: [
      { id: "3", quantity: 20, group: "Grupo C", article: "Tuercas", unitPrice: 1.75 },
      { id: "4", quantity: 15, group: "Grupo D", article: "Pernos", unitPrice: 3.0 },
    ],
    suppliedItems: [{ id: "3", suppliedQuantity: 15 }],
  },
  {
    id: "1003",
    date: "2024-11-10",
    plant: "Planta Sur",
    status: "supplied",
    items: [{ id: "5", quantity: 25, group: "Grupo E", article: "Remaches", unitPrice: 0.5 }],
    suppliedItems: [{ id: "5", suppliedQuantity: 25 }],
  },
]

let currentEditingOrder = null
let currentRejectingOrderId = null
let currentSupplyingOrder = null

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

  if (orders.length === 0) {
    emptyState.style.display = "block"
    return
  }

  emptyState.style.display = "none"

  orders.forEach((order) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td><span class="order-id">#${order.id}</span></td>
            <td>${formatDate(order.date)}</td>
            <td>${order.plant}</td>
            <td><span class="order-items">${order.items.length} artículos</span></td>
            <td class="text-right"><span class="order-total">${formatCurrency(calculateOrderTotal(order))}</span></td>
            <td class="text-right"><span class="order-total supplied">${formatCurrency(calculateOrderSuppliedTotal(order))}</span></td>
            <td class="text-center"><span class="status-badge ${getStatusClass(order.status)}">${getStatusLabel(order.status)}</span></td>
            <td class="text-center">
                <div class="action-buttons">
                    <button class="action-btn edit" title="Editar" onclick="openEditModal('${order.id}')">✏️</button>
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
  const totalRequested = orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0)
  const totalSupplied = orders.reduce((sum, order) => sum + calculateOrderSuppliedTotal(order), 0)

  document.getElementById("totalRequested").textContent = formatCurrency(totalRequested)
  document.getElementById("totalSupplied").textContent = formatCurrency(totalSupplied)
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
function getStatusClass(status) {
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
  currentEditingOrder = orders.find((o) => o.id === orderId)

  document.getElementById("editModalTitle").textContent = `Editar Pedido #${orderId}`
  document.getElementById("editPlant").value = currentEditingOrder.plant

  renderEditItems()
  updateEditOrderTotal()

  openModal("editOrderModal")
}

function renderEditItems() {
  const container = document.getElementById("editItemsContainer")
  container.innerHTML = ""

  currentEditingOrder.items.forEach((item, index) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "item-box"
    itemDiv.innerHTML = `
            <div class="item-grid">
                <div class="item-field">
                    <label>Cantidad</label>
                    <input type="number" value="${item.quantity}" onchange="updateEditItem(${index}, 'quantity', this.value)" class="edit-item-input" min="1">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Grupo</label>
                    <input type="text" value="${item.group}" onchange="updateEditItem(${index}, 'group', this.value)" class="edit-item-input">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Artículo</label>
                    <input type="text" value="${item.article}" onchange="updateEditItem(${index}, 'article', this.value)" class="edit-item-input">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Precio Unitario</label>
                    <input type="number" value="${item.unitPrice}" onchange="updateEditItem(${index}, 'unitPrice', this.value)" class="edit-item-input" step="0.01" min="0">
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
            </div>
            <div class="item-footer">
                <span class="item-subtotal">Subtotal: $${(item.quantity * item.unitPrice).toFixed(2)}</span>
                <div class="item-actions">
                    <button class="btn btn-outline btn-small" onclick="removeEditItem(${index})">Eliminar</button>
                </div>
            </div>
        `
    container.appendChild(itemDiv)
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
  const total = currentEditingOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
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
  currentSupplyingOrder = orders.find((o) => o.id === orderId)

  document.getElementById("supplyModalTitle").textContent = `Surtir Pedido #${orderId}`

  renderSupplyItems()
  updateSupplyTotals()

  openModal("supplyOrderModal")
}

function renderSupplyItems() {
  const container = document.getElementById("supplyItemsContainer")
  container.innerHTML = ""

  currentSupplyingOrder.items.forEach((item, index) => {
    const supplied = currentSupplyingOrder.suppliedItems.find((s) => s.id === item.id)
    const suppliedQuantity = supplied ? supplied.suppliedQuantity : 0

    const itemDiv = document.createElement("div")
    itemDiv.className = "item-box"
    itemDiv.innerHTML = `
            <div class="item-grid">
                <div class="item-field">
                    <label>Grupo</label>
                    <p>${item.group}</p>
                </div>
                <div class="item-field">
                    <label>Artículo</label>
                    <p>${item.article}</p>
                </div>
                <div class="item-field">
                    <label>Cantidad Solicitada</label>
                    <p>${item.quantity} pzas</p>
                </div>
                <div class="item-field">
                    <label>Precio Unitario</label>
                    <p>$${item.unitPrice.toFixed(2)}</p>
                </div>
            </div>
            <div class="item-grid">
                <div class="item-field">
                    <label>Cantidad Surtida</label>
                    <input type="number" value="${suppliedQuantity}" onchange="updateSupplyItem(${index}, this.value)" min="0" max="${item.quantity}" class="supply-item-input">
                    <span class="error-message supply-item-error-${index}"></span>
                </div>
            </div>
            <div class="item-footer">
                <span class="item-subtotal">Subtotal surtido: $${(suppliedQuantity * item.unitPrice).toFixed(2)}</span>
            </div>
        `
    container.appendChild(itemDiv)
  })
}

function updateSupplyItem(index, value) {
  const quantity = Number.parseInt(value) || 0
  const item = currentSupplyingOrder.items[index]

  const suppliedIndex = currentSupplyingOrder.suppliedItems.findIndex((s) => s.id === item.id)

  if (quantity > 0) {
    if (suppliedIndex !== -1) {
      currentSupplyingOrder.suppliedItems[suppliedIndex].suppliedQuantity = quantity
    } else {
      currentSupplyingOrder.suppliedItems.push({
        id: item.id,
        suppliedQuantity: quantity,
      })
    }
  } else {
    if (suppliedIndex !== -1) {
      currentSupplyingOrder.suppliedItems.splice(suppliedIndex, 1)
    }
  }

  renderSupplyItems()
  updateSupplyTotals()
}

function updateSupplyTotals() {
  const requestedTotal = currentSupplyingOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const suppliedTotal = currentSupplyingOrder.suppliedItems.reduce((sum, supplied) => {
    const item = currentSupplyingOrder.items.find((i) => i.id === supplied.id)
    return sum + supplied.suppliedQuantity * (item ? item.unitPrice : 0)
  }, 0)

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
  // Simple notification (could be enhanced with a toast library)
  console.log("Notificación:", message)
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
