
// ─── DATE ────────────────────────────────────────────────
(function(){
  const d = new Date();
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  document.getElementById('hdr-date').textContent =
    d.toLocaleDateString('es-MX', opts).replace(/^\w/, c => c.toUpperCase());
})();

// ─── STEP CONFIG ─────────────────────────────────────────
const STEPS = 6;
const STEP_LABELS = ['La vacante','Datos personales','Salud','Educación','Habilidades','Sobre el empleo'];
let current = 0;

function buildDots() {
  const c = document.getElementById('stepDots');
  c.innerHTML = Array.from({length: STEPS}, (_,i) => `
    <div class="step-dot" id="dot-${i+1}">
      <div class="dot-circle" id="dot-circle-${i+1}">${i+1}</div>
      <div class="dot-label">${STEP_LABELS[i]}</div>
    </div>
  `).join('');
}

function updateProgress(step) {
  const shell = document.getElementById('progressShell');
  if (step === 0 || step === 7) { shell.style.display='none'; return; }
  shell.style.display='block';

  const pct = ((step - 1) / STEPS) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  for (let i = 1; i <= STEPS; i++) {
    const dot = document.getElementById('dot-'+i);
    const circle = document.getElementById('dot-circle-'+i);
    dot.classList.remove('done','active');
    if (i < step) { dot.classList.add('done'); circle.textContent = '✓'; }
    else if (i === step) { dot.classList.add('active'); circle.textContent = i; }
    else { circle.textContent = i; }
  }
}

function goTo(n) {
  document.getElementById('panel-'+current).classList.remove('active');
  current = n;
  document.getElementById('panel-'+n).classList.add('active');
  updateProgress(n);
  window.scrollTo({top:0, behavior:'smooth'});
}

// ─── CHOICE HELPERS ───────────────────────────────────────
function pick(el, name, val) {
  document.querySelectorAll(`.choice`).forEach(c => {
    if (c.querySelector(`input[name="${name}"]`)) {
      c.classList.remove('sel','sel-yes','sel-no');
    }
  });
  el.classList.add('sel');
  clearErr('f-'+name);
}
function pickYN(el, name, val, type) {
  document.querySelectorAll(`.choice`).forEach(c => {
    if (c.querySelector(`input[name="${name}"]`)) {
      c.classList.remove('sel','sel-yes','sel-no');
    }
  });
  if (type==='yes') el.classList.add('sel-yes');
  else if (type==='no') el.classList.add('sel-no');
  else el.classList.add('sel');
  clearErr('f-'+name);
}
function toggleCheck(e, el, name, val) {
  e.preventDefault(); // evita que el browser haga doble-toggle en el checkbox interno
  const inp = el.querySelector('input');
  inp.checked = !inp.checked;
  if (inp.checked) el.classList.add('sel');
  else el.classList.remove('sel');
  clearErr('f-viveCon');
}

// ─── CONDITIONAL ─────────────────────────────────────────
function openCond(id, open) {
  const el = document.getElementById(id);
  if (!el) return;
  if (open) el.classList.add('open');
  else el.classList.remove('open');
}

// ─── MACHINE TAG SYSTEM ───────────────────────────────────
const machineTags = new Set();

document.getElementById('machineSelect').addEventListener('change', function(){
  openCond('cond-maq-otra', this.value === '__otro__');
  if(this.value !== '__otro__') document.getElementById('machineOtro').value = '';
});

function addMachine() {
  const sel = document.getElementById('machineSelect');
  const otr = document.getElementById('machineOtro');
  let val = sel.value === '__otro__' ? otr.value.trim() : sel.value;
  if (!val) return;
  if (machineTags.has(val)) {
    sel.style.borderColor='var(--amber)';
    setTimeout(()=> sel.style.borderColor='', 1500);
    return;
  }
  machineTags.add(val);
  renderTags();
  sel.value = '';
  otr.value = '';
  openCond('cond-maq-otra', false);
}

function removeMachine(val) {
  machineTags.delete(val);
  renderTags();
}

function renderTags() {
  const c = document.getElementById('machineTags');
  if (machineTags.size === 0) {
    c.innerHTML = '<span class="machine-empty">Aún no has agregado ninguna máquina.</span>';
    return;
  }
  c.innerHTML = [...machineTags].map(v => `
    <span class="machine-tag">
      🔧 ${v}
      <button class="tag-remove" type="button" onclick="removeMachine('${v.replace(/'/g,"\\'")}')">✕</button>
    </span>
  `).join('');
}

// ─── VALIDATION ───────────────────────────────────────────
function setErr(fid, show) {
  const f = document.getElementById(fid);
  if (!f) return;
  if (show) f.classList.add('has-error');
  else f.classList.remove('has-error');
}
function clearErr(fid) {
  const f = document.getElementById(fid);
  if (f) f.classList.remove('has-error');
}
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function radioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}
function checkGroupChecked(name) {
  return document.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
}
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

