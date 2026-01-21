//import { cat } from "@xenova/transformers";

//import { layer_norm } from "@xenova/transformers";

const colaboradoresGrid = document.getElementById('colaboradoresGrid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

const btnCrearVale = document.getElementById('btnCrearVale');
btnCrearVale.addEventListener("click", showCrearVale)


closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

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

    let vbody = '';
    let Vhtmlheader = '';
    let Vhtmlfooter = '';
    let Vhtmlbody = '';

    Vhtmlheader =
        `
    <div class="vale-header">
            <div class="vale-logo">
                <img src="../img/Quality-BOLCA.png" alt="Quality BOLCA Logo" style="width: 200%;">
            </div>
            <div class="vale-title">
                <h2>Vale de asignación de equipos</h2>
                <p>Documento de entrega y responsabilidad</p>
                <p>Folio: ${vLista.folio}</p>
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

    for (let i = 0; i < rid2.length; i++) {
        let estado2 = restado[i] === '1' ? 'Nuevo' : 'Usado'
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
                            <p>${estado2}</p>
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
                <p><strong>Fecha de Entrega:</strong> ${vLista.fechaFolio}</p>
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
                    <img src="../firmas/618818.webp" alt="Firma del Colaborador">
                </div>
                <div class="signature-line">
                    <p>Firma del Responsable de TI</p>
                    <p>Nombre: Oscar Arturo De luna Lujan</p>
                    <p>Cargo: Analista de TI</p>
                </div>
            </div>
            <div class="signature">
                <div class="signature-area">
                    <img src="../firmas/${vLista.firma}" alt="Firma del Colaborador">
                </div>
                <div class="signature-line">
                    <p>Firma del Colaborador</p>
                    <p>Nombre: ${vLista.nombrelargo}</p>
                    <p>Fecha: ${vLista.fechaFolio}</p>
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

function showSuccessModal(mensaje) {
    modalBody.innerHTML = `
        <h3 style="color: green; text-align:center;">✔ ${mensaje}</h3>
        <div class="modal-buttons" style="margin-top:20px; display:flex; justify-content:center;">
            <button id="btnCerrarExito" class="btn btn-outline">Aceptar</button>
        </div>
    `;

    modal.style.display = "block";

    document.getElementById("btnCerrarExito").addEventListener("click", () => {
        closeModal();
        location.reload(); // Recargar tabla
    }, { once: true });

}


colaboradoresGrid.addEventListener('click', function (e) {
    const btnBaja = e.target.closest('.btn-dar-baja');
    const btnAdd = e.target.closest(".btn-agregar");
    const btnRemover = e.target.closest(".btn-remover");

    if (btnBaja) {
        showConfirmacionDarBaja(btnBaja.dataset.datos);
        return;
    }

    if(btnAdd) {
        showAgregarEquipos(btnAdd.dataset.datos)
        return;
    }

    if(btnRemover) {
        showRemoverEquipos(btnRemover.dataset.datos)
        return;
    }
})

async function showCrearVale() {
    modalBody.innerHTML = `<p>Cargando colaboradores disponibles...</p>`;
    modal.style.display = "block";

    try {
        // 1. Obtener colaboradores que aún NO tienen vale
        const res = await fetch("/sistemas/colaboradores-sin-vale");
        const disponibles = await res.json();

        if (!Array.isArray(disponibles) || disponibles.length === 0) {
            modalBody.innerHTML = `
                <h3>Crear Vale</h3>
                <p>No hay colaboradores disponibles para asignar vale.</p>
                <button id="cerrarModal" class="btn btn-outline" style="margin-top:15px;">Cerrar</button>
            `;
            document.getElementById("cerrarModal").onclick = closeModal;
            return;
        }

        // 2. Dibujar modal para seleccionar colaborador
        let html = `
            <h3>Crear Vale Nuevo</h3>
            <p>Selecciona un colaborador para crearle un vale:</p>

            <select id="selectColaborador" class="custom-select">
                <option value="">-- Seleccionar colaborador --</option>
        `;

        disponibles.forEach(c => {
            html += `<option value="${c.codigoempleado}" data-nombre="${c.nombrelargo}">${c.nombrelargo}</option>`;
        });

        html += `
            </select>

            <div id="contenedorEquipos" style="margin-top:20px; display:none;">
                <h4>Selecciona los equipos que se asignarán:</h4>
                <p>Cargando inventario...</p>
            </div>

            <div class="modal-buttons">
                <button id="cancelarCrear" class="btn btn-outline">Cancelar</button>
                <button id="aceptarCrear" class="btn btn-primary" disabled>Crear Vale</button>
            </div>
        `;

        modalBody.innerHTML = html;

        document.getElementById("cancelarCrear").onclick = closeModal;

        const selectColaborador = document.getElementById("selectColaborador");
        const contenedorEquipos = document.getElementById("contenedorEquipos");
        const btnAceptar = document.getElementById("aceptarCrear");

        // 3. Cuando selecciona colaborador → cargar equipos disponibles
        selectColaborador.addEventListener("change", async () => {
            const numeroEmpleado = selectColaborador.value;

            if (!numeroEmpleado) {
                contenedorEquipos.style.display = "none";
                btnAceptar.disabled = true;
                return;
            }

            contenedorEquipos.style.display = "block";
            contenedorEquipos.innerHTML = `<p>Cargando inventario...</p>`;

            try {
                const resInv = await fetch("/sistemas/inventario-disponible");
                const inventario = await resInv.json();

                if (inventario.length === 0) {
                    contenedorEquipos.innerHTML = `
                        <p style="color:red;">No hay equipos disponibles para asignar.</p>
                    `;
                    btnAceptar.disabled = true;
                    return;
                }

                let eq = `
                    <div class="equipos-lista" style="max-height:250px; overflow-y:auto; margin-top:15px;">
                `;

                inventario.forEach(e => {
                    eq += `
                        <label class="equipo-item" style="display:flex; align-items:center; margin-bottom:8px;">
                            <input type="checkbox" class="equipo-crear-check" value="${e.idInventario}">
                            <span style="margin-left:8px;">
                                <strong>${e.marca}</strong> - ${e.tipo} (${e.serie})
                                <br><small>ID: ${e.idInventario}</small>
                            </span>
                        </label>
                    `;
                });

                eq += `</div>`;
                contenedorEquipos.innerHTML = eq;
                btnAceptar.disabled = false;

            } catch (error) {
                console.error(error);
                contenedorEquipos.innerHTML = `<p style="color:red;">Error al cargar inventario.</p>`;
                btnAceptar.disabled = true;
            }
        });

        //Crear el vale
        document.getElementById("aceptarCrear").addEventListener("click", async () => {
            const numeroEmpleado = selectColaborador.value;
            const nombreColaborador = selectColaborador.selectedOptions[0].dataset.nombre;

            const seleccionados = [...document.querySelectorAll('.equipo-crear-check:checked')]
                .map(chk => chk.value);

            if (seleccionados.length === 0) {
                alert("Debes seleccionar al menos un equipo.");
                return;
            }

            try {
                const CSRF = document.getElementById("csrfToken").value;

                const resFinal = await fetch("/sistemas/crear-vale", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": CSRF
                    },
                    body: JSON.stringify({
                        numeroEmpleado,
                        equipos: seleccionados
                    })
                });

                const data = await resFinal.json();

                if (data.ok) {
                    showSuccessModal(`El vale para ${nombreColaborador} fue creado correctamente.`);
                } else {
                    alert(data.message || "Error al crear vale.");
                }

            } catch (error) {
                console.error(error);
                alert("Error inesperado al crear vale.");
            }
        });

    } catch (error) {
        console.error(error);
        modalBody.innerHTML = `<p style="color:red;">Error al cargar los colaboradores sin vale.</p>`;
    }
}


async function showAgregarEquipos(datosJSON) {
    
    const colaborador = JSON.parse(datosJSON)

    modalBody.innerHTML = `<p>Cargando inventario disponible...</p>`;
    modal.style.display = "block";

    try {
        const res = await fetch('/sistemas/inventario-disponible');
        const equipos = await res.json();

        let html = `
            <h3>Agregar Equipos al Vale</h3>
            <p>Selecciona los equipos que deseas asignar al colaborador:</p>
            <p><strong>Folio actual:</strong> ${colaborador.folio}</p>

            <div class="equipos-lista" style="max-height:300px; overflow-y:auto; margin-top:15px;">
        `;

        equipos.forEach(e => {
            html += `
                <label class="equipo-item" style="display:flex; align-items:center; margin-bottom:8px;">
                    <input type="checkbox" class="equipo-check" value="${e.idInventario}">
                    <span style="margin-left:8px;">
                        <strong>${e.marca}</strong> - ${e.tipo} (${e.serie})
                        <br><small>ID: ${e.idInventario}</small>
                    </span>
                </label>
            `;
        });

        html += `
            </div>

            <div class="modal-buttons-agregar" style="margin-top:20px; display:flex; justify-content:space-between;">
                <button id="cancelarAgregar" class="btn btn-outline">Cancelar</button>
                <button id="aceptarAgregar" class="btn btn-primary">Aceptar</button>
            </div>
        `;

        modalBody.innerHTML = html;

        document.getElementById("cancelarAgregar").addEventListener("click", closeModal);

        document.getElementById("aceptarAgregar").addEventListener("click", async () => {
            const seleccionados = [...document.querySelectorAll('.equipo-check:checked')]
                .map(chk => chk.value);

            if (seleccionados.length === 0) {
                alert("Debes seleccionar al menos un equipo.");
                return;
            }

        try {
                const CSRF = document.getElementById("csrfToken").value;

                const res2 = await fetch(`/sistemas/agregar-equipos/${colaborador.folio}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": CSRF
                    },
                    body: JSON.stringify({
                        equipos: seleccionados
                    })
                });

                const data = await res2.json();

                if (data.ok) {
                    showSuccessModal("Los equipos fueron agregados correctamente.");
                } else {
                    alert("Error: " + data.message);
                }

            } catch (err) {
                console.error(err);
                alert("Error inesperado al asignar equipos.");
            }

        });
    } catch (error) {
        console.error(error);
        modalBody.innerHTML = `<p style="color:red;">Error al cargar el inventario disponible.</p>`;
    }

}

