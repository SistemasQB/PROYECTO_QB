const rows = Array.from(document.querySelectorAll('tbody tr'));
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');

const rowsPerPage = 13;
let currentPage = 1;
let filteredRows = [...rows];
let selectedUser = null;
let selectedRoles = [];
let selectedPermisos = [];

function renderTable() {
    rows.forEach(row => row.style.display = 'none');

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    filteredRows.slice(start, end).forEach(row => {
        row.style.display = '';
    });

    renderPagination();
}

function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        currentPage--;
        renderTable();
    };
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => {
            currentPage = i;
            renderTable();
        };
        pagination.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        currentPage++;
        renderTable();
    };
    pagination.appendChild(nextBtn);
}

searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();

    filteredRows = rows.filter(row => {
        const nombre = row.children[0].textContent.toLowerCase();
        const puesto = row.children[1].textContent.toLowerCase();
        const rol = row.children[2].textContent.toLowerCase();

        return (
            nombre.includes(value) ||
            puesto.includes(value) ||
            rol.includes(value)
        );
    });

    currentPage = 1;
    renderTable();
});

function renderChips(containerId, values, removeFn) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    values.forEach(value => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `
            <span>${value}</span>
            <button type="button">×</button>
        `;

        chip.querySelector('button').onclick = () => removeFn(value);
        container.appendChild(chip);
    });
}

function removeRole(role) {
    selectedRoles = selectedRoles.filter(r => r !== role);
    renderChips('roles-chips', selectedRoles, removeRole);
}

function removePermiso(permiso) {
    selectedPermisos = selectedPermisos.filter(p => p !== permiso);
    renderChips('permisos-chips', selectedPermisos, removePermiso);
}

function actualizarBadgeEstado(badge, estado) {
    if (estado === 'A') {
        badge.textContent = 'Activo';
        badge.classList.remove('inactive');
        badge.classList.add('active');
    } else {
        badge.textContent = 'Restringido';
        badge.classList.remove('active');
        badge.classList.add('inactive');
    }
}

function createEditUserModal() {
    if (document.getElementById('editUserModal')) return;

    const modal = document.createElement('div');
    modal.id = 'editUserModal';
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-content large">

        <div class="modal-header">
          <div>
            <h2 id="eu-name">Nombre del usuario</h2>
            <p class="sub-info">
              <span id="eu-code"></span> · 
              <span id="eu-puesto"></span>
            </p>
          </div>
            <div class="toggle-section">
                <span class="status-badge active" id="eu-status">Activo</span>
                <label class="switch">
                    <input type="checkbox" id="eu-estado-toggle">
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div class="user-details">
            <div><strong>Email:</strong> <span id="eu-email"></span></div>
            <div><strong>Departamento:</strong> <span id="eu-depto"></span></div>
        </div>

        

        <form id="editUserForm">
          <div class="form-section">
            <label>Roles</label>
            <select id="eu-rol-select">
                <option value="">Agregar rol</option>
                <option value="administrador">Administrador</option>
                <option value="tecnologias de la informacion">TI</option>
                <option value="ach">Atracción de Capital Humano</option>
                <option value="gch">Gestión de Capital Humano</option>
                <option value="ventas">Ventas</option>
                <option value="servicio al cliente">Servicio al cliente</option>
                <option value="facturacion">Facturación</option>
                <option value="capturacion">Capturación</option>
                <option value="calidad">Calidad</option>
                <option value="logistica vehicular">Logística Vehicular</option>
                <option value="compras">Compras</option>
                <option value="alta direccion">Alta Dirección</option>
            </select>
            </div>

            <div class="chips-container" id="roles-chips"></div>

            <div class="form-section">
            <label>Permisos</label>
            <select id="eu-permiso-select">
                <option value="">Agregar permiso</option>
                <option value="administrador">Administrador</option>
                <option value="analista">Analista</option>
                <option value="auxiliar">Auxiliar</option>
                <option value="jefe calidad">Jefe de calidad</option>
                <option value="auxiliar logistica vehicular">Auxiliar Logística Vehicular</option>
                <option value="jefe">Jefe</option>
                <option value="gerente">Gerente</option>
                <option value="director">Director</option>
            </select>
        </div>

        <div class="chips-container" id="permisos-chips"></div>

          <div class="form-section">
            <label>Jerarquía</label>
            <select id="eu-jerarquia">
              <option value="1">nivel 1</option>
              <option value="2">nivel 2</option>
              <option value="3">nivel 3</option>
              <option value="4">nivel 4</option>
              <option value="5">nivel 5</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" onclick="closeEditUser()">Cancelar</button>
            <button type="submit" class="btn-primary-modal">Guardar cambios</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
}

