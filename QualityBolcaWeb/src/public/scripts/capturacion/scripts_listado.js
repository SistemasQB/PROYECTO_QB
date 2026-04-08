// ─── CONSTANTS ───────────────────────────────────────────
const PLANTS=['Planta A','Planta B','Planta C','Planta Norte','Planta Sur'];
const TURNS=['Matutino','Vespertino','Nocturno'];
const SERVICE_TYPES=['Inspección','Retrabajos','Sorting','Auditoría'];

// ── Regiones estáticas (temporal — se sustituirá por catálogo del backend)
// Para cambiar a dinámico: reemplazar este array con la respuesta de tu API
// e.g. fetch('/api/regiones').then(r=>r.json()).then(data=>{ REGIONS.length=0; REGIONS.push(...data); renderTable(); })
const REGIONS=[
  'Región Norte','Región Noreste','Región Noroeste',
  'Región Centro','Región Centro-Norte','Región Centro-Sur',
  'Región Occidente','Región Oriente',
  'Región Sur','Región Sureste','Región Suroeste',
];

// Columns — region before semanal, semanal before cotizacion, actions at end
const COLS=[
  {key:'folio',      label:'Folio',           type:'text'},
  {key:'items',      label:'Cant. Items',      type:'number'},
  {key:'planta',     label:'Planta',           type:'text'},
  {key:'clienteCobro',label:'Cliente Cobro',   type:'text'},
  {key:'turno',      label:'Turno',            type:'text'},
  {key:'fecha',      label:'Fecha',            type:'date'},
  {key:'numeroParte',label:'No. Parte',        type:'text'},
  {key:'nombreParte',label:'Nombre Parte',     type:'text'},
  {key:'incidents',  label:'Incidentes',       type:'incidents'},
  {key:'piezasInspeccionadas',label:'Pzas Insp.',type:'number'},
  {key:'piezasOk',   label:'Pzas OK',          type:'number'},
  {key:'piezasNg',   label:'Pzas NG',          type:'number'},
  {key:'piezasRecuperadas',label:'Pzas Rec.',  type:'number'},
  {key:'piezasScrap',label:'Pzas Scrap',       type:'number'},
  {key:'rateTih',    label:'Rate / TIH',       type:'ratetih'},
  {key:'horasReporte',label:'Horas Rep.',      type:'decimal'},
  {key:'tipoServicio',label:'Tipo Servicio',   type:'text'},
  {key:'reviso',     label:'Revisó',           type:'text'},
  {key:'ingeniero',  label:'Ingeniero',        type:'text'},
  {key:'idioma',     label:'Idioma',           type:'text'},
  {key:'firmado',    label:'Firmado',          type:'boolean'},
  {key:'region',     label:'Región',           type:'text'},
  {key:'semanal',    label:'Semanal',          type:'text'},
  {key:'cotizacion', label:'Cotización',       type:'text'},
  {key:'__actions',  label:'Acciones',         type:'actions'},
];

const FILTER_OPS={
  text:['contiene','no contiene','igual a','empieza con','termina con'],
  number:['=','≠','>','<','>=','<='],decimal:['=','≠','>','<','>=','<='],
  date:['=','antes de','después de','entre'],boolean:['es verdadero','es falso'],
  incidents:['contiene','no contiene'],ratetih:['contiene','igual a','=','≠','>','<'],
  actions:[],
};
const SUB_KEYS=['piezasInspeccionadas','piezasOk','piezasNg','piezasRecuperadas','piezasScrap','horasReporte'];

// ─── UTILS ───────────────────────────────────────────────
const uid=()=>Math.random().toString(36).substr(2,9);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const deepClone=obj=>JSON.parse(JSON.stringify(obj));

// ─── SAMPLE DATA ─────────────────────────────────────────
function makeRow(i){
  const insp=Math.floor(Math.random()*900)+100;
  const inc6=[{id:'i1',label:'Rasguño'},{id:'i2',label:'Abolladura'},{id:'i3',label:'Mancha'},{id:'i4',label:'Crack'},{id:'i5',label:'Faltante'},{id:'i6',label:'Deformación'}];
  const picked=inc6.slice(0,Math.floor(Math.random()*3)+1).map(x=>({...x,count:Math.floor(Math.random()*25)+1}));
  const ng=picked.reduce((a,b)=>a+b.count,0);
  const isRate=Math.random()>.4;
  const rv=isRate?Math.floor(Math.random()*200)+50:null;
  const items=Math.floor(Math.random()*4)+1;
  const weeks=['S-01','S-02','S-03','S-04','S-05','S-06'];
  return{
    id:uid(),folio:`F-${String(i+1).padStart(4,'0')}`,items,
    planta:PLANTS[i%PLANTS.length],clienteCobro:`Cliente ${String.fromCharCode(65+(i%8))}`,
    turno:TURNS[i%TURNS.length],
    fecha:new Date(2024,Math.floor(Math.random()*12),Math.floor(Math.random()*27)+1).toISOString().split('T')[0],
    numeroParte:`NP-${Math.floor(Math.random()*9000)+1000}`,
    nombreParte:`Componente ${String.fromCharCode(65+(i%10))}${i+1}`,
    incidents:picked,piezasInspeccionadas:insp,piezasOk:insp-ng,piezasNg:ng,
    piezasRecuperadas:Math.floor(ng*Math.random()),piezasScrap:Math.floor(ng*Math.random()*.3),
    rateTih:isRate?rv:`TIH-${Math.floor(Math.random()*99)+1}`,
    rateTihType:isRate?'rate':'tih',
    horasReporte:isRate?parseFloat((insp/rv).toFixed(2)):0,
    tipoServicio:SERVICE_TYPES[i%SERVICE_TYPES.length],
    reviso:`Ing. ${['García','López','Martínez','Rodríguez'][i%4]}`,
    ingeniero:`Ing. ${['Hernández','González','Pérez','Sánchez'][i%4]}`,
    idioma:Math.random()>.5?'E':'I',firmado:Math.random()>.5,
    region:REGIONS[i%REGIONS.length],
    semanal:weeks[Math.floor(Math.random()*weeks.length)],
    cotizacion:`COT-${Math.floor(Math.random()*500)+100}`,
    lotes:Array.from({length:items},(_,j)=>({item:j+1,lote:''})),
    fechasLotes:Array.from({length:items},(_,j)=>({item:j+1,fecha:''})),
    series:Array.from({length:items},(_,j)=>({item:j+1,serie:''})),
  };
}
let allReports=Array.from({length:30},(_,i)=>makeRow(i));

// ─── APP STATE ────────────────────────────────────────────
let state={filters:[],sort:{key:'folio',dir:'asc'},page:1,pageSize:15,dateFrom:'',dateTo:''};
let currentDetailId=null;

// ─── PAGE NAVIGATION ─────────────────────────────────────
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}
function goList(){ showPage('listPage'); }
function goDetail(id){
  currentDetailId=id;
  renderDetailPage(id);
  showPage('detailPage');
}

