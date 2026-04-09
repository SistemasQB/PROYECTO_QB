(function () {

  // --- CSRF token ---
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  // --- Greeting ---
  const hour = new Date().getHours();
  let greeting = 'Buenas noches';
  if (hour >= 6 && hour < 12) greeting = 'Buenos días';
  else if (hour >= 12 && hour < 19) greeting = 'Buenas tardes';
  document.getElementById('greeting-text').textContent = greeting;

  // --- Empty state ---
  document.getElementById('empty-icon').textContent = '📊';
  document.getElementById('empty-text').textContent =
    'Pregúntame sobre reportes de producción,\ncalidad, inventario o indicadores operativos.';

  // --- Historial de conversación ---
  const conversationHistory = [];

  // --- Elements ---
  const chatMessages = document.getElementById('chat-messages');
  const emptyState   = document.getElementById('empty-state');
  const userInput    = document.getElementById('user-input');
  const sendBtn      = document.getElementById('send-btn');

  // --- Auto-resize textarea ---
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
    const hasText = userInput.value.trim().length > 0;
    const canSend = hasText || selectedPdfFile !== null;
    sendBtn.disabled = !canSend;
    sendBtn.classList.toggle('active', canSend);
  });

  // --- Enter to send, Shift+Enter for new line ---
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // --- Micrófono (Web Speech API) ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn            = document.getElementById('mic-btn');
  const voiceIndicator    = document.getElementById('voice-indicator');

  if (!SpeechRecognition) {
    // Navegador sin soporte: ocultar el botón completamente
    if (micBtn) micBtn.style.display = 'none';
  } else {
    const recognition = new SpeechRecognition();
    recognition.lang           = 'es-ES';
    recognition.continuous     = true;   // graba hasta que el usuario lo detenga manualmente
    recognition.interimResults = true;

    let isListening = false;

    function startListening() {
      isListening = true;
      micBtn.textContent = '⏹';
      micBtn.title = 'Detener';
      micBtn.classList.add('listening');
      micBtn.classList.remove('processing');
      if (voiceIndicator) voiceIndicator.classList.add('active');
      recognition.start();
    }

    function stopListening() {
      isListening = false;
      recognition.stop();
    }

    function clearMicState() {
      isListening = false;
      micBtn.textContent = '🎙️';
      micBtn.title = 'Hablar';
      micBtn.classList.remove('listening', 'processing');
      if (voiceIndicator) voiceIndicator.classList.remove('active');
    }

    micBtn.addEventListener('click', () => {
      if (isListening) stopListening();
      else startListening();
    });

    // Acumulación correcta en modo continuo: separar resultados finales e intermedios
    recognition.addEventListener('result', (e) => {
      let finalTranscript   = '';
      let interimTranscript = '';

      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript   += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }

      userInput.value = finalTranscript + interimTranscript;

      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
      const hasText = userInput.value.trim().length > 0;
      sendBtn.disabled = !hasText;
      sendBtn.classList.toggle('active', hasText);
    });

    // end se dispara solo cuando el usuario para manualmente (continuous=true).
    // Si el navegador lo corta por algún quirk, lo reiniciamos si aún está activo.
    recognition.addEventListener('end', () => {
      if (isListening) {
        // El navegador cortó solo — reiniciamos para mantener la grabación activa
        recognition.start();
        return;
      }
      // Parada manual: limpiar y enviar
      clearMicState();
      if (userInput.value.trim().length > 0) sendMessage();
    });

    recognition.addEventListener('error', (e) => {
      clearMicState();
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        appendMessage('assistant', 'No se pudo acceder al micrófono. Verifica los permisos.');
      } else if (e.error === 'network') {
        appendMessage('assistant', 'Error de red al acceder al micrófono.');
      }
      // 'no-speech' y 'aborted' son flujos normales, sin mensaje al usuario.
    });
  }

  // --- Estado PDF ---
  let selectedPdfFile = null;

  // --- Referencias DOM PDF ---
  const pdfBtn       = document.getElementById('pdf-btn');
  const pdfInput     = document.getElementById('pdf-input');
  const pdfIndicator = document.getElementById('pdf-indicator');
  const pdfFilename  = document.getElementById('pdf-filename');
  const pdfRemoveBtn = document.getElementById('pdf-remove-btn');

  function clearPdf() {
    selectedPdfFile = null;
    pdfInput.value = '';
    pdfIndicator.classList.remove('active');
    pdfBtn.classList.remove('has-file');
    // Deshabilitar sendBtn si tampoco hay texto
    const hasText = userInput.value.trim().length > 0;
    sendBtn.disabled = !hasText;
    sendBtn.classList.toggle('active', hasText);
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function appendPdfBubble(file) {
    if (emptyState) emptyState.style.display = 'none';
    const row = document.createElement('div');
    row.className = 'msg-row user';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '👤';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    const attach = document.createElement('div');
    attach.className = 'msg-pdf-attach';
    attach.innerHTML = `
      <span class="pdf-attach-icon">📄</span>
      <span class="pdf-attach-name">${file.name}</span>
      <span class="pdf-attach-size">${formatFileSize(file.size)}</span>
    `;
    bubble.appendChild(attach);

    row.appendChild(bubble);
    row.appendChild(avatar);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // --- Event listeners PDF ---
  pdfBtn.addEventListener('click', () => pdfInput.click());

  pdfInput.addEventListener('change', () => {
    const file = pdfInput.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      appendMessage('assistant', 'Solo se permiten archivos PDF.');
      pdfInput.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      appendMessage('assistant', 'El PDF no puede superar los 5 MB.');
      pdfInput.value = '';
      return;
    }

    selectedPdfFile = file;
    pdfFilename.textContent = file.name;
    pdfIndicator.classList.add('active');
    pdfBtn.classList.add('has-file');
    // Habilitar sendBtn aunque el textarea esté vacío
    sendBtn.disabled = false;
    sendBtn.classList.add('active');
  });

  pdfRemoveBtn.addEventListener('click', clearPdf);

  // --- Contador para IDs únicos de canvas ---
  let chartCounter = 0;

  // --- Append message bubble ---
  function appendMessage(role, text) {
    if (emptyState) emptyState.style.display = 'none';

    const row = document.createElement('div');
    row.className = `msg-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'assistant' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;

    if (role === 'assistant') {
      row.appendChild(avatar);
      row.appendChild(bubble);
    } else {
      row.appendChild(bubble);
      row.appendChild(avatar);
    }

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // --- Append chart bubble ---
  function appendChart(role, text, chartConfig) {
    if (emptyState) emptyState.style.display = 'none';

    const row = document.createElement('div');
    row.className = `msg-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'assistant' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    // Texto explicativo (si existe)
    if (text) {
      const textNode = document.createElement('p');
      textNode.style.marginTop = '0';
      textNode.style.marginBottom = '12px';
      textNode.textContent = text;
      bubble.appendChild(textNode);
    }

    // Canvas para Chart.js
    const canvasId = 'chart-' + (++chartCounter) + '-' + Date.now();
    const canvasWrapper = document.createElement('div');
    canvasWrapper.style.cssText = 'position:relative;width:100%;max-height:300px;';

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.cssText = 'max-width:100%;max-height:300px;';
    canvasWrapper.appendChild(canvas);
    bubble.appendChild(canvasWrapper);

    if (role === 'assistant') {
      row.appendChild(avatar);
      row.appendChild(bubble);
    } else {
      row.appendChild(bubble);
      row.appendChild(avatar);
    }

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Instanciar Chart.js después de que el canvas esté en el DOM
    try {
      new Chart(canvas, {
        type: chartConfig.chartType || 'bar',
        data: {
          labels: chartConfig.labels || [],
          datasets: chartConfig.datasets || []
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: !!(chartConfig.title),
              text: chartConfig.title || ''
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    } catch (err) {
      // Si Chart.js falla por cualquier razón, mostrar el texto como fallback
      const fallback = document.createElement('p');
      fallback.style.color = '#e57373';
      fallback.textContent = 'No se pudo renderizar la gráfica.';
      bubble.appendChild(fallback);
    }
  }

  // --- Typing indicator ---
  function showTyping() {
    const row = document.createElement('div');
    row.className = 'msg-row assistant';
    row.id = 'typing-row';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🤖';

    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    row.appendChild(avatar);
    row.appendChild(dots);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    const row = document.getElementById('typing-row');
    if (row) row.remove();
  }

  // --- Send message ---
  async function sendMessage() {
    const text = userInput.value.trim();
    const hasPdf = selectedPdfFile !== null;

    // Requiere al menos texto o PDF
    if (!text && !hasPdf) return;

    // Capturar el archivo antes de limpiar
    const pdfToSend = selectedPdfFile;

    // Limpiar input y PDF
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;
    sendBtn.classList.remove('active');
    if (hasPdf) clearPdf();

    // Mostrar burbuja del usuario
    if (hasPdf) appendPdfBubble(pdfToSend);
    if (text) {
      conversationHistory.push({ role: 'user', content: text });
      appendMessage('user', text);
    } else if (hasPdf) {
      // Si solo hay PDF sin texto, agregar mensaje genérico al historial para contexto
      conversationHistory.push({ role: 'user', content: `[Archivo PDF adjunto: ${pdfToSend.name}]` });
    }

    showTyping();

    try {
      let res;

      if (hasPdf) {
        // Enviar con FormData al endpoint con PDF
        const formData = new FormData();
        formData.append('pdf', pdfToSend);
        formData.append('messages', JSON.stringify(conversationHistory));
        if (text) formData.append('userText', text);

        res = await fetch('/bot/chat-with-pdf', {
          method: 'POST',
          headers: { 'X-CSRF-Token': csrfToken },
          body: formData
        });
      } else {
        // Comportamiento original
        res = await fetch('/bot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ messages: conversationHistory })
        });
      }

      const data = await res.json();
      hideTyping();

      if (data.ok) {
        conversationHistory.push({ role: 'assistant', content: data.reply });
        if (data.type === 'chart' && data.chart) {
          appendChart('assistant', data.reply, data.chart);
        } else {
          appendMessage('assistant', data.reply);
        }
      } else {
        conversationHistory.pop();
        appendMessage('assistant', 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo.');
      }
    } catch (err) {
      conversationHistory.pop();
      hideTyping();
      appendMessage('assistant', 'No pude conectarme al servidor. Verifica tu conexión.');
    }
  }

})();
