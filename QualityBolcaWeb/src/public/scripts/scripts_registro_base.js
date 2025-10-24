let departamentos = {
  AdministracionyFinanzas:['Facturacion y Cobranza'],
  ComercializacionyVentas:['Comercializacion y Ventas'],
  ControlyMejoradelServicio:['Control y Mejora del Servicio'],
  EjecuciondelServicio:['Ejecucion del Servicio', 'Capturacion'],
  GestiondeCapitalHumano:['Atraccion de capital Humano', 'Gerstion de Capital Humano','Nominas'],
  GestiondeInfraestructura:['Compras', 'Gastos', 'Logistica Vehicular', 'Tecnologias de la Informacion'],
  Planeaciondelservicio:['Servicio al Cliente'],
  PlaneacionyDireccionEstrategica:['Alta Direccion'],
  SistemadeGestiondelaCalidad:['Sistema de Gestion de la Calidad'],
}


// Referencias a elementos del DOM
const form = document.getElementById("userRegistrationForm")
const submitBtn = document.getElementById("submitBtn")
const clearBtn = document.getElementById("clearBtn")
const spinner = document.getElementById("spinner")
const submitText = document.getElementById("submitText")
const toast = document.getElementById("toast")
const toastIcon = document.getElementById("toastIcon")
const toastTitle = document.getElementById("toastTitle")
const toastMessage = document.getElementById("toastMessage")
const puesto = document.getElementById("puesto")
const departamento = document.getElementById("departamento")


//escucha de puestos y departamentos
departamento.addEventListener('change', (e) => {
  for (const [dep, valor] of Object.entries(departamentos)){
    let de = e.target.value.replace(/ /g, '')
    if(dep == de){
        let op = valor.map((puesto) => {
            return `<option value="${puesto}">${puesto}</option>`
        }).join('')
        puesto.innerHTML = op
        break;
      }
  }
  
    
})

// Validación en tiempo real
const inputs = form.querySelectorAll("input, select, textarea")
inputs.forEach((input) => {
  input.addEventListener("blur", () => validateField(input))
  input.addEventListener("input", () => {
    if (input.classList.contains("error")) {
      validateField(input)
    }
  })
})

// Función de validación de campo individual
function validateField(field) {
  const errorElement = document.getElementById(`${field.id}-error`)
  let isValid = true
  let errorMessage = "Este campo es requerido"

  // Limpiar error previo
  field.classList.remove("error")
  if (errorElement) {
    errorElement.classList.remove("show")
  }

  // Validar campo requerido
  if (field.hasAttribute("required") && !field.value.trim()) {
    isValid = false
  }

  // Validaciones específicas
  if (field.value.trim()) {
    switch (field.id) {
      case "email":
      case "emailPersonal":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(field.value)) {
          isValid = false
          errorMessage = "Ingrese un correo válido"
        }
        break
      case "curp":
        const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/
        if (!curpRegex.test(field.value.toUpperCase())) {
          isValid = false
          errorMessage = "CURP inválido (18 caracteres)"
        }
        break
      case "telefono":
        const telefonoRegex = /^[0-9]{10}$/
        if (!telefonoRegex.test(field.value)) {
          isValid = false
          errorMessage = "Ingrese 10 dígitos"
        }
        break
    }
  }

  // Mostrar error si no es válido
  if (!isValid) {
    field.classList.add("error")
    if (errorElement) {
      errorElement.textContent = errorMessage
      errorElement.classList.add("show")
    }
  }

  return isValid
}

// Validar todo el formulario
function validateForm() {
  let isValid = true
  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false
    }
  })
  return isValid
}

// Mostrar notificación toast
function showToast(type, title, message) {
  toast.className = `toast ${type} show`
  toastTitle.textContent = title
  toastMessage.textContent = message

  // Cambiar icono según el tipo
  if (type === "success") {
    toastIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
  } else {
    toastIcon.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
  }

  // Ocultar después de 5 segundos
  setTimeout(() => {
    toast.classList.remove("show")
  }, 5000)
}

// Envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    showToast("error", "Error de validación", "Por favor, corrija los errores en el formulario")
    return
  }

  // Mostrar estado de carga
  submitBtn.disabled = true
  spinner.classList.add("show")
  submitText.textContent = "Registrando..."

  // Recopilar datos del formulario
  const formData = new FormData(form)
  const userData = Object.fromEntries(formData.entries())

  // Convertir CURP a mayúsculas
  // if (userData.curp) {
  //   userData.curp = userData.curp.toUpperCase()
  // }

  // Simular envío al servidor (aquí conectarías con tu API)
  try {
    // Simulación de petición
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Datos del usuario:", userData)

    // Mostrar éxito
    showToast("success", "Usuario registrado", "El usuario ha sido registrado exitosamente")

    // Limpiar formulario después del éxito
    form.reset()
  } catch (error) {
    showToast("error", "Error", "Hubo un problema al registrar el usuario")
  } finally {
    // Restaurar botón
    submitBtn.disabled = false
    spinner.classList.remove("show")
    submitText.textContent = "Registrar Usuario"
  }
})

// Limpiar formulario
clearBtn.addEventListener("click", () => {
  form.reset()
  // Limpiar todos los errores
  inputs.forEach((input) => {
    input.classList.remove("error")
    const errorElement = document.getElementById(`${input.id}-error`)
    if (errorElement) {
      errorElement.classList.remove("show")
    }
  })
  showToast("success", "Formulario limpiado", "Todos los campos han sido restablecidos")
})

// Establecer fecha máxima para fecha de nacimiento (18 años atrás)
// const fechaNacimiento = document.getElementById("fechaNacimiento")
// const today = new Date()
// const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
// fechaNacimiento.max = maxDate.toISOString().split("T")[0]

// Establecer fecha máxima para fecha de ingreso (hoy)
// const fechaIngreso = document.getElementById("fechaIngreso")
// fechaIngreso.max = today.toISOString().split("T")[0]
