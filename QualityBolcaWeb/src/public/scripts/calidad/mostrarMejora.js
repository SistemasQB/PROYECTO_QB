


document.addEventListener('DOMContentLoaded', ()=>{
    
    const mejorasGrid = document.getElementById('mejorasGrid');
    
    mejorasGrid.addEventListener('click', (evento)=> {
        if(evento.target.classList.contains("botonModal")){
            let id = evento.target.getAttribute('data-id');
            crearModal(id);
            
        }
        
    });
})

function crearModal(id){
    let mejora = resultados.find(d => d.id == id);    
    let cont = document.createElement('div');
    cont.classList.add('modal')
    cont.setAttribute('id',"modal")
    let modal = `
        <div class="modal-content">
            <div class="modal-header">
                    <h2>${mejora.nombre_mejora}</h2>
                <button id="closeModalBtn" class="close-btn" onclick="">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="mejoraForm" class="modal-form">
                <div class="form-row">
                    <div>
                        <label >rubro:</label>        
                        <b class = 'btn btn-primary'> ${mejora.rubro}</b>
                    </div>
                    <div class="card-info">
                        <p>inversion:</p>
                        <i class="fas fa-usd"></i>
                        <span class="name"><b class= 'btn btn-warning'>${mejora.monto}</b></span>
                    </div>
                    <div class="card-info">
                        <p>tiempo recuperacion: </p>
                        <i class="fa fa-clock-o" ></i>
                        <span class="name"><b>${mejora.recuperacion} Meses</b></span>
                    </div>
                </div>
                
                
                <div class="form-group">
                    <label for="situacionActual">Situación Actual *</label>
                    <textarea id="situacionActual" name="situacionActual" rows="4" disabled>${mejora.situacion_actual}</textarea>
                </div>

                
                <div class="form-group">
                    <label for="mejoraProuesta">Mejora Propuesta *</label>
                    <textarea id="mejoraProuesta" name="mejoraProuesta" rows="4" disabled>${mejora.situacion_mejora}</textarea>
                </div>
                <div class = 'form-group'>
                    <embed src="../analisis/${mejora.titulo_analisis}" type="application/pdf" class="pdf-container">
                </div>    
                
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" id="cancelBtn">RECHAZAR</button>
                    <button type="button" class="btn btn-primary" indice = ${mejora.id} id = 'btnModificable'>MODIFICABLE</button>
                    <button type="button" class="btn btn-warning" indice = ${mejora.id} id = 'btnAceptarRetraso'>ACEPTAR EN PERIODO</button>
                    <button type="button" class="btn btn-success" indice = ${mejora.id} id = 'btnAceptar'>ACEPTAR</button>
                </div>
            </form>
        </div>
    `
    cont.innerHTML = modal;
    cont.addEventListener('click', (evento)=>{
        if(evento.target.classList.contains('fa-times') ){  //|| evento.target.classList.contains('modal')
            cont.remove()
        }
        if(evento.target.classList.contains('btn-danger')){
            crearModalHijo(cont, id);
        }else if(evento.target.getAttribute("indice")){
            let texto = evento.target.getAttribute("id")
            
            switch(texto){
                case 'btnModificable':

                    modalJustificacion(document.body, id,"modificable") 
                    break;
                case 'btnAceptarRetraso':
                    modalJustificacion(document.body, id,"aceptarRetraso") 
                    break;

            }
        }
    })
    
    let cuerpo = document.body.appendChild(cont)

    
    let btnAceptar = document.getElementById('btnAceptar');
    btnAceptar.addEventListener("click", async ()=>{
        let id = btnAceptar.getAttribute("indice")
        let datos = {id: id, estatus: 3, _csrf: tok}
        await alertaFetchCalidad("actualizarMejoras",datos,"administracionmejoras")
        
    });
    cont.style.display = 'flex';
}

function crearModalHijo(modalPadre, id, tipo){
    let cont = document.createElement('div');
    cont.classList.add('modal')
    cont.classList.add('modal-rechazo')
    cont.setAttribute('id', id)

    let contenidoModal = `
        <div class="modal-content modal-content-rechazo">
            <form>
                <div class="modal-header">
                    <input type="hidden" name="_csrf" value="${tok}" unico='si'>
                    <h3>Motivo de Rechazo</h3>
                    <button class="close-btn-rechazo">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label for="motivoRechazo">Por favor, ingrese el motivo del rechazo:</label>
                    <textarea id="motivo" name="motivoRechazo" rows="4" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary btn-cancelar-rechazo">Cancelar</button>
                    <button type="button" indice = "${id}" class="btn btn-danger btn-confirmar-rechazo">Confirmar</button>
                </div>
            </form>
        </div>
        `     
    cont.innerHTML = contenidoModal
    document.body.appendChild(cont)
    cont.style.display = 'flex'

    cont.addEventListener('click', async (evento) => {
        if (evento.target.classList.contains('fa-times') || 
            evento.target.classList.contains('modal-rechazo') ||
            evento.target.classList.contains('btn-cancelar-rechazo')) {
            cont.remove();
        }
        if (evento.target.classList.contains('btn-confirmar-rechazo')) {
            let motivo = cont.querySelector('#motivo').value.trim();
            if (motivo) {
                let datos = {    
                    id: evento.target.getAttribute('indice'),
                    motivo: motivo,
                    _csrf: tok
                }
                await alertaFetchCalidad('rechazarMejora',datos,'administracionmejoras')
                cont.remove();
                modalPadre.remove(); // Cierra también el modal principal

            } else {
                alert('Por favor, ingrese un motivo de rechazo');
            }
        
    }})}




