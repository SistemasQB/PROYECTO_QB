// CLOCK
function tick() {
    const n = new Date();
    document.getElementById('clock').textContent =
        n.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    document.getElementById('clockDate').textContent =
        n.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase();
    document.getElementById('lastSync').textContent =
        n.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
tick(); setInterval(tick, 1000);

// TABS — filtro por planta/región
// Almacena la planta activa para que el auto-refresh la respete
let plantaActiva = 'todas';

function selectPlant(el) {
    document.querySelectorAll('.plant-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    plantaActiva = el.dataset.planta || 'todas';
    cargarTicketsMonitoreo();
    cargarRequisicionesMonitoreo();
    cargarInventarioMonitoreo();
}

// ── CHARTS ──────────────────────────────────────────────────────────────────

Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#6e6e73';

// El gráfico de tickets se crea vacío y se actualiza con datos reales
const ticketCtx = document.getElementById('ticketChart').getContext('2d');
const ticketChart = new Chart(ticketCtx, {
    type: 'bar',
    data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'],
        datasets: [
            {
                label: 'Atendidos', data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(40,205,65,0.18)', borderColor: '#28cd41',
                borderWidth: 1.5, borderRadius: 4
            },
            {
                label: 'No atendidos', data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255,59,48,0.12)', borderColor: '#ff3b30',
                borderWidth: 1.5, borderRadius: 4
            },
            {
                label: 'Vencidos', data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255,159,10,0.15)', borderColor: '#ff9f0a',
                borderWidth: 1.5, borderRadius: 4
            }
        ]
    },
    options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 8, padding: 14, usePointStyle: true, pointStyleWidth: 8 } },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.95)', titleColor: '#1d1d1f', bodyColor: '#3d3d3f',
                borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, cornerRadius: 10, padding: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: '#aeaeb2' } },
            y: { grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false, dash: [4, 4] }, ticks: { color: '#aeaeb2' }, beginAtZero: true }
        }
    }
});

const csatCtx = document.getElementById('csatChart').getContext('2d');
new Chart(csatCtx, {
    type: 'line',
    data: {
        labels: ['S8', 'S9', 'S10', 'S11', 'S12', 'S13'],
        datasets: [
            {
                label: 'CSAT', data: [6.2, 6.8, 7.0, 6.9, 7.1, 7.4],
                borderColor: '#0071e3', backgroundColor: 'rgba(0,113,227,0.07)',
                borderWidth: 2, pointBackgroundColor: '#0071e3', pointRadius: 4,
                tension: 0.4, fill: true
            },
            {
                label: 'Meta (8)', data: [8, 8, 8, 8, 8, 8],
                borderColor: 'rgba(40,205,65,0.4)', borderWidth: 1.5,
                borderDash: [5, 4], pointRadius: 0, fill: false
            }
        ]
    },
    options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 8, padding: 12, usePointStyle: true, pointStyleWidth: 8 } },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.95)', titleColor: '#1d1d1f', bodyColor: '#3d3d3f',
                borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, cornerRadius: 10, padding: 10
            }
        },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: '#aeaeb2' } },
            y: { grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { color: '#aeaeb2' }, min: 0, max: 10 }
        }
    }
});

// ── MODAL HELPERS ────────────────────────────────────────────────────────────

function field(key, val, cls = '') {
    return `<div class="modal-field"><span class="mf-key">${key}</span><span class="mf-val ${cls}">${val}</span></div>`;
}
function actions(a = 'Asignar', b = 'Escalar') {
    return `<button class="btn btn-primary" onclick="closeModal()">${a}</button>
          <button class="btn btn-secondary" onclick="closeModal()">${b}</button>`;
}

