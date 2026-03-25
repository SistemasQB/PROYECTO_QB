// Mock Data
const mockData = [
  { id: 1, numero: "FAC-2026-001", cliente: "Empresa ABC S.A.", fechaFactura: "2026-01-15", fechaPago: "2026-01-20", horas: 40, monto: 4800, estatus: "pagado" },
  { id: 2, numero: "FAC-2026-002", cliente: "Corporación XYZ", fechaFactura: "2026-01-18", fechaPago: null, horas: 25, monto: 3000, estatus: "pendiente" },
  { id: 3, numero: "FAC-2026-003", cliente: "Industrias del Norte", fechaFactura: "2026-01-10", fechaPago: null, horas: 60, monto: 7200, estatus: "vencido" },
  { id: 4, numero: "FAC-2026-004", cliente: "Servicios Integrados", fechaFactura: "2026-01-22", fechaPago: "2026-01-25", horas: 32, monto: 3840, estatus: "pagado" },
  { id: 5, numero: "FAC-2026-005", cliente: "Tech Solutions", fechaFactura: "2026-01-05", fechaPago: "2026-01-10", horas: 48, monto: 5760, estatus: "pagado" },
  { id: 6, numero: "FAC-2025-048", cliente: "Consultores Asociados", fechaFactura: "2025-12-15", fechaPago: null, horas: 20, monto: 2400, estatus: "vencido" },
  { id: 7, numero: "FAC-2025-047", cliente: "Empresa ABC S.A.", fechaFactura: "2025-12-10", fechaPago: "2025-12-20", horas: 36, monto: 4320, estatus: "pagado" },
  { id: 8, numero: "FAC-2025-046", cliente: "Corporación XYZ", fechaFactura: "2025-12-05", fechaPago: null, horas: 18, monto: 2160, estatus: "parcial" },
  { id: 9, numero: "FAC-2025-045", cliente: "Industrias del Norte", fechaFactura: "2025-11-28", fechaPago: "2025-12-05", horas: 52, monto: 6240, estatus: "pagado" },
  { id: 10, numero: "FAC-2025-044", cliente: "Tech Solutions", fechaFactura: "2025-11-20", fechaPago: "2025-11-28", horas: 44, monto: 5280, estatus: "pagado" },
  { id: 11, numero: "FAC-2025-043", cliente: "Servicios Integrados", fechaFactura: "2025-11-15", fechaPago: null, horas: 28, monto: 3360, estatus: "pendiente" },
  { id: 12, numero: "FAC-2025-042", cliente: "Consultores Asociados", fechaFactura: "2025-11-10", fechaPago: "2025-11-18", horas: 16, monto: 1920, estatus: "pagado" },
  { id: 13, numero: "FAC-2025-041", cliente: "Empresa ABC S.A.", fechaFactura: "2025-10-25", fechaPago: "2025-11-01", horas: 38, monto: 4560, estatus: "pagado" },
  { id: 14, numero: "FAC-2025-040", cliente: "Corporación XYZ", fechaFactura: "2025-10-20", fechaPago: null, horas: 22, monto: 2640, estatus: "vencido" },
  { id: 15, numero: "FAC-2025-039", cliente: "Tech Solutions", fechaFactura: "2025-10-15", fechaPago: "2025-10-22", horas: 56, monto: 6720, estatus: "pagado" },
];

// State
let filteredData = [...mockData];
let currentPage = 1;
let itemsPerPage = 10;
let sortField = "fechaFactura";
let sortDirection = "desc";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
  setupDropdowns();
});

// Setup dropdown menus
function setupDropdowns() {
  document.addEventListener("click", (e) => {
    const dropdowns = document.querySelectorAll(".dropdown.open");
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  });
}

function toggleDropdown(btn) {
  const dropdown = btn.closest(".dropdown");
  const isOpen = dropdown.classList.contains("open");
  
  // Close all dropdowns
  document.querySelectorAll(".dropdown.open").forEach(d => d.classList.remove("open"));
  
  // Toggle current
  if (!isOpen) {
    dropdown.classList.add("open");
  }
}

