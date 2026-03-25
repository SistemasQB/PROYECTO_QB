const tabla = document.getElementById("tablaUsuarios");
const searchInput = document.querySelector(".search-box input");

let paginaActual = 1;
const usuariosPorPagina = 25;
let listaUsuarios = [];
let timeoutBusqueda;

async function cargarUsuarios(search = "") {

    const res = await fetch(`/sistemas/api/usuarios?search=${search}`);
    const data = await res.json();

    if (!data.ok) return;

    listaUsuarios = data.usuarios;
    paginaActual = 1;

    renderTabla();
}

cargarUsuarios();

searchInput.addEventListener("input", e => {

    clearTimeout(timeoutBusqueda);

    timeoutBusqueda = setTimeout(() => {
        cargarUsuarios(e.target.value);
    }, 300);

});

async function toggleUsuario(codigo, estado) {

    const nuevoEstado = estado === "A" ? "R" : "A";

    const res = await fetch(`/sistemas/usuarios/${codigo}/estado`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            estado: nuevoEstado
        })
    });

    const data = await res.json();

    if (data.ok) {
        cargarUsuarios();
    }

}

function obtenerIniciales(nombre) {
    if (!nombre) return "U";

    const partes = nombre.trim().split(" ");

    if (partes.length === 1) {
        return partes[0][0].toUpperCase();
    }

    return (partes[0][0] + partes[1][0]).toUpperCase();
}

function obtenerColorAvatar(nombre) {

    let hash = 0;

    for (let i = 0; i < nombre.length; i++) {
        hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colores = [
        "#2563eb",
        "#7c3aed",
        "#059669",
        "#ea580c",
        "#dc2626",
        "#0891b2",
        "#4f46e5",
        "#9333ea",
        "#0d9488",
        "#be123c"
    ];

    const index = Math.abs(hash) % colores.length;

    return colores[index];
}

function renderTabla() {

    tabla.innerHTML = "";

    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;

    const usuariosPagina = listaUsuarios.slice(inicio, fin);

    usuariosPagina.forEach(u => {

        const estado = u.estadoempleado === "A" ? "Active" : "Inactive";
        const dot = u.estadoempleado === "A" ? "active" : "inactive";

        const row = `
        <tr>

        <td>${u.codigoempleado}</td>

        <td>
        <div class="user-cell">
        <div class="avatar-initials" style="background:${obtenerColorAvatar(u.nombrelargo)}">
        ${obtenerIniciales(u.nombrelargo)}
        </div>
        ${u.nombrelargo}
        </div>
        </td>

        <td>${u.departamento || "-"}</td>

        <td>${u.puesto || "-"}</td>

        <td class="email-cell">${u.correoelectronico || "-"}</td>

        <td>
        <div class="status-cell">
        <span class="status-dot ${dot}"></span>
        ${estado}
        </div>
        </td>

        <td>
        <div class="action-buttons">

        <button class="btn-edit">
        <i class="fa-solid fa-pen"></i>
        </button>

        <button class="btn-toggle" onclick="toggleUsuario('${u.codigoempleado}','${u.estadoempleado}')">
        <i class="fa-solid fa-power-off"></i>
        </button>

        </div>
        </td>

        </tr>
        `;

        tabla.insertAdjacentHTML("beforeend", row);

    });

    renderPaginacion();

}

function renderPaginacion() {

    const totalPaginas = Math.ceil(listaUsuarios.length / usuariosPorPagina);
    const container = document.getElementById("paginationNumbers");

    container.innerHTML = "";

    const maxVisible = 5;

    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + maxVisible - 1);

    if (fin - inicio < maxVisible - 1) {
        inicio = Math.max(1, fin - maxVisible + 1);
    }

    for (let i = inicio; i <= fin; i++) {

        const btn = document.createElement("button");

        btn.className = "page-btn";
        if (i === paginaActual) btn.classList.add("active");

        btn.innerText = i;

        btn.onclick = () => {
            paginaActual = i;
            renderTabla();
        };

        container.appendChild(btn);

    }

    actualizarInfoPaginacion();

}

document.getElementById("prevPage").onclick = () => {

    if (paginaActual > 1) {
        paginaActual--;
        renderTabla();
    }

};

document.getElementById("nextPage").onclick = () => {

    const totalPaginas = Math.ceil(listaUsuarios.length / usuariosPorPagina);

    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderTabla();
    }

};

function actualizarInfoPaginacion() {

    const info = document.getElementById("paginationInfo");

    const inicio = (paginaActual - 1) * usuariosPorPagina + 1;
    const fin = Math.min(paginaActual * usuariosPorPagina, listaUsuarios.length);

    info.innerText = `Showing ${inicio}-${fin} of ${listaUsuarios.length} users`;

}

const btnAgregarUsuario = document.getElementById("btnAgregarUsuario");

