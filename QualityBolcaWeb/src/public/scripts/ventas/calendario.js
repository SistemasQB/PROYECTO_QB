/* ============================================================
   CRM Ventas — Calendario de Actividades
   Quality Bolca | 2026
   JS vanilla con datos mock. Backend se integrará después.
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

/* ── CLIENTES MOCK ── */
const clientes = [
  { id: 'c1', denominacion: 'Industrias Regio S.A.' },
  { id: 'c2', denominacion: 'Plásticos del Bajío' },
  { id: 'c3', denominacion: 'Electrónica del Norte' },
  { id: 'c4', denominacion: 'Empaques Monterrey' },
  { id: 'c5', denominacion: 'Logística Express MX' },
  { id: 'c6', denominacion: 'Metales Industriales Querétaro' },
  { id: 'c7', denominacion: 'Alimentos Frescos Norte' },
  { id: 'c8', denominacion: 'Construcciones Regio' },
];

/* ── EVENTOS MOCK ── */
const hoy = new Date();
function dateStr(offsetDays) {
  const d = new Date(hoy);
  d.setDate(hoy.getDate() + offsetDays);
  return d.toISOString().slice(0,10);
}

let eventos = [
  { id: 'e1', titulo: 'Visita a planta Regio', tipo: 'visita', clienteId: 'c1', fecha: dateStr(0), horaInicio: '10:00', horaFin: '12:00', ubicacion: 'Parque Ind. Stiva', notas: 'Presentación de catálogo completo.', estado: 'programada' },
  { id: 'e2', titulo: 'Reunión de cierre Empaques', tipo: 'reunión', clienteId: 'c4', fecha: dateStr(0), horaInicio: '16:00', horaFin: '17:30', ubicacion: 'Oficina cliente', notas: '', estado: 'programada' },
  { id: 'e3', titulo: 'Llamada de seguimiento Plásticos', tipo: 'llamada', clienteId: 'c2', fecha: dateStr(1), horaInicio: '09:00', horaFin: '09:30', ubicacion: '', notas: 'Confirmar muestras enviadas.', estado: 'programada' },
  { id: 'e4', titulo: 'Conferencia Metales QRO', tipo: 'otro', clienteId: 'c6', fecha: dateStr(2), horaInicio: '11:00', horaFin: '12:00', ubicacion: 'Teams', notas: '', estado: 'programada' },
  { id: 'e5', titulo: 'Visita feria industrial', tipo: 'visita', clienteId: '', fecha: dateStr(4), horaInicio: '09:00', horaFin: '14:00', ubicacion: 'CINTERMEX MTY', notas: 'Asistir con catálogos y muestras.', estado: 'programada' },
  { id: 'e6', titulo: 'Revisión de contrato Alimentos', tipo: 'reunión', clienteId: 'c7', fecha: dateStr(-3), horaInicio: '10:00', horaFin: '11:00', ubicacion: 'Oficina QB', notas: '', estado: 'realizada' },
  { id: 'e7', titulo: 'Llamada de cobranza', tipo: 'llamada', clienteId: 'c5', fecha: dateStr(-1), horaInicio: '14:00', horaFin: '14:30', ubicacion: '', notas: '', estado: 'realizada' },
  { id: 'e8', titulo: 'Capacitación a cliente Electrónica', tipo: 'visita', clienteId: 'c3', fecha: dateStr(7), horaInicio: '08:00', horaFin: '13:00', ubicacion: 'Planta León', notas: 'Llevar manual técnico.', estado: 'programada' },
];

/* ── ESTADO ── */
let vistaActual = 'mes';
let cursor = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
let editingId = null;

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initUserChip();
  populateClienteSelect();
  setDefaultFecha();
  renderCalendario();
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

/* ── POBLAR SELECT CLIENTE EN MODAL ── */
function populateClienteSelect() {
  const sel = document.getElementById('field_clienteId');
  clientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.denominacion;
    sel.appendChild(opt);
  });
}

