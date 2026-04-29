/* ============================================================
   CRM Ventas — Calendario de Actividades
   Quality Bolca | 2026
   ============================================================ */

'use strict';

/* ── CONSTANTES ── */
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const COLOR_EVENTO = {
  'visita':  '#007AFF',
  'reunión': '#34C759',
  'llamada': '#FF9500',
  'otro':    '#AF52DE',
};

/* ── ESTADO ── */
const hoy       = new Date();
let clientes    = [];
let eventos     = [];
let vistaActual = 'mes';
let cursor      = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
let editingId   = null;

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
    const [rCli, rEv] = await Promise.all([
      fetch('/ventas/api/clientes', { headers: { 'X-CSRF-Token': window._tok } }),
      fetch('/ventas/api/eventos',  { headers: { 'X-CSRF-Token': window._tok } }),
    ]);
    const jCli = await rCli.json();
    const jEv  = await rEv.json();
    if (jCli.token) window._tok = jCli.token;
    if (jEv.token)  window._tok = jEv.token;

    if (jCli.ok) clientes = jCli.data;
    if (jEv.ok)  eventos  = jEv.data;

    populateClienteSelect();
    renderCalendario();
  } catch (e) {
    showToast('Error de conexión', 'error');
  }
}

async function recargarEventos() {
  try {
    const r = await fetch('/ventas/api/eventos', { headers: { 'X-CSRF-Token': window._tok } });
    const j = await r.json();
    if (j.token) window._tok = j.token;
    if (j.ok) eventos = j.data;
    renderCalendario();
  } catch (e) {
    showToast('Error de conexión', 'error');
  }
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initUserChip();
  setDefaultFecha();
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

/* ── POBLAR SELECT CLIENTE EN MODAL ── */
function populateClienteSelect() {
  const sel = document.getElementById('field_clienteId');
  while (sel.options.length > 1) sel.remove(1);
  clientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = c.denominacion || c.razonSocial;
    sel.appendChild(opt);
  });
}

function setDefaultFecha() {
  document.getElementById('field_fecha').value = hoy.toISOString().slice(0, 10);
}

/* ================================================================
   NAVEGACIÓN
   ================================================================ */
function navCal(delta) {
  if (vistaActual === 'mes') {
    cursor.setMonth(cursor.getMonth() + delta);
  } else {
    cursor.setDate(cursor.getDate() + delta * 7);
  }
  renderCalendario();
}

function irHoy() {
  cursor = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  if (vistaActual === 'semana') {
    cursor = new Date(hoy);
    cursor.setDate(hoy.getDate() - hoy.getDay());
  }
  renderCalendario();
}

function setView(v) {
  vistaActual = v;
  document.getElementById('vistaMes').style.display    = v === 'mes'    ? 'block' : 'none';
  document.getElementById('vistaSemana').style.display = v === 'semana' ? 'block' : 'none';
  document.getElementById('btnMes').classList.toggle('active', v === 'mes');
  document.getElementById('btnSemana').classList.toggle('active', v === 'semana');

  if (v === 'semana') {
    cursor.setDate(cursor.getDate() - cursor.getDay());
  } else {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  }
  renderCalendario();
}

/* ================================================================
   RENDER PRINCIPAL
   ================================================================ */
function renderCalendario() {
  if (vistaActual === 'mes') renderMes();
  else renderSemana();
}

/* ── VISTA MES ── */
function renderMes() {
  document.getElementById('calTitle').textContent = `${MESES[cursor.getMonth()]} ${cursor.getFullYear()}`;

  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const grid = document.getElementById('monthGrid');
  grid.innerHTML = '';

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const isCurrentMonth = d.getMonth() === cursor.getMonth();
    const isToday        = d.toDateString() === hoy.toDateString();
    const evs            = getEventsForDay(d);
    const dateIso        = d.toISOString().slice(0, 10);

    const cell = document.createElement('div');
    cell.className = 'cal-day-cell' + (!isCurrentMonth ? ' other-month' : '');
    cell.onclick = () => abrirModalNuevo(dateIso);

    const numEl = document.createElement('div');
    if (isToday) {
      numEl.innerHTML = `<span class="cal-day-num today-num">${d.getDate()}</span>`;
    } else {
      numEl.className = 'cal-day-num';
      numEl.textContent = d.getDate();
    }
    cell.appendChild(numEl);

    if (evs.length > 0) {
      const evContainer = document.createElement('div');
      evContainer.className = 'cal-events';
      evs.slice(0, 3).forEach(ev => {
        const chip  = document.createElement('div');
        chip.className = 'cal-event-chip';
        const color = COLOR_EVENTO[ev.tipo] ?? '#007AFF';
        chip.style.background = color + '25';
        chip.style.color      = color;
        chip.textContent = `${ev.horaInicio} ${ev.titulo}`;
        chip.onclick = (e) => { e.stopPropagation(); abrirModalEditar(ev.id); };
        evContainer.appendChild(chip);
      });
      if (evs.length > 3) {
        const more = document.createElement('div');
        more.className   = 'cal-more';
        more.textContent = `+${evs.length - 3} más`;
        evContainer.appendChild(more);
      }
      cell.appendChild(evContainer);
    }

    grid.appendChild(cell);
  }
}

