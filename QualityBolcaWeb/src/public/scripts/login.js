// import { NOMBRE, CONTRA } from "../../config";
// import Swal from 'sweetalert2'

// const datosMain = [];

const $ = el => document.querySelector(el)
const logForm = $('#loginBtn')
const regForm = $('#registerBtn')

const loginForm = $('#login-form')
const registerForm = $('#register-form')
const logoutButton = $('#close-session')

const inputEmail = document.getElementById('inputEmail')





loginForm?.addEventListener('submit',  e => {
    e.preventDefault()
    const checkedR = document.getElementById('checkRemember').checked;
    const formData = new FormData(loginForm)
    const urlEncoded = new URLSearchParams(formData).toString();

     fetch('/login', {
        method: 'POST',
        body: urlEncoded,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    // .then(
    //     response => response.json(),
    // )
    .then(res => {
        console.log('antes de antrar al res.ok', checkedR);
            if (res.ok) {
                console.log('Entrando al res.ok', checkedR.checked);
                if (checkedR) {
                    localStorage.setItem('correo', inputEmail.value)
                } else {
                    sessionStorage.setItem('correo', inputEmail.value);
                }
                location.href = '/inicio'
            } else {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: `${res.msg}`
                })
            }
        }).catch(
            function (error) {
                console.log("Hubo un problema con la petición Fetch:" + error.message);
            }
        )
})

