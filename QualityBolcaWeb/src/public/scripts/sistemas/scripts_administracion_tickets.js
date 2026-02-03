
let ticketsData = []

// Variables globales
let currentPage = 1;
let itemsPerPage = 20;
let filteredData = [];

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

async function cargarTicketsDesdeBackend() {
    try {
        const res = await fetch('/sistemas/crudTickets');

        const data = await res.json();

        if (!data.ok) {
            console.error('Error al cargar tickets');
            return;
        }

        ticketsData = data.tickets.map(t => ({
            id: t.folio,
            folio: t.folio,
            titulo: t.datosTicket?.titulo ?? 'Sin título',
            categoria: t.datosTicket?.categoria ?? 'N/D',
            prioridad: (t.datosTicket?.prioridad ?? 'medium').toLowerCase(),
            descripcion: t.datosTicket?.descripcion ?? '',
            nombreUsuario: t.datosTicket?.nombreUsuario ?? 'N/D',
            departamento: t.datosTicket?.departamento ?? 'N/D',
            estatus: t.datosTicket?.estatus ?? 'open',
            slaInicio: t.datosTicket?.slaInicio
                ? Number(t.datosTicket.slaInicio)
                : null,
            slaHoras: t.datosTicket?.slaHoras ?? 72,
            slaConsumido: t.datosTicket?.slaConsumido ?? 0,
            slaActivo: t.datosTicket?.slaActivo ?? false,
            slaFin: t.datosTicket?.slaFin ?? null,
            asignadoA: t.datosTicket?.asignadoA ?? null,
            fecha: t.createdAt,
            ultimaActualizacion: t.updatedAt
        }));

        filteredData = [...ticketsData];
        renderTable();

    } catch (error) {
        console.error('Error cargando tickets:', error);
    }
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/D';

    const fecha = new Date(fechaISO);

    return fecha.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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
            <td class="title-cell">${ticket.titulo}</td>
            <td>${ticket.categoria}</td>
            <td>
                <span class="priority-badge">
                    <i class="fas ${priorityIcons[ticket.prioridad]}"></i>
                    ${priorityLabels[ticket.prioridad]}
                </span>
            </td>
            <td class="description-cell" title="${ticket.descripcion}">${ticket.descripcion}</td>
            <td>${ticket.nombreUsuario}</td>
            <td>${ticket.departamento}</td>
            <td>
                <span class="status-badge status-${ticket.estatus}">
                    <i class="fas ${statusIcons[ticket.estatus]}"></i>
                    ${statusLabels[ticket.estatus]}
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view" title="Ver detalles" onclick="verDetallesTicket('${ticket.id}')">
                        <i class="fas fa-eye"></i>
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

function getCSRFToken() {
    return document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
}


function cerrarModal() {
    clearInterval(slaInterval);
    slaInterval = null;
    const modal = document.getElementById("modalTicket");
    if (modal) modal.remove();
    ticketActual = null;
}

function obtenerBotonesPorEstatus(ticket) {
    if (ticket.estatus === 'open') {
        return `<button id="btnAsignar">Asignar Ticket</button>`;
    }

    if (ticket.estatus === 'progress') {
        return `
            <div class="flex-gap-2">
                <button id="btnPausar">Pausar</button>
                <button id="btnTerminar" class="danger">Terminar</button>
            </div>
        `;
    }

    if (ticket.estatus === 'pending') {
        return `<button id="btnReanudar">Reanudar</button>`;
    }

    if (ticket.estatus === 'resolved') {
        return `
        <div class="flex-gap-2">
            <button id="btnVerSolucion" class="btn-secondary">Ver solución</button>
            <button id="btnVerPausas" class="btn-secondary">Ver pausas</button>
            <button id="cerrarTicket">Cerrar Ticket</button>
        </div>
    `;
    }

    if (ticket.estatus === 'closed') {
        return `
        <div class="flex-gap-2">
            <button id="btnVerSolucion" class="btn-secondary">Ver solución</button>
            <button id="btnVerPausas" class="btn-secondary">Ver pausas</button>
        </div>
    `;
    }

    return '';
}

function renderAsignacion(ticket) {
    if (ticket.estatus !== 'open') return '';

    return `
        <label>Asignar a:</label>
        <select id="asignarUsuario">
            <option value="">-- Selecciona --</option>
            <option value="Omar Vazquez">Omar Vazquez</option>
            <option value="Alejandro Robledo">Alejandro Robledo</option>
            <option value="Guillermo Reyes">Guillermo Reyes</option>
            <option value="Luis Oliva">Luis Oliva</option>
        </select>
    `;
}

function actualizarSLATexto(ticket) {
    const slaEl = document.getElementById('slaTimer');
    if (!slaEl) return;

    const total = ticket.slaHoras * 3600;
    const consumido = ticket.slaConsumidoActual ?? ticket.slaConsumido;
    const restante = total - consumido;

    if (restante <= 0) {
        slaEl.textContent = 'SLA vencido';
        slaEl.style.color = '#dc2626';
        return;
    }

    if (restante <= 3600) {
        slaEl.style.color = '#dc2626';
    } else if (restante <= 14400) {
        slaEl.style.color = '#f59e0b';
    } else {
        slaEl.style.color = '#16a34a';
    }

    const h = Math.floor(restante / 3600);
    const m = Math.floor((restante % 3600) / 60);
    const s = restante % 60;

    slaEl.textContent = `${h}h ${m}m ${s}s`;
}

let slaInterval = null;

//intervalo en tiempo real
function iniciarContadorSLA() {
    clearInterval(slaInterval);
    const inicio = Number(ticketActual.slaInicio);
    if (!inicio) return;

    slaInterval = setInterval(() => {
        if (!ticketActual || !ticketActual.slaActivo) return;
        if (!ticketActual.slaInicio) return;

        const ahora = Date.now();

        //  ACTUALIZA EN MEMORIA
        ticketActual.slaConsumidoActual =
            ticketActual.slaConsumido +
            Math.floor((ahora - ticketActual.slaInicio) / 1000);

        const total = ticketActual.slaHoras * 3600;
        const restante = total - ticketActual.slaConsumidoActual;

        const porcentaje =
            Math.max(0, (restante / (ticketActual.slaHoras * 3600)) * 100);

        const progressEl = document.getElementById('slaProgress');
        if (progressEl) {
            progressEl.style.width = `${porcentaje}%`;

            if (porcentaje <= 10) {
                progressEl.style.background = '#dc2626';
            } else if (porcentaje <= 30) {
                progressEl.style.background = '#f59e0b';
            } else {
                progressEl.style.background = '#16a34a';
            }
        }

        const slaEl = document.getElementById('slaTimer');
        if (!slaEl) return;

        if (restante <= 0) {
            slaEl.textContent = 'SLA vencido';
            slaEl.style.color = '#dc2626';
            return;
        }

        if (restante <= 3600) {
            slaEl.style.color = '#dc2626';
        } else if (restante <= 14400) {
            slaEl.style.color = '#f59e0b';
        } else {
            slaEl.style.color = '#16a34a';
        }

        const h = Math.floor(restante / 3600);
        const m = Math.floor((restante % 3600) / 60);
        const s = restante % 60;

        slaEl.textContent = `${h}h ${m}m ${s}s`;
    }, 1000);
}

async function reanudarTicket() {
    await fetch(`/sistemas/tickets/${ticketActual.id}/reanudar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({ _csrf: tok }),
        credentials: 'include'
    });

    cerrarModal();
    cargarTicketsDesdeBackend();
}

async function cerrarTicket() {

    if (!confirm('¿Estás seguro de cerrar este ticket? Esta acción es definitiva.')) {
        return;
    }

    try {
        const res = await fetch(`/sistemas/tickets/${ticketActual.id}/cerrar`, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
                'CSRF-Token': getCSRFToken()
            },
            body: JSON.stringify({ _csrf: tok }),
            credentials: 'include'

        });

        if (!res.ok) throw new Error('Error al cerrar ticket');

        alert('ticket cerrado correctamente');
        cerrarModal();
        cargarTicketsDesdeBackend();
    } catch (error) {
        console.error(error);
        alert('No se pudo cerrar el ticket');
    }

}

//funcion asignar ticket
async function asignarTicket() {
    const usuario = document.getElementById('asignarUsuario').value;
    if (!usuario) return alert('Selecciona un usuario');

    await fetch(`/sistemas/tickets/${ticketActual.id}/asignar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': getCSRFToken()
        },
        credentials: 'include',
        body: JSON.stringify({ asignadoA: usuario, _csrf: tok })
    });

    cerrarModal();
    cargarTicketsDesdeBackend();
}

