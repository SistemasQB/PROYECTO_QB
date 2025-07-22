


// DOM Elements
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const dataTable = document.getElementById("dataTable")
const btnAgregar = document.getElementById("btnModal");


class TableManager {
  constructor(tableElement) {
    this.table = tableElement
    this.init()
  }

  init() {
    this.addTableInteractivity()
    this.animateProgressBars()
  }

  addTableInteractivity() {
    // Add click event to table rows
    const rows = this.table.querySelectorAll("tbody tr")
    rows.forEach((row) => {
      row.addEventListener("click", () => {
        this.highlightRow(row)
      })
    })
  }

  highlightRow(row) {
    // Remove previous highlights
    const previousHighlight = this.table.querySelector(".row-highlighted")
    if (previousHighlight) {
      previousHighlight.classList.remove("row-highlighted")
    }

    // Add highlight to clicked row
    row.classList.add("row-highlighted")

    // Add CSS for highlight effect
    if (!document.querySelector("#highlight-style")) {
      const style = document.createElement("style")
      style.id = "highlight-style"
      style.textContent = `
                .row-highlighted {
                    background-color: var(--light-blue) !important;
                    transform: scale(1.01);
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
                }
            `
      document.head.appendChild(style)
    }
  }

  animateProgressBars() {
    const progressBars = this.table.querySelectorAll(".progress-bar")
    
    // Animate progress bars on page load
    setTimeout(() => {
      progressBars.forEach((bar) => {
        const width = bar.style.width
        bar.style.width = "0%"
        setTimeout(() => {
          bar.style.width = width
        }, 200)
      })
    }, 500)
  }

  // Method to filter table (for future functionality)
  filterTable(searchTerm) {
    const rows = this.table.querySelectorAll("tbody tr")

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      if (text.includes(searchTerm.toLowerCase())) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }
}
// Mobile Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  })
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  }
})

// Table functionality

// Initialize table manager


// Smooth scrolling for navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href")

    if (targetId.startsWith("#")) {
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
  class TableManager {
  constructor(tableElement) {
    this.table = tableElement
    this.init()
  }

  init() {
    this.addTableInteractivity()
    this.animateProgressBars()
  }

  addTableInteractivity() {
    // Add click event to table rows
    const rows = this.table.querySelectorAll("tbody tr")
    rows.forEach((row) => {
      row.addEventListener("click", () => {
        this.highlightRow(row)
      })
    })
  }

  highlightRow(row) {
    // Remove previous highlights
    const previousHighlight = this.table.querySelector(".row-highlighted")
    if (previousHighlight) {
      previousHighlight.classList.remove("row-highlighted")
    }

    // Add highlight to clicked row
    row.classList.add("row-highlighted")

    // Add CSS for highlight effect
    if (!document.querySelector("#highlight-style")) {
      const style = document.createElement("style")
      style.id = "highlight-style"
      style.textContent = `
                .row-highlighted {
                    background-color: var(--light-blue) !important;
                    transform: scale(1.02);
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
                }
            `
      document.head.appendChild(style)
    }
  }

  animateProgressBars() {
    const progressBars = this.table.querySelectorAll(".progress-fill")

    // Animate progress bars on page load
    setTimeout(() => {
      progressBars.forEach((bar) => {
        const width = bar.style.width
        bar.style.width = "0%"
        setTimeout(() => {
          bar.style.width = width
        }, 500)
      })
    }, 500)
  }

  // Method to add new row (for future functionality)
  // addRow(rowData) {
  //   const tbody = this.table.querySelector("tbody")
  //   const newRow = document.createElement("tr")

  //   newRow.innerHTML = `
  //           <td data-label="Minuta">${rowData.minuta}</td>
  //           <td data-label="Responsable">${rowData.responsable}</td>
  //           <td data-label="Área">${rowData.area}</td>
  //           <td data-label="Prioridad"><span class="priority ${rowData.prioridadClass}">${rowData.prioridad}</span></td>
  //           <td data-label="Estatus"><span class="status ${rowData.estatusClass}">${rowData.estatus}</span></td>
  //           <td data-label="% Avance">
  //               <div class="progress-bar">
  //                   <div class="progress-fill" style="width: ${rowData.avance}%">${rowData.avance}%</div>
  //               </div>
  //           </td>
  //           <td data-label="Finalizada">${rowData.finalizada}</td>
  //           <td data-label="Asignada-Compromiso">${rowData.compromiso}</td>
  //           <td data-label="Evaluación"><span class="evaluation ${rowData.evaluacionClass}">${rowData.evaluacion}</span></td>
  //       `

  //   tbody.appendChild(newRow)
  //   this.addTableInteractivity()
  // }

  // Method to filter table (for future functionality)
  filterTable(searchTerm) {
    const rows = this.table.querySelectorAll("tbody tr")

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      if (text.includes(searchTerm.toLowerCase())) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }
}


  // Add CSS for loading animation
  if (!document.querySelector("#loading-style")) {
    
    const style = document.createElement("style")
    style.id = "loading-style"
    style.textContent = `
            body:not(.loaded) .main-content {
                opacity: 0;
                transform: translateY(20px);
            }
            
            .main-content {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.6s ease;
            }
        `
    document.head.appendChild(style)
  }
})

