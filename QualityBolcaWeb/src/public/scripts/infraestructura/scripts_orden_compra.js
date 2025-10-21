

// Variables globales
let rowCounter = 1;
let formData = {}


// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    cargarInformacion()
    // setDefaultDate();
});

// Configurar fecha actual por defecto
// function setDefaultDate() {
//     const today = new Date().toISOString().split('T')[0];
//     // document.getElementById('fecha').value = today;
//     document.getElementById('fechaPedido').value = today;
// }

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón agregar fila
    document.getElementById('addRowBtn').addEventListener('click', addProductRow);
    
    // Botón limpiar formulario
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    
    // Botón imprimir
    // document.getElementById('printBtn').addEventListener('click', printForm);
    
    // Submit del formulario
    document.getElementById('purchaseOrderForm').addEventListener('submit', handleFormSubmit);
    
    // Event listeners para las firmas
    setupSignatureUploads();
    
    // Event listeners para cálculos automáticos
    setupCalculationListeners();
}

// Inicializar el formulario
function initializeForm() {
    // Configurar la primera fila de productos
    setupRowEventListeners(document.querySelector('#productsTableBody tr'));
    
    // Calcular totales iniciales
    calculateTotals();
}

// Agregar nueva fila de producto
function addProductRow() {
    rowCounter++;
    const tableBody = document.getElementById('productsTableBody');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${rowCounter}</td>
        <td><input type="text" name="producto[]" required></td>
        <td><input type="number" name="cantidad[]" min="1" step="1" required></td>
        <td><input type="number" name="precioUnitario[]" min="0" step="0.01" required></td>
        <td class="precio-total">$0.00</td>
        <td><button type="button" class="btn-remove">Eliminar</button></td>
    `;
    
    tableBody.appendChild(newRow);
    setupRowEventListeners(newRow);
    
    // Animar la nueva fila
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
}

// Configurar event listeners para una fila específica
function setupRowEventListeners(row) {
    const cantidadInput = row.querySelector('input[name="cantidad[]"]');
    const precioInput = row.querySelector('input[name="precioUnitario[]"]');
    const removeBtn = row.querySelector('.btn-remove');
    
    // Calcular precio total cuando cambie cantidad o precio
    if (cantidadInput) {
        cantidadInput.addEventListener('input', () => calculateRowTotal(row));
    }
    
    if (precioInput) {
        precioInput.addEventListener('input', () => calculateRowTotal(row));
    }
    
    // Eliminar fila
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removeProductRow(row));
    }
}

// Calcular total de una fila específica
function calculateRowTotal(row) {
    const cantidad = parseFloat(row.querySelector('input[name="cantidad[]"]').value) || 0;
    const precio = parseFloat(row.querySelector('input[name="precioUnitario[]"]').value) || 0;
    const total = cantidad * precio;
    
    row.querySelector('.precio-total').textContent = formatCurrency(total);
    
    // Recalcular totales generales
    calculateTotals();
}

// Eliminar fila de producto
function removeProductRow(row) {
    const tableBody = document.getElementById('productsTableBody');
    
    // No permitir eliminar si es la única fila
    if (tableBody.children.length <= 1) {
        alert('Debe mantener al menos una fila de producto.');
        return;
    }
    
    // Animar eliminación
    row.style.transition = 'all 0.3s ease';
    row.style.opacity = '0';
    row.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        row.remove();
        updateRowNumbers();
        calculateTotals();
    }, 300);
}

// Actualizar numeración de filas
function updateRowNumbers() {
    const rows = document.querySelectorAll('#productsTableBody tr');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').textContent = index + 1;
    });
    rowCounter = rows.length;
}

// Configurar listeners para cálculos automáticos
function setupCalculationListeners() {
    const tableBody = document.getElementById('productsTableBody');
    
    // Usar delegación de eventos para inputs dinámicos
    tableBody.addEventListener('input', function(e) {
        if (e.target.matches('input[name="cantidad[]"], input[name="precioUnitario[]"]')) {
            const row = e.target.closest('tr');
            calculateRowTotal(row);
        }
    });
}

// Calcular todos los totales
function calculateTotals() {
    const rows = document.querySelectorAll('#productsTableBody tr');
    let subtotal = 0;
    
    rows.forEach(row => {
        const cantidad = parseFloat(row.querySelector('input[name="cantidad[]"]').value) || 0;
        const precio = parseFloat(row.querySelector('input[name="precioUnitario[]"]').value) || 0;
        subtotal += cantidad * precio;
    });
    
    const iva = subtotal * 0.16; // 16% IVA
    //const isr = subtotal * 0.10; // 10% ISR
    const total = subtotal + iva //- isr; // ISR se resta
    
    // Actualizar elementos en el DOM
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('iva').textContent = formatCurrency(iva);
    //document.getElementById('isr').textContent = formatCurrency(isr);
    document.getElementById('total').textContent = formatCurrency(total);
}

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(amount);
}

// Configurar subida de firmas
function setupSignatureUploads() {
    const signatureInputs = ['firmaSolicitante', 'firmaConfirma', 'firmaAutoriza'];
    
    signatureInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const previewId = inputId.replace('firma', 'preview');
        const preview = document.getElementById(previewId);
        
        if (input && preview) {
            input.addEventListener('change', function(e) {
                handleSignatureUpload(e, preview);
            });
            
            // Agregar clase empty inicialmente
            preview.classList.add('empty');
        }
    });
}

// Manejar subida de firma
function handleSignatureUpload(event, previewElement) {
    const file = event.target.files[0];
    
    if (file) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor seleccione un archivo de imagen válido.');
            event.target.value = '';
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 5MB.');
            event.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.innerHTML = `<img src="${e.target.result}" alt="Firma">`;
            previewElement.classList.remove('empty');
        };
        reader.readAsDataURL(file);
    } else {
        previewElement.innerHTML = '';
        previewElement.classList.add('empty');
    }
}

// Limpiar formulario
function clearForm() {
    if (confirm('¿Está seguro de que desea limpiar todo el formulario? Esta acción no se puede deshacer.')) {
        // Limpiar todos los inputs
        document.getElementById('purchaseOrderForm').reset();
        
        // Limpiar tabla de productos (mantener solo una fila)
        const tableBody = document.getElementById('productsTableBody');
        tableBody.innerHTML = `
            <tr>
                <td>1</td>
                <td><input type="text" name="producto[]" required></td>
                <td><input type="number" name="cantidad[]" min="1" step="1" required></td>
                <td><input type="number" name="precioUnitario[]" min="0" step="0.01" required></td>
                <td class="precio-total">$0.00</td>
                <td><button type="button" class="btn-remove">Eliminar</button></td>
            </tr>
        `;
        
        // Limpiar previews de firmas
        document.querySelectorAll('.signature-preview').forEach(preview => {
            preview.innerHTML = '';
            preview.classList.add('empty');
        });
        
        // Resetear contador y configurar eventos
        rowCounter = 1;
        setupRowEventListeners(document.querySelector('#productsTableBody tr'));
        
        // Resetear fecha actual
        // setDefaultDate();
        
        // Recalcular totales
        calculateTotals();
        
        alert('Formulario limpiado correctamente.');
    }
}

// Imprimir formulario
function printForm() {
    // Validar que el formulario tenga datos mínimos
    // const orderNumber = document.getElementById('orderNumber').value;
    const proveedor = document.getElementById('nombreProveedor').value;
    
    // if (!orderNumber || !proveedor) {
    //     alert('Por favor complete al menos el número de orden y el nombre del proveedor antes de imprimir.');
    //     return;
    // }
    
    // Configurar para impresión
    const originalTitle = document.title;
    // document.title = `Orden_Compra_${orderNumber}`;
    
    // Imprimir
    window.print();
    
    // Restaurar título
    document.title = originalTitle;
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Recopilar datos del formulario
    const recoleccion = collectFormData();
    
    if (recoleccion){
        formData.informacionProveedor = JSON.stringify(formData.informacionProveedor);
        formData.servicios.partidas = JSON.stringify(formData.servicios.partidas);
        formData.servicios = JSON.stringify(formData.servicios);
        formData.tipo = 'insert';
        formData.status = 'INGRESADA'
        
        alertaFetchCalidad('crudOrdenesCompra', formData,'historicoOrdenesCompra')
    }
    
}

// Validar formulario
function validateForm() {
    const requiredFields = [
          'lugar', 'nombreProveedor', 
        'telefono', 'contacto', 'fechaPago', 
        'formaPago', 'terminosEntrega'
    ];
    
    for (let fieldId of requiredFields) {
        
        const field = document.getElementById(fieldId);
        
        if (!field.value.trim()) {
            alert(`Por favor complete el campo: ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }
    
    // Validar que haya al menos un producto
    const productRows = document.querySelectorAll('#productsTableBody tr');
    let hasValidProduct = false;
    
    for (let row of productRows) {
        const producto = row.querySelector('input[name="producto[]"]').value.trim();
        const cantidad = row.querySelector('input[name="cantidad[]"]').value;
        const precio = row.querySelector('input[name="precioUnitario[]"]').value;
        
        if (producto && cantidad && precio) {
            hasValidProduct = true;
            break;
        }
    }
    
    if (!hasValidProduct) {
        alert('Por favor agregue al menos un producto o servicio válido.');
        return false;
    }
    
    return true;
}