function setDefaultFecha() {
  document.getElementById('field_fecha').value = hoy.toISOString().slice(0,10);
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
    // Llevar cursor al inicio de la semana que contiene el cursor
    cursor.setDate(cursor.getDate() - cursor.getDay());
  } else {
    // Volver a primer día del mes
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
  const title = `${MESES[cursor.getMonth()]} ${cursor.getFullYear()}`;
  document.getElementById('calTitle').textContent = title;

  const first  = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start  = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const grid = document.getElementById('monthGrid');
  grid.innerHTML = '';

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const isCurrentMonth = d.getMonth() === cursor.getMonth();
    const isToday = d.toDateString() === hoy.toDateString();
    const evs = getEventsForDay(d);
    const dateIso = d.toISOString().slice(0,10);

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
      const visible = evs.slice(0, 3);
      visible.forEach(ev => {
        const chip = document.createElement('div');
        chip.className = 'cal-event-chip';
        const color = COLOR_EVENTO[ev.tipo] ?? '#007AFF';
        chip.style.background = color + '25';
        chip.style.color = color;
        chip.textContent = `${ev.horaInicio} ${ev.titulo}`;
        chip.onclick = (e) => { e.stopPropagation(); abrirModalEditar(ev.id); };
        evContainer.appendChild(chip);
      });
      if (evs.length > 3) {
        const more = document.createElement('div');
        more.className = 'cal-more';
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

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const title = `Semana del ${weekStart.getDate()} ${MESES[weekStart.getMonth()]}`;
  document.getElementById('calTitle').textContent = title;

  const grid = document.getElementById('weekGrid');
  grid.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const isToday = d.toDateString() === hoy.toDateString();
    const evs = getEventsForDay(d);
    const dateIso = d.toISOString().slice(0,10);

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
      const color = COLOR_EVENTO[ev.tipo] ?? '#007AFF';
      const cliente = clientes.find(c => c.id === ev.clienteId);
      const evEl = document.createElement('div');
      evEl.className = 'cal-week-event';
      evEl.style.background = color + '20';
      evEl.onclick = () => abrirModalEditar(ev.id);
      evEl.innerHTML = `
        <div class="cal-week-event-time" style="color:${color}">${ev.horaInicio} — ${ev.horaFin}</div>
        <div class="cal-week-event-title">${esc(ev.titulo)}</div>
        ${cliente ? `<div class="cal-week-event-client">${esc(cliente.denominacion)}</div>` : ''}`;
      evContainer.appendChild(evEl);
    });
  }
}

/* ── HELPERS ── */
function getEventsForDay(d) {
  const k = d.toISOString().slice(0,10);
  return eventos.filter(ev => ev.fecha === k).sort((a,b) => a.horaInicio.localeCompare(b.horaInicio));
}

/* ================================================================
   MODAL
   ================================================================ */
function abrirModalNuevo(fecha) {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Nuevo evento';
  document.getElementById('formEvento').reset();
  document.getElementById('evento_id').value     = '';
  document.getElementById('field_tipo').value    = 'visita';
  document.getElementById('field_estado').value  = 'programada';
  document.getElementById('field_horaInicio').value = '09:00';
  document.getElementById('field_horaFin').value    = '10:00';
  document.getElementById('field_fecha').value   = fecha ?? hoy.toISOString().slice(0,10);
  document.getElementById('modalDeleteBtn').innerHTML = '';
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

function guardarEvento() {
  const titulo = document.getElementById('field_titulo').value.trim();
  if (!titulo) { showToast('Título requerido', 'error'); return; }

  const datos = {
    titulo,
    tipo:       document.getElementById('field_tipo').value,
    clienteId:  document.getElementById('field_clienteId').value || '',
    fecha:      document.getElementById('field_fecha').value,
    estado:     document.getElementById('field_estado').value,
    horaInicio: document.getElementById('field_horaInicio').value,
    horaFin:    document.getElementById('field_horaFin').value,
    ubicacion:  document.getElementById('field_ubicacion').value.trim(),
    notas:      document.getElementById('field_notas').value.trim(),
  };

  if (editingId) {
    const idx = eventos.findIndex(x => x.id === editingId);
    if (idx !== -1) eventos[idx] = { ...eventos[idx], ...datos };
    showToast('Evento actualizado', 'success');
  } else {
    datos.id = 'e' + Date.now();
    eventos.push(datos);
    showToast('Evento creado', 'success');
  }

  cerrarModal();
  renderCalendario();
}

function eliminarEvento(id) {
  if (!confirm('¿Eliminar este evento?')) return;
  eventos = eventos.filter(x => x.id !== id);
  renderCalendario();
  showToast('Evento eliminado', 'success');
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
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> ${esc(msg)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