// ─── FILTER HELPERS ───────────────────────────────────────
function getColVal(row,key){
  if(key==='incidents') return row.incidents.map(i=>`${i.label}(${i.count})`).join(', ');
  if(key==='firmado') return row.firmado;
  return row[key];
}
function applyFilter(row,fi){
  if(!fi.field||!fi.op) return true;
  const col=COLS.find(c=>c.key===fi.field); if(!col) return true;
  const raw=getColVal(row,fi.field);
  const v=fi.value;
  if(fi.value===''&&fi.op!=='es verdadero'&&fi.op!=='es falso') return true;
  const type=col.type==='ratetih'?(isNaN(parseFloat(raw))?'text':'decimal'):col.type;
  if(col.type==='boolean') return fi.op==='es verdadero'?raw===true:raw===false;
  if(type==='text'||type==='incidents'){
    const s=String(raw).toLowerCase(),q=v.toLowerCase();
    if(fi.op==='contiene') return s.includes(q);
    if(fi.op==='no contiene') return !s.includes(q);
    if(fi.op==='igual a') return s===q;
    if(fi.op==='empieza con') return s.startsWith(q);
    if(fi.op==='termina con') return s.endsWith(q);
  }
  if(type==='number'||type==='decimal'){
    const n=parseFloat(raw),q=parseFloat(v);
    if(fi.op==='=') return n===q;if(fi.op==='≠') return n!==q;
    if(fi.op==='>') return n>q;if(fi.op==='<') return n<q;
    if(fi.op==='>=') return n>=q;if(fi.op==='<=') return n<=q;
  }
  if(type==='date'){
    if(fi.op==='=') return raw===v;
    if(fi.op==='antes de') return raw<v;
    if(fi.op==='después de') return raw>v;
    if(fi.op==='entre') return raw>=v&&raw<=(fi.value2||'9999-99-99');
  }
  return true;
}
function getFiltered(){
  let r=allReports.slice();
  if(state.dateFrom) r=r.filter(x=>x.fecha>=state.dateFrom);
  if(state.dateTo) r=r.filter(x=>x.fecha<=state.dateTo);
  for(const fi of state.filters) if(fi.field&&fi.op) r=r.filter(row=>applyFilter(row,fi));
  r.sort((a,b)=>{
    let av=getColVal(a,state.sort.key),bv=getColVal(b,state.sort.key);
    if(typeof av==='boolean'){av=av?1:0;bv=bv?1:0;}
    if(av<bv) return state.sort.dir==='asc'?-1:1;
    if(av>bv) return state.sort.dir==='asc'?1:-1;
    return 0;
  });
  return r;
}
function calcSubtotals(rows){
  const s={};
  SUB_KEYS.forEach(k=>{s[k]=rows.reduce((a,b)=>a+(parseFloat(b[k])||0),0);});
  s.horasReporte=parseFloat(s.horasReporte.toFixed(2));
  return s;
}

// ─── RENDER TABLE ─────────────────────────────────────────
function renderTable(){
  const filtered=getFiltered();
  const totalPages=Math.max(1,Math.ceil(filtered.length/state.pageSize));
  if(state.page>totalPages) state.page=totalPages;
  const paged=filtered.slice((state.page-1)*state.pageSize,state.page*state.pageSize);
  const subs=calcSubtotals(filtered);

  // head
  document.getElementById('tableHead').innerHTML='<tr>'+COLS.map(col=>{
    if(col.key==='__actions') return `<th class="no-sort" style="width:110px;text-align:center">${col.label}</th>`;
    const cls=state.sort.key===col.key?(state.sort.dir==='asc'?'sort-asc':'sort-desc'):'';
    const icon=state.sort.key===col.key?(state.sort.dir==='asc'?'↑':'↓'):'⇅';
    return `<th class="${cls}" onclick="sortBy('${col.key}')">${col.label}<span class="sort-icon">${icon}</span></th>`;
  }).join('')+'</tr>';

  // body
  const tbody=document.getElementById('tableBody');
  if(!paged.length){
    tbody.innerHTML=`<tr><td colspan="${COLS.length}"><div class="empty-state"><div class="empty-icon">📭</div><p>No se encontraron registros</p></div></td></tr>`;
  } else {
    let html=paged.map(row=>'<tr>'+COLS.map(col=>`<td>${renderCell(col,row)}</td>`).join('')+'</tr>').join('');
    html+='<tr class="subtotals-row">'+COLS.map((col,i)=>{
      if(i===0) return `<td><span class="subtotals-label">SUBTOTALES</span></td>`;
      if(SUB_KEYS.includes(col.key)) return `<td>${subs[col.key].toLocaleString('es-MX')}</td>`;
      return '<td></td>';
    }).join('')+'</tr>';
    tbody.innerHTML=html;
  }
  renderPagination(filtered.length,totalPages);
  updateStats(subs);
  document.getElementById('recordsBadge').textContent=filtered.length+' registros';
}

function renderCell(col,row){
  if(col.key==='__actions') return `
    <div class="action-btns" style="justify-content:center">
      <button class="action-btn action-btn-view" title="Ver detalle" onclick="goDetail('${row.id}')">👁</button>
      <button class="action-btn action-btn-edit" title="Editar" onclick="openEditModal('${row.id}')">✏️</button>
      <button class="action-btn action-btn-del" title="Eliminar" onclick="confirmDelete('${row.id}')">🗑</button>
    </div>`;
  if(col.key==='incidents'){
    const total=row.incidents.reduce((a,b)=>a+b.count,0);
    let b=`<div class="incidents-wrap"><span class="badge badge-red">${total} total</span>`;
    row.incidents.forEach(inc=>{b+=`<span class="badge badge-yellow">${inc.label}:${inc.count}</span>`;});
    return b+'</div>';
  }
  if(col.key==='firmado') return row.firmado?'<span class="badge badge-green">✓ Sí</span>':'<span class="badge badge-red">✗ No</span>';
  if(col.key==='idioma') return row.idioma==='E'?'<span class="badge badge-blue">🇲🇽 ES</span>':'<span class="badge badge-yellow">🇺🇸 EN</span>';
  if(col.key==='piezasOk') return `<span class="mono" style="color:var(--green)">${row.piezasOk}</span>`;
  if(col.key==='piezasNg'||col.key==='piezasScrap') return `<span class="mono" style="color:var(--red)">${row[col.key]}</span>`;
  if(col.key==='piezasRecuperadas') return `<span class="mono" style="color:var(--yellow)">${row.piezasRecuperadas}</span>`;
  if(col.key==='rateTih'){
    const t=row.rateTihType==='rate';
    return `<span class="badge ${t?'badge-gray':'badge-purple'}">${t?'⚙️ Rate':'📋 TIH'}</span> <span class="mono">${row.rateTih}</span>`;
  }
  if(col.key==='semanal') return row.semanal?`<span class="badge badge-purple">${row.semanal}</span>`:'<span style="color:var(--text3)">—</span>';
  if(col.key==='region') return row.region?`<span class="badge badge-gray">📍 ${row.region}</span>`:'<span style="color:var(--text3)">—</span>';
  if(col.type==='number'||col.type==='decimal') return `<span class="mono">${row[col.key]}</span>`;
  if(col.type==='date') return `<span class="mono" style="color:var(--text2)">${row[col.key]}</span>`;
  return row[col.key]||'';
}

