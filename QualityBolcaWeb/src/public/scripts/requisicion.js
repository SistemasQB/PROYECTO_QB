function updateLabel() {
    const input = document.getElementById('imagen');
    const label = document.querySelector('.custom-file-label');
    label.textContent = input.files.length > 0 ? input.files[0].name : 'Selecciona una imagen...';
}

function updateImagePreview() {
    const input = document.getElementById('imagen');
    const preview = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }

        reader.readAsDataURL(input.files[0]);
        updateLabel();
    } else {
        preview.style.display = 'none';
    }
}

function toggleModal(checkbox) {
    if (checkbox.checked) {
        $('#rentabilidadModal').modal('show');
    } else {
        $('#rentabilidadModal').modal('hide');
    }
}

function enviarInformacion() {
    const responsable = document.getElementById('dropdown3').value;
    const asunto = document.getElementById('campoTexto').value;
    const ordenServ = document.getElementById('campoTexto2').value;
    const descripcion = document.getElementById('descripcion').value;
    const unidad = document.getElementById('numero').value;
    const precioUnitario = document.getElementById('texto1').value;
    const precioTotal = document.getElementById('texto2').value;
    const fecha = document.getElementById('fecha').value;
    const total = document.getElementById('total').value;
    const justificacion1 = document.getElementById('justificacion1').value;
    const justificacion2 = document.getElementById('justificacion2').value;
    const justificacion3 = document.getElementById('justificacion3').value;
    const cuenta = document.getElementById('cuenta').value;

    // Captura del checklist
    const aprobacionFinanciera = document.getElementById('check4').checked ? 'Sí' : 'No';
    const aprobacionCompras = document.getElementById('check5') ? 'Sí' : 'No';
    const revisionTecnica = document.getElementById('check6') ? 'Sí' : 'No';

    const info = `
        Responsable: ${responsable}
        Asunto: ${asunto}
        Orden de Servicio: ${ordenServ}
        Descripción: ${descripcion}
        Unidad: ${unidad}
        Precio Unitario: ${precioUnitario}
        Precio Total: ${precioTotal}
        Fecha: ${fecha}
        Total: ${total}
        Justificación 1: ${justificacion1}
        Justificación 2: ${justificacion2}
        Justificación 3: ${justificacion3}
        Cuenta: ${cuenta}
        Aprobación Financiera: ${aprobacionFinanciera}
        Aprobación de Compras: ${aprobacionCompras}
        Revisión Técnica: ${revisionTecnica}
    `;

    alert(info); // Aquí podrías enviar la información a un servidor
}

function onlyOne(checkbox) {
    var checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((item) => {
        if (item !== checkbox) {
            item.checked = false;
        }
    });
}

function agregarFila() {
    const descripcion = document.getElementById('descripcion').value;
    const numero = document.getElementById('numero').value;
    const texto1 = document.getElementById('texto1').value;
    const texto2 = document.getElementById('texto2').value;

    if (descripcion && numero && texto1 && texto2) {
        const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
        const nuevaFila = tabla.insertRow();

        const celdaDescripcion = nuevaFila.insertCell(0);
        const celdaNumero = nuevaFila.insertCell(1);
        const celdaTexto1 = nuevaFila.insertCell(2);
        const celdaTexto2 = nuevaFila.insertCell(3);

        celdaDescripcion.textContent = descripcion;
        celdaNumero.textContent = numero;
        celdaTexto1.textContent = texto1;
        celdaTexto2.textContent = texto2;

        document.getElementById('descripcion').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('texto1').value = '';
        document.getElementById('texto2').value = '';
    } else {
        alert("Por favor, completa todos los campos.");
    }
}