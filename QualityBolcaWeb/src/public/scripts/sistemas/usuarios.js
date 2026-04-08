
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

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

        <button class="btn-edit" onclick="editarUsuario('${u.codigoempleado}')">
        <i class="fa-solid fa-pen"></i>
        </button>

        <button class="btn-toggle" onclick="eliminarUsuario('${u.codigoempleado}','${u.nombrelargo}')">
        <i class="fa-solid fa-trash"></i>
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
                    <input type="text" id="inpCodigoEmpleado" class="form-input" style="color: var(--primary-blue); font-weight: 600;" readonly>
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
                        <select class="form-input" id="selectDepartamento">
                            <option value="" disabled selected>Seleccionar departamento</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Puesto</label>
                        <select class="form-input" id="selectPuesto">
                            <option value="" disabled selected>Seleccionar puesto</option>
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
                            <h4><i class="fa-solid fa-graduation-cap" style="color: #94a3b8; margin-right: 8px;"></i> Es becario?</h4>
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

    // Añadir el modal al body
    document.body.appendChild(modalOverlay);

    // Lógica para autocompletar el nombre completo
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

    // Lógica para cerrar el modal (Destruye el elemento del DOM)
    const cerrarModal = () => {
        modalOverlay.remove();
    };

    document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
    document.getElementById("btnCancelarModal").addEventListener("click", cerrarModal);
    modalOverlay.addEventListener("click", cerrarModal); // Cierra al hacer clic fuera

    // Cerrar con la tecla ESC
    document.addEventListener("keydown", function escListener(e) {
        if (e.key === "Escape") {
            cerrarModal();
            document.removeEventListener("keydown", escListener);
        }
    });

    // Lógica de "Crear Usuario" (Aquí puedes hacer tu POST a la API)
    document.getElementById("btnGuardarUsuario").addEventListener("click", async () => {

        const nombre = document.getElementById("inpNombre").value.trim();
        const apellidopaterno = document.getElementById("inpPaterno").value.trim();
        const apellidomaterno = document.getElementById("inpMaterno").value.trim();
        const nombrelargo = document.getElementById("inpCompleto").value.trim();

        const correo = document.querySelector('#modalCrearUsuario input[type="email"]').value.trim();
        const telefono = document.querySelector('#modalCrearUsuario input[placeholder*="+52"]').value.trim();

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
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken
                },
                body: JSON.stringify({
                    nombre,
                    apellidopaterno,
                    apellidomaterno,
                    nombrelargo,
                    correo,
                    telefono,
                    departamento,
                    puesto,
                    esBecario
                })
            });

            console.log("STATUS:", res.status);
            const data = await res.json();

            if (!data.ok) {
                alert(data.msg || "Error al crear usuario");
                return;
            }

            console.log("Antes de Swal")
            // ÉXITO
            Swal.fire({
                icon: "success",
                title: "Usuario creado",
                text: "El usuario fue registrado correctamente"
            });



            cerrarModal();
            cargarUsuarios(); // refresca tabla

        } catch (error) {
            console.error("error:", error);
            alert("Error de conexión");
        }
    });

    async function cargarDatosModal() {
        try {
            const res = await fetch("/sistemas/usuarios/datos-nuevo");
            const data = await res.json();

            if (!data.ok) return;

            // Código empleado
            document.getElementById("inpCodigoEmpleado").value = data.siguienteCodigo;

            // Departamentos
            const selectDep = document.getElementById("selectDepartamento");
            selectDep.innerHTML = `<option value="" disabled selected>Seleccionar departamento</option>`;

            data.departamentos.forEach(dep => {
                selectDep.innerHTML += `<option value="${dep.iddepartamento}">${dep.descripcion}</option>`;
            });

            // Puestos
            const selectPuesto = document.getElementById("selectPuesto");
            selectPuesto.innerHTML = `<option value="" disabled selected>Seleccionar puesto</option>`;

            data.puestos.forEach(p => {
                selectPuesto.innerHTML += `<option value="${p.idpuesto}">${p.descripcion}</option>`;
            });

        } catch (error) {
            console.error("Error cargando datos del modal:", error);
        }
    }

    cargarDatosModal();
}

