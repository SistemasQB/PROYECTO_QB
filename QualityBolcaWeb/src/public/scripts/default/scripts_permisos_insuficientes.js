function goHome() {
  // Redirigir al inicio - cambiar por la URL real
  window.location.href = "../inicio"
}

function contactSupport() {
  // Abrir cliente de email o redirigir a página de contacto

    const contactForm = document.getElementById('mejoraForm');
        // var contarEquipo = contarEquipo();
        // var concatenarbeneficios = concatenarbeneficios();
        const formData = new FormData(contactForm);
        const urlEncoded = new URLSearchParams(formData).toString();
        alertaFetch(urlEncoded, 'www.qualitybolca.net/contact', 'www.qualitybolca.net/inicio');


    // "mailto:info.sistemas@qualitybolca.com.com?subject=Solicitud de Permisos&body=Hola, necesito ayuda con los permisos de acceso."
}







// Agregar efectos de hover adicionales
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.15)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none"
    })
  })
})
