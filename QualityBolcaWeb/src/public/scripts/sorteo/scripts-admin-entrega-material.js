


// Función para formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

// Función para renderizar la tabla
function renderTable(embarquess) {
    const tbody = document.getElementById('embarquesTableBody');
    const noResults = document.getElementById('noResults');
    
    if (embarquess.length === 0) { //se quita data.length
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    // <td>${embarque.controlCliente}</td>
    // <td>${embarque.nombreParte}</td>
    //         <td><span class="badge badge-secondary">${embarque.cantidad}</span></td>
    //<td>${embarque.planta}</td>
    //<td style="font-family: monospace; font-size: 0.8em;">${embarque.numeroParte}</td>
    tbody.innerHTML = embarquess.map(embarque => {
        let elemento = `
        <tr>
            <td>${formatDate(embarque.fecha)}</td>
            <td><span class="badge badge-outline">${embarque.folio}</span></td>
            <td>${embarque.entrego}</td>
            <td>${embarque.recibio}</td>
            <td>
                <details>
                    <div class="truncate" title="partidas">`
                    let resumen = JSON.parse(embarque.resumen)
                    let partidas = JSON.parse(embarque.partidas)
                        for (let i = 0; i< partidas.length; i++){
                            let partida = partidas[i]
                            elemento+=`<p>numero de parte: ${partida.numeroParte}</p>`
                            elemento+=`<p>total de piezas: ${partida.totalMultiplicado.toLocaleString('en-US')}</p>`
                            
                        }
                        embarque.partidas

                    elemento+=`</div>
                </details>
            </td>`
            
            elemento+= `<td>${resumen.totalPiezas.toLocaleString('en-US')}</td>`
            elemento+=`<td>
                
                <div class="truncate" title="${embarque.observaciones}">
                    ${embarque.observaciones}
                </div>
                
            </td>
            <td style="text-align: center;">`
            
            if (embarque.imagenEmbarque != 'imagen sin declarar'){
                elemento += `
                                <button class="btn btn-outline btn-sm" onclick="openImageModal('${embarque.folio}', '/evidencias_sorteo/${encodeURIComponent(embarque.imagenEmbarque)}', '${embarque.fecha}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="generarFormato(${embarque.id})" >
                                    <i class="fa-solid fa-file"></i>
                                </button>
                                </td>`
                
            }else{
                    elemento += `
                                <button class="btn btn-outline btn-sm" onclick="generarFormato(${embarque.id})">
                                    <i class="fa-solid fa-file" ></i>
                                </button>
                                </td>`
            }
            
        elemento += `</tr>`
    return elemento
        }).join('')
        
}
//${encodeURIComponent(
// Función para filtrar la tabla
function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = embarques.filter(item =>
    Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm)
    )
);

    console.log(filteredData);
    renderTable(filteredData);
}

// Función para abrir modal de imagen
function openImageModal(folio, imageSrc, fecha) {
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    
    modalTitle.textContent = `Imagen de Embarque - ${folio}`;
    modalImage.src = imageSrc;
    modalImage.alt = `Embarque ${folio}`;
    
    modal.style.display = 'block';
}

// Función para cerrar modal de imagen
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Función para abrir modal de nuevo embarque
function openNewEmbarqueModal() {
    document.getElementById('newEmbarqueModal').style.display = 'block';
    // Establecer fecha actual por defecto
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
}

// Función para cerrar modal de nuevo embarque
function closeNewEmbarqueModal() {
    document.getElementById('newEmbarqueModal').style.display = 'none';
    document.getElementById('newEmbarqueForm').reset();
}

// Función para agregar nuevo embarque
function addNewEmbarque(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newEmbarque = {
        id: embarquesData.length + 1,
        fecha: formData.get('fecha'),
        folio: formData.get('folio'),
        planta: formData.get('planta'),
        numeroParte: formData.get('numeroParte'),
        nombreParte: formData.get('nombreParte'),
        cantidad: parseInt(formData.get('cantidad')),
        controlCliente: formData.get('controlCliente'),
        nombreEntrego: formData.get('nombreEntrego'),
        nombreRecibe: formData.get('nombreRecibe'),
        observaciones: formData.get('observaciones') || '',
        imagenEmbarque: "/placeholder.svg?height=100&width=100&text=Nuevo+Embarque"
    };
    
    // Manejar imagen si se seleccionó una
    const imageFile = formData.get('imagenEmbarque');
    if (imageFile && imageFile.size > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newEmbarque.imagenEmbarque = e.target.result;
            embarquesData.unshift(newEmbarque);
            renderTable();
            updateStats();
            closeNewEmbarqueModal();
        };
        reader.readAsDataURL(imageFile);
    } else {
        embarquesData.unshift(newEmbarque);
        renderTable();
        updateStats();
        closeNewEmbarqueModal();
    }
}

