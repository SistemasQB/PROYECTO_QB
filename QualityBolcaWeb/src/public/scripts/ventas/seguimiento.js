/* ============================================================
   CRM Ventas — Seguimiento de Clientes
   Quality Bolca | 2026
   JS vanilla con datos mock. Backend se integrará después.
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

/* ── CLIENTES MOCK (simulando los que existen en el módulo de clientes) ── */
const clientes = [
  { id: 'c1', denominacion: 'Industrias Regio S.A.',          folio: 'CLI-001' },
  { id: 'c2', denominacion: 'Plásticos del Bajío',            folio: 'CLI-002' },
  { id: 'c3', denominacion: 'Electrónica del Norte',          folio: 'CLI-003' },
  { id: 'c4', denominacion: 'Empaques Monterrey',             folio: 'CLI-004' },
  { id: 'c5', denominacion: 'Logística Express MX',           folio: 'CLI-005' },
  { id: 'c6', denominacion: 'Metales Industriales Querétaro', folio: 'CLI-006' },
  { id: 'c7', denominacion: 'Alimentos Frescos Norte',        folio: 'CLI-007' },
  { id: 'c8', denominacion: 'Construcciones Regio',           folio: 'CLI-008' },
];

/* ── DATOS MOCK SEGUIMIENTOS ── */
let seguimientos = [
  {
    id: 's1',
    clienteId: 'c1',
    activo: true,
    estatus: 'En seguimiento',
    region: 'Noreste',
    estado: 'Nuevo León',
    municipio: 'Monterrey',
    parqueIndustrial: 'Parque Ind. Stiva',
    nombreContacto: 'Carlos Medina',
    celular: '(81) 1234-5678',
    correo: 'c.medina@ind-regio.com',
    ultimoContacto: '2026-04-20T10:30:00',
    actividades: [
      { id: 'a1', tipo: 'llamada', fecha: '2026-04-20T10:30:00', descripcion: 'Llamada de seguimiento mensual.', resultado: 'Cliente interesado en nueva línea de producto.' },
      { id: 'a2', tipo: 'correo', fecha: '2026-04-15T09:00:00', descripcion: 'Envío de cotización de productos.', resultado: 'Esperando respuesta.' },
    ],
  },
  {
    id: 's2',
    clienteId: 'c2',
    activo: true,
    estatus: 'Activo — visita programada',
    region: 'Centro',
    estado: 'Guanajuato',
    municipio: 'León',
    parqueIndustrial: 'P.I. Bajío',
    nombreContacto: 'Ana Torres',
    celular: '(477) 555-9900',
    correo: 'ana.torres@plastnor.mx',
    ultimoContacto: '2026-04-18T14:00:00',
    actividades: [
      { id: 'a3', tipo: 'visita', fecha: '2026-04-18T14:00:00', descripcion: 'Visita a planta para presentación de productos.', resultado: 'Se solicitó muestra de 3 productos.' },
    ],
  },
  {
    id: 's3',
    clienteId: 'c5',
    activo: false,
    estatus: 'Inactivo — sin respuesta',
    region: 'Centro',
    estado: 'Ciudad de México',
    municipio: 'Venustiano Carranza',
    parqueIndustrial: '',
    nombreContacto: 'Roberto Sánchez',
    celular: '(55) 8800-1122',
    correo: 'r.sanchez@logex.mx',
    ultimoContacto: '2026-03-05T11:00:00',
    actividades: [
      { id: 'a4', tipo: 'llamada', fecha: '2026-03-05T11:00:00', descripcion: 'Intento de contacto.', resultado: 'No contesta.' },
      { id: 'a5', tipo: 'correo', fecha: '2026-03-01T08:00:00', descripcion: 'Correo de recontacto enviado.', resultado: 'Sin respuesta.' },
    ],
  },
  {
    id: 's4',
    clienteId: 'c4',
    activo: true,
    estatus: 'Negociación activa',
    region: 'Occidente',
    estado: 'Jalisco',
    municipio: 'Guadalajara',
    parqueIndustrial: 'P.I. Sur Guadalajara',
    nombreContacto: 'María García',
    celular: '(33) 3344-5566',
    correo: 'm.garcia@empglobal.com',
    ultimoContacto: '2026-04-22T16:00:00',
    actividades: [
      { id: 'a6', tipo: 'reunión', fecha: '2026-04-22T16:00:00', descripcion: 'Reunión de negociación de precios y volúmenes.', resultado: 'Acuerdo tentativo en productos línea A.' },
      { id: 'a7', tipo: 'conferencia', fecha: '2026-04-10T10:00:00', descripcion: 'Videoconferencia con equipo de compras.', resultado: 'Se presentaron fichas técnicas.' },
    ],
  },
];

/* ── ESTADO ── */
let filtros    = { q: '', activo: 'todos' };
let editingId  = null;
let actTargetId = null;

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initUserChip();
  populateClienteSelect();
  setupSwitch();
  renderSeguimientos();
});

/* ── USER CHIP ── */
function initUserChip() {
  const nombre  = 'Vendedor QB';
  const inicial = nombre.charAt(0).toUpperCase();
  ['userAvatarSidebar','userAvatarTop'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = inicial;
  });
  const ns = document.getElementById('userNameSidebar');
  const nt = document.getElementById('userNameTop');
  if (ns) ns.textContent = nombre;
  if (nt) nt.textContent = nombre;
}

