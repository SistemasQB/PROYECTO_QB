

// Funciones para la página de creación de tickets
let estadoFormulario = {

}

// Validación en tiempo real
const form = document.getElementById("ticketForm")
const fields = ["titulo", "categoria", "prioridad", "descripcion"]

// Agregar listeners para validación en tiempo real
fields.forEach((fieldName) => {
  const field = document.getElementById(fieldName)
  const errorElement = document.getElementById(`${fieldName}Error`)

  field.addEventListener("blur", () => {
    
    validateField(field, errorElement)
  })

  field.addEventListener("input", () => {
    if (field.classList.contains("error")) {
      validateField(field, errorElement)
    }
  })
})

// Función de validación de campo
function validateField(field, errorElement) {
  const value = field.value.trim()
  let isValid = true
  let errorMessage = ""

  if (field.hasAttribute("required") && !value) {
    isValid = false
    errorMessage = "Este campo es obligatorio"
  } else if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
      errorMessage = "Ingrese un correo electrónico válido"
    }
  } else if (field.id === "titulo" && value && value.length < 5) {
    isValid = false
    errorMessage = "El título debe tener al menos 5 caracteres"
  } else if (field.id === "descripcion" && value && value.length < 20) {
    isValid = false
    errorMessage = "La descripción debe tener al menos 20 caracteres"
  }

  if (!isValid) {
    field.classList.add("error")
    errorElement.textContent = errorMessage
    
    errorElement.classList.add("show")
  } else {
    field.classList.remove("error")
    errorElement.textContent = ""
    errorElement.classList.remove("show")
  }

  return isValid
}

// Manejo del envío del formulario
let btnEnvio = document.getElementById('btnEnvio');
btnEnvio.addEventListener("click", async (e) => {
  
  // Validar todos los campos
  let isFormValid = true
  let campos = {}
  fields.forEach((fieldName) => {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}Error`)
    if (!validateField(field, errorElement)) {
      isFormValid = false;
    }
    campos[fieldName] = field.value
  })
  
  if (!isFormValid) {
    return ;
  }
  estadoFormulario.datosTicket = JSON.stringify(campos)
  let fecha = new Date(Date.now())
  let dia = fecha.getDay();
  let mes = fecha.getMonth() + 1;

  if(dia < 10) dia = `0`+ dia
  if(mes < 10) mes = `0`+ mes
  estadoFormulario.folio = `INC-${fecha.getFullYear()}${mes}${dia}-${Math.floor(Math.random() * 1000000) + 1}`;
  estadoFormulario._csrf = tok
  estadoFormulario.tipo = 'insert'
  
  await alertaFetchCalidad('crudTickets',estadoFormulario,'admin-tickets')
  // Crear objeto de ticket
  // const ticket = {
  //   id: "TKT-" + Date.now(),
  //   title: document.getElementById("title").value.trim(),
  //   category: document.getElementById("category").value,
  //   priority: document.getElementById("priority").value,
  //   description: document.getElementById("description").value.trim(),
  //   status: "assigned",
  //   createdAt: new Date().toISOString(),
  // }

  // // Guardar en localStorage
  // const tickets = JSON.parse(localStorage.getItem("tickets") || "[]")
  // tickets.push(ticket)
  // localStorage.setItem("tickets", JSON.stringify(tickets))

  // Mostrar mensaje de éxito
  // document.getElementById("ticketNumber").textContent = ticket.id
  // document.getElementById("successMessage").style.display = "block"
  // form.style.display = "none"

  // Resetear formulario después de 3 segundos
  // setTimeout(() => {
  //   form.reset()
  //   form.style.display = "flex"
  //   document.getElementById("successMessage").style.display = "none"
  // }, 3000)
})
