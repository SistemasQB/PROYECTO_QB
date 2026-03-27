// ─── DATOS ESTÁTICOS (simulados desde backend) ───────────────────────────────

const REGIONES = [
  "AGUASCALIENTES","CD JUAREZ","CELAYA","HONDA","LINARES","MONTERREY","QUERETARO","REYNOSA","SALTILLO","SAN LUIS POTOSI","SILAO","ZACATECAS"];

  // ─── DATOS ESTÁTICOS (simulados desde backend) ───────────────────────────────
 
// Catálogo de empleados (viene de tu backend)
const CATALOGO_EMPLEADOS = [
  { codigoempleado:"10011", name:"GONZALEZ GUTIERREZ MARIA GUADALUPE",  correo:"maria.gonzalez@qualitybolca.com",    departamentoLocal:"CAPTURACION",  descripcion:"Auxiliar de Captura de Datos" },
  { codigoempleado:"10022", name:"RAMIREZ LOPEZ CARLOS ALBERTO",        correo:"carlos.ramirez@qualitybolca.com",    departamentoLocal:"SISTEMAS",      descripcion:"Analista de Sistemas" },
  { codigoempleado:"10033", name:"TORRES SANCHEZ ELENA PATRICIA",       correo:"elena.torres@qualitybolca.com",      departamentoLocal:"CALIDAD",       descripcion:"Inspector de Calidad" },
  { codigoempleado:"10044", name:"HERRERA RUIZ FERNANDO JOSE",          correo:"fernando.herrera@qualitybolca.com",  departamentoLocal:"PRODUCCION",    descripcion:"Supervisor de Producción" },
  { codigoempleado:"10055", name:"MENDOZA VEGA GABRIELA CRISTINA",      correo:"gabriela.mendoza@qualitybolca.com",  departamentoLocal:"LOGISTICA",     descripcion:"Coordinadora Logística" },
  { codigoempleado:"10066", name:"CASTILLO PEREZ HUGO ENRIQUE",         correo:"hugo.castillo@qualitybolca.com",     departamentoLocal:"MANTENIMIENTO", descripcion:"Técnico de Mantenimiento" },
  { codigoempleado:"10077", name:"ORTEGA JIMENEZ KAREN LIZETH",         correo:"karen.ortega@qualitybolca.com",      departamentoLocal:"RRHH",          descripcion:"Analista de Recursos Humanos" },
  { codigoempleado:"10088", name:"SALINAS NUÑEZ LUIS ANTONIO",          correo:"luis.salinas@qualitybolca.com",      departamentoLocal:"CONTABILIDAD",  descripcion:"Contador General" },
  { codigoempleado:"10099", name:"ESPINOZA VARGAS MARIA FERNANDA",      correo:"mfernanda.espinoza@qualitybolca.com",departamentoLocal:"CAPTURACION",   descripcion:"Capturista Senior" },
  { codigoempleado:"10110", name:"RIOS CARRASCO NICOLAS ALEJANDRO",     correo:"nicolas.rios@qualitybolca.com",      departamentoLocal:"SISTEMAS",      descripcion:"Desarrollador Backend" },
  { codigoempleado:"10121", name:"ROMERO FUENTES OLIVIA DEL CARMEN",    correo:"olivia.romero@qualitybolca.com",     departamentoLocal:"VENTAS",        descripcion:"Ejecutiva de Ventas" },
  { codigoempleado:"10132", name:"GUERRERO DIAZ PABLO CESAR",           correo:"pablo.guerrero@qualitybolca.com",    departamentoLocal:"PRODUCCION",    descripcion:"Operador de Línea" },
  { codigoempleado:"10143", name:"CRUZ AGUILAR RENATA ISABEL",          correo:"renata.cruz@qualitybolca.com",       departamentoLocal:"CALIDAD",       descripcion:"Auditora de Calidad" },
  { codigoempleado:"10154", name:"LARA MONTES SEBASTIAN RODRIGO",       correo:"sebastian.lara@qualitybolca.com",    departamentoLocal:"SISTEMAS",      descripcion:"Administrador de Redes" },
  { codigoempleado:"10165", name:"ACOSTA BLANCO VALENTINA SOFIA",       correo:"valentina.acosta@qualitybolca.com",  departamentoLocal:"LOGISTICA",     descripcion:"Asistente de Logística" },
];
 


 
// ─── UTILIDADES DE permisosCaptura ───────────────────────────────────────────
// Formato: ["honda varios", "toyota aptiv"]  →  { region, tipo }[]
function parsePermisos(permisosCaptura) {
  return permisosCaptura.map(p => {
    const parts = p.trim().split(' ');
    const tipo  = parts.pop();          // última palabra = tipo
    const region = parts.join(' ');     // el resto = región (puede tener espacios)
    return { region, tipo };
  });
}
 
