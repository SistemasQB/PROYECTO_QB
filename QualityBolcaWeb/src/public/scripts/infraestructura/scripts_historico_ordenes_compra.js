


// Orders management functionality
let currentEditingOrder = null

// Sample orders data

document.addEventListener('DOMContentLoaded', function() {
  const btnNuev = document.getElementById('btnNuevaOrden')
  btnNuev.addEventListener('click', (e) => {
      
  })
  const btnAgregar = document.getElementById('addRowBtn');
  btnAgregar.addEventListener('click', (e) => {
      let tabla = document.getElementById('productsTableBody')
      let total = tabla.rows.length
      let fila = document.createElement('tr')
      fila.setAttribute('id', `row${total+1}`)
      fila.innerHTML = `
        <td>${total+1}</td>
        <td><input type="text" name="producto[]" required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" required></td>
        <td><input type="number" name="precioUnitario[]" min="1" step=".1" required></td>
        <td class="precio-total"><input type="number" name="cantidad[]" min="1" step=".5"  required disabled></td>
        <td><button type="button" class="btn-remove" >Eliminar</button></td>
        `
    tabla.appendChild(fila)
    let btn = fila.querySelectorAll('button')
    let num = fila.querySelectorAll('input')
    
    num.forEach((el) => {
      if(el.getAttribute('type') == 'number' && el.getAttribute('name') == 'cantidad[]'){
        el.addEventListener('change', (e) => {
            cambioCantidad(fila)
        })
      }else if(el.getAttribute('type') == 'number' && el.getAttribute('name') == 'precioUnitario[]'){
        el.addEventListener('change', (e) => {
            cambioCantidad(fila)
        })
      }
    })
    btn = btn[0]
    btn.addEventListener(`click`, (e) => {
        eliminarRow(fila)
    })
    
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
  let informacionPro = JSON.parse(order.informacionProveedor)
  let servicios = JSON.parse(order.servicios)
  let filas = servicios.partidas.map((p) => {
     return `<tr id='row${p.item}'>
        <td>${p.item}</td>
        <td><input type="text" name="producto[]" value = '${p.producto}'required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" value = '${p.cantidad}'  required></td>
        <td><input type="number" name="precioUnitario[]" min="1" step=".1" value = '${p.precioUnitario}'  required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" value ='${p.precioUnitario * p.cantidad}'  required disabled  ></td>
        <td><button type="button" class="btn-remove">Eliminar</button></td></tr>
    `
  }).join('')
  let tabla = document.getElementById('productsTableBody')
  tabla.innerHTML = filas
  
  document.getElementById("editFecha").value = order.fecha.split("T")[0]
  document.getElementById("editLugar").value = order.lugar
  let pro = document.getElementById("editProveedor")
  pro.value = informacionPro.proveedor
  pro.disabled = true
  document.getElementById('subtotal').textContent = servicios.subtotal
  document.getElementById('iva').textContent = servicios.iva
  document.getElementById('total').textContent = servicios.total
  document.getElementById("editObservaciones").value = order.observaciones

    
  const modal = document.getElementById("editModal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
  agregarListenersEliminacion()
  
}

function closeEditModal() {
  const modal = document.getElementById("editModal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
  currentEditingOrder = null
}

// Handle edit form submission
document.getElementById("btnSaveChanges").addEventListener("click", async (e) => {
  if (!currentEditingOrder) return
  let formu = document.getElementById('editForm');
  if (!formu.reportValidity()){
    showNotification('completa todos los campos','error')
    return
  } 
        const orden = ordenes.find((o) => o.id === currentEditingOrder)
        if (!orden) return
        // Update order data
        const tabla = document.getElementById('productsTableBody');
        const filas = tabla.rows
        let partidas = []
        let index = 0
        
          for (let f of filas) {
            let celda = f.children[1]
            let input = celda.querySelector('input')
            let producto = input.value
            celda = f.children[2]
            input = celda.querySelector('input')
            let cantidad = input.value
            celda = f.children[3]
            input = celda.querySelector('input')
            let precioUnitario = input.value
            celda = f.children[4]
            input = celda.querySelector('input')
            let precioTotal = input.value
            
            let dato = {
              item: index + 1 ,
              producto: producto,
              cantidad: cantidad,
              precioUnitario: precioUnitario,
              precioTotal:precioTotal
            }
            partidas.push(dato)
            index++
          }
          let subt = document.getElementById('subtotal')
          let su= subt.textContent.trim()
          subt = su.replace(/[$,]/g, '')
          
          let servicios = {
            partidas: partidas,
            subtotal: parseFloat(subt),
            iva: parseFloat(subt * .16),
          }
          servicios.total =  servicios.iva + servicios.subtotal
          servicios.total = formatearPesos(servicios.total)
          servicios.subtotal = formatearPesos(servicios.subtotal)
          servicios.iva = formatearPesos(servicios.iva)

        let data =  {
          fecha: document.getElementById("editFecha").value,
          lugar: document.getElementById("editLugar").value,
          servicios: JSON.stringify(servicios),
          observaciones: document.getElementById("editObservaciones").value,
          id: currentEditingOrder,
          tipo: 'update',
          _csrf: tok
        }
        closeEditModal();
        await alertaFetchCalidad('crudOrdenesCompra', data,'historicoOrdenesCompra')
        console.log(data);
        
  
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
  let servicios = JSON.parse(order.servicios)
  let partidas = servicios.partidas;
  
  if (confirm(`¿Enviar orden de compra a ${infPro.proveedor}?`)) {

    let campos = {
      basicas: JSON.stringify({fecha: order.fecha, lugar: order.lugar, observaciones: order.observaciones, id: orderId}),
      informacionProveedor: infPro,
      partidas: partidas,
      totales: JSON.stringify({subtotal: servicios.subtotal, iva: servicios.iva, total: servicios.total}),
      status: 'ENVIADA',
      tipo: 'send',
      _csrf: tok,
      id: orderId
    }
    
    await alertaFetchCalidad('crudOrdenesCompra',campos,'historicoOrdenesCompra')
  }
}
// Delete order function
async function deleteOrder(orderId){
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
      // console.log(orden)
      let datosP = JSON.parse(orden.informacionProveedor)
      let partidas = JSON.parse(orden.servicios)
      partidas = partidas.partidas
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

function eliminarRow(row){
  row.remove()
  foliando()
}

function agregarListenersEliminacion(){
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  
  filas.forEach((fila) => {
      let btn = fila.querySelectorAll('button')
      btn = btn[0]
      btn.addEventListener('click', (e) => {
        eliminarRow(fila)    
      })
      let celdas = fila.children
      for(let el of celdas){
        const inpt = el.querySelector('input[type="number"]')
        if(!inpt) continue

        if(inpt.getAttribute('type') == 'number' && inpt.getAttribute('name') == 'cantidad[]'){
          
          inpt.addEventListener('change', (e) => {
          cambioCantidad(fila)
        })
      }else if(inpt.getAttribute('type') == 'number' && inpt.getAttribute('name') == 'precioUnitario[]'){
        
        inpt.addEventListener('change', (e) => {
            cambioCantidad(fila)
        })
      }
      }
  })
}

function foliando(){
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  filas.forEach((fila, index) => {
    let celdas = fila.children
    if (celdas.length > 0){
      celdas[0].textContent = index + 1
    }
  })
  totalizando()
}
function totalizando(){
  let tabla = document.getElementById('productsTableBody')
  let filas = tabla.querySelectorAll('tr')
  let totales = {
    iva: 0,
    subtotal: 0,
    total: 0
  }
  filas.forEach((fila) => {  
    let celdas = fila.children
    if(celdas.length > 0){
      let inp = celdas[4].querySelector('input')
      totales.subtotal += parseFloat(inp.value) || 0;
    }
  })  
  totales.iva = totales.subtotal * .16
  totales.total = totales.subtotal + totales.iva
  
  document.getElementById('subtotal').textContent = formatearPesos(totales.subtotal.toFixed(2))
  document.getElementById('iva').textContent = formatearPesos(totales.iva.toFixed(2))
  document.getElementById('total').textContent = formatearPesos(totales.total.toFixed(2))
  
}

function cambioCantidad(fila){
  let celdas = fila.children
  let can = parseFloat(celdas[2].querySelector('input').value)
  let pre = parseFloat(celdas[3].querySelector('input').value)
  let tot = celdas[4].querySelector('input')
  
  if(can && pre){
    tot.value = can * pre
    totalizando()
  }
  return;
}

function formatearPesos(monto){
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
}