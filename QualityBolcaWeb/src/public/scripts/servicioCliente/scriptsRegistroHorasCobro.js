// Configuración
const STORAGE_KEY = "quotation_form_draft"
const SAVE_DELAY = 1000 // 1 segundo

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

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  loadSavedData()
  attachEventListeners()
})

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
  // Listeners para cambios en inputs
  Object.values(fields).forEach((field) => {
    field.addEventListener("input", handleFieldChange)
    field.addEventListener("change", handleFieldChange)
  })

  // Listeners para botones
  form.addEventListener("submit", handleSubmit)
  cancelBtn.addEventListener("click", handleCancel)
}

// Manejar cambios en campos
function handleFieldChange(e) {
  const fieldName = e.target.name

  // Limpiar error del campo
  if (errors[fieldName]) {
    delete errors[fieldName]
    clearFieldError(fieldName)
  }

  // Guardar automáticamente con delay
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveFormData()
  }, SAVE_DELAY)
}

// Guardar datos del formulario
function saveFormData() {
  const formData = {}
  Object.entries(fields).forEach(([key, field]) => {
    formData[key] = field.value
  })

  // Solo guardar si hay al menos un campo con datos
  if (Object.values(formData).some((value) => value)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    showSuccessAlert("✓ Progreso guardado automáticamente")
  }
}

// Validar formulario
function validateForm() {
  errors = {}

  if (!fields.fecha.value.trim()) {
    errors.fecha = "La fecha es requerida"
  }
  if (!fields.fechaCotizacion.value.trim()) {
    errors.fechaCotizacion = "La fecha de cotización es requerida"
  }
  if (!fields.cliente.value.trim()) {
    errors.cliente = "El nombre del cliente es requerido"
  }
  if (!fields.planta.value) {
    errors.planta = "Debe seleccionar una planta"
  }
  if (!fields.responsable.value.trim()) {
    errors.responsable = "El responsable es requerido"
  }
  if (!fields.gasto.value) {
    errors.gasto = "Debe seleccionar un tipo de gasto"
  }
  if (!fields.horas.value || Number.parseFloat(fields.horas.value) <= 0) {
    errors.horas = "Las horas deben ser mayor a 0"
  }

  // Mostrar errores en el formulario
  Object.entries(errors).forEach(([field, message]) => {
    showFieldError(field, message)
  })

  return Object.keys(errors).length === 0
}

// Mostrar error en campo
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`error-${fieldName}`)
  const field = fields[fieldName]

  if (errorElement) {
    errorElement.textContent = message
  }
  if (field) {
    field.classList.add("error")
  }
}

// Limpiar error de campo
function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`error-${fieldName}`)
  const field = fields[fieldName]

  if (errorElement) {
    errorElement.textContent = ""
  }
  if (field) {
    field.classList.remove("error")
  }
}

// Manejar envío del formulario
async function handleSubmit(e) {
  e.preventDefault()

  // Validar formulario
  if (!validateForm()) {
    return
  }

  // Deshabilitar botón y mostrar estado de carga
  submitBtn.disabled = true
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Enviando..."

  try {
    // Obtener datos del formulario
    const formData = {}
    Object.entries(fields).forEach(([key, field]) => {
      formData[key] = field.value
    })

    formData.tipo = "insert"
    formData._csrf = tok
    console.log("Datos enviados:", formData)

     await envioJson("crudHorasCobro", formData,"formularioHorasCobro")

    // // Limpiar localStorage después de envío exitoso
    // localStorage.removeItem(STORAGE_KEY)

    // // Limpiar formulario
    // form.reset()

    // // Reestablecer estado después de 4 segundos
    
  } catch (error) {
    console.error("Error al enviar:", error)
    showErrorAlert("Error al enviar el formulario. Intente nuevamente.")
  } finally {
    // Reestablecer botón
    submitBtn.disabled = false
    submitBtn.textContent = originalText
  }
}

// Manejar cancelación
function handleCancel() {
  // Verificar si hay datos sin guardar
  const hasData = Object.values(fields).some((field) => field.value)

  if (hasData && !confirm("¿Está seguro? Se perderán los datos no guardados.")) {
    return
  }

  // Limpiar localStorage
  localStorage.removeItem(STORAGE_KEY)

  // Limpiar formulario y errores
  form.reset()
  Object.keys(errors).forEach((field) => clearFieldError(field))
  errors = {}
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
