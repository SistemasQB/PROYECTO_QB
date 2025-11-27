// Data Storage


let currentEditingOrder = null
let currentRejectingOrderId = null
let currentSupplyingOrder = null
let partidas = []
let surtido = []
let agregados = []


// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderOrders()
  updateTotals()
  agregarEventos()
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
    let articulosSolicitados
    try {
      articulosSolicitados= JSON.parse(order.solicitado)  
    } catch (error) {
      articulosSolicitados = partidas
    }
    
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
//posible eliminacion
function calculateOrderTotal(orden) {

  console.log(partidas);
  return partidas.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)
}

// Calculate Order Supplied Total
//posible eliminacion
function calculateOrderSuppliedTotal(order) {
  return order.solicitado.reduce((sum, supplied) => {
    const item = partidas.find((i) => i.id === supplied.id)
    return sum + supplied.cantidad * (item ? item.precioUnitario : 0)
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
  // clearFormErrors()
}

function clearFormErrors() {
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))
  document.querySelectorAll(".form-input, .form-textarea").forEach((el) => el.classList.remove("error"))
}

// Edit Order Modal
function openEditModal(orderId) {
  currentEditingOrder = resultados.find((o) => o.id == orderId)
  try {
    partidas= JSON.parse(currentEditingOrder.solicitado)  
  } catch (error) {
    partidas = currentEditingOrder.solicitado
  }
  
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
    if(index < partidas.length-1){
        const itemDiv = document.createElement("div")
        itemDiv.className = "item-box"
        itemDiv.innerHTML = `
            <div class="item-grid">
                <div class="item-field">
                    <label>Cantidad</label>
                    <input type="number" value="${item.cantidad}" onchange="updateEditItem(${index}, 'quantity', this.value)" class="edit-item-input" min="1" data-cantidad disabled>
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Grupo</label>
                    <input type="text" value="${item.grupo}" onchange="updateEditItem(${index}, 'group', this.value)" class="edit-item-input" data-grupo  disabled>
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Artículo</label>
                    <input type="text" value="${item.descripcion}" onchange="updateEditItem(${index}, 'article', this.value)" class="edit-item-input" data-articulo disabled>
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
                <div class="item-field">
                    <label>Precio Unitario</label>
                    <input type="number" value="${item.precioUnitario}" onchange="updateEditItem(${index}, 'unitPrice', this.value)" class="edit-item-input" step="0.01" min="0" data-precioUnitario disabled>
                    <span class="error-message edit-item-error-${index}"></span>
                </div>
            </div>
            <div class="item-footer">
                <span class="item-subtotal" data-subtotal disabled>Subtotal: $${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
                <div class="item-actions">
                    <button class="btn btn-outline btn-small" onclick="borrarPartida(${index})">Eliminar</button>
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
  partidas.splice(index, 1)
  renderEditItems()
  updateEditOrderTotal()
}

// function addEditItem() {
//   currentEditingOrder.items.push({
//     id: Math.random().toString(),
//     quantity: 0,
//     group: "",
//     article: "",
//     unitPrice: 0,
//   })
//   renderEditItems()
//   updateEditOrderTotal()
// }

function updateEditOrderTotal() {
  
  const total = parseFloat(partidas[partidas.length-1].total)

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

function actualizarPedido() {
  let formu = document.getElementById('editOrderModal')
  if (!formu.checkValidity()){
    formu.reportValidity()
    return;
  }
    let contenedor = document.getElementById('editOrderModal')
    partidas = []
    let total = 0
    for(const div of contenedor.querySelectorAll('.item-box')){
      total += parseFloat(div.querySelector('[data-subtotal]').textContent.split('$')[1])
      partidas.push({
        cantidad : div.querySelector('[data-cantidad]').value,
        grupo : div.querySelector('[data-grupo]').value,
        descripcion : div.querySelector('[data-articulo]').value,
        precioUnitario : div.querySelector('[data-precioUnitario]').value,
        precioTotal : div.querySelector('[data-subtotal]').textContent.split('$')[1],
        surtio: '',
        surtido: 0
      })
    }
    partidas.push({total: total.toFixed(2)})
    const orderIndex = resultados.findIndex((o) => o.id == currentEditingOrder.id)
    if (orderIndex !== -1) {
      
      resultados[orderIndex].solicitado = partidas
    }
    closeModal("editOrderModal")
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





// funciones de  Modal supply
function openSupplyModal(orderId) {
  currentSupplyingOrder = resultados.find((o) => o.id == orderId)
  try {
    partidas = JSON.parse(currentSupplyingOrder.solicitado)  
  } catch (error) {
    partidas = currentSupplyingOrder.solicitado
  }
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
                    <input type="number" value="${item.surtido}" onchange="updateSupplyItem(${index}, this.value)" min="0" max="${item.cantidad}" class="supply-item-input" required data-surtido>
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
  // let solicitado = partidas
  let partidasF = partidas.slice(0,-1)
  const requestedTotal = partidasF.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0)
  const suppliedTotal = partidasF.reduce((sum, item) => sum + (item.surtido * item.precioUnitario), 0)
  
  
  document.getElementById("supplyTotalRequested").textContent = formatCurrency(requestedTotal)
  document.getElementById("supplyTotalSupplied").textContent = formatCurrency(suppliedTotal)
}

function validateSupplyForm() {
  const formu = document.getElementById("supplyOrderModal")
  if(!formu.checkValidity()){
    showNotification("debes completar todos los campos")
    return false;
  }
  const surtidos = formu.querySelectorAll("[data-surtido]")
  for (const [index, cs] of surtidos.entries()) {
    if (cs.value <= 0) {
      showNotification("hay campos vacios y/o valores negativos en los campos de cantidad surtida")
      return false;
    }
    partidas[index].surtio = usuario
    partidas[index].surtido = parseInt(cs.value)
    if(cs.value >= partidas[index].cantidad){
      partidas[index].estatus = "SURTIDO"
    }else{
      partidas[index].estatus = "PARCIALMENTE SURTIDO"
    }
  }
  return true;
}

function submitSupplyOrder() {
  if (validateSupplyForm()) {
    const orderIndex = resultados.findIndex((o) => o.id === currentSupplyingOrder.id)
    if (orderIndex !== -1) {
      resultados[orderIndex].solicitado = partidas
      // Update status
      let ap = partidas.slice(0,-1)
      const totalRequested =  ap.reduce((sum, item) => sum + item.cantidad, 0) 
      const totalSupplied = ap.reduce((sum, item) => sum + item.surtido, 0) 

      if (totalSupplied >= totalRequested) {
        resultados[orderIndex].estatus = "SURTIDO"
      } else if (totalSupplied > 0) {
        resultados[orderIndex].estatus = "PARCIALMENTE SURTIDO"
      }
    }
    
    closeModal("supplyOrderModal")
    
    console.log(resultados[orderIndex]);
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




//funciones de modal edicion
function agregarEventos(){
  const btnAgregar = document.getElementById("btnAgregarInsumo")
  btnAgregar.addEventListener("click",(e) => {
    agregarNueoItem()
  })
}
function agregarNueoItem(){
  const container = document.getElementById("editItemsContainer")
  let totalHijos = container.childNodes.length - 1
  const itemDiv = document.createElement("div")
    itemDiv.className = "item-box"
    let articulos = productos.map((p) => {
        return `<option value="${p.articulo}">${p.articulo}</option>`
    }).join('')

    let texto = `
    <div class="item-grid">
                <div class="item-field">
                    <label>Cantidad</label>
                    <input type="number" value="1"  class="edit-item-input" min="1" data-cantidad>
                </div>
                <div class="item-field">
                    <label>Grupo</label>
                    <input type='text' data-grupo required disabled></input>
                </div>
                <div class="item-field">
                    <label>Artículo</label>
                    <select  name="descripcion" data-articulo  class='input-modal select-modal' required>
                    <option value="" selected>Seleccionar una opcion</option>
                        ${articulos}
                    </select>
                </div>
                <div class="item-field">
                    <label>Precio Unitario</label>
                    <input type='text' data-precioUnitario required disabled></p>
                </div>
            </div>
            
            <div class="item-footer">
                <span class="item-subtotal" data-subtotal disabled>Subtotal: $0</span>
                <div class="item-actions">
                    <button class="btn btn-outline btn-small" onclick="borrarPartida(${totalHijos+1})">Eliminar</button>
                </div>
            </div>
            `
            
    itemDiv.innerHTML = texto
    container.appendChild(itemDiv)
    let articulo = itemDiv.querySelector("[data-articulo]")  
    articulo.addEventListener("change", (e) => {
      seleccionandoGrupo(e.target.value, itemDiv)  
    } 
    
)
let cant = itemDiv.querySelector("[data-cantidad]")  
    cant.addEventListener("change", (e) => {
      subtotalizarNuevoItem(itemDiv)  
    })
}

function seleccionandoGrupo(art, fila){
  let arti = productos.find((p) => p.articulo == art)
  let input = fila.querySelector('[data-grupo]')
  let precio = fila.querySelector('[data-precioUnitario]')
  input.value = arti.grupo
  precio.value = arti.costoUnitario.toFixed(2)
  subtotalizarNuevoItem(fila);
    totalizarEditModal();

}

function subtotalizarNuevoItem(fila){
  let cantidad = fila.querySelector('[data-cantidad]')
  let precio = fila.querySelector('[data-precioUnitario]')
  let subtotal = fila.querySelector('.item-subtotal')
  subtotal.textContent = `$${(cantidad.value * precio.value ).toFixed(2)}`
  totalizarEditModal()
}

function totalizarEditModal(){
  let total = 0
  let container = document.getElementById("editItemsContainer")
  let items = container.querySelectorAll(".item-subtotal")
  items.forEach((item) => {
    total += parseFloat(item.textContent.split("$")[1]) ||0
  })
  document.getElementById("editOrderTotal").textContent = `$${total.toFixed(2)}` || 0
}
function borrarPartida(id){
  let container = document.getElementById("editItemsContainer")
  let totalHijos = container.childNodes.length
  if (totalHijos == 1) {
    showNotification("No puedes eliminar el único insumo")
    return;
  }
  container.children[id].remove()
  totalizarEditModal()
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------