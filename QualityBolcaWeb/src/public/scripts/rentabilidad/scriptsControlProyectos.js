// State Management
const state = {
  proyectosFiltrados: [],
  projects: [],
  hayFiltros:false,
  filters: {
    search: "",
    region: "",
    cliente: "",
    analista: "",
    semana: "",
    fechaInicio: "",
    fechaFin: "",
  },
  currentPage: 1,
  itemsPerPage: 50,
  totalItems: 0,
  currentEditingProject: null,
  currentCompletingProject: null,
  currentDeletingId: null,
}

  const inputCliente = document.getElementById("clienteFilter")
  const inputAnalista = document.getElementById("analistaFilter")
  const inputRegion = document.getElementById("regionFilter")
// API Functions
async function fetchProjects() {
  
  showLoading()
  if(state.hayFiltros){
    renderTable(filtrarProyectos())
    hideLoading()
    return
  }
  renderTable(state.projects)
  hideLoading()

  // Construir query params con los filtros activos
  // const params = new URLSearchParams()
  // if (state.filters.search)      params.append("search",      state.filters.search)
  // if (state.filters.region)      params.append("region",      state.filters.region)
  // if (state.filters.cliente)     params.append("cliente",     state.filters.cliente)
  // if (state.filters.analista)    params.append("analista",    state.filters.analista)
  // if (state.filters.semana)      params.append("semana",      state.filters.semana)
  // if (state.filters.fechaInicio) params.append("fechaInicio", state.filters.fechaInicio)
  // if (state.filters.fechaFin)    params.append("fechaFin",    state.filters.fechaFin)
  // params.append("page",  state.currentPage)
  // params.append("limit", state.itemsPerPage)

  // try {
  //   const response = await fetch(`/api/rentabilidad/proyectos?${params.toString()}`)
  //   if (!response.ok) throw new Error("Error al obtener proyectos")
  //   const data = await response.json()

  //   // Se espera: { proyectos: [...], total: N }
  //   state.projects = data.proyectos || data
  //   state.totalItems = data.total || state.projects.length

  //   // Actualizar texto de paginación
  //   const from = ((state.currentPage - 1) * state.itemsPerPage) + 1
  //   const to   = Math.min(state.currentPage * state.itemsPerPage, state.totalItems)
  //   const pageInfo = document.getElementById("pageInfo")
  //   if (pageInfo) pageInfo.textContent = `Mostrando ${from}–${to} de ${state.totalItems}`

  //   renderTable(state.projects)
  // } catch (error) {
  //   console.error("[controlProyectos] Error al cargar proyectos:", error)
  //   showToast("Error", "No se pudieron cargar los proyectos", "error")
  //   renderTable([])
  // } finally {
  //   hideLoading()
  // }
}

