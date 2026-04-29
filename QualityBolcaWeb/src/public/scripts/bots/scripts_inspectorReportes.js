/* ============================================================
   Quality Bolca – Inspector: Lista de Reportes Asignados
   JS vanilla – sin dependencias externas
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONSTANTES
     ---------------------------------------------------------- */
  const RUTA_CAPTURA = '/bots/bot';

  /* ----------------------------------------------------------
     REFERENCIAS AL DOM
     ---------------------------------------------------------- */
  const cardsList   = document.getElementById('cards-list');
  const emptyState  = document.getElementById('empty-state');
  const filterBtns  = document.querySelectorAll('.ir-filter-btn');
  const cards       = document.querySelectorAll('.ir-card');

  /* ----------------------------------------------------------
     NAVEGACION AL HACER CLICK EN UNA CARD
     Se aplica tanto a click como a Enter/Espacio para
     accesibilidad (role="button" + tabindex="0")
     ---------------------------------------------------------- */
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      irACaptura();
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        irACaptura();
      }
    });
  });

  function irACaptura() {
    window.location.href = RUTA_CAPTURA;
  }

  /* ----------------------------------------------------------
     FILTRO RAPIDO POR ESTADO
     ---------------------------------------------------------- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filtro = btn.getAttribute('data-filter');
      aplicarFiltro(filtro);
    });
  });

  function aplicarFiltro(filtro) {
    /* Actualiza el estado activo de los botones */
    filterBtns.forEach(function (btn) {
      var esActivo = btn.getAttribute('data-filter') === filtro;
      btn.classList.toggle('ir-filter-btn--active', esActivo);
      btn.setAttribute('aria-pressed', esActivo ? 'true' : 'false');
    });

    /* Muestra u oculta las cards */
    var visibles = 0;

    cards.forEach(function (card) {
      var estadoCard = card.getAttribute('data-estado');
      var mostrar = filtro === 'todos' || estadoCard === filtro;

      if (mostrar) {
        card.classList.remove('hidden');
        visibles++;
      } else {
        card.classList.add('hidden');
      }
    });

    /* Muestra el estado vacío si no hay resultados */
    emptyState.classList.toggle('hidden', visibles > 0);
  }

  /* ----------------------------------------------------------
     INICIALIZACION
     ---------------------------------------------------------- */
  // Aplicar filtro "todos" al cargar la página
  aplicarFiltro('todos');

})();
