document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  const closeSidebar = document.getElementById("closeSidebar")
  const submenuToggles = document.querySelectorAll(".submenu-toggle")

  // Función para abrir el menú
  function openSidebar() {
    sidebar.classList.add("active")
    overlay.classList.add("active")
    hamburgerBtn.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Función para cerrar el menú
  function closeSidebarMenu() {
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
    hamburgerBtn.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Event listeners para abrir/cerrar menú
  hamburgerBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("active")) {
      closeSidebarMenu()
    } else {
      openSidebar()
    }
  })

  closeSidebar.addEventListener("click", closeSidebarMenu)
  overlay.addEventListener("click", closeSidebarMenu)

  // Manejar submenús
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault()
      const parentItem = this.closest(".nav-item")
      const isActive = parentItem.classList.contains("active")

      // Cerrar todos los submenús
      document.querySelectorAll(".nav-item.active").forEach((item) => {
        item.classList.remove("active")
      })

      // Abrir el submenú clickeado si no estaba activo
      if (!isActive) {
        parentItem.classList.add("active")
      }
    })
  })

  // Cerrar menú al hacer clic en enlaces (para móviles)
  document.querySelectorAll(".sidebar-nav a:not(.submenu-toggle)").forEach((link) => {
    link.addEventListener("click", () => {
      closeSidebarMenu()
    })
  })

  // Cerrar menú al redimensionar ventana
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && sidebar.classList.contains("active")) {
      closeSidebarMenu()
    }
  })
})
