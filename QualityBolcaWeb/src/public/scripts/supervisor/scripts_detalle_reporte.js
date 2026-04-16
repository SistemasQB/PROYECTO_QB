(function () {
  'use strict';

  /* ============================================================
     UTILIDADES
     ============================================================ */
  const $ = id => document.getElementById(id);

  /* ============================================================
     P-06 — DETALLE: firmar y publicar reporte
     ============================================================ */

  function firmarReporte() {
    const btnFirmar   = $('btn-firmar');
    const btnPublicar = $('btn-publicar');
    const csrfToken   = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    const bodyId      = window.BODY_ID;

    if (!bodyId) return;

    Swal.fire({
      title: '¿Firmar este reporte?',
      text: 'Esta acción marcará el reporte como firmado. Podrás publicarlo después.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, firmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then(result => {
      if (!result.isConfirmed) return;

      // Deshabilitar botón mientras se procesa
      btnFirmar.disabled = true;
      btnFirmar.textContent = 'Firmando...';

      fetch('/bots/firmarReporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken
        },
        body: JSON.stringify({ bodyId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          btnFirmar.textContent = 'Firmado \u2713';
          btnFirmar.style.opacity = '0.6';
          btnPublicar.disabled = false;
          btnPublicar.removeAttribute('aria-disabled');
          agregarMensajeChat('sistema', `Reporte firmado correctamente por ${data.firmaAplicada}.`);

          Swal.fire({
            title: '¡Reporte firmado!',
            text: 'El reporte ha sido firmado correctamente.',
            icon: 'success',
            confirmButtonColor: '#4f46e5',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            window.location.href = '/bots/supervisor/bandeja';
          });
        } else {
          btnFirmar.disabled = false;
          btnFirmar.textContent = 'Firmar Reporte';
          agregarMensajeChat('sistema', `Error al firmar: ${data.error}`);

          Swal.fire({
            title: 'Error al firmar',
            text: data.error || 'No se pudo firmar el reporte. Intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#4f46e5'
          });
        }
      })
      .catch(() => {
        btnFirmar.disabled = false;
        btnFirmar.textContent = 'Firmar Reporte';
        agregarMensajeChat('sistema', 'Error de red al intentar firmar el reporte. Intenta de nuevo.');

        Swal.fire({
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.',
          icon: 'error',
          confirmButtonColor: '#4f46e5'
        });
      });
    });
  }

  window.firmarReporte = firmarReporte;

  function publicarReporte() {
    const btnPublicar = $('btn-publicar');
    const csrfToken   = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    const bodyId      = window.BODY_ID;

    if (!bodyId) return;

    Swal.fire({
      title: '¿Publicar este reporte?',
      text: 'Esta acción publicará el reporte y será visible para todos. Esta operación no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, publicar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then(result => {
      if (!result.isConfirmed) return;

      btnPublicar.disabled = true;
      btnPublicar.textContent = 'Publicando...';

      fetch('/bots/publicarReporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken
        },
        body: JSON.stringify({ bodyId: window.BODY_ID })
      })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          btnPublicar.textContent = 'Publicado \u2713';
          btnPublicar.style.opacity = '0.6';
          agregarMensajeChat('sistema', 'Reporte publicado exitosamente. Redirigiendo al historial...');

          Swal.fire({
            title: '¡Reporte publicado!',
            text: 'El reporte ha sido publicado exitosamente.',
            icon: 'success',
            confirmButtonColor: '#16a34a',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            window.location.href = '/bots/supervisor/historial';
          });
        } else {
          btnPublicar.disabled = false;
          btnPublicar.textContent = 'Publicar Reporte';
          agregarMensajeChat('sistema', `Error al publicar: ${data.error}`);

          Swal.fire({
            title: 'Error al publicar',
            text: data.error || 'No se pudo publicar el reporte. Intenta de nuevo.',
            icon: 'error',
            confirmButtonColor: '#16a34a'
          });
        }
      })
      .catch(() => {
        btnPublicar.disabled = false;
        btnPublicar.textContent = 'Publicar Reporte';
        agregarMensajeChat('sistema', 'Error de red al intentar publicar el reporte. Intenta de nuevo.');

        Swal.fire({
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.',
          icon: 'error',
          confirmButtonColor: '#16a34a'
        });
      });
    });
  }

  window.publicarReporte = publicarReporte;

  /* ============================================================
     P-06 — CHATBOT: mensajería funcional
     ============================================================ */

  /** Modo de entrada actual: 'texto' | 'voz' */
  let modoChat = 'texto';

  /**
   * Cambia el modo de entrada del chat.
   * @param {'texto'|'voz'} modo
   */
  function setModoChat(modo) {
    modoChat = modo;

    const btnTexto = $('modo-texto');
    const btnVoz   = $('modo-voz');
    const input    = $('chat-input');

    if (!btnTexto || !btnVoz) return;

    btnTexto.classList.toggle('sv-chat-mode__btn--active', modo === 'texto');
    btnVoz.classList.toggle('sv-chat-mode__btn--active',   modo === 'voz');

    if (input) {
      if (modo === 'voz') {
        input.placeholder = 'Modo voz activado — habla para enviar un mensaje';
        input.disabled = true;
      } else {
        input.placeholder = 'Escribe tu consulta o instrucción...';
        input.disabled = false;
        input.focus();
      }
    }
  }

  window.setModoChat = setModoChat;

  /**
   * Agrega una burbuja de mensaje al historial del chat.
   * @param {'sistema'|'user'} tipo
   * @param {string} texto
   */
  function agregarMensajeChat(tipo, texto) {
    const contenedor = $('chat-messages');
    if (!contenedor) return;

    const burbuja = document.createElement('div');
    burbuja.classList.add('sv-chat-bubble');
    burbuja.classList.add(tipo === 'user' ? 'sv-chat-bubble--user' : 'sv-chat-bubble--system');

    const parrafo = document.createElement('p');
    parrafo.textContent = texto;
    burbuja.appendChild(parrafo);

    contenedor.appendChild(burbuja);
    // Desplaza al último mensaje
    contenedor.scrollTop = contenedor.scrollHeight;
  }

  /**
   * Genera una respuesta simulada del sistema según el mensaje del usuario.
   * En producción, esto sería reemplazado por una llamada al backend del bot.
   * @param {string} mensaje - Mensaje escrito por el usuario
   * @returns {string} Respuesta generada
   */
  function generarRespuestaBot(mensaje) {
    const msg = mensaje.toLowerCase().trim();

    if (msg.includes('lote') || msg.includes('l-00')) {
      return 'Los lotes L-001, L-002 y L-003 han pasado la validación matemática. ¿Deseas modificar algún valor específico?';
    }
    if (msg.includes('defecto') || msg.includes('ng')) {
      return 'Los defectos registrados son: Rayadura (L-001, L-002), Golpe (L-001), Doblez y Faltante (L-003). ¿Necesitas agregar o corregir alguno?';
    }
    if (msg.includes('total') || msg.includes('pieza')) {
      return 'El total general es 3,630 piezas inspeccionadas. Buenas: 3,587 — NG: 43 — Tasa de rechazo: 1.18%.';
    }
    if (msg.includes('firmar') || msg.includes('firma')) {
      return 'Para firmar el reporte usa el botón "Firmar Reporte" en el panel izquierdo. Esto habilitará la opción de publicar.';
    }
    if (msg.includes('publicar') || msg.includes('publicación')) {
      return 'El botón "Publicar Reporte" se habilitará una vez que el reporte haya sido firmado.';
    }
    if (msg.includes('inspector') || msg.includes('juan')) {
      return 'El inspector Juan Pérez capturó este reporte el 10/04/2026 en turno Vespertino, parte 48-6123-A para cliente Ford Motor Company.';
    }

    return 'Entendido. ¿Puedo ayudarte con algo más sobre este reporte? Puedes preguntarme sobre lotes, defectos, totales o el proceso de firma y publicación.';
  }

  /**
   * Envía el mensaje del usuario y agrega la respuesta del bot.
   */
  function enviarMensajeChat() {
    const input = $('chat-input');
    if (!input) return;

    const texto = input.value.trim();
    if (!texto) return;

    // Agrega burbuja del usuario
    agregarMensajeChat('user', texto);
    input.value = '';
    input.focus();

    // Agrega respuesta del sistema con un pequeño retraso para simular latencia
    setTimeout(() => {
      const respuesta = generarRespuestaBot(texto);
      agregarMensajeChat('sistema', respuesta);
    }, 600);
  }

  window.enviarMensajeChat = enviarMensajeChat;

  /* ============================================================
     P-06 — CHAT DRAWER: abrir / cerrar con FAB
     ============================================================ */

  /**
   * Abre el panel del chatbot:
   * - Añade .is-open al panel y .is-visible al overlay
   * - Actualiza aria-expanded en el FAB
   * - Mueve el foco al botón de cierre para accesibilidad de teclado
   */
  function openChat() {
    const panel   = $('sv-chat-panel');
    const overlay = $('sv-chat-overlay');
    const fab     = $('sv-chat-fab');
    const close   = $('sv-chat-close');

    if (!panel || !overlay || !fab) return;

    panel.classList.add('is-open');
    overlay.classList.add('is-visible');
    fab.classList.add('is-active');
    fab.setAttribute('aria-expanded', 'true');
    overlay.removeAttribute('aria-hidden');

    // Mover foco al botón X para que el teclado quede dentro del drawer
    if (close) close.focus();
  }

  /**
   * Cierra el panel del chatbot y devuelve el foco al FAB.
   */
  function closeChat() {
    const panel   = $('sv-chat-panel');
    const overlay = $('sv-chat-overlay');
    const fab     = $('sv-chat-fab');

    if (!panel || !overlay || !fab) return;

    panel.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    fab.classList.remove('is-active');
    fab.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');

    // Devolver foco al FAB al cerrar
    fab.focus();
  }

  /* Permite enviar con Enter en el input del chat */
  document.addEventListener('DOMContentLoaded', () => {
    // --- Enter en el input ---
    const chatInput = $('chat-input');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          enviarMensajeChat();
        }
      });
    }

    // --- FAB: abrir el drawer ---
    const fab = $('sv-chat-fab');
    if (fab) {
      fab.addEventListener('click', () => {
        const isOpen = $('sv-chat-panel')?.classList.contains('is-open');
        isOpen ? closeChat() : openChat();
      });
    }

    // --- Botón X: cerrar el drawer ---
    const closeBtn = $('sv-chat-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeChat);
    }

    // --- Overlay: cerrar al hacer clic fuera ---
    const overlay = $('sv-chat-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeChat);
    }

    // --- Tecla Escape: cerrar el drawer ---
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('sv-chat-panel')?.classList.contains('is-open')) {
        closeChat();
      }
    });
  });

})();
