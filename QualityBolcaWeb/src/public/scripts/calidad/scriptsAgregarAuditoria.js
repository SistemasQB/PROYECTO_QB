// ===== CONSTANTES =====
const STORAGE_KEY = "auditFormDraft"
const AUDITS_KEY = "auditsRegistry"
const AUTO_SAVE_INTERVAL = 5000 // 5 segundos

// ===== ELEMENTOS DEL DOM =====
const form = document.getElementById("auditForm")
const statusMessage = document.getElementById("statusMessage")
const lastSavedEl = document.getElementById("lastSaved")
const auditsList = document.getElementById("auditsList")
const auditCount = document.getElementById("auditCount")

// ===== CAMPOS DEL FORMULARIO =====
const fields = {
  auditores: document.getElementById("auditores"),
  mes: document.getElementById("mes"),
  anio: document.getElementById("anio"),
  tipoAuditoria: document.getElementById("tipoAuditoria"),
  proceso: document.getElementById("proceso"),
  auditado: document.getElementById("auditado"),
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  loadFormDraft()
  loadAuditsRegistry()
  setupEventListeners()
  updateLastSaved()
})

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Auto-guardado en tiempo real
  Object.values(fields).forEach((field) => {
    field.addEventListener("change", () => {
      saveFormDraft()
      updateLastSaved()
    })
  })

  // Envío del formulario
  form.addEventListener("submit", handleSubmit)

  // Limpiar formulario
  form.addEventListener("reset", () => {
    setTimeout(() => {
      clearFormDraft()
      updateLastSaved()
      clearStatusMessage()
      renderAuditsRegistry()
    }, 0)
  })
}

// ===== VALIDACIÓN DEL FORMULARIO =====
function validateForm() {
  console.log("[v0] Validando formulario")
  let isValid = true

  // Limpiar errores previos
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("error")
    const errorMsg = group.querySelector(".error-message")
    if (errorMsg) errorMsg.textContent = ""
  })

  // Validar cada campo
  Object.entries(fields).forEach(([key, field]) => {
    if (!field.value.trim()) {
      isValid = false
      const group = field.closest(".form-group")
      group.classList.add("error")
      const errorMsg = group.querySelector(".error-message")
      if (errorMsg) errorMsg.textContent = "Este campo es requerido"
      console.log("[v0] Campo vacío:", key)
    }
  })

  return isValid
}

// ===== MANEJO DEL ENVÍO =====
function handleSubmit(e) {
  e.preventDefault()
  console.log("[v0] Enviando formulario")

  if (!validateForm()) {
    showStatusMessage("Por favor completa todos los campos requeridos", "error")
    console.log("[v0] Validación fallida")
    return
  }

  // Crear objeto de auditoría
  const auditData = {
    id: Date.now(),
    auditores: fields.auditores.value,
    mes: fields.mes.value,
    anio: fields.anio.value,
    tipoAuditoria: fields.tipoAuditoria.value,
    proceso: fields.proceso.value,
    auditado: fields.auditado.value,
    fechaRegistro: new Date().toISOString(),
    estado: "Registrada",
  }

  // Guardar auditoría
  saveAudit(auditData)
  console.log("[v0] Auditoría guardada:", auditData)

  // Mostrar éxito
  showStatusMessage("Auditoría registrada correctamente", "success")

  // Limpiar formulario y borrador
  form.reset()
  clearFormDraft()
  updateLastSaved()

  // Actualizar lista
  renderAuditsRegistry()

  // Limpiar mensaje después de 3 segundos
  setTimeout(clearStatusMessage, 3000)
}

