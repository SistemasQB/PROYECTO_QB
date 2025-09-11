document.addEventListener("DOMContentLoaded", () => {
  window.materialForm = new MaterialDeliveryForm()
})

class MaterialDeliveryForm {
  constructor() {
    this.form = document.getElementById("materialForm")
    this.progressFill = document.getElementById("progressFill")
    this.progressText = document.getElementById("progressText")
    this.loadingOverlay = document.getElementById("loadingOverlay")
    this.successModal = document.getElementById("successModal")

    this.signaturePads = {}
    this.isDrawing = false

    this.init()
  }

  init() {
    this.showLoading()

    setTimeout(() => {
      this.hideLoading()
      this.setupEventListeners()
      this.initializeSignaturePads()
      this.setCurrentDate()
      // this.loadSavedData()
      this.updateProgress()
      this.generateFolio()
    }, 1000)
  }

  showLoading() {
    this.loadingOverlay.classList.add("active")
  }

  hideLoading() {
    this.loadingOverlay.classList.remove("active")
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))

    // Input validation and progress tracking
    const inputs = this.form.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.validateField(input)
        this.updateProgress()
        this.autoSave()
      })

      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      input.addEventListener("focus", () => {
        this.clearFieldError(input)
      })
    })

    // Animate sections on scroll
    this.setupScrollAnimations()
  }

  initializeSignaturePads() {
    const canvases = ["entregaCanvas", "reciboCanvas"]

    canvases.forEach((canvasId) => {
      const canvas = document.getElementById(canvasId)
      const ctx = canvas.getContext("2d")

      // Set canvas size
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      ctx.scale(2, 2)

      // Set drawing styles
      ctx.strokeStyle = "#1e293b"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      this.signaturePads[canvasId] = { canvas, ctx, isDrawing: false }

      // Mouse events
      canvas.addEventListener("mousedown", (e) => this.startDrawing(e, canvasId))
      canvas.addEventListener("mousemove", (e) => this.draw(e, canvasId))
      canvas.addEventListener("mouseup", () => this.stopDrawing(canvasId))
      canvas.addEventListener("mouseout", () => this.stopDrawing(canvasId))

      // Touch events
      canvas.addEventListener("touchstart", (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        })
        canvas.dispatchEvent(mouseEvent)
      })

      canvas.addEventListener("touchmove", (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        })
        canvas.dispatchEvent(mouseEvent)
      })

      canvas.addEventListener("touchend", (e) => {
        e.preventDefault()
        const mouseEvent = new MouseEvent("mouseup", {})
        canvas.dispatchEvent(mouseEvent)
      })
    })
  }

  startDrawing(e, canvasId) {
    const pad = this.signaturePads[canvasId]
    pad.isDrawing = true

    const rect = pad.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    pad.ctx.beginPath()
    pad.ctx.moveTo(x, y)
  }

  draw(e, canvasId) {
    const pad = this.signaturePads[canvasId]
    if (!pad.isDrawing) return

    const rect = pad.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    pad.ctx.lineTo(x, y)
    pad.ctx.stroke()
  }

  stopDrawing(canvasId) {
    const pad = this.signaturePads[canvasId]
    pad.isDrawing = false
    pad.ctx.beginPath()
  }

  clearSignature(canvasId) {
    const pad = this.signaturePads[canvasId]
    pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height)
  }

  setCurrentDate() {
    const fechaInput = document.getElementById("fecha")
    const today = new Date().toISOString().split("T")[0]
    fechaInput.value = today
  }

  generateFolio() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    const folio = `BOL-${year}${month}${day}-${hours}${minutes}`
    document.getElementById("folio").value = folio

    // Animate the input
    const folioGroup = document.getElementById("folio").closest(".input-group")
    folioGroup.style.transform = "scale(1.02)"
    setTimeout(() => {
      folioGroup.style.transform = "scale(1)"
    }, 200)
  }

  validateField(input) {
    const group = input.closest(".input-group")
    const value = input.value.trim()

    // Remove previous validation classes
    group.classList.remove("error", "success")

    // Check if required field is empty
    if (input.hasAttribute("required") && !value) {
      if (input === document.activeElement) return // Don't show error while typing
      group.classList.add("error")
      return false
    }

    // Specific validations
    if (input.type === "email" && value && !this.isValidEmail(value)) {
      group.classList.add("error")
      return false
    }

    if (input.type === "number" && value && (isNaN(value) || Number.parseFloat(value) <= 0)) {
      group.classList.add("error")
      return false
    }

    // Field is valid
    if (value) {
      group.classList.add("success")
    }

    return true
  }

  clearFieldError(input) {
    const group = input.closest(".input-group")
    group.classList.remove("error")
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  updateProgress() {
    const requiredFields = this.form.querySelectorAll("input[required], textarea[required]")
    const filledFields = Array.from(requiredFields).filter((field) => field.value.trim() !== "")

    const progress = (filledFields.length / requiredFields.length) * 100

    this.progressFill.style.width = `${progress}%`
    this.progressText.textContent = `${Math.round(progress)}% completado`

    // Add completion animation
    if (progress === 100) {
      this.progressFill.style.background = "linear-gradient(90deg, var(--success-color), #059669)"
      this.progressText.style.color = "var(--success-color)"
      this.progressText.style.fontWeight = "600"
    } else {
      this.progressFill.style.background = "linear-gradient(90deg, var(--primary-color), var(--success-color))"
      this.progressText.style.color = "var(--text-secondary)"
      this.progressText.style.fontWeight = "500"
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]')
    submitBtn.classList.add("loading")

    // Validate all fields
    const inputs = this.form.querySelectorAll("input[required], textarea[required]")
    let isValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false
      }
    })

    // Check signatures
    const signatures = ["entregaCanvas", "reciboCanvas"]
    signatures.forEach((canvasId) => {
      const canvas = document.getElementById(canvasId)
      const ctx = canvas.getContext("2d")
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const hasSignature = imageData.data.some((channel) => channel !== 0)

      if (!hasSignature) {
        isValid = false
        const signatureCard = canvas.closest(".signature-card")
        signatureCard.style.border = "2px solid var(--error-color)"
        setTimeout(() => {
          signatureCard.style.border = "1px solid var(--border-color)"
        }, 3000)
      }
    })

    if (!isValid) {
      submitBtn.classList.remove("loading")
      this.showError("Por favor complete todos los campos obligatorios y las firmas.")
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Collect form data
    const formData = new FormData(this.form)
    const data = Object.fromEntries(formData.entries())

    // Add signatures as base64
    signatures.forEach((canvasId) => {
      const canvas = document.getElementById(canvasId)
      data[canvasId] = canvas.toDataURL()
    })

    // Save to localStorage
    localStorage.setItem("materialDeliveryForm", JSON.stringify(data))

    submitBtn.classList.remove("loading")
    this.showSuccess()

    
  }

  showSuccess() {
    this.successModal.classList.add("active")

    // Add confetti effect
    this.createConfetti()
  }

  showError(message) {
    // Create and show error notification
    const notification = document.createElement("div")
    notification.className = "notification error"
    notification.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 5000)
  }

  createConfetti() {
    const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        z-index: 3000;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `

      document.body.appendChild(confetti)

      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti)
        }
      }, 5000)
    }
  }

  closeModal() {
    this.successModal.classList.remove("active")
  }

  clearForm() {
    if (confirm("¿Está seguro de que desea limpiar el formulario?")) {
      this.form.reset()
      this.setCurrentDate()
      this.generateFolio()

      // Clear signatures
      Object.keys(this.signaturePads).forEach((canvasId) => {
        this.clearSignature(canvasId)
      })

      // Clear validation classes
      const groups = this.form.querySelectorAll(".input-group")
      groups.forEach((group) => {
        group.classList.remove("error", "success")
      })

      // Reset progress
      this.updateProgress()

      // Clear localStorage
      localStorage.removeItem("materialDeliveryForm_draft")
      localStorage.removeItem("materialDeliveryForm")

      // Show success message
      this.showNotification("Formulario limpiado exitosamente", "success")
    }
  }

  autoSave() {
    const formData = new FormData(this.form)
    const data = Object.fromEntries(formData.entries())
    localStorage.setItem("materialDeliveryForm_draft", JSON.stringify(data))
  }

  loadSavedData() {
    const savedData = localStorage.getItem("materialDeliveryForm_draft")
    if (savedData) {
      const data = JSON.parse(savedData)
      Object.keys(data).forEach((key) => {
        const input = document.getElementById(key)
        if (input && data[key]) {
          input.value = data[key]
          this.validateField(input)
        }
      })
      this.updateProgress()
    }
  }

  setupScrollAnimations() {
    const sections = document.querySelectorAll(".form-section")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running"
          }
        })
      },
      { threshold: 0.1 },
    )

    sections.forEach((section) => {
      observer.observe(section)
    })
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"}"></i>
      <span>${message}</span>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }
}

// Global functions
function generateFolio() {
  if (window.materialForm) {
    window.materialForm.generateFolio()
  }
}

function clearSignature(canvasId) {
  if (window.materialForm) {
    window.materialForm.clearSignature(canvasId)
  }
}

function clearForm() {
  if (window.materialForm) {
    window.materialForm.clearForm()
  }
}

function closeModal() {
  if (window.materialForm) {
    window.materialForm.closeModal()
  }
}

// Add notification styles
const notificationStyles = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    border-left: 4px solid var(--primary-color);
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification.success {
    border-left-color: var(--success-color);
  }
  
  .notification.success i {
    color: var(--success-color);
  }
  
  .notification.error {
    border-left-color: var(--error-color);
  }
  
  .notification.error i {
    color: var(--error-color);
  }
  
  @keyframes confettiFall {
    to {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`

// Add styles to document
const styleSheet = document.createElement("style")
styleSheet.textContent = notificationStyles
document.head.appendChild(styleSheet)
let btnEnvio = document.getElementById("btnEnvio")

  btnEnvio.addEventListener("click", ()=>{
    let campos = {
      folio: document.getElementById("folio"),
      fecha : document.getElementById("fecha"),
      planta : document.getElementById("planta"),
      nombreParte : document.getElementById("nombreParte"),
      numeroParte : document.getElementById("numeroParte"),
      cantidad : document.getElementById("cantidad"),
      controlCliente : document.getElementById("controlCliente"),
      entrego:document.getElementById("entregoNombre"),
      recibio: document.getElementById("recibioNombre"),
      observaciones : document.getElementById("observaciones"),
      firmaEntrega : document.getElementById("entregaCanvas"),
      firmaRecibe : document.getElementById("reciboCanvas"),
      imagenEmbarque: document.getElementById("fotoEmbarque")  
    }

    let texto = validacionCampos(campos)
    if (!texto){
      alerta('debes completar todos los campos')
      return
    }
    let firmas = validacionFirma(campos)
    if (!firmas){
      alerta('se requiere que esten ambas firmas')
      return
    }
    let imagen = campos.imagenEmbarque.files.length
    if(imagen <= 0){
      alerta('se requiere la foto del embarque')
      return
    }
    
    if (texto && firmas && imagen > 0){
      alert("entro a la funcion para juntar la informacion")
      juntarInformacion(campos)
    }
  })


async function juntarInformacion(campos){
  delete campos.imagenEmbarque
  delete campos.firmaEntrega
  delete campos.firmaRecibe

  let formData = new FormData();
  Object.entries(campos).forEach(([campo, valor])=>{
    formData.append(campo, valor.value)
  })
  formData.append("_csrf", tok)
  let firmas = {
    firmaEntrega: document.getElementById("entregaCanvas"),
    firmaRecibe:  document.getElementById("reciboCanvas"),
  }
  Object.entries(firmas).forEach(([key, valor])=>{
    let data = valor.toDataURL('image/jpeg')
    let firma = conversionBlob(data)
    switch(key){
      case'firmaEntrega':
        formData.append("imagenes", firma, `firma entrega ${folio.value}.jpeg` )    
      break;
      default:
        formData.append("imagenes", firma, `firma recibe ${folio.value}.jpeg` )    
        break;

      
    }
  })
  formData.append("imagenes", document.getElementById("fotoEmbarque").files[0])

  await fetchGenerica("envioMaterial", formData, "form-entrega")
  
 
}

function conversionBlob(base64, type = 'image/png') {
  let binary = atob(base64.split(',')[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type });
}

function validacionArchivo({archivo}){
  if (!archivo) return "se necesita el archivo para hacer la validacion"
  const formatos = ["image/jpg", "image/jpeg", "image/png"]
  return formatos.includes(archivo)
}

function validacionFirma(campos) {
  validacionFirmas = Object.entries(campos).some(([key, valor])=>{
  if(key.includes('firma')){   
    const ctx = valor.getContext('2d');
    const pixelData = ctx.getImageData(0, 0, valor.width, valor.height).data;
    let hayFirma = false
    for (let i = 0; i < pixelData.length; i += 4) {
    if (pixelData[i + 3] !== 0) {
      hayFirma = true
      break;
    }
  }
  if(!hayFirma) return true
}
 return false
  })
  return !validacionFirmas; 
}

function validacionCampos(listaCampos){
  let camposInvalidos = Object.entries(listaCampos).some(([key, valor])=>{
    if(!key.includes("firma") && !key.includes("imagen") ){
      if (valor.value.trim() === '') {
        return true
      }
    }
    return false
  })
  return !camposInvalidos
}

function alerta(texto){
   return Swal.fire({
        text: texto,
        icon: 'info',       // Puedes cambiarlo por 'success', 'error', 'warning' o 'question'
        timer: 3000,        // Duración en milisegundos (3 segundos)
        showConfirmButton: false,
        timerProgressBar: true
      });
      
}
