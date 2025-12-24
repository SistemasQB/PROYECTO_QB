// Project Profitability Control - Main Application JavaScript

// State Management
const state = {
  projects: [],
  filters: {
    search: "",
    region: "",
    cliente: "",
    analista: "",
    semana: "",
  },
  currentPage: 1,
  currentEditingProject: null,
  currentCompletingProject: null,
  currentDeletingId: null,
}

// Mock Data Generator
// function generateMockData() {
//   return [
//     {
//       id: "1",
//       numeroSemana: 47,
//       fechaCotizacion: "2024-11-20",
//       cotizacion: "COT-2024-001",
//       analistaEncargada: "María González",
//       conceptoCobrar: "Consultoría de Sistemas ERP",
//       personaResponsable: "Juan Pérez",
//       region: "Norte",
//       cliente: "TechCorp SA",
//       planta: "Monterrey",
//       horasCotizacion: 120,
//       gastoCotizado: 150000,
//       diferenciaCotizadoFacturado: 5000,
//       cotizadoMenosDepositado: 10000,
//       porcentaje20: 22.5,
//     },
//     {
//       id: "2",
//       numeroSemana: 48,
//       fechaCotizacion: "2024-11-27",
//       cotizacion: "COT-2024-002",
//       analistaEncargada: "Carlos Rodríguez",
//       conceptoCobrar: "Implementación de Software",
//       personaResponsable: "Ana Martínez",
//       region: "Centro",
//       cliente: "IndustriasMX",
//       planta: "CDMX",
//       horasCotizacion: 80,
//       gastoCotizado: 95000,
//       diferenciaCotizadoFacturado: -2000,
//       cotizadoMenosDepositado: 5000,
//       porcentaje20: 18.2,
//     },
//     {
//       id: "3",
//       numeroSemana: 49,
//       fechaCotizacion: "2024-12-04",
//       cotizacion: "COT-2024-003",
//       analistaEncargada: "Laura Fernández",
//       conceptoCobrar: "Auditoría de Procesos",
//       personaResponsable: "Roberto Silva",
//       region: "Sur",
//       cliente: "Comercial del Sureste",
//       planta: "Mérida",
//       horasCotizacion: 60,
//       gastoCotizado: 72000,
//       diferenciaCotizadoFacturado: 3000,
//       cotizadoMenosDepositado: 0,
//       porcentaje20: 25.8,
//     },
//     {
//       id: "4",
//       numeroSemana: 49,
//       fechaCotizacion: "2024-12-05",
//       cotizacion: "COT-2024-004",
//       analistaEncargada: "María González",
//       conceptoCobrar: "Capacitación en Tecnologías Web",
//       personaResponsable: "Diana López",
//       region: "Occidente",
//       cliente: "Educación Digital",
//       planta: "Guadalajara",
//       horasCotizacion: 100,
//       gastoCotizado: 120000,
//       diferenciaCotizadoFacturado: 8000,
//       cotizadoMenosDepositado: 3000,
//       porcentaje20: 21.5,
//     },
//   ]
// }

// API Functions
async function fetchProjects() {
  showLoading()
  hideLoading()
  state.projects = proyectos
  renderTable()
  // try {
  //   // Build query parameters
  //   const queryParams = new URLSearchParams({
  //     page: state.currentPage.toString(),
  //     ...state.filters,
  //   })

  //   // Simulate API call
  //   const response = await fetch(`/api/projects?${queryParams}`)

  //   if (!response.ok) {
  //     throw new Error("Error loading projects")
  //   }

  //   const data = await response.json()
  //   state.projects = data.projects || []
  // } catch (error) {
  //   console.log("[v0] Error fetching projects, using mock data:", error)
  //   // Use mock data on error
  //   state.projects = []
  //   showToast("Información", "Mostrando datos de ejemplo", "error")
  // } finally {
  //   hideLoading()
  //   renderTable()
  // }
}

async function deleteProject(id) {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Error deleting project")
    }

    showToast("Proyecto eliminado", "El proyecto se eliminó exitosamente", "success")
    await fetchProjects()
  } catch (error) {
    console.log("[v0] Error deleting project:", error)
    showToast("Error", "No se pudo eliminar el proyecto", "error")
  }
}

