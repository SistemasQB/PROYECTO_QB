// Estado de la aplicación
let auditorias = []
let auditoresCount = 1
let auditoriaReprogramarId = null
let auditorciaCompletarId = null

// Referencias del DOM
const auditForm = document.getElementById("auditForm")
const auditoresContainer = document.getElementById("auditoresContainer")
const addAuditorBtn = document.getElementById("addAuditor")
const clearBtn = document.getElementById("clearBtn")
const tipoAuditoriaSelect = document.getElementById("tipoAuditoria")
const campoCondicionalGroup = document.getElementById("campoCondicionalGroup")
const campoCondicionalLabel = document.getElementById("campoCondicionalLabel")
const campoCondicional = document.getElementById("campoCondicional")
const auditGrid = document.getElementById("auditGrid")
const auditCount = document.getElementById("auditCount")
const searchInput = document.getElementById("searchInput")
const filterTipo = document.getElementById("filterTipo")
const filterMes = document.getElementById("filterMes")
const clearFiltersBtn = document.getElementById("clearFilters")

const reprogramarModal = document.getElementById("reprogramarModal")
const closeModalBtn = document.getElementById("closeModal")
const cerrarModalCompletarBtn = document.getElementById("cerrarDocumentosModalBtn")
const cancelReprogramarBtn = document.getElementById("cancelReprogramar")
const confirmarReprogramarBtn = document.getElementById("confirmarReprogramar")
const nuevoMesSelect = document.getElementById("nuevoMes")
const btnEnvio = document.getElementById("registerBtn")
const filtroAnio = document.getElementById("filterAnio")

const completarModal = document.getElementById("completarModal")
const confirmarCompletarBtn = document.getElementById("confirmarCompletar")
const cancelarCompletarBtn = document.getElementById("cancelCompletar")
const btnCerrarModalCompletar = document.getElementById("cerrarDocumentosModal")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  deserializarAuditorias()
  inicializarAuditores()
  // cargarAuditorias()
  configurarEventListeners()
  renderizarAuditorias()
})

// Configurar event listeners
function configurarEventListeners() {
  btnEnvio.addEventListener("click", handleSubmit)
  clearBtn.addEventListener("click", limpiarFormulario)
  addAuditorBtn.addEventListener("click", agregarAuditor)
  tipoAuditoriaSelect.addEventListener("change", handleTipoChange)
  searchInput.addEventListener("input", filtrarAuditorias)
  filterTipo.addEventListener("change", filtrarAuditorias)
  filterMes.addEventListener("change", filtrarAuditorias)
  filtroAnio.addEventListener("change", filtrarAuditorias)
  clearFiltersBtn.addEventListener("click", limpiarFiltros)
  closeModalBtn.addEventListener("click", cerrarModal)
  cerrarModalCompletarBtn.addEventListener("click", cerrarModalCompletado)
  cancelReprogramarBtn.addEventListener("click", cerrarModal)
  cancelarCompletarBtn.addEventListener("click", cerrarModalCompletado)
  confirmarReprogramarBtn.addEventListener("click", confirmarReprogramacion)

  // Cerrar modal al hacer clic fuera de él
  reprogramarModal.addEventListener("click", (e) => {
    if (e.target === reprogramarModal) {
      cerrarModal()
    }
  })

  completarModal.addEventListener("click", (e) => {
    if (e.target === completarModal) {
      cerrarModalCompletado()
    }
  })
}

// Inicializar primer auditor
function inicializarAuditores() {
  auditoresCount = 0
  agregarAuditor()
}

