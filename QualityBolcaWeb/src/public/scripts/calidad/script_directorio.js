

let currentEmployeeId = null
let nextId = 4

// Referencias a elementos del DOM
const searchInput = document.getElementById("searchInput")
const areaFilter = document.getElementById("areaFilter")
const departamentoFilter = document.getElementById("departamentoFilter")
const addEmployeeBtn = document.getElementById("addEmployeeBtn")
const employeeTableBody = document.getElementById("employeeTableBody")
const employeeModal = document.getElementById("employeeModal")
const deleteModal = document.getElementById("deleteModal")
const employeeForm = document.getElementById("employeeForm")
const modalTitle = document.getElementById("modalTitle")
const submitBtn = document.getElementById("submitBtn")



// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderEmployees()
  setupEventListeners()
  
})

function setupEventListeners() {
  // Búsqueda y filtros
  searchInput.addEventListener("input", filterEmployees)
  areaFilter.addEventListener("change", filterEmployees)
  departamentoFilter.addEventListener("change", filterEmployees)

  // Modal de empleado
  addEmployeeBtn.addEventListener("click", () => openEmployeeModal())
  document.getElementById("closeModal").addEventListener("click", closeEmployeeModal)
  document.getElementById("cancelBtn").addEventListener("click", closeEmployeeModal)
  employeeForm.addEventListener("submit", handleEmployeeSubmit)

  // Modal de eliminación
  document.getElementById("closeDeleteModal").addEventListener("click", closeDeleteModal)
  document.getElementById("cancelDeleteBtn").addEventListener("click", closeDeleteModal)
  document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete)

  // Cerrar modales al hacer clic fuera
  employeeModal.addEventListener("click", (e) => {
    if (e.target === employeeModal) closeEmployeeModal()
  })

  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) closeDeleteModal()
  })
}

function renderEmployees(employeesToRender = contactos) {
  employeeTableBody.innerHTML = ""
  if (employeesToRender.length === 0) {
    employeeTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">
                    No se encontraron empleados
                </td>
            </tr>
        `
    return
  }

  employeesToRender.forEach((employee) => {
    
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${employee.nombreCompleto}</td>
            <td>${employee.numeroCelular}</td>
            <td>${employee.email}</td>
            <td>${employee.area}</td>
            <td>${employee.departamento}</td>
            <td>${employee.puesto}</td>
            <td>
                <div class="actions">
                    <button class="edit-btn" onclick="editEmployee(${employee.id})">Editar</button>
                    <button class="delete-btn" onclick="openDeleteModal(${employee.id})">Eliminar</button>
                </div>
            </td>
        `
    employeeTableBody.appendChild(row)
  })
}

function filterEmployees() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedArea = areaFilter.value.trim().toLowerCase();
  const selectedDepartamento = departamentoFilter.value.trim().toLowerCase();

  const filteredEmployees = contactos.filter((employee) => {
    const nombre = employee.nombreCompleto?.toLowerCase() || '';
    const email = employee.email?.toLowerCase() || '';
    const puesto = employee.puesto?.toLowerCase() || '';
    const celular = employee.numeroCelular || '';
    const area = employee.area?.toLowerCase() || '';
    const departamento = employee.departamento?.toLowerCase() || '';

    const matchesSearch =
      nombre.includes(searchTerm) ||
      email.includes(searchTerm) ||
      puesto.includes(searchTerm) ||
      celular.includes(searchTerm);

    const matchesArea = !selectedArea || area === selectedArea;
    const matchesDepartamento = !selectedDepartamento || departamento === selectedDepartamento;

    return matchesSearch && matchesArea && matchesDepartamento;
  });

  console.log(filteredEmployees);
  renderEmployees(filteredEmployees);

  // const searchTerm = searchInput.value.toLowerCase()
  // const selectedArea = areaFilter.value.toLowerCase()
  // const selectedDepartamento = departamentoFilter.value.toLowerCase()

  // const filteredEmployees = contactos.filter((employee) => {
  //   const matchesSearch =
  //     employee.nombreCompleto.toLowerCase().includes(searchTerm) ||
  //     employee.email.toLowerCase().includes(searchTerm) ||
  //     employee.puesto.toLowerCase().includes(searchTerm) ||
  //     employee.numeroCelular.includes(searchTerm) 

  //   const matchesArea = !selectedArea || employee.area === selectedArea
  //   const matchesDepartamento = !selectedDepartamento || employee.departamento === selectedDepartamento

  //   return matchesSearch && matchesArea && matchesDepartamento
  // })
  
  // renderEmployees(filteredEmployees)
}

function openEmployeeModal(employee = null) {
  currentEmployeeId = employee ? employee.id : null

  if (employee) {
    modalTitle.textContent = "Editar Empleado"
    submitBtn.textContent = "Actualizar Empleado"
    fillForm(employee)
  } else {
    modalTitle.textContent = "Agregar Nuevo Empleado"
    submitBtn.textContent = "Agregar Empleado"
    clearForm()
  }

  clearErrors()
  employeeModal.classList.add("show")
}

function closeEmployeeModal() {
  submitBtn.removeAttribute("data-identificador");
  employeeModal.classList.remove("show")
  clearForm()
  clearErrors()
  currentEmployeeId = null
}

function fillForm(employee) {
  document.getElementById("nombre").value = employee.nombreCompleto
  document.getElementById("celular").value = employee.numeroCelular
  document.getElementById("email").value = employee.email
  document.getElementById("area").value = employee.area
  document.getElementById("departamento").value = employee.departamento
  document.getElementById("puesto").value = employee.puesto
}

function clearForm() {
  employeeForm.reset()
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((element) => (element.textContent = ""))

  const inputElements = document.querySelectorAll(".form-group input, .form-group select")
  inputElements.forEach((element) => element.classList.remove("error"))
}

