const selDep = document.getElementById('dropdown1')
const listaProcesos = document.getElementById('dropdown2')
const inpPU = document.getElementById('texto1')
const inpPU2 = document.getElementById('texto2')
const inpU = document.getElementById('numero')
const btnAgregarFila = document.getElementById('btnAgregarFila')
const total = document.getElementById('total')
const cuenta = document.getElementById('cuenta');
const contador = document.getElementById('contador');



var option1, option2, option3, option4
var vTotal = 0

selDep.addEventListener('change', () => {
    limpiar();
    console.log('Boton presionado');
    var selectedOption = selDep.selectedIndex;
    switch (selectedOption) {
        case 1:
            option1 = document.createElement('option')
            option1.textContent = "FACTURACION Y COBRANZA"
            option1.value = "FACTURACION Y COBRANZA"
            option1.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            break;
        case 2:
            option1 = document.createElement('option')
            option1.textContent = "COMERCIALIZACION Y VENTAS"
            option1.value = "COMERCIALIZACION Y VENTAS"
            option1.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            break;
        case 3:
            option1 = document.createElement('option')
            option1.textContent = "CONTROL Y MEJORA DEL SERVICIO"
            option1.value = "CONTROL Y MEJORA DEL SERVICIO"
            option1.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            break;
        case 4:
            option1 = document.createElement('option')
            option2 = document.createElement('option')
            option1.textContent = "EJECUCION DEL SERIVCIO"
            option2.textContent = "CAPTURACION"
            option1.value = "EJECUCION DEL SERIVCIO"
            option2.value = "CAPTURACION"
            option1.classList.add('listaProc')
            option2.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            listaProcesos.appendChild(option2)
            break;
        case 5:
            option1 = document.createElement('option')
            option2 = document.createElement('option')
            option3 = document.createElement('option')
            option1.textContent = "ACH"
            option2.textContent = "GCH"
            option3.textContent = "NOMINAS"
            option1.value = "ACH"
            option2.value = "GCH"
            option3.value = "NOMINAS"
            option1.classList.add('listaProc')
            option2.classList.add('listaProc')
            option3.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            listaProcesos.appendChild(option2)
            listaProcesos.appendChild(option3)
            break;
        case 6:
            option1 = document.createElement('option')
            option2 = document.createElement('option')
            option3 = document.createElement('option')
            option4 = document.createElement('option')
            option1.textContent = "COMPRAS"
            option2.textContent = "GASTOS"
            option3.textContent = "LOGISTICA VEHICULAR"
            option4.textContent = "TECNOLOGIAS DE LA INFORMACION"
            option1.value = "COMPRAS"
            option2.value = "GASTOS"
            option3.value = "LOGISTICA VEHICULAR"
            option4.value = "TECNOLOGIAS DE LA INFORMACION"
            option1.classList.add('listaProc')
            option2.classList.add('listaProc')
            option3.classList.add('listaProc')
            option4.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            listaProcesos.appendChild(option2)
            listaProcesos.appendChild(option3)
            listaProcesos.appendChild(option4)
            break;
        case 7:
            option1 = document.createElement('option')
            option1.textContent = "SERVICIO AL CLIENTE"
            option1.value = "SERVICIO AL CLIENTE"
            option1.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            break;
        case 8:
            option1 = document.createElement('option')
            option1.textContent = "ALTA DIRECCION"
            option1.value = "ALTA DIRECCION"
            option1.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            break;
        case 9:
            option1 = document.createElement('option')
            option1.textContent = "SISTEMA DE GESTION DE CALIDAD"
            option1.value = "SISTEMA DE GESTION DE CALIDAD"
            option1.classList.add('listaProc')
            listaProcesos.appendChild(option1)
            break;
    }
})

inpPU.addEventListener('keyup', () => {
    inpPU2.value = inpPU.value * inpU.value
})
inpPU.addEventListener('click', () => {
    inpPU2.value = inpPU.value * inpU.value
})

inpU.addEventListener('keyup', () => {
    inpPU2.value = inpPU.value * inpU.value
})

inpU.addEventListener('click', () => {
    inpPU2.value = inpPU.value * inpU.value
})

btnAgregarFila.addEventListener('click', () => {
    agregarFila()
})

cuenta.addEventListener('keyup', () =>{
    contador.textContent = 18 - cuenta.value.length
})

function limpiar() {
    while (listaProcesos.firstChild) {
        listaProcesos.removeChild(listaProcesos.firstChild);
    }
}

function agregarFila() {
    const descripcion = document.getElementById('descripcion').value;
    const numero = document.getElementById('numero').value;
    const texto1 = document.getElementById('texto1').value;
    const texto2 = document.getElementById('texto2').value;
    const hdescripcion = document.getElementById('hdescripcion')

    if (descripcion && numero && texto1 && texto2) {
        const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
        const nuevaFila = tabla.insertRow();

        const celdaDescripcion = nuevaFila.insertCell(0);
        const celdaNumero = nuevaFila.insertCell(1);
        const celdaTexto1 = nuevaFila.insertCell(2);
        const celdaTexto2 = nuevaFila.insertCell(3);
        hdescripcion.value += descripcion + '▄' + numero + '▄' + texto1 + '▄' + texto2 + '▄'
        celdaDescripcion.textContent = descripcion;
        celdaNumero.textContent = numero;
        celdaTexto1.textContent = texto1;
        celdaTexto2.textContent = texto2;
        celdaDescripcion.classList.add('table-light')
        celdaNumero.classList.add('table-light')
        celdaTexto1.classList.add('table-light')
        celdaTexto2.classList.add('table-light')
        vTotal = vTotal + parseFloat(texto2)
        total.value = vTotal
        console.log(vTotal);

        // table-primary
        
        document.getElementById('descripcion').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('texto1').value = '';
        document.getElementById('texto2').value = '';
    } else {
        // alert("Debe llenar los recuadros no sea ¡Imbecil!");
        Swal.fire({
            title: 'Error',
            icon: 'error',
            // text: 'Debe llenar los recuadros no sea ¡Imbecil!'
            text: 'Debe llenar los recuadros no sea ¡flojo!'
        })
    }
}