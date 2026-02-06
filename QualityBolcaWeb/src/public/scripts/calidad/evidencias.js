let currentEvidenceField = null;
let currentCardId = null;
let allData = []; // Almacena todos los datos originales

const estatusMejora = ['ingresada sin análisis','ingresada con análisis','modificar','Aceptada','Rechazada','Declinada por falta de seguimiento','Implementada'];
const estatusColores = ['rgb(173, 216, 230)','rgb(255, 223, 100)','rgb(255, 135, 0)','rgb(76, 175, 80)','rgb(244, 67, 54)','rgb(105, 105, 105)','rgb(64, 224, 208)'];
document.addEventListener('DOMContentLoaded', function() {
            displayCards(sampleData);
        });

function displayCards(dataArray) {
    const container = document.getElementById('cardsContainer');
    
    // Parsear datos si es string
    let parsedData;
    if (typeof dataArray === 'string') {
        parsedData = JSON.parse(dataArray);
    } else {
        parsedData = dataArray;
    }
    
    // Guardar datos originales si es la primera carga
    if (allData.length === 0) {
        allData = parsedData;
        populateFilterOptions(allData);
    }
    
    if (parsedData.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron mejoras con los filtros seleccionados</div>';
        updateResultsCount(0);
        return;
    }
    
    const listHTML = parsedData.map(data => createListItem(data)).join('');
    container.innerHTML = listHTML;
    updateResultsCount(parsedData.length);
}

function populateFilterOptions(data) {
    // Poblar opciones de Rubro (Tipo de Mejora)
    const rubroSelect = document.getElementById('filterRubro');
    const rubros = [...new Set(data.map(item => item.rubro))].filter(r => r).sort();
    rubros.forEach(rubro => {
        const option = document.createElement('option');
        option.value = rubro;
        option.textContent = rubro;
        rubroSelect.appendChild(option);
    });
    
    // Poblar opciones de Estatus
    const estatusSelect = document.getElementById('filterEstatus');
    estatusMejora.forEach((estatus, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = estatus;
        estatusSelect.appendChild(option);
    });
}

function applyFilters() {
    const nombreFilter = document.getElementById('filterNombre').value.toLowerCase().trim();
    const integranteFilter = document.getElementById('filterIntegrante').value.toLowerCase().trim();
    const rubroFilter = document.getElementById('filterRubro').value;
    const estatusFilter = document.getElementById('filterEstatus').value;
    
    let filteredData = allData.filter(item => {
        // Filtro por nombre
        const matchNombre = !nombreFilter || 
            item.nombre_mejora.toLowerCase().includes(nombreFilter);
        
        // Filtro por integrante (generador de idea)
        const matchIntegrante = !integranteFilter || 
            item.generador_idea.toLowerCase().includes(integranteFilter);
        
        // Filtro por rubro (tipo de mejora)
        const matchRubro = !rubroFilter || 
            item.rubro === rubroFilter;
        
        // Filtro por estatus
        const matchEstatus = estatusFilter === '' || 
            item.estatus === parseInt(estatusFilter);
        
        return matchNombre && matchIntegrante && matchRubro && matchEstatus;
    });
    
    displayFilteredCards(filteredData);
}

function displayFilteredCards(data) {
    const container = document.getElementById('cardsContainer');
    
    if (data.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron mejoras con los filtros seleccionados</div>';
        updateResultsCount(0);
        return;
    }
    
    const listHTML = data.map(item => createListItem(item)).join('');
    container.innerHTML = listHTML;
    updateResultsCount(data.length);
}

function clearFilters() {
    document.getElementById('filterNombre').value = '';
    document.getElementById('filterIntegrante').value = '';
    document.getElementById('filterRubro').value = '';
    document.getElementById('filterEstatus').value = '';
    
    displayFilteredCards(allData);
}

function updateResultsCount(count) {
    const resultsSpan = document.getElementById('resultsCount');
    if (count === allData.length) {
        resultsSpan.textContent = `Mostrando todas las mejoras (${count})`;
    } else if (count === 0) {
        resultsSpan.textContent = 'No se encontraron resultados';
    } else {
        resultsSpan.textContent = `Mostrando ${count} de ${allData.length} mejoras`;
    }
}

