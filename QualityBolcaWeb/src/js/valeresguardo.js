import { Dropzone } from "dropzone";
import Swal from 'sweetalert2'
import EXIF from 'exif-js';

// alert('Funciono el dropzone')

// const token = document.getElementById('metacsrf').getAttribute('content');

// const btnAgregarImg = document.getElementById('btnEnviarPDF')
const token = document.querySelector('meta[name="csrf-token"]').content
//agregar pdf
let text2 = ''
let text3

Dropzone.options.myDropzone = {
    dictDefaultMessage: 'Sube tu Firma aquí en formato .WEBP',
    acceptedFiles: '.WEBP', // Solo permite archivos .webp
    maxFilesize: 10, // Tamaño máximo en MB
    maxFiles: 1, // Limita a 1 archivo
    parallelUploads: 1, // Subida en paralelo limitada a 1 archivo
    autoProcessQueue: false, // No procesar automáticamente
    addRemoveLinks: true, // Permitir enlaces para eliminar archivos
    dictRemoveFile: 'Borrar firma',
    dictMaxFilesExceeded: 'El límite es 1 archivo',
    headers: {
        'CSRF-Token': token,
    },
    paramName: 'firmaFile',

    init: function () {
        
        let validacionImg = false
        const dropzone = this

        // Validar formato en el evento "addedfile"
        dropzone.on("addedfile", function (file) {
            console.log(file);
            console.log('h2',file.type);
            if (file.type !== "image/webp") {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Solo se permiten imágenes en formato .WEBP',
                    allowOutsideClick: false,
                    button: "OK"
                }).then((value) => {
                    if (value) {
                        location.href = '/admin/valeResguardo'
                    }
                });
                dropzone.removeFile(file); // Elimina el archivo no permitido
            }
        });

        const btnPublicar = document.getElementById('sendSignature2')
        btnPublicar.addEventListener('click', function (event) {
            const idEmpleado = document.getElementById('idEmpleado').innerText
            // console.log(idEmpleado);
            const file = dropzone.getAcceptedFiles()[0];
            // console.log(file);
            
            // file.filename = 'firma.webp'

            // console.log(file);

            if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const arrayBuffer = event.target.result;
                        const text = new TextDecoder().decode(arrayBuffer);
                        
                        text2 = text.substring(text.length-7, text.length)
                        text3 = text2.slice(0,5)
                        console.log('informacion',text3, idEmpleado);
                        
                        
                        
                        if (text3 == idEmpleado) {
                            // Si son iguales, procesar la cola de Dropzone
                            // Swal.fire({
                            //     title: 'Enviado',
                            //     icon: 'success',
                            //     text: 'firma registrada con exito',
                            // });
                            dropzone.processQueue();
                            validacionImg = true
                            // reader.readAsArrayBuffer(file);
                        } else {
                            // Si son diferentes, eliminar la imagen cargada
                            dropzone.removeFile(file);
                            Swal.fire({
                                title: 'Error',
                                icon: 'error',
                                text: 'El metadato no coincide con el folio.',
                                allowOutsideClick: false,
                                button: "OK"
                            });
                        }
                    };
                    reader.readAsArrayBuffer(file);
                

                    
                
                
                // console.log('h2', text3);

            }
        })

        // dropzone.on('sending', function (file, xhr, formData) {
        //     formData.append("filename", file.name);
        // })


        // dropzone.on("error", function (file, errorMessage) {
        //     if (file.type != "image/webp") {
        //         dropzone.removeFile(file);
        //         Swal.fire({
        //             title: 'Error',
        //             icon: 'error',
        //             text: 'Solo se permiten imagenes .WEBP',
        //             allowOutsideClick: false,
        //             button: "OK"
        //         });
        //         return;
        //     }
        // });

        dropzone.on('queuecomplete', function (file, errorMessage) {
            if (!validacionImg) {
                console.log('Archivo no permitido', file.type);
                
                dropzone.removeFile(file); // Elimina el archivo no permitido
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Solo se permiten imágenes en formato .WEBP',
                    allowOutsideClick: false,
                    button: "OK"
                }).then((value) => {
                    if (value) {
                        location.href = '/admin/valeResguardo'
                    }
                });;
                // return;
            }else{
                if (dropzone.getActiveFiles().length == 0) {
                    Swal.fire({
                        title: 'Enviado',
                        icon: 'success',
                        text: 'firma registrada con exito',
                        allowOutsideClick: false,
                        button: "OK"
                    }).then((value) => {
                        if (value) {
                            location.href = '/admin/valeResguardo'
                        }
                    });;
                }
            }
            
        })
    }
}