function openEditUser(user) {
    createEditUserModal();
    selectedUser = user;

    const permisos = user.permisos ? JSON.parse(user.permisos) : {};

    // Header
    document.getElementById('eu-name').innerText = user.nombre;
    document.getElementById('eu-code').innerText = `Empleado #${user.codigoempleado}`;
    document.getElementById('eu-puesto').innerText = user.puesto || 'Sin puesto';

    // Info
    document.getElementById('eu-email').innerText = user.email || 'No disponible';
    document.getElementById('eu-depto').innerText = user.departamento || 'No asignado';

    // Estado
    const toggle = document.getElementById('eu-estado-toggle');
    const badge = document.getElementById('eu-status');

    // A = activo R = resringido
    const activo = user.estadoempleado === 'A';

    toggle.checked = activo;
    actualizarBadgeEstado(badge, user.estadoempleado);

    // Evento toggle
    toggle.onchange = async () => {
        const nuevoEstado = toggle.checked ? 'A' : 'R';

        try {
            const res = await fetch(
                `/sistemas/admin-usuarios/${user.codigoempleado}/estado`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        estado: nuevoEstado,
                        _csrf: tok
                    })
                }
            );

            const data = await res.json();
            if (!data.ok) throw new Error(data.msg);

            actualizarBadgeEstado(badge, nuevoEstado);

        } catch (error) {
            alert('No se pudo actualizar el estado');
            toggle.checked = !toggle.checked; // rollback visual
        }
    };

    // Dropdowns
    selectedRoles = permisos.roles || [];
    selectedPermisos = permisos.permisos || [];

    renderChips('roles-chips', selectedRoles, removeRole);
    renderChips('permisos-chips', selectedPermisos, removePermiso);
    document.getElementById('eu-jerarquia').value = permisos.jerarquia || 5;

    document.getElementById('editUserModal').style.display = 'flex';
}

function deleteUser(user) {
    console.log("eliminando usuario:", user);
}

function closeEditUser() {
    document.getElementById('editUserModal').style.display = 'none';
}

document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'editUserForm') return;
    e.preventDefault();

    const payload = {
        codigoempleado: selectedUser.codigoempleado,
        permisos: {
            jerarquia: parseInt(document.getElementById('eu-jerarquia').value),
            roles: selectedRoles,
            permisos: selectedPermisos
        }
    };

    try {
        const res = await fetch(
            `/sistemas/admin-usuarios/${payload.codigoempleado}/permisos`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    permisos: payload.permisos,
                    _csrf: tok
                })
            }
        );

        const data = await res.json();

        if (!data.ok) throw new Error(data.msg);

        alert('Permisos actualizados correctamente');
        closeEditUser();
        location.reload();

    } catch (error) {
        console.error(error);
        alert('Error al guardar permisos');
    }
});

document.addEventListener('change', e => {

    if (e.target.id === 'eu-rol-select') {
        const value = e.target.value;
        if (value && !selectedRoles.includes(value)) {
            selectedRoles.push(value);
            renderChips('roles-chips', selectedRoles, removeRole);
        }
        e.target.value = '';
    }

    if (e.target.id === 'eu-permiso-select') {
        const value = e.target.value;
        if (value && !selectedPermisos.includes(value)) {
            selectedPermisos.push(value);
            renderChips('permisos-chips', selectedPermisos, removePermiso);
        }
        e.target.value = '';
    }
});


// Inicializar
renderTable();
