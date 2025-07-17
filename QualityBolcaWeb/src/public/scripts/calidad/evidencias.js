

let currentEvidenceField = null;
let currentCardId = null;



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
        <button class="analysis-btn" onclick="openModal('titulo analisis', '${data.titulo_analisis}', '', '${data.id}')">
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
        
        return `
            <button class="evidence-btn-small" onclick="openModal('${evidence.field}', '${evidence.file}', '${evidence.date}', '${data.id}')" title="${evidence.file}">
                ${evidence.label}
            </button>
        `;
    }).join('');
}

function openModal(field, evidencia, fecha, cardId) {
    currentEvidenceField = field;
    currentCardId = cardId;
    
    const modal = document.getElementById('pdfModal');
    const modalTitle = document.getElementById('modalTitle');
    // const pdfName = document.getElementById('pdfName');

    const embedPdf = document.getElementById('embedPdf');


    if (field == 'titulo analisis') {
        embedPdf.src = `../analisis/${evidencia}`;
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        btnAcceptReject.forEach(btn => btn.style.display = 'none');
    }else{
        const btnAcceptReject = document.querySelectorAll('.btnAcceptReject');
        btnAcceptReject.forEach(btn => btn.style.display = 'block');
        embedPdf.src = `../evidencias/${evidencia}`;
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
