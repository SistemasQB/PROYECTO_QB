
// Función para menú responsivo
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar')

    sidebar.classList.toggle('active')

    manejarOverlay(sidebar.classList.contains('active'))
}

function manejarOverlay(mostrar) {
    let overlay = document.getElementById('sidebar-overlay')

    if (mostrar) {
        if (!overlay) {
            overlay = document.createElement('div')
            overlay.id = 'sidebar-overlay'
            overlay.className = 'sidebar-overlay'

            overlay.onclick = () => toggleSidebar()

            document.body.appendChild(overlay)
        }
    } else {
        if (overlay) overlay.remove()
    }
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar')
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            toggleSidebar()
        }
    })
})

// Función dinámica para generar e inyectar el Modal
async function abrirModal(id) {

    const res = await fetch('/infraestructura/crudRequisicionGastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
        },
        body: JSON.stringify({
            tipo: 'detalleRequisicion',
            id
        })
    })

    const data = await res.json()
    if (!data.ok) return

    const req = data.requisicion

    const monto = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(req.total)

    const fechaEntrega = req.fechaEntrega ? new Date(req.fechaEntrega).toLocaleDateString('es-MX') : 'Sin fecha'

    const tablaConceptos = generarTablaConceptos(req.descripcion || '')

    const modalHTML = `
                <div class="modal-overlay" onclick="cerrarModal(event)">
                    <div class="modal-content" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <div class="modal-title-box">
                                <div class="modal-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                                <div class="modal-title">
                                    <h2>Detalle de Requisición</h2>
                                    <span>ID: REQ-${req.id}</span>
                                    <span>Orden: ${req.orden}</span>
                                </div>
                            </div>
                            <button class="close-btn" onclick="cerrarModal()"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        
                        <div class="modal-body">
                            <div class="info-grid">
                                <div class="info-item"><label>Nombre del gasto</label><div class="val">${req.asunto}</div></div>
                                <div class="info-item"><label>Monto solicitado</label><div class="val blue">${monto}</div></div>
                                <div class="info-item"><label>Usuario solicitante</label><div class="val">${req.solicitante}</div></div>
                                <div class="info-item"><label>Proceso</label><div class="val">${req.proceso}</div></div>
                                <div class="info-item"><label>Departamento</label><div class="val">${req.departamento}</div></div>
                                <div class="info-item"><label>Región y planta</label><div class="val">${req.region} - ${req.planta}</div></div>
                                <div class="info-item"><label>Tipo de gasto</label><div><span class="tag-capex">${req.rentabilidad}</span></div></div>
                                <div class="info-item"><label>Fecha de entrega</label><div class="val">${new Date(req.fechaEntrega).toLocaleDateString('es-MX')}</div></div>
                                <div class="info-item"><label>Cuenta:</label><div class="val">${req.noCuenta}</div></div>
                            </div>

                            <div class="table-box">
                                <div class="table-box-header"><i class="fa-solid fa-list"></i> Descripción de la Orden</div>
                                <div class="table-responsive">
                                    <table class="modal-table">
                                        <thead>
                                            <tr>
                                                <th>CONCEPTO</th>
                                                <th>CANTIDAD</th>
                                                <th>P. UNITARIO (C/IVA)</th>
                                                <th>SUBTOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${tablaConceptos}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="total-box">
                                <span class="text-right"><b>TOTAL:</b></span>
                                <span class="total">${monto}</span>
                            </div>

                            <div class="text-areas-grid">
                                <div class="text-box">
                                    <h4>Situación Actual</h4>
                                    <p>${req.situacionActual || 'Sin información'}</p>
                                    <h4>Expectativa</h4>
                                    <p>${req.detallesEspectativa || 'Sin información'}</p>
                                    <h4>Comentarios adicionales</h4>
                                    <p>${req.comentariosAdicionales || 'Sin información'}</p>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button class="btn-rechazar" onclick="accionRequisicion(${req.id}, 'RECHAZADA')"><i class="fa-solid fa-ban"></i> Rechazar Requisición</button>
                            <button class="btn-aprobar" onclick="accionRequisicion(${req.id}, 'APROBADA')"><i class="fa-solid fa-check"></i> Aprobar Requisición</button>
                        </div>
                    </div>
                </div>
            `;

    // Inyectamos el HTML en el DOM
    document.getElementById('modal-root').innerHTML = modalHTML;
    // Bloquear el scroll del fondo
    document.body.style.overflow = 'hidden';
}

