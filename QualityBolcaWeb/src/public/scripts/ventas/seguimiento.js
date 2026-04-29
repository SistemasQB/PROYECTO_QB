/* ============================================================
   CRM Ventas — Seguimiento de Clientes
   Quality Bolca | 2026
   ============================================================ */

'use strict';

/* ── ÍCONOS POR TIPO ── */
const ICON_TIPO = {
  'llamada':     'fa-phone',
  'correo':      'fa-envelope',
  'reunión':     'fa-users',
  'conferencia': 'fa-video',
  'visita':      'fa-location-dot',
  'otro':        'fa-comment',
};

/* ── ESTADO ── */
let clientes     = [];
let seguimientos = [];
let filtros      = { q: '', activo: 'todos' };
let editingId    = null;
let actTargetId  = null;

/* ── API HELPERS ── */
async function apiPost(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': window._tok }, body: JSON.stringify(body) });
  const j = await r.json();
  if (j.token) window._tok = j.token;
  return j;
}

async function apiPut(url, body) {
  const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': window._tok }, body: JSON.stringify(body) });
  const j = await r.json();
  if (j.token) window._tok = j.token;
  return j;
}

async function apiDelete(url) {
  const r = await fetch(url, { method: 'DELETE', headers: { 'X-CSRF-Token': window._tok } });
  const j = await r.json();
  if (j.token) window._tok = j.token;
  return j;
}

/* ── CARGA INICIAL ── */
async function cargarDatos() {
  try {
    const [rCli, rSeg] = await Promise.all([
      fetch('/ventas/api/clientes',     { headers: { 'X-CSRF-Token': window._tok } }),
      fetch('/ventas/api/seguimientos', { headers: { 'X-CSRF-Token': window._tok } }),
    ]);
    const jCli = await rCli.json();
    const jSeg = await rSeg.json();
    if (jCli.token) window._tok = jCli.token;
    if (jSeg.token) window._tok = jSeg.token;

    if (jCli.ok) clientes     = jCli.data;
    if (jSeg.ok) seguimientos = jSeg.data;

    populateClienteSelect();
    renderSeguimientos();
  } catch (e) {
    showToast('Error de conexión', 'error');
  }
}

async function recargarSeguimientos() {
  try {
    const r = await fetch('/ventas/api/seguimientos', { headers: { 'X-CSRF-Token': window._tok } });
    const j = await r.json();
    if (j.token) window._tok = j.token;
    if (j.ok) seguimientos = j.data;
    renderSeguimientos();
  } catch (e) {
    showToast('Error de conexión', 'error');
  }
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initUserChip();
  setupSwitch();
  cargarDatos();
});

/* ── USER CHIP ── */
function initUserChip() {
  const meta = (name) => {
    const el = document.querySelector(`meta[name="${name}"]`);
    return el ? el.getAttribute('content') : '';
  };
  const nombre      = meta('usuario-nombre')       || 'Usuario';
  const nombreCorto = meta('usuario-nombre-corto') || nombre.split(' ')[0];
  const inicial     = meta('usuario-inicial')      || nombre.charAt(0).toUpperCase();
  const correo      = meta('usuario-correo')       || '';

  ['userAvatarSidebar','userAvatarTop'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = inicial;
  });
  const ns = document.getElementById('userNameSidebar');
  const nt = document.getElementById('userNameTop');
  const es = document.getElementById('userEmailSidebar');
  if (ns) ns.textContent = nombre;
  if (nt) nt.textContent = nombreCorto;
  if (es) es.textContent = correo;
}

/* ── POBLAR SELECT CLIENTE ── */
function populateClienteSelect() {
  const sel = document.getElementById('field_clienteId');
  while (sel.options.length > 1) sel.remove(1);
  clientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = `${c.folio} — ${c.denominacion || c.razonSocial}`;
    sel.appendChild(opt);
  });
}

/* ── SWITCH ACTIVO/INACTIVO ── */
function setupSwitch() {
  const chk = document.getElementById('field_activo');
  const lbl = document.getElementById('switchLabel');
  if (chk && lbl) {
    chk.addEventListener('change', () => {
      lbl.textContent = chk.checked ? 'Activo' : 'Inactivo';
    });
  }
}

/* ================================================================
   FILTROS
   ================================================================ */
function aplicarFiltros() {
  filtros.q      = document.getElementById('inputBuscar').value.toLowerCase().trim();
  filtros.activo = document.getElementById('selectActivo').value;
  renderSeguimientos();
}

function getFiltered() {
  return seguimientos.filter(s => {
    if (filtros.activo === 'activos'   && !s.activo) return false;
    if (filtros.activo === 'inactivos' &&  s.activo) return false;
    if (filtros.q) {
      const cliente = clientes.find(c => c.id === s.clienteId);
      const txt = [
        cliente?.denominacion, cliente?.razonSocial, cliente?.folio,
        s.nombreContacto, s.estado, s.region, s.municipio, s.estatus,
      ].filter(Boolean).join(' ').toLowerCase();
      if (!txt.includes(filtros.q)) return false;
    }
    return true;
  });
}