let ticketActual = null;
function verDetallesTicket(id) {
    // Lógica para ver detalles del ticket
    ticketActual = ticketsData.find(t => t.id === id);
    if (!ticketActual) return;

    const existente = document.getElementById("modalTicket");
    if (existente) existente.remove();

    const modal = document.createElement('div');
    modal.id = 'modalTicket';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content ticket-modal">
            <span class="close">&times;</span>
            <h2> Detalle del Ticket </h2>
            <div class="ticket-grid">
                <div class="ticket-col">
                    <p><strong>Folio:</strong> ${ticketActual.folio}</p>
                    <p><strong>Título:</strong> ${ticketActual.titulo}</p>
                    <p><strong>Categoría:</strong> ${ticketActual.categoria}</p>
                    <p><strong>Prioridad:</strong> ${priorityLabels[ticketActual.prioridad]}</p>
                    <p><strong>Estatus:</strong> ${statusLabels[ticketActual.estatus]}</p>
                </div>

                <div class="ticket-col">
                    <p><strong>Usuario:</strong> ${ticketActual.nombreUsuario}</p>
                    <p><strong>Departamento:</strong> ${ticketActual.departamento}</p>
                    <p><strong>Fecha:</strong> ${formatearFecha(ticketActual.fecha)} </p>
                    <p><strong>Asignado a:</strong> ${ticketActual.asignadoA ?? 'No asignado'}</p>
                </div>
            </div>

            <div class="ticket-section">
                <h4>Descripción</h4>
                <p class="ticket-description">${ticketActual.descripcion}</p>
            </div>
            
            <div class="sla-section">
                <h4>SLA restante</h4>
                <span id="slaTimer" class="sla-time">--</span>

                <div class="sla-bar">
                    <div id="slaProgress" class="sla-progress"></div>
                </div>
            </div>

            <hr>

            ${renderAsignacion(ticketActual)}

            <div class="modal-actions">
                ${obtenerBotonesPorEstatus(ticketActual)}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    modal.querySelector('.close').onclick = cerrarModal;

    if (document.getElementById('btnAsignar'))
        document.getElementById('btnAsignar').onclick = asignarTicket;

    if (document.getElementById('btnPausar')) {
        document.getElementById('btnPausar').onclick = () => {
            crearModalObservacion({
                titulo: 'Justificación de pausa',
                placeholder: '¿Por qué se está pausando el ticket?',
                onEnviar: async (mensaje) => {

                    await fetch(`/sistemas/tickets/${ticketActual.id}/observacion`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': getCSRFToken()
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            tipo: 'pause',
                            mensaje,
                            _csrf: tok,
                        })
                    });

                    cerrarModal();
                    cargarTicketsDesdeBackend();
                }
            });
        };
    }

    if (document.getElementById('btnReanudar'))
        document.getElementById('btnReanudar').onclick = reanudarTicket;

    if (document.getElementById('btnTerminar')) {
        document.getElementById('btnTerminar').onclick = () => {
            crearModalObservacion({
                titulo: 'Solución del ticket',
                placeholder: 'Describe cómo se resolvió el problema',
                onEnviar: async (mensaje) => {

                    // Guardar observación
                    await fetch(`/sistemas/tickets/${ticketActual.id}/observacion`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': getCSRFToken()
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            tipo: 'resolve',
                            mensaje,
                            _csrf: tok
                        })
                    });

                    cerrarModal();
                    cargarTicketsDesdeBackend();
                }
            });
        };
    }

    if (document.getElementById('btnVerSolucion')) {
        document.getElementById('btnVerSolucion').onclick = async () => {
            const res = await fetch(`/sistemas/tickets/${ticketActual.id}/observaciones?tipo=resolve`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();

            crearModalLectura({
                titulo: 'Solución del ticket',
                items: data.observaciones || []
            });
        };
    }

    if (document.getElementById('btnVerPausas')) {
        document.getElementById('btnVerPausas').onclick = async () => {
            const res = await fetch(`/sistemas/tickets/${ticketActual.id}/observaciones?tipo=pause`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();

            crearModalLectura({
                titulo: 'Historial de pausas',
                items: data.observaciones || []
            });
        };
    }

    if (document.getElementById('cerrarTicket'))
        document.getElementById('cerrarTicket').onclick = cerrarTicket;

    // Pintar SLA inmediatamente
    actualizarSLATexto(ticketActual);

    const total = ticketActual.slaHoras * 3600;
    const restante = total - ticketActual.slaConsumido;
    const porcentaje = Math.max(0, (restante / total) * 100);

    const progressEl = document.getElementById('slaProgress');
    if (progressEl) {
        progressEl.style.width = `${porcentaje}%`;
    }

    // Iniciar reloj si está activo
    if (ticketActual.slaActivo) {
        iniciarContadorSLA();
    }
}

function crearModalObservacion({ titulo, placeholder, onEnviar }) {
    const overlay = document.createElement('div');
    overlay.classList.add('observacion-overlay');

    const modal = document.createElement('div');
    modal.classList.add('observacion-modal');

    modal.innerHTML = `
        <h3 class="observacion-title">${titulo}</h3>

        <textarea
            id="observacionInput"
            class="observacion-textarea"
            placeholder="${placeholder}"
            rows="4"
        ></textarea>

        <div class="observacion-actions">
            <button id="btnCancelarObs" class="btn-cancelar">Cancelar</button>
            <button id="btnEnviarObs" class="btn-enviar">Enviar</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.querySelector('#btnCancelarObs').onclick = () => {
        document.body.removeChild(overlay);
    };

    overlay.querySelector('#btnEnviarObs').onclick = async () => {
        const texto = overlay.querySelector('#observacionInput').value.trim();

        if (!texto) {
            alert('La observación es obligatoria');
            return;
        }

        await onEnviar(texto);
        document.body.removeChild(overlay);
    };
}

function crearModalLectura({ titulo, items }) {
    const overlay = document.createElement('div');
    overlay.className = 'observacion-overlay';

    const modal = document.createElement('div');
    modal.className = 'observacion-modal';

    modal.innerHTML = `
        <h3 class="observacion-title">${titulo}</h3>

        <div class="observacion-lista">
            ${items.length === 0
            ? `<p class="observacion-empty">No hay información registrada.</p>`
            : items.map(obs => `
                        <div class="observacion-item">
                            <small class="observacion-fecha">
                                ${formatearFecha(obs.fecha)}
                            </small>
                            <p class="observacion-texto">${obs.mensaje}</p>
                        </div>
                    `).join('')
        }
        </div>

        <div class="observacion-actions">
            <button class="btn-enviar" id="btnCerrarLectura">Cerrar</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('btnCerrarLectura').onclick = () => {
        document.body.removeChild(overlay);
    };
}

// Inicializar la tabla
//renderTable();

document.addEventListener('DOMContentLoaded', () => {
    cargarTicketsDesdeBackend();
});
