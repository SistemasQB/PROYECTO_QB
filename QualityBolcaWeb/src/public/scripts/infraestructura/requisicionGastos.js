
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

// FUNCIÓN PARA CARGAR LA TABLA
async function cargarTabla() {
    const res = await fetch('/infraestructura/crudRequisicionGastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "CSRF-Token": csrfToken
        },
        body: JSON.stringify({
            tipo: 'tablaRequisiciones'
        })
    })

    const data = await res.json()

    if (!data.ok) return

    renderTabla(data.datos)
}

function renderTabla(lista) {

    const tbody = document.getElementById('tabla-requisiciones')
    let html = ''

    lista.forEach(req => {

        const fecha = new Date(req.horaRegistro)
            .toLocaleDateString('es-MX')

        const monto = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(req.total)

        let badgeClass = 'status-proceso'
        let icon = 'fa-clock'

        if (req.estatus === 'INGRESADA') {
            badgeClass = 'status-pendiente'
        }

        if (req.estatus === 'APROBADA') {
            badgeClass = 'status-aprobada'
            icon = 'fa-circle-check'
        }

        if (req.estatus === 'RECHAZADA') {
            badgeClass = 'status-rechazada'
            icon = 'fa-circle-xmark'
        }

        html += `
        <tr>
            <td>#REQ-${req.id}</td>
            <td>${fecha}</td>
            <td>${req.asunto}</td>
            <td>${monto}</td>
            <td>
                <span class="status-badge ${badgeClass}">
                    <i class="fa-solid ${icon}"></i>
                    ${req.estatus}
                </span>
            </td>
            <td>
                <button class="action-btn verRequisicion" data-id="${req.id}">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        </tr>
        `
    })

    tbody.innerHTML = html
}

setInterval(cargarTabla, 200000)


// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarTabla();
    generarAvatar();

    const searchInput = document.querySelector('.search-bar input')
    searchInput.addEventListener('input', filtrarTabla)
});

document.getElementById('btnRefresh')
    .addEventListener('click', () => {
        cargarTabla()
    })

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.verRequisicion')
    if (!btn) return

    const id = btn.dataset.id

    const res = await fetch('/infraestructura/crudRequisicionGastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "CSRF-Token": csrfToken
        },
        body: JSON.stringify({
            tipo: 'detalleRequisicion',
            id
        })
    })

    const data = await res.json()

    if (!data.ok) return

    crearModalRequisicion(data.requisicion)

})