const STEP_RULES = {
  1: () => {
    let ok = true;
    const puestoVal = val('puesto');
    if (!puestoVal) { setErr('f-puesto',true); ok=false; } else setErr('f-puesto',false);
    if (puestoVal === 'Otro (especificar)') {
      if (!val('puestoOtro')) { setErr('f-puesto-otro',true); ok=false; } else setErr('f-puesto-otro',false);
    }
    return ok;
  },
  2: () => {
    let ok = true;
    const req = [
      ['f-apPaterno','apPaterno'],['f-apMaterno','apMaterno'],
      ['f-nombres','nombres'],['f-edad','edad'],
      ['f-calle','calle'],['f-colonia','colonia'],
      ['f-telefono','telefono'],['f-lugarNac','lugarNac'],['f-fechaNac','fechaNac'],
    ];
    req.forEach(([fid,id]) => {
      if (!val(id)) { setErr(fid,true); ok=false; } else setErr(fid,false);
    });
    // email
    const em = val('email');
    if (!em || !isValidEmail(em)) { setErr('f-email',true); ok=false; } else setErr('f-email',false);
    // curp
    if (val('curp').length < 18) { setErr('f-curp',true); ok=false; } else setErr('f-curp',false);
    // sexo
    if (!radioVal('sexo')) { setErr('f-sexo',true); ok=false; } else setErr('f-sexo',false);
    // nac
    if (!radioVal('nac')) { setErr('f-nac',true); ok=false; } else setErr('f-nac',false);
    // viveCon
    if (!checkGroupChecked('viveCon')) { setErr('f-viveCon',true); ok=false; } else setErr('f-viveCon',false);
    // edoCivil
    if (!radioVal('edoCivil')) { setErr('f-edoCivil',true); ok=false; } else setErr('f-edoCivil',false);
    return ok;
  },
  3: () => {
    let ok = true;
    if (!radioVal('tabaco'))  { setErr('f-tabaco',true);  ok=false; } else setErr('f-tabaco',false);
    if (!radioVal('alcohol')) { setErr('f-alcohol',true); ok=false; } else setErr('f-alcohol',false);
    if (!radioVal('drogas'))  { setErr('f-drogas',true);  ok=false; } else setErr('f-drogas',false);
    // Si drogas=Si, rehabilitación es requerida
    if (radioVal('drogas') === 'Si') {
      if (!radioVal('rehabilitacion')) { setErr('f-rehabilitacion',true); ok=false; } else setErr('f-rehabilitacion',false);
    }
    return ok;
  },
  4: () => {
    let ok = true;
    if (!val('escolaridad')) { setErr('f-escolaridad',true); ok=false; } else setErr('f-escolaridad',false);
    return ok;
  },
  5: () => {
    let ok = true;
    if (!radioVal('pasaporte')) { setErr('f-pasaporte',true); ok=false; } else setErr('f-pasaporte',false);
    if (!radioVal('visa'))      { setErr('f-visa',true);      ok=false; } else setErr('f-visa',false);
    return ok;
  },
  6: () => {
    let ok = true;
    if (!radioVal('enterado')) { setErr('f-enterado',true); ok=false; } else setErr('f-enterado',false);
    if (radioVal('enterado') === 'Otro') {
      if (!val('otroMedio')) { setErr('f-otroMedio',true); ok=false; } else setErr('f-otroMedio',false);
    }
    if (!radioVal('familiarQB')) { setErr('f-familiarQB',true); ok=false; } else setErr('f-familiarQB',false);
    if (radioVal('familiarQB') === 'Si') {
      if (!val('familiarNombre'))     { setErr('f-familiarNombre',true);     ok=false; } else setErr('f-familiarNombre',false);
      if (!val('familiarParentesco')) { setErr('f-familiarParentesco',true); ok=false; } else setErr('f-familiarParentesco',false);
    }
    return ok;
  }
};

function validateAndGo(from, to) {
  const ok = STEP_RULES[from]();
  if (ok) {
    goTo(to);
  } else {
    const btn = document.getElementById(`btn-next-${from}`);
    if (btn) { btn.classList.add('btn-shake'); setTimeout(()=>btn.classList.remove('btn-shake'),500); }
    // scroll to first error
    const firstErr = document.querySelector(`#panel-${from} .has-error`);
    if (firstErr) firstErr.scrollIntoView({behavior:'smooth', block:'center'});
  }
}
function validateAndSubmit() {
  const ok = STEP_RULES[6]();
  if (ok) goTo(7);
  else {
    const btn = document.getElementById('btn-submit');
    btn.classList.add('btn-shake'); setTimeout(()=>btn.classList.remove('btn-shake'),500);
    const firstErr = document.querySelector('#panel-6 .has-error');
    if (firstErr) firstErr.scrollIntoView({behavior:'smooth', block:'center'});
  }
}

// Live clear errors on input/change
document.addEventListener('input', e => {
  const f = e.target.closest('.field');
  if (f && f.classList.contains('has-error')) {
    const id = e.target.id || e.target.name;
    if (id) clearErr('f-'+id.replace(/_.*/,''));
    f.classList.remove('has-error');
  }
});

// ─── INIT ─────────────────────────────────────────────────
buildDots();
updateProgress(0);