function renderPagination(total,totalPages){
  const s=(state.page-1)*state.pageSize+1,e=Math.min(state.page*state.pageSize,total);
  document.getElementById('paginationInfo').textContent=`Mostrando ${total?s:0}–${e} de ${total} registros`;
  let h='';
  h+=`<button class="page-btn" onclick="goPage(1)" ${state.page===1?'disabled':''}>«</button>`;
  h+=`<button class="page-btn" onclick="goPage(${state.page-1})" ${state.page===1?'disabled':''}>‹</button>`;
  let st=Math.max(1,state.page-2),en=Math.min(totalPages,st+4);
  if(en-st<4) st=Math.max(1,en-4);
  for(let p=st;p<=en;p++) h+=`<button class="page-btn ${p===state.page?'active':''}" onclick="goPage(${p})">${p}</button>`;
  h+=`<button class="page-btn" onclick="goPage(${state.page+1})" ${state.page>=totalPages?'disabled':''}>›</button>`;
  h+=`<button class="page-btn" onclick="goPage(${totalPages})" ${state.page>=totalPages?'disabled':''}>»</button>`;
  document.getElementById('pageControls').innerHTML=h;
}

function updateStats(subs){
  document.getElementById('st-insp').textContent=subs.piezasInspeccionadas.toLocaleString('es-MX');
  document.getElementById('st-ok').textContent=subs.piezasOk.toLocaleString('es-MX');
  document.getElementById('st-ng').textContent=subs.piezasNg.toLocaleString('es-MX');
  document.getElementById('st-rec').textContent=subs.piezasRecuperadas.toLocaleString('es-MX');
  document.getElementById('st-scrap').textContent=subs.piezasScrap.toLocaleString('es-MX');
  document.getElementById('st-hrs').textContent=subs.horasReporte.toLocaleString('es-MX');
}

// ─── SORT / PAGE ──────────────────────────────────────────
function sortBy(key){
  if(state.sort.key===key) state.sort.dir=state.sort.dir==='asc'?'desc':'asc';
  else{state.sort.key=key;state.sort.dir='asc';}
  renderTable();
}
function goPage(p){state.page=p;renderTable();}
function onPageSizeChange(){state.pageSize=parseInt(document.getElementById('pageSizeSelect').value);state.page=1;renderTable();}

// ─── COLLAPSIBLE ──────────────────────────────────────────
function togglePanel(bodyId,caretId){
  const body=document.getElementById(bodyId),caret=document.getElementById(caretId);
  const isOpen=!body.classList.contains('collapsed');
  if(isOpen){body.style.maxHeight=body.scrollHeight+'px';requestAnimationFrame(()=>{body.classList.add('collapsed');});caret.classList.remove('open');}
  else{body.classList.remove('collapsed');body.style.maxHeight=body.scrollHeight+'px';setTimeout(()=>{body.style.maxHeight='none';},300);caret.classList.add('open');}
}

// ─── DATE RANGE ───────────────────────────────────────────
function onDateRangeChange(){
  state.dateFrom=document.getElementById('dateFrom').value;
  state.dateTo=document.getElementById('dateTo').value;
  state.page=1;
  const lbl=document.getElementById('dateRangeLabel');
  lbl.textContent=(state.dateFrom||state.dateTo)?`${state.dateFrom||'–'} → ${state.dateTo||'–'}`:'';
  renderTable();
}
function clearDateRange(){document.getElementById('dateFrom').value='';document.getElementById('dateTo').value='';onDateRangeChange();}
async function simulateApiQuery(){
  const btn=document.getElementById('apiBtn');btn.disabled=true;btn.textContent='⏳ Consultando...';
  await sleep(1100);btn.disabled=false;btn.textContent='🔍 Consultar API';
  showToast('info','🔌 Consulta enviada al backend con el rango de fechas seleccionado.');
}

// ─── FILTERS ──────────────────────────────────────────────
function addFilter(){
  if(state.filters.length>=5){showToast('error','Máximo 5 filtros.');return;}
  state.filters.push({id:uid(),field:'',op:'',value:'',value2:''});
  renderFilters();renderTable();
}
function removeFilter(id){state.filters=state.filters.filter(f=>f.id!==id);state.page=1;renderFilters();renderTable();}
function clearAllFilters(){state.filters=[];state.page=1;renderFilters();renderTable();}
function updateFilter(id,key,val){
  const fi=state.filters.find(f=>f.id===id);if(!fi)return;
  if(key==='field'){fi.field=val;fi.op='';fi.value='';fi.value2='';}else fi[key]=val;
  state.page=1;renderFilters();renderTable();
}
function renderFilters(){
  const grid=document.getElementById('filtersGrid');
  const activeCount=state.filters.filter(f=>f.field&&f.op).length;
  document.getElementById('addFilterBtn').textContent=`+ Agregar filtro (${state.filters.length}/5)`;
  document.getElementById('clearAllFiltersBtn').style.display=state.filters.length?'inline-flex':'none';
  const badge=document.getElementById('filterCount');badge.style.display=activeCount?'inline-flex':'none';badge.textContent=activeCount;
  Array.from(grid.querySelectorAll('.filter-row')).forEach(el=>el.remove());
  document.getElementById('filterEmpty').style.display=state.filters.length?'none':'block';
  const filterableCols=COLS.filter(c=>c.type!=='actions');
  state.filters.forEach(fi=>{
    const col=filterableCols.find(c=>c.key===fi.field);
    const ops=col?FILTER_OPS[col.type]||[]:[];
    const row=document.createElement('div');row.className='filter-row';row.id='filterRow_'+fi.id;
    const fieldOpts='<option value="">Campo...</option>'+filterableCols.map(c=>`<option value="${c.key}" ${c.key===fi.field?'selected':''}>${c.label}</option>`).join('');
    const opOpts='<option value="">Operador...</option>'+ops.map(o=>`<option value="${o}" ${o===fi.op?'selected':''}>${o}</option>`).join('');
    const isBetween=fi.op==='entre',isBool=col&&col.type==='boolean';
    const valType=col&&(col.type==='number'||col.type==='decimal')?'number':col&&col.type==='date'?'date':'text';
    row.innerHTML=`
      <select onchange="updateFilter('${fi.id}','field',this.value)">${fieldOpts}</select>
      <select class="filter-op-sel" onchange="updateFilter('${fi.id}','op',this.value)" ${!fi.field?'disabled':''}>${opOpts}</select>
      ${!isBool?`<input class="filter-val-inp" type="${valType}" value="${fi.value||''}" placeholder="Valor..." ${!fi.op?'disabled':''} oninput="updateFilter('${fi.id}','value',this.value)"/>`:''}
      ${isBetween?`<input type="date" value="${fi.value2||''}" placeholder="Hasta..." oninput="updateFilter('${fi.id}','value2',this.value)" style="min-width:110px;flex:1"/>`:''}
      <button class="btn btn-danger btn-sm btn-icon" onclick="removeFilter('${fi.id}')">✕</button>`;
    grid.insertBefore(row,document.getElementById('filterEmpty'));
  });
}

