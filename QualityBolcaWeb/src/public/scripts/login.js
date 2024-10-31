// import { NOMBRE, CONTRA } from "../../config";
// import Swal from 'sweetalert2'

// const datosMain = [];

const $ = el => document.querySelector(el)
const logForm = $('#loginBtn')
const regForm = $('#registerBtn')

const loginForm = $('#login-form')
const registerForm = $('#register-form')
const logoutButton = $('#close-session')




loginForm?.addEventListener('submit', e => {
    e.preventDefault()
    console.log('entrando al submit')
    console.log(document.getElementById('login-password').value, document.getElementById('login-username').value)
    // console.log('entrando al addevventlistener');
    fetch('/login2', {
        method: 'POST'
    })
        .then(res => {
            if (res.ok) {
                setTimeout(() => {
                    console.log('enviar informacion')
                }, 1)
            } else {
                console.log('error Usuario o contraseña no valida', res)
            }
        })
    // axios.post('login2', {

    // })
    //     .then(res => {
    //         if (res.ok) {
    //             setTimeout(() => {
    //                 console.log('enviar informacion')
    //                 window.location.href = '/directorios'
    //             }, 1)
    //         } else {
    //             console.log('error Usuario o contraseña no valida', res)
    //         }

    //     })
})

registerForm?.addEventListener('submit', e => {
    e.preventDefault()
    const username = $('#register-username').value
    const password = $('#register-password').value
    const nombre = $('#register-nombre').value
    const apellido = $('#register-apellido').value


    const ConfirmPassword = $('#register-confirm-password').value

    if (password !== ConfirmPassword) {
        alert('Passwords do not match')
        return
    }

//     fetch('/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ nombre, apellido, username, password })
//     })
//         .then(res => {
//             console.log(res);
//             if (res.ok) {
//                 setTimeout(() => {
//                     window.location.href = '/inicio'
//                 }, 100)
//             } else {
//                 console.log('errro al iniciar sesion');
//             }
//         })
})

// logoutButton?.addEventListener('click', e => {
//     e.preventDefault()
//     fetch('/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(res => {
//             console.log(res)
//             window.location.href = '/'
//         })
// })

let loginbtn = document.getElementById('login-form');
let registerbtn = document.getElementById('register');
let bodyload = document.body;
bodyload.onload = carga;


logForm?.addEventListener('click', e => {
    loginbtn.style.animation = 'focus-in-contract 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s forwards';
    registerbtn.style.animation = 'focus-in-expand-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards';
})

regForm?.addEventListener('click', e => {
    registerbtn.style.animation = 'focus-in-contract 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s forwards';
    loginbtn.style.animation = 'focus-in-expand-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards';
})

function carga() {
    loginbtn.style.animation = 'focus-in-contract 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards';
}

// export default datosMain;