/* ── POBLAR SELECT CLIENTE ── */
function populateClienteSelect() {
  const sel = document.getElementById('field_clienteId');
  clientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.folio} — ${c.denominacion}`;
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
        cliente?.denominacion, cliente?.folio,
        s.nombreContacto, s.estado, s.region, s.municipio, s.estatus
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
  const items = getFiltered();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="seg-empty">
        <i class="fa-solid fa-list-check"></i>
        <p>Sin registros de seguimiento que coincidan</p>
      </div>`;
    return;
  }

  container.innerHTML = items.map((s, idx) => {
    const cliente = clientes.find(c => c.id === s.clienteId);
    const nombreCliente = cliente?.denominacion ?? '—';
    const delay = (idx * 0.06).toFixed(2);

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
  document.getElementById('seg_id').value                = s.id;
  document.getElementById('clienteGroup').style.display  = 'none'; // no se cambia el cliente al editar
  document.getElementById('field_activo').checked        = !!s.activo;
  document.getElementById('switchLabel').textContent     = s.activo ? 'Activo' : 'Inactivo';
  document.getElementById('field_estatus').value         = s.estatus ?? '';
  document.getElementById('field_region').value          = s.region ?? '';
  document.getElementById('field_estado').value          = s.estado ?? '';
  document.getElementById('field_municipio').value       = s.municipio ?? '';
  document.getElementById('field_parqueIndustrial').value= s.parqueIndustrial ?? '';
  document.getElementById('field_nombreContacto').value  = s.nombreContacto ?? '';
  document.getElementById('field_celular').value         = s.celular ?? '';
  document.getElementById('field_correo').value          = s.correo ?? '';
  document.getElementById('modalSeguimiento').classList.add('open');
}

function cerrarModalSeg() {
  document.getElementById('modalSeguimiento').classList.remove('open');
}

function guardarSeguimiento() {
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

  if (editingId) {
    const idx = seguimientos.findIndex(x => x.id === editingId);
    if (idx !== -1) seguimientos[idx] = { ...seguimientos[idx], ...datos };
    showToast('Seguimiento actualizado', 'success');
  } else {
    const clienteId = document.getElementById('field_clienteId').value;
    if (!clienteId) { showToast('Selecciona un cliente', 'error'); return; }
    seguimientos.push({
      id: 's' + Date.now(),
      clienteId,
      actividades: [],
      ultimoContacto: null,
      ...datos,
    });
    showToast('Seguimiento creado', 'success');
  }

  cerrarModalSeg();
  renderSeguimientos();
}

function eliminarSeguimiento(id) {
  if (!confirm('¿Eliminar este registro de seguimiento?')) return;
  seguimientos = seguimientos.filter(x => x.id !== id);
  renderSeguimientos();
  showToast('Registro eliminado', 'success');
}

/* ================================================================
   MODAL ACTIVIDAD
   ================================================================ */
function abrirModalActividad(segId) {
  actTargetId = segId;
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  document.getElementById('act_tipo').value        = 'llamada';
  document.getElementById('act_fecha').value       = local;
  document.getElementById('act_descripcion').value = '';
  document.getElementById('act_resultado').value   = '';
  document.getElementById('modalActividad').classList.add('open');
}

function cerrarModalAct() {
  document.getElementById('modalActividad').classList.remove('open');
  actTargetId = null;
}

function guardarActividad() {
  if (!actTargetId) return;
  const seg = seguimientos.find(x => x.id === actTargetId);
  if (!seg) return;

  const actividad = {
    id:          'act' + Date.now(),
    tipo:        document.getElementById('act_tipo').value,
    fecha:       document.getElementById('act_fecha').value,
    descripcion: document.getElementById('act_descripcion').value.trim(),
    resultado:   document.getElementById('act_resultado').value.trim(),
  };

  if (!seg.actividades) seg.actividades = [];
  seg.actividades.unshift(actividad);
  seg.ultimoContacto = actividad.fecha;

  cerrarModalAct();
  renderSeguimientos();
  showToast('Actividad registrada', 'success');
}

function eliminarActividad(actId) {
  if (!confirm('¿Eliminar esta actividad?')) return;
  seguimientos.forEach(s => {
    s.actividades = (s.actividades ?? []).filter(a => a.id !== actId);
  });
  renderSeguimientos();
}

/* ================================================================
   EXPORTAR CSV
   ================================================================ */
function exportarCSV() {
  const items = getFiltered();
  const headers = ['Cliente','Activo','Estatus','Region','Estado','Municipio','Parque Industrial','Contacto','Celular','Correo','Ultimo Contacto','Total Actividades'];
  const rows = items.map(s => {
    const cliente = clientes.find(c => c.id === s.clienteId);
    return [
      cliente?.denominacion ?? '', s.activo ? 'Sí' : 'No', s.estatus ?? '',
      s.region ?? '', s.estado ?? '', s.municipio ?? '', s.parqueIndustrial ?? '',
      s.nombreContacto ?? '', s.celular ?? '', s.correo ?? '',
      fmtFechaHora(s.ultimoContacto), (s.actividades ?? []).length,
    ];
  });
  let csv = headers.join(',') + '\n' + rows.map(r => r.map(v => `"${String(v || '').replace(/"/g,'""')}"`).join(',')).join('\n');
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
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${esc(msg)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