function openDevice(id, model, status, area, os, specs, state) {
    const col = state === 'ok' ? 'green' : state === 'err' ? 'red' : 'amber';
    show(id, model,
        field('Estado', status, col) +
        field('Área', area) + field('SO', os) + field('Specs', specs),
        actions('Crear ticket', 'Ver historial'));
}
function openCel(id, model, user) {
    const isAlert = user.includes('⚠');
    show(id, model,
        field('Asignado a', user, isAlert ? 'red' : '') +
        field('Planta', 'Honda') + field('SO', 'Android 14'),
        actions('Reportar', 'Ver historial'));
}
function openTicket(id, desc, agent, time, status, priority) {
    const sc = status === 'Vencido' || status === 'Crítico' ? 'red' : status === 'En Curso' ? 'blue' : 'amber';
    const pc = priority === 'Alta' || priority === 'Crítica' ? 'red' : priority === 'Media' ? 'amber' : 'green';
    show(id, desc,
        field('Estado', status, sc) +
        field('Prioridad', priority, pc) +
        field('Asignado', agent) +
        field('Tiempo', time, sc) +
        field('Planta', 'Honda'),
        actions('Asignar', 'Escalar'));
}
function openAgent(name, role, tickets, status, email) {
    show(name, role,
        field('Tickets activos', tickets, 'blue') +
        field('Estado', status, status === 'Activo' ? 'green' : 'amber') +
        field('Correo', email),
        actions('Ver tickets', 'Reasignar'));
}
function show(title, sub, fieldsHTML, actionsHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSub').textContent = sub;
    document.getElementById('modalFields').innerHTML = fieldsHTML;
    document.getElementById('modalActions').innerHTML = actionsHTML;
    document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── TICKETS REALES ───────────────────────────────────────────────────────────

/**
 * Mapea un estatus interno (open/progress/pending) a la etiqueta visual del dashboard.
 */
function labelEstatus(estatus, estaVencido) {
    if (estaVencido) return 'Vencido';
    switch (estatus) {
        case 'open': return 'Abierto';
        case 'progress': return 'En Curso';
        case 'pending': return 'En Curso';
        default: return 'Abierto';
    }
}

/**
 * Formatea las horas transcurridas de un ticket en texto corto.
 * Ej: 2 -> "2h", 28 -> "28h", 3*24 -> "3d"
 */
function formatHoras(horas) {
    if (horas < 24) return `${horas}h`;
    const dias = Math.floor(horas / 24);
    return `${dias}d`;
}

/**
 * Construye el HTML de una tarjeta de ticket para la columna indicada.
 * @param {object} t   - objeto ticket enriquecido desde la API
 * @param {'amber'|'red'|'blue'} tipo - columna de destino
 */
function buildTicketCard(t, tipo) {
    const colorClass = `${tipo}-tkt`;
    const isUrgent = tipo === 'red' || (tipo === 'amber' && t.prioridad === 'critical') ? 'urgent-tkt' : '';
    const tiempoLabel = tipo === 'red'
        ? `${formatHoras(t.horasTranscurridas)} ⚠`
        : tipo === 'blue'
            ? `${formatHoras(t.slaHoras - t.tiempoConsumidoHoras > 0 ? t.slaHoras - t.tiempoConsumidoHoras : 0)} rest.`
            : formatHoras(t.horasTranscurridas);

    const tiempoClass = tipo === 'red' ? 'overdue' : '';

    const agentLabel = t.asignadoA
        ? abreviarNombre(t.asignadoA)
        : `<span style="color:var(--red)">⚠ Sin asignar</span>`;

    const statusLabel = labelEstatus(t.estatus, t.estaVencido);

    return `
        <div class="tkt ${colorClass} ${isUrgent}"
             onclick="openTicket('${escapar(t.folio)}', '${escapar(t.titulo)}', '${t.asignadoA ? escapar(t.asignadoA) : 'Sin asignar'}', '${tiempoLabel}', '${statusLabel}', '${escapar(t.prioridadLabel)}')">
            <div class="tkt-id"><span>${escapar(t.folio)}</span></div>
            <div class="tkt-desc">${escapar(t.titulo)}</div>
            <div class="tkt-meta">
                <span class="tkt-agent">${agentLabel}</span>
                <span class="tkt-time ${tiempoClass}">${tiempoLabel}</span>
            </div>
            <span class="priority-tag ${prioridadClass(t.prioridad, t.estaVencido)}">${t.estaVencido ? 'Vencido' : escapar(t.prioridadLabel)}</span>
        </div>`;
}

function prioridadClass(prioridad, estaVencido) {
    if (estaVencido) return 'pt-high';
    switch (prioridad) {
        case 'critical': return 'pt-high';
        case 'high': return 'pt-high';
        case 'medium': return 'pt-med';
        case 'low': return 'pt-low';
        default: return 'pt-low';
    }
}

/** Abrevia "APELLIDO APELLIDO NOMBRE NOMBRE" a "N. Apellido" */
function abreviarNombre(nombre) {
    if (!nombre) return '';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length >= 3) {
        // Formato: APELLIDOPAT APELLIDOMAT NOMBRE -> N. ApellidoPat
        const inicial = partes[2].charAt(0).toUpperCase();
        const apellido = partes[0].charAt(0).toUpperCase() + partes[0].slice(1).toLowerCase();
        return `${inicial}. ${apellido}`;
    }
    return nombre;
}

