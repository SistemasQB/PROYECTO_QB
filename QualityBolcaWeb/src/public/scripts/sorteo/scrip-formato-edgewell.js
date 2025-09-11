// Variables globales
let partidas = []
let partidaIdCounter = 1

let isDrawing = false
let canvasEntrega, canvasRecibe
let ctxEntrega, ctxRecibe

// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  initializeForm()
  setupEventListeners()
  initializeSignatureCanvas()
  setupFilePreview()
  agregarProductos();
})

// Configuración inicial del formulario
function initializeForm() {
  // Establecer fecha actual por defecto
  const fechaInput = document.getElementById("fecha")
  const today = new Date().toISOString().split("T")[0]
  fechaInput.value = today
  fechaInput.min = today // No permitir fechas anteriores a hoy

  // Actualizar totales inicialmente
  updateTotals()
  updateTableVisibility()
}

// Configurar event listeners
function setupEventListeners() {
  const form = document.getElementById("materialForm")
  const numeroCajas = document.getElementById("numeroCajas")
  const cantidadPiezas = document.getElementById("cantidadPiezas")
  const limpiarFormBtn = document.getElementById("limpiarForm")
  const limpiarTablaBtn = document.getElementById("limpiarTabla")
  const exportarBtn = document.getElementById("exportarBtn")
  const limpiarTodoBtn = document.getElementById("limpiarTodo")
  const enviarInformacionBtn = document.getElementById("enviarInformacion")

  // Envío del formulario
  form.addEventListener("submit", handleFormSubmit)

  // Actualizar totales cuando cambien los valores
  numeroCajas.addEventListener("input", updateTotals)
  cantidadPiezas.addEventListener("input", updateTotals)

  // Botones de acción
  limpiarFormBtn.addEventListener("click", clearForm)
  limpiarTablaBtn.addEventListener("click", clearTable)
  exportarBtn.addEventListener("click", exportTable)
  limpiarTodoBtn.addEventListener("click", clearCompleteForm)
  enviarInformacionBtn.addEventListener("click", submitCompleteForm)
}

// Manejar envío del formulario
function handleFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const partida = {
    id: partidaIdCounter++,
    fecha: formData.get("fecha"),
    numeroParte: formData.get("numeroParte"),
    descripcion: formData.get("descripcion"),
    numeroCajas: Number.parseInt(formData.get("numeroCajas")),
    cantidadPiezas: Number.parseInt(formData.get("cantidadPiezas")),
    totalConcatenado: formData.get("totalConcatenado"),
    totalMultiplicado: Number.parseInt(formData.get("totalMultiplicado")),
  }

  // Validar que los campos requeridos estén completos
  if (  
    !partida.numeroParte ||
    !partida.descripcion ||
    !partida.numeroCajas ||
    !partida.cantidadPiezas
  ) {
    showNotification("Por favor, completa todos los campos requeridos", "error")
    return
  }

  // Agregar partida al array
  partidas.push(partida)

  // Actualizar la tabla
  renderTable()
  updateSummary()
  updateTableVisibility()

  // Limpiar formulario
  clearForm()

  // Mostrar notificación de éxito
  showNotification("Partida agregada correctamente", "success")
}

// Actualizar totales automáticamente
function updateTotals() {
  const numeroCajas = Number.parseInt(document.getElementById("numeroCajas").value) || 0
  const cantidadPiezas = Number.parseInt(document.getElementById("cantidadPiezas").value) || 0

  const totalConcatenado = numeroCajas && cantidadPiezas ? `${numeroCajas} x ${cantidadPiezas}` : ""
  const totalMultiplicado = numeroCajas * cantidadPiezas

  document.getElementById("totalConcatenado").value = totalConcatenado
  document.getElementById("totalMultiplicado").value = totalMultiplicado || ""
}

