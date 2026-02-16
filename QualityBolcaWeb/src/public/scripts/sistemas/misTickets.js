document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const ticketCards = document.querySelectorAll('.ticket-card');
  const tabs = document.querySelectorAll('.status-tab');

  let activeStatus = 'todos';

  function matchesSearch(card, searchTerm) {
    const subject = card.querySelector('.ticket-subject').textContent.toLowerCase();
    const id = card.querySelector('.ticket-id').textContent.toLowerCase();
    const tech = card.querySelector('.ticket-tech').textContent.toLowerCase();

    return (
      subject.includes(searchTerm) ||
      id.includes(searchTerm) ||
      tech.includes(searchTerm)
    );
  }

  function updateTabCounts(searchTerm = '') {
    tabs.forEach(tab => {
      const status = tab.dataset.status;
      const countEl = tab.querySelector('.tab-count');

      let count = 0;

      ticketCards.forEach(card => {
        const cardStatus = card.dataset.status;

        const matchesStatus =
          status === 'todos' || cardStatus === status;

        const matchesSearchText = matchesSearch(card, searchTerm);

        if (matchesStatus && matchesSearchText) {
          count++;
        }
      });

      countEl.textContent = `${count}`;
    });
  }

  function filterTickets() {
    const searchTerm = searchInput.value.toLowerCase();
    const emptyState = document.getElementById('emptyState');
    const emptyMessage = document.getElementById('emptyMessage');

    let visibleCount = 0;

    ticketCards.forEach(card => {
      const cardStatus = card.dataset.status;

      const matchesStatus =
        activeStatus === 'todos' || cardStatus === activeStatus;

      const matchesSearchText = matchesSearch(card, searchTerm);

      if (matchesStatus && matchesSearchText) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    
    if (visibleCount === 0) {
      emptyMessage.textContent =
        activeStatus === 'todos'
          ? 'No hay tickets que coincidan con la búsqueda.'
          : 'No hay tickets con este estatus.';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }

    updateTabCounts(searchTerm);
  }


  searchInput.addEventListener('input', filterTickets);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeStatus = tab.dataset.status;
      filterTickets();
    });
  });

  // Inicial
  updateTabCounts();
});
