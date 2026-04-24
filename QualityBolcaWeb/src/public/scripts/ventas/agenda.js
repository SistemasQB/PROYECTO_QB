/* ============================================================
   CRM Ventas — Agenda de Ventas
   Quality Bolca | 2026
   JS vanilla con datos mock. Backend se integrará después.
   ============================================================ */

'use strict';

/* ── CONSTANTES ── */
const ETAPAS = ['Prospecto','En busca de contacto','Contactado','Interesado','Cotización','Negociación','Cerrado','Perdido'];

const COLOR_ETAPA = {
  'Prospecto':              '#8E8E93',
  'En busca de contacto':   '#5856D6',
  'Contactado':             '#007AFF',
  'Interesado':             '#00C7BE',
  'Cotización':             '#FF9500',
  'Negociación':            '#AF52DE',
  'Cerrado':                '#34C759',
  'Perdido':                '#FF3B30',
};

/* ── DATOS MOCK ── */
let prospectos = [
  { id: '1', razonSocial: 'Industrias Monterrey S.A.', direccion: 'Av. Industrial 340, MTY', parqueIndustrial: 'Parque Ind. Stiva', giro: 'Automotriz', nombreContacto: 'Carlos Medina', correo: 'c.medina@ind-mty.com', telefono: '(81) 1234-5678', etapa: 'Interesado', motivoRechazo: '', comentarios: 'Muy interesado en línea de limpieza industrial.', semanas: [1,2,3,10,11] },
  { id: '2', razonSocial: 'Plásticos del Norte', direccion: 'Blvd. Insurgentes 890', parqueIndustrial: '', giro: 'Plásticos', nombreContacto: 'Ana Torres', correo: 'ana.torres@plastnor.mx', telefono: '(664) 555-9900', etapa: 'Cotización', motivoRechazo: '', comentarios: 'Esperando cotización detallada.', semanas: [5,6,7] },
  { id: '3', razonSocial: 'Electrónica Bajío', direccion: 'Carr. León-Silao Km 12', parqueIndustrial: 'Parque Ind. Bajío', giro: 'Electrónica', nombreContacto: 'Luis Pérez', correo: 'lperez@elecbajio.com', telefono: '(477) 123-0000', etapa: 'Prospecto', motivoRechazo: '', comentarios: '', semanas: [15,16,17,18] },
  { id: '4', razonSocial: 'Empaques Globales', direccion: 'Zona Industrial Sur', parqueIndustrial: 'P.I. Sur Guadalajara', giro: 'Empaque', nombreContacto: 'María García', correo: 'm.garcia@empglobal.com', telefono: '(33) 3344-5566', etapa: 'Negociación', motivoRechazo: '', comentarios: 'En proceso de negociación de precios.', semanas: [3,4,5] },
  { id: '5', razonSocial: 'Logística Express MX', direccion: 'Calz. de la Viga 200', parqueIndustrial: '', giro: 'Logística', nombreContacto: 'Roberto Sánchez', correo: 'r.sanchez@logex.mx', telefono: '(55) 8800-1122', etapa: 'Perdido', motivoRechazo: 'Precio', comentarios: 'Precio fuera de rango.', semanas: [20] },
  { id: '6', razonSocial: 'Metales Industriales Querétaro', direccion: 'Parque Ind. Querétaro', parqueIndustrial: 'P.I. Querétaro', giro: 'Metalmecánica', nombreContacto: 'Sofía Ramírez', correo: 'sofia.r@metalqro.mx', telefono: '(442) 900-7788', etapa: 'Contactado', motivoRechazo: '', comentarios: 'Primera llamada realizada.', semanas: [8,9] },
  { id: '7', razonSocial: 'Alimentos Frescos Norte', direccion: 'Periférico Norte 1500', parqueIndustrial: '', giro: 'Alimentos', nombreContacto: 'Jorge Ibarra', correo: 'jibarra@alfrenor.com', telefono: '(614) 333-4455', etapa: 'Cerrado', motivoRechazo: '', comentarios: 'Contrato firmado.', semanas: [1,2] },
  { id: '8', razonSocial: 'Construcciones Regio', direccion: 'Av. Constitución 750', parqueIndustrial: '', giro: 'Construcción', nombreContacto: 'Patricia Leal', correo: 'p.leal@constgregio.mx', telefono: '(81) 2200-3300', etapa: 'En busca de contacto', motivoRechazo: '', comentarios: '', semanas: [22,23,24] },
];