// Agregar nuevo campo de auditor
function agregarAuditor() {
  if (auditoresCount >= 5) {
    return
  }

  auditoresCount++

  const auditorDiv = document.createElement("div")
  auditorDiv.className = "auditor-input-group"
  auditorDiv.dataset.auditorId = auditoresCount

  const input = document.createElement("input")
  input.type = "text"
  input.className = "form-input auditor-input"
  input.placeholder = `Auditor ${auditoresCount}`
  input.required = auditoresCount === 1
  input.dataset.auditorNumber = auditoresCount

  auditorDiv.appendChild(input)

  if (auditoresCount > 1) {
    const removeBtn = document.createElement("button")
    removeBtn.type = "button"
    removeBtn.className = "btn-remove-auditor"
    removeBtn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `
    removeBtn.addEventListener("click", () => eliminarAuditor(auditoresCount))
    auditorDiv.appendChild(removeBtn)
  }

  auditoresContainer.appendChild(auditorDiv)
  actualizarBotonAgregarAuditor()
}

// Eliminar campo de auditor
function eliminarAuditor(id) {
  const auditorDiv = document.querySelector(`[data-auditor-id="${id}"]`)
  if (auditorDiv) {
    auditorDiv.remove()
    auditoresCount--
    actualizarBotonAgregarAuditor()
  }
}

// Actualizar estado del botón agregar auditor
function actualizarBotonAgregarAuditor() {
  addAuditorBtn.disabled = auditoresCount >= 5

  if (auditoresCount >= 5) {
    addAuditorBtn.textContent = "Máximo de auditores alcanzado"
  } else {
    addAuditorBtn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Agregar Auditor
        `
  }
}

// Manejar cambio de tipo de auditoría
function handleTipoChange(e) {
  const tipo = e.target.value
  
  if (tipo === "Proceso"){
    campoCondicionalGroup.style.display = "flex"
    campoCondicionalLabel.innerHTML = 'Planta <span class="required">*</span>'
    campoCondicional.placeholder = "Ingrese la planta"
    campoCondicional.required = true
  } else if (tipo === "Sistema") {
    campoCondicionalGroup.style.display = "flex"
    campoCondicionalLabel.innerHTML = 'Procesos/Dpto <span class="required">*</span>'
    campoCondicional.placeholder = "Ingrese procesos o departamento"
    campoCondicional.required = true
  } else {
    campoCondicionalGroup.style.display = "none"
    campoCondicional.required = false
  }

  limpiarError("campoCondicional")
}

// Validar formulario
function validarFormulario() {
  let esValido = true

  // Limpiar errores previos
  limpiarTodosLosErrores()

  // Validar auditores
  const auditoresInputs = document.querySelectorAll(".auditor-input")
  const auditoresValores = Array.from(auditoresInputs)
    .map((input) => input.value.trim())
    .filter((value) => value !== "")

  if (auditoresValores.length === 0) {
    mostrarError("auditores", "Debe ingresar al menos un auditor")
    esValido = false
  }

  // Validar mes
  const mes = document.getElementById("mes").value
  if (!mes) {
    mostrarError("mes", "Seleccione un mes")
    esValido = false
  }

  // Validar año
  const anio = document.getElementById("anio").value
  if (!anio) {
    mostrarError("anio", "Ingrese el año")
    esValido = false
  } else if (anio < 2020 || anio > 2100) {
    mostrarError("anio", "Ingrese un año válido entre 2020 y 2100")
    esValido = false
  }

  // Validar tipo de auditoría
  const tipoAuditoria = document.getElementById("tipoAuditoria").value
  if (!tipoAuditoria) {
    mostrarError("tipoAuditoria", "Seleccione el tipo de auditoría")
    esValido = false
  }

  // Validar campo condicional
  if (tipoAuditoria && campoCondicional.required) {
    const valorCondicional = campoCondicional.value.trim()
    if (!valorCondicional) {
      const nombreCampo = tipoAuditoria === "Proceso" ? "la planta" : "los procesos/departamento"
      mostrarError("campoCondicional", `Ingrese ${nombreCampo}`)
      esValido = false
    }
  }

  // Validar auditado
  const auditado = document.getElementById("auditado").value.trim()
  if (!auditado) {
    mostrarError("auditado", "Ingrese el nombre del auditado")
    esValido = false
  }

  return esValido
}

