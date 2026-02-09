
document.addEventListener('DOMContentLoaded', () => {
  let inventory = [];
  let currentStatus = 'assigned';
  let searchTerm = '';

  // Traducciones de estados
  const statusLabels = {
    assigned: 'Asignado',
    custody: 'En Resguardo',
    repair: 'En Reparación',
    decommissioned: 'Dado de Baja'
  };


  // Actualizar estadísticas
  function updateStats() {
  document.getElementById('statAssigned').textContent =
    inventory.filter(i => i.status === 'assigned' && matchesSearch(i)).length;

  document.getElementById('statCustody').textContent =
    inventory.filter(i => i.status === 'custody' && matchesSearch(i)).length;

  document.getElementById('statRepair').textContent =
    inventory.filter(i => i.status === 'repair' && matchesSearch(i)).length;

  document.getElementById('statDecommissioned').textContent =
    inventory.filter(i => i.status === 'decommissioned' && matchesSearch(i)).length;
}

  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderInventory();
  });

  function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = '';

  const filtered = inventory.filter(item =>
    item.status === currentStatus && matchesSearch(item)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="8">No hay artículos que coincidan con la búsqueda</td>
      </tr>`;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.category}</td>
      <td>${item.serial}</td>
      <td>${item.assignedTo}</td>
      <td>${item.condition}</td>
      <td>${item.area}</td>
      <td>${item.lastMaintenance || '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

  async function cargarInventario() {
    try {
      const res = await fetch('/sistemas/inventario-data', {
        credentials: 'include'
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.msg);

      inventory = data.inventario.map(item => ({
        id: item.idInventario,
        title: item.marca || 'Sin modelo',
        category: item.tipo,
        serial: item.serie,
        assignedTo: item.asignadoA || 'Sin asignar',
        area: item.usoExclusivo || 'No definida',
        status: item.folio && item.folio !== 0 ? 'assigned' : 'custody',
        condition: mapCondition(item.estado),
        lastMaintenance: item.ultimoMantenimiento
      }));

      updateStats();
      renderInventory();

    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  }

  function matchesSearch(item) {
  const searchableText = `
    ${item.id}
    ${item.title}
    ${item.category}
    ${item.serial}
    ${item.assignedTo}
    ${item.condition}
    ${item.area}
    ${item.lastMaintenance || ''}
  `.toLowerCase();

  return searchableText.includes(searchTerm);
}

function mapCondition(estado) {
  if (estado === 1) return 'Nuevo';
  if (estado === 2) return 'Usado';
  return 'Desconocido';
}

  // Cambio de pestañas
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStatus = tab.dataset.status;
      renderInventory();
    });
  });

//renderInventory();
cargarInventario();
});