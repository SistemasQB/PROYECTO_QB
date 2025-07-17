class VerificacionApp {
    constructor() {
      this.codigoBase = ""
      this.cantidadTotal = 0
      this.cantidadOriginal = 0
      this.codigos = []
      this.codigosPendientesAuth = []
  
      this.init()
    }
  
    init() {
      // Verificar datos de localStorage
      const codigoBaseStorage = localStorage.getItem("codigoBase")
      const cantidadStorage = localStorage.getItem("cantidadPiezas")
  
      if (!codigoBaseStorage || !cantidadStorage) {
        // window.location.href = "index.html"
        return
      }
  
      this.codigoBase = codigoBaseStorage
      this.cantidadTotal = Number.parseInt(cantidadStorage)
      this.cantidadOriginal = this.cantidadTotal
  
      this.setupUI()
      this.setupEventListeners()
    }
  
    setupUI() {
      document.getElementById("codigoBaseDisplay").textContent = this.codigoBase
      document.getElementById("cantidadOriginalDisplay").textContent = this.cantidadOriginal
      this.updateCounters()
    }
  
    setupEventListeners() {
      // Botón volver
      // document.getElementById("backBtn").addEventListener("click", () => {
      //   window.location.href = "index.html"
      // })
  
      // Input de código con Enter
      const codigoInput = document.getElementById("codigoInput")
      codigoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.procesarCodigo()
        }
      })
  
      // Formulario de autorización
      document.getElementById("authForm").addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleAuth()
      })
  
      // Formulario de finalización
      document.getElementById("finishForm").addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFinish()
      })
  
      // Prevenir cierre del modal de finalización
      document.getElementById("finishModal").addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }
  
    procesarCodigo() {
      const input = document.getElementById("codigoInput")
      const codigo = input.value.trim()
  
      if (!codigo) return
  
      if (this.codigos.length >= this.cantidadTotal) {
        this.showFinishModal()
        return
      }
  
      const esValido = this.verificarCodigo(codigo)
      const codigoVerificado = {
        codigo: codigo,
        esValido: esValido,
        timestamp: new Date(),
      }
  
      this.codigos.push(codigoVerificado)
      this.updateUI()
  
      if (!esValido) {
        this.codigosPendientesAuth = [codigo]
        this.showAuthModal()
      } else {
        this.verificarFinalizacion()
      }
  
      input.value = ""
    }
  
    verificarCodigo(codigo) {
      return codigo.toLowerCase().includes(this.codigoBase.toLowerCase())
    }
  
    verificarFinalizacion() {
      if (this.codigos.length >= this.cantidadTotal) {
        this.showFinishModal()
      }
    }
  
    updateUI() {
      this.updateCounters()
      this.updateCodigosList()
      this.updateCodigosDisplay()
      this.updateProgressBar()
  
      // Deshabilitar input si se alcanzó el límite
      const input = document.getElementById("codigoInput")
      input.disabled = this.codigos.length >= this.cantidadTotal
    }
  
    updateCounters() {
      const validCount = this.codigos.filter((c) => c.esValido).length
      const invalidCount = this.codigos.filter((c) => !c.esValido).length
  
      document.getElementById("contador").textContent = `${this.codigos.length} / ${this.cantidadTotal} piezas`
      document.getElementById("validCount").textContent = validCount
      document.getElementById("invalidCount").textContent = invalidCount
    }
  
    updateCodigosList() {
      const container = document.getElementById("codigosList")
  
      if (this.codigos.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay códigos ingresados</p>'
        return
      }
  
      container.innerHTML = this.codigos
        .map(
          (item) => `
              <div class="codigo-item ${item.esValido ? "valid" : "invalid"}">
                  <span class="codigo-text">${item.codigo}</span>
                  <span class="codigo-icon">${item.esValido ? "✅" : "❌"}</span>
              </div>
          `,
        )
        .join("")
    }
  
    updateCodigosDisplay() {
      const textarea = document.getElementById("codigosDisplay")
      textarea.value = this.codigos.map((c) => c.codigo).join("\n")
    }
  
    updateProgressBar() {
      const progress = Math.min((this.codigos.length / this.cantidadTotal) * 100, 100)
      document.getElementById("progressFill").style.width = `${progress}%`
    }
  
    showAuthModal() {
      const modal = document.getElementById("authModal")
      document.getElementById("codigosInvalidos").textContent = this.codigosPendientesAuth.join(", ")
      modal.classList.add("show")
    }
  
    hideAuthModal() {
      const modal = document.getElementById("authModal")
      modal.classList.remove("show")
  
      // Limpiar formulario
      document.getElementById("numeroEmpleado").value = ""
      document.getElementById("contrasena").value = ""
    }
  
    showFinishModal() {
      const modal = document.getElementById("finishModal")
      const validCount = this.codigos.filter((c) => c.esValido).length
      const invalidCount = this.codigos.filter((c) => !c.esValido).length
  
      document.getElementById("totalProcesado").textContent = this.codigos.length
      document.getElementById("validosFinal").textContent = validCount
      document.getElementById("invalidosFinal").textContent = invalidCount
  
      modal.classList.add("show")
    }
  
    handleAuth() {
      const numeroEmpleado = document.getElementById("numeroEmpleado").value.trim()
      const contrasena = document.getElementById("contrasena").value.trim()
  
      if (!numeroEmpleado || !contrasena) {
        alert("Por favor, complete todos los campos de autorización")
        return
      }
  
      // Agregar las piezas rojas autorizadas al total
      const piezasRojasAutorizadas = this.codigosPendientesAuth.length
      this.cantidadTotal += piezasRojasAutorizadas
  
      this.hideAuthModal()
      this.codigosPendientesAuth = []
      this.verificarFinalizacion()
    }
  
    handleFinish() {
      const numeroEmpleado = document.getElementById("numeroEmpleadoFin").value.trim()
      const contrasena = document.getElementById("contrasenaFin").value.trim()
  
      if (!numeroEmpleado || !contrasena) {
        alert("Por favor, complete todos los campos de autorización")
        return
      }
  
      // Limpiar localStorage y reiniciar
      localStorage.removeItem("codigoBase")
      localStorage.removeItem("cantidadPiezas")
      // window.location.href = "index.html"
    }
  }
  
  // Inicializar la aplicación cuando se carga la página
  document.addEventListener("DOMContentLoaded", () => {
    new VerificacionApp()
  })
  