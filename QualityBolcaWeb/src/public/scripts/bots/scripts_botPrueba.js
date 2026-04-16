(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

  /* ============================================================
     TEMA
     ============================================================ */
  const SVG_SUN  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Zm0 15.75a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM5.106 17.834a.75.75 0 0 0 1.06 1.06l1.592-1.59a.75.75 0 1 0-1.061-1.06l-1.591 1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM5.25 12a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1 0-1.5H4.5a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.591 1.591ZM6.166 5.106a.75.75 0 0 0-1.06 1.06l1.59 1.591a.75.75 0 1 0 1.061-1.06L6.166 5.106ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z"/></svg>`;
  const SVG_MOON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd"/></svg>`;

  const THEME_BTN_IDS = ['theme-btn', 'theme-btn-cap', 'theme-btn-done'];

  function applyTheme(light) {
    document.body.classList.toggle('light', light);
    const icon = light ? SVG_MOON : SVG_SUN;
    THEME_BTN_IDS.forEach(id => { const el = $(id); if (el) el.innerHTML = icon; });
    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) metaTheme.content = light ? '#edf2f8' : '#0f1928';
  }

  const savedTheme = localStorage.getItem('theme');
  const prefLight  = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme !== null ? savedTheme === 'light' : prefLight);

  THEME_BTN_IDS.forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener('click', () => {
      const nowLight = document.body.classList.toggle('light');
      applyTheme(nowLight);
      localStorage.setItem('theme', nowLight ? 'light' : 'dark');
    });
  });

  /* ============================================================
     PANTALLAS
     ============================================================ */
  const SCREENS = ['screen-welcome', 'screen-capture', 'screen-done'];

  function showScreen(id) {
    SCREENS.forEach(sid => $(sid).classList.toggle('hidden', sid !== id));
    // El botón de ayuda solo aparece en bienvenida
    const hb = $('help-btn');
    if (hb) hb.classList.toggle('hidden', id !== 'screen-welcome');
  }

  /* ============================================================
     TTS – síntesis de voz
     ============================================================ */
  const synth = window.speechSynthesis ?? null;
  let _bestVoice = null;

  function pickBestVoice() {
    const voices = synth.getVoices();
    if (!voices.length) return null;
    const checks = [
      v => /google/i.test(v.name) && /es[-_](MX|mx)/.test(v.lang),
      v => /google/i.test(v.name) && /es[-_](US|us)/.test(v.lang),
      v => /google/i.test(v.name) && /es[-_]419/.test(v.lang),
      v => /google/i.test(v.name) && v.lang.startsWith('es'),
      v => /natural|enhanced|premium/i.test(v.name) && v.lang.startsWith('es'),
      v => /es[-_](MX|mx)/.test(v.lang),
      v => /es[-_](US|us)/.test(v.lang),
      v => v.lang.startsWith('es'),
    ];
    for (const check of checks) { const f = voices.find(check); if (f) return f; }
    return null;
  }

  function toPhonetic(text) {
    return text.replace(/Quality Bolca/gi, 'Cuáliti Bolca');
  }

  function speak(text, opts = {}) {
    return new Promise(resolve => {
      if (!synth) { resolve(); return; }
      synth.cancel();

      const doSpeak = () => {
        _bestVoice = pickBestVoice() || _bestVoice;
        if (!_bestVoice) console.warn('[QB-TTS] No se encontró voz en español. Instala "Google Text-to-speech" con el paquete de voz Español (México) en Ajustes → Accesibilidad → Texto a voz.');
        const utter   = new SpeechSynthesisUtterance(toPhonetic(text));
        utter.lang    = 'es-MX';
        utter.rate    = opts.rate  ?? 1.40;
        utter.pitch   = opts.pitch ?? 1.05;
        utter.volume  = 1;
        if (_bestVoice) utter.voice = _bestVoice;
        utter.onend   = () => resolve();
        utter.onerror = () => resolve();
        synth.speak(utter);
      };

      if (synth.getVoices().length === 0) {
        const h = () => { synth.removeEventListener('voiceschanged', h); _bestVoice = pickBestVoice(); doSpeak(); };
        synth.addEventListener('voiceschanged', h);
        setTimeout(() => { synth.removeEventListener('voiceschanged', h); doSpeak(); }, 1000);
      } else {
        doSpeak();
      }
    });
  }

  function stopSpeaking() { if (synth) synth.cancel(); }

  if (synth) {
    if (synth.getVoices().length > 0) _bestVoice = pickBestVoice();
    else synth.addEventListener('voiceschanged', () => { _bestVoice = pickBestVoice(); }, { once: true });
  }

  /* ============================================================
     STT – reconocimiento de voz
     ============================================================ */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let activeRecognition = null;

  function startListening() {
    return new Promise((resolve, reject) => {
      if (!SpeechRecognition) { reject(new Error('NO_SPEECH_API')); return; }
      const rec = new SpeechRecognition();
      activeRecognition = rec;
      rec.lang = 'es-MX'; rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 1;

      let settled = false;
      const settle = fn => { if (settled) return; settled = true; activeRecognition = null; fn(); };

      rec.onresult = e => settle(() => resolve(e.results[0][0].transcript.trim()));
      rec.onerror  = e => {
        if      (e.error === 'not-allowed') settle(() => reject(new Error('MIC_DENIED')));
        else if (e.error === 'no-speech')   settle(() => resolve(''));
        else                                settle(() => reject(new Error(e.error)));
      };
      rec.onend = () => settle(() => resolve(''));
      try { rec.start(); } catch (err) { settle(() => reject(err)); }
    });
  }

  function stopListening() {
    if (activeRecognition) { try { activeRecognition.stop(); } catch (_) {} activeRecognition = null; }
  }

  /* ============================================================
     PERMISOS DE MICRÓFONO
     ============================================================ */
  const MIC_SESSION_KEY = 'qb_mic_granted';

  function showPermModal() {
    return new Promise(resolve => {
      $('perm-overlay').classList.remove('hidden');
      function onGrant()  { cleanup(); resolve(true);  }
      function onCancel() { cleanup(); resolve(false); }
      function cleanup() {
        $('perm-overlay').classList.add('hidden');
        $('perm-grant').removeEventListener('click', onGrant);
        $('perm-cancel').removeEventListener('click', onCancel);
      }
      $('perm-grant').addEventListener('click', onGrant);
      $('perm-cancel').addEventListener('click', onCancel);
    });
  }

  async function requestMicFromBrowser() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      sessionStorage.setItem(MIC_SESSION_KEY, '1');
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') showMicError('denegado');
      else if (err.name === 'NotFoundError') showMicError('no-encontrado');
      else showMicError('error');
      return false;
    }
  }

  async function ensureMicPermission() {
    if (sessionStorage.getItem(MIC_SESSION_KEY) === '1') return true;
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        if (status.state === 'granted') { sessionStorage.setItem(MIC_SESSION_KEY, '1'); return true; }
        if (status.state === 'denied')  { showMicError('denegado'); return false; }
      } catch (_) {}
    }
    const userAccepted = await showPermModal();
    if (!userAccepted) return false;
    return requestMicFromBrowser();
  }

  function showMicError(reason) {
    const msgs = {
      'denegado':      'El acceso al micrófono fue denegado. Toque el candado en la barra del navegador, busque Micrófono y seleccione Permitir. Luego recargue la página.',
      'no-encontrado': 'No se encontró ningún micrófono en este dispositivo. Conecte un micrófono e intente de nuevo.',
      'error':         'Ocurrió un problema al acceder al micrófono. Verifique que no esté siendo usado por otra aplicación.',
    };
    $('error-body').textContent = msgs[reason] ?? msgs['error'];
    $('error-overlay').classList.remove('hidden');
  }

  $('error-dismiss').addEventListener('click', () => $('error-overlay').classList.add('hidden'));

  /* ============================================================
     CAMPOS DEL ENCABEZADO
     ============================================================ */
  const CAMPOS = [
    { key: 'planta',       label: 'Planta',                tts: 'Indica la planta:' },
    { key: 'cliente',      label: 'Cliente',               tts: 'Indica el cliente:' },
    { key: 'supervisor',   label: 'Nombre del Supervisor', tts: 'Indica el nombre del Supervisor:' },
    { key: 'turno',        label: 'Turno',                 tts: 'Indica el turno:',
      normalize: 'turno' },
    { key: 'numeroParte',  label: 'Número de parte',       tts: 'Indica el número de parte, carácter por carácter.',
      normalize: 'alphanumeric' },
    { key: 'nombreParte',  label: 'Nombre de la parte',    tts: 'Indica el nombre de la parte:' },
    { key: 'tipoServicio', label: 'Tipo de servicio',      tts: 'Indica el tipo de servicio: Selección o Retrabajo.',
      normalize: 'tipoServicio' },
  ];

  /* ============================================================
     NORMALIZACIÓN DE CAMPOS
     Convierte el texto bruto del STT al formato correcto
     usando IA (vía /bot/normalize) o reglas locales.
     ============================================================ */
  const NORMALIZE_HINTS = {
    cotizacion:
      'El dato es un código de cotización con formato exacto OA-NNNNN-CO-NNNNN ' +
      '(letras OA, guion, 5 dígitos, guion, letras CO, guion, 5 dígitos). ' +
      'Ejemplo: "OA cero uno dos tres cuatro CO cero cinco seis siete ocho" → OA-01234-CO-05678. ' +
      'Rellena con ceros a la izquierda hasta completar 5 dígitos en cada grupo. ' +
      'Devuelve SOLO el código en formato OA-NNNNN-CO-NNNNN.',

    alphanumeric:
      'El texto fue dictado por voz y representa un código alfanumérico de formato VARIABLE ' +
      '(longitud y estructura no fijas; no asumas ningún formato específico). ' +
      'El usuario puede deletrear letras por su nombre en español. Mapeo completo: ' +
      'A=A, Be=B, Ce=C, De=D, Efe=F, Ge=G, Hache=H, I=I, Jota=J, Ka=K, Ele=L, Eme=M, ' +
      'Ene=N, O=O, Pe=P, Cu=Q, Erre=R, Ese=S, Te=T, U=U, Uve=V, Doble U=W, Equis=X, ' +
      'I griega=Y, Ye=Y, Zeta=Z. ' +
      'Los números se dicen uno por uno ("dos cero tres" → 203) o en grupo ("cuarenta y dos" → 42). ' +
      '"Guión" o "guion" representa el carácter -. ' +
      'REGLA CRÍTICA: transcribe EXACTAMENTE el orden dictado por el usuario. ' +
      'NO rellenes con ceros, NO cambies la longitud, NO reordenes caracteres. ' +
      'Devuelve SOLO el código resultante en mayúsculas, sin espacios.',
  };

  function normalizeTurno(text) {
    const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (/prim|^uno$|^1$/.test(t))  return 'Primero';
    if (/seg|^dos$|^2$/.test(t))   return 'Segundo';
    if (/ter|^tres$|^3$/.test(t))  return 'Tercero';
    return text;
  }

  function normalizeTipoServicio(text) {
    const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (/selec/.test(t)) return 'Selección';
    // cubre: "retrabajo", "retabajo", "corre trabajo", "corretrabajo", "trabajo", "retrab*"
    if (/retrab|retab|retrav|retran|corre.{0,4}trab|\btrabajo\b/.test(t)) return 'Retrabajo';
    return text;
  }

  async function normalizeValue(transcript, type) {
    if (type === 'turno')        return normalizeTurno(transcript);
    if (type === 'tipoServicio') return normalizeTipoServicio(transcript);

    const hint = NORMALIZE_HINTS[type];
    if (!hint) return transcript;

    const res = await fetch('/bot/normalize', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
      body:    JSON.stringify({ transcript, hint }),
    });
    if (!res.ok) throw new Error('normalize_error');
    const data = await res.json();
    return data.normalized || transcript;
  }

  /* ============================================================
     COTIZACIÓN – stub API
     Cuando la ruta esté disponible, reemplazar el return por la
     llamada real: POST /api/cotizaciones/verificar { codigo }
     Respuesta esperada: { ok: true, data: { planta, cliente, ... } }
                      ó: { ok: false }
     ============================================================ */
  async function verificarCotizacion(codigo) {
    try {
      const res = await fetch('/api/cotizaciones/verificar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body:    JSON.stringify({ codigo }),
      });
      if (!res.ok) return { ok: false };
      return await res.json();
    } catch (_) { return { ok: false }; }
  }

  /* ============================================================
     ESTADO GLOBAL
     ============================================================ */
  let state             = createInitialState();
  let captureGen        = 0;     // se incrementa en cada cancelación/nueva captura
  let _activeDictRec    = null;  // referencia al reconocimiento de dictado continuo
  let _cotizacionStep   = false; // true mientras se está preguntando la cotización

  function createInitialState() {
    return {
      report:       {},    // campos del encabezado
      rawItemsText: null,  // texto bruto acumulado de lotes
      items:        [],    // items estructurados validados por IA
      cotizacion:   null,  // código de cotización (si se usó)
      fieldsDone:   0,     // campos de encabezado completados
      aborted:      false,
    };
  }

  /* ============================================================
     PERSISTENCIA (sessionStorage)
     ============================================================ */
  const PROGRESS_KEY = 'qb_progress';

  function saveProgress() {
    if (state.fieldsDone === 0 && !state.rawItemsText) return;
    try {
      sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({
        report:       state.report,
        rawItemsText: state.rawItemsText,
        items:        state.items,
        cotizacion:   state.cotizacion,
        fieldsDone:   state.fieldsDone,
      }));
    } catch (_) {}
  }

  function loadProgress() {
    try { return JSON.parse(sessionStorage.getItem(PROGRESS_KEY) ?? 'null'); }
    catch { return null; }
  }

  function clearProgress() { sessionStorage.removeItem(PROGRESS_KEY); }

  /* ============================================================
     REPORTE FINALIZADO (memoria principal del inspector)
     ============================================================ */
  const LAST_REPORT_KEY = 'qb_last_report';

  function saveLastReport() {
    try {
      localStorage.setItem(LAST_REPORT_KEY, JSON.stringify({
        report:     state.report,
        items:      state.items,
        cotizacion: state.cotizacion,
        savedAt:    new Date().toISOString(),
        sent:       false,
      }));
    } catch (_) {}
  }

  function loadLastReport() {
    try { return JSON.parse(localStorage.getItem(LAST_REPORT_KEY) ?? 'null'); }
    catch { return null; }
  }

  function markLastReportSent() {
    try {
      const r = loadLastReport();
      if (r) { r.sent = true; localStorage.setItem(LAST_REPORT_KEY, JSON.stringify(r)); }
    } catch (_) {}
  }

  /* ============================================================
     MODAL: RETOMAR CAPTURA GUARDADA
     ============================================================ */
  function offerResume(saved) {
    return new Promise(resolve => {
      const lines = [];
      if (saved.cotizacion)       lines.push(`Cotización: ${saved.cotizacion}`);
      if (saved.report.planta)    lines.push(`Planta: ${saved.report.planta}`);
      if (saved.report.cliente)   lines.push(`Cliente: ${saved.report.cliente}`);
      if (saved.rawItemsText)     lines.push('Lotes: dictados');

      $('resume-preview').innerHTML = lines.length
        ? lines.map(l => escHtml(l)).join('<br>')
        : 'Datos parciales guardados.';

      $('resume-overlay').classList.remove('hidden');

      function onContinue() { $('resume-overlay').classList.add('hidden'); cleanup(); resolve('resume'); }
      function onNew()      { $('resume-overlay').classList.add('hidden'); cleanup(); resolve('new'); }
      function cleanup() {
        $('resume-continue').removeEventListener('click', onContinue);
        $('resume-new').removeEventListener('click', onNew);
      }
      $('resume-continue').addEventListener('click', onContinue);
      $('resume-new').addEventListener('click', onNew);
    });
  }

  /* ============================================================
     MODAL: CONFIRMAR CANCELACIÓN
     ============================================================ */
  function showCancelConfirm() {
    return new Promise(resolve => {
      $('cancel-overlay').classList.remove('hidden');
      function onYes() { $('cancel-overlay').classList.add('hidden'); cleanup(); resolve(true);  }
      function onNo()  { $('cancel-overlay').classList.add('hidden'); cleanup(); resolve(false); }
      function cleanup() {
        $('cancel-confirm-yes').removeEventListener('click', onYes);
        $('cancel-confirm-no').removeEventListener('click', onNo);
      }
      $('cancel-confirm-yes').addEventListener('click', onYes);
      $('cancel-confirm-no').addEventListener('click', onNo);
    });
  }

  /* ============================================================
     UI HELPERS
     ============================================================ */
  const elMicRing        = $('mic-ring');
  const elListeningLabel = $('listening-label');
  const elFieldLabel     = $('field-label');
  const elFieldHint      = $('field-hint');
  const elCapturedBox    = $('captured-display');
  const elCapturedValue  = $('captured-value');
  const elConfirmRow     = $('confirm-row');
  const elProgressBar    = $('progress-bar');
  const elSummaryList    = $('summary-list');
  const elLblContinue    = $('lbl-continue');
  const elLblRepeat      = $('lbl-repeat');

  function setMicState(mode) {
    elMicRing.classList.toggle('listening', mode === 'listening');
    elMicRing.classList.toggle('speaking',  mode === 'speaking');
    elListeningLabel.textContent =
      mode === 'listening' ? 'Escuchando…' :
      mode === 'speaking'  ? 'Atención…'   : '';
  }

  function setCurrentField(label, hint) {
    elFieldLabel.textContent = label ?? '';
    elFieldHint.textContent  = hint  ?? '';
  }

  function showCaptured(value) {
    elCapturedValue.textContent = value;
    elCapturedBox.classList.remove('hidden');
  }

  function hideCaptured() {
    elCapturedBox.classList.add('hidden');
    elCapturedValue.textContent = '';
  }

  function setConfirmButtons(continueLbl, repeatLbl) {
    elLblContinue.textContent = continueLbl ?? 'Continuar';
    elLblRepeat.textContent   = repeatLbl   ?? 'Repetir';
    elConfirmRow.classList.remove('hidden');
  }

  function hideConfirmButtons() {
    elConfirmRow.classList.add('hidden');
    elLblContinue.textContent = 'Continuar';
    elLblRepeat.textContent   = 'Repetir';
  }

  function updateProgress(done, total) {
    elProgressBar.style.width = total > 0 ? Math.round((done / total) * 100) + '%' : '0%';
  }

  function updateSummary() {
    let html = '';

    // ── Fila de cotización ──
    // Visible cuando: se está preguntando (activa), ya fue capturada (llena),
    // o el paso ya terminó aunque se haya omitido (fieldsDone > 0).
    const showCotRow = _cotizacionStep || !!state.cotizacion || state.fieldsDone > 0;
    if (showCotRow) {
      const cotFilled  = !!state.cotizacion;
      const cotActive  = _cotizacionStep && !cotFilled;
      const cotSkipped = !cotFilled && !cotActive; // omitida
      const rowClass   = cotFilled  ? 'row-filled' : cotActive ? 'row-active' : 'row-empty';
      const valClass   = cotFilled  ? ''           : cotActive ? 'val-active' : 'val-empty';
      const valText    = cotFilled  ? escHtml(state.cotizacion) : cotActive ? 'Escuchando…' : 'Sin número';
      html += `<div class="summary-row ${rowClass}">
        <div class="summary-cell-label">Cotización</div>
        <div class="summary-cell-value ${valClass}">${valText}</div>
      </div>`;
    }

    // ── Filas de campos del encabezado, siempre visibles ──
    CAMPOS.forEach((c, i) => {
      const val      = state.report[c.key];
      const isFilled = i < state.fieldsDone && val !== undefined && val !== '';
      // Solo marcar activo si NO estamos en el paso de cotización
      const isActive = !_cotizacionStep && i === state.fieldsDone && state.fieldsDone < CAMPOS.length;
      const rowClass = isFilled ? 'row-filled' : isActive ? 'row-active' : 'row-empty';
      const valClass = isFilled ? ''           : isActive ? 'val-active' : 'val-empty';
      const valText  = isFilled ? escHtml(String(val)) : isActive ? 'Escuchando…' : '—';

      html += `<div class="summary-row ${rowClass}">
        <div class="summary-cell-label">${escHtml(c.label)}</div>
        <div class="summary-cell-value ${valClass}">${valText}</div>
      </div>`;
    });

    // ── Fila de ítems (fase de dictado) ──
    if (state.items && state.items.length > 0) {
      html += `<div class="summary-row row-filled">
        <div class="summary-cell-label">Ítems</div>
        <div class="summary-cell-value">${escHtml(String(state.items.length))} registrado(s)</div>
      </div>`;
    }

    elSummaryList.innerHTML = html;

    // Llevar la fila activa a la vista
    const activeRow = elSummaryList.querySelector('.row-active');
    if (activeRow) activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ============================================================
     UI: ZONA DE DICTADO DE LOTES
     ============================================================ */
  function showItemsDictation() {
    elCapturedBox.classList.add('hidden');
    $('mic-area').classList.add('hidden');
    $('items-dictation').classList.remove('hidden');
    $('summary-panel').classList.add('hidden');
    setCurrentField('Dictado de ítem', '');
    setMicState('idle');
  }

  function hideItemsDictation() {
    $('items-dictation').classList.add('hidden');
    $('mic-area').classList.remove('hidden');
    $('summary-panel').classList.remove('hidden');
  }

  function updateItemsText(text) {
    const box = $('items-text-box');
    if (text) {
      box.classList.add('has-text');
      box.innerHTML = text;
    } else {
      box.classList.remove('has-text');
      box.innerHTML = '<span class="items-placeholder">Toca el micrófono para comenzar…</span>';
    }
  }

  /* ============================================================
     WAITFORCHOICE – botones como promesas
     ============================================================ */
  let _onContinue = null;
  let _onRepeat   = null;

  $('btn-continue').addEventListener('click', () => {
    if (_onContinue) { const cb = _onContinue; _onContinue = null; _onRepeat = null; cb('continue'); }
  });
  $('btn-repeat').addEventListener('click', () => {
    if (_onRepeat) { const cb = _onRepeat; _onContinue = null; _onRepeat = null; cb('repeat'); }
  });

  function waitForChoice(opts = {}) {
    return new Promise(resolve => {
      setConfirmButtons(opts.continueLbl, opts.repeatLbl);
      _onContinue = resolve;
      _onRepeat   = resolve;
    });
  }

  function flushPendingChoice() {
    if (_onContinue) { const cb = _onContinue; _onContinue = null; _onRepeat = null; cb('__abort__'); }
  }

  /* ============================================================
     CAPTURA DE CAMPO INDIVIDUAL
     Prompt corto → escucha → "¿Es correcto?" → Continuar / Repetir
     ============================================================ */
  async function captureField(label, ttsPrompt, gen, normalizeType = null) {
    const aborted = () => state.aborted || captureGen !== gen;

    while (true) {
      if (aborted()) return null;

      setCurrentField(label);
      hideCaptured();
      hideConfirmButtons();
      setMicState('speaking');
      await speak(ttsPrompt);

      if (aborted()) return null;

      setMicState('listening');
      let transcript = '';

      try {
        transcript = await startListening();
      } catch (err) {
        setMicState('idle');
        if (err.message === 'MIC_DENIED') { showMicError('denegado'); return null; }
        setMicState('speaking');
        await speak('No escuché nada, repítelo.');
        if (aborted()) return null;
        continue;
      }

      setMicState('idle');

      if (!transcript) {
        setMicState('speaking');
        await speak('No escuché nada, repítelo.');
        if (aborted()) return null;
        continue;
      }

      if (aborted()) return null;

      // Normalizar el valor antes de mostrarlo al usuario
      let finalValue = transcript;
      if (normalizeType) {
        if (normalizeType === 'turno') {
          finalValue = normalizeTurno(transcript);
        } else {
          // Normalización con IA: mostrar estado de espera visual
          setCurrentField(label, 'Normalizando…');
          setMicState('speaking');
          try {
            finalValue = await normalizeValue(transcript, normalizeType);
          } catch (_) {
            finalValue = transcript; // fallback al texto bruto si falla la IA
          }
          if (aborted()) return null;
        }
      }

      // Mostrar valor capturado y esperar confirmación
      showCaptured(finalValue);
      setCurrentField(label, 'Capturado — Solo lectura');
      setMicState('idle');

      const decision = await waitForChoice();
      if (aborted() || decision === '__abort__') return null;

      if (decision === 'continue') {
        hideConfirmButtons();
        return finalValue;
      }
      // 'repeat' → vuelve a preguntar desde el inicio del campo
    }
  }

  /* ============================================================
     DICTACIÓN CONTINUA DE LOTES Y VALIDACIÓN EN VIVO
     ============================================================ */
  async function captureItemsRaw(gen) {
    showItemsDictation();

    return new Promise(resolve => {
      let accumulated = '';
      let running     = false;
      let dictRec     = null;
      const aborted   = () => state.aborted || captureGen !== gen;

      function setMicBtn(active) {
        const btn = $('items-mic-btn');
        const lbl = $('items-mic-lbl');
        btn.classList.toggle('items-mic-active', active);
        lbl.textContent = active ? 'Detener' : 'Iniciar dictado';
        setMicState(active ? 'listening' : 'idle');
      }

      // Lanza una sesión corta (continuous:false) y encadena la siguiente automáticamente.
      // Cada sesión es una "oración" enviada limpia a Google Cloud — misma técnica que
      // captureField, que funciona sin duplicados. Se concatenan los finales en accumulated.
      function launchSession() {
        if (!running || aborted()) {
          running = false; _activeDictRec = null;
          if (aborted()) resolve(null);
          return;
        }

        const rec = new SpeechRecognition();
        dictRec = rec;
        _activeDictRec = rec;
        rec.lang = 'es-MX';
        rec.continuous = false;   // ← sesiones cortas: sin los bugs de continuous:true
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        let sessionFinal = '';

        rec.onresult = e => {
          sessionFinal = '';
          let interim  = '';
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) sessionFinal += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
          }
          // Muestra lo acumulado + lo que se está reconociendo ahora
          const preview = [accumulated, sessionFinal || interim].filter(Boolean).join(' ');
          updateItemsText(preview);
        };

        rec.onend = () => {
          dictRec = null; _activeDictRec = null;
          if (sessionFinal.trim()) {
            accumulated = [accumulated, sessionFinal.trim()].filter(Boolean).join(' ');
            updateItemsText(accumulated);
          }
          // Encadenar la siguiente sesión si el dictado sigue activo
          if (running && !aborted()) setTimeout(launchSession, 250);
          else { running = false; if (aborted()) resolve(null); }
        };

        rec.onerror = e => {
          dictRec = null; _activeDictRec = null;
          if (e.error === 'not-allowed') {
            running = false; stopDictation(); hideItemsDictation(); resolve(null);
          } else if (running && !aborted()) {
            // no-speech u otro error transitorio: reintentar
            setTimeout(launchSession, 300);
          }
        };

        try { rec.start(); } catch (_) {
          dictRec = null; _activeDictRec = null;
          if (running && !aborted()) setTimeout(launchSession, 500);
          else running = false;
        }
      }

      function startDictation() {
        if (!SpeechRecognition || running) return;
        running = true;
        setMicBtn(true);
        launchSession();
      }

      async function stopDictation() {
        running = false;
        if (dictRec) { try { dictRec.stop(); } catch (_) {} dictRec = null; _activeDictRec = null; }
        setMicBtn(false);

        if (aborted()) { hideItemsDictation(); resolve(null); return; }
        if (!accumulated.trim()) return;

        // Validación en vivo con IA
        setCurrentField('Analizando texto...', 'Enviando dictado al sistema');
        setConfirmButtons(' ', ' ');
        $('confirm-row').classList.add('hidden');
        setMicState('speaking');

        const promptContext =
          'Cabecera del reporte: Planta ' + (state.report.planta || '--') +
          ', Cliente ' + (state.report.cliente || '--') +
          ', Tipo de servicio: ' + (state.report.tipoServicio || '--') +
          ', Número de parte: ' + (state.report.numeroParte || '--') +
          '. El inspector ha dictado los datos del siguiente ítem. ' +
          'Recuerda: el inspector indica cada identificador diciendo primero el tipo ' +
          '(Lote, Serie, RAN, Fecha de producción, Fecha de arribo) y luego el valor. ' +
          'Dictado: "' + accumulated.trim() + '"';

        try {
          const res = await fetch('/bot/chat', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body:    JSON.stringify({ messages: [{ role: 'user', content: promptContext }] }),
          });
          const data = await res.json();

          if (data.type === 'missing') {
            setMicState('idle');
            const missingFields = data.missingFields ?? [];

            // Construir display estructurado con campos en rojo
            let displayHtml = '<div class="missing-header">Datos con problemas</div>';
            if (missingFields.length) {
              displayHtml += '<div class="missing-field-list">';
              missingFields.forEach(f => {
                displayHtml += `<div class="missing-field">
                  <span class="missing-field-icon">✗</span>
                  <span class="missing-field-name">${escHtml(f)}</span>
                </div>`;
              });
              displayHtml += '</div>';
            }
            if (data.reply) {
              displayHtml += `<div class="missing-reply">${escHtml(data.reply)}</div>`;
            }
            updateItemsText(displayHtml);
            setCurrentField('Datos con problemas', 'Agrega lo que falta');

            // TTS: leer campos faltantes
            const ttsMsg = missingFields.length
              ? 'Faltan: ' + missingFields.join(', ') + '. Toca Agregar y dicta solo esos datos.'
              : 'Aclaración requerida. ' + (data.reply ?? '');
            await speak(ttsMsg);

            const discardLblMissing = state.items.length > 0 ? 'Finalizar reporte' : 'Reiniciar ítem';
            setConfirmButtons('Agregar datos', discardLblMissing);

            // "Agregar datos": conserva accumulated y dicta solo lo faltante
            _onContinue = () => {
              _onContinue = null; _onRepeat = null;
              hideConfirmButtons();
              updateItemsText('');
              const hint = missingFields.length ? missingFields.join(' · ') : 'Dicta los datos faltantes';
              setCurrentField('Dicta lo que falta', hint);
              setTimeout(() => { if (!aborted()) startDictation(); }, 300);
            };

            // Descarte: si hay ítems → finalizar; si no → reiniciar ítem
            _onRepeat = () => {
              _onContinue = null; _onRepeat = null;
              hideConfirmButtons();
              accumulated = '';
              updateItemsText('');
              if (state.items.length > 0) {
                hideItemsDictation();
                resolve('finish');
              } else {
                setCurrentField('Dictado de ítem', 'Dicta el ítem desde el inicio');
              }
            };

          } else if (data.type === 'report' && data.report && data.report.items && data.report.items.length > 0) {
            setMicState('idle');
            const nextNum = state.items.length + 1;
            data.report.items.forEach((it, i) => {
              state.items.push({ item: nextNum + i, ...it });
            });
            state.rawItemsText = (state.rawItemsText ? state.rawItemsText + ' | ' : '') + accumulated.trim();
            updateSummary();
            saveProgress();

            setCurrentField('¡Ítem Registrado!', 'Todo cuadra perfectamente');
            updateItemsText('<span style="color:#2ecc71;font-weight:bold;">✔ Ítem registrado con éxito.</span>');
            await speak('Ítem procesado correctamente. Puedes añadir otro, o finalizar el reporte.');

            setConfirmButtons('Añadir otro ítem', 'Finalizar Reporte');
            _onContinue = () => {
              _onContinue = null; _onRepeat = null;
              hideConfirmButtons();
              accumulated = '';
              updateItemsText('');
              setCurrentField('Dictado de ítem', 'Escuchando…');
              // Auto-arranque: el inspector no necesita tocar el botón de mic
              setTimeout(() => { if (!aborted()) startDictation(); }, 300);
            };
            _onRepeat = () => {
              _onContinue = null; _onRepeat = null;
              hideConfirmButtons();
              hideItemsDictation();
              resolve('finish');
            };

          } else {
            throw new Error('Respuesta inválida del servidor');
          }

        } catch (err) {
          setMicState('idle');
          setCurrentField('Error de conexión', 'No se pudo analizar el dictado');
          const discardLblErr = state.items.length > 0 ? 'Finalizar reporte' : 'Descartar ítem';
          setConfirmButtons('Reintentar', discardLblErr);
          _onContinue = () => {
            _onContinue = null; _onRepeat = null;
            hideConfirmButtons();
            stopDictation();
          };
          // Descarte: si hay ítems → finalizar; si no → reiniciar ítem
          _onRepeat = () => {
            _onContinue = null; _onRepeat = null;
            hideConfirmButtons();
            accumulated = '';
            updateItemsText('');
            if (state.items.length > 0) {
              hideItemsDictation();
              resolve('finish');
            } else {
              setCurrentField('Dictado de ítem', 'Dicta el ítem desde el inicio');
            }
          };
        }
      }

      $('items-mic-btn').onclick = () => running ? stopDictation() : startDictation();

      if (!state.items || state.items.length === 0) {
        speak('Dicta el ítem en orden: primero los identificadores, por ejemplo Lote jota cuarenta y dos, Serie mil doscientos. Luego el total de piezas. Luego las piezas NG. Luego recuperadas y scrap si aplica. Al final las incidencias. Toca Detener cuando termines.')
          .then(() => {
            // Breve pausa para que el STT anterior termine de cerrar antes de iniciar el nuevo
            setTimeout(() => { if (!aborted()) startDictation(); }, 400);
          });
      } else {
        // Hay ítems ya registrados (resume) — preguntar antes de auto-iniciar
        const n = state.items.length;
        const lbl = n === 1 ? '1 ítem registrado' : `${n} ítems registrados`;
        speak(`Tiene ${lbl}. ¿Desea agregar otro ítem o finalizar el reporte?`)
          .then(() => {
            if (aborted()) { resolve(null); return; }
            setMicState('idle');
            setCurrentField(lbl, '¿Qué desea hacer?');
            setConfirmButtons('Agregar ítem', 'Finalizar reporte');
            _onContinue = () => {
              _onContinue = null; _onRepeat = null;
              hideConfirmButtons();
              updateItemsText('');
              setCurrentField('Dictado de ítem', 'Inicia con el siguiente ítem');
              setTimeout(() => { if (!aborted()) startDictation(); }, 300);
            };
            _onRepeat = () => {
              _onContinue = null; _onRepeat = null;
              hideConfirmButtons();
              hideItemsDictation();
              resolve('finish');
            };
          });
      }
    });
  }

  /* ============================================================
     FLUJO PRINCIPAL DE CAPTURA
     ============================================================ */
  async function runCapture() {
    const gen     = captureGen;
    const aborted = () => state.aborted || captureGen !== gen;

    const resuming = state.fieldsDone > 0 || !!state.rawItemsText;

    // Marcar paso de cotización ANTES de mostrar el resumen,
    // para que la tabla la muestre como fila activa desde el primer render.
    if (!resuming && !state.cotizacion) {
      _cotizacionStep = true;
    }

    showScreen('screen-capture');
    updateSummary();
    updateProgress(state.fieldsDone, CAMPOS.length);

    setCurrentField(resuming ? 'Retomando…' : 'Iniciando…');
    hideCaptured();
    hideConfirmButtons();
    setMicState('speaking');

    if (resuming) {
      const siguiente = state.fieldsDone < CAMPOS.length
        ? CAMPOS[state.fieldsDone].label
        : 'dictado de lotes';
      await speak(`Continuamos con: ${siguiente}.`);
    } else {
      await speak('Iniciando captura.');
    }

    if (aborted()) return;

    /* ── PASO 1: COTIZACIÓN (solo en capturas nuevas sin cotización previa) ── */
    if (_cotizacionStep) {
      setCurrentField('Cotización');
      hideCaptured();
      hideConfirmButtons();
      setMicState('speaking');
      await speak('¿Cuentas con número de cotización?');

      if (aborted()) return;
      setMicState('idle');
      const cotDec = await waitForChoice({ continueLbl: 'Sí', repeatLbl: 'No' });
      hideConfirmButtons();

      if (cotDec === 'continue') {
        const codigo = await captureField('Número de cotización', 'Indica tu número de cotización, carácter por carácter.', gen, 'cotizacion');
        if (codigo === null) return;

        state.cotizacion = codigo;
        saveProgress();

        setCurrentField('Verificando cotización…');
        hideCaptured();
        setMicState('speaking');
        await speak('Verificando.');

        const apiResult = await verificarCotizacion(codigo);

        if (apiResult.ok && apiResult.data) {
          Object.assign(state.report, apiResult.data);
          state.fieldsDone = CAMPOS.length;
          _cotizacionStep = false;
          updateSummary();
          saveProgress();
          await speak('Cotización verificada. Los datos del encabezado se cargaron automáticamente.');
        } else {
          await speak('No encontré esa cotización. Vamos a llenar los datos uno por uno.');
        }
      }

      // Paso de cotización terminado (capturada u omitida)
      _cotizacionStep = false;
      updateSummary();

      if (aborted()) return;
    }

    /* ── PASO 2: CAMPOS DEL ENCABEZADO ── */
    for (let i = state.fieldsDone; i < CAMPOS.length; i++) {
      if (aborted()) return;

      updateProgress(i, CAMPOS.length);
      state.fieldsDone = i;

      const campo = CAMPOS[i];
      const value = await captureField(campo.label, campo.tts, gen, campo.normalize ?? null);
      if (value === null) return;

      state.report[campo.key] = value;
      state.fieldsDone = i + 1;
      updateProgress(i + 1, CAMPOS.length);
      updateSummary();
      saveProgress();
    }

    if (aborted()) return;
    updateProgress(CAMPOS.length, CAMPOS.length);

    /* ── PASO 3: DICTACIÓN DE LOTES ── */
    while (true) {
      if (aborted()) return;
      const act = await captureItemsRaw(gen);
      if (act === null) return;
      if (act === 'finish') break;
    }

    /* ── FINALIZADO ── */
    if (aborted()) return;
    clearProgress();
    saveLastReport();   // guarda como reporte activo (sin enviar)
    setMicState('speaking');
    await speak('Captura completada. Revise el resumen y presione Enviar cuando esté listo.');
    showDoneScreen();
  }

  /* ============================================================
     PANTALLA DE FINALIZACIÓN
     ============================================================ */
  const CHEVRON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`;

  function showDoneScreen() {
    const summaryEl = $('done-summary');
    let html = '';

    /* ── SECCIÓN: ENCABEZADO ── */
    html += '<div class="report-section">';
    html += '<div class="report-section-header">';
    html += '<span class="report-section-title">Encabezado del Reporte</span>';
    html += '</div>';
    html += '<div class="report-header-grid">';

    if (state.cotizacion) {
      html += `<div class="report-field">
        <span class="report-field-label">Cotización</span>
        <span class="report-field-value">${escHtml(state.cotizacion)}</span>
      </div>`;
    }
    CAMPOS.forEach(c => {
      const val = state.report[c.key];
      if (val) {
        html += `<div class="report-field">
          <span class="report-field-label">${escHtml(c.label)}</span>
          <span class="report-field-value">${escHtml(val)}</span>
        </div>`;
      }
    });

    html += '</div></div>';

    /* ── SECCIÓN: ÍTEMS ── */
    const hasItems = state.items && state.items.length > 0;
    const hasRaw   = !!state.rawItemsText;

    if (hasItems || hasRaw) {
      html += '<div class="report-section">';
      html += '<div class="report-section-header">';
      html += '<span class="report-section-title">Ítems Registrados</span>';
      if (hasItems) html += `<span class="report-section-count">${state.items.length}</span>`;
      html += '</div>';
      html += '<div class="items-list">';

      if (hasItems) {
        const ID_LABELS = { lote: 'Lote', serie: 'Serie', ran: 'RAN', fechaProduccion: 'F.Prod', fechaArribo: 'F.Arribo' };

        state.items.forEach(it => {
          // Construir etiqueta de identificadores
          let idStr = '';
          if (it.identificadores && typeof it.identificadores === 'object') {
            idStr = Object.entries(it.identificadores)
              .filter(([, v]) => v)
              .map(([k, v]) => `${ID_LABELS[k] ?? k}: ${v}`)
              .join(' | ');
          } else if (it.identificador) {
            idStr = String(it.identificador);
          }

          // item-card sin clase "expanded" → inicia colapsado
          html += '<div class="item-card">';

          // Cabecera clicable del ítem (siempre visible)
          html += '<div class="item-card-header">';
          html += `<span class="item-num">${escHtml(String(it.item))}</span>`;
          html += `<span class="item-id">${idStr ? escHtml(idStr) : 'Ítem registrado'}</span>`;
          html += `<span class="item-collapse-icon">${CHEVRON_SVG}</span>`;
          html += '</div>';

          // Cuerpo colapsable
          html += '<div class="item-card-body">';

          // Conteos Total / OK / NG
          html += '<div class="item-counts">';
          html += `<div class="count-cell count-total">
            <span class="count-label">Total</span>
            <span class="count-val">${escHtml(String(it.totalPiezas ?? '—'))}</span>
          </div>`;
          html += `<div class="count-cell count-ok">
            <span class="count-label">OK</span>
            <span class="count-val">${escHtml(String(it.piezasOK ?? '—'))}</span>
          </div>`;
          html += `<div class="count-cell count-ng">
            <span class="count-label">NG</span>
            <span class="count-val">${escHtml(String(it.piezasNG ?? '—'))}</span>
          </div>`;
          html += '</div>';

          // Extras: recuperadas y scrap
          const extras = [];
          if (it.piezasRecuperadas) extras.push({ label: 'Recuperadas', val: it.piezasRecuperadas });
          if (it.piezasScrap)       extras.push({ label: 'Scrap',       val: it.piezasScrap });
          if (extras.length) {
            html += '<div class="item-extra">';
            extras.forEach(e => {
              html += `<div class="item-extra-field">
                <span class="item-extra-label">${escHtml(e.label)}</span>
                <span class="item-extra-val">${escHtml(String(e.val))}</span>
              </div>`;
            });
            html += '</div>';
          }

          // Defectos / incidentes
          if (it.incidentes && it.incidentes.length) {
            html += '<div class="item-defects">';
            html += '<div class="item-defects-label">Defectos</div>';
            it.incidentes.forEach(d => {
              html += `<div class="defect-row">
                <span class="defect-desc">${escHtml(d.descripcion)}</span>
                <span class="defect-qty">${escHtml(String(d.cantidad))}</span>
              </div>`;
            });
            html += '</div>';
          }

          html += '</div>'; // /item-card-body
          html += '</div>'; // /item-card
        });

      } else if (hasRaw) {
        html += `<div class="item-card">
          <div class="item-card-header">
            <span class="item-num">•</span>
            <span class="item-id">Texto dictado</span>
            <span class="item-collapse-icon">${CHEVRON_SVG}</span>
          </div>
          <div class="item-card-body" style="padding:16px;">
            <p class="summary-raw" style="font-size:15px;color:var(--text-2);line-height:1.65;">${escHtml(state.rawItemsText)}</p>
          </div>
        </div>`;
      }

      html += '</div></div>'; // /items-list /report-section
    }

    summaryEl.innerHTML = html;

    // Colapso: toggle al hacer clic en la cabecera
    summaryEl.querySelectorAll('.item-card-header').forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.item-card').classList.toggle('expanded');
      });
    });

    showScreen('screen-done');
  }

  /* ============================================================
     BOTÓN CANCELAR
     ============================================================ */
  $('cancel-btn').addEventListener('click', async () => {
    captureGen++;
    saveProgress();
    stopSpeaking();
    stopListening();
    if (_activeDictRec) { try { _activeDictRec.stop(); } catch (_) {} _activeDictRec = null; }
    _cotizacionStep = false;
    state.aborted = true;
    flushPendingChoice();

    const confirmed = await showCancelConfirm();

    if (confirmed) {
      state = createInitialState();
      showScreen('screen-welcome');
    } else {
      const saved = loadProgress();
      state = createInitialState();
      if (saved) {
        state.report       = saved.report       ?? {};
        state.rawItemsText = saved.rawItemsText ?? null;
        state.items        = saved.items        ?? [];
        state.cotizacion   = saved.cotizacion   ?? null;
        state.fieldsDone   = saved.fieldsDone   ?? 0;
      }
      runCapture().catch(console.error);
    }
  });

  /* ============================================================
     ENVÍO DE REPORTE (lógica compartida)
     ============================================================ */
  async function doSendReport() {
    const btn = $('btn-submit');
    btn.disabled    = true;
    btn.textContent = 'Enviando…';

    try {
      // TODO: reemplazar con POST real a la BD cuando esté disponible
      await new Promise(r => setTimeout(r, 1500));
      markLastReportSent();
      clearProgress();
      await speak('Reporte guardado correctamente en la base de datos. Gracias.');
      btn.textContent = 'Enviado ✓';
      return true;
    } catch (_) {
      btn.disabled    = false;
      btn.textContent = 'Enviar reporte';
      await speak('Ocurrió un problema al enviar. Intente de nuevo.');
      return false;
    }
  }

  /* ============================================================
     BOTÓN ENVIAR REPORTE
     ============================================================ */
  $('btn-submit').addEventListener('click', () => doSendReport());

  /* ============================================================
     BOTÓN NUEVO REPORTE
     ============================================================ */
  function startNewReport() {
    captureGen++;
    state.aborted = true;
    _cotizacionStep = false;
    flushPendingChoice();
    stopSpeaking();
    stopListening();
    if (_activeDictRec) { try { _activeDictRec.stop(); } catch (_) {} _activeDictRec = null; }
    clearProgress();
    state = createInitialState();
    showScreen('screen-welcome');
  }

  $('btn-new').addEventListener('click', () => {
    const lastReport = loadLastReport();
    if (lastReport && !lastReport.sent) {
      // Hay un reporte finalizado sin enviar — bloquear y avisar
      $('unsent-overlay').classList.remove('hidden');
      return;
    }
    startNewReport();
  });

  /* ---- Botones del overlay de reporte pendiente ---- */
  $('unsent-send-btn').addEventListener('click', async () => {
    $('unsent-overlay').classList.add('hidden');
    const ok = await doSendReport();
    if (ok) startNewReport();
  });

  $('unsent-cancel-btn').addEventListener('click', () => {
    $('unsent-overlay').classList.add('hidden');
  });

  /* ============================================================
     BOTÓN INICIAR CAPTURA
     ============================================================ */
  $('capture-btn').addEventListener('click', async () => {
    const hasMic = await ensureMicPermission();
    if (!hasMic) return;
    state = createInitialState();
    runCapture().catch(err => { if (!state.aborted) console.error('[QB]', err); });
  });

  /* ============================================================
     BEFOREUNLOAD
     ============================================================ */
  window.addEventListener('beforeunload', e => {
    const enCaptura = !$('screen-capture').classList.contains('hidden');
    if (enCaptura && (state.fieldsDone > 0 || !!state.rawItemsText)) {
      saveProgress();
      e.preventDefault();
      e.returnValue = '';
    }
  });

  /* ============================================================
     VERIFICAR PROGRESO GUARDADO AL CARGAR
     ============================================================ */
  (async function checkSavedProgress() {
    const saved = loadProgress();
    if (!saved || (saved.fieldsDone === 0 && !saved.rawItemsText)) return;

    const decision = await offerResume(saved);
    if (decision === 'resume') {
      const hasMic = await ensureMicPermission();
      if (!hasMic) return;
      state = createInitialState();
      state.report       = saved.report       ?? {};
      state.rawItemsText = saved.rawItemsText ?? null;
      state.items        = saved.items        ?? [];
      state.cotizacion   = saved.cotizacion   ?? null;
      state.fieldsDone   = saved.fieldsDone   ?? 0;
      runCapture().catch(console.error);
    } else {
      clearProgress();
    }
  })();

  /* ============================================================
     AYUDA – botón "?"
     ============================================================ */
  const TUTORIAL_AUDIO =
    'Este es el asistente de reportes de Cuáliti Bolca. ' +
    'Al iniciar una captura, primero se pregunta si cuentas con número de cotización. ' +
    'Si tienes cotización, dila cuando se te pida. El sistema buscará los datos y los cargará automáticamente. ' +
    'Si no tienes cotización, se pedirán los siguientes datos uno por uno: ' +
    'Planta. Cliente. Nombre del Supervisor. Turno. Número de parte. Nombre de la parte. Y tipo de servicio. ' +
    'Después del encabezado, se dictan todos los lotes de corrido en una sola grabación. ' +
    'Por ejemplo: lote A-001, dos mil piezas inspeccionadas, mil OK, cuatrocientas NG, cien SCRAP, trescientas recuperadas, ' +
    'piezas sucias trescientas noventa y nueve. Siguiente ítem. Lote B-002... ' +
    'Di "siguiente ítem" para separar los lotes. Cuando termines, toca el botón Detener. ' +
    'Revisa el resumen y toca Enviar cuando todo esté correcto.';

  let tutorialPlaying = false;

  $('help-btn').addEventListener('click', () => $('help-overlay').classList.remove('hidden'));

  $('help-close').addEventListener('click', () => {
    $('help-overlay').classList.add('hidden');
    if (tutorialPlaying) { stopSpeaking(); tutorialPlaying = false; }
  });

  $('help-audio').addEventListener('click', async () => {
    $('help-overlay').classList.add('hidden');
    tutorialPlaying = true;
    $('help-btn').classList.add('tutorial-active');
    await speak(TUTORIAL_AUDIO);
    tutorialPlaying = false;
    $('help-btn').classList.remove('tutorial-active');
  });

  // Video: en desarrollo, no hace nada aún
  $('help-video').addEventListener('click', () => {});

  /* ============================================================
     TTS DE BIENVENIDA (primer toque en la página)
     ============================================================ */
  let welcomeSaid = false;
  document.addEventListener('click', function sayWelcome() {
    if (welcomeSaid) return;
    welcomeSaid = true;
    document.removeEventListener('click', sayWelcome);
    if (!$('screen-welcome').classList.contains('hidden')) {
      speak('Bienvenido. Toca Iniciar Captura para comenzar.');
    }
  }, { once: false });

})();