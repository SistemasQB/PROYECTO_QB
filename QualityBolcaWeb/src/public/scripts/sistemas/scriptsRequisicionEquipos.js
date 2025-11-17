// State Management
const formState = {
    requesterName: '',
    department: '',
    email: '',
    phone: '',
    items: []
};

const equipmentTypes = [
    'Teléfono',
    'Computadora',
    'Laptop',
    'Microscopio',
    'Monitor',
    'Impresora',
    'Proyector',
    'Mouse',
    'Teclado',
    'Escáner',
    'Tinta',
    'Cartucho',
    'Cable',
    'Conector',
    'Adaptador',
    'Cargador',
    'Línea Telefónica',
    'Disco Duro',
    'Memoria RAM',
    'DVR',
    'Cámara',
    'Cámara IP',
    'Otro'
];

// DOM Elements
const requesterNameInput = document.getElementById('requesterName');
const departmentInput = document.getElementById('department');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const equipmentList = document.getElementById('equipmentList');
const addEquipmentBtn = document.getElementById('addEquipmentBtn');
const submitBtn = document.getElementById('submitBtn');

// Event Listeners for requester info
requesterNameInput.addEventListener('input', (e) => {
    formState.requesterName = e.target.value;
    clearError('requesterName');
    updateSummary();
});

departmentInput.addEventListener('input', (e) => {
    formState.department = e.target.value;
    clearError('department');
    updateSummary();
});

emailInput.addEventListener('input', (e) => {
    formState.email = e.target.value;
    clearError('email');
});

phoneInput.addEventListener('input', (e) => {
    formState.phone = e.target.value;
    clearError('phone');
});

// Add Equipment Button
addEquipmentBtn.addEventListener('click', addEquipmentItem);

// Submit Button
submitBtn.addEventListener('click', handleSubmit);

// Create Equipment Item HTML
function createEquipmentItemHTML(item, index) {
    return `
        <div class="equipment-card" data-item-id="${item.id}">
            <button class="remove-btn" onclick="removeEquipmentItem('${item.id}')">✕</button>
            
            <div class="equipment-item-header">
                <div class="equipment-item-number">${index + 1}</div>
                <h3 class="equipment-item-title">Equipo #${index + 1}</h3>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label>Tipo de Equipo *</label>
                    <select class="select-field" onchange="updateEquipmentItem('${item.id}', 'equipment', this.value)">
                        <option value="">Seleccione un equipo...</option>
                        ${equipmentTypes.map(type => `<option value="${type}" ${item.equipment === type ? 'selected' : ''}>${type}</option>`).join('')}
                    </select>
                    <span class="error-message" id="error-item-${item.id}-equipment"></span>
                </div>

                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" class="input-field" min="1" value="${item.quantity}" onchange="updateEquipmentItem('${item.id}', 'quantity', this.value)">
                </div>

                <div class="form-group">
                    <label>Fecha Esperada de Llegada *</label>
                    <input type="date" class="input-field" value="${item.expectedDate}" onchange="updateEquipmentItem('${item.id}', 'expectedDate', this.value)">
                    <span class="error-message" id="error-item-${item.id}-expectedDate"></span>
                </div>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
                <label>Descripción Detallada</label>
                <textarea class="textarea-field" placeholder="Especifique más detalles sobre lo solicitado (modelo, especificaciones, accesorios, etc.)" onchange="updateEquipmentItem('${item.id}', 'description', this.value)">${item.description}</textarea>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
                <label>Justificación *</label>
                <textarea class="textarea-field" placeholder="Explique por qué es necesario este equipo y cómo contribuye a mejorar las operaciones" onchange="updateEquipmentItem('${item.id}', 'justification', this.value)">${item.justification}</textarea>
                <span class="error-message" id="error-item-${item.id}-justification"></span>
            </div>
        </div>
    `;
}

// Add Equipment Item
function addEquipmentItem() {
    const newItem = {
        id: Date.now().toString(),
        equipment: '',
        quantity: 1,
        description: '',
        justification: '',
        expectedDate: ''
    };

    formState.items.push(newItem);
    renderEquipmentList();
    updateSummary();
    clearError('items');
}