// Responsive table scroll indicator
function addScrollIndicator() {
  const tableContainer = document.querySelector(".table-container")

  if (window.innerWidth <= 768) {
    const indicator = document.createElement("div")
    indicator.className = "scroll-indicator"
    indicator.innerHTML = "← Desliza para ver más →"
    indicator.style.cssText = `
            text-align: center;
            padding: 10px;
            background-color: var(--light-blue);
            color: var(--primary-blue);
            font-size: 0.8rem;
            font-weight: bold;
        `

    if (!tableContainer.querySelector(".scroll-indicator")) {
      tableContainer.appendChild(indicator)
    }
  }
}

// Call on resize
window.addEventListener("resize", addScrollIndicator)
addScrollIndicator()


//---------------------------------------------------- agregar eventos --------------------------------------------

btnAgregar.addEventListener("click", ()=>{
  
  let modal = document.getElementById('modalNuevo');
  //TODO: condicional para saber si el modal esta abierto
   if (modal == null){
    let miDiv = document.createElement('div');
    miDiv.classList.add('modal', 'modal-fade'); 
    miDiv.setAttribute('id', 'modalNuevo');
    miDiv.setAttribute('tabindex', '-1'); 
    miDiv.setAttribute('aria-labelledby', 'modalNuevoLabel');
    miDiv.setAttribute('aria-hidden', 'true');
    let responsables = ``

    for(let i = 0;i<usuarios.length;i++ ){
      responsables += `<option value="${usuarios[i]["apellidopaterno"]} ${usuarios[i]["apellidomaterno"]} ${usuarios[i]["nombre"]}">${usuarios[i]["apellidopaterno"]} ${usuarios[i]["apellidomaterno"]} ${usuarios[i]["nombre"]}</option>`
    }
    let modalNuevo = `
    
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-plus-circle me-2"></i>Nueva Actividad
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formNuevaMinuta">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="area" class="form-label">Minuta</label>
                                <input type="text" class="form-control" id="minuta" placeholder='' required name = 'minuta' required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="minuta" class="form-label">Titulo Nueva Actividad*</label>
                                <input type="text" class="form-control" id="nombreActividad" placeholder='alias, titulo o nombre de la actividad' required name = 'nombreActividad'>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="minuta" class="form-label">Descripcion de la actividad</label>
                                <input type="text" class="form-control" id="descripcionActividad" placeholder='descripcion breve de la actividad' required name = 'descripcionACtividad'>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="responsable" class="form-label">Responsable</label>
                                <select class="form-select" id="responsable" required name = 'responsable'>
                                    ${responsables}
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="area" class="form-label">Área</label>
                                <select class="form-select" id="area" required name = 'area'>
                                    <option value="Calidad" selected>Calidad</option>
                                    <option value="Sorteo">Sorteo</option>
                                    <option value="S.W.A.T">S.W.A.T</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="prioridad" class="form-label">Prioridad</label>
                                <select class="form-select" id="prioridad" required name='prioridad'>
                                    <option value="Crítica" selected>Crítica</option>
                                    <option value="Alta" >Alta</option>
                                    <option value="Media" >Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="estatus" class="form-label">Estatus</label>
                                <select class="form-select" id="estatus" required name='estatus'>
                                    <option value="Por Iniciar" selected>Por Iniciar</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Terminada">Terminada</option>
                                    <option value="Completada">Completada</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="avance" class="form-label">% Avance</label>
                                <input type="number" class="form-control" id="avance" min="0" max="100" value="0" required name = 'avance'>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="compromiso" class="form-label">Asignada-Compromiso</label>
                                <input type="date" class="form-control" id="fechaCompromiso" required name = 'fechaCompromiso'>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="evaluacion" class="form-label">Evaluación</label>
                                <select class="form-select" id="evaluacion" required name = 'evaluacion'>
                                    <option value="Pendiente" selected>Pendiente</option>
                                    <option value="Aceptada">Aceptada</option>
                                    <option value="Rechazada">Rechazada</option>
                                    
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btnCancelar" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" id='btnEnvio'>
                        <i class="fas fa-save me-1"></i>Guardar Minuta
                    </button>
                </div>
            </div>
        </div>
    `
    miDiv.innerHTML = modalNuevo;
    let padre = document.body;
    padre.appendChild(miDiv);
    modal = miDiv

    // evento de click al envio de la actividad:
    modal.addEventListener("click", (evento)=>{
      if(evento.target.classList.contains("modal")){
      modal.classList.remove('show');
      document.body.removeChild(modal)
      // modal.setAttribute('aria-hidden', 'true');
      }
    })
     // Agregar evento al botón de cerrar
    const closeButton = modal.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.removeChild(modal)
      // modal.setAttribute('aria-hidden', 'true');
    });

    // Agregar evento al botón de cancelar
    const cancelButton = modal.querySelector('.btnCancelar');
    cancelButton.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.removeChild(modal)
      // modal.setAttribute('aria-hidden', 'true');
    });
  }
  const btnEnvio = document.getElementById("btnEnvio");
  btnEnvio.addEventListener("click", async ()=>{
    const minuta = document.getElementById("minuta");
    const titulo = document.getElementById("nombreActividad");
    const responsable = document.getElementById("responsable");
    const area = document.getElementById("area");
    const prioridad = document.getElementById("prioridad");
    const estatus = document.getElementById("estatus");
    const avance = document.getElementById("avance");
    const fechaCompromiso = document.getElementById("fechaCompromiso");
    const evaluacion = document.getElementById("evaluacion");
    const descripcion = document.getElementById("descripcionActividad");
    
    let datos = {
      minuta: minuta.value,
      nombreActividad : titulo.value,
      responsable: responsable.value,
      area: area.value,
      prioridad: prioridad.value,
      estatus : estatus.value,
      avance: avance.value,
      fechaCompromiso: fechaCompromiso.value,
      evaluacion:evaluacion.value,
      descripcion: descripcion.value
    }
    await alertaFetchCalidad("http://192.168.10.65:3000/calidad2/procesoActividades",{tipo:"insert", datos: datos, _csrf: tok},"http://192.168.10.65:3000/calidad2/bitacoraActividades")
    
  });

  // Mostrar el modal
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
   
   
})
const tableManager = new TableManager(dataTable)

