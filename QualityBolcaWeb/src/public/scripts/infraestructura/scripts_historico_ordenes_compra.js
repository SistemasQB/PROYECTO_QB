


// Orders management functionality
let currentEditingOrder = null

// Sample orders data

document.addEventListener('DOMContentLoaded', function() {
  const btnAgregar = document.getElementById('addRowBtn');
  btnAgregar.addEventListener('click', (e) => {
      let tabla = document.getElementById('productsTableBody')
      let total = tabla.rows.length
      let btnSaveChanges = document.getElementById('btnSaveChanges')
      let fila = document.createElement('tr')
      fila.setAttribute('id', `row${total+1}`)
      fila.innerHTML = `
        <td>${total+1}</td>
        <td><input type="text" name="producto[]" data-producto="producto" class='mi-input' required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" data-cantidad="cantidad" class='mi-input' required></td>
        <td><input type="number" name="precioUnitario[]" min="0" step="1" data-preciounitario="unitario" required class='mi-input'></td>
        <td class="precio-total"><input type="number" name="cantidad[]" min="1" step="1"  data-preciototal="total" class='mi-input' required disabled></td>
        <td><button type="button" class="btn-remove" >Eliminar</button></td>
        `
    tabla.appendChild(fila)
    agregarListenersEliminacion()
    
  })
  btnSaveChanges.addEventListener('click', (e) => {
        confirmarEdicion()
    })
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
  let informacionPro = order.informacionProveedor
  let servicios = order.servicios
  let filas = servicios.partidas.map((p) => {
    return `<tr id='row${p.item}'>
        <td>${p.item}</td>
        <td><input type="text" name="producto[]" value = '${p.producto}' data-producto="producto" class='mi-input' required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" value = '${p.cantidad}' data-cantidad="cantidad" class='mi-input' required></td>
        <td><input type="number" name="precioUnitario[]" min="0" step="1" value = '${parseFloat(p.precioUnitario).toFixed(2)}' data-preciounitario="unitario" class='mi-input' required></td>
        <td class="precio-total"><input type="number" name="cantidad[]" min="1" step="1" value ='${p.precioTotal}' data-preciototal="total" class='mi-input' required disabled></td>
        <td><button type="button" class="btn-remove mi-btn" >Eliminar</button></td></tr>
    `
  }).join('')
  let tabla = document.getElementById('productsTableBody')
  tabla.innerHTML = filas
  let campos = {
    fecha : document.getElementById("editFecha"),
    lugar: document.getElementById("editLugar"),
    proveedor: document.getElementById("editProveedor"),
    observaciones: document.getElementById("editObservaciones")
  }

  campos.fecha.value = order.fecha.split("T")[0]
  campos.lugar.value = order.lugar
  campos.proveedor.value = informacionPro.proveedor
  campos.observaciones.value = order.observaciones
  delete campos.observaciones
  for (const [_, value] of Object.entries(campos)){
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
  if (confirm(`¿Enviar orden de compra a ${order.informacionProveedor.proveedor}?`)) {
    let campos = {
      servicios : order.servicios,
      status: 'ENVIADA',
      observaciones: order.observaciones,
      id: orderId,
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
      try {
          orden.informacionProveedor = JSON.parse(orden.informacionProveedor)
        orden.servicios = JSON.parse(orden.servicios)  
      } catch (error) {
        
      }
      
      let articulos = orden.servicios.partidas.map((orden) => `${orden.producto}`).join(', ')
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
      `}).join('')

  tabla.innerHTML = rows
  
}

function calcularPrecio(precio){
  return precio * 1.16
}

function eliminarRow(row){
  row.remove()
  foliando()
  totalizando()
}

function agregarListenersEliminacion(){
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  
  filas.forEach((fila) => {
      //evento de eliminacion (btn)
      let btn = fila.querySelectorAll('button')
      btn = btn[0]
      btn.addEventListener('click', (e) => {
        eliminarRow(fila)
      })

      //evento de change( cantidad y/o precio unitario)
      const inputCantidad = fila.querySelector('[data-cantidad]')
      const inputPrecioUnitario = fila.querySelector('[data-preciounitario]')  
      const inputTotal = fila.querySelector('[data-preciototal]')
      inputCantidad.addEventListener('change', (e) => {
        if(e.target.value > 0  && inputPrecioUnitario.value > 0){
          inputTotal.value = parseFloat(parseFloat(e.target.value) * parseFloat(inputPrecioUnitario.value)).toFixed(2)
          totalizando()
        }else{
          inputTotal.value = 0  
        }

      })
      inputPrecioUnitario.addEventListener('change', (e) => {
        if(e.target.value > 0  && inputCantidad.value > 0){
          inputTotal.value = parseFloat(parseFloat(e.target.value) * parseFloat(inputCantidad.value)).toFixed(2)
          totalizando()
        }else{
          inputTotal.value = 0  
        }
      })

      // inputTotal.addEventListener('change', (e) => {
      //   if(parseFloat(e.target.value) > 0 ){
      //     alert("entro")
      //     totalizando()
      //   }
      // })
  })
}

function foliando(){
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  let i  = 1
  filas.forEach((fila) => {
      fila.children.item(0).textContent = i;
      i++;
  })
  totalizando()
}
function totalizando(){
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  
  let subtotal = 0
  let iva =0
  let total = 0
  filas.forEach((fila) => {  
    let miSubtotal = parseFloat(fila.querySelector('[data-preciototal]').value)
    let miIva = miSubtotal *.16
    let miTotal = miSubtotal + miIva
    
    subtotal += miSubtotal
    iva += miIva
    total += miTotal
    
  })
    document.getElementById('total').innerText = `$${total.toFixed(2)}`
    document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`
    document.getElementById('iva').innerText = `$${iva.toFixed(2)}`
  
  
}
function confirmarEdicion(){
  let tabla = document.getElementById('productsTableBody')
  let nuevasPartidas = []
  
  for(fila of tabla.rows) {  
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
  let nuevosServicios = {
    subtotal : document.getElementById('subtotal').innerText,
    iva : document.getElementById('iva').innerText,
    total : document.getElementById('total').innerText,
    partidas: nuevasPartidas
  }
    order.servicios = nuevosServicios
  const inputObservaciones = document.getElementById('editObservaciones')
  order.observaciones = inputObservaciones.value
  alert("orden actualizada")
  closeEditModal()
  renderTable()
}