/** Escapa caracteres conflictivos para evitar romper atributos onclick */
function escapar(str) {
    if (!str) return '';
    return String(str)
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
}

/**
 * Renderiza los tickets en las tres columnas del dashboard.
 */
function renderTickets(data) {
    const semanaEl = document.querySelector('.card-title');
    if (semanaEl && semanaEl.textContent.includes('Tickets')) {
        semanaEl.textContent = `Tickets — Semana ${data.semana}`;
    }

    // Actualizar badge de activos
    const badgeTickets = document.querySelector('.col-center .card:first-child .card-badge');
    if (badgeTickets) {
        badgeTickets.textContent = `${data.totales.activos} activos`;
    }

    // Columna ABIERTOS
    const colAbiertos = document.querySelector('.ticket-col:nth-child(1)');
    if (colAbiertos) {
        colAbiertos.querySelector('.tcol-count').textContent = data.totales.abiertos;
        const itemsEl = colAbiertos.querySelector('.ticket-items');
        if (data.tickets.abiertos.length === 0) {
            itemsEl.innerHTML = '<div class="tkt-vacio">Sin tickets abiertos</div>';
        } else {
            itemsEl.innerHTML = data.tickets.abiertos
                .map(t => buildTicketCard(t, 'amber'))
                .join('');
        }
    }

    // Columna VENCIDOS
    const colVencidos = document.querySelector('.ticket-col:nth-child(2)');
    if (colVencidos) {
        colVencidos.querySelector('.tcol-count').textContent = data.totales.vencidos;
        const itemsEl = colVencidos.querySelector('.ticket-items');
        if (data.tickets.vencidos.length === 0) {
            itemsEl.innerHTML = '<div class="tkt-vacio">Sin tickets vencidos</div>';
        } else {
            itemsEl.innerHTML = data.tickets.vencidos
                .map(t => buildTicketCard(t, 'red'))
                .join('');
        }
    }

    // Columna EN CURSO
    const colEnCurso = document.querySelector('.ticket-col:nth-child(3)');
    if (colEnCurso) {
        colEnCurso.querySelector('.tcol-count').textContent = data.totales.enCurso;
        const itemsEl = colEnCurso.querySelector('.ticket-items');
        if (data.tickets.enCurso.length === 0) {
            itemsEl.innerHTML = '<div class="tkt-vacio">Sin tickets en curso</div>';
        } else {
            itemsEl.innerHTML = data.tickets.enCurso
                .map(t => buildTicketCard(t, 'blue'))
                .join('');
        }
    }
}

/**
 * Actualiza el gráfico de barras con los datos reales de la semana.
 */
function actualizarGrafica(grafica, semana) {
    ticketChart.data.labels = grafica.labels;
    ticketChart.data.datasets[0].data = grafica.atendidos;
    ticketChart.data.datasets[1].data = grafica.noAtendidos;
    ticketChart.data.datasets[2].data = grafica.vencidos;
    ticketChart.update();

    // Actualizar badge de la semana en el card de la gráfica
    const badgeGrafica = document.querySelector('.col-center .card:nth-child(3) .card-badge');
    if (badgeGrafica) badgeGrafica.textContent = `Semana ${semana}`;
}

/**
 * Actualiza los KPIs del resumen semanal.
 */
function actualizarKpis(resumen, semana) {
    const kpiCards = document.querySelectorAll('.kpi-card');
    if (!kpiCards.length) return;

    // KPI 0: Atendidos
    const numAtendidos = kpiCards[0]?.querySelector('.kpi-num');
    if (numAtendidos) numAtendidos.textContent = resumen.atendidos;

    // KPI 1: No atendidos
    const numNoAtendidos = kpiCards[1]?.querySelector('.kpi-num');
    if (numNoAtendidos) numNoAtendidos.textContent = resumen.noAtendidos;

    // KPI 2: Efectividad
    const numEfectividad = kpiCards[2]?.querySelector('.kpi-num');
    if (numEfectividad) numEfectividad.textContent = `${resumen.efectividad}%`;

    // Actualizar badge del resumen semanal
    const badgeKpi = document.querySelector('.col-right .card:first-child .card-badge');
    if (badgeKpi) badgeKpi.textContent = `W${semana}`;
}

/**
 * Carga los datos reales de tickets desde la API y actualiza el dashboard.
 */
