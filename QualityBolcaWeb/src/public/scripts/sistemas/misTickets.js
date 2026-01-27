document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const ticketCards = document.querySelectorAll('.ticket-card');

    // Función principal de filtrado
    const filterTickets = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        // Actualiza la lógica de coincidencia
        const matchesSearch = subject.includes(searchTerm) || id.includes(searchTerm) || tech.includes(searchTerm);

        ticketCards.forEach(card => {
            // Obtenemos el texto del asunto y del ID para buscar
            // Dentro del forEach en filterTickets:
            const tech = card.querySelector('.ticket-tech').textContent.toLowerCase();
            const subject = card.querySelector('.ticket-subject').textContent.toLowerCase();
            const id = card.querySelector('.ticket-id').textContent.toLowerCase();

            // Obtenemos el estatus real de la tarjeta (data-status)
            const cardStatus = card.getAttribute('data-status');

            // Lógica de coincidencia
            const matchesSearch = subject.includes(searchTerm) || id.includes(searchTerm);
            const matchesStatus = statusValue === 'todos' || cardStatus === statusValue;

            // Mostrar u ocultar
            if (matchesSearch && matchesStatus) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Escuchadores de eventos
    searchInput.addEventListener('input', filterTickets);
    statusFilter.addEventListener('change', filterTickets);




});