// Remove Equipment Item
function removeEquipmentItem(id) {
    formState.items = formState.items.filter(item => item.id !== id);
    renderEquipmentList();
    updateSummary();
}

// Update Equipment Item
function updateEquipmentItem(id, field, value) {
    const item = formState.items.find(item => item.id === id);
    if (item) {
        if (field === 'quantity') {
            item[field] = parseInt(value) || 1;
        } else {
            item[field] = value;
        }
        updateSummary();
        clearError(`item-${id}-${field}`);
    }
}

// Render Equipment List
function renderEquipmentList() {
    equipmentList.innerHTML = formState.items.length === 0 
        ? '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No hay equipos agregados. Haz clic en "Agregar Equipo" para comenzar.</p></div>'
        : formState.items.map((item, index) => createEquipmentItemHTML(item, index)).join('');
    
    updateEquipmentCount();
}

// Update Equipment Count
function updateEquipmentCount() {
    const count = formState.items.length;
    document.getElementById('equipmentCount').textContent = `${count} ${count === 1 ? 'equipo' : 'equipos'}`;
}

// Update Summary
function updateSummary() {
    document.getElementById('summaryRequester').textContent = formState.requesterName || 'Sin especificar';
    document.getElementById('summaryDepartment').textContent = formState.department || 'Sin especificar';
    document.getElementById('summaryTotal').textContent = formState.items.length;

    // Equipment summary list
    const equipmentSummaryList = document.getElementById('equipmentSummaryList');
    if (formState.items.length === 0) {
        equipmentSummaryList.innerHTML = '<p style="color: var(--text-light); font-size: 0.875rem;">Sin equipos</p>';
    } else {
        equipmentSummaryList.innerHTML = formState.items
            .map(item => `
                <div class="equipment-summary-item">
                    <span class="equipment-summary-name">${item.equipment || 'No especificado'}</span>
                    <span class="equipment-summary-qty">×${item.quantity}</span>
                </div>
            `)
            .join('');
    }

    // Update progress
    updateProgress();
}

// Update Progress
function updateProgress() {
    let completedFields = 0;
    let totalFields = 4 + (formState.items.length * 3); // 4 requester fields + 3 required fields per item

    if (formState.requesterName) completedFields++;
    if (formState.department) completedFields++;
    if (formState.email) completedFields++;
    if (formState.phone) completedFields++;

    formState.items.forEach(item => {
        if (item.equipment) completedFields++;
        if (item.expectedDate) completedFields++;
        if (item.justification) completedFields++;
    });

    const progress = totalFields === 0 ? 0 : Math.round((completedFields / totalFields) * 100);
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '% completo';
}

// Validate Form
function validateForm() {
    clearAllErrors();
    let isValid = true;

    // Validate requester info
    if (!formState.requesterName.trim()) {
        setError('requesterName', 'Nombre requerido');
        isValid = false;
    }
    if (!formState.department.trim()) {
        setError('department', 'Departamento requerido');
        isValid = false;
    }
    if (!formState.email.trim()) {
        setError('email', 'Email requerido');
        isValid = false;
    }
    if (!formState.phone.trim()) {
        setError('phone', 'Teléfono requerido');
        isValid = false;
    }

    // Validate items
    if (formState.items.length === 0) {
        setError('items', 'Debe agregar al menos un equipo');
        isValid = false;
    } else {
        formState.items.forEach((item, index) => {
            if (!item.equipment) {
                setError(`item-${item.id}-equipment`, 'Seleccione equipo');
                isValid = false;
            }
            if (!item.expectedDate) {
                setError(`item-${item.id}-expectedDate`, 'Fecha requerida');
                isValid = false;
            }
            if (!item.justification.trim()) {
                setError(`item-${item.id}-justification`, 'Justificación requerida');
                isValid = false;
            }
        });
    }

    return isValid;
}

// Set Error
function setError(fieldId, message) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear Error
function clearError(fieldId) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Clear All Errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });
}

// Handle Submit
function handleSubmit() {
    if (validateForm()) {
        console.log('Formulario válido:', formState);
        alert('¡Requisición enviada exitosamente!');
        // Here you would typically send the data to a server
        // resetForm();
    } else {
        alert('Por favor, completa todos los campos requeridos.');
    }
}

// Initialize
renderEquipmentList();
updateSummary();