function generarTablaConceptos(descripcion) {

    if (!descripcion) return ''

    let html = ''

    const esJSON = descripcion.trim().startsWith('[') || descripcion.trim().startsWith('{')

    if (esJSON) {
        try {
            const items = JSON.parse(descripcion)

            items.forEach(item => {
                const precioMXN = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                }).format(item.precio || 0)

                const subtotal = (item.precio || 0) * (item.unidad || 1)

                const subtotalMXN = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                }).format(subtotal)

                html += `
                    <tr>
                        <td>${item.desc || ''}</td>
                        <td>${item.unidad || ''}</td>
                        <td>${precioMXN}</td>
                        <td class="subtotal">${subtotalMXN}</td>
                    </tr>
                `
            })

        } catch (e) {
            console.error('Error al parsear descripción JSON:', e)
            html = '<tr><td colspan="4">Error al leer los conceptos</td></tr>'
        }

    } else {
        // CONCEPTO|CANTIDAD|PRECIO|SUBTOTAL
        const partes = descripcion.split('|')

        for (let i = 0; i < partes.length; i += 4) {

            const concepto = partes[i] || ''
            const cantidad = partes[i + 1] || ''
            const precio = partes[i + 2] || 0
            const subtotal = partes[i + 3] || 0

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
    }

    return html
}

function esMobile() {
    return window.matchMedia("(max-width: 600px)").matches;
}

function cerrarModal(event) {
    // Limpiar el HTML
    document.getElementById('modal-root').innerHTML = '';
    // Restaurar el scroll del fondo
    document.body.style.overflow = 'auto';
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

function generarAvataresTabla() {
    const avatares = document.querySelectorAll('.solicitante-avatar')

    const colores = [
        "#2563eb",
        "#7c3aed",
        "#db2777",
        "#ea580c",
        "#059669",
        "#0891b2",
        "#4f46e5"
    ]

    avatares.forEach(avatar => {
        const nombre = avatar.dataset.nombre

        if (!nombre) {
            avatar.textContent = "U"
            avatar.style.backgroundColor = "#6b7280"
            return
        }

        const partes = nombre.trim().split(" ")

        const iniciales =
            (partes[0]?.charAt(0) || '') +
            (partes[1]?.charAt(0) || '')

        // generar color por hash
        let hash = 0
        for (let i = 0; i < nombre.length; i++) {
            hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
        }

        const color = colores[Math.abs(hash) % colores.length]

        avatar.textContent = iniciales.toUpperCase() || "U"
        avatar.style.backgroundColor = color
    })
}


// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    generarAvatar();
    generarAvataresTabla();

    const searchInput = document.querySelector('.search-bar input')
    searchInput.addEventListener('input', filtrarTabla)
});

function filtrarTabla() {

    const filtro = this.value.toLowerCase()
    const filas = document.querySelectorAll('#tabla-requisiciones tr')

    filas.forEach(fila => {
        const texto = fila.innerText.toLowerCase()
        fila.style.display = texto.includes(filtro) ? '' : 'none'
    })

}

async function accionRequisicion(id, estatus) {

    let justificacion = ''
    cerrarModal()

    //solicitud de justificacion
    if (estatus === 'RECHAZADA') {

        const result = await Swal.fire({
            title: 'Motivo del rechazo',
            input: 'textarea',
            inputPlaceholder: 'Escribe la justificación...',
            inputAttributes: {
                'aria-label': 'Justificación'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar rechazo',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage('Debes escribir una justificación')
                }
                return value
            }
        })

        if (!result.isConfirmed) return

        justificacion = result.value

    } else { //confirmacion de aprobacion
        const confirmacion = await Swal.fire({
            title: '¿Aprobar esta requisición?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, aprobar'
        })

        if (!confirmacion.isConfirmed) return
    }

    let data

    try {
        const res = await fetch('/infraestructura/crudRequisicionGastos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            },
            body: JSON.stringify({
                tipo: 'resolverRequisicion',
                id,
                estatus,
                justificacion
            })
        })

        data = await res.json()
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor'
        })
        return
    }

    if (!data.ok) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.msg
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: estatus === 'APROBADA' ? 'Requisición aprobada' : 'Requisición rechazada',
        text: data.msg,
        timer: 1800,
        showConfirmButton: false
    }).then(() => location.reload())
}