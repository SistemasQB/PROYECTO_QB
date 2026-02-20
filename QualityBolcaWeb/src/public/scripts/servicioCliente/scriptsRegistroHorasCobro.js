
// Configuración
const STORAGE_KEY = "quotation_form_draft"
const SAVE_DELAY = 5000 
let listadoGastos = []

const inputHoras= document.getElementById("horas")
const inputCosto = document.getElementById("costo")

// Referencias del DOM
const form = document.getElementById("quotationForm")
const fields = {
  fecha: document.getElementById("fecha"),
  fechaCotizacion: document.getElementById("fechaCotizacion"),
  cliente: document.getElementById("cliente"),
  planta: document.getElementById("planta"),
  responsable: document.getElementById("responsable"),
  gasto: document.getElementById("gasto"),
  horas: document.getElementById("horas"),
  region: document.getElementById("region"),
  cotizacion: document.getElementById("cotizacion"),
  gastoCotizado: document.getElementById("gastoCotizado"),
  costo: document.getElementById("costo"),
  moneda: document.getElementById("moneda"),
}

const submitBtn = document.getElementById("submitBtn")
const cancelBtn = document.getElementById("cancelBtn")
const successAlert = document.getElementById("successAlert")
const successMessage = document.getElementById("successMessage")
const errorAlert = document.getElementById("errorAlert")
const errorMessage = document.getElementById("errorMessage")

// Estado
let saveTimeout
let errors = {}
let modoEdicion = false
let idEdicion = null

// ============================================================
// TABLA Y DATOS
// ============================================================
let registrosFiltrados = []

