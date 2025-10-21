// Funciones para la página de administración de tickets

document.addEventListener('DOMContentLoaded', () => {
  let currentStatus = 'assigned';
  let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');

  // Traducciones de estados
  const statusLabels = {
    assigned: 'Asignado',
    custody: 'En Resguardo',
    repair: 'En Reparación',
    decommissioned: 'Dado de Baja'
  };

  const categoryLabels = {
    hardware: 'Hardware',
    software: 'Software',
    network: 'Red/Conectividad',
    printer: 'Impresoras',
    email: 'Correo',
    other: 'Otro'
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica'
  };

  // Actualizar estadísticas
  function updateStats() {
    const stats = {
      assigned: tickets.filter(t => t.status === 'assigned').length,
      custody: tickets.filter(t => t.status === 'custody').length,
      repair: tickets.filter(t => t.status === 'repair').length,
      decommissioned: tickets.filter(t => t.status === 'decommissioned').length
    };

    document.getElementById('statAssigned').textContent = stats.assigned;
    document.getElementById('statCustody').textContent = stats.custody;
    document.getElementById('statRepair').textContent = stats.repair;
    document.getElementById('statDecommissioned').textContent = stats.decommissioned;
  }

  // Renderizar tabla de tickets
  function renderTickets() {
    const tbody = document.getElementById('ticketsTableBody');
    const filteredTickets = tickets.filter(t => t.status === currentStatus);

    if (filteredTickets.length === 0) {
      tbody.innerHTML = `
        <tr class="empty-state">
          <td colspan="8">
            <div class="empty-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <p>No hay tickets en este estado</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filteredTickets.map(ticket => `
      <tr>
        <td><strong>${ticket.id}</strong></td>
        <td>${ticket.title}</td>
        <td><span class="category-badge">${categoryLabels[ticket.category]}</span></td>
        <td><span class="priority-badge priority-${ticket.priority}">${priorityLabels[ticket.priority]}</span></td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${new Date(ticket.createdAt).toLocaleDateString('es-ES')}</td>
        <td>
          <div class="action-buttons">
            ${getActionButtons(ticket)}
          </div>
        </td>
      </tr>
    `).join('');

    attachActionListeners();
  }

  // Obtener botones de acción según el estado
  function getActionButtons(ticket) {
    const buttons = [];

    // Botón de ver (siempre disponible)
    buttons.push(`
      <button class="action-btn action-btn-view" onclick="viewTicket('${ticket.id}')" title="Ver detalles">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
    `);

    // Botones específicos según el estado
    switch (ticket.status) {
      case 'assigned':
        buttons.push(`
          <button class="action-btn action-btn-custody" onclick="changeStatus('${ticket.id}', 'custody')" title="Mover a resguardo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </button>
          <button class="action-btn action-btn-repair" onclick="changeStatus('${ticket.id}', 'repair')" title="Enviar a reparación">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </button>
        `);
        break;
      case 'custody':
        buttons.push(`
          <button class="action-btn action-btn-repair" onclick="changeStatus('${ticket.id}', 'repair')" title="Enviar a reparación">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </button>
          <button class="action-btn action-btn-decommission" onclick="changeStatus('${ticket.id}', 'decommissioned')" title="Dar de baja">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        `);
        break;
      case 'repair':
        buttons.push(`
          <button class="action-btn action-btn-complete" onclick="changeStatus('${ticket.id}', 'assigned')" title="Reparación completada">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <button class="action-btn action-btn-decommission" onclick="changeStatus('${ticket.id}', 'decommissioned')" title="Dar de baja">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        `);
        break;
      case 'decommissioned':
        // Solo ver y eliminar para elementos dados de baja
        break;
    }

    // Botón de eliminar (siempre disponible)
    buttons.push(`
      <button class="action-btn action-btn-delete" onclick="deleteTicket('${ticket.id}')" title="Eliminar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `);

    return buttons.join('');
  }

  // Adjuntar event listeners
  function attachActionListeners() {
    // Los event listeners se manejan via onclick en el HTML
  }

  // Ver detalles del ticket
  window.viewTicket = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const modal = document.getElementById('ticketModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
      <div class="detail-group">
        <div class="detail-label">ID del Ticket</div>
        <div class="detail-value"><strong>${ticket.id}</strong></div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Título</div>
        <div class="detail-value">${ticket.title}</div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Categoría</div>
        <div class="detail-value"><span class="category-badge">${categoryLabels[ticket.category]}</span></div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Prioridad</div>
        <div class="detail-value"><span class="priority-badge priority-${ticket.priority}">${priorityLabels[ticket.priority]}</span></div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Estado</div>
        <div class="detail-value">${statusLabels[ticket.status]}</div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Descripción</div>
        <div class="detail-value">${ticket.description}</div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Solicitante</div>
        <div class="detail-value">${ticket.name}</div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Correo</div>
        <div class="detail-value">${ticket.email}</div>
      </div>
      <div class="detail-group">
        <div class="detail-label">Departamento</div>
        <div class="detail-value">${ticket.department}</div>
      </div>
      ${ticket.phone ? `
        <div class="detail-group">
          <div class="detail-label">Teléfono</div>
          <div class="detail-value">${ticket.phone}</div>
        </div>
      ` : ''}
      <div class="detail-group">
        <div class="detail-label">Fecha de Creación</div>
        <div class="detail-value">${new Date(ticket.createdAt).toLocaleString('es-ES')}</div>
      </div>
    `;

    modal.classList.add('show');
  };

  // Cambiar estado del ticket
  window.changeStatus = (ticketId, newStatus) => {
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return;

    tickets[ticketIndex].status = newStatus;
    localStorage.setItem('tickets', JSON.stringify(tickets));

    updateStats();
    renderTickets();
  };

  // Eliminar ticket
  window.deleteTicket = (ticketId) => {
    if (!confirm('¿Está seguro de que desea eliminar este ticket?')) return;

    tickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    updateStats();
    renderTickets();
  };

  // Cambio de pestañas
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentStatus = this.dataset.status;
      renderTickets();
    });
  });

  // Limpiar todos los tickets
  document.getElementById('clearAllBtn').addEventListener('click', () => {
    if (!confirm('¿Está seguro de que desea eliminar TODOS los tickets?')) return;

    localStorage.removeItem('tickets');
    tickets = [];
    updateStats();
    renderTickets();
  });

  // Cerrar modal
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('ticketModal').classList.remove('show');
  });

  // Cerrar modal al hacer clic fuera
  document.getElementById('ticketModal').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('show');
    }
  });

  // Renderizado inicial
  updateStats();
  renderTickets();
});
