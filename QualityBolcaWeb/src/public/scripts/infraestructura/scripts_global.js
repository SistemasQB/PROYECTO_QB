// Global variables
let menuOpen = false

// Navigation functions
function goHome() {
  window.location.href = "inicio"
}

// Menu functions
function toggleMenu() {
  const overlay = document.getElementById("menuOverlay")
  const content = document.getElementById("menuContent")

  menuOpen = !menuOpen

  if (menuOpen) {
    overlay.classList.add("active")
    content.classList.add("active")
    document.body.style.overflow = "hidden"
  } else {
    overlay.classList.remove("active")
    content.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

function closeMenu() {
  const overlay = document.getElementById("menuOverlay")
  const content = document.getElementById("menuContent")

  menuOpen = false
  overlay.classList.remove("active")
  content.classList.remove("active")
  document.body.style.overflow = "auto"

  // Close all submenus
  const submenus = document.querySelectorAll(".submenu")
  const arrows = document.querySelectorAll(".submenu-arrow")

  submenus.forEach((submenu) => submenu.classList.remove("active"))
  arrows.forEach((arrow) => arrow.classList.remove("rotated"))
}

function toggleSubmenu(submenuId) {
  const submenu = document.getElementById(submenuId + "-submenu")
  const arrow = document.querySelector(`[onclick="toggleSubmenu('${submenuId}')"] .submenu-arrow`)

  if (submenu && arrow) {
    const isActive = submenu.classList.contains("active");

    if (isActive) {
      submenu.style.maxHeight = null;
    } else {
      
      submenu.style.maxHeight = submenu.scrollHeight + "px"; // ← altura real del contenido
    }

    submenu.classList.toggle("active");
    arrow.classList.toggle("rotated");
  }

}

// Close menu when clicking outside
document.addEventListener("click", (event) => {
  const hamburgerMenu = document.getElementById("hamburgerMenu")
  const menuContent = document.getElementById("menuContent")

  if (menuOpen && hamburgerMenu && !hamburgerMenu.contains(event.target)) {
    closeMenu()
  }
})

// Close menu on escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuOpen) {
    closeMenu()
  }
})

// Responsive menu handling
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && menuOpen) {
    closeMenu()
  }
})

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  
})
