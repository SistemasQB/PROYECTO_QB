

// solicitudForm.addEventListener('submit', (e) =>{
//     e.preventDefault()
//     const formData = new FormData(solicitudForm)
//     const urlEncoded = new URLSearchParams(formData).toString();
    
//     console.log(urlEncoded);
    
//     fetch('/solicitud', {
//         method: 'POST',
//         body: urlEncoded,
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             }
//     })
//     .then(response => response.json())
//     .then(res => {
//         if (res.ok) {
//           const swalWithBootstrapButtons = Swal.mixin({
//             customClass: {
//               confirmButton: "btn btn-success",
//               cancelButton: "btn btn-danger"
//             },
//             buttonsStyling: false
//           });
//           swalWithBootstrapButtons.fire({
//             title: "¿Enviar CV?",
//             text: "¿Quieres adjuntar tu CV?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Si adjuntar!",
//             cancelButtonText: "No enviar!",
//             reverseButtons: true,
//             allowOutsideClick: false
//           }).then((result) => {
//             if (result.isConfirmed) {
//               location.href = `/subirsolicitud/${res.id}`
//             //   swalWithBootstrapButtons.fire({
//             //     title: "Redirigiendo",
//             //     text: "Presione OK para continuar...",
//             //     icon: "info",
//             //     allowOutsideClick: false,
//             //     button: "OK"
//             //   }).then((value) => {
//             //     if (value) {
//             //         location.href = `/subirsolicitud/${res.id}`
//             //     }
//             // });
//             } else if (
//               /* Read more about handling dismissals below */
//               result.dismiss === Swal.DismissReason.cancel
//             ) {
//               swalWithBootstrapButtons.fire({
//                 title: "Informacion Enviada!",
//                 text: "Tu informacion ha sido enviada con exito",
//                 icon: "success",
//                 allowOutsideClick: false,
//                 button: "OK"
//               }).then((value) => {
//                 if (value) {
//                     location.reload();
//                 }
//             });;
//             }
//           });
//         } else {
//             Swal.fire({
//                 title: "Error",
//                 text: "Error al enviar la informacion" + res.error,
//                 icon: "error",
//               });
//             console.log('error Usuario o contraseña no valida', res)
//         }
//     })
// })

// Funcionalidad del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobApplicationForm');
    // let formSolicitud = document.getElementById('formSolicitud');
    
    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        // const csrfToken = document.querySelector('input[name="_csrf"]').value;
        // formData.append('_csrf', csrfToken);
        // const urlEncoded = new URLSearchParams(formData).toString();
        alert(formData.get('cv'));
        
        alertaFetch(formData, '/solicitud');
    });
    
    // Función para mostrar mensaje de envío
    function showSubmissionMessage() {
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        // Cambiar el botón a estado de carga
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        submitButton.style.background = '#6b7280';
        
        // Simular proceso de envío
        setTimeout(() => {
            submitButton.textContent = '✓ Enviado Correctamente';
            submitButton.style.background = '#10b981';
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Resetear después de 3 segundos
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '#2563eb';
                form.reset();
            }, 3000);
        }, 2000);
    }
    
    // Función para mostrar mensaje de éxito
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: #dcfce7;
                border: 1px solid #bbf7d0;
                color: #166534;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-top: 1rem;
                text-align: center;
                font-weight: 500;
            ">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                ¡Solicitud enviada correctamente! Nos pondremos en contacto contigo pronto.
            </div>
        `;
        
        const submitSection = document.querySelector('.submit-section');
        submitSection.appendChild(successDiv);
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // Validación en tiempo real
    const requiredFields = form.querySelectorAll('input[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Función de validación de campos
    function validateField(field) {
        const value = field.value.trim();
        
        if (!value) {
            showFieldError(field, 'Este campo es requerido');
            return false;
        }
        
        // Validación específica para email
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Ingresa un email válido');
                return false;
            }
        }
        
        // Validación específica para teléfono
        if (field.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+$$$$]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                showFieldError(field, 'Ingresa un teléfono válido');
                return false;
            }
        }
        
        clearFieldError(field);
        return true;
    }
    
    // Mostrar error en campo
    function showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
        
        // Remover mensaje de error previo
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    // Limpiar error en campo
    function clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '#d1d5db';
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // Formateo automático para campos específicos
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
            e.target.value = value;
        });
    }
    
    // Auto-mayúsculas para nombres
    const nameFields = ['firstName', 'paternalLastName', 'maternalLastName'];
    nameFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function(e) {
                const words = e.target.value.split(' ');
                const capitalizedWords = words.map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
                e.target.value = capitalizedWords.join(' ');
            });
        }
    });
});