function inicializarTabla() {
  registrosFiltrados = [...registrosData]
  renderizarFiltroPlantas()
  renderizarTabla(registrosFiltrados)
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "-"
  const d = new Date(fechaStr)
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function parsearGastos(gastoStr) {
  if (!gastoStr) return []
  try {
    const parsed = typeof gastoStr === "string" ? JSON.parse(gastoStr) : gastoStr
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (e) {
    return [gastoStr]
  }
}

function renderizarTabla(datos) {
  const tbody = document.getElementById("tablaBody")
  const conteo = document.getElementById("conteoRegistros")
  conteo.textContent = `${datos.length} registro${datos.length !== 1 ? "s" : ""}`

  if (datos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="15" class="table-empty">No se encontraron registros</td></tr>`
    return
  }

  tbody.innerHTML = datos.map(r => {
    const gastos = parsearGastos(r.gasto)
    const estatusBadge = `<span class="badge badge-${(r.estatus || "").toLowerCase()}">${r.estatus || "-"}</span>`
    return `
      <tr>
        <td>${r.id}</td>
        <td>${formatearFecha(r.fecha)}</td>
        <td class="td-truncate" title="${r.cliente}">${r.cliente || "-"}</td>
        <td class="td-truncate" title="${r.planta}">${r.planta || "-"}</td>
        <td class="td-truncate" title="${r.responsable}">${r.responsable || "-"}</td>
        <td class="td-truncate" title="${r.cotizacion}">${r.cotizacion || "-"}</td>
        <td><span class="gastos-tags">${gastos.map(g => `<span class="tag">${g}</span>`).join("")}</span></td>
        <td>${r.horas || "-"}</td>
        <td>$${parseFloat(r.gastoCotizado || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
        <td>$${parseFloat(r.costo || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
        <td><span class="badge badge-moneda badge-${(r.moneda || "").toLowerCase()}">${r.moneda || "-"}</span></td>
        <td>${r.region || "-"}</td>
        <td>${r.semana || "-"}</td>
        <td>${estatusBadge}</td>
        <td>
          <div class="acciones">
            <button class="btn-accion btn-editar" title="Editar" onclick="abrirModalEditar(${r.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-accion btn-eliminar" title="Eliminar" onclick="eliminarRegistro(${r.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `
  }).join("")
}

function renderizarFiltroPlantas() {
  const filtroPlanta = document.getElementById("filtroPlanta")
  const plantasUnicas = [...new Set(registrosData.map(r => r.planta).filter(Boolean))]
  const opcionesActuales = filtroPlanta.value
  filtroPlanta.innerHTML = `<option value="">Todas</option>` +
    plantasUnicas.map(p => `<option value="${p}">${p}</option>`).join("")
  filtroPlanta.value = opcionesActuales
}

// ============================================================
// FILTROS
// ============================================================
function aplicarFiltros() {
  const texto = (document.getElementById("filtroTexto").value || "").toLowerCase().trim()
  const planta = document.getElementById("filtroPlanta").value
  const region = document.getElementById("filtroRegion").value
  const estatus = document.getElementById("filtroEstatus").value
  const semana = document.getElementById("filtroSemana").value

  registrosFiltrados = registrosData.filter(r => {
    if (texto) {
      const hayMatch = [r.cliente, r.responsable, r.cotizacion, r.cotizadora]
        .some(campo => (campo || "").toLowerCase().includes(texto))
      if (!hayMatch) return false
    }
    if (planta && r.planta !== planta) return false
    if (region && r.region !== region) return false
    if (estatus && r.estatus !== estatus) return false
    if (semana && parseInt(r.semana) !== parseInt(semana)) return false
    return true
  })

  renderizarTabla(registrosFiltrados)
}

function limpiarFiltros() {
  document.getElementById("filtroTexto").value = ""
  document.getElementById("filtroPlanta").value = ""
  document.getElementById("filtroRegion").value = ""
  document.getElementById("filtroEstatus").value = ""
  document.getElementById("filtroSemana").value = ""
  registrosFiltrados = [...registrosData]
  renderizarTabla(registrosFiltrados)
}

// ============================================================
// MODAL
// ============================================================
function abrirModalNuevo() {
  modoEdicion = false
  idEdicion = null
  document.getElementById("modalTitle").textContent = "Nuevo Registro"
  document.getElementById("modalDesc").textContent = "Complete todos los campos requeridos para registrar la cotización"
  document.getElementById("editId").value = ""
  limpiarFormulario()
  loadSavedData()
  document.getElementById("modalOverlay").classList.add("modal-visible")
  document.body.style.overflow = "hidden"
}

function abrirModalEditar(id) {
  const registro = registrosData.find(r => r.id === id)
  if (!registro) return

  modoEdicion = true
  idEdicion = id
  document.getElementById("modalTitle").textContent = "Editar Registro"
  document.getElementById("modalDesc").textContent = `Editando registro #${id}`
  document.getElementById("editId").value = id

  limpiarFormulario()

  // Poblar campos con datos del registro
  const toISODate = (fechaStr) => {
    if (!fechaStr) return ""
    return new Date(fechaStr).toISOString().split("T")[0]
  }

  fields.fecha.value = toISODate(registro.fecha)
  fields.fechaCotizacion.value = toISODate(registro.fechaCotizacion)
  fields.cliente.value = registro.cliente || ""
  fields.responsable.value = registro.responsable || ""
  fields.horas.value = registro.horas || ""
  fields.region.value = registro.region || ""
  fields.cotizacion.value = registro.cotizacion || ""
  fields.gastoCotizado.value = registro.gastoCotizado || ""
  fields.costo.value = registro.costo || ""
  fields.moneda.value = registro.moneda || ""

  // Poblar planta (esperar a que esté renderizada)
  setTimeout(() => { fields.planta.value = registro.planta || "" }, 50)

  // Poblar gastos
  listadoGastos = parsearGastos(registro.gasto)
  actualizarListadoGastosUI()

  document.getElementById("modalOverlay").classList.add("modal-visible")
  document.body.style.overflow = "hidden"
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("modal-visible")
  document.body.style.overflow = ""
  closeAlert("successAlert")
  closeAlert("errorAlert")
}

function cerrarModalClickOutside(e) {
  if (e.target === document.getElementById("modalOverlay")) {
    cerrarModal()
  }
}

function limpiarFormulario() {
  form.reset()
  listadoGastos = []
  actualizarListadoGastosUI()
  errors = {}
  Object.keys(fields).forEach(f => clearFieldError(f))
  closeAlert("successAlert")
  closeAlert("errorAlert")
}

function actualizarListadoGastosUI() {
  const et = document.getElementById("listadoGastos")
  et.innerText = listadoGastos.join(", ")
}

// ============================================================
// ELIMINAR
// ============================================================
async function eliminarRegistro(id) {
  const confirmacion = await Swal.fire({
    title: "¿Eliminar registro?",
    text: `Se eliminará permanentemente el registro #${id}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#7f8c8d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  })

  if (!confirmacion.isConfirmed) return

  try {
    const formData = { tipo: "delete", id, _csrf: tok }
    await envioJson("crudHorasCobro", formData, "formularioHorasCobro")

    // Actualizar datos locales
    const idx = registrosData.findIndex(r => r.id === id)
    if (idx !== -1) registrosData.splice(idx, 1)
    aplicarFiltros()

    Swal.fire({ title: "Eliminado", text: "El registro fue eliminado.", icon: "success", timer: 2000, showConfirmButton: false })
  } catch (error) {
    Swal.fire({ title: "Error", text: "No se pudo eliminar el registro.", icon: "error" })
  }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  inicializarTabla()
  renderPlantas()
  attachEventListeners()
  fields.gasto.addEventListener("change", (e) => cambio(e))
  fields.horas.addEventListener("change", (e) => calculoCosto(e))
  fields.costo.addEventListener("change", (e) => calculoCosto(e))

})

function cambio(e) {
  let valor = e.target.value
  let et = document.getElementById("listadoGastos")
  if (!valor) return
  if (listadoGastos.includes(valor)) {
    listadoGastos.splice(listadoGastos.indexOf(valor), 1)
    et.innerText = listadoGastos.map((gasto) => gasto).join(", ")
    return
  }
  listadoGastos.push(valor)
  et.innerText = listadoGastos.map((gasto) => gasto).join(", ")
}

// Cargar datos guardados del localStorage
function loadSavedData() {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      Object.entries(data).forEach(([key, value]) => {
        if (fields[key]) {
          fields[key].value = value
        }
      })
    } catch (e) {
      console.error("Error al cargar datos guardados:", e)
    }
  }
}

// Adjuntar listeners de eventos
function attachEventListeners() {
  Object.values(fields).forEach((field) => {
    field.addEventListener("input", handleFieldChange)
    field.addEventListener("change", handleFieldChange)
  })
  form.addEventListener("submit", handleSubmit)
  cancelBtn.addEventListener("click", handleCancel)
}

// Manejar cambios en campos
function handleFieldChange(e) {
  const fieldName = e.target.name
  if (errors[fieldName]) {
    delete errors[fieldName]
    clearFieldError(fieldName)
  }
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    if (!modoEdicion) saveFormData()
  }, SAVE_DELAY)
}

// Guardar datos del formulario
function saveFormData() {
  const formData = {}
  Object.entries(fields).forEach(([key, field]) => {
    formData[key] = field.value
  })
  if (Object.values(formData).some((value) => value)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    showSuccessAlert("✓ Progreso guardado automáticamente")
  }
}

// Validar formulario
function validateForm() {
  errors = {}

  if (!fields.fecha.value.trim()) errors.fecha = "La fecha es requerida"
  if (!fields.fechaCotizacion.value.trim()) errors.fechaCotizacion = "La fecha de cotización es requerida"
  if (!fields.cliente.value.trim()) errors.cliente = "El nombre del cliente es requerido"
  if (!fields.planta.value) errors.planta = "Debe seleccionar una planta"
  if (!fields.responsable.value.trim()) errors.responsable = "El responsable es requerido"
  if (listadoGastos.length === 0) errors.gasto = "Debe seleccionar al menos un tipo de gasto"
  if (!fields.horas.value || Number.parseFloat(fields.horas.value) <= 0) errors.horas = "Las horas deben ser mayor a 0"
  if (!fields.region.value) errors.region = "La region es requerida"
  if (!fields.cotizacion.value) errors.cotizacion = "La cotizacion es requerida"
  if (!fields.gastoCotizado.value || Number.parseFloat(fields.gastoCotizado.value) <= 0) errors.gastoCotizado = "El gasto cotizado es requerido"
  if (!fields.costo.value || Number.parseFloat(fields.costo.value) <= 0) errors.costo = "El costo es requerido y debe ser mayor a 0"
  if (!fields.moneda.value) errors.moneda = "Debe seleccionar una moneda"

  Object.entries(errors).forEach(([field, message]) => {
    showFieldError(field, message)
  })

  return Object.keys(errors).length === 0
}

// Mostrar error en campo
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`error-${fieldName}`)
  const field = fields[fieldName]
  if (errorElement) errorElement.textContent = message
  if (field) field.classList.add("error")
}

// Limpiar error de campo
function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`error-${fieldName}`)
  const field = fields[fieldName]
  if (errorElement) errorElement.textContent = ""
  if (field) field.classList.remove("error")
}

// Manejar envío del formulario
async function handleSubmit(e) {
  e.preventDefault()
  if (!validateForm()) return

  submitBtn.disabled = true
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Enviando..."

  try {
    const camposFormulario = { ...fields }
    delete camposFormulario.gasto

    const formData = {}
    Object.entries(camposFormulario).forEach(([key, field]) => {
      formData[key] = field.value
    })
    formData.gasto = listadoGastos
    formData._csrf = tok

    if (modoEdicion && idEdicion) {
      // UPDATE
      formData.tipo = "update"
      formData.id = idEdicion
      await envioJson("crudHorasCobro", formData, "formularioHorasCobro")

      // Actualizar registro en datos locales
      const idx = registrosData.findIndex(r => r.id === idEdicion)
      if (idx !== -1) {
        registrosData[idx] = {
          ...registrosData[idx],
          ...formData,
          gasto: JSON.stringify(listadoGastos)
        }
      }
    } else {
      // INSERT
      formData.tipo = "insert"
      localStorage.removeItem(STORAGE_KEY)
      await envioJson("crudHorasCobro", formData, "formularioHorasCobro")
    }

    aplicarFiltros()
    cerrarModal()

  } catch (error) {
    showErrorAlert("Error al enviar el formulario. Intente nuevamente.")
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = originalText
  }
}

// Manejar cancelación
function handleCancel() {
  const hasData = Object.values(fields).some((field) => field.value)
  if (hasData && !confirm("¿Está seguro? Se perderán los datos no guardados.")) return
  localStorage.removeItem(STORAGE_KEY)
  cerrarModal()
}

// Mostrar alerta de éxito
function showSuccessAlert(message) {
  successMessage.textContent = message
  successAlert.style.display = "flex"
}

// Mostrar alerta de error
function showErrorAlert(message) {
  errorMessage.textContent = message
  errorAlert.style.display = "flex"
}

// Cerrar alerta
function closeAlert(alertId) {
  document.getElementById(alertId).style.display = "none"
}

function renderPlantas() {
  let inputPlantas = document.getElementById("planta")
  let html = '<option value="">Seleccionar planta</option>'
  plantas.forEach(planta => {
    html += `<option value="${planta.planta}">${planta.planta}</option>`
  })
  inputPlantas.innerHTML = html
}

function calculoCosto(e){

  let horas = inputHoras.value
  let costo = inputCosto.value
  let total = horas*costo
  
  document.getElementById("gastoCotizado").value = total.toFixed(2) || 0
}