// ─── CONFIRM MODAL ────────────────────────────────────────
function showConfirm({icon,title,msg,detail,confirmLabel,confirmClass,onConfirm,onCancel}){
  document.getElementById('confirmBody').innerHTML=`
    <div class="confirm-icon">${icon||'❓'}</div>
    <div style="font-size:15px;font-weight:800;margin-bottom:8px">${title}</div>
    <div class="confirm-msg">${msg}</div>
    ${detail?`<div class="confirm-detail">${detail}</div>`:''}`;
  document.getElementById('confirmFooter').innerHTML=`
    <button class="btn btn-ghost" onclick="closeConfirm()">${onCancel?'No, cancelar':'Cancelar'}</button>
    <button class="btn ${confirmClass||'btn-primary'}" id="confirmOkBtn">${confirmLabel||'Confirmar'}</button>`;
  document.getElementById('confirmOkBtn').onclick=()=>{closeConfirm();if(onConfirm)onConfirm();};
  document.getElementById('confirmModal').style.display='flex';
}
function closeConfirm(){document.getElementById('confirmModal').style.display='none';}

// ─── DELETE ───────────────────────────────────────────────
function confirmDelete(id){
  const row=allReports.find(r=>r.id===id);if(!row)return;
  showConfirm({
    icon:'🗑️',title:'Eliminar Reporte',
    msg:`¿Estás seguro de que deseas eliminar este reporte? Esta acción <strong>no se puede deshacer</strong>.`,
    detail:`${row.folio} — ${row.nombreParte} | ${row.fecha}`,
    confirmLabel:'Sí, eliminar',confirmClass:'btn-danger',
    onConfirm:()=>deleteReport(id),
  });
}
function deleteReport(id){
  allReports=allReports.filter(r=>r.id!==id);
  renderTable();
  showToast('success','🗑️ Reporte eliminado correctamente.');
  if(currentDetailId===id) goList();
}

