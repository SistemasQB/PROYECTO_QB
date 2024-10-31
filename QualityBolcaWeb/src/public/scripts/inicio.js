const $ = el => document.querySelector(el)
const logoutButton = $('#enviar-solicitud');
logoutButton?.addEventListener('submit', e => {
    e.preventDefault()
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            console.log(res)
            window.location.href = '/'
        })
})
