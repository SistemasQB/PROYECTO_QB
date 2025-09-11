

let currentEvidenceField = null;
let currentCardId = null;

const estatusMejora = ['ingresada sin análisis','ingresada con análisis','modificar','Aceptada','Rechazada','Declinada por falta de seguimiento','Implementada']
const estatusColores = ['rgb(173, 216, 230)','rgb(255, 223, 100)','rgb(255, 135, 0)','rgb(76, 175, 80)','rgb(244, 67, 54)','rgb(105, 105, 105)','rgb(64, 224, 208)']



function displayCards(dataArray) {
    const container = document.getElementById('cardsContainer');
    
    const listHTML = dataArray.map(data => createListItem(data)).join('');
    container.innerHTML = listHTML;
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
    // console.log(data);
    
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

    // console.log(data);
    
    
    return evidences.map(evidence => {
        if (!evidence.file || evidence.file.trim() === '') {
            return `<span class="evidence-empty">${evidence.label}</span>`;
        }
        validacionEvidencias = [data.validaranalisis, data.validarevidencia1, data.validarevidencia2, data.validarevidencia3, data.validarevidencia4];
        numEvidencia = parseInt(evidence.field.substring(10,11));
        return `
            <button class="evidence-btn-small mejoran${data.id} " onclick="openModal('evidencias', '${evidence.file}', validacionEvidencias, '${numEvidencia}', '${data.id}')">
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
    // const pdfName = document.getElementById('pdfName');

    const embedPdf = document.getElementById('embedPdf');

    console.log(validaranalisis[cardId]);
    

    if (field == 'analisis' && validaranalisis[cardId] == 1) {
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        embedPdf.src = `../${field}/${evidencia}`;
        btnAcceptReject.forEach(btn => btn.style.display = 'none');
    }else if (field == 'evidencias' &&  validaranalisis[cardId] == 1 ) {
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        btnAcceptReject.forEach(btn => btn.style.display = 'none');
        embedPdf.src = `../${field}/${evidencia}`;
    }else{
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        btnAcceptReject.forEach(btn => btn.style.display = 'block');
        embedPdf.src = `../${field}/${evidencia}`;
    }

    
    modalTitle.textContent = `${field} - ${evidencia}`;
    // pdfName.textContent = evidencia;
    
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
