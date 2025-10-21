// Datos de ejemplo - Reemplaza esto con tus datos reales
const checklistData = [
  {
    id: 1,
    fecha: "2025-03-10",
    vehiculo: "Toyota Hilux ABC-123",
    solicitante: "Juan Pérez",
    region: "Norte",
    estatus: "completado",
    documentUrl: "https://ejemplo.com/doc1",
  },
  {
    id: 2,
    fecha: "2025-03-09",
    vehiculo: "Ford Ranger XYZ-456",
    solicitante: "María García",
    region: "Sur",
    estatus: "pendiente",
    documentUrl: "https://ejemplo.com/doc2",
  },
  {
    id: 3,
    fecha: "2025-03-08",
    vehiculo: "Chevrolet Colorado DEF-789",
    solicitante: "Carlos López",
    region: "Este",
    estatus: "en-proceso",
    documentUrl: "https://ejemplo.com/doc3",
  },
  {
    id: 4,
    fecha: "2025-03-07",
    vehiculo: "Nissan Frontier GHI-012",
    solicitante: "Ana Martínez",
    region: "Oeste",
    estatus: "rechazado",
    documentUrl: "https://ejemplo.com/doc4",
  },
  {
    id: 5,
    fecha: "2025-03-06",
    vehiculo: "Mitsubishi L200 JKL-345",
    solicitante: "Pedro Sánchez",
    region: "Centro",
    estatus: "completado",
    documentUrl: "https://ejemplo.com/doc5",
  },
  {
    id: 6,
    fecha: "2025-03-05",
    vehiculo: "Isuzu D-Max MNO-678",
    solicitante: "Laura Rodríguez",
    region: "Norte",
    estatus: "pendiente",
    documentUrl: "https://ejemplo.com/doc6",
  },
  {
    id: 7,
    fecha: "2025-03-04",
    vehiculo: "Volkswagen Amarok PQR-901",
    solicitante: "Roberto Díaz",
    region: "Sur",
    estatus: "en-proceso",
    documentUrl: "https://ejemplo.com/doc7",
  },
  {
    id: 8,
    fecha: "2025-03-03",
    vehiculo: "RAM 1500 STU-234",
    solicitante: "Carmen Flores",
    region: "Este",
    estatus: "completado",
    documentUrl: "https://ejemplo.com/doc8",
  },
  {
    id: 9,
    fecha: "2025-03-02",
    vehiculo: "GMC Sierra VWX-567",
    solicitante: "Miguel Torres",
    region: "Oeste",
    estatus: "pendiente",
    documentUrl: "https://ejemplo.com/doc9",
  },
  {
    id: 10,
    fecha: "2025-03-01",
    vehiculo: "Mazda BT-50 YZA-890",
    solicitante: "Isabel Ruiz",
    region: "Centro",
    estatus: "en-proceso",
    documentUrl: "https://ejemplo.com/doc10",
  },
  {
    id: 11,
    fecha: "2025-02-28",
    vehiculo: "Honda Ridgeline BCD-123",
    solicitante: "Francisco Morales",
    region: "Norte",
    estatus: "completado",
    documentUrl: "https://ejemplo.com/doc11",
  },
  {
    id: 12,
    fecha: "2025-02-27",
    vehiculo: "Toyota Tacoma EFG-456",
    solicitante: "Patricia Jiménez",
    region: "Sur",
    estatus: "rechazado",
    documentUrl: "https://ejemplo.com/doc12",
  },
]

// Variables globales
let currentPage = 1
const itemsPerPage = 10
// let filteredData = [...checks]
let filteredData = []
let currentEditId = null

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  filteredData = [...checks]
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

  filteredData = checklistData.filter((item) => {
    return (
      item.fecha.toLowerCase().includes(searchTerm) ||
      item.vehiculo.toLowerCase().includes(searchTerm) ||
      item.solicitante.toLowerCase().includes(searchTerm) ||
      item.region.toLowerCase().includes(searchTerm) ||
      item.estatus.toLowerCase().includes(searchTerm)
    )
  })

  currentPage = 1
  renderTable()
}

// Renderizar tabla
function renderTable() {
  const tableBody = document.getElementById("tableBody")
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pageData = filteredData.slice(startIndex, endIndex)

  tableBody.innerHTML = ""

  pageData.forEach((item) => {
    const datos=extraerDatos(item)
    const row = document.createElement("tr")
    row.className = `status-${item.estatus}`

    row.innerHTML = `
            <td>${datos.fecha}</td>
            <td>${datos.vehiculo}</td>
            <td>${datos.solicitante}</td>
            <td>${datos.region}</td>
            <td>
                <span class="status-badge ${item.estatus}">
                    ${formatStatus(item.estatus)}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view" onclick="viewDocument(${datos.id})" title="Visualizar documento">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        Ver
                    </button>
                    <button class="action-btn complete" onclick="openCompleteModal(${datos.id})" title="Completar información">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11 3 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Completar
                    </button>
                    <button class="action-btn delete" onclick="deleteRecord(${datos.id})" title="Eliminar registro">
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
  // const item = checklistData.find((i) => i.id === id)
  // if (item) {
  //   // Redirigir a la URL del documento
  //   window.open(`check-list-vehicular/${id}`, "_blank")
  // }
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
async function saveCompletion() {
  const observaciones = document.getElementById("observaciones").value
  const fechaEntrega = document.getElementById("fechaEntrega").value
  
  if (!observaciones || !fechaEntrega) {
    alert("Por favor complete todos los campos")
    return
  }

  let complemento = {
    observacionesLogistica : {
      observaciones:observaciones,
      fechaEntrega:fechaEntrega,
    },
    id: currentEditId,
    tipo: 'update',
    _csrf: tok,
    estatus: 'CERRADO'
  }
  complemento.observacionesLogistica = JSON.stringify(complemento.observacionesLogistica)

  alertaFetchCalidad('crudCheck-list-vehicular', complemento, 'historico_check_list_vehicular')
  
  // Ejemplo: actualizar el estatus a completado
  const itemIndex = checklistData.findIndex((i) => i.id === currentEditId)
  if (itemIndex !== -1) {
    checklistData[itemIndex].estatus = "completado"
    // Aquí también podrías guardar las observaciones y fecha de entrega
    checklistData[itemIndex].observaciones = observaciones
    checklistData[itemIndex].fechaEntrega = fechaEntrega
  }

  renderTable()
  closeModal()
  
  alert("Información guardada exitosamente")
}

// Eliminar registro
async function deleteRecord(id) {
  let datos = {
    _csrf: tok,
    tipo: 'delete',
    id:id
  }

  if (confirm("¿Está seguro de que desea eliminar este registro?")) {
    await alertaFetchCalidad('', datos,'')
    // const index = checklistData.findIndex((i) => i.id === id)
    // if (index !== -1) {
    //   checklistData.splice(index, 1)
    //   filteredData = [...checklistData]

    //   // Ajustar página si es necesario
    //   const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    //   if (currentPage > totalPages && totalPages > 0) {
    //     currentPage = totalPages
    //   }

    //   renderTable()
    //   alert("Registro eliminado exitosamente")
    // }
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
  return  {
    id:reg.id,
    fecha:f,
    vehiculo: datosUnidad.unidad,
    solicitante: datosUnidad.usuario,
    region:datosUnidad.region,
  }
  
}