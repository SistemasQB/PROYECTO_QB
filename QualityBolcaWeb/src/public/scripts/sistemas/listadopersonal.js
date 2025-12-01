
const colaboradoresGrid = document.getElementById('colaboradoresGrid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');


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
    const btn = e.target.closest('.btn-dar-baja');
    if (!btn) return;

    const datos = btn.dataset.datos;

    showConfirmacionDarBaja(datos);
})

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