// Filter functions
function getFilters() {
  return {
    fechaFacturaDesde: document.getElementById("fechaFacturaDesde").value,
    fechaFacturaHasta: document.getElementById("fechaFacturaHasta").value,
    fechaPagoDesde: document.getElementById("fechaPagoDesde").value,
    fechaPagoHasta: document.getElementById("fechaPagoHasta").value,
    cliente: document.getElementById("cliente").value,
    estatusPago: document.getElementById("estatusPago").value,
    mes: document.getElementById("mes").value,
    anio: document.getElementById("anio").value,
  };
}

function applyFilters() {
  const filters = getFilters();
  
  filteredData = mockData.filter(item => {
    // Filter by fecha factura
    if (filters.fechaFacturaDesde && item.fechaFactura < filters.fechaFacturaDesde) return false;
    if (filters.fechaFacturaHasta && item.fechaFactura > filters.fechaFacturaHasta) return false;
    
    // Filter by fecha pago
    if (filters.fechaPagoDesde && (!item.fechaPago || item.fechaPago < filters.fechaPagoDesde)) return false;
    if (filters.fechaPagoHasta && (!item.fechaPago || item.fechaPago > filters.fechaPagoHasta)) return false;
    
    // Filter by cliente
    if (filters.cliente && item.cliente !== filters.cliente) return false;
    
    // Filter by estatus
    if (filters.estatusPago && item.estatus !== filters.estatusPago) return false;
    
    // Filter by mes
    if (filters.mes) {
      const itemMonth = item.fechaFactura.split("-")[1];
      if (itemMonth !== filters.mes) return false;
    }
    
    // Filter by año
    if (filters.anio) {
      const itemYear = item.fechaFactura.split("-")[0];
      if (itemYear !== filters.anio) return false;
    }
    
    return true;
  });
  
  // Apply sort
  sortData();
  
  // Reset to page 1
  currentPage = 1;
  
  // Update UI
  updateSummaryCards();
  renderTable();
  renderPagination();
}

function clearFilters() {
  document.getElementById("fechaFacturaDesde").value = "";
  document.getElementById("fechaFacturaHasta").value = "";
  document.getElementById("fechaPagoDesde").value = "";
  document.getElementById("fechaPagoHasta").value = "";
  document.getElementById("cliente").value = "";
  document.getElementById("estatusPago").value = "";
  document.getElementById("mes").value = "";
  document.getElementById("anio").value = "";
  
  applyFilters();
}

// Sort functions
function sortTable(field) {
  if (sortField === field) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    sortDirection = "asc";
  }
  
  // Update header classes
  document.querySelectorAll(".data-table th.sortable").forEach(th => {
    th.classList.remove("active");
    if (th.dataset.sort === field) {
      th.classList.add("active");
    }
  });
  
  sortData();
  renderTable();
}

