import { Dropzone } from "dropzone";

// alert('Funciono el dropzone')



// const token = document.getElementById('metacsrf').getAttribute('content');

const btnAgregarImg = document.getElementById('btnAgregarImg')
const token = document.querySelector('meta[name="csrf-token"]').content
//agregar imagenees

Dropzone.options.formImagen = {
    dictDefaultMessage: 'Sube tus imágenes aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Imagen',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const btnPublicar = document.getElementById('btnEnviarImg')

        btnPublicar.addEventListener('click',function(){
            dropzone.processQueue()
        })

        dropzone.on('error', function(file, mensaje){
            // console.log('ocurrio un error', mensaje);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: mensaje
            })
        })

        dropzone.on('queuecomplete', function(){
            if (dropzone.getActiveFiles().length == 0) {
                Swal.fire({
                    title: 'Enviado',
                    icon: 'success',
                    text: 'Imagen enviada con exito'
                })
                btnAgregarImg.hidden=true
            }
        })
    }
}