document.addEventListener("DOMContentLoaded", () => {
  
  // Event listeners para búsqueda
  const inputBusqueda = document.getElementById("busquedaTabla")
  const botonLimpiar = document.getElementById("limpiarBusqueda")
  

  if (inputBusqueda) {
    // Búsqueda en tiempo real
    inputBusqueda.addEventListener("input", function () {
      filtrarTabla(this.value)
    })

    // Búsqueda al presionar Enter
    inputBusqueda.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        filtrarTabla(this.value)
      }
    })

    // Limpiar búsqueda con Escape
    inputBusqueda.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        limpiarBusqueda()
      }
    })
  }

  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", limpiarBusqueda)
  }

  let botonesEdicion = document.querySelectorAll("[data-idedicion]")
  let btnEliminacion = document.querySelectorAll("[data-idEliminacion]")
  let btnVisualizar = document.querySelectorAll("[data-idVisualizacion]")
  botonesEdicion.forEach((btn)=>{
    btn.addEventListener("click", ()=>{modalEdicion(btn)});
  })
  btnEliminacion.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
      let id = btn.getAttribute('data-idEliminacion')
      eliminacion({id: id})
    })
  });
  btnVisualizar.forEach((btn) => {
        btn.addEventListener('click', (evento) => {
            let id = btn.getAttribute('data-idVisualizacion')
            modalVisualizar({id: id})
        })
  })

  
})