// ─── TOAST ────────────────────────────────────────────────
function showToast(type,msg,dur=3500){
  const c=document.getElementById('toastContainer'),t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span>${{success:'✅',error:'❌',info:'ℹ️'}[type]||'•'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(30px)';t.style.transition='all .3s';setTimeout(()=>t.remove(),300);},dur);
}

// ════════════════════════════════════════════════════════
// SHARED FORM LOGIC (ADD & EDIT)
// ════════════════════════════════════════════════════════
let formData={};
let formErrors={};
let formMode='add'; // 'add' | 'edit'
let editingId=null;

function resetForm(source){
  formData=source?deepClone(source):{
    folio:'',items:1,planta:'',clienteCobro:'',turno:'',fecha:'',
    numeroParte:'',nombreParte:'',incidents:[],piezasInspeccionadas:0,
    piezasOk:0,piezasNg:0,piezasRecuperadas:0,piezasScrap:0,
    rateTihType:'rate',rateTih:0,horasReporte:0,tipoServicio:'',
    reviso:'',ingeniero:'',idioma:'E',firmado:false,
    region:'',semanal:'',cotizacion:'',
    lotes:[],fechasLotes:[],series:[],
  };
  formErrors={};
  updateItemArrays();
}

function updateItemArrays(){
  const n=parseInt(formData.items)||1;
  formData.lotes=Array.from({length:n},(_,i)=>formData.lotes[i]||{item:i+1,lote:''});
  formData.fechasLotes=Array.from({length:n},(_,i)=>formData.fechasLotes[i]||{item:i+1,fecha:''});
  formData.series=Array.from({length:n},(_,i)=>formData.series[i]||{item:i+1,serie:''});
}

function recalc(){
  const ng=formData.incidents.reduce((a,b)=>a+(parseInt(b.count)||0),0);
  formData.piezasNg=ng;
  formData.piezasOk=(parseInt(formData.piezasInspeccionadas)||0)-ng;
  if(formData.rateTihType==='rate'&&parseFloat(formData.rateTih)>0)
    formData.horasReporte=parseFloat(((parseInt(formData.piezasInspeccionadas)||0)/parseFloat(formData.rateTih)).toFixed(2));
}

function refreshCalcFields(){
  recalc();
  const bodyId=formMode==='add'?'addModalBody':'editModalBody';
  const inputs=document.getElementById(bodyId).querySelectorAll('input[type=number][readonly]');
  if(inputs[0]) inputs[0].value=formData.piezasOk;
  if(inputs[1]) inputs[1].value=formData.piezasNg;
  if(inputs[2]) inputs[2].value=formData.horasReporte;
}

const REQUIRED_FIELDS=[
  {key:'cotizacion',label:'Cotización'},{key:'planta',label:'Planta'},
  {key:'clienteCobro',label:'Cliente Cobro'},{key:'turno',label:'Turno'},
  {key:'fecha',label:'Fecha'},{key:'numeroParte',label:'Número de Parte'},
  {key:'nombreParte',label:'Nombre de Parte'},{key:'tipoServicio',label:'Tipo de Servicio'},
  {key:'reviso',label:'Revisó'},{key:'ingeniero',label:'Ingeniero'},
  {key:'region',label:'Región'},
];
function validate(){
  formErrors={};
  REQUIRED_FIELDS.forEach(f=>{const v=formData[f.key];if(!v||String(v).trim()==='')formErrors[f.key]=`${f.label} es requerido`;});
  if((parseInt(formData.piezasInspeccionadas)||0)<=0) formErrors.piezasInspeccionadas='Piezas inspeccionadas debe ser mayor a 0';
  if(formData.incidents.length===0) formErrors.incidents='Agrega al menos un incidente';
  if(formData.rateTih===''||formData.rateTih===null||formData.rateTih===undefined) formErrors.rateTih='Rate/TIH es requerido';
  return Object.keys(formErrors).length===0;
}

// ─── FORM FIELD SETTERS ───────────────────────────────────
function setField(k,v){formData[k]=v;}
function setFieldItems(v){formData.items=parseInt(v)||1;updateItemArrays();renderCurrentModal();}
function setFieldCalc(k,v){formData[k]=parseFloat(v)||0;refreshCalcFields();}
function setRateType(v){
  formData.rateTihType=v;formData.rateTih=v==='rate'?0:'';recalc();renderCurrentModal();
}
function renderCurrentModal(){
  if(formMode==='add') renderFormInto('addModalBody');
  else renderFormInto('editModalBody');
}

// ─── INCIDENTS ────────────────────────────────────────────
function addIncident(){
  const inp=document.getElementById('newIncidentInput');
  const label=inp.value.trim();if(!label)return;
  formData.incidents.push({id:'ci_'+uid(),label,count:0});
  inp.value='';
  document.getElementById('incidentList').innerHTML=renderIncidentList();
  recalc();
}
function removeIncident(id){
  formData.incidents=formData.incidents.filter(i=>i.id!==id);
  document.getElementById('incidentList').innerHTML=renderIncidentList();
  recalc();refreshCalcFields();
}
function updateIncidentCount(id,val){
  const inc=formData.incidents.find(i=>i.id===id);
  if(inc){inc.count=parseInt(val)||0;recalc();refreshCalcFields();}
}
function renderIncidentList(){
  if(!formData.incidents.length) return '<div style="font-size:11px;color:var(--text3);padding:8px 0">Sin incidentes. Escribe un nombre y haz clic en + Agregar.</div>';
  return formData.incidents.map(inc=>`
    <div class="incident-item">
      <input type="checkbox" checked disabled style="opacity:.5"/>
      <label>${inc.label}</label>
      <input type="number" min="0" value="${inc.count||0}" oninput="updateIncidentCount('${inc.id}',this.value)" placeholder="Cant."/>
      <button class="incident-item-del" onclick="removeIncident('${inc.id}')" title="Eliminar">✕</button>
    </div>`).join('');
}

// ─── AUTOCOMPLETE (cotización) ────────────────────────────
function onCotizacionInput(val){
  formData.cotizacion=val;
  const drop=document.getElementById('cotDrop'),hint=document.getElementById('cotHint');
  if(!val){drop.style.display='none';hint.innerHTML='';return;}
  const matches=allReports.filter(r=>r.cotizacion&&r.cotizacion.toLowerCase().includes(val.toLowerCase())&&r.id!==editingId).slice(0,6);
  drop.style.display=matches.length?'block':'none';
  drop.innerHTML=matches.map(r=>`<div class="autocomplete-item" onclick="selectCotizacion('${r.cotizacion}')">${r.cotizacion} — ${r.clienteCobro} | ${r.planta}</div>`).join('');
  const exact=allReports.find(r=>r.cotizacion&&r.cotizacion.toLowerCase()===val.toLowerCase()&&r.id!==editingId);
  hint.innerHTML=exact?`<span class="autocomplete-hint">✨ Datos disponibles de ${exact.clienteCobro}</span>`:'';
}
function selectCotizacion(cot){
  formData.cotizacion=cot;
  document.getElementById('cotDrop').style.display='none';
  const match=allReports.find(r=>r.cotizacion&&r.cotizacion.toLowerCase()===cot.toLowerCase()&&r.id!==editingId);
  if(match){
    formData.clienteCobro=match.clienteCobro;formData.planta=match.planta;
    formData.numeroParte=match.numeroParte;formData.nombreParte=match.nombreParte;
    formData.tipoServicio=match.tipoServicio;formData.region=match.region||'';
    formData.incidents=match.incidents.map(inc=>({...inc,count:0}));
    showToast('success',`✨ Datos autocompletados desde cotización ${cot}`);
  }
  renderCurrentModal();
}

// ─── SHARED FORM HTML ─────────────────────────────────────
function renderFormInto(containerId){
  const fd=formData,fe=formErrors;
  const hasLotes=fd.lotes.some(l=>l.lote),hasFechas=fd.fechasLotes.some(f=>f.fecha),hasSeries=fd.series.some(s=>s.serie);
  const valSummary=Object.keys(fe).length?`<div class="validation-summary"><strong>Corrige los siguientes campos:</strong><ul>${Object.values(fe).map(e=>`<li>${e}</li>`).join('')}</ul></div>`:'';
  const weeks=['','S-01','S-02','S-03','S-04','S-05','S-06','S-07','S-08','S-09','S-10','S-11','S-12','S-13','S-14','S-15','S-16','S-17','S-18','S-19','S-20','S-21','S-22','S-23','S-24','S-25','S-26','S-27','S-28','S-29','S-30','S-31','S-32','S-33','S-34','S-35','S-36','S-37','S-38','S-39','S-40','S-41','S-42','S-43','S-44','S-45','S-46','S-47','S-48','S-49','S-50','S-51','S-52'];
  document.getElementById(containerId).innerHTML=`
    ${valSummary}
    <div class="form-section">
      <div class="form-section-title">🏷️ Identificación</div>
      <div class="form-grid">
        <div class="field-group">
          <label class="field-label">Cotización <span style="color:var(--red)">*</span></label>
          <div class="autocomplete-wrap">
            <input type="text" id="cotDrop_inp" value="${fd.cotizacion}" placeholder="COT-..." oninput="onCotizacionInput(this.value)"/>
            <div id="cotDrop" class="autocomplete-drop" style="display:none"></div>
          </div>
          ${fe.cotizacion?`<div class="err-msg">⚠ ${fe.cotizacion}</div>`:''}
          <div id="cotHint" style="margin-top:4px"></div>
        </div>
        <div class="field-group">
          <label class="field-label">Folio <span style="color:var(--text3);font-size:10px">(opcional)</span></label>
          <input type="text" value="${fd.folio}" placeholder="F-0001" oninput="setField('folio',this.value)"/>
        </div>
        <div class="field-group">
          <label class="field-label">Planta <span style="color:var(--red)">*</span></label>
          <select class="${fe.planta?'error':''}" onchange="setField('planta',this.value)">
            <option value="">Seleccionar...</option>
            ${PLANTS.map(p=>`<option ${fd.planta===p?'selected':''}>${p}</option>`).join('')}
          </select>${fe.planta?`<div class="err-msg">⚠ ${fe.planta}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Cliente Cobro <span style="color:var(--red)">*</span></label>
          <input type="text" class="${fe.clienteCobro?'error':''}" value="${fd.clienteCobro}" oninput="setField('clienteCobro',this.value)"/>
          ${fe.clienteCobro?`<div class="err-msg">⚠ ${fe.clienteCobro}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Turno <span style="color:var(--red)">*</span></label>
          <select class="${fe.turno?'error':''}" onchange="setField('turno',this.value)">
            <option value="">Seleccionar...</option>
            ${TURNS.map(t=>`<option ${fd.turno===t?'selected':''}>${t}</option>`).join('')}
          </select>${fe.turno?`<div class="err-msg">⚠ ${fe.turno}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Fecha <span style="color:var(--red)">*</span></label>
          <input type="date" class="${fe.fecha?'error':''}" value="${fd.fecha}" onchange="setField('fecha',this.value)"/>
          ${fe.fecha?`<div class="err-msg">⚠ ${fe.fecha}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">No. Parte <span style="color:var(--red)">*</span></label>
          <input type="text" class="${fe.numeroParte?'error':''}" value="${fd.numeroParte}" oninput="setField('numeroParte',this.value)"/>
          ${fe.numeroParte?`<div class="err-msg">⚠ ${fe.numeroParte}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Nombre Parte <span style="color:var(--red)">*</span></label>
          <input type="text" class="${fe.nombreParte?'error':''}" value="${fd.nombreParte}" oninput="setField('nombreParte',this.value)"/>
          ${fe.nombreParte?`<div class="err-msg">⚠ ${fe.nombreParte}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Semanal</label>
          <select onchange="setField('semanal',this.value)">
            ${weeks.map(w=>`<option value="${w}" ${fd.semanal===w?'selected':''}>${w||'Sin asignar'}</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Cant. Items <span style="color:var(--red)">*</span></label>
          <input type="number" min="1" max="30" value="${fd.items}" onchange="setFieldItems(this.value)"/>
        </div>
        <div class="field-group">
          <label class="field-label">Tipo de Servicio <span style="color:var(--red)">*</span></label>
          <select class="${fe.tipoServicio?'error':''}" onchange="setField('tipoServicio',this.value)">
            <option value="">Seleccionar...</option>
            ${SERVICE_TYPES.map(s=>`<option ${fd.tipoServicio===s?'selected':''}>${s}</option>`).join('')}
          </select>${fe.tipoServicio?`<div class="err-msg">⚠ ${fe.tipoServicio}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Región <span style="color:var(--red)">*</span>
            <span style="font-size:9px;font-weight:400;color:var(--text3);margin-left:4px">(catálogo temporal)</span>
          </label>
          <select class="${fe.region?'error':''}" onchange="setField('region',this.value)">
            <option value="">Seleccionar región...</option>
            ${REGIONS.map(r=>`<option value="${r}" ${fd.region===r?'selected':''}>${r}</option>`).join('')}
          </select>${fe.region?`<div class="err-msg">⚠ ${fe.region}</div>`:''}
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">⚠️ Incidentes</div>
      ${fe.incidents?`<div class="err-msg" style="margin-bottom:8px">⚠ ${fe.incidents}</div>`:''}
      <div class="incident-add-row">
        <input type="text" id="newIncidentInput" placeholder="Nombre del incidente..." onkeydown="if(event.key==='Enter')addIncident()"/>
        <button class="btn btn-ghost btn-sm" onclick="addIncident()">+ Agregar</button>
      </div>
      <div class="incident-list" id="incidentList">${renderIncidentList()}</div>
    </div>

    <div class="form-section">
      <div class="form-section-title">📦 Cantidades</div>
      <div class="form-grid-3">
        <div class="field-group">
          <label class="field-label">Pzas Inspeccionadas <span style="color:var(--red)">*</span></label>
          <input type="number" min="0" class="${fe.piezasInspeccionadas?'error':''}" value="${fd.piezasInspeccionadas}" oninput="setFieldCalc('piezasInspeccionadas',this.value)"/>
          ${fe.piezasInspeccionadas?`<div class="err-msg">⚠ ${fe.piezasInspeccionadas}</div>`:''}
        </div>
        <div class="field-group"><label class="field-label">Pzas OK <small style="color:var(--text3)">(auto)</small></label><input type="number" value="${fd.piezasOk}" readonly/></div>
        <div class="field-group"><label class="field-label">Pzas NG <small style="color:var(--text3)">(auto)</small></label><input type="number" value="${fd.piezasNg}" readonly/></div>
        <div class="field-group">
          <label class="field-label">Pzas Recuperadas <span style="color:var(--red)">*</span></label>
          <input type="number" min="0" value="${fd.piezasRecuperadas}" oninput="setField('piezasRecuperadas',parseInt(this.value)||0)"/>
        </div>
        <div class="field-group">
          <label class="field-label">Pzas Scrap <span style="color:var(--red)">*</span></label>
          <input type="number" min="0" value="${fd.piezasScrap}" oninput="setField('piezasScrap',parseInt(this.value)||0)"/>
        </div>
        <div class="field-group">
          <label class="field-label">Tipo Rate/TIH</label>
          <select onchange="setRateType(this.value)">
            <option value="rate" ${fd.rateTihType==='rate'?'selected':''}>⚙️ Rate (numérico)</option>
            <option value="tih" ${fd.rateTihType==='tih'?'selected':''}>📋 TIH (texto)</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Rate / TIH <span style="color:var(--red)">*</span></label>
          ${fd.rateTihType==='rate'
            ?`<input type="number" min="0" class="${fe.rateTih?'error':''}" value="${fd.rateTih}" oninput="setFieldCalc('rateTih',this.value)"/>`
            :`<input type="text" class="${fe.rateTih?'error':''}" value="${fd.rateTih||''}" placeholder="Ej: TIH-45" oninput="setField('rateTih',this.value)"/>`}
          ${fe.rateTih?`<div class="err-msg">⚠ ${fe.rateTih}</div>`:''}
        </div>
        <div class="field-group"><label class="field-label">Horas Reporte <small style="color:var(--text3)">(auto)</small></label><input type="number" value="${fd.horasReporte}" readonly/></div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">👤 Responsables y Control</div>
      <div class="form-grid">
        <div class="field-group">
          <label class="field-label">Revisó <span style="color:var(--red)">*</span></label>
          <input type="text" class="${fe.reviso?'error':''}" value="${fd.reviso}" oninput="setField('reviso',this.value)"/>
          ${fe.reviso?`<div class="err-msg">⚠ ${fe.reviso}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Ingeniero <span style="color:var(--red)">*</span></label>
          <input type="text" class="${fe.ingeniero?'error':''}" value="${fd.ingeniero}" oninput="setField('ingeniero',this.value)"/>
          ${fe.ingeniero?`<div class="err-msg">⚠ ${fe.ingeniero}</div>`:''}
        </div>
        <div class="field-group">
          <label class="field-label">Idioma</label>
          <select onchange="setField('idioma',this.value)">
            <option value="E" ${fd.idioma==='E'?'selected':''}>🇲🇽 Español (E)</option>
            <option value="I" ${fd.idioma==='I'?'selected':''}>🇺🇸 Inglés (I)</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Firmado</label>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
            <input type="checkbox" id="f_firmado" ${fd.firmado?'checked':''} onchange="setField('firmado',this.checked)"/>
            <label for="f_firmado" style="font-size:12px;cursor:pointer">Documento firmado</label>
          </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">🗃️ Datos por Item (${fd.items} items)</div>
      <div style="display:flex;gap:9px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="openItemsModal('lotes')">📦 Lotes ${hasLotes?'<span class="badge badge-green" style="margin-left:4px">✓</span>':''}</button>
        <button class="btn btn-ghost btn-sm" onclick="openItemsModal('fechas')">📅 Fechas ${hasFechas?'<span class="badge badge-green" style="margin-left:4px">✓</span>':''}</button>
        <button class="btn btn-ghost btn-sm" onclick="openItemsModal('series')">🔢 Series ${hasSeries?'<span class="badge badge-green" style="margin-left:4px">✓</span>':''}</button>
      </div>
    </div>`;
}

// ─── ADD MODAL ────────────────────────────────────────────
function openAddModal(){
  formMode='add';editingId=null;
  resetForm();
  renderFormInto('addModalBody');
  document.getElementById('addModal').style.display='flex';
}
function closeAddModal(){document.getElementById('addModal').style.display='none';}

async function submitReport(){
  if(!validate()){renderCurrentModal();document.getElementById('addModalBody').scrollTop=0;return;}
  const btn=document.getElementById('submitBtn');btn.disabled=true;btn.textContent='⏳ Enviando...';
  await sleep(900);
  const ng=formData.incidents.reduce((a,b)=>a+(parseInt(b.count)||0),0);
  const payload={...deepClone(formData),id:uid(),folio:formData.folio||`F-${Date.now()}`,piezasNg:ng,piezasOk:(parseInt(formData.piezasInspeccionadas)||0)-ng};
  console.log('📤 JSON al backend:',JSON.stringify(payload,null,2));
  allReports.unshift(payload);renderTable();closeAddModal();
  showToast('success','✅ Reporte guardado y enviado al backend.');
  btn.disabled=false;btn.textContent='📤 Guardar y Enviar';
}

// ─── EDIT MODAL ───────────────────────────────────────────
function openEditModal(id){
  const row=allReports.find(r=>r.id===id);if(!row)return;
  formMode='edit';editingId=id;
  resetForm(row);
  document.getElementById('editModalTitle').textContent=`✏️ Editar — ${row.folio||row.id}`;
  renderFormInto('editModalBody');
  document.getElementById('editModal').style.display='flex';
}
function editFromDetail(){if(currentDetailId)openEditModal(currentDetailId);}

function askCloseEdit(){
  showConfirm({
    icon:'⚠️',title:'¿Descartar cambios?',
    msg:'Si cierras ahora, los cambios no guardados se perderán.',
    confirmLabel:'Sí, descartar',confirmClass:'btn-danger',
    onConfirm:()=>{document.getElementById('editModal').style.display='none';},
  });
}

async function submitEdit(){
  if(!validate()){renderCurrentModal();document.getElementById('editModalBody').scrollTop=0;return;}
  const ng=formData.incidents.reduce((a,b)=>a+(parseInt(b.count)||0),0);
  const updated={...deepClone(formData),id:editingId,piezasNg:ng,piezasOk:(parseInt(formData.piezasInspeccionadas)||0)-ng};

  showConfirm({
    icon:'💾',title:'Confirmar cambios',
    msg:`¿Guardar los cambios realizados al reporte <strong>${updated.folio||editingId}</strong>?`,
    detail:`${updated.nombreParte} | ${updated.fecha} | ${updated.planta}`,
    confirmLabel:'Sí, guardar',confirmClass:'btn-warning',
    onConfirm:async()=>{
      const btn=document.getElementById('editSubmitBtn');
      if(btn){btn.disabled=true;btn.textContent='⏳ Guardando...';}
      await sleep(700);
      const idx=allReports.findIndex(r=>r.id===editingId);
      if(idx!==-1) allReports[idx]=updated;
      renderTable();
      document.getElementById('editModal').style.display='none';
      showToast('success','💾 Reporte actualizado correctamente.');
      if(currentDetailId===editingId) renderDetailPage(editingId);
      if(btn){btn.disabled=false;btn.textContent='💾 Guardar Cambios';}
    },
  });
}

// ─── ITEMS SUB-MODAL ─────────────────────────────────────
let itemsModalCtx=null;
function openItemsModal(type){
  const cfg={lotes:{fieldKey:'lote',title:'📦 Capturar Lotes',dataKey:'lotes'},fechas:{fieldKey:'fecha',title:'📅 Capturar Fechas',dataKey:'fechasLotes'},series:{fieldKey:'serie',title:'🔢 Capturar Series',dataKey:'series'}};
  itemsModalCtx={...cfg[type],type};
  document.getElementById('itemsModalTitle').textContent=itemsModalCtx.title;
  renderItemsModal();
  document.getElementById('itemsModal').style.display='flex';
}
function closeItemsModal(){document.getElementById('itemsModal').style.display='none';}
function renderItemsModal(){
  const{dataKey,fieldKey,title}=itemsModalCtx,data=formData[dataKey];
  document.getElementById('itemsModalBody').innerHTML=`
    <div class="prepend-box">
      <div class="prepend-check-row">
        <input type="checkbox" id="prependChk" onchange="togglePrepend(this.checked)"/>
        <label for="prependChk" style="cursor:pointer;font-weight:600">Anteponer texto a todos los campos</label>
      </div>
      <div id="prependRow" style="display:none">
        <div class="prepend-row">
          <input type="text" id="prependText" placeholder="Texto a anteponer..."/>
          <button class="btn btn-primary btn-sm" onclick="applyPrepend()">Aplicar</button>
        </div>
        <div style="font-size:10px;color:var(--text3);margin-top:5px">Se concatena al inicio. Ej: "ABC" + "123" → "ABC123"</div>
      </div>
    </div>
    <div class="items-grid">
      ${data.map((d,i)=>`<div class="item-input-row"><span class="item-num">Item ${i+1}:</span><input type="text" id="item_${i}" value="${d[fieldKey]||''}" placeholder="${title.replace(/[📦📅🔢]\s/,'')} para item ${i+1}"/></div>`).join('')}
    </div>`;
}
function togglePrepend(c){document.getElementById('prependRow').style.display=c?'block':'none';}
function applyPrepend(){
  const text=document.getElementById('prependText').value;if(!text)return;
  const n=formData[itemsModalCtx.dataKey].length;
  for(let i=0;i<n;i++){const inp=document.getElementById(`item_${i}`);if(inp)inp.value=text+inp.value;}
}
function saveItemsModal(){
  const{dataKey,fieldKey}=itemsModalCtx,n=formData[dataKey].length;
  for(let i=0;i<n;i++){const inp=document.getElementById(`item_${i}`);if(inp)formData[dataKey][i][fieldKey]=inp.value;}
  closeItemsModal();renderCurrentModal();showToast('info','✅ Datos guardados.');
}

// ─── DETAIL PAGE ─────────────────────────────────────────
function renderDetailPage(id){
  const r=allReports.find(x=>x.id===id);
  if(!r){document.getElementById('detailContent').innerHTML='<div class="empty-state"><div class="empty-icon">❌</div><p>Reporte no encontrado</p></div>';return;}
  document.getElementById('detailEditBtn').setAttribute('onclick',`editFromDetail()`);
  const totalNg=r.incidents.reduce((a,b)=>a+b.count,0);
  const pct=r.piezasInspeccionadas>0?((r.piezasOk/r.piezasInspeccionadas)*100).toFixed(1):0;

  document.getElementById('detailContent').innerHTML=`
    <button class="detail-back" onclick="goList()">← Regresar a lista de reportes</button>

    <div class="detail-hero">
      <div>
        <div class="detail-hero-title">${r.folio||r.id}</div>
        <div class="detail-hero-sub">${r.nombreParte} — ${r.numeroParte}</div>
        <div class="detail-hero-badges">
          <span class="detail-hero-badge">📅 ${r.fecha}</span>
          <span class="detail-hero-badge">🏭 ${r.planta}</span>
          <span class="detail-hero-badge">⏰ ${r.turno}</span>
          <span class="detail-hero-badge">${r.tipoServicio}</span>
          ${r.semanal?`<span class="detail-hero-badge">📆 ${r.semanal}</span>`:''}
          ${r.region?`<span class="detail-hero-badge">📍 ${r.region}</span>`:''}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
        ${r.firmado?'<span class="detail-hero-badge">✓ Firmado</span>':'<span style="background:rgba(220,38,38,.3);border:1px solid rgba(220,38,38,.4);color:#fff;border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700">✗ Sin firmar</span>'}
        <span class="detail-hero-badge">${r.idioma==='E'?'🇲🇽 Español':'🇺🇸 Inglés'}</span>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Piezas Inspeccionadas</div>
        <div class="kpi-value" style="color:var(--text)">${r.piezasInspeccionadas.toLocaleString('es-MX')}</div>
        <div class="kpi-sub">Total del lote</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Piezas OK</div>
        <div class="kpi-value" style="color:var(--green)">${r.piezasOk.toLocaleString('es-MX')}</div>
        <div class="kpi-sub">${pct}% del total</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Piezas NG</div>
        <div class="kpi-value" style="color:var(--red)">${r.piezasNg.toLocaleString('es-MX')}</div>
        <div class="kpi-sub">${r.piezasInspeccionadas>0?((r.piezasNg/r.piezasInspeccionadas)*100).toFixed(1):0}% defectos</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Piezas Recuperadas</div>
        <div class="kpi-value" style="color:var(--yellow)">${r.piezasRecuperadas.toLocaleString('es-MX')}</div>
        <div class="kpi-sub">De las NG</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Piezas Scrap</div>
        <div class="kpi-value" style="color:var(--red)">${r.piezasScrap.toLocaleString('es-MX')}</div>
        <div class="kpi-sub">Desecho final</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Horas en Reporte</div>
        <div class="kpi-value" style="color:var(--accent)">${r.horasReporte}</div>
        <div class="kpi-sub">${r.rateTihType==='rate'?`Rate: ${r.rateTih}`:`TIH: ${r.rateTih}`}</div>
      </div>
    </div>

    <!-- IDENTIFICATION & RESPONSIBILITY -->
    <div class="detail-grid">
      <div class="detail-card">
        <div class="detail-card-title">📋 Información General</div>
        ${[['Folio',r.folio||'—'],['Cotización',r.cotizacion],['Cliente Cobro',r.clienteCobro],['No. Parte',r.numeroParte],['Nombre Parte',r.nombreParte],['Planta',r.planta],['Turno',r.turno],['Fecha',r.fecha],['Región',r.region||'—'],['Semanal',r.semanal||'—'],['Cant. Items',r.items],['Tipo Servicio',r.tipoServicio]].map(([k,v])=>`
          <div class="detail-row"><span class="detail-row-key">${k}</span><span class="detail-row-val">${v}</span></div>`).join('')}
      </div>
      <div class="detail-card">
        <div class="detail-card-title">👤 Responsables</div>
        ${[['Revisó',r.reviso],['Ingeniero',r.ingeniero]].map(([k,v])=>`
          <div class="detail-row"><span class="detail-row-key">${k}</span><span class="detail-row-val">${v}</span></div>`).join('')}
        <div class="detail-row"><span class="detail-row-key">Idioma</span><span class="detail-row-val">${r.idioma==='E'?'🇲🇽 Español':'🇺🇸 Inglés'}</span></div>
        <div class="detail-row"><span class="detail-row-key">Firmado</span><span class="detail-row-val">${r.firmado?'<span class="badge badge-green">✓ Sí</span>':'<span class="badge badge-red">✗ No</span>'}</span></div>
        <div class="detail-card-title" style="margin-top:18px">⚙️ Producción</div>
        <div class="detail-row"><span class="detail-row-key">Rate/TIH</span><span class="detail-row-val">${r.rateTih} <span class="badge ${r.rateTihType==='rate'?'badge-gray':'badge-purple'}" style="margin-left:4px">${r.rateTihType==='rate'?'Rate':'TIH'}</span></span></div>
        <div class="detail-row"><span class="detail-row-key">Horas en Reporte</span><span class="detail-row-val">${r.horasReporte}</span></div>
      </div>
    </div>

    <!-- INCIDENTS -->
    <div class="detail-card" style="margin-bottom:14px">
      <div class="detail-card-title">⚠️ Incidentes Detectados (${r.incidents.length} tipos — ${totalNg} total)</div>
      ${r.incidents.length?r.incidents.map(inc=>`
        <div class="incident-detail-row">
          <span style="font-weight:600;font-size:13px">${inc.label}</span>
          <span class="badge badge-red">${inc.count} piezas</span>
        </div>`).join(''):'<div style="color:var(--text3);font-size:12px;padding:8px 0">Sin incidentes registrados.</div>'}
    </div>

    <!-- LOTES / FECHAS / SERIES -->
    ${(r.lotes.some(l=>l.lote)||r.fechasLotes.some(f=>f.fecha)||r.series.some(s=>s.serie))?`
    <div class="detail-grid-3">
      ${r.lotes.some(l=>l.lote)?`<div class="detail-card"><div class="detail-card-title">📦 Lotes por Item</div>${r.lotes.map(l=>`<div class="item-detail-row"><span class="item-detail-num">Item ${l.item}</span><span class="item-detail-val">${l.lote||'—'}</span></div>`).join('')}</div>`:''}
      ${r.fechasLotes.some(f=>f.fecha)?`<div class="detail-card"><div class="detail-card-title">📅 Fechas por Item</div>${r.fechasLotes.map(f=>`<div class="item-detail-row"><span class="item-detail-num">Item ${f.item}</span><span class="item-detail-val">${f.fecha||'—'}</span></div>`).join('')}</div>`:''}
      ${r.series.some(s=>s.serie)?`<div class="detail-card"><div class="detail-card-title">🔢 Series por Item</div>${r.series.map(s=>`<div class="item-detail-row"><span class="item-detail-num">Item ${s.item}</span><span class="item-detail-val">${s.serie||'—'}</span></div>`).join('')}</div>`:''}
    </div>`:''}

    <!-- ACTIONS FOOTER -->
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-danger" onclick="confirmDelete('${r.id}')">🗑 Eliminar Reporte</button>
      <button class="btn btn-warning" onclick="openEditModal('${r.id}')">✏️ Editar Reporte</button>
    </div>
  `;
}

// ─── INIT ────────────────────────────────────────────────
renderFilters();
renderTable();