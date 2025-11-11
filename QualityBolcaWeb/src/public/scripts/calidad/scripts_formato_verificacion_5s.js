
// Datos de configuración
const departments = [
  "Producción",
  "Calidad",
  "Mantenimiento",
  "Almacén",
  "Administración",
  "Recursos Humanos",
  "Ventas",
  "Compras",
]

const evaluationCriteria = {
  seiri: [
    "El escritorio está libre de materiales o artículos innecesarios (comparar con la lista de artículos permitida)",
    "Los pisos/paredes están libres de contaminación visual (hojas de rotafolio, Post it, rayaduras de marcador, etc.)",
    "Los documentos están en uso activo (no documentos obsoletos)",
    "Hay identificadores para asignar lugar a cada artículo en la gaveta",
  ],
  seiton: [
    "Los cables y equipo de soporte están organizados y no representan un riesgo o desorden visual",
    "Los objetos o papeles en los escritorios muestran organización",
    "Se mantienen libre de basura el suelo y pizarrones limpios, libres de polvo, manchas y/o residuos",
  ],
  seiso: [
    "El equipo de cómputo (pantalla, teclado, mouse, mousepad, CPU) están visiblemente limpios",
    "El equipo electrónico de soporte está libre de polvo y funciona (ventiladores, proyector, TV, etc.)",
    "El escritorio está libre de polvo, manchas, residuos y/o papeles",
  ],
  seiketsu: [
    "Hay etiquetas o señalizaciones claras donde sea necesario (gaveta, carpetas, cajoneras)",
    "Se le da seguimiento y se está abierto a la retroalimentación de los estándares de 5s",
  ],
  shitsuke: [
    "El personal está involucrado y muestra actitud de responsabilidad y disciplina en las actividades de 5s",
    "El lugar de trabajo se mantiene limpio y ordenado constantemente, no solo para la auditoría",
  ],
}

const sectionDescriptions = {
  seiri: "Seleccionar - Separar lo necesario de lo innecesario",
  seiton: "Organizar - Un lugar para cada cosa y cada cosa en su lugar",
  seiso: "Limpiar - Mantener el área de trabajo limpia",
  seiketsu: "Estandarizar - Crear estándares para mantener las primeras 3S",
  shitsuke: "Disciplina - Mantener y mejorar los estándares establecidos",
}

const sectionTitles = {
  seiri: "SEIRI - Seleccionar",
  seiton: "SEITON - Organizar",
  seiso: "SEISO - Limpiar",
  seiketsu: "SEIKETSU - Estandarizar",
  shitsuke: "SHITSUKE - Disciplina",
}

// Estado del formulario
let formData = {
  evaluador: "",
  department: "",
  fecha: new Date().toISOString().split("T")[0],
  secciones: {},
  images: [],
}

let errors = {}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeForm()
  setupEventListeners()
  renderSections()
  updateImageCounter()
  cargarInfo()
  
})

function initializeForm() {
  // Establecer fecha actual
  document.getElementById("date").value = formData.fecha

  // Inicializar secciones
  Object.keys(evaluationCriteria).forEach((section) => {
    formData.secciones[section] = {
      criteria: {},
      comments: "",
    }
  })
}

function setupEventListeners() {
  const form = document.getElementById("evaluationForm")
  const resetBtn = document.getElementById("resetBtn")
  const imagesInput = document.getElementById("images")
  // const btnEnvio = document.getElementById("btnEnvio")

  form.addEventListener("submit", handleSubmit)
  resetBtn.addEventListener("click", handleReset)
  imagesInput.addEventListener("change", handleImageUpload)

  // Listeners para campos generales
  document.getElementById("evaluator").addEventListener("input", (e) => {
    formData.evaluador = e.target.value
    clearError("evaluator")
  })

  document.getElementById("department").addEventListener("change", (e) => {
    formData.departamento = e.target.value
    clearError("department")
  })

  document.getElementById("date").addEventListener("change", (e) => {
    formData.fecha = e.target.value
    clearError("date")
  })

  // btnEnvio.addEventListener('click',(e) => {
  //     envioInformacion()
  // })
}

function renderSections() {
  const container = document.getElementById("sectionsContainer")

  Object.keys(evaluationCriteria).forEach((sectionKey) => {
    const section = createSectionElement(sectionKey)
    container.appendChild(section)
  })
}