async function showRemoverEquipos(datosJSON) {
    const { folio } = JSON.parse(datosJSON);

    modalBody.innerHTML = `<p>Cargando equipos asignados...</p>`;
    modal.style.display = "block";

    try {
        const res = await fetch(`/sistemas/equipos-asignados/${folio}`);
        const equipos = await res.json();

        if (equipos.length === 0) {
            modalBody.innerHTML = `
                <h3>Remover Equipos</h3>
                <p>Este colaborador no tiene equipos asignados.</p>
                <button id="cerrarModal" class="btn btn-outline" style="margin-top: 15px;">Cerrar</button>
            `;

            document.getElementById("cerrarModal").onclick = closeModal;
            return;
        }

        let html = `
            <h3>Remover Equipos del Vale</h3>
            <p>Selecciona los equipos que deseas remover del colaborador:</p>
            <p><strong>Folio actual:</strong> ${folio}</p>

            <div class="equipos-lista" style="max-height:300px; overflow-y:auto; margin-top:15px;">
        `;

        equipos.forEach(e => {
            html += `
                <label class="equipo-item" style="display:flex; align-items:center; margin-bottom:8px;">
                    <input type="checkbox" class="equipo-remover-check" value="${e.idInventario}">
                    <span style="margin-left:8px;">
                        <strong>${e.marca}</strong> - ${e.tipo} (${e.serie})
                        <br><small>ID: ${e.idInventario}</small>
                    </span>
                </label>
            `;
        });

        html += `
            </div>

            <div class="modal-buttons-agregar" style="margin-top:20px; display:flex; justify-content:space-between;">
                <button id="cancelarRemover" class="btn btn-outline">Cancelar</button>
                <button id="aceptarRemover" class="btn btn-primary">Aceptar</button>
            </div>
        `;

        modalBody.innerHTML = html;

        document.getElementById("cancelarRemover").addEventListener("click", closeModal);

        document.getElementById("aceptarRemover").addEventListener("click", async () => {
            const seleccionados = [...document.querySelectorAll('.equipo-remover-check:checked')]
                .map(chk => chk.value);

            if (seleccionados.length === 0) {
                showErrorModal("Debes seleccionar al menos un equipo.");
                return;
            }

            try {
                const CSRF = document.getElementById("csrfToken").value;

                const res2 = await fetch(`/sistemas/remover-equipos/${folio}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": CSRF
                    },
                    body: JSON.stringify({
                        equipos: seleccionados
                    })
                });

                const data = await res2.json();

                if (data.ok) {
                    showSuccessModal("Los equipos fueron removidos correctamente.");
                } else {
                    showErrorModal(data.message || "Error al remover equipos.");
                }

            } catch (err) {
                console.error(err);
                alert("Error inesperado al remover equipos.", err);
            }

        });

    } catch (err) {
        console.error(err);
        modalBody.innerHTML = `<p style="color:red;">Error al cargar los equipos asignados.</p>`;
    }
}

function showConfirmacionDarBaja(datosJSON) {

    vLista = JSON.parse(datosJSON);

    modalBody.innerHTML = `
        <h3 id="tituloBaja">¿Estás seguro que quieres dar de baja este vale?</h3>
        <p id="folioBaja" style="margin-top:8px;">(Folio:<strong> ${vLista.folio})<strong></p>
        <div class="modal-buttons" style="margin-top:20px; display:flex; justify-content:space-around;">
            <button id="confirmarBaja" class="btn btn-destructive">Sí</button>
            <button id="cancelarBaja" class="btn btn-outline">No</button>
        </div>
    `;

    modal.style.display = 'block'
    const csrfToken = document.getElementById("csrfToken").value;

    document.getElementById("cancelarBaja").addEventListener("click", closeModal, { once: true });
    document.getElementById("confirmarBaja").addEventListener("click", async () => {
        try {
            const respuesta = await fetch(`/sistemas/darBaja/${vLista.folio}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken
                },
                body: JSON.stringify({})

            });

            const data = await respuesta.json();

            if (data.ok) {
                showSuccessModal("El vale fue dado de baja correctamente.");

            } else {
                alert("Error: " + data.message);
            }

        } catch (err) {
            console.error("Error al dar de baja:", err);
            alert("Error inesperado al dar de baja");
        }
    }, { once: true });
}