async function cargarTicketsMonitoreo() {
    try {
        const url = plantaActiva && plantaActiva !== 'todas'
            ? `/sistemas/api/monitoreo/tickets?planta=${encodeURIComponent(plantaActiva)}`
            : '/sistemas/api/monitoreo/tickets';

        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin'
        });

        if (!res.ok) {
            console.error('Error al cargar tickets del monitoreo:', res.status);
            return;
        }

        const data = await res.json();

        if (!data.ok) {
            console.error('La API devolvió ok: false');
            return;
        }

        renderTickets(data);
        actualizarGrafica(data.grafica, data.semana);
        actualizarKpis(data.resumenSemanal, data.semana);

    } catch (err) {
        console.error('Error de red al cargar tickets del monitoreo:', err);
    }
}

/**
 * Construye el resumen corto de items de una requisición.
 * items puede llegar como array o como string JSON serializado.
 * Cada elemento tiene la forma: { equipment, quantity, description, justification, surtido }
 */
function buildItemsResumen(items) {
    // Deserializar si llega como string
    if (typeof items === 'string') {
        if (!items.trim()) return 'Sin equipos';
        try {
            items = JSON.parse(items);
        } catch (_) {
            return 'Sin equipos';
        }
    }


    if (!items || !Array.isArray(items) || items.length === 0) return 'Sin equipos';

    const primer = items[0];

    const nombre =
        primer.equipment?.trim() ||
        primer.description?.trim() ||
        'Equipo sin tipo';

    const cant = primer.quantity || '';
    const extra = items.length > 1 ? ` +${items.length - 1} más` : '';

    return cant
        ? `${nombre} x${cant}${extra}`
        : `${nombre}${extra}`;
}

/**
 * Construye el HTML de una tarjeta de requisición para la columna indicada.
 * @param {object} r    - objeto requisición desde la API
 * @param {'amber'|'blue'|'closed'} tipo - columna de destino
 */
function buildRequisicionCard(r, tipo) {
    const idLabel = `SOL-${String(r.id).slice(-3)}`;

    const itemsResumen = buildItemsResumen(r.items);
    const solicitante = r.requesterName || 'Sin nombre';

    const esCerrada = tipo === 'closed';

    return `
        <div class="tkt ${tipo === 'closed' ? 'blue-tkt' : tipo + '-tkt'}"
             style="${esCerrada ? 'opacity:0.6' : ''}"
             onclick="openTicket('${idLabel}', '${escapar(itemsResumen)}', '${escapar(solicitante)}', '', '${escapar(r.status)}', '—')">

            <!-- ID -->
            <div class="tkt-id">
                <span>${idLabel}</span>
            </div>

            <!-- DESCRIPCIÓN (EQUIPO) -->
            <div class="tkt-desc">
                ${escapar(itemsResumen)}
            </div>

            <!-- META -->
            <div class="tkt-meta">
                ${esCerrada
            ? `<span class="tkt-agent" style="color:var(--green)">✓ Completado</span>`
            : `<span class="tkt-agent">${escapar(solicitante)}</span>`
        }
            </div>
        </div>
    `;
}

/**
 * Renderiza las requisiciones en las tres columnas de la card Solicitudes.
 */
function renderRequisiciones(data) {
    const badgeTotal = document.getElementById('sol-badge-total');
    if (badgeTotal) badgeTotal.textContent = `${data.total} total`;

    const countAbiertas = document.getElementById('sol-count-abiertas');
    const itemsAbiertas = document.getElementById('sol-items-abiertas');
    if (countAbiertas) countAbiertas.textContent = data.abiertas.length;
    if (itemsAbiertas) {
        itemsAbiertas.innerHTML = data.abiertas.length === 0
            ? '<div class="tkt-vacio">Sin solicitudes abiertas</div>'
            : data.abiertas.map(r => buildRequisicionCard(r, 'amber')).join('');
    }

    const countEncurso = document.getElementById('sol-count-encurso');
    const itemsEncurso = document.getElementById('sol-items-encurso');
    if (countEncurso) countEncurso.textContent = data.enCurso.length;
    if (itemsEncurso) {
        itemsEncurso.innerHTML = data.enCurso.length === 0
            ? '<div class="tkt-vacio">Sin solicitudes en curso</div>'
            : data.enCurso.map(r => buildRequisicionCard(r, 'blue')).join('');
    }

    const countCerradas = document.getElementById('sol-count-cerradas');
    const itemsCerradas = document.getElementById('sol-items-cerradas');
    if (countCerradas) countCerradas.textContent = data.cerradas.length;
    if (itemsCerradas) {
        itemsCerradas.innerHTML = data.cerradas.length === 0
            ? '<div class="tkt-vacio">Sin solicitudes cerradas</div>'
            : data.cerradas.map(r => buildRequisicionCard(r, 'closed')).join('');
    }
}