function abrirModalCrearUsuario() {
    // 1. Crear el contenedor del modal
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.id = "modalCrearUsuario";

    // Generamos un código de empleado simulado para el ejemplo
    const anioActual = new Date().getFullYear();
    const codigoGenerado = `EMP-${anioActual}-001`;

    // 2. Definir el HTML interno
    modalOverlay.innerHTML = `
        <div class="modal-content" onclick="event.stopPropagation()">
            <button class="btn-close" id="btnCerrarModal"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="modal-header">
                <h2>Crear Nuevo Usuario</h2>
                <p>Complete la información para dar de alta al nuevo integrante.</p>
            </div>

            <div class="modal-form-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                
                <div class="form-group col-span-3">
                    <label>Código de Empleado</label>
                    <input type="text" class="form-input" style="color: var(--primary-blue); font-weight: 600;" value="${codigoGenerado}" readonly>
                </div>

                <div class="form-group">
                    <label>Nombre(s)</label>
                    <input type="text" class="form-input" id="inpNombre" placeholder="Ej. Alejandro">
                </div>

                <div class="form-group">
                    <label>Apellido Paterno</label>
                    <input type="text" class="form-input" id="inpPaterno" placeholder="Ej. Garcia">
                </div>

                <div class="form-group">
                    <label>Apellido Materno</label>
                    <input type="text" class="form-input" id="inpMaterno" placeholder="Ej. Lopez">
                </div>

                <div class="form-group col-span-3">
                    <label>Nombre Completo</label>
                    <input type="text" class="form-input" id="inpCompleto" placeholder="Nombre calculado automáticamente..." readonly>
                </div>

                <div class="form-group col-span-3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label>Departamento</label>
                        <select class="form-input">
                            <option value="" disabled selected>Seleccionar departamento</option>
                            <option value="Sistemas">Sistemas</option>
                            <option value="RH">Recursos Humanos</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Puesto</label>
                        <select class="form-input">
                            <option value="" disabled selected>Seleccionar puesto</option>
                            <option value="Dev">Desarrollador</option>
                            <option value="Admin">Administrativo</option>
                        </select>
                    </div>
                </div>

                <div class="form-group col-span-3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label>Teléfono</label>
                        <div class="input-container">
                            <i class="fa-solid fa-phone"></i>
                            <input type="text" class="form-input input-with-icon" placeholder="+52 (55) 0000 0000">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Correo Electrónico</label>
                        <div class="input-container">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" class="form-input input-with-icon" placeholder="usuario@executive.com">
                        </div>
                    </div>
                </div>

                <div class="form-group col-span-3">
                    <div class="special-state-box">
                        <div class="special-state-text">
                            <h4><i class="fa-solid fa-graduation-cap" style="color: #94a3b8; margin-right: 8px;"></i> Estado Especial</h4>
                            <p>¿Este usuario es actualmente un becario?</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="chkBecario">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn-cancel" id="btnCancelarModal">Cancelar</button>
                <button class="btn-primary" id="btnGuardarUsuario">
                    <i class="fa-solid fa-user-plus"></i> Crear Usuario
                </button>
            </div>
        </div>
    `;

    // 3. Añadir el modal al body
    document.body.appendChild(modalOverlay);

    // 4. Lógica para autocompletar el nombre completo
    const inpNombre = document.getElementById("inpNombre");
    const inpPaterno = document.getElementById("inpPaterno");
    const inpMaterno = document.getElementById("inpMaterno");
    const inpCompleto = document.getElementById("inpCompleto");

    const actualizarNombreCompleto = () => {
        const partes = [inpPaterno.value, inpMaterno.value, inpNombre.value].filter(val => val.trim() !== "");
        inpCompleto.value = partes.join(" ");
    };

    inpNombre.addEventListener("input", actualizarNombreCompleto);
    inpPaterno.addEventListener("input", actualizarNombreCompleto);
    inpMaterno.addEventListener("input", actualizarNombreCompleto);

    // 5. Lógica para cerrar el modal (Destruye el elemento del DOM)
    const cerrarModal = () => {
        modalOverlay.remove();
    };

    document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
    document.getElementById("btnCancelarModal").addEventListener("click", cerrarModal);
    modalOverlay.addEventListener("click", cerrarModal); // Cierra al hacer clic fuera

    // Opcional: Cerrar con la tecla ESC
    document.addEventListener("keydown", function escListener(e) {
        if (e.key === "Escape") {
            cerrarModal();
            document.removeEventListener("keydown", escListener);
        }
    });

    // 6. Lógica de "Crear Usuario" (Aquí puedes hacer tu POST a la API)
    document.getElementById("btnGuardarUsuario").addEventListener("click", async () => {

        const nombre = document.getElementById("inpNombre").value.trim();
        const apellidopaterno = document.getElementById("inpPaterno").value.trim();
        const apellidomaterno = document.getElementById("inpMaterno").value.trim();
        const nombrelargo = document.getElementById("inpCompleto").value.trim();

        const correo = document.querySelector('input[type="email"]').value.trim();
        const telefono = document.querySelector('input[type="text"][placeholder*="+52"]').value.trim();

        const selects = document.querySelectorAll("select");
        const departamento = selects[0].value;
        const puesto = selects[1].value;

        const esBecario = document.getElementById("chkBecario").checked;

        // VALIDACIÓN FRONT
        if (!nombre || !apellidopaterno || !correo || !departamento || !puesto) {
            alert("Completa todos los campos obligatorios");
            return;
        }

        try {

            const res = await fetch("/sistemas/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    apellidopaterno,
                    apellidomaterno,
                    nombrelargo,
                    correo,
                    departamento,
                    puesto,
                    esBecario
                })
            });

            const data = await res.json();

            if (!data.ok) {
                alert(data.msg || "Error al crear usuario");
                return;
            }

            // ÉXITO
            Swal.fire({
                icon: "success",
                title: "Usuario creado",
                text: "El usuario fue registrado correctamente"
            });
            cerrarModal();
            cargarUsuarios(); // refresca tabla

        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    });
}

// 7. Escuchar el evento del botón principal
if (btnAgregarUsuario) {
    btnAgregarUsuario.addEventListener("click", abrirModalCrearUsuario);
}