/* ── VISTA SEMANA ── */
function renderSemana() {
  const weekStart = new Date(cursor);
  weekStart.setDate(cursor.getDate() - cursor.getDay());

  document.getElementById('calTitle').textContent = `Semana del ${weekStart.getDate()} ${MESES[weekStart.getMonth()]}`;

  const grid = document.getElementById('weekGrid');
  grid.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const d       = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const isToday = d.toDateString() === hoy.toDateString();
    const evs     = getEventsForDay(d);
    const dateIso = d.toISOString().slice(0, 10);

    const col = document.createElement('div');
    col.className = 'cal-week-col';
    col.innerHTML = `
      <div class="cal-week-col-header">
        <div class="cal-week-dow">${DIAS[d.getDay()]}</div>
        <div class="cal-week-day-num ${isToday ? 'today-week' : ''}">${d.getDate()}</div>
      </div>
      <div class="cal-week-events" id="wevents_${i}"></div>
      <button class="cal-add-btn" onclick="abrirModalNuevo('${dateIso}')">+ Agregar</button>`;

    grid.appendChild(col);

    const evContainer = document.getElementById(`wevents_${i}`);
    evs.forEach(ev => {
      const color   = COLOR_EVENTO[ev.tipo] ?? '#007AFF';
      const cliente = clientes.find(c => c.id === ev.clienteId);
      const evEl    = document.createElement('div');
      evEl.className      = 'cal-week-event';
      evEl.style.background = color + '20';
      evEl.onclick = () => abrirModalEditar(ev.id);
      evEl.innerHTML = `
        <div class="cal-week-event-time" style="color:${color}">${ev.horaInicio} — ${ev.horaFin}</div>
        <div class="cal-week-event-title">${esc(ev.titulo)}</div>
        ${cliente ? `<div class="cal-week-event-client">${esc(cliente.denominacion || cliente.razonSocial)}</div>` : ''}`;
      evContainer.appendChild(evEl);
    });
  }
}

/* ── HELPER ── */
function getEventsForDay(d) {
  const k = d.toDateString();
  // ev.fecha puede llegar como '2026-04-27' (string DATEONLY) o como
  // '2026-04-27T00:00:00.000Z' (Date serializado por mysql2 >=3).
  // Tomamos solo los primeros 10 chars para normalizar ambos casos
  // antes de construir la fecha local con T00:00:00.
  return eventos.filter(ev => {
    const fechaStr = String(ev.fecha).substring(0, 10);
    return new Date(fechaStr + 'T00:00:00').toDateString() === k;
  }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

/* ================================================================
   MODAL
   ================================================================ */
function abrirModalNuevo(fecha) {
  editingId = null;
  document.getElementById('modalTitle').textContent       = 'Nuevo evento';
  document.getElementById('formEvento').reset();
  document.getElementById('evento_id').value              = '';
  document.getElementById('field_tipo').value             = 'visita';
  document.getElementById('field_estado').value           = 'programada';
  document.getElementById('field_horaInicio').value       = '09:00';
  document.getElementById('field_horaFin').value          = '10:00';
  document.getElementById('field_fecha').value            = fecha ?? hoy.toISOString().slice(0, 10);
  document.getElementById('modalDeleteBtn').innerHTML     = '';
  document.getElementById('modalEvento').classList.add('open');
}

function abrirModalEditar(id) {
  const ev = eventos.find(x => x.id === id);
  if (!ev) return;
  editingId = id;

  document.getElementById('modalTitle').textContent  = 'Editar evento';
  document.getElementById('evento_id').value         = ev.id;
  document.getElementById('field_titulo').value      = ev.titulo ?? '';
  document.getElementById('field_tipo').value        = ev.tipo ?? 'visita';
  document.getElementById('field_clienteId').value   = ev.clienteId ?? '';
  document.getElementById('field_fecha').value       = ev.fecha;
  document.getElementById('field_estado').value      = ev.estado ?? 'programada';
  document.getElementById('field_horaInicio').value  = ev.horaInicio ?? '09:00';
  document.getElementById('field_horaFin').value     = ev.horaFin ?? '10:00';
  document.getElementById('field_ubicacion').value   = ev.ubicacion ?? '';
  document.getElementById('field_notas').value       = ev.notas ?? '';

  document.getElementById('modalDeleteBtn').innerHTML = `
    <button class="btn btn-sm" style="color:var(--red);background:rgba(255,59,48,.08);border:none;"
      onclick="eliminarEvento('${id}');cerrarModal();">
      <i class="fa-solid fa-trash"></i> Eliminar
    </button>`;

  document.getElementById('modalEvento').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modalEvento').classList.remove('open');
}

async function guardarEvento() {
  const titulo = document.getElementById('field_titulo').value.trim();
  if (!titulo) { showToast('Título requerido', 'error'); return; }

  const datos = {
    titulo,
    tipo:       document.getElementById('field_tipo').value,
    clienteId:  document.getElementById('field_clienteId').value || null,
    fecha:      document.getElementById('field_fecha').value,
    estado:     document.getElementById('field_estado').value,
    horaInicio: document.getElementById('field_horaInicio').value,
    horaFin:    document.getElementById('field_horaFin').value,
    ubicacion:  document.getElementById('field_ubicacion').value.trim(),
    notas:      document.getElementById('field_notas').value.trim(),
  };

  const j = editingId
    ? await apiPut(`/ventas/api/eventos/${editingId}`, datos)
    : await apiPost('/ventas/api/eventos', datos);

  if (j.ok) {
    showToast(editingId ? 'Evento actualizado' : 'Evento creado', 'success');
    cerrarModal();
    await recargarEventos();
  } else {
    showToast(j.msg ?? 'Error al guardar', 'error');
  }
}

async function eliminarEvento(id) {
  if (!confirm('¿Eliminar este evento?')) return;
  const j = await apiDelete(`/ventas/api/eventos/${id}`);
  if (j.ok) {
    showToast('Evento eliminado', 'success');
    await recargarEventos();
  } else {
    showToast(j.msg ?? 'Error al eliminar', 'error');
  }
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
   TOAST / UTILS
   ================================================================ */
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

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
