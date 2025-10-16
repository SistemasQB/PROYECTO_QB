document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const hamburgerBtn = document.getElementById("hamburgerBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  const menuButtons = document.querySelectorAll(".menu-link[data-submenu]")

  if (!hamburgerBtn || !sidebar || !overlay) {
    console.error("Elementos del menú no encontrados")
    return
  }

  function openSidebar() {
    hamburgerBtn.classList.add("active")
    sidebar.classList.add("open")
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  function closeSidebar() {
    hamburgerBtn.classList.remove("active")
    sidebar.classList.remove("open")
    overlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  function toggleSidebar() {
    if (sidebar.classList.contains("open")) {
      closeSidebar()
    } else {
      openSidebar()
    }
  }

  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleSidebar()
  })

  overlay.addEventListener("click", closeSidebar)

  sidebar.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Funcionalidad de submenús
  menuButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const submenuId = this.getAttribute("data-submenu")
      const submenu = document.getElementById(submenuId)
      const isExpanded = this.getAttribute("aria-expanded") === "true"

      if (!submenu) {
        console.error("Submenu no encontrado:", submenuId)
        return
      }

      // Cerrar todos los otros submenús
      menuButtons.forEach((btn) => {
        if (btn !== this) {
          btn.setAttribute("aria-expanded", "false")
          const otherSubmenuId = btn.getAttribute("data-submenu")
          const otherSubmenu = document.getElementById(otherSubmenuId)
          if (otherSubmenu) {
            otherSubmenu.classList.remove("open")
          }
        }
      })

      // Toggle del submenú actual
      if (isExpanded) {
        this.setAttribute("aria-expanded", "false")
        submenu.classList.remove("open")
      } else {
        this.setAttribute("aria-expanded", "true")
        submenu.classList.add("open")
      }
    })
  })

  const allLinks = document.querySelectorAll(".submenu a, .menu-item > .menu-link:not([data-submenu])")
  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      closeSidebar()
      e.preventDefault()
      console.log("Navegando a:", this.getAttribute("href"))
    })
  })

  let resizeTimer
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      // Si el menú está abierto y se redimensiona, mantener el estado
      if (!sidebar.classList.contains("open")) {
        document.body.style.overflow = ""
      }
    }, 250)
  })

  // Inicializar atributos ARIA
  menuButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false")
  })

  console.log("Menú inicializado correctamente")
})