// Mostrar mensaje de error
function mostrarError(campo, mensaje) {
  const errorElement = document.getElementById(`${campo}Error`)
  const inputElement = document.getElementById(campo)

  if (errorElement) {
    errorElement.textContent = mensaje
    errorElement.classList.add("show")
  }

  if (inputElement) {
    inputElement.classList.add("error")
  }
}

// Limpiar error específico
function limpiarError(campo) {
  const errorElement = document.getElementById(`${campo}Error`)
  const inputElement = document.getElementById(campo)

  if (errorElement) {
    errorElement.textContent = ""
    errorElement.classList.remove("show")
  }

  if (inputElement) {
    inputElement.classList.remove("error")
  }
}

// Limpiar todos los errores
function limpiarTodosLosErrores() {
  const errores = document.querySelectorAll(".error-message")
  errores.forEach((error) => {
    error.textContent = ""
    error.classList.remove("show")
  })

  const inputs = document.querySelectorAll(".form-input, .form-select")
  inputs.forEach((input) => {
    input.classList.remove("error")
  })
}

// Manejar envío del formulario
async function handleSubmit(e) {
  // e.preventDefault()

  if (!validarFormulario()) {
    return
  }

  // Recopilar datos del formulario
  const auditoresInputs = document.querySelectorAll(".auditor-input")
  const auditores = Array.from(auditoresInputs)
    .map((input) => input.value.trim())
    .filter((value) => value !== "")

  const mes = document.getElementById("mes").value
  const anio = document.getElementById("anio").value
  const tipoAuditoria = document.getElementById("tipoAuditoria").value
  const auditado = document.getElementById("auditado").value.trim()
  const campoCondicionalValor = campoCondicional.value.trim()

  const nuevaAuditoria = {
    auditores: auditores,
    mesProgramado: mes,
    anio: parseInt(anio),
    lugar: campoCondicionalValor,
    tipoAuditoria: tipoAuditoria,
    auditado: auditado,
    estatus: "programada",
    mesOriginal: mes,
    mesReprogramado: mes,
    _csrf: tok,
    tipo: "insert"
    
  }
  
  envioJson('crudAuditorias', nuevaAuditoria, 'agregarAuditoria')
  
  // auditorias.push(nuevaAuditoria)
  // guardarAuditorias()
  // renderizarAuditorias()
  // limpiarFormulario()

  // Scroll hacia las auditorías
  // document.querySelector(".list-section").scrollIntoView({ behavior: "smooth" })
}

// Función para enviar datos al backend (comentadas para futuro uso)
/*
async function enviarAlBackend(auditoria) {
    try {
        const response = await fetch('/api/auditorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(auditoria)
        });
        
        if (!response.ok) {
            throw new Error('Error al enviar la auditoría');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al registrar la auditoría. Por favor, intente nuevamente.');
        throw error;
    }
}
*/

// Limpiar formulario
function limpiarFormulario() {
  auditForm.reset()

  // Resetear auditores
  auditoresContainer.innerHTML = ""
  inicializarAuditores()

  // Ocultar campo condicional
  campoCondicionalGroup.style.display = "none"
  campoCondicional.required = false

  // Limpiar errores
  limpiarTodosLosErrores()
}

// Cargar auditorías desde localStorage
function cargarAuditorias() {
  const auditoriasGuardadas = localStorage.getItem("auditorias")
  if (auditoriasGuardadas) {
    auditorias = JSON.parse(auditoriasGuardadas)
  }
}

// Guardar auditorías en localStorage
function guardarAuditorias() {
  localStorage.setItem("auditorias", JSON.stringify(auditorias))
}

// Eliminar auditoría
function eliminarAuditoria(id) {
  if (confirm("¿Está seguro de que desea eliminar esta auditoría?")) {
    auditorias = auditorias.filter((auditoria) => auditoria.id !== id)
    guardarAuditorias()
    renderizarAuditorias()
  }
}

