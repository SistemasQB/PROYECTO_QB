// Script para funcionalidad adicional si es necesaria
document.addEventListener("DOMContentLoaded", () => {
  // Auto-guardar en localStorage
  const inputs = document.querySelectorAll("input, textarea")

  // Cargar datos guardados
  inputs.forEach((input) => {
    const savedValue = localStorage.getItem(input.name || input.id)
    if (savedValue) {
      input.value = savedValue
    }
  })

  // Guardar datos al cambiar
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (this.name || this.id) {
        localStorage.setItem(this.name || this.id, this.value)
      }
    })
  })

  // Función para limpiar formulario
  window.clearForm = () => {
    if (confirm("¿Está seguro de que desea limpiar todos los campos?")) {
      inputs.forEach((input) => {
        input.value = ""
        localStorage.removeItem(input.name || input.id)
      })
    }
  }

  // Función para imprimir
  window.printChecklist = () => {
    window.print()
  }

  console.log("Checklist de mantenimiento cargado correctamente")
})
