import { Dropzone } from "dropzone";

// alert('Funciono el dropzone')

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


Dropzone.options.formRequisicion = {
    dictDefaultMessage: 'Sube tus imágenes aqui',
    acceptedFiles: '.png, .jpg, .jpeg',
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
    paramName: 'imagen'
}