// Función para actualizar estadísticas
function updateStats() {
    const totalEmbarques = embarques.length;
    const totalPiezas = embarques.reduce((sum, item) =>{
        const resumen = JSON.parse(item.resumen)
        return sum + resumen.totalPiezas
        },0
    )
    
    let totalc = embarques.reduce((suma, partida) => {
        let fila = JSON.parse(partida.resumen)
        return suma + fila.totalCajas;

    },0)
    
    
    document.getElementById('totalEmbarques').textContent = totalEmbarques;
    document.getElementById('totalPiezas').textContent = totalPiezas.toLocaleString('en-US');
    document.getElementById('cajasEntregadas').textContent =  totalc.toLocaleString('en-US')
}

// Función para exportar datos
// function exportData() {
//     const csvContent = "data:text/csv;charset=utf-8," 
//         + "Fecha,Folio,Planta,Numero Parte,Nombre Parte,Cantidad,Control Cliente,Quien Entrego,Quien Recibe,Observaciones\n"
//         + embarquesData.map(row => 
//             `${row.fecha},${row.folio},${row.planta},${row.numeroParte},${row.nombreParte},${row.cantidad},${row.controlCliente},${row.nombreEntrego},${row.nombreRecibe},"${row.observaciones}"`
//         ).join("\n");
    
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "embarques.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }

// Cerrar modales al hacer clic fuera de ellos
window.onclick = function(event) {
    const imageModal = document.getElementById('imageModal');
    const newEmbarqueModal = document.getElementById('newEmbarqueModal');
    
    if (event.target === imageModal) {
        closeImageModal();
    }
    if (event.target === newEmbarqueModal) {
        closeNewEmbarqueModal();
    }
}

// Cerrar modales con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
        closeNewEmbarqueModal();
    }
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    
    renderTable(embarques);
    updateStats();
});
// Funciones de navegación
function navigateTo(page) {
  // Ocultar todas las páginas
  const pages = document.querySelectorAll(".page")
  pages.forEach((p) => p.classList.remove("active"))

  // Mostrar la página seleccionada
  const targetPage = document.getElementById(page + "-page")
  if (targetPage) {
    targetPage.classList.add("active")
  }

  // Actualizar enlaces activos
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => link.classList.remove("active"))

  const activeLink = document.querySelector(`[onclick="navigateTo('${page}')"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  // Cerrar menú móvil si está abierto
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")
  navMenu.classList.remove("active")
  hamburger.classList.remove("active")
}

// Toggle del menú móvil
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")

  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
}

// Cerrar menú móvil al hacer clic fuera
document.addEventListener("click", (event) => {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")
  const navbar = document.querySelector(".navbar")

  if (!navbar.contains(event.target)) {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  }
})

// Manejar redimensionamiento de ventana
window.addEventListener("resize", () => {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")

  if (window.innerWidth > 768) {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  }
})

async function generarFormato(id){
    let embarque = embarques.find((e)=>e.id === id);
    let f = new Date(embarque.fecha)
    let fe = f.toLocaleDateString('es-ES')

    
    let partidas = JSON.parse(embarque.partidas)
    let lista = partidas.map((partida) => {
        return  {
            numeroParte: partida.numeroParte,
            descripcion: partida.descripcion,
            cantidadTotal: partida.totalConcatenado,
            unidad: 'cajas',

        }
    })
    
     partidas = JSON.parse(embarque.resumen);
     let totalPiezas = partidas.totalPiezas.toLocaleString('en-US');
     
         let totales=  {
            numeroParte: 'Totales',
            descripcion: '---',
            cantidadTotal: totalPiezas,
            unidad: 'piezas'
         }
     
        lista.push(totales)
        console.log(lista)
    let datos = {
        fecha: fe,
        titulo: `COMPROBANTE DE EMBARQUE ${embarque.folio}`,
        tabla: lista
    };
    await crearFormato(datos);
}

async function crearFormato( info){
    //logoBase64, se agrego esto a los parametros
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Insertar logo (ajusta posición y tamaño según tu diseño)
    // if (logoBase64) {
    //   doc.addImage(logoBase64, "PNG", 150, 10, 40, 20); // x, y, width, height
    // }

    // Encabezado
    doc.setFontSize(16);
    doc.text(info.titulo || "Documento", 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${info.fecha}`, 14, 30);

    // Tabla
    const columns = [
      { header: "Número de Parte", dataKey: "numeroParte" },
      { header: "Descripción", dataKey: "descripcion" },
      { header: "Cantidad Total", dataKey: "cantidadTotal" },
      { header: "Unidad", dataKey: "unidad" },
      
    ];

    doc.autoTable({
      startY: 40,
      columns,
      body: info.tabla,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, halign: "left" },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    // z

    // Descargar automáticamente
    doc.save(`${info.titulo || "documento"}.pdf`);
}