// Renderizar tabla de partidas
function renderTable() {
  const tbody = document.getElementById("partidasBody")
  tbody.innerHTML = ""

  partidas.forEach((partida) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${formatDate(partida.fecha)}</td>
            <td>${partida.numeroParte}</td>
            <td>${partida.descripcion}</td>
            <td>${partida.numeroCajas}</td>
            <td>${partida.cantidadPiezas}</td>
            <td>${partida.totalConcatenado}</td>
            <td>${partida.totalMultiplicado}</td>
            <td>
                <button class="btn-delete" onclick="deletePartida(${partida.id})">
                    Eliminar
                </button>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Eliminar partida
function deletePartida(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta partida?")) {
    partidas = partidas.filter((partida) => partida.id !== id)
    renderTable()
    updateSummary()
    updateTableVisibility()
    showNotification("Partida eliminada correctamente", "success")
  }
}

// Actualizar resumen
function updateSummary() {
  const totalPartidas = partidas.length
  const totalCajas = partidas.reduce((sum, partida) => sum + partida.numeroCajas, 0)
  const totalPiezas = partidas.reduce((sum, partida) => sum + partida.totalMultiplicado, 0)

  document.getElementById("totalPartidas").textContent = totalPartidas
  document.getElementById("totalCajas").textContent = totalCajas
  document.getElementById("totalPiezas").textContent = totalPiezas
}

// Actualizar visibilidad de tabla y elementos relacionados
function updateTableVisibility() {
  const emptyState = document.getElementById("emptyState")
  const summarySection = document.getElementById("summarySection")
  const tableContainer = document.querySelector(".table-container")
  const limpiarTablaBtn = document.getElementById("limpiarTabla")
  const exportarBtn = document.getElementById("exportarBtn")

  const hasPartidas = partidas.length > 0

  emptyState.style.display = hasPartidas ? "none" : "block"
  summarySection.style.display = hasPartidas ? "block" : "none"
  tableContainer.style.display = hasPartidas ? "block" : "none"
  limpiarTablaBtn.disabled = !hasPartidas
  exportarBtn.disabled = !hasPartidas
}

// Limpiar formulario
function clearForm() {
  document.getElementById("materialForm").reset()
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("fecha").value = today
  updateTotals()
  clearSignature("canvasEntrega")
  clearSignature("canvasRecibe")
}

// Limpiar tabla
function clearTable() {
  if (confirm("¿Estás seguro de que deseas eliminar todas las partidas?")) {
    partidas = []
    renderTable()
    updateSummary()
    updateTableVisibility()
    showNotification("Todas las partidas han sido eliminadas", "success")
  }
}

// Exportar tabla a CSV
function exportTable() {
  if (partidas.length === 0) {
    showNotification("No hay partidas para exportar", "error")
    return
  }

  const headers = ["Fecha", "No. Parte", "Descripción", "Cajas", "Piezas", "Total (CxP)", "Total (*)"]
  const csvContent = [
    headers.join(","),
    ...partidas.map((partida) =>
      [
        partida.fecha,
        partida.numeroParte,
        `"${partida.descripcion}"`,
        partida.numeroCajas,
        partida.cantidadPiezas,
        `"${partida.totalConcatenado}"`,
        partida.totalMultiplicado,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `salida_material_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showNotification("Archivo exportado correctamente", "success")
}

// Formatear fecha para mostrar
function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Mostrar notificaciones
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Estilos para la notificación
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    zIndex: "1000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    wordWrap: "break-word",
  })

  // Colores según el tipo
  const colors = {
    success: "#28a745",
    error: "#dc3545",
    info: "#17a2b8",
  }

  notification.style.backgroundColor = colors[type] || colors.info

  // Agregar al DOM
  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

function initializeSignatureCanvas() {
  canvasEntrega = document.getElementById("canvasEntrega")
  canvasRecibe = document.getElementById("canvasRecibe")

  if (canvasEntrega && canvasRecibe) {
    ctxEntrega = canvasEntrega.getContext("2d")
    ctxRecibe = canvasRecibe.getContext("2d")

    setupCanvas(canvasEntrega, ctxEntrega)
    setupCanvas(canvasRecibe, ctxRecibe)
  }
}

function setupCanvas(canvas, ctx) {
  // Configurar propiedades del canvas
  ctx.strokeStyle = "#1f2937"
  ctx.lineWidth = 2
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  // Event listeners para dibujar
  canvas.addEventListener("mousedown", startDrawing)
  canvas.addEventListener("mousemove", draw)
  canvas.addEventListener("mouseup", stopDrawing)
  canvas.addEventListener("mouseout", stopDrawing)

  // Touch events para dispositivos móviles
  canvas.addEventListener("touchstart", handleTouch)
  canvas.addEventListener("touchmove", handleTouch)
  canvas.addEventListener("touchend", stopDrawing)
}

function startDrawing(e) {
  isDrawing = true
  const rect = e.target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const ctx = e.target.getContext("2d")
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function draw(e) {
  if (!isDrawing) return

  const rect = e.target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const ctx = e.target.getContext("2d")
  ctx.lineTo(x, y)
  ctx.stroke()
}

function stopDrawing() {
  isDrawing = false
}

function handleTouch(e) {
  e.preventDefault()
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent(
    e.type === "touchstart" ? "mousedown" : e.type === "touchmove" ? "mousemove" : "mouseup",
    {
      clientX: touch.clientX,
      clientY: touch.clientY,
    },
  )
  e.target.dispatchEvent(mouseEvent)
}

function clearSignature(canvasId) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function setupFilePreview() {
  const fileInput = document.getElementById("evidencia")
  const preview = document.getElementById("imagePreview")

  fileInput.addEventListener("change", (e) => {
    preview.innerHTML = ""

    Array.from(e.target.files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = document.createElement("img")
          img.src = e.target.result
          img.alt = file.name
          preview.appendChild(img)
        }
        reader.readAsDataURL(file)
      }
    })
  })
}

function clearCompleteForm() {
  if (
    confirm(
      "¿Estás seguro de que deseas limpiar todo el formulario? Se perderán todas las partidas, firmas, observaciones y evidencia.",
    )
  ) {
    // Limpiar partidas
    partidas = []
    renderTable()
    updateSummary()
    updateTableVisibility()

    // Limpiar formulario de entrada
    clearForm()

    // Limpiar observaciones
    document.getElementById("observaciones").value = ""

    // Limpiar nombres de firmas
    document.getElementById("nombreEntrega").value = ""
    document.getElementById("nombreRecibe").value = ""

    // Limpiar firmas
    clearSignature("canvasEntrega")
    clearSignature("canvasRecibe")

    // Limpiar evidencia
    document.getElementById("evidencia").value = ""
    document.getElementById("imagePreview").innerHTML = ""

    showNotification("Formulario completo limpiado correctamente", "success")
  }
}

function submitCompleteForm() {
  // Validar que hay al menos una partida
  if (partidas.length === 0) {
    showNotification("Debe agregar al menos una partida antes de enviar", "error")
    return
  }

  // Validar nombres de firmas
  const nombreEntrega = document.getElementById("nombreEntrega").value.trim()
  const nombreRecibe = document.getElementById("nombreRecibe").value.trim()

  if (!nombreEntrega || !nombreRecibe) {
    showNotification("Debe completar los nombres de quien entrega y quien recibe", "error")
    return
  }

  // Validar que las firmas no estén vacías
  if (isCanvasEmpty("canvasEntrega") || isCanvasEmpty("canvasRecibe")) {
    showNotification("Debe completar ambas firmas antes de enviar", "error")
    return
  }

  // Recopilar toda la información
  console.log(partidas)
  const campos = {
    fecha: new Date().toISOString(),//✔️
    partidas: JSON.stringify(partidas) ,
    observaciones: document.getElementById("observaciones").value,//✔️
    nombreEntrega: nombreEntrega,//✔️
    nombreRecibe: nombreRecibe,//✔️
    resumen: {
      totalPartidas: partidas.length,
      totalCajas: partidas.reduce((sum, partida) => sum + partida.numeroCajas, 0),
      totalPiezas: partidas.reduce((sum, partida) => sum + partida.totalMultiplicado, 0),
      //aqui 
    },
  }
  juntarInformacion(campos)
  // Generar reporte completo
  // generateCompleteReport(formData)

  showNotification("Información enviada correctamente. Se ha generado el reporte.", "success")
}

function isCanvasEmpty(canvasId) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext("2d")
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  // Verificar si todos los píxeles son transparentes
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] !== 0) {
      // Canal alpha
      return false
    }
  }
  return true
}

function generateCompleteReport(data) {
  // Crear contenido del reporte
  let reportContent = `FORMATO DE SALIDA DE MATERIAL\n`
  reportContent += `Fecha de generación: ${formatDate(data.fecha.split("T")[0])}\n\n`

  reportContent += `PARTIDAS REGISTRADAS:\n`
  reportContent += `${"=".repeat(50)}\n`

  data.partidas.forEach((partida, index) => {
    reportContent += `${index + 1}. Fecha: ${formatDate(partida.fecha)}\n`
    reportContent += `   No. Parte: ${partida.numeroParte}\n`
    reportContent += `   Descripción: ${partida.descripcion}\n`
    reportContent += `   Cajas: ${partida.numeroCajas}\n`
    reportContent += `   Piezas: ${partida.cantidadPiezas}\n`
    reportContent += `   Total: ${partida.totalConcatenado} = ${partida.totalMultiplicado}\n\n`
  })

  reportContent += `RESUMEN TOTAL:\n`
  reportContent += `${"=".repeat(30)}\n`
  reportContent += `Total de Partidas: ${data.resumen.totalPartidas}\n`
  reportContent += `Total de Cajas: ${data.resumen.totalCajas}\n`
  reportContent += `Total de Piezas: ${data.resumen.totalPiezas}\n\n`

  if (data.observaciones) {
    reportContent += `OBSERVACIONES:\n`
    reportContent += `${"-".repeat(20)}\n`
    reportContent += `${data.observaciones}\n\n`
  }

  reportContent += `FIRMAS:\n`
  reportContent += `${"-".repeat(20)}\n`
  reportContent += `Entregó: ${data.nombreEntrega}\n`
  reportContent += `Recibió: ${data.nombreRecibe}\n\n`

  if (data.evidencia.length > 0) {
    reportContent += `EVIDENCIA ADJUNTA:\n`
    reportContent += `${"-".repeat(20)}\n`
    data.evidencia.forEach((archivo, index) => {
      reportContent += `${index + 1}. ${archivo}\n`
    })
  }

  // Descargar reporte como archivo de texto
  const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `reporte_salida_material_${new Date().toISOString().split("T")[0]}.txt`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// // funciones personalizadas

// let btnEnvio = document.getElementById("btnEnvio")

//   btnEnvio.addEventListener("click", ()=>{
//     let campos = {
//       folio: document.getElementById("folio"),
//       fecha : document.getElementById("fecha"),
//       planta : document.getElementById("planta"),
//       nombreParte : document.getElementById("nombreParte"),
//       numeroParte : document.getElementById("numeroParte"),
//       cantidad : document.getElementById("cantidad"),
//       controlCliente : document.getElementById("controlCliente"),
//       entrego:document.getElementById("entregoNombre"),
//       recibio: document.getElementById("recibioNombre"),
//       observaciones : document.getElementById("observaciones"),
//       firmaEntrega : document.getElementById("entregaCanvas"),
//       firmaRecibe : document.getElementById("reciboCanvas"),
//       imagenEmbarque: document.getElementById("fotoEmbarque")  
//     }

//     let texto = validacionCampos(campos)
//     if (!texto){
//       alerta('debes completar todos los campos')
//       return
//     }
//     let firmas = validacionFirma(campos)
//     if (!firmas){
//       alerta('se requiere que esten ambas firmas')
//       return
//     }
//     let imagen = campos.imagenEmbarque.files.length
//     if(imagen <= 0){
//       alerta('se requiere la foto del embarque')
//       return
//     }
    
//     if (texto && firmas && imagen > 0){
//       alert("entro a la funcion para juntar la informacion")
//       juntarInformacion(campos)
//     }
//   })


async function juntarInformacion(campos){
  let formData = new FormData();
  formData.append('fecha', campos.fecha)
  formData.append('partidas', campos.partidas)
  formData.append('observaciones', campos.observaciones)
  formData.append('entrego', campos.nombreEntrega)
  formData.append('recibio', campos.nombreRecibe)
  formData.append('resumen', JSON.stringify(campos.resumen))
  delete campos.fecha
   delete campos.partidas
   delete campos.observaciones
   delete campos.nombreEntrega
   delete campos.nombreRecibe
   delete campos.resumen
  // Object.entries(campos).forEach(([campo, valor])=>{
  //   formData.append(campo, valor.value)
  //   console.log(`el campo es ${campo}, el valor es${valor.value}`)
    
  // })

  
  formData.append("_csrf", tok);
  

  let folio = generarFolioUnico();
  formData.append("folio", folio);
  let firmas = {
    firmaEntrega: document.getElementById("canvasEntrega"),
    firmaRecibe:  document.getElementById("canvasRecibe"),
  }
  Object.entries(firmas).forEach(([key, valor])=>{
    let data = valor.toDataURL('image/jpeg')
    let firma = conversionBlob(data)
    switch(key){
      case'firmaEntrega':
        formData.append("imagenes", firma, `firma entrega ${folio}.jpeg` )    
      break;
      default:
        formData.append("imagenes", firma, `firma recibe ${folio}.jpeg` )    
        break;
    }
  })
  formData.append("imagenes", document.getElementById("evidencia").files[0])
  await fetchGenerica("envioMaterial", formData, "admin-entrega-material") 
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

function generarFolioUnico() {
  const fecha = new Date();

  // Formato: YYYYMMDD-HHMMSS
  const fechaFormateada = fecha.toISOString().replace(/[-:T]/g, '').slice(0, 14);

  // Número aleatorio de 4 dígitos
  const aleatorio = Math.floor(1000 + Math.random() * 9000);

  // Folio final
  const folio = `FOL-${fechaFormateada}-${aleatorio}`;
  return folio;
}

function agregarProductos(){
  let combo = document.getElementById("numeroParte")
  let listaProductos = ``
  for(let i = 0;i< productos.length; i++){
    listaProductos += `<option value="${productos[i]["numeroParte"]}">${productos[i]["numeroParte"]} </option>`
  }
  combo.innerHTML = listaProductos
  combo.addEventListener('change', (e)=>{obtenerDescripcion(e.target.value)})
}

function obtenerDescripcion(nomPart){
  let inputDescripcion = document.getElementById("descripcion");
  let descripcion = productos.find((producto)=>producto.numeroParte ==nomPart )
  if (descripcion){
    inputDescripcion.value = descripcion.descripcion
  }
}