/**
 * Carga los datos reales de requisiciones desde la API y actualiza la card Solicitudes.
 */
async function cargarRequisicionesMonitoreo() {
    try {
        const url = plantaActiva && plantaActiva !== 'todas'
            ? `/sistemas/api/monitoreo/requisiciones?planta=${encodeURIComponent(plantaActiva)}`
            : '/sistemas/api/monitoreo/requisiciones';

        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin'
        });

        if (!res.ok) {
            console.error('Error al cargar requisiciones del monitoreo:', res.status);
            return;
        }

        const data = await res.json();

        if (!data.ok) {
            console.error('La API de requisiciones devolvió ok: false');
            return;
        }

        renderRequisiciones(data);

    } catch (err) {
        console.error('Error de red al cargar requisiciones del monitoreo:', err);
    }
}

async function cargarInventarioMonitoreo() {
    try {
        const url = plantaActiva && plantaActiva !== 'todas'
            ? `/sistemas/api/monitoreo/inventario?planta=${encodeURIComponent(plantaActiva)}`
            : '/sistemas/api/monitoreo/inventario';

        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin'
        });

        if (!res.ok) {
            console.error('Error cargando inventario:', res.status);
            return;
        }

        const data = await res.json();

        if (!data.ok) return;

        renderInventario(data);
    } catch (error) {
        console.error('Error al cargar inventario del monitoreo:', error);
    }
}

function renderInventario(data) {
    const inv = data.inventario;

    // LAPTOPS
    const laptopContainer = document.querySelector('#laptops-container');
    const laptopBadge = document.querySelector('#laptops-badge');

    laptopBadge.textContent = `${data.totales.laptops} unidades`;

    laptopContainer.innerHTML = inv.laptops.map(l => `
        <div class="device-row"
            onclick="openDevice('${l.serie}','${l.marca}','${l.estado || 'Activo'}','${l.region || 'Sin región'}','—','—','ok')">

            <div class="device-icon-wrap blue">💻</div>

            <div class="device-info">
                <div class="device-name">${l.marca}</div>
                <div class="device-model">${l.serie} · ${l.region || 'Sin región'}</div>
            </div>

            <span class="status-badge sb-ok">OK</span>
        </div>
    `).join('');

    // ENSAMBLADOS
    const ensamContainer = document.querySelector('#ensamblados-container');
    const ensamBadge = document.querySelector('#ensamblados-badge');

    ensamBadge.textContent = `${data.totales.ensamblados} unidades`;

    ensamContainer.innerHTML = inv.ensamblados.map(e => `
        <div class="device-row">
            <div class="device-icon-wrap blue">🖥️</div>
            <div class="device-info">
                <div class="device-name">${e.marca}</div>
                <div class="device-model">${e.serie} · ${e.region || 'Sin región'}</div>
            </div>
            <span class="status-badge sb-ok">OK</span>
        </div>
    `).join('');


    // IMPRESORAS
    const impContainer = document.querySelector('#impresoras-container');
    const impBadge = document.querySelector('#impresoras-badge');

    impBadge.textContent = `${data.totales.impresoras} unidades`;

    impContainer.innerHTML = inv.impresoras.map(i => `
        <div class="device-row">
            <div class="device-icon-wrap green">🖨️</div>
            <div class="device-info">
                <div class="device-name">${i.marca}</div>
                <div class="device-model">${i.serie} · ${i.region || 'Sin región'}</div>
            </div>
            <span class="status-badge sb-ok">OK</span>
        </div>
    `).join('');

    // CELULARES
    const celContainer = document.querySelector('#celulares-container');
    const celBadge = document.querySelector('#celulares-badge');

    celBadge.textContent = `${data.totales.celulares} unidades`;

    celContainer.innerHTML = inv.celulares.map(c => `
        <div class="cel-tile">
            <div class="cel-emoji">📱</div>
            <div class="cel-id">${c.serie}</div>
            <div class="cel-user">${c.region || '—'}</div>
        </div>
    `).join('');
}

// Carga inicial al abrir la página
cargarTicketsMonitoreo();
cargarRequisicionesMonitoreo();
cargarInventarioMonitoreo();

// Auto-refresh cada 60 segundos para mantener el dashboard al día
setInterval(() => {
    cargarTicketsMonitoreo();
    cargarRequisicionesMonitoreo();
    cargarInventarioMonitoreo();
}, 60_000);
