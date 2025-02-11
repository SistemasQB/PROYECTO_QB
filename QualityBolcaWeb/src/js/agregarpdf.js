import { Dropzone } from "dropzone";
import Swal from 'sweetalert2'

// alert('Funciono el dropzone')

// const token = document.getElementById('metacsrf').getAttribute('content');

// const btnAgregarImg = document.getElementById('btnEnviarPDF')
const token = document.querySelector('meta[name="csrf-token"]').content
//agregar pdf

Dropzone.options.formCV = {
    dictDefaultMessage: 'Sube tu CV aqui',
    acceptedFiles: '.pdf',
    maxFilesize: 10,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar CV',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token,
    },
    paramName: 'pdfFile',


    init: function () {

        const dropzone = this
        
        const btnPublicar = document.getElementById('btnEnviarPDF')
        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })

        // dropzone.on('sending', function (file, xhr, formData) {
        //     formData.append("filename", file.name);
        // })

        dropzone.on('error', function (file, mensaje) {
            console.log('ocurrio un error', mensaje);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: mensaje
            })
        })

        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                Swal.fire({
                    title: 'Enviado',
                    icon: 'success',
                    text: 'CV enviado con exito',
                    allowOutsideClick: false,
                    button: "OK"
                }).then((value) => {
                    if (value) {
                        location.href = '/solicitud'
                    }
                });;
            }
        })
    }
}
