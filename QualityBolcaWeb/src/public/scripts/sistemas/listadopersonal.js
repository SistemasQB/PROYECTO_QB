    // Datos de ejemplo de colaboradores
const colaboradores = [
    {
        id: 1,
        nombre: "ALFARO GODINEZ PILAR ANDREA",
        puesto: "Supervisor de Proyecto",
        firmado: true,
        equipos: [
            { tipo: "Laptop", marca: "Dell", modelo: "Latitude 5520", serie: "ABC123", estado: "Activo" },
            { tipo: "Mouse", marca: "Logitech", modelo: "MX Master 3", serie: "DEF456", estado: "Activo" },
            { tipo: "Monitor", marca: "Samsung", modelo: "24'", serie: "GHI789", estado: "Activo" },
        ],
    },
    {
        id: 2,
        nombre: "ALMARAZ ESTRADA CLAUDIA PATRICIA",
        puesto: "Líder de Sorteo",
        firmado: true,
        equipos: [
            { tipo: "Laptop", marca: "HP", modelo: "EliteBook 840", serie: "JKL012", estado: "Activo" },
            { tipo: "Teléfono", marca: "iPhone", modelo: "13", serie: "MNO345", estado: "Activo" },
        ],
    },
    {
        id: 3,
        nombre: "ANDRADE MONTAÑEZ DANIELA LIZETH",
        puesto: "Auxiliar de comercialización y ventas",
        firmado: true,
        equipos: [
            { tipo: "Laptop", marca: "Lenovo", modelo: "ThinkPad E14", serie: "PQR678", estado: "Activo" },
            { tipo: "Impresora", marca: "Canon", modelo: "PIXMA", serie: "STU901", estado: "Activo" },
        ],
    },
    {
        id: 4,
        nombre: "ARIAS SORIA LINDA LIZBETH",
        puesto: "Líder de Sorteo",
        firmado: true,
        equipos: [
            { tipo: "Tablet", marca: "iPad", modelo: "Air", serie: "VWX234", estado: "Activo" },
            { tipo: "Teclado", marca: "Apple", modelo: "Magic Keyboard", serie: "YZA567", estado: "Activo" },
        ],
    },
    {
        id: 5,
        nombre: "BEGINES OROZCO EDUARDO",
        puesto: "Gerente Nacional de Sorteo",
        firmado: true,
        equipos: [
            { tipo: "Laptop", marca: "MacBook", modelo: "Pro 16", serie: "BCD890", estado: "Activo" },
            { tipo: "Monitor", marca: "LG", modelo: "27' 4K", serie: "EFG123", estado: "Activo" },
            { tipo: "Webcam", marca: "Logitech", modelo: "C920", serie: "HIJ456", estado: "Activo" },
        ],
    },
    {
        id: 6,
        nombre: "CADENA MENDOZA EVA GABRIELA",
        puesto: "Jefe de Compras y Suministros",
        firmado: true,
        equipos: [
            { tipo: "Laptop", marca: "ASUS", modelo: "ZenBook", serie: "KLM789", estado: "Activo" },
            { tipo: "Scanner", marca: "Epson", modelo: "V600", serie: "NOP012", estado: "Activo" },
        ],
    },
];

// Variables globales
let filteredColaboradores = [...colaboradores];

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const colaboradoresGrid = document.getElementById('colaboradoresGrid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // renderColaboradores();
    setupEventListeners();
});

function setupEventListeners() {
    // Búsqueda
    searchInput.addEventListener('input', handleSearch);
    
    // Modal
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredColaboradores = colaboradores.filter(colaborador =>
        colaborador.nombre.toLowerCase().includes(searchTerm) ||
        colaborador.puesto.toLowerCase().includes(searchTerm)
    );
    renderColaboradores();
}

function renderColaboradores() {
    colaboradoresGrid.innerHTML = '';
    
    filteredColaboradores.forEach(colaborador => {
        const cardElement = createColaboradorCard(colaborador);
        colaboradoresGrid.appendChild(cardElement);
    });
}

function createColaboradorCard(colaborador) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-user-info">
                <div class="user-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="user-details">
                    <h3 class="user-name">${colaborador.nombre}</h3>
                    <p class="user-position">${colaborador.puesto}</p>
                </div>
            </div>
        </div>
        <div class="card-content">
            <div class="status-badge">
                Firmado
            </div>
            <div class="button-grid">
                <button class="btn btn-outline" onclick="verEquipos(${colaborador.id})">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Ver Equipos
                </button>
                <button class="btn btn-outline">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Añadir
                </button>
                <button class="btn btn-outline">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Remover
                </button>
                <button class="btn btn-destructive">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="17" y1="8" x2="22" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="22" y1="8" x2="17" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Dar Baja
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function verEquipos(colaboradorId) {
    const colaborador = colaboradores.find(c => c.id === colaboradorId);
    if (colaborador) {
        showModal(colaborador);
    }
}