// funciones
function eliminacion({id}){
  Swal.fire({
          title: "Eliminacion de actividad",
          text: `Estas seguro de querer eliminar la actividad `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, Bórrala!"
        }).then(async (result) => {
          if (result.isConfirmed) {
            alertaFetchCalidad("http://192.168.10.65:3000/calidad2/procesoActividades",{id:id, _csrf: tok, tipo: 'delete'},"http://192.168.10.65:3000/calidad2/bitacoraActividades")
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
})
}

async function modalEdicion(btn){
  let modal = document.getElementById('modalNuevo');
  let id
  if (modal == null){
      id = btn.getAttribute("data-idedicion")
      let padre = document.createElement("div")
      const actividad = actividades.find((actividad)=>actividad.id == id)
      padre.classList.add('modal', 'modal-fade', 'show'); 
      let responsables = ``

    for(let i = 0;i<usuarios.length;i++ ){
      responsables += `<option value="${usuarios[i]["apellidopaterno"]} ${usuarios[i]["apellidomaterno"]} ${usuarios[i]["nombre"]}">${usuarios[i]["apellidopaterno"]} ${usuarios[i]["apellidomaterno"]} ${usuarios[i]["nombre"]}</option>`
    }
      let contenido = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-plus-circle me-2"></i>${actividad.nombreActividad}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formNuevaMinuta">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="minuta" class="form-label">Minuta</label>
                                <input type="text" class="form-control" id="minuta" placeholder='' 
                                required name='minuta' value = '${actividad.nombreActividad}'>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label for="minuta" class="form-label">Titulo de la Actividad</label>
                                <input type="text" class="form-control" id="nombreActividad" placeholder='alias, titulo o nombre de la actividad' 
                                required name = 'nombreActividad' value = '${actividad.nombreActividad}'>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="minuta" class="form-label">Descripcion de la actividad</label>
                                <input type="text" class="form-control" id="descripcionActividad" placeholder='descripcion breve de la actividad' required name = 'descripcionACtividad'>
                            </div>

                            <div class="col-md-12 mb-3">
                                <label for="responsable" class="form-label">Responsable</label>
                                <select class="form-select" id="responsable" required name = 'responsable'>
                                     ${responsables}
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="area" class="form-label">Área</label>
                                <select class="form-select" id="area" required name = 'area'>
                                    <option value="Calidad" selected>Calidad</option>
                                    <option value="Sorteo">Sorteo</option>
                                    <option value="S.W.A.T">S.W.A.T</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="prioridad" class="form-label">Prioridad</label>
                                <select class="form-select" id="prioridad" required name='prioridad'>
                                    <option value="Crítica" selected>Crítica</option>
                                    <option value="Alta" >Alta</option>
                                    <option value="Media" >Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="estatus" class="form-label">Estatus</label>
                                <select class="form-select" id="estatus" required name='estatus'>
                                    <option value="Por Iniciar" selected>Por Iniciar</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Terminada">Terminada</option>
                                    <option value="Completada">Completada</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="avance" class="form-label">% Avance</label>
                                <input type="number" class="form-control" id="avance" min="0" max="100" value="0" required name = 'avance'>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="compromiso" class="form-label">Asignada-Compromiso</label>
                                <input type="date" class="form-control" id="fechaCompromiso" required name = 'fechaCompromiso'>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="evaluacion" class="form-label">Evaluación</label>
                                <select class="form-select" id="evaluacion" required name = 'evaluacion'>
                                    <option value="Pendiente" selected>Pendiente</option>
                                    <option value="Aceptada">Aceptada</option>
                                    <option value="Rechazada">Rechazada</option>
                                    
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btnCancelar" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" id='btnEnvio'>
                        <i class="fas fa-save me-1"></i>Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    `
    padre.innerHTML = contenido
    let bodyDoc = document.body
    bodyDoc.appendChild(padre)
    
    // selectores 
    let resp = document.getElementById("responsable")
    resp.value = actividad.responsable
    const area = document.getElementById("area");
    area.value = actividad.area
    const prioridad = document.getElementById("prioridad");
    prioridad.value = actividad.prioridad
    const estatus = document.getElementById("estatus");
    estatus.value = actividad.estatus;
    const avance = document.getElementById("avance");
    avance.value = actividad.avance
    const fechaCompromiso = document.getElementById("fechaCompromiso");  
    let fecha = new Date(actividad.fechaCompromiso)
    let formatoFecha = fecha.toISOString().split("T")[0]
    fechaCompromiso.value = formatoFecha
    const evaluacion = document.getElementById("evaluacion");
    evaluacion.value = actividad.evaluacion
    const minuta = document.getElementById("minuta");
    minuta.value  = actividad.minuta
    const descripcionActividad = document.getElementById("descripcionActividad");
    descripcionActividad.value  = actividad.descripcion

    

    padre.addEventListener("click", (evento)=>{
      if(evento.target.classList.contains("modal")){
      padre.classList.remove('show');
      document.body.removeChild(padre)
      // padre.setAttribute('aria-hidden', 'true');
      }
    })
     // Agregar evento al botón de cerrar
    const closeButton = padre.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
      padre.classList.remove('show');
      document.body.removeChild(padre)
      // padre.setAttribute('aria-hidden', 'true');
    });

    // Agregar evento al botón de cancelar
    const cancelButton = padre.querySelector('.btnCancelar');
    cancelButton.addEventListener('click', () => {
      padre.classList.remove('show');
      document.body.removeChild(padre)
      // padre.setAttribute('aria-hidden', 'true');
    });
  }
  const btnEnvio = document.getElementById("btnEnvio");
  btnEnvio.addEventListener("click", async ()=>{
  const titulo = document.getElementById("nombreActividad");
    
    let datos = {
      minuta: minuta.value,
      nombreActividad : titulo.value,
      responsable: responsable.value,
      area: area.value,
      prioridad: prioridad.value,
      estatus : estatus.value,
      avance: avance.value,
      fechaCompromiso: fechaCompromiso.value,
      evaluacion:evaluacion.value,
      
    }
    
    await alertaFetchCalidad("http://192.168.10.65:3000/calidad2/procesoActividades",{_csrf: tok, tipo: 'update',datos: datos, id: id},"http://192.168.10.65:3000/calidad2/bitacoraActividades")
    
  });}




function filtrarTabla(termino) {
  const filas = document.querySelectorAll("#dataTable tbody tr")
  const tbody = document.querySelector("#dataTable tbody tr")
  let filasVisibles = 0

  // Limpiar resaltados previos
  limpiarResaltados()

  // Si no hay término de búsqueda, mostrar todas las filas
  
  if (!termino.trim()) {
    filas.forEach((fila) => {
      fila.classList.remove("fila-oculta")
      fila.classList.add("fila-visible")
    })
    
    actualizarContadorResultados(filas.length, filas.length)
    eliminarFilaSinResultados()
    return
  }
  
  const terminoLower = termino.toLowerCase()

  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll("td")
    let coincidencia = false

    // Buscar en todas las celdas excepto la última (acciones)
    for (let i = 0; i < celdas.length - 1; i++) {
      const textoCelda = celdas[i].textContent.toLowerCase()
        
      if (textoCelda.includes(terminoLower)) {
        
        coincidencia = true
        //Resaltar texto encontrado
        // resaltarTexto(celdas[i], termino)
      }
    }

    if (coincidencia) {
      fila.classList.remove("fila-oculta")
      fila.classList.add("fila-visible")
      filasVisibles++
    } else {
      fila.classList.add("fila-oculta")
      fila.classList.remove("fila-visible")
    }
    
}
  )
}

function limpiarResaltados() {
  const elementosResaltados = document.querySelectorAll(".texto-resaltado")
  elementosResaltados.forEach((elemento) => {
    const padre = elemento.parentNode
    padre.textContent = padre.textContent // Esto elimina el HTML y deja solo el texto
  })
}



// funcion resaltar texto no es utilizada porque quita estilos de otras etiquetas y genera funcionamiento incorrecto
function resaltarTexto(celda, termino) {
  const textoOriginal = celda.textContent
  const terminoLower = termino.toLowerCase()
  const textoLower = textoOriginal.toLowerCase()

  if (textoLower.includes(terminoLower)) {
    const regex = new RegExp(`(${termino})`, "gi")
    const textoResaltado = textoOriginal.replace(regex, '<span class="texto-resaltado">$1</span>')

    // Solo aplicar si la celda no contiene HTML complejo (como badges o progress bars)
    if (!celda.querySelector(".badge") && !celda.querySelector(".progress") && !celda.querySelector(".fas")) {
      celda.innerHTML = textoResaltado
    }
  }
}
function actualizarContadorResultados(visibles, total) {
  const contador = document.getElementById("resultadosBusqueda")
  if (visibles === total) {
    contador.textContent = `Mostrando todas las actividades (${total})`
    contador.className = "text-muted mt-1 d-block"
  } else if (visibles === 0) {
    contador.textContent = "No se encontraron resultados"
    contador.className = "text-danger mt-1 d-block"
  } else {
    contador.textContent = `Mostrando ${visibles} de ${total} actividades`
    contador.className = "text-success mt-1 d-block"
  }

  function eliminarFilaSinResultados() {
  const filaSinResultados = document.getElementById("fila-sin-resultados")
  if (filaSinResultados) {
    filaSinResultados.remove()
  }
}
}

function modalVisualizar({id}) {
    let miDiv = document.createElement('div');
    miDiv.classList.add('modal', 'modal-fade'); 
    miDiv.setAttribute('id', 'modalNuevo');
    miDiv.setAttribute('tabindex', '-1'); 
    miDiv.setAttribute('aria-labelledby', 'modalNuevoLabel');
    miDiv.setAttribute('aria-hidden', 'true');
    let modalNuevo = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-plus-circle me-2"></i>Nueva Actividad
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formNuevaMinuta">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="area" class="form-label">Minuta</label>
                                <input type="text" class="form-control" id="minuta" placeholder='' required name = 'minuta' required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="minuta" class="form-label">Titulo Nueva Actividad*</label>
                                <input type="text" class="form-control" id="nombreActividad" placeholder='alias, titulo o nombre de la actividad' required name = 'nombreActividad'>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="minuta" class="form-label">Descripcion de la actividad</label>
                                <input type="text" class="form-control" id="descripcionActividad" placeholder='descripcion breve de la actividad' required name = 'descripcionACtividad'>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="responsable" class="form-label">Responsable</label>
                                <select class="form-select" id="responsable" required name = 'responsable'>
                                    ${responsables}
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="area" class="form-label">Área</label>
                                <select class="form-select" id="area" required name = 'area'>
                                    <option value="Calidad" selected>Calidad</option>
                                    <option value="Sorteo">Sorteo</option>
                                    <option value="S.W.A.T">S.W.A.T</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="prioridad" class="form-label">Prioridad</label>
                                <select class="form-select" id="prioridad" required name='prioridad'>
                                    <option value="Crítica" selected>Crítica</option>
                                    <option value="Alta" >Alta</option>
                                    <option value="Media" >Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="estatus" class="form-label">Estatus</label>
                                <select class="form-select" id="estatus" required name='estatus'>
                                    <option value="Por Iniciar" selected>Por Iniciar</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Terminada">Terminada</option>
                                    <option value="Completada">Completada</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="avance" class="form-label">% Avance</label>
                                <input type="number" class="form-control" id="avance" min="0" max="100" value="0" required name = 'avance'>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="compromiso" class="form-label">Asignada-Compromiso</label>
                                <input type="date" class="form-control" id="fechaCompromiso" required name = 'fechaCompromiso'>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="evaluacion" class="form-label">Evaluación</label>
                                <select class="form-select" id="evaluacion" required name = 'evaluacion'>
                                    <option value="Pendiente" selected>Pendiente</option>
                                    <option value="Aceptada">Aceptada</option>
                                    <option value="Rechazada">Rechazada</option>
                                    
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btnCancelar" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" id='btnEnvio'>
                        <i class="fas fa-save me-1"></i>Guardar Minuta
                    </button>
                </div>
            </div>
        </div>
    `
  
}