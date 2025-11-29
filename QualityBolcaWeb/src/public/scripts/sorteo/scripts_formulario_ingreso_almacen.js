
document.addEventListener("DOMContentLoaded", () => {
  renderizarContenido()
})

function renderizarContenido(){
    let tabla = document.getElementById('partidasBody');
    
    let partidasTotales = JSON.parse(embarque.partidas)
    
    let partidas = partidasTotales.map((p) => {
        
        return `
            <tr>
                <td><input type="date" class="table-input" value="${p.fecha}"></td>
                <td><input type="text" class="table-input" value="${p.numeroParte}"></td>
                <td><input type="text" class="table-input" value="${p.descripcion}"></td>
                <td><input type="number" class="table-input" value="${p.numeroCajas}" min="0"></td>
                <td><input type="number" class="table-input" value="${p.cantidadPiezas}" min="0"></td>
                <td><input type="text" class="table-input" value="${p.totalConcatenado}" min="0"></td>
                <td><input type="number" class="table-input total-field" value = "${p.totalMultiplicado}" min="0"></td>
            </tr>
        `
    }).join(' ')

  tabla.innerHTML = partidas
  let observaciones = document.getElementById('observaciones');
  observaciones.value = embarque.observaciones
  
  if(embarque.imagenEmbarque != 'imagen sin declarar'){

    let contenedor = document.getElementById('contenedorPadre')
    let contenedor2= document.getElementsByClassName('image-upload-content')
    contenedor2[0].style.height = '90%';
    contenedor.style.height = '492px';
    let evidencia = document.getElementById('imagenEvidencia');
    evidencia.classList.remove('image-upload-icon')
    evidencia.classList.add('imagen')
    evidencia.style.backgroundImage = `url('/evidencias_sorteo/${embarque.imagenEmbarque}')`
    evidencia.style.backgroundSize = 'cover'; 
    evidencia.style.backgroundRepeat = 'no-repeat';
    evidencia.style.backgroundPosition = 'center';
    let hijo = document.getElementById("logoDefault")
    evidencia.removeChild(hijo)
  }
    let firmas = JSON.parse(embarque.firmas)
    let nombreEntrega = document.getElementById('nombreEntrega');
    nombreEntrega.value = embarque.entrego
    let firmaEntrega = document.getElementById('canvasEntrega');
    firmaEntrega.style.backgroundImage = `url('/evidencias_sorteo/${firmas.entrega}')`
    firmaEntrega.style.backgroundSize = 'cover'
    firmaEntrega.style.backgroundRepeat = 'no-repeat';
    firmaEntrega.style.backgroundPosition = 'center';

    let nombreRecibe = document.getElementById('nombreRecibe');
    nombreRecibe.value = embarque.recibio
    let firmaRecibe = document.getElementById('firmaRecibe');
    let ei = document.createElement('img')
    ei.setAttribute('src', `/evidencias_sorteo/${firmas.recibe}`)
    ei.style.width = '100%'
    ei.style.height = '100%'
    firmaRecibe.appendChild(ei)
    // firmaRecibe.style.backgroundImage = `url('/evidencias_sorteo/${firmas.recibe}')`
    // firmaRecibe.style.backgroundSize = 'cover'
    // firmaRecibe.style.backgroundRepeat = 'no-repeat';
    // firmaRecibe.style.backgroundPosition = 'center';
}

