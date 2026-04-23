
  // ─── Configuración ──────────────────────────────────────────────
  // IMPORTANTE: Reemplaza esto con tu API key de Anthropic.
  // En producción nunca expongas tu API key en el frontend;
  // haz las llamadas desde tu propio backend/servidor.
alert('Funciona');
const API_KEY = "TU_API_KEY_AQUI";
  const API_URL = "https://api.anthropic.com/v1/messages";
  const MODEL   = "claude-sonnet-4-20250514";

  // ─── Saludo dinámico ────────────────────────────────────────────
  function getGreeting() {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return { text: "¡Buenos días!",   icon: "☀️" };
    if (h >= 12 && h < 19) return { text: "¡Buenas tardes!", icon: "🌤️" };
    return                          { text: "¡Buenas noches!", icon: "🌙" };
  }

  const greeting = getGreeting();
  document.getElementById("greeting-text").textContent =
    greeting.icon + " " + greeting.text + " ¿En qué puedo ayudarte?";
  document.getElementById("empty-icon").textContent = greeting.icon;
  document.getElementById("empty-text").textContent =
    greeting.text + "\nEscribe o usa el micrófono para comenzar.";

  // ─── Estado ─────────────────────────────────────────────────────
  let messages   = [];
  let loading    = false;
  let listening  = false;

  // ─── Elementos del DOM ──────────────────────────────────────────
  const chatEl    = document.getElementById("chat-messages");
  const emptyEl   = document.getElementById("empty-state");
  const inputEl   = document.getElementById("user-input");
  const sendBtn   = document.getElementById("send-btn");
  const micBtn    = document.getElementById("mic-btn");
  const voiceInd  = document.getElementById("voice-indicator");

  // ─── Reconocimiento de voz ──────────────────────────────────────
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechRecognition) {
    micBtn.style.display = "flex";
    recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      inputEl.value = transcript;
      autoResize();
      updateSendBtn();
    };
    recognition.onend  = () => setListening(false);
    recognition.onerror = () => setListening(false);

    micBtn.addEventListener("click", () => {
      if (listening) {
        recognition.stop();
        setListening(false);
      } else {
        inputEl.value = "";
        updateSendBtn();
        recognition.start();
        setListening(true);
      }
    });
  }

  function setListening(val) {
    listening = val;
    voiceInd.classList.toggle("active", val);
    micBtn.classList.toggle("listening", val);
    micBtn.textContent = val ? "⏹" : "🎙️";
  }

  // ─── Input ──────────────────────────────────────────────────────
  inputEl.addEventListener("input", () => { autoResize(); updateSendBtn(); });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  function autoResize() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
  }

  function updateSendBtn() {
    const hasText = inputEl.value.trim().length > 0;
    sendBtn.disabled = !hasText || loading;
    sendBtn.classList.toggle("active", hasText && !loading);
  }

  sendBtn.addEventListener("click", sendMessage);

  // ─── Renderizado de mensajes ─────────────────────────────────────
  function renderMessage(role, content) {
    emptyEl.style.display = "none";

    const row = document.createElement("div");
    row.className = "msg-row " + role;

    if (role === "assistant") {
      const av = document.createElement("div");
      av.className = "msg-avatar";
      av.textContent = "🤖";
      row.appendChild(av);
    }

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = content;
    row.appendChild(bubble);

    chatEl.appendChild(row);
    scrollToBottom();
    return bubble;
  }

  function showTyping() {
    emptyEl.style.display = "none";
    const row = document.createElement("div");
    row.className = "msg-row assistant";
    row.id = "typing-row";

    const av = document.createElement("div");
    av.className = "msg-avatar";
    av.textContent = "🤖";

    const dots = document.createElement("div");
    dots.className = "typing-dots";
    dots.innerHTML = "<span></span><span></span><span></span>";

    row.appendChild(av);
    row.appendChild(dots);
    chatEl.appendChild(row);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById("typing-row");
    if (el) el.remove();
  }

  function scrollToBottom() {
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  // ─── Envío de mensajes ───────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || loading) return;
    if (listening) { recognition.stop(); setListening(false); }

    inputEl.value = "";
    autoResize();
    loading = true;
    updateSendBtn();

    messages.push({ role: "user", content: text });
    renderMessage("user", text);
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1000,
          system: "Eres un asistente virtual amable y conciso. Responde siempre en español. Sé claro y útil.",
          messages: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text
                    || "No pude obtener una respuesta. Intenta de nuevo.";

      messages.push({ role: "assistant", content: reply });
      removeTyping();
      renderMessage("assistant", reply);

    } catch (err) {
      removeTyping();
      renderMessage("assistant", "Error de conexión. Verifica tu API key y vuelve a intentarlo.");
    }

    loading = false;
    updateSendBtn();
  }