function createSectionElement(sectionKey) {
  const criteria = evaluationCriteria[sectionKey]
  const sectionDiv = document.createElement("div")
  sectionDiv.className = "card"

  sectionDiv.innerHTML = `
        <div class="card-header section-header section-${sectionKey}">
            <div>
                <h2>${sectionTitles[sectionKey]}</h2>
                <p>${sectionDescriptions[sectionKey]}</p>
            </div>
            <span class="section-score" id="score-${sectionKey}">0.00/5.00</span>
        </div>
        <div class="card-content">
            <div class="criteria-list">
                ${criteria.map((criterion, index) => createCriteriaElement(sectionKey, criterion, index)).join("")}
            </div>
            <div class="comments-section">
                <label for="${sectionKey}-comments">Comentarios adicionales (opcional)</label>
                <textarea 
                    id="${sectionKey}-comments" 
                    name="${sectionKey}-comments"
                    placeholder="Observaciones, recomendaciones o notas adicionales..."
                ></textarea>
            </div>
        </div>
    `

  // Agregar event listeners para esta sección
  setTimeout(() => {
    criteria.forEach((_, index) => {
      const select = document.getElementById(`${sectionKey}-${index}`)
      if (select) {
        select.addEventListener("change", (e) => {
          handleCriteriaChange(sectionKey, index, e.target.value)
        })
      }
    })

    const commentsTextarea = document.getElementById(`${sectionKey}-comments`)
    if (commentsTextarea) {
      commentsTextarea.addEventListener("input", (e) => {
        formData.secciones[sectionKey].comments = e.target.value
      })
    }
  }, 0)

  return sectionDiv
}

function createCriteriaElement(sectionKey, criterion, index) {
  const criteriaId = `${sectionKey}-${index}`

  return `
        <div class="criteria-item">
            <div class="criteria-header">
                <div class="criteria-number">${index + 1}</div>
                <div class="criteria-text">${criterion}</div>
            </div>
            <div class="criteria-rating">
                <label for="${criteriaId}">Calificación:</label>
                <select id="${criteriaId}" name="${criteriaId}" required>
                    <option value="0">selecciona una opcion</option>
                    <option value="1">1 - No Cumple</option>
                    <option value="3">3 - Regular</option>
                    <option value="5">5 - Cumple</option>
                </select>
                <span class="error-message" id="${criteriaId}-error"></span>
            </div>
        </div>
    `
}

function handleCriteriaChange(section, criteriaIndex, value) {
  const key = `${section}-${criteriaIndex}`
  
  formData.secciones[section].criteria[key] = Number.parseInt(value)

  clearError(key)
  updateSectionScore(section)
  updateTotalScore()
}

function calculateSectionScore(section) {
  const criteria = formData.secciones[section].criteria
  const values = Object.values(criteria).filter((v) => v > 0)
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

function updateSectionScore(section) {
  const score = calculateSectionScore(section)
  const scoreElement = document.getElementById(`score-${section}`)
  if (scoreElement) {
    scoreElement.textContent = `${score.toFixed(2)}/5.00`
  }
}

function calculateTotalScore() {
  const sections = Object.keys(evaluationCriteria)
  const scores = sections.map((section) => calculateSectionScore(section))
  const validScores = scores.filter((score) => score > 0)
  if (validScores.length === 0) return 0
  return validScores.reduce((sum, score) => sum + score, 0) / validScores.length
}

function updateTotalScore() {
  const totalScore = calculateTotalScore()
  document.getElementById("totalScore").textContent = totalScore.toFixed(2)
}

function handleImageUpload(e) {
  const files = Array.from(e.target.files)

  // Validar tipos de archivo
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  const invalidFiles = files.filter((file) => !validTypes.includes(file.type))

  if (invalidFiles.length > 0) {
    showToast("Tipo de archivo no válido", "Solo se permiten archivos JPG, PNG, GIF y WebP", "error")
    e.target.value = ""
    return
  }

  // Validar límite de imágenes
  const totalImages = formData.images.length + files.length
  if (totalImages > 10) {
    showToast(
      "Límite excedido",
      `Solo se permiten máximo 10 imágenes. Tienes ${formData.images.length} y intentas agregar ${files.length}`,
      "error",
    )
    e.target.value = ""
    return
  }

  // Agregar imágenes
  formData.images = [...formData.images, ...files]
  clearError("images")
  updateImagePreview()
  updateImageCounter()

  // Limpiar input para permitir seleccionar los mismos archivos de nuevo
  e.target.value = ""
}

function updateImagePreview() {
  const preview = document.getElementById("imagePreview")
  const placeholder = document.getElementById("noImagesPlaceholder")

  if (formData.images.length === 0) {
    preview.innerHTML = ""
    placeholder.classList.remove("hidden")
    return
  }

  placeholder.classList.add("hidden")

  preview.innerHTML = formData.images
    .map(
      (file, index) => `
        <div class="image-item">
            <div class="image-container">
                <img src="${URL.createObjectURL(file)}" alt="Imagen ${index + 1}">
                <button type="button" class="image-remove" onclick="removeImage(${index})">×</button>
            </div>
            <p class="image-name">${file.name}</p>
        </div>
    `,
    )
    .join("")
}

function removeImage(index) {
  formData.images.splice(index, 1)
  updateImagePreview()
  updateImageCounter()

  if (formData.images.length === 0) {
    setError("images", "Debe subir al menos 1 imagen")
  }
}

function updateImageCounter() {
  document.getElementById("imageCount").textContent = formData.images.length
}

function validateForm() {
  errors = {}

  // Validar campos generales
  if (!formData.evaluador.trim()) {
    setError("evaluator", "El nombre del evaluador es requerido")
  }

  if (!formData.departamento) {
    setError("department", "El departamento es requerido")
  }

  if (!formData.fecha) {
    setError("date", "La fecha es requerida")
  }

  // Validar imágenes
  if (formData.images.length === 0) {
    setError("images", "Debe subir al menos 1 imagen")
  }

  if (formData.images.length > 10) {
    setError("images", "Máximo 10 imágenes permitidas")
  }

  //Validar criterios de evaluación
  Object.keys(evaluationCriteria).forEach((section) => {
    const sectionCriteria = evaluationCriteria[section]
    sectionCriteria.forEach((_, index) => {
      const key = `${section}-${index}`
      if (!formData.secciones[section].criteria[key]) {
        setError(key, "Calificación requerida")
      }
    })
  }
  )

  return Object.keys(errors).length === 0
}

function setError(field, message) {
  errors[field] = message
  const errorElement = document.getElementById(`${field}-error`)
  const inputElement = document.getElementById(field)

  if (errorElement) {
    errorElement.textContent = message
  }

  if (inputElement) {
    inputElement.classList.add("error")
  }
}

function clearError(field) {
  if (errors[field]) {
    delete errors[field]
    const errorElement = document.getElementById(`${field}-error`)
    const inputElement = document.getElementById(field)

    if (errorElement) {
      errorElement.textContent = ""
    }

    if (inputElement) {
      inputElement.classList.remove("error")
    }
  }
}

function handleSubmit(e) {
  e.preventDefault()

  // Actualizar datos del formulario
  formData.evaluador = document.getElementById("evaluator").value
  formData.departamento = document.getElementById("department").value
  formData.fecha = document.getElementById("date").value

  if (!validateForm()) {
    showToast("Error en el formulario", "Por favor completa todos los campos requeridos", "error")
    return
  }

  

  const totalScore = calculateTotalScore()
  envioInformacion()

  //funcion de envio de informacion aqui
  showToast("Evaluación enviada", `Puntuación total: ${totalScore.toFixed(2)}/5.00`, "success")
}

function handleReset() {
  if (confirm("¿Estás seguro de que quieres limpiar todo el formulario?")) {
    // Resetear datos
    formdata = {
      evaluador: "",
      departamento: "",
      fecha: new Date().toISOString().split("T")[0],
      secciones: {},
      images: [],
    }

    // Inicializar secciones
    Object.keys(evaluationCriteria).forEach((section) => {
      formData.secciones[section] = {
        criteria: {},
        comments: "",
      }
    })

    // Limpiar errores
    errors = {}

    // Resetear formulario HTML
    document.getElementById("evaluationForm").reset()
    document.getElementById("date").value = formData.fecha

    // Limpiar clases de error
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"))
    document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))

    // Actualizar scores
    Object.keys(evaluationCriteria).forEach((section) => {
      updateSectionScore(section)
    })
    updateTotalScore()

    // Limpiar imágenes
    updateImagePreview()
    updateImageCounter()

    showToast("Formulario limpiado", "Todos los campos han sido restablecidos", "success")
  }
}

