

// Variables globales

let selectedActivity = null
let uploadedFiles = []

// Elementos del DOM
const activitiesGrid = document.getElementById("activitiesGrid");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const avanceInput = document.getElementById("avance");
const estatus =  document.getElementById("estatus");
const currentProgress = document.getElementById("currentProgress");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const uploadedFilesContainer = document.getElementById("uploadedFiles");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");
const comentarios = document.getElementById("comentariosUsuario");


// Funciones de utilidad
function getStatusText(status) {
  const statusMap = {
    "Por Iniciar": "Por-iniciar",
    "En Proceso": "En-Proceso",
    "Terminada": "Terminada",
    "Completada": "Completada",
  }
  return statusMap[status] || status
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

function formatFileSize(bytes) {
  return (bytes / 1024 / 1024).toFixed(2)
}

// Función para mostrar toast
function showToast(message, type = "success") {
  const toastIcon = toast.querySelector(".toast-icon")
  const toastMessage = toast.querySelector(".toast-message")

  toast.className = `toast ${type}`
  toastMessage.textContent = message

  if (type === "error") {
    toastIcon.className = "toast-icon fas fa-exclamation-circle"
  } else {
    toastIcon.className = "toast-icon fas fa-check-circle"
  }

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Función para crear una card de actividad
function createActivityCard(actividad) {
  const card = document.createElement("div")
  card.className = `activity-card status-${getStatusText(actividad.estatus)}`
  
  let contenido = `
        <div class="card-header">
            <div class="card-title-row">
                <h3 class="card-title">${actividad.nombreActividad}</h3>
                <span class="status-badge">${getStatusText(actividad.estatus)}</span>
            </div>
            
            <p>${actividad.descripcion}</p>
            <div class="priority-row">
                <span class="priority-badge priority-${actividad.prioridad}">
                    <b>Prioridad ${actividad.prioridad}</b>
                </span>
            </div>
        </div>
        
        <div class="card-content">
            <div class="progress-section">
                <div class="progress-header">
                    <span>Avance</span>
                    <span class="progress-value">${actividad.avance}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${actividad.avance}%"></div>
                </div>
            </div>
            
            <div class="date-info">
                <i class="fas fa-calendar"></i>
                <span>Fecha compromiso: ${formatDate(actividad.fechaCompromiso)}</span>
            </div>
            
            <button class="btn btn-outline" onclick="openModal('${actividad.id}')">
                <i class="fas fa-plus"></i>
                Asignar Avance
            </button>
      
    `
    if(actividad.comentariosCalificador != 'N/A'){
      contenido += `<div class="date-info">
                <i class="fas fa-info"></i>
                <label>retroalimentacion:</label>
                <b><p>${actividad.comentariosCalificador}</p></b>
      </div>`
    }
    card.innerHTML = contenido
  return card;
}

// Función para renderizar todas las actividades
function renderActivities() {
  activitiesGrid.innerHTML = ""
  actividades.forEach((actividad) => {
    const card = createActivityCard(actividad)
    activitiesGrid.appendChild(card)
  })
}

// Función para abrir el modal
function openModal(activityId) {
  selectedActivity = actividades.find((a) => a.id == activityId)
  if (!selectedActivity) return console.log('no se encontro la actividad seleccionada')

  modalTitle.textContent = `Avance Actividad: ${selectedActivity.nombreActividad}`
  avanceInput.value = selectedActivity.avance
  currentProgress.textContent = `Avance actual: ${selectedActivity.avance}%`

  uploadedFiles = []
  renderUploadedFiles()

  modalOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

// Función para cerrar el modal
function closeModal() {
  modalOverlay.classList.remove("active")
  document.body.style.overflow = "auto"
  selectedActivity = null
  uploadedFiles = []
  // location.reload();
}

// Función para renderizar archivos subidos
function renderUploadedFiles() {
  uploadedFilesContainer.innerHTML = ""

  if (uploadedFiles.length === 0) return

  uploadedFiles.forEach((file, index) => {
    const fileItem = document.createElement("div")
    fileItem.className = "file-item"

    fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${formatFileSize(file.size)} MB)</span>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `

    uploadedFilesContainer.appendChild(fileItem)
  })
}

// Función para remover archivo
function removeFile(index) {
  uploadedFiles.splice(index, 1)
  renderUploadedFiles()
}

// Función para manejar archivos
function handleFiles(files) {
  const validExtensions = [".png", ".jpg", ".jpeg", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".xml"]

  Array.from(files).forEach((file) => {
    const extension = "." + file.name.split(".").pop().toLowerCase()
    if (validExtensions.includes(extension)) {
      uploadedFiles.push(file)
    }
  })

  renderUploadedFiles()
}

// Función para guardar el avance
async function saveProgress() {
  if (!selectedActivity) return
  const newProgress = Number.parseInt(avanceInput.value)

  if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
    showToast("El avance debe ser un número entre 0 y 100", "error")
    return
  }

  
  if (newProgress < selectedActivity.avance) {
    showToast("El nuevo avance debe ser mayor al avance actual", "error")
    return
  }
  
  let datos = juntarInformacion()
  datos.append('id', selectedActivity.id)
  
  try{
    await fetchGenerica("/calidad/asignarAvance", datos ,"/calidad/misActividades")
  }catch(ex){
    console.log(ex)
  }

  


  // Actualizar el progreso
  
  

  showToast(`El avance se actualizó a ${newProgress}%`, "success")
  //  renderActivities()
  closeModal()
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  renderActivities()

  // Modal events
  modalClose.addEventListener("click", closeModal)
  cancelBtn.addEventListener("click", closeModal)
  saveBtn.addEventListener("click", saveProgress)

  // Cerrar modal al hacer click fuera
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal()
    }
  })

  // Dropzone events
  dropzone.addEventListener("click", () => fileInput.click())

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropzone.classList.add("drag-over")
  })

  dropzone.addEventListener("dragleave", (e) => {
    e.preventDefault()
    dropzone.classList.remove("drag-over")
  })

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault()
    dropzone.classList.remove("drag-over")
    handleFiles(e.dataTransfer.files)
  })

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files)
  })

  // Cerrar modal con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal()
    }
  })

})

function juntarInformacion(){
  const formData = new FormData();
  uploadedFiles.forEach((archivo) => {
    formData.append("evidencia", archivo);   
  })  
  formData.append("avance", avanceInput.value);
  formData.append("comentarios", comentarios.value);
  formData.append('estatus' , estatus.value)
  formData.append("_csrf", tok);
  return formData;
}

// Hacer la función openModal global para que funcione desde el HTML
window.openModal = openModal
window.removeFile = removeFile