/* ── ESTADO DE LA VISTA ── */
let vistaActual = 'tabla';
let selectedSemanas = [];
let editingId = null;

/* ── FILTROS ── */
let filtros = { q: '', etapa: 'todas', giro: 'todos', semana: 'todas' };

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initUserChip();
  buildSemanasFilter();
  buildSemanasGrid();
  renderTabla();
  renderKanban();
});

/* ── USER CHIP ── */
function initUserChip() {
  const nombre = 'Vendedor QB';
  const inicial = nombre.charAt(0).toUpperCase();
  const els = ['userAvatarSidebar','userAvatarTop'];
  els.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = inicial;
  });
  const nameSidebar = document.getElementById('userNameSidebar');
  const nameTop     = document.getElementById('userNameTop');
  if (nameSidebar) nameSidebar.textContent = nombre;
  if (nameTop) nameTop.textContent = nombre;
}

/* ── SEMANAS FILTER SELECT ── */
function buildSemanasFilter() {
  const sel = document.getElementById('selectSemana');
  for (let i = 1; i <= 52; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Semana ${i}`;
    sel.appendChild(opt);
  }
}

/* ── SEMANAS PICKER MODAL ── */
function buildSemanasGrid() {
  const grid = document.getElementById('semanasGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= 52; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'semana-btn' + (selectedSemanas.includes(i) ? ' active' : '');
    btn.textContent = i;
    btn.dataset.semana = i;
    btn.onclick = () => toggleSemana(i, btn);
    grid.appendChild(btn);
  }
  updateSemanasCount();
}

function toggleSemana(n, btn) {
  if (selectedSemanas.includes(n)) {
    selectedSemanas = selectedSemanas.filter(x => x !== n);
    btn.classList.remove('active');
  } else {
    selectedSemanas.push(n);
    selectedSemanas.sort((a,b) => a-b);
    btn.classList.add('active');
  }
  updateSemanasCount();
}

function updateSemanasCount() {
  const el = document.getElementById('semanasCount');
  if (el) el.textContent = selectedSemanas.length;
}

/* ================================================================
   FILTRADO
   ================================================================ */
function aplicarFiltros() {
  filtros.q      = document.getElementById('inputBuscar').value.toLowerCase().trim();
  filtros.etapa  = document.getElementById('selectEtapa').value;
  filtros.giro   = document.getElementById('selectGiro').value;
  filtros.semana = document.getElementById('selectSemana').value;
  renderTabla();
  if (vistaActual === 'kanban') renderKanban();
}

function getFiltered() {
  return prospectos.filter(p => {
    if (filtros.etapa !== 'todas' && p.etapa !== filtros.etapa) return false;
    if (filtros.giro !== 'todos' && p.giro !== filtros.giro) return false;
    if (filtros.semana !== 'todas' && !(p.semanas ?? []).includes(Number(filtros.semana))) return false;
    if (filtros.q) {
      const txt = [p.razonSocial, p.nombreContacto, p.correo, p.giro].filter(Boolean).join(' ').toLowerCase();
      if (!txt.includes(filtros.q)) return false;
    }
    return true;
  });
}

/* ================================================================
   RENDER TABLA
   ================================================================ */
function renderTabla() {
  const body = document.getElementById('tableBody');
  const items = getFiltered();

  if (items.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="table-empty">
          <i class="fa-solid fa-bullseye"></i>
          <p>Sin prospectos que coincidan con los filtros</p>
        </td>
      </tr>`;
    return;
  }

  body.innerHTML = items.map(p => {
    const color = COLOR_ETAPA[p.etapa] ?? '#007AFF';
    const semStr = (p.semanas ?? []).length > 0
      ? (p.semanas.slice(0,6).join(', ') + (p.semanas.length > 6 ? '…' : ''))
      : '—';
    return `
      <tr>
        <td>
          <div class="cell-main">${esc(p.razonSocial)}</div>
          ${p.parqueIndustrial ? `<div class="cell-sub">${esc(p.parqueIndustrial)}</div>` : ''}
        </td>
        <td>
          <div>${esc(p.nombreContacto || '—')}</div>
          <div class="cell-sub">${esc(p.correo || '')}${p.correo && p.telefono ? ' · ' : ''}${esc(p.telefono || '')}</div>
        </td>
        <td>${esc(p.giro || '—')}</td>
        <td>
          <span class="etapa-badge" style="background:${color}20;color:${color}">
            ${esc(p.etapa)}
          </span>
        </td>
        <td class="semanas-text">${semStr}</td>
        <td class="actions-cell">
          <button class="btn-action" onclick="abrirModalEditar('${p.id}')" title="Editar">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="btn-action danger" onclick="eliminarProspecto('${p.id}')" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
  }).join('');
}

/* ================================================================
   RENDER KANBAN
   ================================================================ */
function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  const items = getFiltered();
  board.innerHTML = '';

  ETAPAS.forEach(etapa => {
    const col = document.createElement('div');
    col.className = 'kanban-column';
    col.dataset.etapa = etapa;

    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      moverEtapa(id, etapa);
    });

    const colItems = items.filter(p => p.etapa === etapa);
    const color = COLOR_ETAPA[etapa] ?? '#007AFF';

    col.innerHTML = `
      <div class="kanban-col-header">
        <div class="kanban-col-title">
          <span class="col-dot" style="background:${color}"></span>
          <span>${esc(etapa)}</span>
        </div>
        <span class="kanban-count">${colItems.length}</span>
      </div>
      <div class="kanban-cards" id="col_${etapa.replace(/\s/g,'_')}">
        ${colItems.map(p => buildKanbanCard(p)).join('')}
      </div>`;

    board.appendChild(col);
  });
}

function buildKanbanCard(p) {
  return `
    <div class="kanban-card"
      draggable="true"
      data-id="${p.id}"
      ondragstart="onDragStart(event)"
      ondblclick="abrirModalEditar('${p.id}')">
      <div class="kcard-name">${esc(p.razonSocial)}</div>
      <div class="kcard-contact">${esc(p.nombreContacto || '—')}</div>
      <div class="kcard-footer">
        <span class="kcard-giro">${esc(p.giro || '—')}</span>
        <span class="kcard-semanas">${(p.semanas ?? []).length} sem</span>
      </div>
    </div>`;
}

/* ── DRAG & DROP ── */
function onDragStart(e) {
  const card = e.currentTarget;
  card.classList.add('dragging');
  e.dataTransfer.setData('text/plain', card.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => card.classList.remove('dragging'), 0);
}

function moverEtapa(id, nuevaEtapa) {
  const p = prospectos.find(x => x.id === id);
  if (!p || p.etapa === nuevaEtapa) return;
  p.etapa = nuevaEtapa;
  if (nuevaEtapa !== 'Perdido') p.motivoRechazo = '';
  renderTabla();
  renderKanban();
  showToast(`Prospecto movido a "${nuevaEtapa}"`, 'success');
}

/* ================================================================
   CAMBIO DE VISTA
   ================================================================ */
function setView(v) {
  vistaActual = v;
  document.getElementById('vistaTabla').style.display  = v === 'tabla'  ? 'block' : 'none';
  document.getElementById('vistaKanban').style.display = v === 'kanban' ? 'block' : 'none';
  document.getElementById('btnTabla').classList.toggle('active', v === 'tabla');
  document.getElementById('btnKanban').classList.toggle('active', v === 'kanban');
  if (v === 'kanban') renderKanban();
}

/* ================================================================
   MODAL
   ================================================================ */
function abrirModalNuevo() {
  editingId = null;
  selectedSemanas = [];
  document.getElementById('modalTitle').textContent = 'Nuevo prospecto';
  document.getElementById('formProspecto').reset();
  document.getElementById('prospecto_id').value = '';
  buildSemanasGrid();
  toggleMotivoGroup();
  document.getElementById('modalProspecto').classList.add('open');
}

function abrirModalEditar(id) {
  const p = prospectos.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  selectedSemanas = [...(p.semanas ?? [])];

  document.getElementById('modalTitle').textContent = 'Editar prospecto';
  document.getElementById('prospecto_id').value       = p.id;
  document.getElementById('field_razonSocial').value  = p.razonSocial ?? '';
  document.getElementById('field_direccion').value    = p.direccion ?? '';
  document.getElementById('field_parqueIndustrial').value = p.parqueIndustrial ?? '';
  document.getElementById('field_giro').value         = p.giro ?? '';
  document.getElementById('field_nombreContacto').value = p.nombreContacto ?? '';
  document.getElementById('field_correo').value       = p.correo ?? '';
  document.getElementById('field_telefono').value     = p.telefono ?? '';
  document.getElementById('field_etapa').value        = p.etapa ?? 'Prospecto';
  document.getElementById('field_motivoRechazo').value = p.motivoRechazo ?? '';
  document.getElementById('field_comentarios').value  = p.comentarios ?? '';
  buildSemanasGrid();
  toggleMotivoGroup();
  document.getElementById('modalProspecto').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modalProspecto').classList.remove('open');
}

function onEtapaChange() {
  toggleMotivoGroup();
}

function toggleMotivoGroup() {
  const etapa  = document.getElementById('field_etapa').value;
  const grupo  = document.getElementById('motivoGroup');
  if (etapa === 'Perdido') grupo.classList.add('visible');
  else grupo.classList.remove('visible');
}

/* ── GUARDAR ── */
function guardarProspecto() {
  const razonSocial = document.getElementById('field_razonSocial').value.trim();
  if (!razonSocial) { showToast('Razón social requerida', 'error'); return; }

  const datos = {
    razonSocial,
    direccion:        document.getElementById('field_direccion').value.trim(),
    parqueIndustrial: document.getElementById('field_parqueIndustrial').value.trim(),
    giro:             document.getElementById('field_giro').value,
    nombreContacto:   document.getElementById('field_nombreContacto').value.trim(),
    correo:           document.getElementById('field_correo').value.trim(),
    telefono:         document.getElementById('field_telefono').value.trim(),
    etapa:            document.getElementById('field_etapa').value,
    motivoRechazo:    document.getElementById('field_motivoRechazo').value,
    comentarios:      document.getElementById('field_comentarios').value.trim(),
    semanas:          [...selectedSemanas],
  };

  if (editingId) {
    const idx = prospectos.findIndex(x => x.id === editingId);
    if (idx !== -1) prospectos[idx] = { ...prospectos[idx], ...datos };
    showToast('Prospecto actualizado', 'success');
  } else {
    datos.id = Date.now().toString();
    prospectos.push(datos);
    showToast('Prospecto creado', 'success');
  }

  cerrarModal();
  renderTabla();
  if (vistaActual === 'kanban') renderKanban();
}

/* ── ELIMINAR ── */
function eliminarProspecto(id) {
  if (!confirm('¿Eliminar este prospecto?')) return;
  prospectos = prospectos.filter(x => x.id !== id);
  renderTabla();
  if (vistaActual === 'kanban') renderKanban();
  showToast('Prospecto eliminado', 'success');
}

/* ================================================================
   EXPORTAR (stub — sin dependencia externa)
   ================================================================ */
function exportarExcel() {
  const items = getFiltered();
  const headers = ['Razon Social','Direccion','Parque Industrial','Giro','Contacto','Correo','Telefono','Etapa','Motivo Rechazo','Comentarios','Semanas'];
  const rows = items.map(p => [
    p.razonSocial, p.direccion, p.parqueIndustrial, p.giro,
    p.nombreContacto, p.correo, p.telefono, p.etapa,
    p.motivoRechazo, p.comentarios, (p.semanas ?? []).join(', ')
  ]);

  let csv = headers.join(',') + '\n' + rows.map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `agenda_ventas_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exportado como CSV', 'success');
}

/* ================================================================
   SIDEBAR (móvil)
   ================================================================ */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function cerrarSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

/* ================================================================
   TOAST
   ================================================================ */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${esc(msg)}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 2800);
}

/* ── ESCAPE HTML ── */
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
