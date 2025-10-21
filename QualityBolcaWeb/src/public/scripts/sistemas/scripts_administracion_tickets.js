// Datos de ejemplo
const ticketsData = [
    { folio: 'TKT-2024-001', categoria: 'Hardware', prioridad: 'critical', descripcion: 'Servidor principal no responde, sistema caído completamente', usuario: 'María González', departamento: 'IT', estatus: 'open' },
    { folio: 'TKT-2024-002', categoria: 'Software', prioridad: 'high', descripcion: 'Error en sistema de facturación, no genera reportes', usuario: 'Juan Pérez', departamento: 'Contabilidad', estatus: 'progress' },
    { folio: 'TKT-2024-003', categoria: 'Red', prioridad: 'medium', descripcion: 'Conexión intermitente en área de ventas', usuario: 'Ana Martínez', departamento: 'Ventas', estatus: 'pending' },
    { folio: 'TKT-2024-004', categoria: 'Software', prioridad: 'low', descripcion: 'Actualización de antivirus pendiente', usuario: 'Carlos López', departamento: 'IT', estatus: 'resolved' },
    { folio: 'TKT-2024-005', categoria: 'Hardware', prioridad: 'high', descripcion: 'Impresora principal atascada, no imprime', usuario: 'Laura Sánchez', departamento: 'Administración', estatus: 'open' },
    { folio: 'TKT-2024-006', categoria: 'Acceso', prioridad: 'critical', descripcion: 'Usuario bloqueado, no puede acceder al sistema', usuario: 'Roberto Díaz', departamento: 'Recursos Humanos', estatus: 'progress' },
    { folio: 'TKT-2024-007', categoria: 'Software', prioridad: 'medium', descripcion: 'Lentitud en aplicación de inventarios', usuario: 'Patricia Ruiz', departamento: 'Almacén', estatus: 'open' },
    { folio: 'TKT-2024-008', categoria: 'Hardware', prioridad: 'low', descripcion: 'Teclado con teclas pegajosas', usuario: 'Miguel Torres', departamento: 'Marketing', estatus: 'closed' },
    { folio: 'TKT-2024-009', categoria: 'Red', prioridad: 'high', descripcion: 'VPN no conecta desde ubicaciones remotas', usuario: 'Carmen Flores', departamento: 'IT', estatus: 'progress' },
    { folio: 'TKT-2024-010', categoria: 'Software', prioridad: 'medium', descripcion: 'Error al exportar datos a Excel', usuario: 'Fernando Vargas', departamento: 'Finanzas', estatus: 'pending' },
    { folio: 'TKT-2024-011', categoria: 'Hardware', prioridad: 'critical', descripcion: 'Disco duro con sectores dañados, riesgo de pérdida de datos', usuario: 'Isabel Morales', departamento: 'IT', estatus: 'open' },
    { folio: 'TKT-2024-012', categoria: 'Acceso', prioridad: 'high', descripcion: 'Permisos incorrectos en carpeta compartida', usuario: 'Diego Ramírez', departamento: 'Proyectos', estatus: 'resolved' },
    { folio: 'TKT-2024-013', categoria: 'Software', prioridad: 'low', descripcion: 'Solicitud de instalación de software adicional', usuario: 'Sofía Castro', departamento: 'Diseño', estatus: 'pending' },
    { folio: 'TKT-2024-014', categoria: 'Red', prioridad: 'medium', descripcion: 'Velocidad de internet reducida en piso 3', usuario: 'Andrés Jiménez', departamento: 'Operaciones', estatus: 'progress' },
    { folio: 'TKT-2024-015', categoria: 'Hardware', prioridad: 'high', descripcion: 'Monitor parpadeando constantemente', usuario: 'Valentina Herrera', departamento: 'Atención al Cliente', estatus: 'open' },
    { folio: 'TKT-2024-016', categoria: 'Software', prioridad: 'critical', descripcion: 'Base de datos corrupta, no se puede acceder', usuario: 'Javier Mendoza', departamento: 'IT', estatus: 'open' },
    { folio: 'TKT-2024-017', categoria: 'Acceso', prioridad: 'medium', descripcion: 'Cambio de contraseña solicitado', usuario: 'Gabriela Ortiz', departamento: 'Legal', estatus: 'resolved' },
    { folio: 'TKT-2024-018', categoria: 'Hardware', prioridad: 'low', descripcion: 'Mouse inalámbrico sin batería', usuario: 'Ricardo Silva', departamento: 'Compras', estatus: 'closed' },
    { folio: 'TKT-2024-019', categoria: 'Red', prioridad: 'high', descripcion: 'Firewall bloqueando aplicación crítica', usuario: 'Daniela Reyes', departamento: 'IT', estatus: 'progress' },
    { folio: 'TKT-2024-020', categoria: 'Software', prioridad: 'medium', descripcion: 'Actualización de sistema operativo pendiente', usuario: 'Alejandro Cruz', departamento: 'IT', estatus: 'pending' },
    { folio: 'TKT-2024-021', categoria: 'Hardware', prioridad: 'critical', descripcion: 'Equipo no enciende, posible falla de fuente', usuario: 'Natalia Vega', departamento: 'Producción', estatus: 'open' },
    { folio: 'TKT-2024-022', categoria: 'Software', prioridad: 'high', descripcion: 'Aplicación se cierra inesperadamente', usuario: 'Sebastián Rojas', departamento: 'Ventas', estatus: 'progress' },
    { folio: 'TKT-2024-023', categoria: 'Red', prioridad: 'low', descripcion: 'Solicitud de acceso a red WiFi invitados', usuario: 'Camila Guzmán', departamento: 'Recepción', estatus: 'resolved' },
    { folio: 'TKT-2024-024', categoria: 'Acceso', prioridad: 'medium', descripcion: 'Usuario nuevo requiere credenciales', usuario: 'Martín Navarro', departamento: 'Recursos Humanos', estatus: 'pending' },
    { folio: 'TKT-2024-025', categoria: 'Hardware', prioridad: 'high', descripcion: 'Laptop sobrecalentándose constantemente', usuario: 'Victoria Medina', departamento: 'Marketing', estatus: 'open' },
    { folio: 'TKT-2024-026', categoria: 'Software', prioridad: 'critical', descripcion: 'Sistema de nómina no calcula correctamente', usuario: 'Emilio Paredes', departamento: 'Recursos Humanos', estatus: 'open' },
    { folio: 'TKT-2024-027', categoria: 'Red', prioridad: 'medium', descripcion: 'Configuración de correo en dispositivo móvil', usuario: 'Lucía Campos', departamento: 'Ventas', estatus: 'progress' },
    { folio: 'TKT-2024-028', categoria: 'Hardware', prioridad: 'low', descripcion: 'Solicitud de auriculares con micrófono', usuario: 'Tomás Aguilar', departamento: 'Soporte', estatus: 'pending' },
    { folio: 'TKT-2024-029', categoria: 'Software', prioridad: 'high', descripcion: 'Error de sincronización con la nube', usuario: 'Mariana Delgado', departamento: 'IT', estatus: 'progress' },
    { folio: 'TKT-2024-030', categoria: 'Acceso', prioridad: 'medium', descripcion: 'Renovación de certificado digital', usuario: 'Pablo Fuentes', departamento: 'Legal', estatus: 'resolved' },
    { folio: 'TKT-2024-031', categoria: 'Hardware', prioridad: 'critical', descripcion: 'Servidor de respaldos no funciona', usuario: 'Elena Ríos', departamento: 'IT', estatus: 'open' },
    { folio: 'TKT-2024-032', categoria: 'Software', prioridad: 'low', descripcion: 'Solicitud de licencia adicional', usuario: 'Rodrigo Peña', departamento: 'Diseño', estatus: 'pending' },
    { folio: 'TKT-2024-033', categoria: 'Red', prioridad: 'high', descripcion: 'Puerto de red no funciona en sala de juntas', usuario: 'Adriana Molina', departamento: 'Administración', estatus: 'open' },
    { folio: 'TKT-2024-034', categoria: 'Hardware', prioridad: 'medium', descripcion: 'Webcam con imagen borrosa', usuario: 'Gustavo Salazar', departamento: 'Recursos Humanos', estatus: 'progress' },
    { folio: 'TKT-2024-035', categoria: 'Software', prioridad: 'high', descripcion: 'No se pueden enviar correos con archivos adjuntos', usuario: 'Paola Cortés', departamento: 'Ventas', estatus: 'open' },
    { folio: 'TKT-2024-036', categoria: 'Acceso', prioridad: 'critical', descripcion: 'Cuenta de administrador comprometida', usuario: 'Héctor Ibarra', departamento: 'IT', estatus: 'progress' },
    { folio: 'TKT-2024-037', categoria: 'Hardware', prioridad: 'low', descripcion: 'Cable de red dañado', usuario: 'Beatriz Luna', departamento: 'Contabilidad', estatus: 'resolved' },
    { folio: 'TKT-2024-038', categoria: 'Software', prioridad: 'medium', descripcion: 'Aplicación móvil no sincroniza datos', usuario: 'Óscar Domínguez', departamento: 'Ventas', estatus: 'pending' },
    { folio: 'TKT-2024-039', categoria: 'Red', prioridad: 'high', descripcion: 'Ataque de phishing detectado', usuario: 'Claudia Pacheco', departamento: 'IT', estatus: 'progress' },
    { folio: 'TKT-2024-040', categoria: 'Hardware', prioridad: 'medium', descripcion: 'Batería de laptop no carga', usuario: 'Raúl Estrada', departamento: 'Proyectos', estatus: 'open' }
];

