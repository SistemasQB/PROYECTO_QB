// Configuración de la plantilla de error
class ErrorTemplate {
  constructor() {
    this.init()
  }

  init() {
    // Obtener parámetros de la URL o configuración
    this.loadErrorConfig()

    // Configurar eventos
    this.setupEventListeners()

    // Aplicar configuración personalizada si existe
    this.applyCustomConfig()
  }

  loadErrorConfig() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search)

    // Configuración por defecto
    this.config = {
      code: error.codigo || "404",
      title: "Ups... no se pudo cargar la página solicitada",
      reason: error.mensaje || "Página no encontrada",
      homeUrl: urlParams.get("homeUrl") || "/",
      supportEmail: "info.sistemas@qualitybolca.com",
    }

    // Actualizar el DOM con la configuración
    this.updateDOM()
  }

  updateDOM() {
    // Actualizar código de error
    const errorCodeEl = document.getElementById("errorCode")
    if (errorCodeEl) {
      errorCodeEl.textContent = this.config.code
    }

    // Actualizar título
    const errorTitleEl = document.getElementById("errorTitle")
    if (errorTitleEl) {
      errorTitleEl.textContent = this.config.title
    }

    // Actualizar motivo
    const errorReasonEl = document.getElementById("errorReason")
    if (errorReasonEl) {
      errorReasonEl.textContent = this.config.reason
    }

    // Actualizar email de soporte
    const helpLinks = document.querySelectorAll(".help-link")
    helpLinks.forEach((link) => {
      link.href = `mailto:${this.config.supportEmail}`
    })

    // Actualizar título de la página
    document.title = `Error ${this.config.code} - ${this.config.title}`
  }

  setupEventListeners() {
    // Configurar botones si no están ya configurados
    const homeBtn = document.querySelector(".btn-primary")
    const backBtn = document.querySelector(".btn-secondary")

    if (homeBtn && !homeBtn.onclick) {
      homeBtn.onclick = () => this.goHome()
    }

    if (backBtn && !backBtn.onclick) {
      backBtn.onclick = () => this.goBack()
    }
  }

  applyCustomConfig() {
    // Buscar configuración personalizada en el objeto window
    if (window.errorConfig) {
      this.config = { ...this.config, ...window.errorConfig }
      this.updateDOM()
    }
  }

  // Método para ir al inicio
  goHome() {
    window.location.href = this.config.homeUrl
  }

  // Método para regresar
  goBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      this.goHome()
    }
  }

  // Método público para actualizar la configuración
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    this.updateDOM()
  }
}

// Funciones globales para compatibilidad
function goHome() {
  if (window.errorTemplate) {
    window.errorTemplate.goHome()
  } else {
    window.location.href = "/"
  }
}

function goBack() {
  if (window.errorTemplate) {
    window.errorTemplate.goBack()
  } else {
    window.history.back()
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.errorTemplate = new ErrorTemplate()
})

// Función para uso desde el backend
function setErrorDetails(code, title, reason, options = {}) {
  const config = {
    code: code,
    title: title || "Ups... no se pudo cargar la página solicitada",
    reason: reason || "Error desconocido",
    ...options,
  }

  if (window.errorTemplate) {
    window.errorTemplate.updateConfig(config)
  } else {
    // Si aún no se ha inicializado, guardar la configuración
    window.errorConfig = config
  }
}

// Exportar para uso en módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ErrorTemplate, setErrorDetails }
}