async function deleteProject(id) {
  try {
    // const response = await fetch(`/api/projects/${id}`, {
    //   method: "DELETE",
    // })

    // if (!response.ok) {
    //   throw new Error("Error deleting project")
    // }
    
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
    const row = document.createElement("tr")
    const percentageClass = project.porcentaje20 >= 20 ? "badge-success" : "badge-danger"
    let gasto = JSON.parse(project.gasto)
    let miCoti = project.cotizacion
    // <td><div class="truncate" title="${project.conceptoCobrar}">${project.conceptoCobrar}</div></td>
    let contenido = `
            <td class="font-medium">${project.semana}</td>
            <td>${new Date(project.fechaCotizacion).toLocaleDateString('en-GB')}</td>
            <td>${project.cotizacion.toUpperCase()}</td>
            <td class="text-right font-mono">${project.cotizadora}</td>
            <td>${gasto.map((gasto) => gasto).join(", ")}</td>
            <td>${project.responsable}</td>
            <td>${project.region}</td>
            <td>${project.cliente}</td>
            <td>${project.planta}</td>
            <td class="text-right font-mono">${project.horas}</td>
            <td class="text-right font-mono">${formatCurrency(project.gastoCotizado)}</td>`
            let total, diferencia = null
            if(project.moneda !== 'MXN') {
              total = extraerMonto(project.cotizacion, project.moneda, {horas: project.horas, costo: project.costo, tipoCambio:project.tipoCambio})
              const conversion = project.
              diferencia =  total > 0 ? total - project.gastoCotizado : 0
            }else{
              total = extraerMonto(project.cotizacion, project.moneda, {horas: project.horas, costo: project.costo, tipoCambio:project.tipoCambio})
              diferencia =  total > 0 ? total - parseFloat(project.gastoCotizado) : 0
            }
            
            
           contenido +=  `
            <td class="text-right font-mono">${formatCurrency(diferencia)}</td>
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
    row.innerHTML = contenido
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
  state.filters.search   = document.getElementById("searchInput").value.trim()
  state.filters.region   = document.getElementById("regionFilter").value
  state.filters.cliente  = document.getElementById("clienteFilter").value.trim()
  state.filters.analista = document.getElementById("analistaFilter").value.trim()
  state.filters.semana   = document.getElementById("semanaFilter").value.trim()

  if(state.filters.semana || state.filters.search || state.filters.cliente || state.filters.analista || state.filters.region) {
   state.hayFiltros = true
  }else{
    state.hayFiltros = false
  }

  // Las fechas solo se actualizan al pulsar "Buscar"
  state.currentPage = 1
  document.getElementById("currentPage").textContent = 1
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
    fechaInicio: "",
    fechaFin: "",
  }

  document.getElementById("searchInput").value = ""
  document.getElementById("regionFilter").value = ""
  document.getElementById("clienteFilter").value = ""
  document.getElementById("analistaFilter").value = ""
  document.getElementById("semanaFilter").value = ""
  document.getElementById("fechaInicioFilter").value = ""
  document.getElementById("fechaFinFilter").value = ""
  document.getElementById("appendCliente").innerHTML = ""
  document.getElementById("appendAnalista").innerHTML = ""

  state.currentPage = 1
  document.getElementById("currentPage").textContent = 1
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
  state.projects = proyectos
  // Toggle Filters
  document.getElementById("toggleFiltersBtn").addEventListener("click", () => {
    const filtersContent = document.getElementById("filtersContent")
    const toggleText = document.getElementById("toggleFiltersText")
    const isVisible = filtersContent.style.display === "block"
    filtersContent.style.display = isVisible ? "none" : "block"
    toggleText.textContent = isVisible ? "Mostrar" : "Ocultar"
    if (!isVisible) {
      renderDatosFiltros()
      // agregarListeners()
    }
  })

  // Clear Filters
  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters)

  // Filter inputs (disparan fetch al backend)
  document.getElementById("searchInput").addEventListener("input", updateFilters)
  document.getElementById("regionFilter").addEventListener("change", updateFilters)
  document.getElementById("semanaFilter").addEventListener("input", updateFilters)

  // Cliente y analista: las sugerencias se generan sobre los datos ya cargados
  document.getElementById("clienteFilter").addEventListener("input", (e) => {
    filtrarInformacion("cliente", e.target.value)
    updateFilters()
  })
  document.getElementById("analistaFilter").addEventListener("input", (e) => {
    filtrarInformacion("cotizadora", e.target.value)
    updateFilters()
  })

  // Cerrar sugerencias al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#appendCliente") && e.target !== document.getElementById("clienteFilter")) {
      document.getElementById("appendCliente").innerHTML = ""
    }
    if (!e.target.closest("#appendAnalista") && e.target !== document.getElementById("analistaFilter")) {
      document.getElementById("appendAnalista").innerHTML = ""
    }
  })

  // Botón buscar por fechas
  document.getElementById("buscarFechasBtn").addEventListener("click", () => {
    const fechaInicio = document.getElementById("fechaInicioFilter").value
    const fechaFin    = document.getElementById("fechaFinFilter").value

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      showToast("Fechas inválidas", "La fecha de inicio no puede ser mayor que la fecha fin", "error")
      return
    }

    state.filters.fechaInicio = fechaInicio
    state.filters.fechaFin    = fechaFin
    state.currentPage = 1
    document.getElementById("currentPage").textContent = 1
    updateFilterBadge()
    fetchProjects()
  })

  // Pagination
  document.getElementById("prevPageBtn").addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--
      document.getElementById("currentPage").textContent = state.currentPage
      fetchProjects()
    }
  })

  document.getElementById("nextPageBtn").addEventListener("click", () => {
    const maxPage = Math.ceil(state.totalItems / state.itemsPerPage)
    if (state.currentPage < maxPage || maxPage === 0) {
      state.currentPage++
      document.getElementById("currentPage").textContent = state.currentPage
      fetchProjects()
    }
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

  // Carga inicial — ya no usa la variable EJS sino el endpoint
  fetchProjects()
})

function renderDatosFiltros() {
  // Extraer regiones únicas de los proyectos cargados
  const regiones = [...new Set(state.projects.map((p) => p.region).filter(Boolean))]
  let datos = '<option value="">Todas las regiones</option>'
  datos += regiones.map((r) => `<option value="${r}">${r}</option>`).join('')
  inputRegion.innerHTML = datos
}





function filtrarInformacion(campo, buscado) {
  let idDiv = null
  let inputEl = null
  switch (campo) {
    case 'cotizadora':
      idDiv   = 'appendAnalista'
      inputEl = inputAnalista
      break
    case 'cliente':
      idDiv   = 'appendCliente'
      inputEl = inputCliente
      break
  }

  const padre = document.getElementById(idDiv)
  padre.innerHTML = '' // Limpiar siempre antes de renderizar

  if (!buscado || buscado.length < 2) return

  const resultados = state.projects.filter((p) =>
    p[campo] && p[campo].toLowerCase().includes(buscado.toLowerCase())
  )
  const unicos = [...new Set(resultados.map((p) => p[campo]))]

  if (unicos.length === 0) return

  unicos.slice(0, 8).forEach((u) => {
    const ndiv = document.createElement('div')
    ndiv.className = 'suggestion-item'
    ndiv.textContent = u
    ndiv.addEventListener('click', () => {
      inputEl.value = u
      padre.innerHTML = ''
      updateFilters()
    })
    padre.appendChild(ndiv)
  })
}

// Ya no se usa para filtrar en frontend — los filtros se envían al backend.
// Se conserva como referencia para filtrado local de emergencia.
function filtrarProyectos() {
  const { search, region, cliente, analista, semana } = state.filters
  return state.projects.filter((p) => {
    if (region && p.region !== region) return false
    if (semana && String(p.semana) !== semana) return false
    if (cliente && !p.cliente?.toLowerCase().includes(cliente.toLowerCase())) return false
    if (analista && !p.cotizadora?.toLowerCase().includes(analista.toLowerCase())) return false
    if (search) {
      const term = search.toLowerCase()
      const matchable = [p.cotizacion, p.cliente, p.responsable, p.cotizadora, p.planta, p.region]
        .filter(Boolean).join(' ').toLowerCase()
      if (!matchable.includes(term)) return false
    }
    return true
  })
}

function extraerMonto(cotizacion, moneda, datos = null){
  const gasto = gastos.find((gasto) => gasto.orden === cotizacion.toUpperCase())

  if(moneda !== 'MXN') {
    const sumatoria = datos.horas * datos.costo
    const total = datos.tipoCambio * sumatoria
    return total
  }
  

  return gasto ? gasto.total : 0

}