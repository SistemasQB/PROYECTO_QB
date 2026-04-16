(function () {
  'use strict';

  /* ============================================================
     UTILIDADES
     ============================================================ */
  const $ = id => document.getElementById(id);

  /* ============================================================
     P-07 — HISTORIAL: filtros de búsqueda
     Implementación: GET con query params a /bots/supervisor/historial
     El backend filtra y re-renderiza la tabla completa (Opción B).
     ============================================================ */

  /**
   * Lee los valores de los filtros y navega a la misma ruta
   * con los query params correspondientes. El controlador filtra
   * en la DB y devuelve la vista ya renderizada con los datos correctos.
   */
  function buscarHistorial() {
    const parte = $('filtro-parte')?.value ?? '';
    const fecha = $('filtro-desde')?.value ?? '';

    const params = new URLSearchParams();
    if (parte) params.set('numeroParte', parte);
    if (fecha) params.set('fecha', fecha);

    const queryString = params.toString();
    const url = '/bots/supervisor/historial' + (queryString ? '?' + queryString : '');

    window.location.href = url;
  }

  window.buscarHistorial = buscarHistorial;

  /**
   * Limpia todos los filtros navegando a la ruta sin query params,
   * lo que devuelve el historial completo.
   */
  function limpiarFiltros() {
    window.location.href = '/bots/supervisor/historial';
  }

  window.limpiarFiltros = limpiarFiltros;

})();