// Variables globales
let currentPage = 1;
let itemsPerPage = 20;
let filteredData = [...ticketsData];

// Mapeo de textos para prioridades y estatus
const priorityLabels = {
    critical: 'Crítica',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja'
};

const statusLabels = {
    open: 'Abierto',
    progress: 'En Progreso',
    pending: 'Pendiente',
    resolved: 'Resuelto',
    closed: 'Cerrado'
};

const priorityIcons = {
    critical: 'fa-circle',
    high: 'fa-circle',
    medium: 'fa-circle',
    low: 'fa-circle'
};

const statusIcons = {
    open: 'fa-circle',
    progress: 'fa-circle',
    pending: 'fa-circle',
    resolved: 'fa-circle',
    closed: 'fa-circle'
};

// Función para renderizar la tabla
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    tableBody.innerHTML = '';

    pageData.forEach(ticket => {
        const row = document.createElement('tr');
        row.className = `priority-${ticket.prioridad}`;

        row.innerHTML = `
            <td class="folio-cell">${ticket.folio}</td>
            <td>${ticket.categoria}</td>
            <td>
                <span class="priority-badge">
                    <i class="fas ${priorityIcons[ticket.prioridad]}"></i>
                    ${priorityLabels[ticket.prioridad]}
                </span>
            </td>
            <td class="description-cell" title="${ticket.descripcion}">${ticket.descripcion}</td>
            <td>${ticket.usuario}</td>
            <td>${ticket.departamento}</td>
            <td>
                <span class="status-badge status-${ticket.estatus}">
                    <i class="fas ${statusIcons[ticket.estatus]}"></i>
                    ${statusLabels[ticket.estatus]}
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updatePaginationInfo();
    renderPaginationButtons();
}

// Función para actualizar la información de paginación
function updatePaginationInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredData.length);
    
    document.getElementById('showingStart').textContent = filteredData.length > 0 ? start : 0;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalItems').textContent = filteredData.length;
}

// Función para renderizar los botones de paginación
function renderPaginationButtons() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    // Calcular rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pageNumbers.appendChild(pageBtn);
    }

    // Actualizar estado de botones de navegación
    document.getElementById('firstPage').disabled = currentPage === 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('lastPage').disabled = currentPage === totalPages;
}

// Función de búsqueda
function performSearch() {
    const searchCriteria = document.getElementById('searchCriteria').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!searchTerm) {
        filteredData = [...ticketsData];
    } else {
        filteredData = ticketsData.filter(ticket => {
            const value = ticket[searchCriteria].toLowerCase();
            return value.includes(searchTerm);
        });
    }

    currentPage = 1;
    renderTable();
}

// Event Listeners
document.getElementById('searchInput').addEventListener('input', performSearch);
document.getElementById('searchCriteria').addEventListener('change', performSearch);

document.getElementById('itemsPerPage').addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
});

document.getElementById('firstPage').addEventListener('click', () => {
    currentPage = 1;
    renderTable();
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

document.getElementById('lastPage').addEventListener('click', () => {
    currentPage = Math.ceil(filteredData.length / itemsPerPage);
    renderTable();
});

// Inicializar la tabla
renderTable();