// Filtrar auditorías
function filtrarAuditorias() {
  const busqueda = searchInput.value.toLowerCase()
  const tipoFiltro = filterTipo.value
  const mesFiltro = filterMes.value
  const anioFiltro = filtroAnio.value

  const auditoriasFiltradas = misAuditorias.filter((auditoria) => {
    
    const coincideBusqueda =
      auditoria.auditores.some((auditor) => auditor.toLowerCase().includes(busqueda)) ||
      auditoria.auditado.toLowerCase().includes(busqueda) ||
      auditoria.lugar.toLowerCase().includes(busqueda) ||
      auditoria.anio.toString().includes(busqueda)
    const coincideTipo = !tipoFiltro || auditoria.tipoAuditoria === tipoFiltro
    const coincideMes = !mesFiltro || auditoria.mesReprogramado === mesFiltro
    const coincideAnio = !anioFiltro || auditoria.anio === parseInt(anioFiltro)

    return coincideBusqueda && coincideTipo && coincideMes && coincideAnio
  })

  renderizarAuditorias(auditoriasFiltradas)
}

// Limpiar filtros
function limpiarFiltros() {
  searchInput.value = ""
  filterTipo.value = ""
  filterMes.value = ""
  renderizarAuditorias()
}

function abrirModalReprogramar(id) {
  auditoriaReprogramarId = id
  nuevoMesSelect.value = ""
  reprogramarModal.classList.add("show")
  document.body.style.overflow = "hidden"
}
function abrirModalCompletar(id) {
  auditorciaCompletarId = id
  
  completarModal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function cerrarModal() {
  reprogramarModal.classList.remove("show")
  auditoriaReprogramarId = null
  nuevoMesSelect.value = ""
  document.body.style.overflow = "auto"
}

function cerrarModalCompletado(){
  completarModal.classList.remove("show")
  auditorciaCompletarId = null
  document.body.style.overflow = "auto"
}

function confirmarReprogramacion() {
  const nuevoMes = nuevoMesSelect.value
  if (!nuevoMes) {
    alert("Por favor seleccione un mes")
    return
  }

  const auditoria = misAuditorias.find((a) => a.id === auditoriaReprogramarId)

  if (!auditoria) {
    alert("Auditoría no encontrada")
    return
  }
  let datos = {
    tipo: "update",
    id: auditoriaReprogramarId,
    mesReprogramado: nuevoMes,
    estatus: "reprogramada",
    _csrf: tok
  }
  
  envioJson('crudAuditorias', datos, 'agregarAuditoria')

  
}

async function marcarComoRealizada(id) {
  if (confirm("¿Marcar esta auditoría como realizada?")) {
    const auditoria = auditorias.find((a) => a.id === id)

    if (!auditoria) {
      return
    }

    auditoria.estatus = "realizada"

    // Aquí puedes enviar los datos al backend
    // await actualizarEstatusEnBackend(id, "realizada");

    guardarAuditorias()
    renderizarAuditorias()
  }
}

// Funciones para enviar al backend (comentadas para futuro uso)
/*
async function enviarReprogramacionAlBackend(auditoriaId, nuevoMes) {
    try {
        const response = await fetch(`/api/auditorias/${auditoriaId}/reprogramar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nuevoMes })
        });
        
        if (!response.ok) {
            throw new Error('Error al reprogramar la auditoría');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al reprogramar la auditoría.');
        throw error;
    }
}

async function actualizarEstatusEnBackend(auditoriaId, estatus) {
    try {
        const response = await fetch(`/api/auditorias/${auditoriaId}/estatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estatus })
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el estatus');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el estatus.');
        throw error;
    }
}
*/

function renderizarAuditorias(auditoriasAMostrar = misAuditorias) {
  // Actualizar contador
  auditCount.textContent = `${auditoriasAMostrar.length} auditoría${auditoriasAMostrar.length !== 1 ? "s" : ""}`

  if (auditoriasAMostrar.length === 0) {
    auditGrid.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p class="empty-text">No hay auditorías registradas</p>
                <p class="empty-subtext">Comienza agregando tu primera auditoría</p>
            </div>
        `
    return
  }

  auditGrid.innerHTML = auditoriasAMostrar
    .map((auditoria) => {
      const badgeClass = auditoria.tipoAuditoria === "Proceso" ? "badge-proceso" : "badge-sistema"
      const campoLabel = auditoria.tipoAuditoria === "Proceso" ? "Planta" : "Procesos/Dpto"
      const estatus = auditoria.estatus || "programada"

      // Iconos según el estatus
      let statusIcon = ""
      let statusText = ""

      switch (estatus) {
        case "programada":
          statusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
          </svg>`
          statusText = "Programada"
          break
        case "realizada":
          statusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>`
          statusText = "Realizada"
          break
        case "reprogramada":
          statusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>`
          statusText = "Reprogramada"
          break
      }

      // Información de reprogramación
      let reprogramacionHTML = ""
      if (estatus === "reprogramada" && auditoria.mesOriginal) {
        reprogramacionHTML = `
          <div class="reprogramacion-info">
            <div class="reprogramacion-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="reprogramacion-label">Mes Original:</span>
              <span class="reprogramacion-value">${auditoria.mesOriginal} ${auditoria.anio}</span>
            </div>
            <div class="reprogramacion-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span class="reprogramacion-label">Reprogramada para:</span>
              <span class="reprogramacion-value">${auditoria.mesReprogramado} ${auditoria.anio}</span>
            </div>
          </div>
        `
      }

      // Botones según el estatus
      let actionButtons = ""
      if (estatus === "programada" || estatus === "reprogramada") {
        actionButtons = `
          <div class="card-actions">
            <button class="btn-action btn-reprogramar" onclick="abrirModalReprogramar(${auditoria.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Reprogramar
            </button>
            <button class="btn-action btn-marcar-realizada" onclick="abrirModalCompletar(${auditoria.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Realizada
            </button>
            <button class="btn-delete" onclick="eliminarAuditoria(${auditoria.id})">
              Eliminar
            </button>
          </div>
        `
      } else {
        actionButtons = `
          <button class="btn-delete" onclick="eliminarAuditoria(${auditoria.id})">
            Eliminar
          </button>
        `
      }

      return `
            <div class="audit-card status-${estatus}">
                <div class="card-header">
                    <h3 class="card-title">${auditoria.auditado}</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                        <span class="card-badge ${badgeClass}">${auditoria.tipoAuditoria}</span>
                        <span class="status-badge status-${estatus}">
                            ${statusIcon}
                            ${statusText}
                        </span>
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="card-field">
                        <span class="field-label">Auditores</span>
                        <div class="auditores-list">
                            ${auditoria.auditores
                              .map((auditor) => `<span class="auditor-tag">${auditor}</span>`)
                              .join("")}
                        </div>
                    </div>
                    
                    <div class="card-field">
                        <span class="field-label">${campoLabel}</span>
                        <span class="field-value">${auditoria.lugar}</span>
                    </div>
                    
                    <div class="card-field">
                        <span class="field-label">Fecha ${estatus === "reprogramada" ? "Reprogramada" : "Programada"}</span>
                        <span class="field-value">${auditoria.mesProgramado} ${auditoria.anio}</span>
                    </div>
                    ${reprogramacionHTML}
                </div>
                <div class="card-footer">
                    ${actionButtons}
                </div>
            </div>
        `
    })
    .join("")
}

function deserializarAuditorias(){
  let audits = misAuditorias.map((auditoria) => {
    try {
        auditoria.auditores = JSON.parse(auditoria.auditores)
    } catch (error) {
      
    }
    return auditoria
  })
  misAuditorias = audits
  return 
}