// Construye el array permisosCaptura desde pares { region, tipo }[]
function buildPermisos(pares) {
  return pares.map(({ region, tipo }) => `${region} ${tipo}`);
}
 
// ─── ESTADO ─────────────────────────────────────────────────────────────────
// Empleados que ya tienen permisos (simulados desde backend)
// La llave de identidad es codigoempleado
let members = [
  {
    codigoempleado:"10011", name:"GONZALEZ GUTIERREZ MARIA GUADALUPE",
    correo:"maria.gonzalez@qualitybolca.com", departamentoLocal:"CAPTURACION",
    descripcion:"Auxiliar de Captura de Datos",
    permisosCaptura:["honda varios","toyota aptiv"],
    date:"2024-11-10"
  },
  {
    codigoempleado:"10022", name:"RAMIREZ LOPEZ CARLOS ALBERTO",
    correo:"carlos.ramirez@qualitybolca.com", departamentoLocal:"SISTEMAS",
    descripcion:"Analista de Sistemas",
    permisosCaptura:["nissan varios"],
    date:"2024-11-15"
  },
  {
    codigoempleado:"10033", name:"TORRES SANCHEZ ELENA PATRICIA",
    correo:"elena.torres@qualitybolca.com", departamentoLocal:"CALIDAD",
    descripcion:"Inspector de Calidad",
    permisosCaptura:["bmw aptiv","ford varios"],
    date:"2024-12-01"
  },
  {
    codigoempleado:"10044", name:"HERRERA RUIZ FERNANDO JOSE",
    correo:"fernando.herrera@qualitybolca.com", departamentoLocal:"PRODUCCION",
    descripcion:"Supervisor de Producción",
    permisosCaptura:["volkswagen aptiv"],
    date:"2025-01-08"
  },
  {
    codigoempleado:"10055", name:"MENDOZA VEGA GABRIELA CRISTINA",
    correo:"gabriela.mendoza@qualitybolca.com", departamentoLocal:"LOGISTICA",
    descripcion:"Coordinadora Logística",
    permisosCaptura:["chevrolet varios","mazda varios"],
    date:"2025-01-22"
  },
  {
    codigoempleado:"10066", name:"CASTILLO PEREZ HUGO ENRIQUE",
    correo:"hugo.castillo@qualitybolca.com", departamentoLocal:"MANTENIMIENTO",
    descripcion:"Técnico de Mantenimiento",
    permisosCaptura:["hyundai aptiv"],
    date:"2025-02-03"
  },
  {
    codigoempleado:"10077", name:"ORTEGA JIMENEZ KAREN LIZETH",
    correo:"karen.ortega@qualitybolca.com", departamentoLocal:"RRHH",
    descripcion:"Analista de Recursos Humanos",
    permisosCaptura:["kia varios"],
    date:"2025-02-14"
  },
  {
    codigoempleado:"10088", name:"SALINAS NUÑEZ LUIS ANTONIO",
    correo:"luis.salinas@qualitybolca.com", departamentoLocal:"CONTABILIDAD",
    descripcion:"Contador General",
    permisosCaptura:["honda aptiv","nissan varios"],
    date:"2025-03-01"
  },
];
 
let sortKey = 'name', sortAsc = true;
let editingCodigo = null, deleteCodigo = null;
let page = 1, perPage = 7;
 