function modalJustificacion(padre, id , justificacion){
    let cont = document.createElement('div');
    cont.classList.add('modal1')
    cont.classList.add('modal-rechazo')
    cont.setAttribute('id', id)
    let contenidoModal 
    switch(justificacion){
        case 'modificable':
        contenidoModal= `
            <div class="modal-content modal-content-rechazo">
                <form>
                    <div class="modal-header">
                        <input type="hidden" name="_csrf" value="${tok}" unico='si'>
                        <h3>puntos a modificar</h3>
                        <button class="close-btn-rechazo">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="form-group">
                        <label for="motivoRechazo">Por favor, ingrese los puntos a modificar de la mejora:</label>
                        <textarea id="motivo" name="motivo" rows="4" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary btn-cancelar-rechazo" id = 'btnCancelar1'>Cancelar</button>
                        <button type="button" indice="${id}" class="btn btn-success btn-confirmar-rechazo" id = 'btnConfirmacion'>Confirmar</button>
                    </div>
                </form>
            </div>
            `     
            break;
        case 'aceptarRetraso':
            contenidoModal = `
            <div class="modal-content modal-content-rechazo">
                <form>
                    <div class="modal-header">
                        <input type="hidden" name="_csrf" value="${tok}" unico='si'>
                        <h3>puntos a modificar</h3>
                        <button class="close-btn-rechazo">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="form-group">
                        <label for="motivoRechazo">Por favor, ingrese la justificacion:</label>
                        <textarea id="motivo" name="motivo" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="motivoRechazo">Por favor, ingrese la fecha de aceptacion</label>
                        <input id="fechaRetraso" name="motivo" type= 'date'  required></input>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary btn-cancelar-rechazo" id='btnCancelar1'>Cancelar</button>
                        <button type="button" indice="${id}" class="btn btn-success btn-confirmar-rechazo" id = 'btnConfirmacion'>Confirmar</button>
                    </div>
                </form>
            </div>
            `
            break;
    }
    
          
    cont.innerHTML = contenidoModal
    document.body.appendChild(cont)
    cont.style.display = 'flex'

    let btnConfirmar = document.getElementById("btnConfirmacion")
    let btnCancelar = document.getElementById("btnCancelar1")

    btnCancelar.addEventListener("click", ()=>{
        cont.remove(cont);
    })
    btnConfirmar.addEventListener("click", async()=>{
        let dato = document.getElementById("motivo")
        let id = btnConfirmar.getAttribute("indice");
        
        let datos = {
            id: id,
            _csrf: tok,
        }
        switch(justificacion){
            case 'modificable':
                datos.motivo = dato.value
                datos.estatus = 2
                break;
            case 'aceptarRetraso':
                let fechaRetraso = document.getElementById("fechaRetraso")
                
                datos.fecha_respuesta_comite =  fechaRetraso.value;
                datos.motivo = dato.value
                datos.estatus = 3
                break;
        };
        await alertaFetchCalidad("actualizarMejoras",datos,"administracionmejoras")
        cont.remove()
    })

    cont.addEventListener('click', async (evento) => {
        if ( evento.target.classList.contains('fa-times') || 
            evento.target.classList.contains('btn-cancelar-rechazo')) {
            cont.remove();
        }
    //     if (evento.target.classList.contains('btn-confirmar-rechazo')) {
    //         let motivo = cont.querySelector('#motivo').value.trim();
    //         if (motivo) {
    //             // let datos = {    
    //             //     id: evento.target.getAttribute('indice'),
    //             //     motivo: motivo,
    //             //     _csrf: tok
    //             // }
    //             // await alertaFetchCalidad('http://192.168.10.65:3000/calidad2/rechazarMejora',datos,'http://192.168.10.65:3000/calidad2/administracionmejoras')
                // cont.remove();
                

    //         } else {
    //             alert('Por favor, ingrese toda la informacion');
    //         }
    // }

})
}
