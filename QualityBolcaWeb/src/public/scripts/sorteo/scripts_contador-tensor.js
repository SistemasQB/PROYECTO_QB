// ── Estado global ──────────────────────────────────────────
  let count = 0, meta = 100, startTime = Date.now();
  let metaAlerted = false, warn75Alerted = false;
  let cameraActive = false, capturesCount = 0;
  let stream = null;
  let enviando =false

  // ── Reloj & timer ─────────────────────────────────────────
  function tick() {
    const now = new Date();
    document.getElementById('clock-top').textContent = now.toLocaleTimeString('es-MX');
    document.getElementById('date-foot').textContent = now.toLocaleDateString('es-MX', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
    const e = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(e/3600)).padStart(2,'0');
    const m = String(Math.floor((e%3600)/60)).padStart(2,'0');
    const s = String(e%60).padStart(2,'0');
    document.getElementById('elapsed-top').textContent = `${h}:${m}:${s}`;

    if (e > 5 && count > 0 && count < meta) {
      const rem = meta - count;
      const secLeft = Math.round((rem / count) * e);
      const eh = String(Math.floor(secLeft/3600)).padStart(2,'0');
      const em = String(Math.floor((secLeft%3600)/60)).padStart(2,'0');
      document.getElementById('st-eta').textContent = `~${eh}:${em} horas`;
      document.getElementById('st-eta').className = 's-val ' + (secLeft < 1800 ? 'orange' : 'blue');
    }
  }
  setInterval(tick, 1000); tick();

  // ── Actualizar UI ──────────────────────────────────────────
  function updateUI() {
    const pct = Math.min(100, (count / meta) * 100);
    const rest = Math.max(0, meta - count);

    document.getElementById('main-num').textContent = count;
    document.getElementById('k-count').textContent = count;
    document.getElementById('k-meta').textContent = meta;
    document.getElementById('k-rest').textContent = rest;
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-fill').className = 'fill' + (pct >= 100 ? ' complete' : '');
    document.getElementById('prog-txt').textContent = `${count} / ${meta}`;
    document.getElementById('pct-chip').textContent = pct.toFixed(1) + '%';
    document.getElementById('st-avance').textContent = pct.toFixed(1) + '%';
    document.getElementById('st-avance').className = 's-val ' + (pct >= 100 ? 'green' : pct >= 75 ? 'orange' : 'blue');

    if (pct >= 100) {
      document.getElementById('st-estado').textContent = '✓ Meta Lograda';
      document.getElementById('st-estado').className = 's-val green';
      if (!metaAlerted) { showToast('🎯 ¡Meta de producción alcanzada!', 'success'); metaAlerted = true; }
    } else if (pct >= 75) {
      document.getElementById('st-estado').textContent = '● En Progreso';
      document.getElementById('st-estado').className = 's-val orange';
      if (!warn75Alerted) { showToast('⚡ 75% de la meta completada', 'warn'); warn75Alerted = true; }
    } else {
      document.getElementById('st-estado').textContent = '● Operando';
      document.getElementById('st-estado').className = 's-val green';
    }
  }

  // ── Contador +1 (único botón de incremento) ────────────────
  // El conteo ahora se incrementa desde el botón de captura
  function add(n) {
    const prev = count;
    count = Math.max(0, count + n);
    if (count === prev) return;

    const el = document.getElementById('main-num');
    el.classList.remove('pop', 'sub-pop');
    void el.offsetWidth;
    el.classList.add(n > 0 ? 'pop' : 'sub-pop');
    setTimeout(() => el.classList.remove('pop', 'sub-pop'), 250);

    const now = new Date().toLocaleTimeString('es-MX');
    const type = n > 0 ? 'add' : 'sub';
    const label = n > 0 ? `+${n} pieza(s)` : `${n} pieza(s)`;
    addHist(type, label, now);
    updateUI();
  }

  function applyMeta() {
    const nm = parseInt(document.getElementById('inp-meta').value);
    const nt = document.getElementById('inp-turno').value.trim();
    if (nm > 0) { meta = nm; metaAlerted = false; warn75Alerted = false; }
    if (nt) document.getElementById('shift-badge').textContent = nt;
    showToast('✅ Configuración aplicada', 'success');
    updateUI();
  }

  function addHist(type, label, time) {
    const list = document.getElementById('hist-list');
    if (list.querySelector('.hist-empty')) list.innerHTML = '';
    const item = document.createElement('div');
    item.className = `hist-item ${type}`;
    item.innerHTML = `<span class="hist-action">${label}</span><span class="hist-time">${time}</span>`;
    list.insertBefore(item, list.firstChild);
    if (list.children.length > 40) list.removeChild(list.lastChild);
  }

  // ── CÁMARA ────────────────────────────────────────────────
  //1280 * 720
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 800 }, height: { ideal: 600 }, facingMode: {ideal:'environment'} },
        audio: false
      });
      const video = document.getElementById('video');
      video.srcObject = stream;
      video.style.display = 'block';
      document.getElementById('cam-placeholder').style.display = 'none';
      document.getElementById('cam-status').classList.add('visible');
      document.getElementById('btn-start-cam').style.display = 'none';
      document.getElementById('btn-capture').disabled = false;
      document.getElementById('cam-dot').classList.add('active');
      document.getElementById('st-cam').textContent = '● Activa';
      document.getElementById('st-cam').className = 's-val green';
      cameraActive = true;
      showToast('📷 Cámara iniciada correctamente', 'info');
      // setTimeout(() => detectar(), 1000);
      
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      document.getElementById('st-cam').textContent = 'Error de acceso';
      document.getElementById('st-cam').className = 's-val red';
      showToast('❌ No se pudo acceder a la cámara', 'error');
    }
  }

  // ── CAPTURA + FORMDATA ────────────────────────────────────
  document.getElementById('btn-capture').addEventListener('click', (e) => {
    e.target.disabled = true;
   captureAndSend()   
  });

  async function captureAndSend() {
    if (!cameraActive) return;
    if (enviando) return;
    enviando = true
    // const video  = document.getElementById('video');
    // const canvas = document.getElementById('canvas');
    // const ctx    = canvas.getContext('2d');
    // detectar()
    // Ajustar canvas al tamaño real del video
    // canvas.width  = video.videoWidth  || 640;
    // canvas.height = video.videoHeight || 480;
    // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // // Mostrar miniatura de la captura
    // const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    // document.getElementById('preview-img').src = dataUrl;
    // document.getElementById('capture-preview').classList.add('visible');

    // Actualizar estado visual
    const video  = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const statusEl = document.getElementById('capture-status');
    statusEl.textContent = '⏳ Enviando...';
    statusEl.className = 'capture-status sending';
    document.getElementById('btn-capture').disabled = true;


    // ── Construir FormData ────────────────────────────────
    canvas.toBlob(async (blob) => {
      const timestamp = new Date().toISOString();
      const turno     = document.getElementById('inp-turno').value.trim() || 'Turno 1';
      const endpoint  = 'http://localhost:3000/sorteo/evaluacion-produccion'
      //document.getElementById('inp-url').value.trim();

      const formData = new FormData();
      formData.append('imagen',     blob, `captura_${Date.now()}.jpg`);
      // formData.append('contador',   count.toString());
      // formData.append('meta',       meta.toString());
      // formData.append('turno',      turno);
      // formData.append('timestamp',  timestamp);
      // formData.append('linea',      document.querySelector('.line-editable').value);
      formData.append('tipo',      'predecir');

      // ── Envío al servidor ─────────────────────────────
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers:{
              'X-CSRF-Token': toki,
          }
          // No establecer Content-Type manualmente — fetch lo gestiona con el boundary
        });
        
        switch (typeof response){
          case 'object':
            const data = await response.json();
            toki = data.tok
            console.log(data);
          default:
            console.log(response);
        }
        
        if (response.ok) {
          capturesCount++;
          document.getElementById('st-captures').textContent = capturesCount;
          statusEl.textContent = `✓ Enviada a las ${new Date().toLocaleTimeString('es-MX')}`;
          statusEl.className = 'capture-status';
          // Incrementar contador al capturar exitosamente
          add(1);
          addHist('capture', `📸 Captura #${capturesCount} enviada`, new Date().toLocaleTimeString('es-MX'));
          showToast('📸 Imagen capturada y enviada', 'success');
          enviando = false
        } else {
          enviando = false
          throw new Error(`HTTP ${response.status}`);
        } 
      } catch (err) {
        console.error('Error al enviar la imagen:', err.message);
        statusEl.textContent = `✗ Error al enviar: ${err.message}`;
        statusEl.className = 'capture-status error';
        showToast('❌ Error al enviar la imagen', 'error');
        enviando = false
      } finally {
        // Re-habilitar botón tras 1.5 s
        setTimeout(() => {
          document.getElementById('btn-capture').disabled = false;
        }, 1500);
      }
    }, 'image/jpeg', 0.92);
  }

  // ── Toast ─────────────────────────────────────────────────
  function showToast(msg, type) {
    const wrap = document.getElementById('toast-wrap');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success:'✅', warn:'⚡', info:'📷', error:'❌' };
    t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      t.style.transition = 'all 0.3s';
      setTimeout(() => t.remove(), 300);
    }, 3500);
  }

  // ── Teclado ───────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); add(1); }
    else if (e.key === 'ArrowDown') add(-1);
    else if ((e.key === 'c' || e.key === 'C') && cameraActive) captureAndSend();
  });

  document.getElementById('inp-meta').addEventListener('keydown', e => {
    if (e.key === 'Enter') applyMeta();
  });

  async function detectar() {
  const img = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = img.width || 640;
  canvas.height = img.height || 480;

  // Dibujar la imagen en el canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Cargar modelo
  const model = await cocoSsd.load();
  const predictions = await model.detect(img);

  // Dibujar resultados sobre la imagen
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.font = "16px Arial";
  ctx.fillStyle = "green";

  predictions.forEach(p => {
    const [x, y, w, h] = p.bbox;
    ctx.strokeRect(x, y, w, h);
    ctx.fillText(`${p.class} (${(p.score*100).toFixed(1)}%)`, x, y > 10 ? y-5 : 10);
  });
  const dataurl = canvas.toDataURL('image/jpeg', 0.92);
  document.getElementById('preview-img').src = dataurl;
  document.getElementById('capture-preview').classList.add('visible');  
}
  updateUI();