function createListItem(data) {
    const evidenceButtons = generateEvidenceButtons(data);
    const analysisButton = generateAnalysisButton(data);
    
    return `
        <div class="list-item" data-id="${data.id}">
            <div class="list-main-info">
                <div class="list-header">
                    <h3 class="list-title">${data.nombre_mejora}</h3>
                    <span class="list-id">ID: ${data.id}</span>
                </div>
                <div class="list-details">
                    <span class="list-date">📅 ${data.fecha}</span>
                    <span class="list-author">👤 ${data.generador_idea}</span>
                    <span class="list-rubro">${data.rubro}</span>
                    <span id="labelestatus" class="list-rubro" style='color:black; background-color:${estatusColores[data.estatus]}'>${estatusMejora[data.estatus]}</span>
                </div>
                <div class="list-details">
                    <span class="list-date">🗓️ ${data.fecha_respuesta_comite}</span>
                    <span class="list-author" style='text-transform: uppercase;'>🏢 ${data.proceso_pertenece}</span>
                </div>
            </div>
            
            <div class="list-actions">
                <div class="analysis-section">
                    ${analysisButton}
                </div>
                <div class="evidence-buttons">
                    ${evidenceButtons}
                </div>
            </div>
        </div>
    `;
}

function generateAnalysisButton(data) {
    if (!data.titulo_analisis || data.titulo_analisis.trim() === '') {
        return `<span class="no-analysis">Sin análisis</span>`;
    }
    
    return `
        <button class="analysis-btn" onclick="openModal('analisis', '${data.titulo_analisis}', '${data.validaranalisis}',0, '${data.id}')">
            📊 Ver Análisis
        </button>
    `;
}

function generateEvidenceButtons(data) {
    const evidences = [
        { field: 'evidencia 1', file: data.evidencia1, date: data.fechaevidencia1, label: 'E1' },
        { field: 'evidencia 2', file: data.evidencia2, date: data.fechaevidencia2, label: 'E2' },
        { field: 'evidencia 3', file: data.evidencia3, date: data.fechaevidencia3, label: 'E3' },
        { field: 'evidencia 4', file: data.evidencia4, date: data.fechaevidencia4, label: 'E4' }
    ];
    
    return evidences.map(evidence => {
        if (!evidence.file || evidence.file.trim() === '') {
            return `<span class="evidence-empty">${evidence.label}</span>`;
        }
        const validacionEvidencias = [data.validaranalisis, data.validarevidencia1, data.validarevidencia2, data.validarevidencia3, data.validarevidencia4];
        const numEvidencia = parseInt(evidence.field.substring(10,11));
        return `
            <button class="evidence-btn-small mejoran${data.id}" onclick="openModal('evidencias', '${evidence.file}', [${validacionEvidencias}], '${numEvidencia}', '${data.id}')">
                ${evidence.label}
            </button>
        `;
    }).join('');
}

function openModal(field, evidencia, validaranalisis, cardId, mejoranid) {
    currentEvidenceField = field;
    currentCardId = cardId;
    
    const modal = document.getElementById('pdfModal');
    const modalTitle = document.getElementById('modalTitle');
    const embedPdf = document.getElementById('embedPdf');

    if (field == 'analisis' && validaranalisis[cardId] == 1) {
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        embedPdf.src = `../${field}/${evidencia}`;
        btnAcceptReject.forEach(btn => btn.style.display = 'none');
    } else if (field == 'evidencias' && validaranalisis[cardId] == 1) {
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        btnAcceptReject.forEach(btn => btn.style.display = 'none');
        embedPdf.src = `../${field}/${evidencia}`;
    } else {
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        btnAcceptReject.forEach(btn => btn.style.display = 'block');
        embedPdf.src = `../${field}/${evidencia}`;
    }
    
    modalTitle.textContent = `${field} - ${evidencia}`;
    
    // Reset modal state
    document.getElementById('rejectSection').style.display = 'none';
    document.getElementById('rejectComment').value = '';
    
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
    currentEvidenceField = null;
    currentCardId = null;
}

function acceptEvidence() {
    showMessage(`Evidencia ${currentEvidenceField} de la mejora ${currentCardId} aceptada correctamente`, 'success');
    closeModal();
    console.log(`Evidencia aceptada: ${currentEvidenceField} de la mejora ${currentCardId}`);
}

function showRejectSection() {
    document.getElementById('rejectSection').style.display = 'block';
}

function submitRejection() {
    const comment = document.getElementById('rejectComment').value.trim();
    
    if (!comment) {
        showMessage('Por favor ingresa un comentario para el rechazo', 'error');
        return;
    }
    
    showMessage(`Evidencia ${currentEvidenceField} de la mejora ${currentCardId} rechazada. Comentario: "${comment}"`, 'error');
    closeModal();
    
    console.log(`Evidencia rechazada: ${currentEvidenceField} de la mejora ${currentCardId}, Comentario: ${comment}`);
}

function cancelRejection() {
    document.getElementById('rejectSection').style.display = 'none';
    document.getElementById('rejectComment').value = '';
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