function validateForm() {
  const formData = {
    nombre: document.getElementById("nombre").value.trim(),
    celular: document.getElementById("celular").value.trim(),
    email: document.getElementById("email").value.trim(),
    area: document.getElementById("area").value,
    departamento: document.getElementById("departamento").value,
    puesto: document.getElementById("puesto").value.trim(),
  }

  const errors = {}

  if (!formData.nombre) {
    errors.nombre = "El nombre es requerido"
  }

  if (!formData.celular) {
    errors.celular = "El número celular es requerido"
  }

  if (!formData.email) {
    errors.email = "El email es requerido"
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "El email no es válido"
  }

  if (!formData.area) {
    errors.area = "El área es requerida"
  }

  if (!formData.departamento) {
    errors.departamento = "El departamento es requerido"
  }

  if (!formData.puesto) {
    errors.puesto = "El puesto es requerido"
  }

  // Mostrar errores
  Object.keys(errors).forEach((field) => {
    const errorElement = document.getElementById(field + "Error")
    const inputElement = document.getElementById(field)

    if (errorElement && inputElement) {
      errorElement.textContent = errors[field]
      inputElement.classList.add("error")
    }
  })

  // Limpiar errores de campos válidos
  Object.keys(formData).forEach((field) => {
    if (!errors[field]) {
      const errorElement = document.getElementById(field + "Error")
      const inputElement = document.getElementById(field)

      if (errorElement && inputElement) {
        errorElement.textContent = ""
        inputElement.classList.remove("error")
      }
    }
  })

  return { isValid: Object.keys(errors).length === 0, formData }
}

function handleEmployeeSubmit(e) {
  e.preventDefault()

  const validation = validateForm()

  if (validation.isValid) {
    if (currentEmployeeId) {
      updateEmployee(currentEmployeeId, validation.formData)
    } else {
      addEmployee(validation.formData)
    }
    closeEmployeeModal()
  }
}

function addEmployee(employeeData) {
  const newEmployee = {
    id: nextId++,
    ...employeeData,
  }

  employees.push(newEmployee)
  renderEmployees()
  filterEmployees() // Aplicar filtros actuales
}

function updateEmployee(id, employeeData) {
  const index = employees.findIndex((emp) => emp.id === id)
  if (index !== -1) {
    employees[index] = { id, ...employeeData }
    renderEmployees()
    filterEmployees() // Aplicar filtros actuales
  }
}

function editEmployee(id) {
  const employee = contactos.find((emp) => emp.id === id)
  if (employee) {
    openEmployeeModal(employee)
    submitBtn.setAttribute('data-identificador', id)
  }
}

function openDeleteModal(id) {
  const employee = contactos.find((emp) => emp.id === id)
  if (employee) {
    currentEmployeeId = id
    document.getElementById("deleteEmployeeName").textContent = employee.nombreCompleto
    deleteModal.classList.add("show")
  }
}

function closeDeleteModal() {
  // submitBtn.removeAttribute('data-identificador');
  deleteModal.classList.remove("show")
  currentEmployeeId = null
}

async function confirmDelete() {
  if (currentEmployeeId) {
    employees = contactos.filter((emp) => emp.id !== currentEmployeeId)
    let campos = {id: currentEmployeeId, _csrf: tok, tipo: 'delete'}
    await alertaFetchCalidad('http://192.168.10.85:3000/calidad2/crud',campos,'http://192.168.10.85:3000/calidad2/directorioPersonal')

    //deletear contacto de la base de datos con el fetch
    // renderEmployees()
    // filterEmployees() // Aplicar filtros actuales
    // closeDeleteModal()
  }
}

async function actualizarUsuario(id){
  
    let nombreCompleto = document.getElementById('nombre').value
    let numeroCelular= document.getElementById('celular').value
    let email=document.getElementById('email').value
    let area = document.getElementById('area').value
    let departamento = document.getElementById('departamento').value
    let puesto = document.getElementById('puesto').value
    let datos = {
      id:id,
      nombreCompleto : nombreCompleto.toUpperCase(),
      numeroCelular: numeroCelular,
      email:email,
      area : area,
      departamento: departamento,
      puesto : puesto.toUpperCase(),
      _csrf: tok,
      tipo:'update'
  }
  
  await alertaFetchCalidad('http://192.168.10.85:3000/calidad2/crud',datos,'http://192.168.10.85:3000/calidad2/directorioPersonal')
}

function decision(){
  switch(submitBtn.innerText){
    case 'Agregar Empleado':
      juntarInformacion()
      break;
    default:
      let id = submitBtn.getAttribute('data-identificador')
      actualizarUsuario(id)
      break;
  }

}

async function juntarInformacion(){
    let nombreCompleto = document.getElementById('nombre').value
    let numeroCelular= document.getElementById('celular').value
    let email=document.getElementById('email').value
    let area = document.getElementById('area').value
    let departamento = document.getElementById('departamento').value
    let puesto = document.getElementById('puesto').value
    let datos = {
      nombreCompleto : nombreCompleto.toUpperCase(),
      numeroCelular: numeroCelular,
      email:email,
      area : area,
      departamento: departamento,
      puesto : puesto.toUpperCase(),
      _csrf: tok,
      tipo:'insert'
  }
  let comprobacion = validacionJson(datos)
  if (comprobacion == false){
    alert(`debes completar todos los campos`)
    return
  } 
  await alertaFetchCalidad('http://192.168.10.85:3000/calidad2/crud',datos,'http://192.168.10.85:3000/calidad2/directorioPersonal')
  
}


function validacionJson(campos){
  Object.entries(campos).forEach(([key, valor])=>{
    if(!valor) {
      alert(`falta el campo ${key}`)
      return false}
  })
}