function showModal(colaborador) {
    const currentDate = new Date().toLocaleDateString('es-ES');

    vLista = JSON.parse(colaborador);

    rid2 = JSON.stringify(vLista.idInventario_concat).split(',');
    rtipo = JSON.stringify(vLista.tipo_concat).split(',');
    rmarca = JSON.stringify(vLista.marca_concat).split(',');
    rserie = JSON.stringify(vLista.serie).split(',');
    restado = JSON.stringify(vLista.estado).split(',');
    raccesorios = JSON.stringify(vLista.accesorios).split(',');
    rdetalles = JSON.stringify(vLista.detalles).split(',');

    console.log( rid2);
    

    let vbody = '';
    let Vhtmlheader = '';
    let Vhtmlfooter = '';
    let Vhtmlbody = '';

    Vhtmlheader = 
    `
    <div class="vale-header">
            <div class="vale-logo">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzAwNzJiYyIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RQjwvdGV4dD4KPC9zdmc+" alt="Quality BOLCA Logo">
                <div>
                    <h2 style="color: #0072bc;">Quality BOLCA</h2>
                </div>
            </div>
            <div class="vale-title">
                <h2>Vale de asignación de equipos</h2>
                <p>Documento de entrega y responsabilidad</p>
                <p>Folio: 38</p>
            </div>
            <div class="vale-info">
                <p><strong>Código:</strong> QB-FR-A-12-01</p>
                <p><strong>Rev:</strong> 00</p>
                <p><strong>Fecha de emisión:</strong> 26-05-2025</p>
                <p><strong>Fecha de revisión:</strong> N/A</p>
            </div>
        </div>
                <div>
            <h3 class="section-title">Información del Equipo</h3>
            <div class="equipment-grid">
    `

    // ciclo para crear los elementos del inventario
    // let idInventario = rid2.split(',');
    // let vtipo = vLista.rtipo.split(',');
    // let vmarca = vLista.rmarca.split(',');
    // let vserie = vLista.rserie.split(',');
    // let vestado = vLista.restado.split(',');
    // let vaccesorios = vLista.raccesorios.split(',');
    // let vdetalles = vLista.rdetalles.split(',');
    for (let i = 0; i < rid2.length; i++) {
            Vhtmlcartas = 
    `
    <div class="equipment-item">
                    <div class="equipment-details">
                        <div>
                            <p>Tipo de Equipo:</p>
                            <p>${rtipo[i]}</p>
                        </div>
                        <div>
                            <p>Número de Serie:</p>
                            <p>${rserie[i]}</p>
                        </div>
                        <div>
                            <p>Marca:</p>
                            <p>${rmarca[i]}</p>
                        </div>
                        <div>
                            <p>Código de Inventario:</p>
                            <p>${rid2[i]}</p>
                        </div>
                        <div>
                            <p>Estado:</p>
                            <p>${restado[i]}</p>
                        </div>
                        <div>
                            <p>Accesorios:</p>
                            <p>${raccesorios[i]}</p>
                        </div>
                        <div class="full-width">
                            <p>Comentarios:</p>
                            <p>${rdetalles[i]}</p>
                        </div>
                    </div>
                </div>
    `
        vbody = vbody + Vhtmlcartas;
    }



    Vhtmlfooter = 
    `
                </div>
        </div>

        <div class="separator"></div>

        <div>
            <h3 class="section-title">Información del Colaborador</h3>
            <div class="collaborator-grid">
                <div class="collaborator-item">
                    <p>Nombre:</p>
                    <p>${vLista.nombrelargo}</p>
                </div>
                <div class="collaborator-item">
                    <p>Departamento:</p>
                    <p>${vLista.usoExclusivo}</p>
                </div>
                <div class="collaborator-item">
                    <p>Cargo:</p>
                    <p>${vLista.descripcion}</p>
                </div>
                <div class="collaborator-item">
                    <p>ID Empleado:</p>
                    <p>${vLista.numeroEmpleado}</p>
                </div>
            </div>
            <div class="date-info">
                <p><strong>Fecha de Entrega:</strong> 2025-07-01</p>
            </div>
        </div>

        <div>
            <h3 class="section-title">Condiciones de Uso</h3>
            <div class="conditions">
                <p>El colaborador que recibe el equipo se compromete a:</p>
                <ul>
                    <li>Utilizar el equipo únicamente para fines laborales.</li>
                    <li>Mantener el equipo en buenas condiciones y reportar cualquier daño inmediatamente.</li>
                    <li>No instalar software no autorizado por la empresa.</li>
                    <li>No prestar o transferir el equipo a terceros.</li>
                    <li>Devolver el equipo en caso de terminación de la relación laboral.</li>
                    <li>Seguir todas las políticas de seguridad informática de la empresa.</li>
                    <li>Asumir responsabilidad por pérdida o daño debido a negligencia.</li>
                </ul>
            </div>
        </div>

        <div class="signatures">
            <div class="signature">
                <div class="signature-area">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAgNDBDMjAgMzAgNDAgMjAgNjAgMzBDODAgNDAgMTAwIDMwIDExMCA0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+" alt="Firma del Responsable">
                </div>
                <div class="signature-line">
                    <p>Firma del Responsable de TI</p>
                    <p>Nombre: Oscar Arturo De luna Lujan</p>
                    <p>Cargo: Analista de TI</p>
                </div>
            </div>
            <div class="signature">
                <div class="signature-area">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAgMzBDMzAgMjAgNTAgNDAgNzAgMjVDOTAgMzUgMTEwIDI1IDExMCAzNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+" alt="Firma del Colaborador">
                </div>
                <div class="signature-line">
                    <p>Firma del Colaborador</p>
                    <p>Nombre: ${vLista.nombrelargo}</p>
                    <p>Fecha: 2025-07-01</p>
                </div>
            </div>
        </div>
    
    `

    
    
    modalBody.innerHTML = Vhtmlheader + vbody + Vhtmlfooter



                
    
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}
