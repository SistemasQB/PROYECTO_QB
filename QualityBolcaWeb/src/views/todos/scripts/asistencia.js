const btnEnviar = document.getElementById('btnBuscar')
const btnAsistio = document.getElementById('btnBuscar')
const region = document.getElementById('selectRegion')

btnEnviar.addEventListener("click", ()=>{
    console.log('Boton presionado');
    
    fetch('/asistencia'+ region.value,{
        method: GET
    })
})

function enviarAsistencia(nombre, Plantas, estatus){
    console.log(nombre + Plantas + estatus);
    location.href = '/asistencia/' + nombre + planta + estatus
}