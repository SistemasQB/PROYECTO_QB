(function () {
  'use strict';

  /* ============================================================
     UTILIDADES
     ============================================================ */
  const $ = id => document.getElementById(id);

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

})();
