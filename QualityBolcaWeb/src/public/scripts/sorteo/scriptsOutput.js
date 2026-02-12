const regiones = [
  'AGUASCALIENTES', 'CELAYA','CHIHUAHUA', 'DURANGO', 'FRESNILLO', 'HONDA', 'IRAPUATO', 'JALISCO', 'JUAREZ', 'LAREDO', 'LEON', 'LEON/SILAO', 'LINARES', 'MATAMOROS', 'MONCLOVA'
  ,'MONTERREY', 'OCAMPO', 'PUEBLA', 'QUERETARO', 'REYNOSA', 'SALTILLO', 'SAN LUIS POTOSÍ', 'SILAO', 'TOLUCA','VICTORIA', 'ZACATECAS', 'ZAPATA'
]
let services = [];
let filters = {
  cliente: "all",
  orden: "all",
  planta: "all",
  region: "all",
  costo: "",
  rateTIH: "all",
  nombreParte: "all",
};
let currentPage = 1;
let pageSize = 10;
let editingServiceId = null;
let editingMaterials = [];
let editingMaterialId = null;
let materialTargetId = null;
let filtersCollapsed = false;


// ──────────────────────── UTILITIES ────────────────────────

/** Generate a unique ID */
function generateId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 9);
}

/** Format number as currency */
function formatCurrency(value, currency) {
  const locale = currency === "USD" ? "en-US" : "es-MX";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Build material payload for backend submission
 * Structure: { fecha, "piezas/horas", observaciones }
 */
function buildMaterialPayload(record) {
  return {
    fecha: record.fecha,
    "piezas/horas": record.piezasHoras,
    observaciones: record.observaciones,
  };
}

/**
 * Parse backend material response into internal format
 */
function parseMaterialPayload(payload) {
  return {
    fecha: payload.fecha,
    piezasHoras: payload["piezas/horas"],
    observaciones: payload.observaciones,
  };
}

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ──────────────────────── SAMPLE DATA ────────────────────────

function generateSampleData() {
  return [
    {
      id: generateId(),
      orden: "ORD-001",
      clienteCobro: "Aceros del Norte",
      plantaTrabajo: "Planta Monterrey",
      nombreParte: "Eje Principal A12",
      region: "Noreste",
      costo: 1500,
      moneda: "USD",
      totalUSD: 1500,
      totalMXN: 1500 * EXCHANGE_RATE_USD_TO_MXN,
      rateTIH: "Rate",
      productividad: 95.5,
      horasAC: 24,
      observaciones: "Servicio completado sin incidentes",
      materiales: [
        { id: generateId(), fecha: "2025-09-02", piezasHoras: 562, observaciones: "Primera entrega de piezas" },
        { id: generateId(), fecha: "2025-09-05", piezasHoras: 340, observaciones: "Segunda entrega parcial" },
      ],
    },
    {
      id: generateId(),
      orden: "ORD-002",
      clienteCobro: "Metalurgica Central",
      plantaTrabajo: "Planta Saltillo",
      nombreParte: "Brida de Conexion B7",
      region: "Norte",
      costo: 28000,
      moneda: "MXN",
      totalUSD: 28000 / EXCHANGE_RATE_USD_TO_MXN,
      totalMXN: 28000,
      rateTIH: "TIH",
      productividad: 88.3,
      horasAC: 16,
      observaciones: "Pendiente revision final",
      materiales: [
        { id: generateId(), fecha: "2025-09-10", piezasHoras: 120, observaciones: "Material entregado parcialmente" },
      ],
    },
    {
      id: generateId(),
      orden: "ORD-003",
      clienteCobro: "Aceros del Norte",
      plantaTrabajo: "Planta Queretaro",
      nombreParte: "Valvula de Control C3",
      region: "Bajio",
      costo: 2200,
      moneda: "USD",
      totalUSD: 2200,
      totalMXN: 2200 * EXCHANGE_RATE_USD_TO_MXN,
      rateTIH: "Rate",
      productividad: 92.1,
      horasAC: 32,
      observaciones: "",
      materiales: [],
    },
    {
      id: generateId(),
      orden: "ORD-004",
      clienteCobro: "Industrias Pacific",
      plantaTrabajo: "Planta Guadalajara",
      nombreParte: "Soporte Estructural D5",
      region: "Occidente",
      costo: 45000,
      moneda: "MXN",
      totalUSD: 45000 / EXCHANGE_RATE_USD_TO_MXN,
      totalMXN: 45000,
      rateTIH: "TIH",
      productividad: 78.9,
      horasAC: 48,
      observaciones: "Requiere atencion especial en acabado",
      materiales: [
        { id: generateId(), fecha: "2025-08-28", piezasHoras: 890, observaciones: "Lote completo recibido" },
      ],
    },
    {
      id: generateId(),
      orden: "ORD-005",
      clienteCobro: "Manufactura Global",
      plantaTrabajo: "Planta Monterrey",
      nombreParte: "Cilindro Hidraulico E8",
      region: "Noreste",
      costo: 3100,
      moneda: "USD",
      totalUSD: 3100,
      totalMXN: 3100 * EXCHANGE_RATE_USD_TO_MXN,
      rateTIH: "Rate",
      productividad: 99.2,
      horasAC: 12,
      observaciones: "Servicio express - alta prioridad",
      materiales: [],
    },
    {
      id: generateId(),
      orden: "ORD-006",
      clienteCobro: "Metalurgica Central",
      plantaTrabajo: "Planta Saltillo",
      nombreParte: "Engrane de Transmision F2",
      region: "Norte",
      costo: 18500,
      moneda: "MXN",
      totalUSD: 18500 / EXCHANGE_RATE_USD_TO_MXN,
      totalMXN: 18500,
      rateTIH: "TIH",
      productividad: 85.0,
      horasAC: 20,
      observaciones: "",
      materiales: [],
    },
  ];
}

// ──────────────────────── FILTERING ────────────────────────

/** Get all filtered services based on current filter state */
function getFilteredServices() {
  return services.filter(function (s) {
    if (filters.cliente !== "all" && s.clienteCobro !== filters.cliente) return false;
    if (filters.orden !== "all" && s.orden !== filters.orden) return false;
    if (filters.planta !== "all" && s.plantaTrabajo !== filters.planta) return false;
    if (filters.region !== "all" && s.region !== filters.region) return false;
    if (filters.rateTIH !== "all" && s.rateTIH !== filters.rateTIH) return false;
    if (filters.nombreParte !== "all" && s.nombreParte !== filters.nombreParte) return false;
    if (filters.costo && !String(s.costo).includes(filters.costo)) return false;
    return true;
  });
}

/** Extract unique sorted values from a field across all services */
function getUniqueValues(field) {
  const set = new Set(services.map(function (s) { return s[field]; }));
  return Array.from(set).sort();
}

/** Count active filters */
function countActiveFilters() {
  let count = 0;
  if (filters.cliente !== "all") count++;
  if (filters.orden !== "all") count++;
  if (filters.planta !== "all") count++;
  if (filters.region !== "all") count++;
  if (filters.rateTIH !== "all") count++;
  if (filters.nombreParte !== "all") count++;
  if (filters.costo !== "") count++;
  return count;
}

/** Reset all filters to default */
function clearFilters() {
  filters = {
    cliente: "all",
    orden: "all",
    planta: "all",
    region: "all",
    costo: "",
    rateTIH: "all",
    nombreParte: "all",
  };
  currentPage = 1;
  renderFilterDropdowns();
  renderAll();
}

// ──────────────────────── PAGINATION ────────────────────────

/** Get paginated slice from filtered data */
function getPaginatedServices(filtered) {
  const start = (currentPage - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
}

/** Get total number of pages */
function getTotalPages(filtered) {
  return Math.max(1, Math.ceil(filtered.length / pageSize));
}

// ──────────────────────── TOTALS ────────────────────────

/** Compute totals from filtered data */
function computeTotals(filtered) {
  let totalMXN = 0, totalUSD = 0, totalHorasAC = 0;
  for (let i = 0; i < filtered.length; i++) {
    totalMXN += filtered[i].totalMXN;
    totalUSD += filtered[i].totalUSD;
    totalHorasAC += filtered[i].horasAC;
  }
  return { totalMXN: totalMXN, totalUSD: totalUSD, totalHorasAC: totalHorasAC };
}

// ──────────────────────── CRUD OPERATIONS ────────────────────────

/** Add a new service from form data */
function addService(formData) {
  const totalUSD = formData.moneda === "USD" ? formData.costo : formData.costo / EXCHANGE_RATE_USD_TO_MXN;
  const totalMXN = formData.moneda === "MXN" ? formData.costo : formData.costo * EXCHANGE_RATE_USD_TO_MXN;

  const newService = {
    id: generateId(),
    orden: formData.orden,
    clienteCobro: formData.clienteCobro,
    plantaTrabajo: formData.plantaTrabajo,
    nombreParte: formData.nombreParte,
    region: formData.region,
    costo: formData.costo,
    moneda: formData.moneda,
    totalUSD: totalUSD,
    totalMXN: totalMXN,
    rateTIH: formData.rateTIH,
    productividad: 0,
    horasAC: 0,
    observaciones: "",
    materiales: [],
  };
  services.unshift(newService);
  renderFilterDropdowns();
  renderAll();
}

/** Delete a service by ID */
function deleteService(serviceId) {
  services = services.filter(function (s) { return s.id !== serviceId; });
  renderFilterDropdowns();
  renderAll();
}

/** Update a service from edit modal */
function updateService(serviceId, updatedData, updatedMaterials) {
  services = services.map(function (s) {
    if (s.id !== serviceId) return s;

    const costo = parseFloat(updatedData.costo) || 0;
    const moneda = updatedData.moneda;
    const totalUSD = moneda === "USD" ? costo : costo / EXCHANGE_RATE_USD_TO_MXN;
    const totalMXN = moneda === "MXN" ? costo : costo * EXCHANGE_RATE_USD_TO_MXN;

    return {
      id: s.id,
      orden: updatedData.orden,
      clienteCobro: updatedData.clienteCobro,
      plantaTrabajo: updatedData.plantaTrabajo,
      nombreParte: updatedData.nombreParte,
      region: updatedData.region,
      costo: costo,
      moneda: moneda,
      totalUSD: totalUSD,
      totalMXN: totalMXN,
      rateTIH: updatedData.rateTIH,
      productividad: parseFloat(updatedData.productividad) || 0,
      horasAC: parseFloat(updatedData.horasAC) || 0,
      observaciones: updatedData.observaciones,
      materiales: updatedMaterials.map(function (m) { return Object.assign({}, m); }),
    };
  });
  renderFilterDropdowns();
  renderAll();
}

/** Add a material record to a service */
function addMaterialToService(serviceId, materialData) {
  // Build structured JSON for backend
  const payload = buildMaterialPayload(materialData);
  console.log("Material payload for backend:", JSON.stringify(payload, null, 2));

  services = services.map(function (s) {
    if (s.id !== serviceId) return s;
    return Object.assign({}, s, {
      materiales: s.materiales.concat([{
        id: generateId(),
        fecha: materialData.fecha,
        piezasHoras: materialData.piezasHoras,
        observaciones: materialData.observaciones,
      }]),
    });
  });
  renderAll();
}

// ──────────────────────── RENDER: FILTER DROPDOWNS ────────────────────────

function renderFilterDropdowns() {
  populateSelect("filter-cliente", getUniqueValues("clienteCobro"), "Todos", filters.cliente);
  populateSelect("filter-orden", getUniqueValues("orden"), "Todas", filters.orden);
  populateSelect("filter-planta", getUniqueValues("plantaTrabajo"), "Todas", filters.planta);
  populateSelect("filter-region", getUniqueValues("region"), "Todas", filters.region);
  populateSelect("filter-rate", getUniqueValues("rateTIH"), "Todos", filters.rateTIH);
  populateSelect("filter-parte", getUniqueValues("nombreParte"), "Todos", filters.nombreParte);
  document.getElementById("filter-costo").value = filters.costo;

  // Update active filter count badge
  const count = countActiveFilters();
  const badge = document.getElementById("filter-count");
  if (count > 0) {
    badge.textContent = count + " activo" + (count > 1 ? "s" : "");
    badge.style.display = "inline-flex";
  } else {
    badge.style.display = "none";
  }
}

function populateSelect(elementId, options, allLabel, currentValue) {
  const el = document.getElementById(elementId);
  let html = '<option value="all">' + escapeHtml(allLabel) + "</option>";
  for (let i = 0; i < options.length; i++) {
    const selected = options[i] === currentValue ? " selected" : "";
    html += '<option value="' + escapeHtml(options[i]) + '"' + selected + ">" + escapeHtml(options[i]) + "</option>";
  }
  el.innerHTML = html;
  el.value = currentValue;
}

// ──────────────────────── RENDER: TABLE ────────────────────────

function renderTable(paginated) {
  const tbody = document.getElementById("table-body");
  if (paginated.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" class="empty-row">No se encontraron registros. Agregue un nuevo servicio para comenzar.</td></tr>';
    return;
  }

  let html = "";
  for (let i = 0; i < paginated.length; i++) {
    const row = paginated[i];
    const monedaBadgeClass = row.moneda === "USD" ? "badge--usd" : "badge--mxn";

    html += `<tr>
      <td class="font-mono" style="font-weight:500;">${escapeHtml(row.orden)}</td>
      <td>${escapeHtml(row.clienteCobro)}</td>
      <td>${escapeHtml(row.plantaTrabajo)}</td>
      <td>${escapeHtml(row.nombreParte)}</td>
      <td><span class="badge badge--outline">${escapeHtml(row.region)}</span></td>
      <td class="text-right font-mono">${formatCurrency(row.costo, row.moneda)}</td>
      <td class="text-center"><span class="badge ${monedaBadgeClass}">${escapeHtml(row.moneda)}</span></td>`;

    let totales = row.registros.reduce((acu, reg) => {
      acu.piezasHoras += parseFloat(reg.piezasHoras);
      if (row.moneda === "USD") {
        acu.totalUSD += parseFloat(reg.totalUSD);
        acu.totalMXN += parseFloat(reg.totalUSD) * parseFloat(reg.tipoCambio);
        return acu;
      }
      acu.totalMXN += parseFloat(reg.totalMXN);
      return acu;
    }, { piezasHoras: 0, totalMXN: 0, totalUSD: 0 });

    html += `
      <td class="text-right font-mono">${formatCurrency(totales.totalUSD, "USD")} </td>
      <td class="text-right font-mono">${formatCurrency(totales.totalMXN, "MXN")}</td>

      <td class="text-center"><span class="badge badge--secondary">${escapeHtml(row.rateTIH)}</span></td>
      <td class="text-right font-mono">${row.productividad.toFixed(2)}</td>
      <td class="text-right font-mono">${row.horasAC.toFixed(1)}</td>
      <td class="cell-truncate">${(row.observaciones ? escapeHtml(row.observaciones) : '<span style="color:var(--muted);">—</span>')}</td>
      <td class="text-center">
      <div style="display:flex;align-items:center;justify-content:center;gap:2px;">
      <button class="action-btn" title="Ver detalle de registros" style="color:var(--warm);" onclick="openDetailModal('${row.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
      <button class="action-btn action-btn--edit" title="Editar servicio" onclick="openEditModal('${row.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn action-btn--material" title="Agregar material" onclick="openMaterialModal('${row.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/><line x1="12" y1="17" x2="12" y2="22"/><path d="M12 12v5"/><path d="M20 15.5l-4-2.3"/><path d="M4 15.5l4-2.3"/></svg>
          </button>
          <button class="action-btn action-btn--delete" title="Eliminar servicio" onclick="confirmDeleteService('${row.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }
  tbody.innerHTML = html;
}

// ──────────────────────── RENDER: TOTALS ────────────────────────

function renderTotals(totals) {
  document.getElementById("total-mxn").textContent = formatCurrency(totals.totalMXN, "MXN");
  document.getElementById("total-usd").textContent = formatCurrency(totals.totalUSD, "USD");
  document.getElementById("total-horas").textContent = totals.totalHorasAC.toFixed(1) + " hrs";
}

// ──────────────────────── RENDER: PAGINATION ────────────────────────

function renderPagination(filtered) {
  const total = filtered.length;
  const totalPg = getTotalPages(filtered);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  document.getElementById("pagination-info").innerHTML =
    "Mostrando <strong>" + start + "</strong> - <strong>" + end + "</strong> de <strong>" + total + "</strong> registros";
  document.getElementById("pagination-page").innerHTML =
    "Pagina <strong>" + currentPage + "</strong> de <strong>" + totalPg + "</strong>";

  document.getElementById("btn-first").disabled = currentPage <= 1;
  document.getElementById("btn-prev").disabled = currentPage <= 1;
  document.getElementById("btn-next").disabled = currentPage >= totalPg;
  document.getElementById("btn-last").disabled = currentPage >= totalPg;
}

// ──────────────────────── RENDER: ALL ────────────────────────

function renderAll() {
  const filtered = getFilteredServices();
  const totalPg = getTotalPages(filtered);
  if (currentPage > totalPg) currentPage = totalPg;
  const paginated = getPaginatedServices(filtered);
  const totals = computeTotals(filtered);

  renderTable(paginated);
  renderTotals(totals);
  renderPagination(filtered);
}

// ──────────────────────── MODAL HELPERS ────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "";
}

// ──────────────────────── MODAL: ADD SERVICE ────────────────────────

function openAddServiceModal() {
  // Reset form
  document.getElementById("svc-orden").value = "";
  document.getElementById("svc-cliente").value = "";
  document.getElementById("svc-planta").value = "";
  document.getElementById("svc-region").value = "";
  document.getElementById("svc-costo").value = "";
  document.getElementById("svc-moneda").value = "USD";
  document.getElementById("svc-rate").value = "Rate";
  document.getElementById("svc-rate-number").value = "";
  document.getElementById("svc-parte").value = "";
  toggleRateNumberField("svc-rate", "svc-rate-number-field");
  openModal("modal-add-service");
}

/** Show/hide rate number field based on Rate/TIH selection */
function toggleRateNumberField(selectId, fieldId) {
  var selectEl = document.getElementById(selectId);
  var fieldEl = document.getElementById(fieldId);
  if (selectEl.value === "Rate") {
    fieldEl.style.display = "flex";
  } else {
    fieldEl.style.display = "none";
  }
}

function saveAddService() {
  const formu = document.getElementById("form-addService");
  if (!formu.reportValidity()) return;
  let formData = {
    orden: document.getElementById("svc-orden").value.trim(),
    clienteCobro: document.getElementById("svc-cliente").value.trim(),
    plantaTrabajo: document.getElementById("svc-planta").value.trim(),
    region: document.getElementById("svc-region").value.trim(),
    costo: parseFloat(document.getElementById("svc-costo").value) || 0,
    moneda: document.getElementById("svc-moneda").value,
    rateTIH: document.getElementById("svc-rate").value,
    rateNumber: document.getElementById("svc-rate").value === "Rate" ? (parseFloat(document.getElementById("svc-rate-number").value) || 0) : null,
    nombreParte: document.getElementById("svc-parte").value.trim(),
  };
  if (validarInfo(formData) === false) {
    alert('Todos los campos son obligatorios');
    return;
  }

  for (const [key, valor] of Object.entries(formData)) {
    if (typeof valor === 'string') {
      formData[key] = valor.toUpperCase();
    }
  }

  
  formData.productividad = 0.0;
  formData.horasAC = 0.0;
  formData.supervisor = superv;
  formData.tipo = 'insert';
  formData._csrf = tok;
  formData.rateTIH == "Rate" ? formData.rateNumber = parseFloat(document.getElementById("svc-rate-number").value) : null;

  envioJson('crudOutput', formData, 'output');
  // addService(formData);
  // closeModal("modal-add-service");
}

// ──────────────────────── MODAL: ADD MATERIAL ────────────────────────

function openMaterialModal(serviceId) {
  materialTargetId = serviceId;
  const svc = services.find(function (s) { return s.id === serviceId; });
  document.getElementById("mat-service-name").textContent = svc ? svc.orden + " - " + svc.nombreParte : "";
  document.getElementById("mat-fecha").value = "";
  document.getElementById("mat-piezas").value = "";
  document.getElementById("mat-obs").value = "";
  openModal("modal-add-material");
}

function saveAddMaterial() {
  if (!materialTargetId) return;
  let servicio = sortRegister.find((s) => s.id == materialTargetId);
  if (!servicio) return;
  let nuevoMaterial = {
    fecha: document.getElementById("mat-fecha").value,
    piezasHoras: parseFloat(document.getElementById("mat-piezas").value) || 0,
    observaciones: document.getElementById("mat-obs").value.trim(),
    tipoCambio: servicio.moneda === "USD" ? parseFloat(cambio) : 1
  };
  if (!nuevoMaterial.fecha || !nuevoMaterial.piezasHoras) {
    alert('los campos fecha y cantidad de piezas/horas son obligatorios');
    return;
  }
  if (servicio.moneda === "USD") {
    nuevoMaterial.totalUSD = (nuevoMaterial.piezasHoras * parseFloat(servicio.costo)).toFixed(2);
    nuevoMaterial.totalMXN = (nuevoMaterial.totalUSD * nuevoMaterial.tipoCambio).toFixed(2);
  } else {
    nuevoMaterial.totalMXN = (parseFloat(servicio.costo) * nuevoMaterial.piezasHoras).toFixed(2);
  }
  console.log(servicio);
  servicio.registros.push(nuevoMaterial);

  const materialData = {
    registros: servicio.registros,
    id: materialTargetId,
    tipo: 'update',
    _csrf: tok
  };

  envioJson('crudOutput', materialData, 'output');

  // addMaterialToService(materialTargetId, materialData);
  // closeModal("modal-add-material");
  // materialTargetId = null;
}

// ──────────────────────── MODAL: EDIT SERVICE ────────────────────────

function openEditModal(serviceId) {
  const svc = services.find((s) => s.id == serviceId);
  console.log(svc);
  if (!svc) return;

  editingServiceId = serviceId;
  editingMaterials = svc.registros.map(function (m) { return Object.assign({}, m); });
  editingMaterialId = null;

  document.getElementById("edit-orden").value = svc.orden;
  document.getElementById("edit-cliente").value = svc.clienteCobro;
  document.getElementById("edit-planta").value = svc.plantaTrabajo;
  document.getElementById("edit-parte").value = svc.nombreParte;
  document.getElementById("edit-region").value = svc.region;
  document.getElementById("edit-costo").value = svc.costo || "";
  document.getElementById("edit-moneda").value = svc.moneda;
  document.getElementById("edit-rate").value = svc.rateTIH;
  document.getElementById("edit-rate-number").value = svc.rateNumber || "";
  toggleRateNumberField("edit-rate", "edit-rate-number-field");
  document.getElementById("edit-productividad").value = svc.productividad || "";
  document.getElementById("edit-horas").value = svc.horasAC || "";
  document.getElementById("edit-obs").value = svc.observaciones;

  renderMaterialsInEditModal();
  openModal("modal-edit-service");
}

function renderMaterialsInEditModal() {
  const container = document.getElementById("materials-container");
  document.getElementById("mat-count").textContent = editingMaterials.length + " registro" + (editingMaterials.length !== 1 ? "s" : "");

  if (editingMaterials.length === 0) {
    container.innerHTML = '<p class="empty-text">No hay registros de material para este servicio.</p>';
    return;
  }

  let html = '<table class="mat-table"><thead><tr><th>Fecha</th><th>Piezas/Horas</th><th>Observaciones</th><th class="text-center" style="width:90px;">Acciones</th></tr></thead><tbody>';

  for (let i = 0; i < editingMaterials.length; i++) {
    const mat = editingMaterials[i];

    if (editingMaterialId === mat.id) {
      // Inline editing row
      html += "<tr>"
        + '<td><input class="text-input" type="date" id="mat-edit-fecha" value="' + escapeHtml(mat.fecha) + '" /></td>'
        + '<td><input class="text-input" type="number" id="mat-edit-piezas" value="' + mat.piezasHoras + '" /></td>'
        + '<td><input class="text-input" id="mat-edit-obs" value="' + escapeHtml(mat.observaciones) + '" /></td>'
        + '<td class="text-center"><div class="mat-actions">'
          + '<button class="action-btn action-btn--edit" title="Guardar" onclick="saveMaterialInlineEdit()">'
            + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>'
          + "</button>"
          + '<button class="action-btn action-btn--delete" title="Cancelar" onclick="cancelMaterialInlineEdit()">'
            + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
          + "</button>"
        + "</div></td>"
      + "</tr>";
    } else {
      // Display row
      html += "<tr>"
        + "<td>" + escapeHtml(mat.fecha) + "</td>"
        + '<td class="font-mono">' + mat.piezasHoras + "</td>"
        + '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(mat.observaciones) + "</td>"
        + '<td class="text-center"><div class="mat-actions">'
          + '<button class="action-btn action-btn--edit" title="Editar" onclick="startMaterialInlineEdit(\'' + mat.id + '\')">'
            + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
          + "</button>"
          + '<button class="action-btn action-btn--delete" title="Eliminar" onclick="deleteMaterialInEdit(\'' + mat.id + '\')">'
            + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
          + "</button>"
        + "</div></td>"
      + "</tr>";
    }
  }

  html += "</tbody></table>";
  container.innerHTML = html;
}

function startMaterialInlineEdit(materialId) {
  editingMaterialId = materialId;
  renderMaterialsInEditModal();
}

function cancelMaterialInlineEdit() {
  editingMaterialId = null;
  renderMaterialsInEditModal();
}

function saveMaterialInlineEdit() {
  if (!editingMaterialId) return;
  const newFecha = document.getElementById("mat-edit-fecha").value;
  const newPiezas = parseFloat(document.getElementById("mat-edit-piezas").value) || 0;
  const newObs = document.getElementById("mat-edit-obs").value.trim();

  // Use the payload structure for consistency
  const payload = buildMaterialPayload({ fecha: newFecha, piezasHoras: newPiezas, observaciones: newObs });
  const parsed = parseMaterialPayload(payload);

  editingMaterials = editingMaterials.map(function (m) {
    if (m.id !== editingMaterialId) return m;
    return Object.assign({}, m, {
      fecha: parsed.fecha,
      piezasHoras: parsed.piezasHoras,
      observaciones: parsed.observaciones,
    });
  });

  editingMaterialId = null;
  renderMaterialsInEditModal();
}

function deleteMaterialInEdit(materialId) {
  editingMaterials = editingMaterials.filter(function (m) { return m.id !== materialId; });
  renderMaterialsInEditModal();
}

function saveEditService() {
  if (!editingServiceId) return;

  const updatedData = {
    orden: document.getElementById("edit-orden").value.trim(),
    clienteCobro: document.getElementById("edit-cliente").value.trim(),
    plantaTrabajo: document.getElementById("edit-planta").value.trim(),
    nombreParte: document.getElementById("edit-parte").value.trim(),
    region: document.getElementById("edit-region").value.trim(),
    costo: document.getElementById("edit-costo").value,
    moneda: document.getElementById("edit-moneda").value,
    rateTIH: document.getElementById("edit-rate").value,
    rateNumber: document.getElementById("edit-rate").value === "Rate" ? (parseFloat(document.getElementById("edit-rate-number").value) || 0) : null,
    productividad: document.getElementById("edit-productividad").value,
    horasAC: document.getElementById("edit-horas").value,
    observaciones: document.getElementById("edit-obs").value.trim(),
    tipo: 'insert',
    _csrf: tok
  };

  updateService(editingServiceId, updatedData, editingMaterials);
  closeModal("modal-edit-service");
  editingServiceId = null;
  editingMaterials = [];
}

// ──────────────────────── MODAL: DETAIL RECORDS ────────────────────────

function openDetailModal(serviceId) {
  var svc = services.find(function (s) { return s.id == serviceId; });
  if (!svc) return;

  document.getElementById("detail-service-name").textContent = svc.orden + " - " + (svc.nombreParte || "Sin nombre");

  var registros = svc.registros || [];
  var summaryEl = document.getElementById("detail-summary");
  var tableEl = document.getElementById("detail-table-container");

  // Calculate totals from registros
  var totalPiezas = 0;
  var totalUSD = 0;
  var totalMXN = 0;
  for (var i = 0; i < registros.length; i++) {
    totalPiezas += parseFloat(registros[i].piezasHoras) || 0;
    if (svc.moneda === "USD") {
      totalUSD += parseFloat(registros[i].totalUSD) || 0;
      totalMXN += (parseFloat(registros[i].totalUSD) || 0) * (parseFloat(registros[i].tipoCambio) || 1);
    } else {
      totalMXN += parseFloat(registros[i].totalMXN) || 0;
    }
  }

  // Render summary cards
  summaryEl.innerHTML = '<div class="detail-summary-grid">'
    + '<div class="detail-stat"><span class="detail-stat-label">Total Registros</span><span class="detail-stat-value">' + registros.length + '</span></div>'
    + '<div class="detail-stat"><span class="detail-stat-label">Total Piezas/Horas</span><span class="detail-stat-value font-mono">' + totalPiezas.toFixed(2) + '</span></div>'
    + '<div class="detail-stat"><span class="detail-stat-label">Costo Unitario</span><span class="detail-stat-value font-mono">' + formatCurrency(svc.costo, svc.moneda) + '</span></div>'
    + (svc.moneda === "USD" ? '<div class="detail-stat"><span class="detail-stat-label">Total USD</span><span class="detail-stat-value font-mono">' + formatCurrency(totalUSD, "USD") + '</span></div>' : '')
    + '<div class="detail-stat"><span class="detail-stat-label">Total MXN</span><span class="detail-stat-value font-mono">' + formatCurrency(totalMXN, "MXN") + '</span></div>'
    + '<div class="detail-stat"><span class="detail-stat-label">Rate/TIH</span><span class="detail-stat-value">' + escapeHtml(svc.rateTIH) + (svc.rateNumber ? ' (' + svc.rateNumber + ')' : '') + '</span></div>'
    + '</div>';

  // Render records table
  if (registros.length === 0) {
    tableEl.innerHTML = '<p class="empty-text">No hay registros para este servicio.</p>';
  } else {
    var html = '<table class="mat-table"><thead><tr>'
      + '<th>#</th>'
      + '<th>Fecha</th>'
      + '<th>Piezas/Horas</th>';
    if (svc.moneda === "USD") {
      html += '<th class="text-right">Total USD</th>'
        + '<th class="text-right">Tipo Cambio</th>';
    }
    html += '<th class="text-right">Total MXN</th>'
      + '<th>Observaciones</th>'
      + '</tr></thead><tbody>';

    for (var j = 0; j < registros.length; j++) {
      var reg = registros[j];
      var regTotalMXN = svc.moneda === "USD"
        ? ((parseFloat(reg.totalUSD) || 0) * (parseFloat(reg.tipoCambio) || 1))
        : (parseFloat(reg.totalMXN) || 0);

      html += '<tr>'
        + '<td class="font-mono">' + (j + 1) + '</td>'
        + '<td>' + escapeHtml(reg.fecha) + '</td>'
        + '<td class="font-mono">' + (parseFloat(reg.piezasHoras) || 0) + '</td>';
      if (svc.moneda === "USD") {
        html += '<td class="text-right font-mono">' + formatCurrency(parseFloat(reg.totalUSD) || 0, "USD") + '</td>'
          + '<td class="text-right font-mono">' + (parseFloat(reg.tipoCambio) || 0).toFixed(2) + '</td>';
      }
      html += '<td class="text-right font-mono">' + formatCurrency(regTotalMXN, "MXN") + '</td>'
        + '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(reg.observaciones || "") + '</td>'
        + '</tr>';
    }

    // Footer totals
    var colSpan = svc.moneda === "USD" ? 3 : 3;
    html += '</tbody><tfoot><tr class="detail-total-row">'
      + '<td colspan="2" style="font-weight:600;">TOTALES</td>'
      + '<td class="font-mono" style="font-weight:600;">' + totalPiezas.toFixed(2) + '</td>';
    if (svc.moneda === "USD") {
      html += '<td class="text-right font-mono" style="font-weight:600;">' + formatCurrency(totalUSD, "USD") + '</td>'
        + '<td></td>';
    }
    html += '<td class="text-right font-mono" style="font-weight:600;">' + formatCurrency(totalMXN, "MXN") + '</td>'
      + '<td></td>'
      + '</tr></tfoot></table>';

    tableEl.innerHTML = html;
  }

  openModal("modal-detail-records");
}

// ──────────────────────── DELETE CONFIRM ────────────────────────

function confirmDeleteService(serviceId) {
  if (confirm("Esta seguro de que desea eliminar este servicio? Esta accion no se puede deshacer.")) {
    deleteService(serviceId);
  }
}

// ──────────────────────── FILTER TOGGLE ────────────────────────

function toggleFilters() {
  filtersCollapsed = !filtersCollapsed;
  const body = document.getElementById("filter-body");
  const chevron = document.getElementById("filter-chevron");
  if (filtersCollapsed) {
    body.classList.add("collapsed");
    chevron.classList.add("rotated");
  } else {
    body.classList.remove("collapsed");
    chevron.classList.remove("rotated");
  }
}

// ──────────────────────── EVENT BINDING ────────────────────────

function bindEvents() {
  // Filter toggle
  document.getElementById("filter-toggle").addEventListener("click", toggleFilters);

  // Filter inputs
  document.getElementById("filter-cliente").addEventListener("change", function () {
    filters.cliente = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("filter-orden").addEventListener("change", function () {
    filters.orden = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("filter-planta").addEventListener("change", function () {
    filters.planta = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("filter-region").addEventListener("change", function () {
    filters.region = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("filter-rate").addEventListener("change", function () {
    filters.rateTIH = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("filter-parte").addEventListener("change", function () {
    filters.nombreParte = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("filter-costo").addEventListener("input", function () {
    filters.costo = this.value;
    currentPage = 1;
    renderAll();
  });
  document.getElementById("btn-clear-filters").addEventListener("click", clearFilters);

  // Pagination
  document.getElementById("page-size").addEventListener("change", function () {
    pageSize = parseInt(this.value);
    currentPage = 1;
    renderAll();
  });
  document.getElementById("btn-first").addEventListener("click", function () {
    currentPage = 1;
    renderAll();
  });
  document.getElementById("btn-prev").addEventListener("click", function () {
    if (currentPage > 1) { currentPage--; renderAll(); }
  });
  document.getElementById("btn-next").addEventListener("click", function () {
    const totalPg = getTotalPages(getFilteredServices());
    if (currentPage < totalPg) { currentPage++; renderAll(); }
  });
  document.getElementById("btn-last").addEventListener("click", function () {
    currentPage = getTotalPages(getFilteredServices());
    renderAll();
  });

  // Add Service
  document.getElementById("btn-add-service").addEventListener("click", openAddServiceModal);
  document.getElementById("btn-save-service").addEventListener("click", saveAddService);

  // Rate / TIH toggle for add modal
  document.getElementById("svc-rate").addEventListener("change", function () {
    toggleRateNumberField("svc-rate", "svc-rate-number-field");
  });

  // Rate / TIH toggle for edit modal
  document.getElementById("edit-rate").addEventListener("change", function () {
    toggleRateNumberField("edit-rate", "edit-rate-number-field");
  });

  // Add Material
  document.getElementById("btn-save-material").addEventListener("click", saveAddMaterial);

  // Edit Service
  document.getElementById("btn-save-edit").addEventListener("click", saveEditService);

  // Close buttons (using data-close attribute)
  var closeBtns = document.querySelectorAll("[data-close]");
  for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener("click", function () {
      closeModal(this.getAttribute("data-close"));
    });
  }

  // Close modal on overlay click
  var overlays = document.querySelectorAll(".modal-overlay");
  for (var j = 0; j < overlays.length; j++) {
    overlays[j].addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var modals = document.querySelectorAll(".modal-overlay.active");
      for (var k = 0; k < modals.length; k++) {
        closeModal(modals[k].id);
      }
    }
  });
}

// ──────────────────────── INITIALIZE ────────────────────────

function init() {
  formatear();
  services = sortRegister;
  // services = generateSampleData();
  bindEvents();
  renderFilterDropdowns();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);

// ──────────────────────── CUSTOM FUNCTIONS ────────────────────────

function validarInfo(info) {
  for (const [key, valor] of Object.entries(info)) {
    // rateNumber can be null when TIH is selected
    if (key === "rateNumber") continue;
    if (!valor && valor !== 0) return false;
    if (typeof valor === "string" && !valor.trim()) return false;
  }
  return true;
}

function formatear() {
  sortRegister.forEach(ele => {
    try {
      ele.registros = JSON.parse(ele.registros);
    } catch (error) {
      console.error("Error parsing registros:", error);
    }
  });
}