/* ================================================================
   RENDER
   ================================================================ */
function renderSeguimientos() {
  const container = document.getElementById('seguimientosList');
  const items     = getFiltered();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="seg-empty">
        <i class="fa-solid fa-list-check"></i>
        <p>Sin registros de seguimiento que coincidan</p>
      </div>`;
    return;
  }

  container.innerHTML = items.map((s, idx) => {
    const cliente      = clientes.find(c => c.id === s.clienteId);
    const nombreCliente = cliente?.denominacion || cliente?.razonSocial || '—';
    const delay        = (idx * 0.06).toFixed(2);

    return `
      <div class="seg-card" style="animation-delay:${delay}s">
        <div class="seg-card-body">
          <div class="seg-card-top">
            <div class="seg-info">
              <div class="seg-nombre-row">
                <span class="seg-nombre">${esc(nombreCliente)}</span>
                <span class="badge ${s.activo ? 'badge-activo' : 'badge-inactivo'}">
                  ${s.activo ? 'Activo' : 'Inactivo'}
                </span>
                ${s.estatus ? `<span class="badge badge-estatus">${esc(s.estatus)}</span>` : ''}
              </div>
              <p class="seg-geo">${esc(s.region || '—')} · ${esc(s.estado || '—')} · ${esc(s.municipio || '—')}${s.parqueIndustrial ? ' — ' + esc(s.parqueIndustrial) : ''}</p>
              <p class="seg-contacto">
                <span>Contacto:</span> <strong>${esc(s.nombreContacto || '—')}</strong>
                ${s.celular ? ` &nbsp;·&nbsp; <span class="seg-mono">${esc(s.celular)}</span>` : ''}
                ${s.correo  ? ` &nbsp;·&nbsp; <span style="font-size:12.5px">${esc(s.correo)}</span>` : ''}
              </p>
              <p class="seg-last">Último contacto: ${fmtFechaHora(s.ultimoContacto)}</p>
            </div>
            <div class="seg-actions">
              <button class="btn-action primary" onclick="abrirModalActividad('${s.id}')">
                <i class="fa-solid fa-plus"></i> Actividad
              </button>
              <button class="btn-action icon" onclick="abrirModalEditar('${s.id}')" title="Editar">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn-action icon danger" onclick="eliminarSeguimiento('${s.id}')" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        ${(s.actividades?.length ?? 0) > 0 ? renderTimeline(s.actividades) : ''}
      </div>`;
  }).join('');
}

function renderTimeline(actividades) {
  return `
    <div class="timeline-section">
      <div class="timeline-title">Línea de tiempo</div>
      <div class="timeline-list">
        ${actividades.map(a => {
          const icon = ICON_TIPO[a.tipo] ?? 'fa-comment';
          return `
            <div class="timeline-item">
              <div class="timeline-icon">
                <i class="fa-solid ${icon}"></i>
              </div>
              <div class="timeline-content">
                <div class="timeline-meta">
                  <span class="timeline-tipo">${esc(a.tipo)}</span>
                  <span>·</span>
                  <span>${fmtFechaHora(a.fecha)}</span>
                  <button class="btn-del-actividad" onclick="eliminarActividad('${a.id}')" title="Eliminar actividad">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
                ${a.descripcion ? `<p class="timeline-desc">${esc(a.descripcion)}</p>` : ''}
                ${a.resultado   ? `<p class="timeline-result">${esc(a.resultado)}</p>` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* ================================================================
   MODAL SEGUIMIENTO
   ================================================================ */
function abrirModalNuevo() {
  editingId = null;
  document.getElementById('modalSeguimientoTitle').textContent = 'Nuevo seguimiento';
  document.getElementById('formSeguimiento').reset();
  document.getElementById('seg_id').value = '';
  document.getElementById('clienteGroup').style.display = 'flex';
  document.getElementById('field_activo').checked = true;
  document.getElementById('switchLabel').textContent = 'Activo';
  document.getElementById('modalSeguimiento').classList.add('open');
}

function abrirModalEditar(id) {
  const s = seguimientos.find(x => x.id === id);
  if (!s) return;
  editingId = id;

  document.getElementById('modalSeguimientoTitle').textContent = 'Editar seguimiento';
  document.getElementById('seg_id').value                 = s.id;
  document.getElementById('clienteGroup').style.display   = 'none';
  document.getElementById('field_activo').checked         = !!s.activo;
  document.getElementById('switchLabel').textContent      = s.activo ? 'Activo' : 'Inactivo';
  document.getElementById('field_estatus').value          = s.estatus ?? '';
  document.getElementById('field_region').value           = s.region ?? '';
  document.getElementById('field_estado').value           = s.estado ?? '';
  document.getElementById('field_municipio').value        = s.municipio ?? '';
  document.getElementById('field_parqueIndustrial').value = s.parqueIndustrial ?? '';
  document.getElementById('field_nombreContacto').value   = s.nombreContacto ?? '';
  document.getElementById('field_celular').value          = s.celular ?? '';
  document.getElementById('field_correo').value           = s.correo ?? '';
  document.getElementById('modalSeguimiento').classList.add('open');
}

function cerrarModalSeg() {
  document.getElementById('modalSeguimiento').classList.remove('open');
}

async function guardarSeguimiento() {
  const datos = {
    activo:           document.getElementById('field_activo').checked,
    estatus:          document.getElementById('field_estatus').value.trim(),
    region:           document.getElementById('field_region').value.trim(),
    estado:           document.getElementById('field_estado').value,
    municipio:        document.getElementById('field_municipio').value.trim(),
    parqueIndustrial: document.getElementById('field_parqueIndustrial').value.trim(),
    nombreContacto:   document.getElementById('field_nombreContacto').value.trim(),
    celular:          document.getElementById('field_celular').value.trim(),
    correo:           document.getElementById('field_correo').value.trim(),
  };

  let j;
  if (editingId) {
    j = await apiPut(`/ventas/api/seguimientos/${editingId}`, datos);
  } else {
    const clienteId = document.getElementById('field_clienteId').value;
    if (!clienteId) { showToast('Selecciona un cliente', 'error'); return; }
    j = await apiPost('/ventas/api/seguimientos', { clienteId, ...datos });
  }

  if (j.ok) {
    showToast(editingId ? 'Seguimiento actualizado' : 'Seguimiento creado', 'success');
    cerrarModalSeg();
    await recargarSeguimientos();
  } else {
    showToast(j.msg ?? 'Error al guardar', 'error');
  }
}

async function eliminarSeguimiento(id) {
  if (!confirm('¿Eliminar este registro de seguimiento?')) return;
  const j = await apiDelete(`/ventas/api/seguimientos/${id}`);
  if (j.ok) {
    showToast('Registro eliminado', 'success');
    await recargarSeguimientos();
  } else {
    showToast(j.msg ?? 'Error al eliminar', 'error');
  }
}

/* ================================================================
   MODAL ACTIVIDAD
   ================================================================ */
function abrirModalActividad(segId) {
  actTargetId = segId;
  const now   = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  document.getElementById('act_tipo').value        = 'llamada';
  document.getElementById('act_fecha').value       = local;
  document.getElementById('act_descripcion').value = '';
  document.getElementById('act_resultado').value   = '';
  document.getElementById('act_crearEvento').checked = true;
  document.getElementById('act_crearEventoLabel').textContent = 'Agregar al calendario';
  document.getElementById('modalActividad').classList.add('open');
}

function cerrarModalAct() {
  document.getElementById('modalActividad').classList.remove('open');
  actTargetId = null;
}

async function guardarActividad() {
  if (!actTargetId) return;

  const crearEvento = document.getElementById('act_crearEvento').checked;
  const datos = {
    tipo:         document.getElementById('act_tipo').value,
    fecha:        document.getElementById('act_fecha').value,
    descripcion:  document.getElementById('act_descripcion').value.trim(),
    resultado:    document.getElementById('act_resultado').value.trim(),
    crearEvento,
  };

  const j = await apiPost(`/ventas/api/seguimientos/${actTargetId}/actividades`, datos);
  if (j.ok) {
    cerrarModalAct();
    const msg = j.eventoCreado ? 'Actividad y evento en calendario registrados' : 'Actividad registrada';
    showToast(msg, 'success');
    await recargarSeguimientos();
  } else {
    showToast(j.msg ?? 'Error al registrar actividad', 'error');
  }
}

async function eliminarActividad(actId) {
  if (!confirm('¿Eliminar esta actividad?')) return;
  const j = await apiDelete(`/ventas/api/actividades/${actId}`);
  if (j.ok) {
    showToast('Actividad eliminada', 'success');
    await recargarSeguimientos();
  } else {
    showToast(j.msg ?? 'Error al eliminar actividad', 'error');
  }
}

/* ================================================================
   EXPORTAR CSV
   ================================================================ */
function exportarCSV() {
  const items   = getFiltered();
  const headers = ['Cliente','Activo','Estatus','Region','Estado','Municipio','Parque Industrial','Contacto','Celular','Correo','Ultimo Contacto','Total Actividades'];
  const rows    = items.map(s => {
    const cliente = clientes.find(c => c.id === s.clienteId);
    return [
      cliente?.denominacion || cliente?.razonSocial || '', s.activo ? 'Sí' : 'No', s.estatus ?? '',
      s.region ?? '', s.estado ?? '', s.municipio ?? '', s.parqueIndustrial ?? '',
      s.nombreContacto ?? '', s.celular ?? '', s.correo ?? '',
      fmtFechaHora(s.ultimoContacto), (s.actividades ?? []).length,
    ];
  });
  const csv  = headers.join(',') + '\n' + rows.map(r => r.map(v => `"${String(v || '').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `seguimiento_${Date.now()}.csv`; a.click();
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
   UTILIDADES
   ================================================================ */
function fmtFechaHora(d) {
  if (!d) return '—';
  try {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return String(d); }
}

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${esc(msg)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
