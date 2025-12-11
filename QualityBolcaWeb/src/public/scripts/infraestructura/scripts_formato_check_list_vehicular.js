// Script para funcionalidad adicional si es necesaria
document.addEventListener("DOMContentLoaded", () => {
  
  try {
    Object.entries(datos).forEach(([key, value]) => {
      datos[key] = JSON.parse(datos[key])    
    })    
  } catch (error) {
    
  }
  console.log(datos);
  renderDatosUnidad();
  renderLlantas();
  renderAccesorios();
  renderDocs()
  renderDatosFinales()
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
    if(i < 3){
      if(input.name == 'funcional'){
        let funcionalidad = datos.componentesPrincipales.bateria.funcional
        if(funcionalidad){
          input.value = "FUNCIONAL"
          input.disabled=true
          continue
        }else{
          input.value = "DEFECTUOSA"
          input.disabled=true
          continue
        }
      }
      input.value = datos.componentesPrincipales.bateria[input.name]
      input.disabled=true
    }else{
      switch(i){
        case 3:
          let funcionalidad = datos.componentesPrincipales.catalizador.funcional
          if(funcionalidad){
          input.value = "FUNCIONAL"
          input.disabled=true
          continue
        }else{
          input.value = "DEFECTUOSA"
          input.disabled=true
          continue
        }
        case 4:
          input.value = datos.componentesPrincipales.catalizador.marca
          input.disabled=true
          break;
        case 5:
          input.value = datos.componentesPrincipales.catalizador.serie
          input.disabled=true
          break;
      }
    }
    
  }
  
}

function renderDocs(){
  let documentos = datos.datosUnidad.documentacion
  documentos.limpieza_exterior =  datos.fluidos.limpieza_exterior
  documentos.limpieza_interior =  datos.fluidos.limpieza_interior
  
  let contenedor = document.getElementById('contenedorDocumentos')
  let inputs = contenedor.querySelectorAll('input')

  for (const input of inputs){
    let name = input.getAttribute('name')
    input.value = documentos[name]
  }
}

function renderDatosFinales(){
  let campoObservaciones = document.getElementById('observacionesUsuario')
  campoObservaciones.value = datos.observaciones
  campoObservaciones.disabled = true
  let fecha = new Date(datos.createdAt).toLocaleDateString('en-GB', {year: 'numeric', month: 'numeric', day: 'numeric'})
  document.getElementById('fechaEntrega').value = fecha
  document.getElementById('fechaEntrega').disabled = true
  document.getElementById('horaEntrega').value = datos.createdAt.split("T")[1].split(".")[0]
  
  document.getElementById('firmaConductor').innerText = datos.datosUnidad.usuario

}
 