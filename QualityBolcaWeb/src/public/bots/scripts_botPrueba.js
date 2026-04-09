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
    sendBtn.disabled = !hasText;
    sendBtn.classList.toggle('active', hasText);
  });

  // --- Enter to send, Shift+Enter for new line ---
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

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
    if (!text) return;

    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;
    sendBtn.classList.remove('active');

    conversationHistory.push({ role: 'user', content: text });
    appendMessage('user', text);
    showTyping();

    try {
      const res = await fetch('/bot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await res.json();
      hideTyping();

      if (data.ok) {
        // Guardar en el historial solo el texto, nunca la estructura del chart
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