// ─── INICIALIZAR ─────────────────────────────────────────────────────────────
function init() {
  // Poblar filtro de región
  const fr = document.getElementById('filterRegion');
  REGIONES.forEach(r => { const o = document.createElement('option'); o.value=r; o.textContent=r; fr.appendChild(o); });
 
  // Poblar select de persona en modal (solo los que NO tienen permisos aún)
  populatePersonSelect();
 
  // Poblar select de región en modal
  const fre = document.getElementById('fieldRegion');
  REGIONES.forEach(r => { const o = document.createElement('option'); o.value=r; o.textContent=r; fre.appendChild(o); });
 
  renderTable();
}
 
function populatePersonSelect() {
  const fp = document.getElementById('fieldPerson');
  // Limpiar opciones existentes excepto el placeholder
  fp.innerHTML = '<option value="">— Selecciona una persona —</option>';
  const codigosConPermisos = new Set(members.map(m => m.codigoempleado));
  CATALOGO_EMPLEADOS
    .filter(e => !codigosConPermisos.has(e.codigoempleado))
    .forEach(e => {
      const o = document.createElement('option');
      o.value = e.codigoempleado;
      o.textContent = `${e.name} (${e.codigoempleado})`;
      fp.appendChild(o);
    });
}
 
// ─── RENDER ─────────────────────────────────────────────────────────────────
 
// Aplanar: cada entrada de permisosCaptura genera una "fila virtual" para filtros
function getFiltered() {
  const q  = document.getElementById('searchInput').value.toLowerCase();
  const fr = document.getElementById('filterRegion').value;
  const ft = document.getElementById('filterTipo').value;
 
  return members.filter(m => {
    const pares = parsePermisos(m.permisosCaptura);
    const matchQ = m.name.toLowerCase().includes(q) ||
                   m.correo.toLowerCase().includes(q) ||
                   m.codigoempleado.includes(q) ||
                   pares.some(p => p.region.toLowerCase().includes(q));
    const matchR = !fr || pares.some(p => p.region === fr);
    const matchT = !ft || pares.some(p => p.tipo === ft);
    return matchQ && matchR && matchT;
  });
}
 