// ===== GUARDADO DE BORRADORES =====
function saveFormDraft() {
  const draft = {
    auditores: fields.auditores.value,
    mes: fields.mes.value,
    anio: fields.anio.value,
    tipoAuditoria: fields.tipoAuditoria.value,
    proceso: fields.proceso.value,
    auditado: fields.auditado.value,
    savedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  console.log("[v0] Borrador guardado")
}

function loadFormDraft() {
  const draft = localStorage.getItem(STORAGE_KEY)
  if (draft) {
    try {
      const data = JSON.parse(draft)
      fields.auditores.value = data.auditores || ""
      fields.mes.value = data.mes || ""
      fields.anio.value = data.anio || ""
      fields.tipoAuditoria.value = data.tipoAuditoria || ""
      fields.proceso.value = data.proceso || ""
      fields.auditado.value = data.auditado || ""
      console.log("[v0] Borrador cargado")
    } catch (e) {
      console.error("[v0] Error al cargar borrador:", e)
    }
  }
}

function clearFormDraft() {
  localStorage.removeItem(STORAGE_KEY)
  console.log("[v0] Borrador eliminado")
}

function updateLastSaved() {
  const draft = localStorage.getItem(STORAGE_KEY)
  if (draft) {
    try {
      const data = JSON.parse(draft)
      const savedDate = new Date(data.savedAt)
      const timeString = savedDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
      lastSavedEl.textContent = `Último guardado: ${timeString}`
    } catch (e) {
      lastSavedEl.textContent = ""
    }
  } else {
    lastSavedEl.textContent = ""
  }
}

// ===== REGISTRO DE AUDITORÍAS =====
function saveAudit(auditData) {
  let audits = []
  const stored = localStorage.getItem(AUDITS_KEY)

  if (stored) {
    try {
      audits = JSON.parse(stored)
    } catch (e) {
      console.error("[v0] Error al cargar auditorías:", e)
      audits = []
    }
  }

  audits.push(auditData)
  localStorage.setItem(AUDITS_KEY, JSON.stringify(audits))
  console.log("[v0] Total de auditorías:", audits.length)
}

function loadAuditsRegistry() {
  const stored = localStorage.getItem(AUDITS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("[v0] Error al cargar registro:", e)
      return []
    }
  }
  return []
}

function renderAuditsRegistry() {
  const audits = loadAuditsRegistry()
  console.log("[v0] Renderizando", audits.length, "auditorías")

  auditCount.textContent = audits.length

  if (audits.length === 0) {
    auditsList.innerHTML = '<p class="empty-message">No hay auditorías registradas aún</p>'
    return
  }

  // Ordenar por fecha descendente (más recientes primero)
  audits.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))

  auditsList.innerHTML = audits
    .map(
      (audit) => `
        <div class="audit-card">
            <div class="audit-card-header">
                <div class="audit-item">
                    <span class="audit-item-label">Auditor</span>
                    <span class="audit-item-value">${audit.auditores}</span>
                </div>
                <div class="audit-item">
                    <span class="audit-item-label">Mes</span>
                    <span class="audit-item-value">${audit.mes} ${audit.anio}</span>
                </div>
                <div class="audit-item">
                    <span class="audit-item-label">Tipo</span>
                    <span class="audit-item-value">${audit.tipoAuditoria}</span>
                </div>
                <div class="audit-item">
                    <span class="audit-item-label">Proceso</span>
                    <span class="audit-item-value">${audit.proceso}</span>
                </div>
                <div class="audit-item">
                    <span class="audit-item-label">Auditado</span>
                    <span class="audit-item-value">${audit.auditado}</span>
                </div>
            </div>
            <div class="audit-card-timestamp">
                Registrado: ${new Date(audit.fechaRegistro).toLocaleString("es-ES")}
            </div>
        </div>
    `,
    )
    .join("")
}

// ===== MENSAJES DE ESTADO =====
function showStatusMessage(message, type) {
  statusMessage.textContent = message
  statusMessage.className = `status-message ${type}`
  console.log("[v0] Mensaje:", type, message)
}

function clearStatusMessage() {
  statusMessage.textContent = ""
  statusMessage.className = "status-message"
}

// ===== AUTO-GUARDADO PERIÓDICO =====
setInterval(() => {
  const hasChanges = Object.values(fields).some((field) => field.value.trim() !== "")
  if (hasChanges) {
    saveFormDraft()
    console.log("[v0] Auto-guardado periódico")
  }
}, AUTO_SAVE_INTERVAL)