async function updateProject(project) {
  try {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error("Error updating project")
    }

    showToast("Proyecto actualizado", "Los cambios se guardaron exitosamente", "success")
    await fetchProjects()
  } catch (error) {
    console.log("[v0] Error updating project:", error)
    showToast("Error", "No se pudo actualizar el proyecto", "error")
  }
}

async function completeProject(id, data) {
  try {
    const response = await fetch(`/api/projects/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Error completing project")
    }

    showToast("Proyecto completado", "La información adicional se guardó exitosamente", "success")
    await fetchProjects()
  } catch (error) {
    console.log("[v0] Error completing project:", error)
    showToast("Error", "No se pudo completar el proyecto", "error")
  }
}

// UI Functions
function showLoading() {
  document.getElementById("tableLoading").style.display = "flex"
  document.getElementById("tableWrapper").style.display = "none"
}

function hideLoading() {
  document.getElementById("tableLoading").style.display = "none"
  document.getElementById("tableWrapper").style.display = "block"
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(value)
}

function renderTable(lista = state.projects) {
  const tbody = document.getElementById("projectsTableBody")
  tbody.innerHTML = ""

  if (lista.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="15" style="text-align: center; padding: 3rem; color: var(--muted-foreground);">
                    No se encontraron proyectos
                </td>
            </tr>
        `
    return
  }

  lista.forEach((project) => {
    console.log(project);
    const row = document.createElement("tr")

    const percentageClass = project.porcentaje20 >= 20 ? "badge-success" : "badge-danger"
    let gasto = JSON.parse(project.gasto)
    let miCoti = project.cotizacion
    // <td><div class="truncate" title="${project.conceptoCobrar}">${project.conceptoCobrar}</div></td>
    row.innerHTML = `
            <td class="font-medium">${project.semana}</td>
            <td>${project.fechaCotizacion}</td>
            <td>${project.cotizacion}</td>
            <td class="text-right font-mono">${project.cotizadora}</td>
            <td>${gasto.map((gasto) => gasto).join(", ")}</td>
            
            <td>${project.responsable}</td>
            <td>${project.region}</td>
            <td>${project.cliente}</td>
            <td>${project.planta}</td>
            <td class="text-right font-mono">${project.horas}</td>
            <td class="text-right font-mono">${formatCurrency(project.gastoCotizado)}</td>
            <td class="text-right font-mono">${formatCurrency(project.diferenciaCotizadoFacturado || 0)}</td>
            <td class="text-right font-mono">${formatCurrency(project.cotizadoMenosDepositado || 0)}</td>
            <td class="text-center">
                <span class="badge ${percentageClass}">${project.porcentaje20}%</span>
            </td>
            <td class="sticky-col">
                <div class="action-buttons">
                    <button class="action-btn action-btn-edit" onclick="openEditModal('${project.id}')" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    <button class="action-btn action-btn-complete" onclick="openCompleteModal('${project.id}')" title="Completar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </button>
                    <button class="action-btn action-btn-delete" onclick="openDeleteModal('${project.id}')" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(row)
  })
}

function showToast(title, description, type = "success") {
  const toast = document.getElementById("toast")
  const toastIcon = document.getElementById("toastIcon")
  const toastTitle = document.getElementById("toastTitle")
  const toastDescription = document.getElementById("toastDescription")

  toastTitle.textContent = title
  toastDescription.textContent = description
  toastIcon.className = `toast-icon ${type}`

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Filter Functions
function updateFilters() {
  state.filters.search = document.getElementById("searchInput").value
  state.filters.region = document.getElementById("regionFilter").value
  state.filters.cliente = document.getElementById("clienteFilter").value
  state.filters.analista = document.getElementById("analistaFilter").value
  state.filters.semana = document.getElementById("semanaFilter").value

  updateFilterBadge()
  fetchProjects()
}

function updateFilterBadge() {
  const activeFilters = Object.values(state.filters).filter((v) => v !== "").length
  const badge = document.getElementById("filterBadge")
  const clearBtn = document.getElementById("clearFiltersBtn")

  if (activeFilters > 0) {
    badge.textContent = activeFilters
    badge.style.display = "inline-block"
    clearBtn.style.display = "inline-flex"
  } else {
    badge.style.display = "none"
    clearBtn.style.display = "none"
  }
}

function clearFilters() {
  state.filters = {
    search: "",
    region: "",
    cliente: "",
    analista: "",
    semana: "",
  }

  document.getElementById("searchInput").value = ""
  document.getElementById("regionFilter").value = ""
  document.getElementById("clienteFilter").value = ""
  document.getElementById("analistaFilter").value = ""
  document.getElementById("semanaFilter").value = ""

  updateFilterBadge()
  fetchProjects()
}

// Modal Functions
function openEditModal(id) {
  const project = state.projects.find((p) => p.id === id)
  if (!project) return

  state.currentEditingProject = project

  document.getElementById("editModalCotizacion").textContent = project.cotizacion
  document.getElementById("editNumeroSemana").value = project.numeroSemana
  document.getElementById("editFechaCotizacion").value = project.fechaCotizacion
  document.getElementById("editCotizacion").value = project.cotizacion
  document.getElementById("editAnalistaEncargada").value = project.analistaEncargada
  document.getElementById("editConceptoCobrar").value = project.conceptoCobrar
  document.getElementById("editPersonaResponsable").value = project.personaResponsable
  document.getElementById("editRegion").value = project.region
  document.getElementById("editCliente").value = project.cliente
  document.getElementById("editPlanta").value = project.planta
  document.getElementById("editHorasCotizacion").value = project.horasCotizacion
  document.getElementById("editGastoCotizado").value = project.gastoCotizado
  document.getElementById("editDiferenciaCotizadoFacturado").value = project.diferenciaCotizadoFacturado
  document.getElementById("editCotizadoMenosDepositado").value = project.cotizadoMenosDepositado
  document.getElementById("editPorcentaje20").value = project.porcentaje20

  document.getElementById("editModalOverlay").style.display = "flex"
}

function closeEditModal() {
  document.getElementById("editModalOverlay").style.display = "none"
  state.currentEditingProject = null
}

function openCompleteModal(id) {
  const project = state.projects.find((p) => p.id === id)
  if (!project) return

  state.currentCompletingProject = project

  document.getElementById("completeModalCotizacion").textContent = project.cotizacion
  document.getElementById("completeMontoCotizado").value = project.montoCotizado || 0
  document.getElementById("completeTotalCotizadoPesos").value = project.totalCotizadoPesos || 0
  document.getElementById("completeHorasFacturadas").value = project.horasFacturadas || 0
  document.getElementById("completeMontoFacturado").value = project.montoFacturado || 0
  document.getElementById("completeTotalFacturadoPesos").value = project.totalFacturadoPesos || 0
  document.getElementById("completePresupuestoRequisicion").value = project.presupuestoRequisicion || 0
  document.getElementById("completeFechaDeposito").value = project.fechaDeposito || ""
  document.getElementById("completeComentarios").value = project.comentarios || ""

  document.getElementById("completeModalOverlay").style.display = "flex"
}

function closeCompleteModal() {
  document.getElementById("completeModalOverlay").style.display = "none"
  state.currentCompletingProject = null
}

function openDeleteModal(id) {
  state.currentDeletingId = id
  document.getElementById("deleteModalOverlay").style.display = "flex"
}

function closeDeleteModal() {
  document.getElementById("deleteModalOverlay").style.display = "none"
  state.currentDeletingId = null
}

// Form Handlers
async function handleEditSubmit(e) {
  e.preventDefault()

  const saveBtn = document.getElementById("saveEditBtn")
  const spinner = saveBtn.querySelector(".btn-spinner")
  const btnText = saveBtn.querySelector(".btn-text")

  spinner.style.display = "inline-block"
  btnText.textContent = "Guardando..."
  saveBtn.disabled = true

  const updatedProject = {
    ...state.currentEditingProject,
    numeroSemana: Number.parseInt(document.getElementById("editNumeroSemana").value),
    fechaCotizacion: document.getElementById("editFechaCotizacion").value,
    cotizacion: document.getElementById("editCotizacion").value,
    analistaEncargada: document.getElementById("editAnalistaEncargada").value,
    conceptoCobrar: document.getElementById("editConceptoCobrar").value,
    personaResponsable: document.getElementById("editPersonaResponsable").value,
    region: document.getElementById("editRegion").value,
    cliente: document.getElementById("editCliente").value,
    planta: document.getElementById("editPlanta").value,
    horasCotizacion: Number.parseFloat(document.getElementById("editHorasCotizacion").value),
    gastoCotizado: Number.parseFloat(document.getElementById("editGastoCotizado").value),
    diferenciaCotizadoFacturado: Number.parseFloat(document.getElementById("editDiferenciaCotizadoFacturado").value),
    cotizadoMenosDepositado: Number.parseFloat(document.getElementById("editCotizadoMenosDepositado").value),
    porcentaje20: Number.parseFloat(document.getElementById("editPorcentaje20").value),
  }

  await updateProject(updatedProject)

  spinner.style.display = "none"
  btnText.textContent = "Guardar Cambios"
  saveBtn.disabled = false

  closeEditModal()
}

async function handleCompleteSubmit(e) {
  e.preventDefault()

  const saveBtn = document.getElementById("saveCompleteBtn")
  const spinner = saveBtn.querySelector(".btn-spinner")
  const btnText = saveBtn.querySelector(".btn-text")

  spinner.style.display = "inline-block"
  btnText.textContent = "Guardando..."
  saveBtn.disabled = true

  const completeData = {
    montoCotizado: Number.parseFloat(document.getElementById("completeMontoCotizado").value),
    totalCotizadoPesos: Number.parseFloat(document.getElementById("completeTotalCotizadoPesos").value),
    horasFacturadas: Number.parseFloat(document.getElementById("completeHorasFacturadas").value),
    montoFacturado: Number.parseFloat(document.getElementById("completeMontoFacturado").value),
    totalFacturadoPesos: Number.parseFloat(document.getElementById("completeTotalFacturadoPesos").value),
    presupuestoRequisicion: Number.parseFloat(document.getElementById("completePresupuestoRequisicion").value),
    fechaDeposito: document.getElementById("completeFechaDeposito").value,
    comentarios: document.getElementById("completeComentarios").value,
  }

  await completeProject(state.currentCompletingProject.id, completeData)

  spinner.style.display = "none"
  btnText.textContent = "Guardar Información"
  saveBtn.disabled = false

  closeCompleteModal()
}

async function handleDelete() {
  await deleteProject(state.currentDeletingId)
  closeDeleteModal()
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Toggle Filters
  document.getElementById("toggleFiltersBtn").addEventListener("click", () => {
    const filtersContent = document.getElementById("filtersContent")
    const toggleText = document.getElementById("toggleFiltersText")
    const isVisible = filtersContent.style.display === "block"

    filtersContent.style.display = isVisible ? "none" : "block"
    toggleText.textContent = isVisible ? "Mostrar" : "Ocultar"
  })

  // Clear Filters
  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters)

  // Filter inputs
  document.getElementById("searchInput").addEventListener("input", updateFilters)
  document.getElementById("regionFilter").addEventListener("change", updateFilters)
  document.getElementById("clienteFilter").addEventListener("input", updateFilters)
  document.getElementById("analistaFilter").addEventListener("input", updateFilters)
  document.getElementById("semanaFilter").addEventListener("input", updateFilters)

  // Pagination
  document.getElementById("prevPageBtn").addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--
      document.getElementById("currentPage").textContent = state.currentPage
      fetchProjects()
    }
  })

  document.getElementById("nextPageBtn").addEventListener("click", () => {
    state.currentPage++
    document.getElementById("currentPage").textContent = state.currentPage
    fetchProjects()
  })

  // Edit Modal
  document.getElementById("closeEditModal").addEventListener("click", closeEditModal)
  document.getElementById("cancelEditBtn").addEventListener("click", closeEditModal)
  document.getElementById("editForm").addEventListener("submit", handleEditSubmit)
  document.getElementById("editModalOverlay").addEventListener("click", function (e) {
    if (e.target === this) closeEditModal()
  })

  // Complete Modal
  document.getElementById("closeCompleteModal").addEventListener("click", closeCompleteModal)
  document.getElementById("cancelCompleteBtn").addEventListener("click", closeCompleteModal)
  document.getElementById("completeForm").addEventListener("submit", handleCompleteSubmit)
  document.getElementById("completeModalOverlay").addEventListener("click", function (e) {
    if (e.target === this) closeCompleteModal()
  })

  // Delete Modal
  document.getElementById("cancelDeleteBtn").addEventListener("click", closeDeleteModal)
  document.getElementById("confirmDeleteBtn").addEventListener("click", handleDelete)
  document.getElementById("deleteModalOverlay").addEventListener("click", function (e) {
    if (e.target === this) closeDeleteModal()
  })

  // Initial load
  fetchProjects()
})