function renderTable() {
  let data = getFiltered();
 
  // Ordenamiento
  data.sort((a, b) => {
    let av, bv;
    if (sortKey === 'region') {
      av = parsePermisos(a.permisosCaptura).map(p=>p.region).join();
      bv = parsePermisos(b.permisosCaptura).map(p=>p.region).join();
    } else if (sortKey === 'tipo') {
      av = parsePermisos(a.permisosCaptura).map(p=>p.tipo).join();
      bv = parsePermisos(b.permisosCaptura).map(p=>p.tipo).join();
    } else {
      av = a[sortKey] || '';
      bv = b[sortKey] || '';
    }
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });
 
  updateStats();
 
  const total = data.length;
  const pages = Math.ceil(total / perPage) || 1;
  if (page > pages) page = pages;
  const slice = data.slice((page-1)*perPage, page*perPage);
 
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
 
  if (slice.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = '';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = slice.map(m => {
      console.log(m);
      const pares = parsePermisos(m.permisosCaptura);
      const regionesHTML = pares.map(p => `<span class="region-pill">${p.region}</span>`).join(' ');
      const tiposHTML    = pares.map(p => `<span class="tag tag-${p.tipo}">${p.tipo}</span>`).join(' ');
      return `
        <tr>
          <td>
            <div class="cell-name">
              <div class="avatar" style="background:${avatarBg(m.name)};color:#fff">${initials(m.name)}</div>
              <div>
                <div class="name-full">${m.name}</div>
                <div class="name-email">${m.correo} &nbsp;·&nbsp; ${m.codigoempleado}</div>
              </div>
            </div>
          </td>
          <td class="hide-sm">${regionesHTML}</td>
          <td>${tiposHTML}</td>
          
          <td>
            <div class="actions-cell" style="justify-content:flex-end">
              <button class="btn btn-ghost btn-sm" onclick="openModal('edit','${m.codigoempleado}')">✏️ Editar</button>
              <button class="btn btn-danger btn-sm" onclick="askDelete('${m.codigoempleado}')">🗑</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    //<td class="hide-md" style="color:var(--muted);font-size:12px">${fmtDate(m.date)}</td>
  }
 console.log('va a renderizar');
  renderPagination(total, pages);
}
 
function renderPagination(total, pages) {
  const pg = document.getElementById('pagination');
  const start = (page-1)*perPage + 1;
  const end = Math.min(page*perPage, total);
  pg.innerHTML = `
    <span class="page-info">${total === 0 ? 'Sin resultados' : `${start}–${end} de ${total}`}</span>
    <div class="page-btns">
      <button class="page-btn" onclick="goPage(${page-1})" ${page<=1?'disabled':''}>‹</button>
      ${Array.from({length:pages},(_,i)=>`<button class="page-btn ${i+1===page?'active':''}" onclick="goPage(${i+1})">${i+1}</button>`).join('')}
      <button class="page-btn" onclick="goPage(${page+1})" ${page>=pages?'disabled':''}>›</button>
    </div>
  `;
}
 
function goPage(p) { if(p<1||p>Math.ceil(getFiltered().length/perPage)) return; page=p; renderTable(); }
 
function updateStats() {
  const all = members;
  // Aplanar todos los permisosCaptura
  const todosLosPares = all.flatMap(m => parsePermisos(m.permisosCaptura));
  document.getElementById('statTotal').textContent   = all.length;
  document.getElementById('statAptiv').textContent   = todosLosPares.filter(p=>p.tipo==='aptiv').length;
  document.getElementById('statVarios').textContent  = todosLosPares.filter(p=>p.tipo==='varios').length;
  document.getElementById('statRegions').textContent = new Set(todosLosPares.map(p=>p.region)).size;
  document.getElementById('totalBadge').textContent  = all.length + ' miembros';
}
 
function sortBy(key) {
  if (sortKey === key) sortAsc = !sortAsc; else { sortKey=key; sortAsc=true; }
  renderTable();
}
 
// ─── MODAL: lógica de permisos múltiples ─────────────────────────────────────
// En edición, el usuario ve TODOS sus permisosCaptura y puede agregar/quitar pares
 
let permisosTemp = []; // [{ region, tipo }]
 
function renderPermisosEditor() {
  const container = document.getElementById('permisosEditor');
  if (permisosTemp.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);font-size:12px;text-align:center;padding:8px 0">Sin permisos asignados aún.</p>';
    return;
  }
  container.innerHTML = permisosTemp.map((p, i) => `
    <div style="display:flex;align-items:center;gap:8px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:6px">
      <span class="region-pill" style="flex:1">${p.region}</span>
      <span class="tag tag-${p.tipo}">${p.tipo}</span>
      <button class="btn btn-danger btn-sm btn-icon" onclick="removePermiso(${i})" title="Quitar">✕</button>
    </div>
  `).join('');
}
 
function removePermiso(idx) {
  permisosTemp.splice(idx, 1);
  renderPermisosEditor();
}
 
function addPermiso() {
  const region = document.getElementById('fieldRegion').value;
  const aptiv  = document.getElementById('checkAptiv').checked;
  const varios = document.getElementById('checkVarios').checked;
 
  if (!region) { showToast('Selecciona una región.', 'red'); return; }
  if (!aptiv && !varios) { showToast('Elige al menos un tipo.', 'red'); return; }
 
  const tiposAAgregar = [];
  if (aptiv)  tiposAAgregar.push('aptiv');
  if (varios) tiposAAgregar.push('varios');
 
  tiposAAgregar.forEach(tipo => {
    // evitar duplicados
    if (!permisosTemp.find(p => p.region === region && p.tipo === tipo)) {
      permisosTemp.push({ region, tipo });
    }
  });
 
  // Limpiar inputs
  document.getElementById('fieldRegion').value = '';
  document.getElementById('checkAptiv').checked  = false;
  document.getElementById('checkVarios').checked = false;
  renderPermisosEditor();
}
 
function openModal(mode, codigo=null) {
  editingCodigo = mode === 'edit' ? codigo : null;
  document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Editar permisos' : 'Asignar nuevo miembro';
 
  // Mostrar/ocultar selector de persona
  document.getElementById('personRow').style.display = mode === 'add' ? '' : 'none';
 
  if (mode === 'edit') {
    const m = members.find(x => x.codigoempleado === codigo);
    // Mostrar info del empleado en el modal
    document.getElementById('editEmpleadoInfo').innerHTML = `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:4px">
        <div style="font-weight:600;font-size:14px">${m.name}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">${m.correo} &nbsp;·&nbsp; ${m.codigoempleado}</div>
        <div style="font-size:12px;color:var(--muted)">${m.descripcion} — ${m.departamentoLocal}</div>
      </div>
    `;
    document.getElementById('editEmpleadoInfo').style.display = '';
    permisosTemp = parsePermisos(m.permisosCaptura);
  } else {
    document.getElementById('editEmpleadoInfo').style.display = 'none';
    populatePersonSelect();
    permisosTemp = [];
  }
 
  // Limpiar inputs de agregar
  document.getElementById('fieldRegion').value = '';
  document.getElementById('checkAptiv').checked  = false;
  document.getElementById('checkVarios').checked = false;
 
  renderPermisosEditor();
  document.getElementById('modalOverlay').classList.add('open');
}
 
function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
}
 
function saveMember() {
  if (permisosTemp.length === 0) { showToast('Agrega al menos un permiso.', 'red'); return; }
 
  if (editingCodigo) {
    // EDITAR
    const idx = members.findIndex(m => m.codigoempleado === editingCodigo);
    members[idx].permisosCaptura = buildPermisos(permisosTemp);
    showToast('Permisos actualizados correctamente.', 'blue');
  } else {
    // AGREGAR NUEVO
    const codigoSeleccionado = document.getElementById('fieldPerson').value;
    if (!codigoSeleccionado) { showToast('Selecciona una persona.', 'red'); return; }
 
    const empleado = CATALOGO_EMPLEADOS.find(e => e.codigoempleado === codigoSeleccionado);
    members.push({
      codigoempleado:  empleado.codigoempleado,
      name:            empleado.name,
      correo:          empleado.correo,
      departamentoLocal: empleado.departamentoLocal,
      descripcion:     empleado.descripcion,
      permisosCaptura: buildPermisos(permisosTemp),
      date:            new Date().toISOString().slice(0,10)
    });
    showToast('Miembro asignado exitosamente.', 'green');
  }
 
  document.getElementById('modalOverlay').classList.remove('open');
  page = 1;
  renderTable();
}
 
// ─── ELIMINAR ────────────────────────────────────────────────────────────────
function askDelete(codigo) {
  deleteCodigo = codigo;
  const m = members.find(x => x.codigoempleado === codigo);
  document.getElementById('confirmMsg').textContent =
    `¿Eliminar todos los permisos de ${m.name}? Esta acción no se puede deshacer.`;
  document.getElementById('confirmOverlay').classList.add('open');
}
function closeConfirm(e) {
  if (e && e.target !== document.getElementById('confirmOverlay')) return;
  document.getElementById('confirmOverlay').classList.remove('open');
}
function confirmDelete() {
  members = members.filter(m => m.codigoempleado !== deleteCodigo);
  document.getElementById('confirmOverlay').classList.remove('open');
  showToast('Permisos eliminados.', 'red');
  renderTable();
}
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
function initials(name) {
  const p = name.split(' ');
  return (p[0][0] + (p[1]?p[1][0]:'')).toUpperCase();
}
const COLORS = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#ef4444'];
function avatarBg(name) { let h=0; for(let c of name) h=(h*31+c.charCodeAt(0))&0x7fffffff; return COLORS[h%COLORS.length]; }
function fmtDate(d) { const [y,m,day]=d.split('-'); const mo=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']; return `${day} ${mo[+m-1]} ${y}`; }
 
let toastTimer;
function showToast(msg, color) {
  clearTimeout(toastTimer);
  document.getElementById('toastText').textContent = msg;
  document.getElementById('toastDot').className = 'toast-dot ' + color;
  document.getElementById('toast').classList.add('show');
  toastTimer = setTimeout(() => document.getElementById('toast').classList.remove('show'), 3200);
}
 


document.addEventListener('DOMContentLoaded', () => {
  members = capts
  init();

})

