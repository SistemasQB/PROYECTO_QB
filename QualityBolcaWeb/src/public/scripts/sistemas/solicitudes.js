// Datos de ejemplo simulando un JSON

// [
//   {
//     idFolio: "QS-001",
//     solcitante: "DE LUNA LUJAN OSCAR ARTURO",
//     fecha: "19/09/2025",
//     region: "Norte",
//     email: "oscar.deluna@empresa.com",
//     tipo: "Compresor Industrial",
//     descripcion:
//       "El equipo presenta fallas intermitentes en el sistema de refrigeración. Se requiere revisión completa del sistema y posible reemplazo de componentes.",
//     solucion:
//       "Se realizó el reemplazo del compresor principal y se ajustaron los parámetros de operación. El sistema ahora funciona correctamente.",
//     fechaSolucion: "25/09/2025",
//   },
//   {
//     idFolio: "QS-002",
//     solcitante: "MARTINEZ RODRIGUEZ MARIA ELENA",
//     fecha: "20/09/2025",
//     region: "Sur",
//     email: "maria.martinez@empresa.com",
//     tipo: "Bomba Centrífuga",
//     descripcion: "Bomba con ruido excesivo y vibración anormal. Requiere mantenimiento preventivo.",
//     solucion: "Se cambió el rodamiento principal y se balanceó el rotor. Se aplicó lubricación especializada.",
//     fechaSolucion: "23/09/2025",
//   },
//   {
//     idFolio: "QS-003",
//     solcitante: "GONZALEZ PEREZ JUAN CARLOS",
//     fecha: "21/09/2025",
//     region: "Centro",
//     email: "juan.gonzalez@empresa.com",
//     tipo: "Motor Eléctrico",
//     descripcion: "Motor presenta sobrecalentamiento después de 2 horas de operación continua.",
//     solucion: "",
//     fechaSolucion: "",
//   },
//   {
//     idFolio: "QS-004",
//     solcitante: "LOPEZ SANCHEZ ANA PATRICIA",
//     fecha: "22/09/2025",
//     region: "Este",
//     email: "ana.lopez@empresa.com",
//     tipo: "Válvula de Control",
//     descripcion: "Válvula no responde correctamente a las señales de control automático.",
//     solucion: "",
//     fechaSolucion: "",
//   },
//   {
//     idFolio: "QS-005",
//     solcitante: "RAMIREZ TORRES PEDRO LUIS",
//     fecha: "23/09/2025",
//     region: "Oeste",
//     email: "pedro.ramirez@empresa.com",
//     tipo: "Sistema HVAC",
//     descripcion: "Sistema de climatización con eficiencia reducida y consumo energético elevado.",
//     solucion:
//       "Se limpiaron los filtros, se calibraron los sensores de temperatura y se optimizó el programa de control.",
//     fechaSolucion: "26/09/2025",
//   },
// ]

let solicitudesData = [];


// Variables globales
let filteredSolicitudes = [...solicitudesData]

// Función para determinar el estatus basado en la solución
function getEstatus(solucion) {
  return solucion && solucion.trim() !== "" ? "Terminado" : "En Revisión"
}

// Función para obtener la clase CSS del estatus
function getStatusClass(estatus) {
  return estatus === "Terminado" ? "status-terminado" : "status-revision"
}

// Función para renderizar las solicitudes
function renderSolicitudes(solicitudes) {
  const container = document.getElementById("solicitudesList")
  const noResults = document.getElementById("noResults")

  if (solicitudes.length === 0) {
    container.style.display = "none"
    noResults.style.display = "block"
    return
  }

  container.style.display = "block"
  noResults.style.display = "none"

  container.innerHTML = solicitudes
    .map((solicitud) => {
      const estatus = getEstatus(solicitud.solucion)
      const statusClass = getStatusClass(estatus)

      let cBody = `<div class="solicitud-card">
                <div class="solicitud-content">
                    <div class="solicitud-info">
                        <div class="info-item">
                            <span class="info-label">Folio</span>
                            <span class="info-value idFolio">${solicitud.idFolio}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Nombre del Solicitante</span>
                            <span class="info-value">${solicitud.solcitante}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha</span>
                            <span class="info-value fecha">
                                <i class="fas fa-calendar"></i>
                                ${solicitud.fecha}
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Región</span>
                            <span class="info-value region">
                                <i class="fas fa-map-marker-alt"></i>
                                ${solicitud.region}
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha Solución</span>
                            <span class="info-value fecha-solucion">
                                <i class="fas fa-calendar-check"></i>
                                ${solicitud.fechaSolucion || "Pendiente"}
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Estatus</span>
                            <span class="status-badge ${statusClass}">${estatus}</span>
                        </div>
                    </div>`

      let cButton1 = `
                    <button class="show-info-btn" style='background-color: #2563eb;' onclick="showModal(${solicitud.idFolio})">
                        <i class="fas fa-eye"></i>
                        Mostrar Información
                    </button>
                    <button class="show-info-btn" style='background-color:rgb(27, 156, 23);' onclick="showModal2(${solicitud.idFolio})">
                        <i class="fas fa-eye"></i>
                        Mostrar Solución
                    </button>
                </div>
            </div>
        `
        let cButton2 = `
                    <button class="show-info-btn" style='background-color: #2563eb;' onclick="showModal(${solicitud.idFolio})">
                        <i class="fas fa-eye"></i>
                        Mostrar Información
                    </button>
                </div>
            </div>
        `

        if (solicitud.solucion) {
            return cBody + cButton1
        } else {
            return cBody + cButton2
          
        }

      
    })
    .join("")
}