function showToast(title, description, type = "success") {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `

  container.appendChild(toast)

  // Remover toast después de 5 segundos
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 5000)
}

// Función global para remover imágenes (llamada desde HTML)
window.removeImage = removeImage
function cargarInfo(){
  const listaSelect = document.querySelectorAll('#sectionsContainer select')

  listaSelect.forEach((input) => {
      input.selectedIndex = 0
  })
  const evaluador = document.getElementById('evaluator')
  evaluador.value = nombre
  evaluador.disabled= true;
}

async function envioInformacion(){
  const f = document.getElementById('date').value
  let fecha = new Date(f)
  let data = new FormData()
  // console.log(formData)
  Object.entries(formData).forEach(([key, val]) => {
    if (key == 'secciones'){
      data.append(key, JSON.stringify(val));
    }else{
      data.append(key, val);
    }
    
  })
  let folio = `${fecha.toLocaleDateString('en-US')}-${generarFolio()}`
  data.append('folio', folio)
  data.append("_csrf", tok)
  formData.images.forEach((img) => {
      let i = 1
       const nombreOriginal = img.name
       const lastDotIndex = nombreOriginal.lastIndexOf('.');
       const extension = lastDotIndex === -1 ? '' : nombreOriginal.substring(lastDotIndex + 1); 
       const nuevoNombre = `evidencia ${folio} ${i}.${extension}`
      
      data.append('evidencia', img, nuevoNombre)
  })
   await fetchGenerica('/calidad/ingresarFormatoVerificacion', data, '/calidad/formatoVerificacion')
}

function generarFolio(){
  const min = 100000
  const max = 999999
  let aleatorio = Math.floor(Math.random()* (max-min+1)+ min)
  let aleatorio2 = Math.floor(Math.random()* (max-min+1)+ min)
  return `${aleatorio}-${aleatorio2}`
}

// function validarInformacion(){
  
//   if (images.length == 0) {
//     alerta('Imagenes Faltantes', "debes agregar minimo una imagen");
//     return false;}
// }

// function alerta(titulo, mensaje){
//   return Swal.fire({
//     icon: "error",
//     title: titulo,
//     text: mensaje,
//     timer: 2000
//   })
// }