async function eliminarUsuario(codigo, nombre) {

    const confirmacion = await Swal.fire({
        title: "¿Eliminar usuario?",
        text: `Se eliminará a ${nombre}. Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    try {

        const res = await fetch(`/sistemas/usuarios/${codigo}`, {
            method: "DELETE",
            headers: {
                "CSRF-Token": csrfToken
            }
        });

        const data = await res.json();

        if (!data.ok) {
            Swal.fire("Error", data.msg || "No se pudo eliminar", "error");
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Usuario eliminado",
            text: data.msg || "El usuario fue eliminado correctamente"
        });

        cargarUsuarios();
        
    } catch (error) {
        console.error("Error:", error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error de conexión"
        });
    }
}

async function editarUsuario(codigo) {

    const usuario = listaUsuarios.find(u => u.codigoempleado == codigo);

    if (!usuario) {
        alert("Usuario no encontrado");
        return;
    }

    abrirModalEditarUsuario(usuario);
}

function abrirModalEditarUsuario(usuario) {

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.id = "modalEditarUsuario";

    modalOverlay.innerHTML = `
        <div class="modal-content" onclick="event.stopPropagation()">
            <button class="btn-close" id="btnCerrarModal"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="modal-header">
                <h2>Editar Usuario</h2>
                <p>Actualiza la información del usuario.</p>
            </div>

            <div class="modal-form-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                
                <div class="form-group col-span-3">
                    <label>Código de Empleado</label>
                    <input type="text" id="editCodigo" class="form-input" value="${usuario.codigoempleado}" readonly>
                </div>

                <div class="form-group">
                    <label>Nombre(s)</label>
                    <input type="text" class="form-input" id="editNombre" value="${usuario.nombrelargo?.split(" ")[2] || ""}">
                </div>

                <div class="form-group">
                    <label>Apellido Paterno</label>
                    <input type="text" class="form-input" id="editPaterno" value="${usuario.nombrelargo?.split(" ")[0] || ""}">
                </div>

                <div class="form-group">
                    <label>Apellido Materno</label>
                    <input type="text" class="form-input" id="editMaterno" value="${usuario.nombrelargo?.split(" ")[1] || ""}">
                </div>

                <div class="form-group col-span-3">
                    <label>Nombre Completo</label>
                    <input type="text" class="form-input" id="editCompleto" value="${usuario.nombrelargo}" readonly>
                </div>

                <div class="form-group col-span-3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label>Departamento</label>
                        <select class="form-input" id="editDepartamento"></select>
                    </div>

                    <div class="form-group">
                        <label>Puesto</label>
                        <select class="form-input" id="editPuesto"></select>
                    </div>
                </div>

                <div class="form-group col-span-3">
                <div class="form-group">
                    <label>Telefono</label>
                    <input type="text" class="form-input" id="editTelefono" value="${usuario.telefono || ""}">
                </div>

                    <label>Correo Electrónico</label>
                    <input type="email" class="form-input" id="editCorreo" value="${usuario.correoelectronico || ""}">
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn-cancel" id="btnCancelarModal">Cancelar</button>
                <button class="btn-primary" id="btnActualizarUsuario">
                    <i class="fa-solid fa-save"></i> Actualizar Usuario
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const cerrarModal = () => modalOverlay.remove();

    document.getElementById("btnCerrarModal").onclick = cerrarModal;
    document.getElementById("btnCancelarModal").onclick = cerrarModal;
    modalOverlay.onclick = cerrarModal;

    cargarDatosEdicion(usuario);

    document.getElementById("btnActualizarUsuario").addEventListener("click", () => actualizarUsuario(usuario.codigoempleado, cerrarModal));

    const inpNombre = document.getElementById("editNombre");
    const inpPaterno = document.getElementById("editPaterno");
    const inpMaterno = document.getElementById("editMaterno");
    const inpCompleto = document.getElementById("editCompleto");

    const actualizarNombreCompleto = () => {
        const partes = [inpPaterno.value, inpMaterno.value, inpNombre.value]
            .filter(val => val.trim() !== "");
        inpCompleto.value = partes.join(" ");
    };

    inpNombre.addEventListener("input", actualizarNombreCompleto);
    inpPaterno.addEventListener("input", actualizarNombreCompleto);
    inpMaterno.addEventListener("input", actualizarNombreCompleto);
}

async function cargarDatosEdicion(usuario) {

    const res = await fetch("/sistemas/usuarios/datos-nuevo");
    const data = await res.json();

    if (!data.ok) return;

    const selectDep = document.getElementById("editDepartamento");
    const selectPuesto = document.getElementById("editPuesto");

    selectDep.innerHTML = `<option value="">Seleccionar departamento</option>`;
    selectPuesto.innerHTML = `<option value="">Seleccionar puesto</option>`;

    data.departamentos.forEach(dep => {
        const selected = dep.iddepartamento == usuario.iddepartamento ? "selected" : "";
        selectDep.innerHTML += `<option value="${dep.iddepartamento}" ${selected}>${dep.descripcion}</option>`;
    });

    data.puestos.forEach(p => {
        const selected = p.idpuesto === usuario.idpuesto ? "selected" : "";
        selectPuesto.innerHTML += `<option value="${p.idpuesto}" ${selected}>${p.descripcion}</option>`;
    });
}

// Escuchar el evento del botón principal
if (btnAgregarUsuario) {
    btnAgregarUsuario.addEventListener("click", abrirModalCrearUsuario);
}

async function actualizarUsuario(codigo, cerrarModal) {

    const nombre = document.getElementById("editNombre").value.trim();
    const apellidopaterno = document.getElementById("editPaterno").value.trim();
    const apellidomaterno = document.getElementById("editMaterno").value.trim();
    const telefono = document.getElementById("editTelefono").value.trim();

    const nombrelargo = `${apellidopaterno} ${apellidomaterno} ${nombre}`;

    const correo = document.getElementById("editCorreo").value.trim();
    const departamento = document.getElementById("editDepartamento").value;
    const puesto = document.getElementById("editPuesto").value;

    if (!nombre || !apellidopaterno || !correo || !departamento || !puesto) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa todos los campos obligatorios"
        });
        return;
    }

    try {
        console.log({ nombre, apellidopaterno, apellidomaterno, nombrelargo, correo, departamento, puesto })
        const res = await fetch(`/sistemas/usuarios/${codigo}/actualizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken
            },
            body: JSON.stringify({
                nombre,
                apellidopaterno,
                apellidomaterno,
                nombrelargo,
                correo,
                telefono,
                departamento,
                puesto
            })
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
            throw new Error(data.msg || "Error al actualizar");
        }

        Swal.fire({
            icon: "success",
            title: "Usuario actualizado",
            text: data.msg || "Actualización exitosa"
        });

        cerrarModal();
        cargarUsuarios();

    } catch (error) {
        console.error("Error:", error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "No se pudo actualizar el usuario"
        });
    }
}