function sortData() {
  filteredData.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    // Handle null values
    if (aVal === null) aVal = "";
    if (bVal === null) bVal = "";
    
    // Compare
    if (typeof aVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    return sortDirection === "asc" 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
}

// Update summary cards
function updateSummaryCards() {
  const totalFacturado = filteredData.reduce((sum, item) => sum + item.monto, 0);
  const totalHoras = filteredData.reduce((sum, item) => sum + item.horas, 0);
  
  const pagadas = filteredData.filter(item => item.estatus === "pagado");
  const pendientes = filteredData.filter(item => item.estatus === "pendiente" || item.estatus === "parcial");
  const vencidas = filteredData.filter(item => item.estatus === "vencido");
  
  const montoPagado = pagadas.reduce((sum, item) => sum + item.monto, 0);
  const montoPendiente = pendientes.reduce((sum, item) => sum + item.monto, 0);
  const montoVencido = vencidas.reduce((sum, item) => sum + item.monto, 0);
  
  document.getElementById("totalFacturado").textContent = formatCurrency(totalFacturado);
  document.getElementById("totalFacturas").textContent = `${filteredData.length} facturas`;
  
  document.getElementById("totalHoras").textContent = `${totalHoras} hrs`;
  document.getElementById("promedioHoras").textContent = `Promedio: ${filteredData.length ? Math.round(totalHoras / filteredData.length) : 0} hrs/factura`;
  
  document.getElementById("montoPagado").textContent = formatCurrency(montoPagado);
  document.getElementById("facturasPagadas").textContent = `${pagadas.length} facturas pagadas`;
  
  document.getElementById("montoPendiente").textContent = formatCurrency(montoPendiente);
  document.getElementById("facturasPendientes").textContent = `${pendientes.length} facturas pendientes`;
  
  document.getElementById("montoVencido").textContent = formatCurrency(montoVencido);
  document.getElementById("facturasVencidas").textContent = `${vencidas.length} facturas vencidas`;
  
  document.getElementById("resultsCount").textContent = `${filteredData.length} resultados`;
}

// Render table
function renderTable() {
  const tbody = document.getElementById("tableBody");
  const tfoot = document.getElementById("tableFoot");
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);
  
  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h3>No se encontraron resultados</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        </td>
      </tr>
    `;
    tfoot.innerHTML = "";
    return;
  }
  
  tbody.innerHTML = pageData.map(item => `
    <tr>
      <td><span style="font-family: var(--font-mono); font-weight: 500;">${item.numero}</span></td>
      <td>${item.cliente}</td>
      <td>${formatDate(item.fechaFactura)}</td>
      <td>${item.fechaPago ? formatDate(item.fechaPago) : '<span style="color: var(--muted-foreground);">—</span>'}</td>
      <td style="font-family: var(--font-mono);">${item.horas} hrs</td>
      <td style="font-family: var(--font-mono); font-weight: 500;">${formatCurrency(item.monto)}</td>
      <td>${getBadgeHTML(item.estatus)}</td>
      <td>
        <div class="dropdown">
          <button class="btn btn-ghost btn-icon" onclick="toggleDropdown(this)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item" onclick="viewInvoice('${item.numero}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Ver detalle
            </button>
            <button class="dropdown-item" onclick="downloadInvoice('${item.numero}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" onclick="editInvoice('${item.numero}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          </div>
        </div>
      </td>
    </tr>
  `).join("");
  
  // Totals row
  const totalHoras = filteredData.reduce((sum, item) => sum + item.horas, 0);
  const totalMonto = filteredData.reduce((sum, item) => sum + item.monto, 0);
  
  tfoot.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: right;">TOTALES</td>
      <td style="font-family: var(--font-mono);">${totalHoras} hrs</td>
      <td style="font-family: var(--font-mono);">${formatCurrency(totalMonto)}</td>
      <td colspan="2"></td>
    </tr>
  `;
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
  
  document.getElementById("showingFrom").textContent = filteredData.length ? startIndex : 0;
  document.getElementById("showingTo").textContent = endIndex;
  document.getElementById("totalRecords").textContent = filteredData.length;
  
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }
  
  let html = `
    <button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  `;
  
  // Page numbers
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      html += `<span class="pagination-btn" style="cursor: default; border: none;">...</span>`;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<span class="pagination-btn" style="cursor: default; border: none;">...</span>`;
    }
    html += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
  
  html += `
    <button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  `;
  
  pagination.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderTable();
  renderPagination();
}

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getBadgeHTML(estatus) {
  const config = {
    pagado: { class: "badge-success", label: "Pagado" },
    pendiente: { class: "badge-warning", label: "Pendiente" },
    vencido: { class: "badge-danger", label: "Vencido" },
    parcial: { class: "badge-info", label: "Parcial" },
  };
  
  const { class: badgeClass, label } = config[estatus] || { class: "", label: estatus };
  
  return `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${label}</span>`;
}

// Action functions
function viewInvoice(numero) {
  alert(`Ver detalle de factura: ${numero}`);
}

function downloadInvoice(numero) {
  alert(`Descargando factura: ${numero}`);
}

function editInvoice(numero) {
  alert(`Editar factura: ${numero}`);
}

// Export functions
function exportToCSV() {
  const headers = ["No. Factura", "Cliente", "Fecha Factura", "Fecha Pago", "Horas", "Monto", "Estatus"];
  const rows = filteredData.map(item => [
    item.numero,
    item.cliente,
    item.fechaFactura,
    item.fechaPago || "",
    item.horas,
    item.monto,
    item.estatus,
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");
  
  downloadFile(csvContent, "reporte-facturas.csv", "text/csv");
}

function exportToPDF() {
  alert("Función de exportar a PDF - Implementar con librería como jsPDF");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
