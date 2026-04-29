/* ============================================================
   AVATAR
   ============================================================ */
function generarAvatar() {
    const avatar = document.getElementById("avatarUsuario")
    if (!avatar) return
    const partes = nombreUsuario.split(" ")
    const iniciales = (partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')
    const colores = ["#2563eb","#7c3aed","#db2777","#ea580c","#059669","#0891b2","#4f46e5"]
    let hash = 0
    for (let i = 0; i < nombreUsuario.length; i++) {
        hash = nombreUsuario.charCodeAt(i) + ((hash << 5) - hash)
    }
    avatar.style.backgroundColor = colores[Math.abs(hash) % colores.length]
    avatar.textContent = iniciales.toUpperCase()
}
document.addEventListener('DOMContentLoaded', generarAvatar)

/* ============================================================
   STATE
   ============================================================ */
const areas = {
ADMINISTRACION_Y_FINANZAS: ['FACTURACION Y COBRANZA'],
COMERCIALIZACION_Y_VENTA: ['COMERCIALIZACION Y VENTA'],
CONTROL_Y_MEJORA_DEL_SERVICIO: ['CONTROL Y MEJORA DEL SERVICIO'],
EJECUCION_DEL_SERVICIO: ['EJECUCION DEL SERVICIO', 'CAPTURACION'],
GESTION_DE_CAPITAL_HUMANO: ['ATRACCION DE CAPITAL HUMANO', 'GESTION DE CAPITAL HUMANO', 'NOMINAS'],
GESTION_DE_INFRAESTRUCTURA: ['COMPRAS Y SUMINISTROS', 'GESTION DE GASTOS', 'LOGISTICA VEHICULAR', 'TECNOLOGIAS DE LA INFORMACION'],
PLANEACION_DEL_SERVICIO: ['SERVICIO AL CLIENTE'],
PLANEACION_Y_DIRECCION_ESTRATEGICA: ['ALTA DIRECCION'],
SISTEMA_DE_GESTION_DE_LA_CALIDAD: ['SISTEMA DE GESTION DE LA CALIDAD']
};
let items = [
];
let nextId = 1; //3
let editingId = null;
let total = 0;


/* ============================================================
   UTILITIES
   ============================================================ */
const fmt = (n) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');
  toast.className = `toast toast--${type}`;
  toastMsg.textContent = msg;
  toastIcon.textContent = type === 'success' ? 'check_circle' : 'error';
  toast.classList.add('is-visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

function setError(id, msg) {
  const el = document.getElementById('err-' + id);
  if (!el) return;
  el.textContent = msg;
  const inp = document.getElementById(id);
  if (inp) inp.classList.toggle('input--error', !!msg);
}

function clearError(id) { setError(id, ''); }

/* ============================================================
   RENDER TABLE
   ============================================================ */
function renderTable() {
  const tbody = document.getElementById('tbodyConceptos');
  const rowEmpty = document.getElementById('rowEmpty');

  // Remove all rows except the empty-state row
  [...tbody.querySelectorAll('tr:not(#rowEmpty)')].forEach(r => r.remove());

  if (items.length === 0) {
    rowEmpty.style.display = '';
    updateTotal();
    return;
  }

  rowEmpty.style.display = 'none';

  items.forEach((item, idx) => {
    const subtotal = item.unidad * item.precio;
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;

    if (editingId === item.id) {
      tr.classList.add('editing-row');
      tr.innerHTML = `
        <td class="td-num">${idx + 1}</td>
        <td><input class="input-inline" id="edit-desc" value="${escHtml(item.desc)}" style="min-width:160px"/></td>
        <td><input class="input-inline" id="edit-unidad" type="number" min="1" value="${item.unidad}" style="width:70px"/></td>
        <td><input class="input-inline" id="edit-precio" type="number" min="0" step="0.01" value="${item.precio}" style="width:100px"/></td>
        <td class="td-subtotal" id="edit-subtotal">${fmt(subtotal)}</td>
        <td class="td-actions">
          <div class="action-btns">
            <button class="action-btn action-btn--edit" title="Guardar" onclick="saveEdit(${item.id})">
              <span class="material-symbols-outlined">check</span>
            </button>
            <button class="action-btn action-btn--delete" title="Cancelar" onclick="cancelEdit()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </td>`;
      tbody.appendChild(tr);

      // Live update subtotal while editing
      ['edit-unidad', 'edit-precio'].forEach(fid => {
        document.getElementById(fid).addEventListener('input', () => {
          const u = parseFloat(document.getElementById('edit-unidad').value) || 0;
          const p = parseFloat(document.getElementById('edit-precio').value) || 0;
          document.getElementById('edit-subtotal').textContent = fmt(u * p);
        });
      });
    } else {
      tr.innerHTML = `
        <td class="td-num">${idx + 1}</td>
        <td class="td-desc">${escHtml(item.desc)}</td>
        <td>${item.unidad}</td>
        <td>${fmt(item.precio)}</td>
        <td class="td-subtotal">${fmt(subtotal)}</td>
        <td class="td-actions">
          <div class="action-btns">
            <button class="action-btn action-btn--edit" title="Editar" onclick="startEdit(${item.id})">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="action-btn action-btn--delete" title="Eliminar" onclick="deleteItem(${item.id})">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    }
  });

  updateTotal();
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function updateTotal() {

  total = items.reduce((acc, i) => acc + i.unidad * i.precio, 0);
  document.getElementById('totalRequisicion').textContent = fmt(total);
}

/* ============================================================
   AGREGAR ITEM
   ============================================================ */
document.addEventListener('DOMContentLoaded', () =>{
    renderTable();
    agregarEventos();

    // Sincronizar todos los contenteditable con sus campos ocultos
    ['situacionActual', 'expectativa', 'comentarios', 'asunto', 'itemDesc'].forEach(id => {
        const div = document.getElementById(id);
        const hidden = document.getElementById(id + '-hidden');
        if (!div || !hidden) return;
        div.addEventListener('input', () => {
            hidden.value = div.innerText.trim();
            clearError(id);
        });
        // Evitar saltos de línea en campos de una sola línea
        if (div.classList.contains('spell-field--line')) {
            div.addEventListener('keydown', e => {
                if (e.key === 'Enter') e.preventDefault();
            });
        }
    });
} );

document.getElementById('btnAgregar').addEventListener('click', () => {
  const desc = (document.getElementById('itemDesc-hidden')?.value || document.getElementById('itemDesc').innerText || '').trim();
  const unidad = parseFloat(document.getElementById('itemUnidad').value);
  const precio = parseFloat(document.getElementById('itemPrecio').value);

  let valid = true;

  if (!desc) { setError('itemDesc', 'La descripción es obligatoria.'); valid = false; }
  else clearError('itemDesc');

  if (!unidad || unidad <= 0) { setError('itemUnidad', 'Ingresa una cantidad válida.'); valid = false; }
  else clearError('itemUnidad');

  if (!precio || precio <= 0) { setError('itemPrecio', 'Ingresa un precio válido.'); valid = false; }
  else clearError('itemPrecio');

  if (!valid) return;

  items.push({ id: nextId++, desc, unidad, precio });
  const itemDescDiv = document.getElementById('itemDesc');
  if (itemDescDiv) itemDescDiv.innerText = '';
  const itemDescHidden = document.getElementById('itemDesc-hidden');
  if (itemDescHidden) itemDescHidden.value = '';
  document.getElementById('itemUnidad').value = '';
  document.getElementById('itemPrecio').value = '';
  renderTable();
  showToast('Concepto agregado correctamente.');
});

/* ============================================================
   EDITAR ITEM
   ============================================================ */
function startEdit(id) {
  editingId = id;
  renderTable();
  document.getElementById('edit-desc').focus();
}

function saveEdit(id) {
  const desc = document.getElementById('edit-desc').value.trim();
  const unidad = parseFloat(document.getElementById('edit-unidad').value);
  const precio = parseFloat(document.getElementById('edit-precio').value);

  if (!desc || !unidad || unidad <= 0 || !precio || precio <= 0) {
    showToast('Completa todos los campos del item antes de guardar.', 'error');
    return;
  }

  const item = items.find(i => i.id === id);
  if (item) { item.desc = desc; item.unidad = unidad; item.precio = precio; }

  editingId = null;
  renderTable();
  showToast('Concepto actualizado.');
}

function cancelEdit() {
  editingId = null;
  renderTable();
}

/* ============================================================
   ELIMINAR ITEM
   ============================================================ */
function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  if (editingId === id) editingId = null;
  renderTable();
  showToast('Concepto eliminado.');
}

/* ============================================================
   TIPO DE GASTO — sólo una opción a la vez
   ============================================================ */
document.querySelectorAll('.gasto-check').forEach(chk => {
  chk.addEventListener('change', () => {
    if (chk.checked) {
      document.querySelectorAll('.gasto-check').forEach(other => {
        if (other !== chk) other.checked = false;
      });
    }
    document.getElementById('err-tipoGasto').style.display = 'none';
  });
});

/* ============================================================
   MODAL RENTABILIDADES
   ============================================================ */
const modalEl = document.getElementById('modalRentabilidades');
const chkRent = document.getElementById('chkRentabilidades');

function openModal() {
  modalEl.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalEl.classList.remove('is-open');
  document.body.style.overflow = '';
  chkRent.checked = false;
}

chkRent.addEventListener('change', () => {
  if (chkRent.checked) openModal();
});

document.getElementById('btnCerrarModal').addEventListener('click', closeModal);
document.getElementById('btnCerrarModalFooter').addEventListener('click', closeModal);
modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });

/* ============================================================
   UPLOAD AREA
   ============================================================ */
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadFilename = document.getElementById('uploadFilename');

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'var(--primary)';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = '';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) { showToast('El archivo supera 5MB.', 'error'); return; }
  uploadFilename.textContent = '📎 ' + file.name;
  uploadFilename.style.display = 'block';
  showToast('Archivo cargado: ' + file.name);
}

/* ============================================================
   VALIDACIÓN ENVIAR REQUISICIÓN
   ============================================================ */
const requiredFields = [
  { id: 'usuarioAutorizador', label: 'Usuario Autorizador' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'asunto', label: 'Asunto' },
  { id: 'planta', label: 'Planta' },
  { id: 'region', label: 'Región' },
  { id: 'fechaEntrega', label: 'Fecha de Entrega' },
  { id: 'tarjeta', label: 'Tarjeta o Cuenta' },
  { id: 'situacionActual', label: 'Situación Actual' },
  { id: 'expectativa', label: 'Expectativa' },
  { id: 'orden', label: 'ORDEN' }
];

function validateAndSend() {
  let requi = {}
  let valid = true;
  let firstErrorEl = null;

  // Clear all errors first
  requiredFields.forEach(f => clearError(f.id));
  document.getElementById('err-tipoGasto').style.display = 'none';

  // IDs que son contenteditable (no tienen .value, usan .innerText via campo oculto)
  const spellFields = ['situacionActual', 'expectativa', 'comentarios', 'asunto'];

  // Sync spell fields from contenteditable to hidden inputs before validation
  spellFields.forEach(id => {
    const div = document.getElementById(id);
    const hidden = document.getElementById(id + '-hidden');
    if (div && hidden) hidden.value = div.innerText.trim();
  });

  // Validate each field y creacion de campos
  requiredFields.forEach(f => {
    const el = document.getElementById(f.id);
    // Para campos contenteditable leer del hidden, para el resto usar .value directamente
    const val = spellFields.includes(f.id)
      ? (document.getElementById(f.id + '-hidden')?.value.trim() || '')
      : (el ? el.value.trim() : '');
    requi[f.id] = val;
    if (!val) {
      setError(f.id, `El campo "${f.label}" es obligatorio.`);
      if (!firstErrorEl) firstErrorEl = el;
      valid = false;
    }
  });
  
  // Valida tipo de gasto
  const anyGasto = [...document.querySelectorAll('.gasto-check')].some(c => c.checked);
  
  if (!anyGasto) {
    document.getElementById('err-tipoGasto').style.display = 'block';
    if (!firstErrorEl) firstErrorEl = document.getElementById('gastoDirecto');
    valid = false;
  }
  //se establece el tipo de gasto
  const gasto = [...document.querySelectorAll('.gasto-check')].filter(c => c.checked)
  if (gasto.length > 0) requi.rentabilidad = gasto[0].name

  // Validate at least one concept
  if (items.length === 0) {
    showToast('Debes agregar al menos un concepto a la requisición.', 'error');
    if (!firstErrorEl) firstErrorEl = document.getElementById('itemDesc');
    valid = false;
  }
  // guardando items
  requi.descripcion = items.map(i => i)
  if (!valid) {
    if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Hay campos obligatorios sin completar.', 'error');
    return;
  }
  requi.comentariosAdicionales = document.getElementById('comentarios-hidden').value;
  const foto = document.getElementById('fileInput').files[0];
  if (foto) requi.imagen = foto;
  cambiandoCampos(requi)
  // SUCCESS
  showToast('¡Requisición enviada correctamente!');
}

document.getElementById('btnEnviarTop').addEventListener('click', validateAndSend);
document.getElementById('btnEnviarBottom').addEventListener('click', validateAndSend);

document.getElementById('btnBorrador').addEventListener('click', () => {
  showToast('Borrador guardado correctamente.');
});

// Clear errors on input change
requiredFields.forEach(f => {
  const el = document.getElementById(f.id);
  if (el) el.addEventListener('input', () => clearError(f.id));
  if (el) el.addEventListener('change', () => clearError(f.id));
});

function llenarPlantas(){
    const input = document.getElementById("planta");
    elementos = plantas.map((p) => {
        return `<option value="${p.planta}">${p.planta}</option>`
    })   
    input.innerHTML = elementos
}
function agregarEventos(){
  const input = document.getElementById("proceso");
  input.addEventListener("change",(e) => {
     llenarDepartamentos(e.target.value);  
  })
}
function llenarDepartamentos(proceso){
  if(!proceso) {
    document.getElementById("departamento").innerHTML = '<option value="">Seleccionar departamento</option>';
    return
  }
    const procesoNuevo = proceso.replaceAll(" ", "_");
    const input = document.getElementById("departamento");
    elementos = areas[procesoNuevo].map((a) => {
        return `<option value="${a}">${a}</option>`
    })   
    input.innerHTML = elementos
}

/* ============================================================
   TOAST CONEXION
   ============================================================ */
(function initToastConexion() {
  const toastConexion = document.getElementById('toastConexion');
  const toastConexionIcon = document.getElementById('toastConexionIcon');
  const toastConexionMsg = document.getElementById('toastConexionMsg');
  let autoCloseTimer = null;

  function mostrarSinConexion() {
    clearTimeout(autoCloseTimer);
    toastConexion.className = 'toast-conexion toast-conexion--offline is-visible';
    toastConexionIcon.textContent = 'wifi_off';
    toastConexionMsg.textContent = 'Sin conexión a internet. Algunas funciones no estarán disponibles.';
  }

  function mostrarConexionRestaurada() {
    clearTimeout(autoCloseTimer);
    toastConexion.className = 'toast-conexion toast-conexion--online is-visible';
    toastConexionIcon.textContent = 'wifi';
    toastConexionMsg.textContent = 'Conexión restaurada.';
    autoCloseTimer = setTimeout(() => {
      toastConexion.classList.remove('is-visible');
    }, 3000);
  }

  window.addEventListener('offline', mostrarSinConexion);
  window.addEventListener('online', mostrarConexionRestaurada);

  document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.onLine) mostrarSinConexion();
  });
})();

function cambiandoCampos(datos){
  let campos = datos
  campos.autoriza = datos.usuarioAutorizador
  delete campos.usuarioAutorizador
  campos.detallesEspectativa = datos.expectativa
  delete campos.expectativa
  campos.noCuenta = datos.tarjeta
  delete campos.tarjeta
  campos.estatus = 'INGRESADA'
  campos.tipo = 'insert'
  campos._csrf = tok
  campos.total = total
  campos.horaRegistro = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')

  // document.getElementById('totalRequisicion').value
  //falta agregar el delegado,  orden
  if(campos.foto){
    let formData = new FormData();
    for (const [key, value] of Object.entries(campos)) {
      formData.append(key, value);
    }
    envioFormData('crudRequisicionGastos', formData, 'requisicionGastos')
  }
  envioJson('crudRequisicionGastos', campos, 'requisicionGastos')
  console.log(campos)
}

