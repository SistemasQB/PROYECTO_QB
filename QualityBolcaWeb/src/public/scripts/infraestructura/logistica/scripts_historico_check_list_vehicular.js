
// Variables globales
let currentPage = 1
const itemsPerPage = 20
// let filteredData = [...checks]

let filteredData = []
let comprimidos = []
let descargados = []
let currentEditId = null

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  deserializarDatos()
  filteredData = [...descargados]
  renderTable()
  setupEventListeners()
})

// Configurar event listeners
function setupEventListeners() {
  document.getElementById("searchInput").addEventListener("input", handleSearch)
  document.getElementById("prevBtn").addEventListener("click", () => changePage(-1))
  document.getElementById("nextBtn").addEventListener("click", () => changePage(1))
}

// Manejar búsqueda
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase()
  filteredData = descargados.filter((item) => {
    return (
      item.fecha.toLowerCase().includes(searchTerm) ||
      item.vehiculo.toLowerCase().includes(searchTerm) ||
      item.solicitante.toLowerCase().includes(searchTerm) ||
      item.region.toLowerCase().includes(searchTerm) ||
      item.estatus.toLowerCase().includes(searchTerm)
    )
  })

  currentPage = 1
  renderTable(filteredData)
}

// Renderizar tabla
function renderTable(arreglo = descargados) {
  const tableBody = document.getElementById("tableBody")
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pageData = arreglo.slice(startIndex, endIndex)
  tableBody.innerHTML = ""

  pageData.forEach((item) => {
    const row = document.createElement("tr")
    row.className = `status-${item.estatus}`
    row.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.vehiculo}</td>
            <td>${item.solicitante}</td>
            <td>${item.region}</td>
            <td>
                <span class="status-badge ${item.estatus}">
                    ${formatStatus(item.estatus)}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view" onclick="viewDocument(${item.id})" title="Visualizar documento">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        Ver
                    </button>
                    <button class="action-btn complete" onclick="openCompleteModal(${item.id})" title="Completar información">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11 3 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Completar
                    </button>
                    <button class="action-btn delete" onclick="deleteRecord(${item.id})" title="Eliminar registro">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Eliminar
                    </button>
                </div>
            </td>
        `

    tableBody.appendChild(row)
  })

  updatePagination()
}

// Formatear estatus
function formatStatus(status) {
  const statusMap = {
    pendiente: "Pendiente",
    "en-proceso": "En Proceso",
    completado: "Completado",
    rechazado: "Rechazado",
  }
  return statusMap[status] || status
}

// Actualizar paginación
function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const pageInfo = document.getElementById("pageInfo")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")

  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`
  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages || totalPages === 0
}

// Cambiar página
function changePage(direction) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const newPage = currentPage + direction
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage
    renderTable()
  }
}

// Ver documento
function viewDocument(id) {
  window.open(`check-list-vehicular/${id}`, "_blank")
}

// Abrir modal de completar
function openCompleteModal(id) {
  currentEditId = id
  const modal = document.getElementById("completeModal")
  modal.classList.add("active")

  // Limpiar campos
  document.getElementById("observaciones").value = ""
  let fecha = new Date(Date.now())
  document.getElementById("fechaEntrega").value = fecha.toISOString().split("T")[0]
}

// Cerrar modal
function closeModal() {
  const modal = document.getElementById("completeModal")
  modal.classList.remove("active")
  currentEditId = null
}

// Guardar información completada
// async function saveCompletion() {
//   const observaciones = document.getElementById("observaciones").value
//   const fechaEntrega = document.getElementById("fechaEntrega").value
  
//   if (!observaciones || !fechaEntrega) {
//     alert("Por favor complete todos los campos")
//     return
//   }

//   let complemento = {
//     observacionesLogistica : {
//       observaciones:observaciones,
//       fechaEntrega:fechaEntrega,
//     },
//     id: currentEditId,
//     tipo: 'update',
//     _csrf: tok,
//     estatus: 'CERRADO'
//   }
//   complemento.observacionesLogistica = JSON.stringify(complemento.observacionesLogistica)

//   alertaFetchCalidad('crudCheck-list-vehicular', complemento, 'historico_check_list_vehicular')
  
//   // Ejemplo: actualizar el estatus a completado
//   const itemIndex = checklistData.findIndex((i) => i.id === currentEditId)
//   if (itemIndex !== -1) {
//     checklistData[itemIndex].estatus = "completado"
//     // Aquí también podrías guardar las observaciones y fecha de entrega
//     checklistData[itemIndex].observaciones = observaciones
//     checklistData[itemIndex].fechaEntrega = fechaEntrega
//   }

//   renderTable()
//   closeModal()
  
//   alert("Información guardada exitosamente")
// }

// Eliminar registro
async function deleteRecord(id) {
  let datos = {
    _csrf: tok,
    tipo: 'delete',
    id:id
  }

  if (confirm("¿Está seguro de que desea eliminar este registro?")) {
    await alertaFetchCalidad('crudCheck-list-vehicular', datos,'historico_check_list_vehicular')
  }
}

// Cerrar modal al hacer clic fuera
document.getElementById("completeModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal()
  }
})

function extraerDatos(reg){
  let datosUnidad = JSON.parse(reg.datosUnidad)
  let fecha = new Date(reg.createdAt)
  let f = fecha.toLocaleDateString('en-GB')
  let item = {
    id:reg.id,
    fecha:f,
    vehiculo: datosUnidad.unidad,
    solicitante: datosUnidad.usuario,
    region:datosUnidad.region,
    estatus: reg.estatus
  }
  // if(!validarexistencia()){
  //   comprimidos.push(item)
  // }
  return  item
}

function validarexistencia(id){
  let resultado = comprimidos.find((item) => item.id == id)
  if (resultado) return true
  return false;
  
}

function deserializarDatos(){
  let resultados = checks.map((item) => {
    return extraerDatos(item)    
  })
  descargados = [...resultados]
  return ;
  
}