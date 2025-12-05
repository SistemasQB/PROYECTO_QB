// Script para funcionalidad adicional si es necesaria
document.addEventListener("DOMContentLoaded", () => {
  
  try {
    Object.entries(datos).forEach(([key, value]) => {
      datos[key] = JSON.parse(datos[key])    
    })    
  } catch (error) {
    
  }
  console.log(datos)
  renderDatosUnidad();
  renderLlantas();
  renderAccesorios();
})

function renderDatosUnidad(){
  let datosUnidad = datos.datosUnidad
  let contenedor = document.querySelector('.primer')
  let inputs = contenedor.querySelectorAll('input')
  for(const input of inputs){
      if(input.getAttribute('name') == 'fecha'){
        let miFecha =  new Date(datos.createdAt).toLocaleDateString('en-GB', {year: 'numeric', month: 'numeric', day: 'numeric'})
        input.value = miFecha 
        input.disabled= true
        continue;
      }
    input.value = datosUnidad[input.getAttribute('name')]
    input.disabled= true
  }
  inputs = contenedor.querySelector('textarea')
  datos.observacionesLogistica = JSON.parse(datos.observacionesLogistica)
  inputs.value = datos.observacionesLogistica.observaciones
  inputs.disabled= true
}

function renderLlantas(){
  let llantas = Object.values(datos.llantas)
  let contenedor = document.getElementById('tablaLlantas')
  for(const fila of contenedor.rows){
    let inputs = fila.querySelectorAll('input')
    for(const [i, input] of inputs.entries()){
      input.value = llantas[i][input.getAttribute('name')]
      input.disabled=true
    }
  }
}
function renderAccesorios(){
  let contenedor = document.getElementById('tablaAccesorios')
  let inputs = contenedor.querySelectorAll('input')
  let grupos = {
    accesorios : datos.accesoriosUnidad,
    componentes : datos.componentesPrincipales,
    fluidos : datos.fluidos,
    electrico : datos.sistemaElectrico
  }
  for(const input of inputs){
    let nombreCampo = input.getAttribute('name')
    for (const grupo of Object.keys(grupos)) {
      if (Object.prototype.hasOwnProperty.call(grupos[grupo], nombreCampo)) {
        input.value = grupos[grupo][input.getAttribute('name')]
        input.disabled=true
        break;
      }
    }
  }
  inputs = contenedor.querySelectorAll('[data-bateria], [data-catalizador]')
  
  for (const [i, input] of inputs.entries()) {
    if(i <3){
      input.value = datos.componentesPrincipales.bateria[i]
    }else{
      input.value = datos.componentesPrincipales.catalizador[i]
    }
    
  }
  
}
  // // Auto-guardar en localStorage
  // const inputs = document.querySelectorAll("input, textarea")
  // // Cargar datos guardados
  // inputs.forEach((input) => {
  //   const savedValue = localStorage.getItem(input.name || input.id)
  //   if (savedValue) {
  //     input.value = savedValue
  //   }
  // })

  // Guardar datos al cambiar
  // inputs.forEach((input) => {
  //   input.addEventListener("change", function () {
  //     if (this.name || this.id) {
  //       localStorage.setItem(this.name || this.id, this.value)
  //     }
  //   })
  // })

  // // Función para limpiar formulario
  // window.clearForm = () => {
  //   if (confirm("¿Está seguro de que desea limpiar todos los campos?")) {
  //     inputs.forEach((input) => {
  //       input.value = ""
  //       localStorage.removeItem(input.name || input.id)
  //     })
  //   }
  // }

  // // Función para imprimir
  // window.printChecklist = () => {
  //   window.print()
  // }