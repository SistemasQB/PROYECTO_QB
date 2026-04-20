(function () {
  'use strict';

  /* ============================================================
     UTILIDADES
     ============================================================ */
  const $ = id => document.getElementById(id);
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

  /* IDs de todas las pantallas del módulo supervisor */
  const SCREENS = [
    'screen-bandeja',
    'screen-detalle',
    'screen-historial',
    'screen-publicado'
  ];

  /* ============================================================
     NAVEGACIÓN ENTRE PANTALLAS
     Oculta todas las pantallas y muestra la indicada.
     Actualiza los items activos del sidebar según la pantalla.
     ============================================================ */
  function showScreen(id) {
    SCREENS.forEach(sid => {
      const el = $(sid);
      if (el) el.classList.toggle('hidden', sid !== id);
    });

    // Sincroniza el estado activo del sidebar en la pantalla destino
    actualizarSidebar(id);

    // Desplaza al inicio de la página al cambiar de pantalla
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /**
   * Marca los items del sidebar como activos o inactivos
   * según la pantalla que se está mostrando.
   */
  function actualizarSidebar(screenId) {
    // Mapeo: qué pantalla activa qué entrada del sidebar
    const sidebares = {
      'screen-bandeja':   'bandeja',
      'screen-detalle':   'bandeja',
      'screen-historial': 'historial',
      'screen-publicado': 'historial'
    };

    const seccionActiva = sidebares[screenId] ?? 'bandeja';

    document.querySelectorAll('.sv-sidebar__item').forEach(btn => {
      const esBandeja   = btn.getAttribute('onclick')?.includes('screen-bandeja');
      const esHistorial = btn.getAttribute('onclick')?.includes('screen-historial');

      btn.classList.remove('sv-sidebar__item--active');
      btn.removeAttribute('aria-current');

      if (seccionActiva === 'bandeja' && esBandeja) {
        btn.classList.add('sv-sidebar__item--active');
        btn.setAttribute('aria-current', 'page');
      } else if (seccionActiva === 'historial' && esHistorial) {
        btn.classList.add('sv-sidebar__item--active');
        btn.setAttribute('aria-current', 'page');
      }
    });
  }

  /* Expone showScreen globalmente para los onclick del HTML */
  window.showScreen = showScreen;

  /* ============================================================
     P-05 — BANDEJA: navegar al detalle de un reporte
     ============================================================ */

  /**
   * Navega a la pantalla P-06 con el detalle del reporte seleccionado.
   * En una integración real, aquí se cargarían los datos del reporte
   * vía fetch antes de mostrar la pantalla.
   * @param {string} reporteId - Identificador del reporte
   */
  function irADetalle(reporteId) {
    // Resetea el estado del botón firmar/publicar al abrir un nuevo reporte
    resetarEstadoFirma();
    showScreen('screen-detalle');
  }

  window.irADetalle = irADetalle;

  /* ============================================================
     P-06 — DETALLE: firmar y publicar reporte
     ============================================================ */

  /** Estado de la firma en la sesión actual */
  let reporteFirmado = false;

  function resetarEstadoFirma() {
    reporteFirmado = false;
    const btnFirmar   = $('btn-firmar');
    const btnPublicar = $('btn-publicar');
    if (btnFirmar) {
      btnFirmar.textContent = 'Firmar Reporte';
      btnFirmar.disabled = false;
    }
    if (btnPublicar) {
      btnPublicar.disabled = true;
      btnPublicar.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * Simula la firma del reporte.
   * Al firmar, habilita el botón de publicar.
   */
  function firmarReporte() {
    if (reporteFirmado) return;

    const btnFirmar   = $('btn-firmar');
    const btnPublicar = $('btn-publicar');
    const alertaVal   = $('alerta-validacion');

    // Simula una validación exitosa (sin errores)
    const hayErrorValidacion = false;

    if (hayErrorValidacion) {
      if (alertaVal) alertaVal.classList.remove('hidden');
      return;
    }

    if (alertaVal) alertaVal.classList.add('hidden');

    reporteFirmado = true;

    if (btnFirmar) {
      btnFirmar.textContent = 'Firmado';
      btnFirmar.disabled = true;
      btnFirmar.style.opacity = '0.7';
    }

    if (btnPublicar) {
      btnPublicar.disabled = false;
      btnPublicar.removeAttribute('aria-disabled');
    }

    // Agrega mensaje informativo en el chat
    agregarMensajeChat(
      'sistema',
      'El reporte ha sido firmado por María González. Ya puedes publicarlo para hacerlo visible.'
    );
  }

  window.firmarReporte = firmarReporte;

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

  /* Permite enviar con Enter en el input del chat */
  document.addEventListener('DOMContentLoaded', () => {
    const chatInput = $('chat-input');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          enviarMensajeChat();
        }
      });
    }
  });

  /* ============================================================
     P-07 — HISTORIAL: navegar al detalle publicado
     ============================================================ */

  /**
   * Navega a la pantalla P-08 con el reporte publicado.
   * @param {string} reporteId - Identificador del reporte publicado
   */
  function irAPublicado(reporteId) {
    showScreen('screen-publicado');
  }

  window.irAPublicado = irAPublicado;

  /* ============================================================
     P-07 — HISTORIAL: filtros de búsqueda
     ============================================================ */

  /**
   * Filtra las filas de la tabla de historial por número de parte.
   * El filtro de fechas se puede extender conectando a un endpoint real.
   */
  function buscarHistorial() {
    const filtroParte = $('filtro-parte')?.value ?? '';
    const filas = document.querySelectorAll('#historial-tbody tr');

    let hayResultados = false;

    filas.forEach(fila => {
      const parteFila = fila.getAttribute('data-parte') ?? '';
      const coincide  = !filtroParte || parteFila === filtroParte;

      fila.style.display = coincide ? '' : 'none';
      if (coincide) hayResultados = true;
    });

    // Muestra mensaje si no hay resultados
    mostrarMensajeVacioHistorial(!hayResultados);
  }

  window.buscarHistorial = buscarHistorial;

  /**
   * Limpia todos los filtros y restaura la tabla completa.
   */
  function limpiarFiltros() {
    const filtroParte = $('filtro-parte');
    const filtroDesde = $('filtro-desde');
    const filtroHasta = $('filtro-hasta');

    if (filtroParte) filtroParte.value = '';
    if (filtroDesde) filtroDesde.value = '';
    if (filtroHasta) filtroHasta.value = '';

    document.querySelectorAll('#historial-tbody tr').forEach(fila => {
      fila.style.display = '';
    });

    mostrarMensajeVacioHistorial(false);
  }

  window.limpiarFiltros = limpiarFiltros;

  /**
   * Muestra u oculta un mensaje "sin resultados" debajo de la tabla.
   * @param {boolean} mostrar
   */
  function mostrarMensajeVacioHistorial(mostrar) {
    let msgEl = $('historial-sin-resultados');

    if (mostrar && !msgEl) {
      const wrapper = $('historial-tabla-wrapper');
      if (!wrapper) return;

      msgEl = document.createElement('p');
      msgEl.id = 'historial-sin-resultados';
      msgEl.style.cssText = [
        'padding: 24px',
        'text-align: center',
        'color: #64748b',
        'font-size: 14px',
        'background: #ffffff',
        'border: 1px solid #e2e8f0',
        'border-top: none',
        'border-radius: 0 0 8px 8px'
      ].join(';');
      msgEl.textContent = 'No se encontraron reportes con los filtros aplicados.';
      wrapper.insertAdjacentElement('afterend', msgEl);
    } else if (!mostrar && msgEl) {
      msgEl.remove();
    }
  }

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */
  (function init() {
    // Pantalla inicial: P-05 Bandeja
    showScreen('screen-bandeja');
  })();

})();
