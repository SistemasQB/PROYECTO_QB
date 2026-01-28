// Estado global de la aplicación
const state = {
  requests: [],
  filteredRequests: [],
  currentPage: 1,
  itemsPerPage: 2,
  searchTerm: "",
  statusFilter: "all",
  isLoading: true,
  editingRequest: null,
  deleteRequestId: null,
  formItems: [],
}

// API Configuration
const API_BASE_URL = "/api/requests" // Cambiar a tu endpoint real

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  fetchRequests()
  
  // hideLoading()
})

// Event Listeners
function initializeEventListeners() {
  document.getElementById("search-input").addEventListener("input", handleSearch)
  document.getElementById("status-filter").addEventListener("change", handleStatusFilter)
  document.getElementById("new-request-btn").addEventListener("click", openNewRequestModal)
  document.getElementById("prev-page").addEventListener("click", goToPreviousPage)
  document.getElementById("next-page").addEventListener("click", goToNextPage)

  // Close modals when clicking outside
  document.getElementById("request-modal").addEventListener("click", (e) => {
    if (e.target.id === "request-modal") closeRequestModal()
  })
  document.getElementById("delete-modal").addEventListener("click", (e) => {
    if (e.target.id === "delete-modal") closeDeleteModal()
  })
}

// API Functions
async function fetchRequests() {
  state.isLoading = true
  showLoading()
  try {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) throw new Error("Error al cargar solicitudes")

    state.requests = await response.json()
    if(!state.requests) state.requests = solicitudes
    state.isLoading = false
    filterAndRender()
  } catch (error) {
    console.error("Error fetching requests:", error)
    state.isLoading = false
    hideLoading()
    // En caso de error, usar datos de ejemplo
    state.requests = solicitudes
    state.isLoading = false
    filterAndRender()
    // loadMockData()
  }
}

async function createRequest(requestData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) throw new Error("Error al crear solicitud")

    const newRequest = await response.json()
    state.requests.push(newRequest)
    filterAndRender()
    return newRequest
  } catch (error) {
    console.error("Error creating request:", error)
    throw error
  }
}

async function updateRequest(requestData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${requestData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) throw new Error("Error al actualizar solicitud")

    const index = state.requests.findIndex((r) => r.id === requestData.id)
    if (index !== -1) {
      state.requests[index] = requestData
    }
    filterAndRender()
  } catch (error) {
    console.error("Error updating request:", error)
    throw error
  }
}

async function deleteRequestAPI(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Error al eliminar solicitud")

    state.requests = state.requests.filter((r) => r.id !== id)
    filterAndRender()
  } catch (error) {
    console.error("Error deleting request:", error)
    throw error
  }
}

// Mock Data (para desarrollo/pruebas)
function loadMockData() {
  state.requests = [
    {
      id: 1,
      requesterName: "Juan Pérez",
      email: "juan.perez@empresa.com",
      phone: "555-1234",
      department: "Ventas",
      status: "Pendiente",
      observaciones: "Urgente para nuevo empleado",
      items: [
        { name: "Laptop Dell", quantity: 1, fulfilled: false },
        { name: "Mouse inalámbrico", quantity: 1, fulfilled: false },
      ],
    },
    {
      id: 2,
      requesterName: "María González",
      email: "maria.gonzalez@empresa.com",
      phone: "555-5678",
      department: "Marketing",
      status: "En Proceso",
      observaciones: "",
      items: [
        { name: "Monitor 27 pulgadas", quantity: 2, fulfilled: true },
        { name: "Teclado mecánico", quantity: 2, fulfilled: false },
      ],
    },
    {
      id: 3,
      requesterName: "Carlos López",
      email: "carlos.lopez@empresa.com",
      phone: "555-9012",
      department: "Desarrollo",
      status: "Completada",
      observaciones: "Proyecto nuevo iniciado",
      items: [
        { name: "MacBook Pro", quantity: 1, fulfilled: true },
        { name: "iPhone", quantity: 1, fulfilled: true },
      ],
    },
    {
      id: 4,
      requesterName: "Ana Martínez",
      email: "ana.martinez@empresa.com",
      phone: "555-3456",
      department: "Recursos Humanos",
      status: "Parcialmente Surtida",
      observaciones: "Pendiente de aprobación de presupuesto",
      items: [
        { name: "Impresora láser", quantity: 1, fulfilled: true },
        { name: "Scanner", quantity: 1, fulfilled: false },
        { name: "Destructora de papel", quantity: 1, fulfilled: false },
      ],
    },
    {
      id: 5,
      requesterName: "Roberto Sánchez",
      email: "roberto.sanchez@empresa.com",
      phone: "555-7890",
      department: "Finanzas",
      status: "Cancelada",
      observaciones: "Proyecto cancelado",
      items: [{ name: "Tablet", quantity: 3, fulfilled: false }],
    },
  ]

  state.isLoading = false
  filterAndRender()
}