function crearModalRequisicion(req) {

    const tablaConceptos = generarTablaConceptos(req.descripcion)

    const totalMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(req.total)

    const modal = document.createElement('div')

    modal.className = "modal-overlay"

    modal.innerHTML = `

        <div class="modal-container modal-requisicion">

        <div class="modal-header">

        <div class="modal-title">

            <i class="fa-solid fa-clipboard-check modal-icon"></i>

            <div class="modal-title-text">
                <h3>Detalle de Requisición</h3>

                <div class="modal-subinfo">

                    <span class="modal-subtitle">
                        ID: REQ-${req.id}
                    </span>

                    <span class="status-badge ${obtenerClaseEstatus(req.estatus)}">
                        ${req.estatus}
                    </span>

                    <span class="badge-tipo">
                        ${req.rentabilidad}
                    </span>

                </div>

            </div>

        </div>

        <button class="modal-close">
        <i class="fa-solid fa-xmark"></i>
        </button>

        </div>


        <div class="modal-body">

        <div class="modal-info-grid">

        <div>
        <label>Nombre del gasto</label>
        <p>${req.asunto}</p>
        </div>

        <div>
        <label>Monto solicitado</label>
        <p class="monto">${totalMXN}</p>
        </div>

        <div>
        <label>Usuario solicitante</label>
        <p>${req.solicitante}</p>
        </div>

        <div>
        <label>Departamento</label>
        <p>${req.departamento}</p>
        </div>

        <div>
        <label>Región y planta</label>
        <p>${req.region} - ${req.planta}</p>
        </div>

        <div>
        <label>Proceso</label>
        <p>${req.proceso}</p>
        </div>

        <div>
        <label>Fecha de entrega</label>
        <p>${new Date(req.fechaEntrega).toLocaleDateString('es-MX')}</p>
        </div>

        <div>
        <label>Estatus</label>
        <p>${req.estatus}</p>
        </div>

        </div>

        <div class="modal-divider"></div>

        <h4 class="section-title">
        <i class="fa-solid fa-list"></i>
        Descripción de la Orden
        </h4>


        <table class="tabla-conceptos">

        <thead>

        <tr>
        <th>CONCEPTO</th>
        <th>CANTIDAD</th>
        <th>P. UNITARIO</th>
        <th>SUBTOTAL</th>
        </tr>

        </thead>

        <tbody>

        ${tablaConceptos}

        </tbody>

        <tfoot>

        <tr>
        <td colspan="3">TOTAL</td>
        <td class="total">${totalMXN}</td>
        </tr>

        </tfoot>

        </table>


        <div class="modal-divider"></div>

            <h4 class="section-title">
            <i class="fa-solid fa-circle-info"></i>
            Situación Actual
            </h4>

            <div class="modal-textbox">
            ${req.situacionActual || 'Sin información'}
            </div>

            <div class="modal-divider"></div>

            <div class="modal-text-grid">

                <div>
                    <h4 class="section-title">
                    <i class="fa-solid fa-comments"></i>
                    Comentarios Adicionales
                    </h4>

                    <div class="modal-textbox">
                    ${req.comentariosAdicionales || 'Sin comentarios'}
                    </div>
                </div>

                <div>
                    <h4 class="section-title">
                    <i class="fa-solid fa-bullseye"></i>
                    Expectativa
                    </h4>

                    <div class="modal-textbox">
                    ${req.detallesEspectativa || 'Sin expectativa'}
                    </div>
                </div>

        </div>
    `

    document.body.appendChild(modal)

    modal.querySelector('.modal-close')
        .addEventListener('click', () => {
            modal.remove()
        })

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove()
        }
    })

}

function generarTablaConceptos(descripcion) {

    if (!descripcion) return ''

    const partes = descripcion.split('|')
    let html = ''

    for (let i = 0; i < partes.length; i += 4) {

        const concepto = partes[i] || ''
        const cantidad = partes[i + 1] || ''
        const precio = partes[i + 2] || ''
        const subtotal = partes[i + 3] || ''

        const precioMXN = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(precio)

        const subtotalMXN = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(subtotal)

        html += `
        <tr>
            <td>${concepto}</td>
            <td>${cantidad}</td>
            <td>${precioMXN}</td>
            <td class="subtotal">${subtotalMXN}</td>
        </tr>
        `
    }

    return html
}

function obtenerClaseEstatus(estatus) {

    if (estatus === 'INGRESADA') return 'status-pendiente'
    if (estatus === 'APROBADA') return 'status-aprobada'
    if (estatus === 'RECHAZADA') return 'status-rechazada'

    return 'status-proceso'
}

function generarAvatar() {
    const avatar = document.getElementById("avatarUsuario")
    if (!avatar) return

    const partes = nombreUsuario.split(" ")
    const iniciales = (partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')
    const colores = [
        "#2563eb",
        "#7c3aed",
        "#db2777",
        "#ea580c",
        "#059669",
        "#0891b2",
        "#4f46e5"
    ]
    let hash = 0
    for (let i = 0; i < nombreUsuario.length; i++) {
        hash = nombreUsuario.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = colores[Math.abs(hash) % colores.length]
    avatar.style.backgroundColor = color
    avatar.textContent = iniciales.toUpperCase()

}

function filtrarTabla() {

    const filtro = this.value.toLowerCase()
    const filas = document.querySelectorAll('#tabla-requisiciones tr')

    filas.forEach(fila => {
        const texto = fila.innerText.toLowerCase()
        fila.style.display = texto.includes(filtro) ? '' : 'none'
    })

}