// Recopilar datos del formulario
function collectFormData() {
    formData.fecha = new Date(Date.now())
    formData.lugar = document.getElementById('lugar').value
    formData.observaciones =  document.getElementById('observaciones').value,
    formData.servicios = []
    formData._csrf =  tok
    
    const servicios = {
        partidas: [],    
        subtotal: document.getElementById('subtotal').textContent,
        iva: document.getElementById('iva').textContent,
        total: document.getElementById('total').textContent,
    };
    
    // Recopilar productos
    const productRows = document.querySelectorAll('#productsTableBody tr');
    productRows.forEach((row, index) => {
        const producto = row.querySelector('input[name="producto[]"]').value.trim();
        const cantidad = parseFloat(row.querySelector('input[name="cantidad[]"]').value) || 0;
        const precio = parseFloat(row.querySelector('input[name="precioUnitario[]"]').value) || 0;
        
        if (producto && cantidad && precio) {
            servicios.partidas.push({
                item: index + 1,
                producto: producto,
                cantidad: cantidad,
                precioUnitario: precio,
                precioTotal: cantidad * precio
            });
        }
    });
    formData.servicios = servicios
    return true;
}

// Funciones de utilidad adicionales
function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0d4a8c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para exportar datos (opcional)
function exportToJSON() {
    const data = collectFormData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    // link.download = `orden_compra_${data.orderNumber || 'sin_numero'}.json`;
    link.click();
}
function cargarInformacion(){
    let combo = document.getElementById('nombreProveedor');
    combo.innerHTML = proveedores.map((proveedor) => {
        // let prov = JSON.parse(proveedor);
        return `<option value='${proveedor.razonSocial}'>${proveedor.razonSocial}</option>`
    }).join('')
    combo.addEventListener('change', (e) => {
        busquedaCliente(e.target.value)
    })
}

function busquedaCliente(nombreCliente){
    let proveedor = proveedores.find((prov) => prov.razonSocial == nombreCliente )
    let campos = {
        proveedor: proveedor.razonSocial,
        telefono : proveedor.telefono,
        contacto : proveedor.contacto,
        diasCredito : proveedor.diasCredito,
        correo: proveedor.correo,
        fechaPago: document.getElementById('fechaPago').value,
        formaPago: document.getElementById('formaPago').value,
        terminosEntrega: document.getElementById('terminosEntrega').value,
    }
    formData.informacionProveedor = campos
    document.getElementById('telefono').value = proveedor.telefono
    document.getElementById('contacto').value = proveedor.contacto
    let fecha = new Date(Date.now())
    fecha.setDate(fecha.getDate() + proveedor.diasCredito)
    document.getElementById('fechaPago').value = fecha.toLocaleDateString('en-CA')
    formaPago.value = "transferencia"
}



