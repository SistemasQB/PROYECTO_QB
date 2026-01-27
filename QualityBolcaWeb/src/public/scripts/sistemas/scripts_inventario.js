// Funciones para la página de administración de tickets

document.addEventListener('DOMContentLoaded', () => {
  let currentStatus = 'assigned';

  seedInventory();
  let tickets = JSON.parse(localStorage.getItem('inventory') || '[]');

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
    document.getElementById('statAssigned').textContent =
      inventory.filter(i => i.status === 'assigned').length;

    document.getElementById('statCustody').textContent =
      inventory.filter(i => i.status === 'custody').length;

    document.getElementById('statRepair').textContent =
      inventory.filter(i => i.status === 'repair').length;

    document.getElementById('statDecommissioned').textContent =
      inventory.filter(i => i.status === 'decommissioned').length;
  }

  // Renderizar tabla de tickets
  function renderInventory() {
    const list = document.getElementById('inventoryList');
    list.innerHTML = '';

    const filtered = inventory.filter(item => item.status === currentStatus);

    if (filtered.length === 0) {
      list.innerHTML = `<p class="empty">No hay activos en este estado</p>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'inventory-card';

      card.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Tipo:</strong> ${item.type}</p>
      <p><strong>Serie:</strong> ${item.serial}</p>
      <p><strong>Ubicación:</strong> ${item.location}</p>
      <p><strong>Responsable:</strong> ${item.responsible}</p>
      <span class="badge ${item.status}">${item.status}</span>
    `;

      list.appendChild(card);
    });
  }


  function seedInventory() {
    if (localStorage.getItem('inventory')) return;

    const inventory = [
      {
        id: 'INV-001',
        title: 'Laptop Dell Latitude 5420',
        category: 'hardware',
        serial: 'DL-5420-AX92',
        assignedTo: 'Juan Pérez',
        area: 'Sistemas',
        status: 'assigned',
        lastMaintenance: '2025-01-10'
      },
      {
        id: 'INV-003',
        title: 'Laptop Dell Latitude 6420',
        category: 'hardware',
        serial: 'DL-5420-6384',
        assignedTo: 'Alex Robledo',
        area: 'Sistemas',
        status: 'assigned',
        lastMaintenance: '2025-03-10'
      },
      {
        id: 'INV-005',
        title: 'Celular samsung',
        category: 'hardware',
        serial: 'DL-5420-6384',
        assignedTo: 'Alex Robledo',
        area: 'Sistemas',
        status: 'assigned',
        lastMaintenance: '2025-03-10'
      }
    ];

    localStorage.setItem('inventory', JSON.stringify(inventory));
  }


  seedInventory();
  let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');

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
  function changeStatus(id, newStatus) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    item.status = newStatus;
    localStorage.setItem('inventory', JSON.stringify(inventory));

    updateStats();
    renderInventory();
    seedInventory();
  }

  // Eliminar ticket
  window.deleteTicket = (ticketId) => {
    if (!confirm('¿Está seguro de que desea eliminar este ticket?')) return;

    tickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    updateStats();
    renderTickets();
  };

  // Cambio de pestañas
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentStatus = tab.dataset.status;
      renderInventory();
    });
  });

  updateStats();
  renderInventory();
})
