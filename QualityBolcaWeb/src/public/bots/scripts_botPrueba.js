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

  function speak(text) {
    return new Promise(resolve => {
      if (!synth) { resolve(); return; }
      synth.cancel();

      const doSpeak = () => {
        _bestVoice = pickBestVoice() || _bestVoice;
        const utter   = new SpeechSynthesisUtterance(toPhonetic(text));
        utter.lang    = 'es-MX';
        utter.rate    = 1.25;
        utter.pitch   = 1.05;
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
    { key: 'turno',        label: 'Turno',                 tts: 'Indica el turno: primero, segundo o tercero.',
      normalize: 'turno' },
    { key: 'numeroParte',  label: 'Número de parte',       tts: 'Indica el número de parte, carácter por carácter.',
      normalize: 'alphanumeric' },
    { key: 'nombreParte',  label: 'Nombre de la parte',    tts: 'Indica el nombre de la parte:' },
    { key: 'tipoServicio', label: 'Tipo de servicio',      tts: 'Indica el tipo de servicio:' },
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
      'El dato es un código alfanumérico industrial (letras mayúsculas y dígitos, puede incluir guiones). ' +
      'El usuario deletrea letras por su nombre en español: ' +
      '"Doble U"=W, "A"=A, "Be"=B, "Ce"=C, "De"=D, "Eme"=M, "Ene"=N, "Pe"=P, ' +
      '"Erre"=R, "Ese"=S, "Te"=T, "Uve"=V, "Equis"=X, "I griega"=Y, "Zeta"=Z. ' +
      'Los números pueden decirse en grupos o uno por uno; interpreta según contexto. ' +
      'Ejemplo: "Doble U tres cero dos cuatro cero cinco cuatro cero uno" → W302405401. ' +
      'Ejemplo: "Pe guion uno dos tres cuatro Ave" → P-1234A. ' +
      'Devuelve SOLO el código, sin espacios adicionales.',
  };

  function normalizeTurno(text) {
    const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (/prim|^uno$|^1$/.test(t))  return 'Primero';
    if (/seg|^dos$|^2$/.test(t))   return 'Segundo';
    if (/ter|^tres$|^3$/.test(t))  return 'Tercero';
    return text; // fallback: devolver lo que dijo el usuario
  }

  async function normalizeValue(transcript, type) {
    if (type === 'turno') return normalizeTurno(transcript);

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
    // TODO: reemplazar con la ruta real cuando esté disponible
    // try {
    //   const res = await fetch('/api/cotizaciones/verificar', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
    //     body: JSON.stringify({ codigo }),
    //   });
    //   return await res.json();
    // } catch (_) { return { ok: false }; }
    return { ok: false }; // stub: siempre false para pruebas del flujo
  }

  /* ============================================================
     ESTADO GLOBAL
     ============================================================ */
  let state          = createInitialState();
  let captureGen     = 0;     // se incrementa en cada cancelación/nueva captura
  let _activeDictRec = null;  // referencia al reconocimiento de dictado continuo

  function createInitialState() {
    return {
      report:       {},    // campos del encabezado
      rawItemsText: null,  // texto bruto de la dictación de lotes
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
    const rows = [];
    if (state.cotizacion) rows.push({ key: 'Cotización', val: state.cotizacion });

    CAMPOS.slice(0, state.fieldsDone).forEach(c => {
      const val = state.report[c.key];
      if (val !== undefined && val !== '') rows.push({ key: c.label, val: String(val) });
    });

    if (state.rawItemsText) {
      const prev = state.rawItemsText.length > 70
        ? state.rawItemsText.slice(0, 70) + '…'
        : state.rawItemsText;
      rows.push({ key: 'Lotes dictados', val: prev });
    }

    elSummaryList.innerHTML = rows.length
      ? rows.map(r => `<div class="summary-item">
           <span class="summary-key">${escHtml(r.key)}</span>
           <span class="summary-val">${escHtml(r.val)}</span>
         </div>`).join('')
      : '<p class="summary-empty">Los datos capturados aparecerán aquí.</p>';
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ============================================================
     UI: ZONA DE DICTADO DE LOTES
     ============================================================ */
  function showItemsDictation() {
    elCapturedBox.classList.add('hidden');
    $('items-dictation').classList.remove('hidden');
    setCurrentField('Dictado de lotes', 'Di "siguiente ítem" para separar');
    setMicState('idle');
  }

  function hideItemsDictation() {
    $('items-dictation').classList.add('hidden');
  }

  function updateItemsText(text) {
    const box = $('items-text-box');
    if (text) {
      box.classList.add('has-text');
      box.textContent = text;
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

      // Mostrar valor normalizado y preguntar brevemente
      showCaptured(finalValue);
      setCurrentField(label, 'Capturado — Solo lectura');
      setMicState('speaking');
      await speak('¿Es correcto?');

      if (aborted()) return null;
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
     DICTACIÓN CONTINUA DE LOTES
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

      function startDictation() {
        if (!SpeechRecognition || running) return;
        running = true;
        dictRec = new SpeechRecognition();
        _activeDictRec = dictRec;
        dictRec.lang = 'es-MX';
        dictRec.continuous = true;
        dictRec.interimResults = true;
        dictRec.maxAlternatives = 1;

        let interim = '';

        dictRec.onresult = e => {
          interim = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) accumulated += (accumulated ? ' ' : '') + e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
          }
          updateItemsText(accumulated + (interim ? ' ' + interim : ''));
        };

        // Chrome mobile detiene el STT en silencios — reiniciar automáticamente
        dictRec.onend = () => {
          if (running && !aborted()) { try { dictRec.start(); } catch (_) {} }
          else { running = false; _activeDictRec = null; if (aborted()) resolve(null); }
        };

        dictRec.onerror = e => {
          if (e.error === 'not-allowed') { stopDictation(); hideItemsDictation(); resolve(null); }
        };

        try { dictRec.start(); } catch (_) {}
        setMicBtn(true);
      }

      function stopDictation() {
        running = false;
        if (dictRec) { try { dictRec.stop(); } catch (_) {} dictRec = null; _activeDictRec = null; }
        setMicBtn(false);

        if (aborted()) { hideItemsDictation(); resolve(null); return; }
        if (!accumulated.trim()) return; // nada capturado

        // Mostrar confirmación
        setCurrentField('Lotes dictados', 'Capturado por voz — Solo lectura');
        setConfirmButtons('Confirmar', 'Repetir');

        _onContinue = () => {
          _onContinue = null; _onRepeat = null;
          if (aborted()) { hideConfirmButtons(); hideItemsDictation(); resolve(null); return; }
          hideConfirmButtons();
          hideItemsDictation();
          resolve(accumulated.trim());
        };
        _onRepeat = () => {
          _onContinue = null; _onRepeat = null;
          if (aborted()) { hideConfirmButtons(); hideItemsDictation(); resolve(null); return; }
          hideConfirmButtons();
          accumulated = '';
          updateItemsText('');
          setCurrentField('Dictado de lotes', 'Di "siguiente ítem" para separar');
        };
      }

      $('items-mic-btn').onclick = () => running ? stopDictation() : startDictation();

      // Instrucción antes de empezar
      speak('Dicta los lotes de corrido. Di "siguiente ítem" para separar. Toca Detener cuando termines.')
        .then(() => { if (!aborted()) startDictation(); });
    });
  }

  /* ============================================================
     FLUJO PRINCIPAL DE CAPTURA
     ============================================================ */
  async function runCapture() {
    const gen     = captureGen;
    const aborted = () => state.aborted || captureGen !== gen;

    showScreen('screen-capture');
    updateSummary();
    updateProgress(state.fieldsDone, CAMPOS.length);

    const resuming = state.fieldsDone > 0 || !!state.rawItemsText;

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
    if (!resuming && !state.cotizacion) {
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
          updateSummary();
          saveProgress();
          await speak('Cotización verificada. Los datos del encabezado se cargaron automáticamente.');
        } else {
          await speak('No encontré esa cotización. Vamos a llenar los datos uno por uno.');
        }
      }
      if (aborted()) return;
    }

    /* ── PASO 2: CAMPOS DEL ENCABEZADO ── */
    for (let i = state.fieldsDone; i < CAMPOS.length; i++) {
      if (aborted()) return;

      updateProgress(i, CAMPOS.length);
      state.fieldsDone = i;

      const campo = CAMPOS[i];
      const value = await captureField(campo.label, campo.tts, gen);
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
    if (!state.rawItemsText) {
      const rawText = await captureItemsRaw(gen);
      if (rawText === null) return;
      state.rawItemsText = rawText;
      updateSummary();
      saveProgress();
    }

    /* ── FINALIZADO ── */
    if (aborted()) return;
    clearProgress();
    setMicState('speaking');
    await speak('Captura completada. Revise el resumen y presione Enviar cuando esté listo.');
    showDoneScreen();
  }

  /* ============================================================
     PANTALLA DE FINALIZACIÓN
     ============================================================ */
  function showDoneScreen() {
    const summaryEl = $('done-summary');
    let html = '<div class="summary-list">';

    if (state.cotizacion) {
      html += `<div class="summary-item">
        <span class="summary-key">Cotización</span>
        <span class="summary-val">${escHtml(state.cotizacion)}</span>
      </div>`;
    }

    CAMPOS.forEach(c => {
      const val = state.report[c.key];
      if (val) html += `<div class="summary-item">
        <span class="summary-key">${escHtml(c.label)}</span>
        <span class="summary-val">${escHtml(val)}</span>
      </div>`;
    });

    if (state.rawItemsText) {
      html += `<div class="summary-item">
        <span class="summary-key">Lotes dictados</span>
        <span class="summary-val summary-raw">${escHtml(state.rawItemsText)}</span>
      </div>`;
    }

    html += '</div>';
    summaryEl.innerHTML = html;
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
        state.cotizacion   = saved.cotizacion   ?? null;
        state.fieldsDone   = saved.fieldsDone   ?? 0;
      }
      runCapture().catch(console.error);
    }
  });

  /* ============================================================
     BOTÓN NUEVO REPORTE
     ============================================================ */
  $('btn-new').addEventListener('click', () => {
    captureGen++;
    state.aborted = true;
    flushPendingChoice();
    stopSpeaking();
    stopListening();
    if (_activeDictRec) { try { _activeDictRec.stop(); } catch (_) {} _activeDictRec = null; }
    clearProgress();
    state = createInitialState();
    showScreen('screen-welcome');
  });

  /* ============================================================
     BOTÓN ENVIAR REPORTE
     ============================================================ */
  $('btn-submit').addEventListener('click', async () => {
    const btn = $('btn-submit');
    btn.disabled    = true;
    btn.textContent = 'Enviando…';

    const payload = {
      ...state.report,
      cotizacion:   state.cotizacion   ?? null,
      rawItemsText: state.rawItemsText ?? '',
    };

    try {
      const res = await fetch('/bot/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ messages: [{ role: 'user', content: JSON.stringify(payload) }] }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      clearProgress();
      await speak('Reporte enviado correctamente. Gracias.');
      btn.textContent = 'Enviado ✓';
    } catch (_) {
      btn.disabled    = false;
      btn.textContent = 'Enviar reporte';
      await speak('Ocurrió un problema al enviar. Intente de nuevo.');
    }
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
