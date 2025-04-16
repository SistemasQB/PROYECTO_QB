document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo para el inventario
    const inventoryData = [
        {
            idInventario: "INV-001",
            componentes: "Laptop Dell XPS",
            tipo: "hardware",
            marca: "Dell",
            serie: "XPS-9560-123",
            folio: "F-10001",
            estado: "nuevo",
            precio: "25000.00",
            fechaCompra: "2023-01-15",
            fechaEntrega: "2023-01-20",
            numEmpleado: "EMP-123",
            usoExclusivo: "si",
            accesorios: "Cargador, Mouse, Funda"
        },
        {
            idInventario: "INV-002",
            componentes: "Monitor LG UltraWide",
            tipo: "hardware",
            marca: "LG",
            serie: "UW-34WN750-456",
            folio: "F-10002",
            estado: "nuevo",
            precio: "8500.00",
            fechaCompra: "2023-02-10",
            fechaEntrega: "2023-02-15",
            numEmpleado: "EMP-456",
            usoExclusivo: "no",
            accesorios: "Cable HDMI, Cable de poder"
        },
        {
            idInventario: "INV-003",
            componentes: "Licencia Microsoft Office",
            tipo: "software",
            marca: "Microsoft",
            serie: "OFF-365-789",
            folio: "F-10003",
            estado: "nuevo",
            precio: "3200.00",
            fechaCompra: "2023-03-05",
            fechaEntrega: "2023-03-05",
            numEmpleado: "EMP-789",
            usoExclusivo: "si",
            accesorios: "N/A"
        },
        {
            idInventario: "INV-004",
            componentes: "Silla Ergonómica",
            tipo: "mobiliario",
            marca: "Herman Miller",
            serie: "HM-AERON-101",
            folio: "F-10004",
            estado: "usado",
            precio: "12000.00",
            fechaCompra: "2022-11-20",
            fechaEntrega: "2022-11-25",
            numEmpleado: "EMP-101",
            usoExclusivo: "si",
            accesorios: "Reposacabezas"
        },
        {
            idInventario: "INV-005",
            componentes: "Impresora Láser",
            tipo: "hardware",
            marca: "HP",
            serie: "HP-LJ-202",
            folio: "F-10005",
            estado: "reparacion",
            precio: "4500.00",
            fechaCompra: "2022-09-15",
            fechaEntrega: "2022-09-20",
            numEmpleado: "EMP-202",
            usoExclusivo: "no",
            accesorios: "Cable USB, Tóner adicional"
        },
        {
            idInventario: "INV-006",
            componentes: "Teléfono IP",
            tipo: "electronico",
            marca: "Cisco",
            serie: "CS-IP-303",
            folio: "F-10006",
            estado: "nuevo",
            precio: "2800.00",
            fechaCompra: "2023-04-10",
            fechaEntrega: "2023-04-15",
            numEmpleado: "EMP-303",
            usoExclusivo: "si",
            accesorios: "Auricular, Base"
        },
        {
            idInventario: "INV-007",
            componentes: "Tableta Gráfica",
            tipo: "hardware",
            marca: "Wacom",
            serie: "WC-INT-404",
            folio: "F-10007",
            estado: "usado",
            precio: "7200.00",
            fechaCompra: "2022-08-05",
            fechaEntrega: "2022-08-10",
            numEmpleado: "EMP-404",
            usoExclusivo: "si",
            accesorios: "Lápiz, Cable USB"
        },
        {
            idInventario: "INV-008",
            componentes: "Proyector",
            tipo: "electronico",
            marca: "Epson",
            serie: "EP-PRO-505",
            folio: "F-10008",
            estado: "baja",
            precio: "9500.00",
            fechaCompra: "2021-06-20",
            fechaEntrega: "2021-06-25",
            numEmpleado: "EMP-505",
            usoExclusivo: "no",
            accesorios: "Control remoto, Cable HDMI, Funda"
        },
        {
            idInventario: "INV-009",
            componentes: "Escritorio Ajustable",
            tipo: "mobiliario",
            marca: "Vari",
            serie: "VA-DESK-606",
            folio: "F-10009",
            estado: "nuevo",
            precio: "15000.00",
            fechaCompra: "2023-05-15",
            fechaEntrega: "2023-05-25",
            numEmpleado: "EMP-606",
            usoExclusivo: "si",
            accesorios: "Organizador de cables"
        },
        {
            idInventario: "INV-010",
            componentes: "Licencia Adobe Creative Cloud",
            tipo: "software",
            marca: "Adobe",
            serie: "ADO-CC-707",
            folio: "F-10010",
            estado: "nuevo",
            precio: "12000.00",
            fechaCompra: "2023-06-01",
            fechaEntrega: "2023-06-01",
            numEmpleado: "EMP-707",
            usoExclusivo: "si",
            accesorios: "N/A"
        },
        {
            idInventario: "INV-011",
            componentes: "Auriculares con Cancelación de Ruido",
            tipo: "electronico",
            marca: "Sony",
            serie: "SNY-WH-808",
            folio: "F-10011",
            estado: "nuevo",
            precio: "3800.00",
            fechaCompra: "2023-06-10",
            fechaEntrega: "2023-06-15",
            numEmpleado: "EMP-808",
            usoExclusivo: "si",
            accesorios: "Estuche, Cable de carga, Adaptador de avión"
        },
        {
            idInventario: "INV-012",
            componentes: "Router Wifi",
            tipo: "hardware",
            marca: "TP-Link",
            serie: "TP-AX-909",
            folio: "F-10012",
            estado: "usado",
            precio: "1800.00",
            fechaCompra: "2022-12-05",
            fechaEntrega: "2022-12-10",
            numEmpleado: "EMP-909",
            usoExclusivo: "no",
            accesorios: "Cable Ethernet, Adaptador de corriente"
        }
    ];

    // Variables para la paginación y ordenamiento
    let currentPage = 1;
    const itemsPerPage = 5;
    let currentSort = {
        column: 'idInventario',
        direction: 'asc'
    };
    let filteredData = [...inventoryData];

    // Referencias a elementos del DOM
    const tableBody = document.querySelector('#inventoryTable tbody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const tableHeaders = document.querySelectorAll('th[data-sort]');
    const modal = document.getElementById('detailModal');
    const modalClose = document.querySelector('.close');
    const modalBody = document.getElementById('modalBody');
    const addItemButton = document.getElementById('addItemButton');

    // Inicializar la tabla
    renderTable();

    // Event Listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    searchButton.addEventListener('click', () => {
        searchInventory();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchInventory();
        }
    });

    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');
            sortTable(column);
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    addItemButton.addEventListener('click', () => {
        // Aquí podrías redirigir al formulario de añadir item
        window.location.href = '/sistemas/addinventario';
    });

    // Funciones
    function renderTable() {
        // Limpiar tabla
        tableBody.innerHTML = '';
        
        // Calcular índices para la paginación
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        // Renderizar filas
        if (paginatedData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="14" style="text-align: center; padding: 2rem;">
                        No se encontraron resultados.
                    </td>
                </tr>
            `;
        } else {
            paginatedData.forEach(item => {
                const row = document.createElement('tr');
                
                // Formatear fechas para mostrar
                const fechaCompra = formatDate(item.fechaCompra);
                const fechaEntrega = formatDate(item.fechaEntrega);
                
                row.innerHTML = `
                    <td>${item.idInventario}</td>
                    <td>${item.componentes}</td>
                    <td>${capitalizeFirstLetter(item.tipo)}</td>
                    <td>${item.marca}</td>
                    <td>${item.serie}</td>
                    <td>${item.folio}</td>
                    <td><span class="status status-${item.estado}">${getEstadoText(item.estado)}</span></td>
                    <td>$${parseFloat(item.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td>${fechaCompra}</td>
                    <td>${fechaEntrega}</td>
                    <td>${item.numEmpleado}</td>
                    <td>${item.usoExclusivo === 'si' ? 'Sí' : 'No'}</td>
                    <td>${item.accesorios}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-view" data-id="${item.idInventario}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action btn-edit" data-id="${item.idInventario}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action btn-delete" data-id="${item.idInventario}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Añadir event listeners a los botones de acción
            document.querySelectorAll('.btn-view').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    showItemDetails(id);
                });
            });
            
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    alert(`Editando item con ID: ${id}`);
                });
            });
            
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm(`¿Estás seguro de que deseas eliminar el item con ID: ${id}?`)) {
                        alert(`Item con ID: ${id} eliminado.`);
                    }
                });
            });
        }
        
        // Actualizar información de paginación
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        
        // Habilitar/deshabilitar botones de paginación
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        
        // Actualizar indicadores de ordenamiento
        updateSortIndicators();
    }

    function sortTable(column) {
        // Actualizar dirección de ordenamiento
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        
        // Ordenar datos
        filteredData.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];
            
            // Convertir a números para ordenamiento numérico si es necesario
            if (column === 'precio') {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }
            
            // Ordenar
            if (valueA < valueB) {
                return currentSort.direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return currentSort.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        // Resetear a la primera página y renderizar
        currentPage = 1;
        renderTable();
    }

    function updateSortIndicators() {
        // Quitar clases de ordenamiento de todos los encabezados
        tableHeaders.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });
        
        // Añadir clase al encabezado actualmente ordenado
        const activeHeader = document.querySelector(`th[data-sort="${currentSort.column}"]`);
        if (activeHeader) {
            activeHeader.classList.add(`sorted-${currentSort.direction}`);
        }
    }

    function searchInventory() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredData = [...inventoryData];
        } else {
            filteredData = inventoryData.filter(item => {
                // Buscar en todas las propiedades
                return Object.values(item).some(value => 
                    String(value).toLowerCase().includes(searchTerm)
                );
            });
        }
        
        // Resetear a la primera página y renderizar
        currentPage = 1;
        renderTable();
    }

    function showItemDetails(id) {
        const item = inventoryData.find(item => item.idInventario === id);
        
        if (item) {
            // Formatear fechas
            const fechaCompra = formatDate(item.fechaCompra);
            const fechaEntrega = formatDate(item.fechaEntrega);
            
            // Construir HTML para los detalles
            modalBody.innerHTML = `
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">ID Inventario:</span>
                        <span class="detail-value">${item.idInventario}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Componentes:</span>
                        <span class="detail-value">${item.componentes}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tipo:</span>
                        <span class="detail-value">${capitalizeFirstLetter(item.tipo)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Marca:</span>
                        <span class="detail-value">${item.marca}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Serie:</span>
                        <span class="detail-value">${item.serie}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Folio:</span>
                        <span class="detail-value">${item.folio}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado:</span>
                        <span class="detail-value status status-${item.estado}">${getEstadoText(item.estado)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Precio:</span>
                        <span class="detail-value">$${parseFloat(item.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha de Compra:</span>
                        <span class="detail-value">${fechaCompra}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha de Entrega:</span>
                        <span class="detail-value">${fechaEntrega}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Número de Empleado:</span>
                        <span class="detail-value">${item.numEmpleado}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Uso Exclusivo:</span>
                        <span class="detail-value">${item.usoExclusivo === 'si' ? 'Sí' : 'No'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Accesorios:</span>
                        <span class="detail-value">${item.accesorios}</span>
                    </div>
                </div>
            `;
            
            // Mostrar modal
            modal.style.display = 'block';
        }
    }

    // Funciones de utilidad
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', options);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getEstadoText(estado) {
        const estados = {
            'nuevo': 'Nuevo',
            'usado': 'Usado',
            'reparacion': 'En Reparación',
            'baja': 'Baja'
        };
        return estados[estado] || estado;
    }
});