// Filtering and Rendering
function filterAndRender() {
  const { requests, searchTerm, statusFilter } = state
  state.filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.items.some((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  state.currentPage = 1
  render()
}

function render() {
  hideLoading()
  showContent()
  renderTable()
  renderPagination()
}

function renderTable() {
  const tbody = document.getElementById("table-body")
  const { filteredRequests, currentPage, itemsPerPage } = state
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const paginatedRequests = filteredRequests.slice(start, end)

  if (paginatedRequests.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    ${
                      state.searchTerm || state.statusFilter !== "all"
                        ? "No se encontraron solicitudes con los filtros aplicados"
                        : "No hay solicitudes registradas"
                    }
                </td>
            </tr>
        `
    return
  }
  
  let contenido = paginatedRequests.map(
      (request) => {
        let texto =  `
        <tr>
            <td class="id-cell">${request.id}</td>
            <td>
                <div class="requester-info">
                    <span class="requester-name">${escapeHtml(request.requesterName)}</span>
                    <span class="requester-email">${escapeHtml(request.email)}</span>
                </div>
            </td>
            <td>${escapeHtml(request.department)}</td>
            <td>
                <div class="items-list">`
                let parseados = JSON.parse(request.items)
                
                    let items = parseados
                      .slice(0, 2)
                      .map(
                        (item) => `
                        <span class="item-name">
                            ${escapeHtml(item.equipment)} ${item.quantity > 1 ? `(item.quantity)` : ""}
                            ${item.surtido ? '<span class="item-fulfilled">✓</span>' : ""}
                        </span>`
                        ,
                      )
                      .join("")
                    texto += items
                    texto += `${parseados.length > 2 ? `<span class="more-items">+${parseados.length - 2} más</span>` : ""}
                </div>
            </td>
            <td>${getStatusBadge(request.status)}</td>
            <td class="phone-cell">${escapeHtml(request.phone)}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-outline btn-sm btn-edit" onclick="editRequest(${request.id})">Ver/Editar</button>
                    <button class="btn btn-outline btn-sm btn-delete" onclick="openDeleteModal(${request.id})">Eliminar</button>
                </div>
            </td>
        </tr>
    `
    return texto
  })
    
    tbody.innerHTML = contenido
}

function renderPagination() {
  const { filteredRequests, currentPage, itemsPerPage } = state
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  if (totalPages <= 1) {
    document.getElementById("pagination").style.display = "none"
    return
  }

  document.getElementById("pagination").style.display = "flex"

  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, filteredRequests.length)

  document.getElementById("pagination-info").textContent =
    `Mostrando ${start} - ${end} de ${filteredRequests.length} solicitudes`

  document.getElementById("page-info").textContent = `Página ${currentPage} de ${totalPages}`

  document.getElementById("prev-page").disabled = currentPage === 1
  document.getElementById("next-page").disabled = currentPage === totalPages
}

// Event Handlers
function handleSearch(e) {
  state.searchTerm = e.target.value
  filterAndRender()
}

function handleStatusFilter(e) {
  state.statusFilter = e.target.value
  filterAndRender()
}

function goToPreviousPage() {
  if (state.currentPage > 1) {
    state.currentPage--
    render()
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(state.filteredRequests.length / state.itemsPerPage)
  if (state.currentPage < totalPages) {
    state.currentPage++
    render()
  }
}

// Modal Functions - Request
function openNewRequestModal() {
  state.editingRequest = null
  state.formItems = []
  document.getElementById("modal-title").textContent = "Nueva Solicitud"
  document.getElementById("modal-description").textContent =
    "Completa los datos para crear una nueva solicitud de equipos."
  document.getElementById("save-request-btn").textContent = "Crear Solicitud"
  resetForm()
  document.getElementById("request-modal").classList.add("active")
}

function editRequest(id) {
  
  const request = state.requests.find((r) => r.id === id)
  
  if (!request) return

  state.editingRequest = request
  state.formItems = [...JSON.parse(request.items)]

  document.getElementById("modal-title").textContent = "Editar Solicitud"
  document.getElementById("modal-description").textContent =
    "Modifica los detalles de la solicitud y actualiza el estatus de los equipos."
  document.getElementById("save-request-btn").textContent = "Actualizar"

  // Llenar el formulario
  document.getElementById("requesterName").value = request.equipment
  document.getElementById("email").value = request.email
  document.getElementById("phone").value = request.phone
  document.getElementById("department").value = request.department
  document.getElementById("status").value = request.status
  document.getElementById("observaciones").value = request.observaciones || ""

  renderFormItems()
  document.getElementById("request-modal").classList.add("active")
}

function closeRequestModal() {
  document.getElementById("request-modal").classList.remove("active")
  resetForm()
}

function resetForm() {
  document.getElementById("requesterName").value = ""
  document.getElementById("email").value = ""
  document.getElementById("phone").value = ""
  document.getElementById("department").value = ""
  document.getElementById("status").value = "Pendiente"
  document.getElementById("observaciones").value = ""
  state.formItems = []
  renderFormItems()
  clearErrors()
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.classList.remove("active")
    el.textContent = ""
  })
}

// Form Items Management
function addItemToForm() {
  state.formItems.push({ name: "", quantity: 1, fulfilled: false })
  renderFormItems()
}

function removeItemFromForm(index) {
  state.formItems.splice(index, 1)
  renderFormItems()
}

function updateFormItem(index, field, value) {
  state.formItems[index][field] = value
}

function renderFormItems() {
  const container = document.getElementById("items-container")

  if (state.formItems.length === 0) {
    container.innerHTML =
      '<p class="empty-items">No hay equipos agregados. Haz clic en "Agregar Equipo" para comenzar.</p>'
    return
  }

  container.innerHTML = state.formItems
    .map(
      (item, index) => `
        <div class="item-card">
            <div class="item-fields">
                <input 
                    type="text" 
                    class="form-input" 
                    placeholder="Nombre del equipo"
                    value="${escapeHtml(item.equipment)}"
                    onchange="updateFormItem(${index}, 'name', this.value)"
                />
                <div class="item-controls">
                    <input 
                        type="number" 
                        class="form-input item-quantity" 
                        placeholder="Cantidad"
                        min="1"
                        value="${item.quantity}"
                        onchange="updateFormItem(${index}, 'quantity', parseInt(this.value) || 1)"
                    />
                    <label class="checkbox-label">
                        <input 
                            type="checkbox" 
                            ${item.surtido ? "checked" : ""}
                            onchange="updateFormItem(${index}, 'fulfilled', this.checked)"
                        />
                        <span>Surtido</span>
                    </label>
                </div>
            </div>
            <button type="button" class="btn-remove-item" onclick="removeItemFromForm(${index})">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `,
    )
    .join("")
}

// Form Validation and Save
function validateForm() {
  clearErrors()
  let isValid = true

  const requesterName = document.getElementById("requesterName").value.trim()
  const email = document.getElementById("email").value.trim()
  const phone = document.getElementById("phone").value.trim()
  const department = document.getElementById("department").value.trim()

  if (!requesterName) {
    showError("requesterName", "El nombre es requerido")
    isValid = false
  }

  if (!email) {
    showError("email", "El email es requerido")
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Email inválido")
    isValid = false
  }

  if (!phone) {
    showError("phone", "El teléfono es requerido")
    isValid = false
  }

  if (!department) {
    showError("department", "El departamento es requerido")
    isValid = false
  }

  if (state.formItems.length === 0) {
    showError("items", "Debe agregar al menos un equipo")
    isValid = false
  }

  return isValid
}

function showError(fieldName, message) {
  const errorElement = document.getElementById(`error-${fieldName}`)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.classList.add("active")
  }
}

async function saveRequest() {
  if (!validateForm()) return

  const saveBtn = document.getElementById("save-request-btn")
  const originalText = saveBtn.textContent
  saveBtn.disabled = true
  saveBtn.textContent = "Guardando..."

  const requestData = {
    requesterName: document.getElementById("requesterName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    department: document.getElementById("department").value.trim(),
    status: document.getElementById("status").value,
    observaciones: document.getElementById("observaciones").value.trim(),
    items: state.formItems,
  }

  try {
    if (state.editingRequest) {
      requestData.id = state.editingRequest.id
      await updateRequest(requestData)
    } else {
      requestData.id = Math.max(0, ...state.requests.map((r) => r.id)) + 1
      await createRequest(requestData)
    }

    closeRequestModal()
  } catch (error) {
    alert("Error al guardar la solicitud. Por favor intenta de nuevo.")
  } finally {
    saveBtn.disabled = false
    saveBtn.textContent = originalText
  }
}

// Modal Functions - Delete
function openDeleteModal(id) {
  state.deleteRequestId = id
  document.getElementById("delete-modal").classList.add("active")
}

function closeDeleteModal() {
  document.getElementById("delete-modal").classList.remove("active")
  state.deleteRequestId = null
}

async function confirmDelete() {
  if (!state.deleteRequestId) return

  try {
    await deleteRequestAPI(state.deleteRequestId)
    closeDeleteModal()
  } catch (error) {
    alert("Error al eliminar la solicitud. Por favor intenta de nuevo.")
  }
}

// Utility Functions
function getStatusBadge(status) {
  const statusMap = {
    pendiente: "badge-pendiente",
    "en proceso": "badge-proceso",
    completada: "badge-completada",
    "parcialmente surtida": "badge-parcial",
    cancelada: "badge-cancelada",
  }

  const badgeClass = statusMap[status.toLowerCase()] || "badge-pendiente"

  return `<span class="badge ${badgeClass}">${escapeHtml(status)}</span>`
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function showLoading() {
  document.getElementById("loading-state").style.display = "flex"
  document.getElementById("filters-section").style.display = "none"
  document.getElementById("table-container").style.display = "none"
  document.getElementById("pagination").style.display = "none"
}

function hideLoading() {
  document.getElementById("loading-state").style.display = "none"
}

function showContent() {
  document.getElementById("filters-section").style.display = "block"
  document.getElementById("table-container").style.display = "block"
}