// Función para filtrar solicitudes
function filterSolicitudes(searchTerm) {
  const term = searchTerm.toLowerCase()
  filteredSolicitudes = solicitudesData.filter(
    (solicitud) =>
      solicitud.idFolio.toLowerCase().includes(term) ||
      solicitud.solcitante.toLowerCase().includes(term) ||
      solicitud.region.toLowerCase().includes(term) ||
      getEstatus(solicitud.solucion).toLowerCase().includes(term),
  )
  renderSolicitudes(filteredSolicitudes)
}

// Función para mostrar el modal
function showModal(idFolio) {
  const solicitud = solicitudesData.find((s) => s.idFolio === idFolio)
  if (!solicitud) return

  const estatus = getEstatus(solicitud.solucion)
  const statusClass = estatus === "Terminado" ? "terminado" : "revision"

  // Llenar los campos del modal
  document.getElementById("modalFolio").textContent = estatus
  document.getElementById("modalFolio").className = `idFolio-status ${statusClass}`
  document.getElementById("modalFecha").value = solicitud.fecha
  document.getElementById("modalRegion").value = solicitud.region
  document.getElementById("modalNombre").value = solicitud.solcitante
  document.getElementById("modalEmail").value = solicitud.email
  document.getElementById("modalTipoEquipo").value = solicitud.tipo
  document.getElementById("modalDescripcion").value = solicitud.descripcion
  document.getElementById("modalFolio").textContent = solicitud.idFolio

  // Mostrar/ocultar secciones según si hay solución
  const solucionGroup = document.getElementById("solucionGroup")
  const fechaSolucionGroup = document.getElementById("fechaSolucionGroup")

  if (solicitud.solucion && solicitud.solucion.trim() !== "") {
    solucionGroup.style.display = "block"
    fechaSolucionGroup.style.display = "block"
  } else {
    solucionGroup.style.display = "none"
    fechaSolucionGroup.style.display = "none"
  }

  // Mostrar el modal
  document.getElementById("modal").style.display = "block"
}

function showModal2(idFolio) {
  const solicitud = solicitudesData.find((s) => s.idFolio === idFolio)
  if (!solicitud) return

  // const estatus = getEstatus(solicitud.solucion)
  // const statusClass = estatus === "Terminado" ? "terminado" : "revision"

  // Llenar los campos del modal
  // document.getElementById("modalFolio").textContent = estatus
  // document.getElementById("modalFolio").className = `idFolio-status ${statusClass}`
  // document.getElementById("modalFecha").value = solicitud.fecha
  // document.getElementById("modalRegion").value = solicitud.region
  document.getElementById("modalNombre2").value = solicitud.solcitante
  // document.getElementById("modalEmail").value = solicitud.email
  // document.getElementById("modalTipoEquipo").value = solicitud.tipo
  // document.getElementById("modalDescripcion").value = solicitud.descripcion
  document.getElementById("modalSolucion2").value = solicitud.solucion
  document.getElementById("modalFechaSolucion2").value = solicitud.fechaSolucion
  document.getElementById("modalFolio2").textContent = solicitud.idFolio

  // Mostrar/ocultar secciones según si hay solución
  // const solucionGroup = document.getElementById("solucionGroup")
  // const fechaSolucionGroup = document.getElementById("fechaSolucionGroup")

  // if (solicitud.solucion && solicitud.solucion.trim() !== "") {
  //   solucionGroup.style.display = "block"
  //   fechaSolucionGroup.style.display = "block"
  // } else {
  //   solucionGroup.style.display = "none"
  //   fechaSolucionGroup.style.display = "none"
  // }

  // Mostrar el modal
  document.getElementById("modal2").style.display = "block"
}

// Función para cerrar el modal
function closeModal() {
  document.getElementById("modal").style.display = "none"
  document.getElementById("modal2").style.display = "none"
}

// Event listeners
function llenardatos(params) {


  // Renderizar solicitudes iniciales
    solicitudesData = params;
  renderSolicitudes(solicitudesData)

  // Configurar buscador
  const searchInput = document.getElementById("searchInput")
  searchInput.addEventListener("input", function () {
    filterSolicitudes(this.value)
  })

  // Configurar modal
  const modal = document.getElementById("modal")
  const modal2 = document.getElementById("modal2")
  const closeBtn = document.getElementsByClassName("close")

  console.log(closeBtn);
  

  closeBtn[0].addEventListener("click", () => {
    closeModal()
  })
  closeBtn[1].addEventListener("click", () => {
    closeModal()
  })

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal()
    }

    if (event.target === modal2) {
      closeModal()
    }
  })

  // Hacer la función showModal global
  window.showModal = showModal
  window.showModal2 = showModal2
}
