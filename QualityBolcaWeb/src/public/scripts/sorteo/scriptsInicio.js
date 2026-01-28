
// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebarOverlay")

menuToggle.addEventListener("click", () => {
  sidebar.classList.add("open")
  sidebarOverlay.classList.add("open")
})

sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.remove("open")
  sidebarOverlay.classList.remove("open")
})

// Navigation Active State
const navButtons = document.querySelectorAll(".nav-btn, .sidebar-nav-btn")

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    navButtons.forEach((btn) => {
      btn.classList.remove("nav-btn-active", "sidebar-nav-btn-active")
    })

    // Add active class to clicked button
    if (button.classList.contains("nav-btn")) {
      button.classList.add("nav-btn-active")
    } else {
      button.classList.add("sidebar-nav-btn-active")
    }

    // Close sidebar on mobile
    if (button.classList.contains("sidebar-nav-btn")) {
      sidebar.classList.remove("open")
      sidebarOverlay.classList.remove("open")
    }

    console.log("[v0] Navegando a:", button.getAttribute("data-page"))
    window.location.href = `${button.getAttribute("data-page")}`
  })
})

// Chart Configuration
const ctx = document.getElementById("inventoryChart").getContext("2d")

const inventoryChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Inventario",
        data: [2650, 2720, 2680, 2750, 2800, 2820, 2847],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Producción",
        data: [120, 135, 145, 140, 152, 148, 156],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "#e2e8f0",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#64748b",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#64748b",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  },
})

// Action Buttons Handlers
const actionButtons = document.querySelectorAll(".action-btn")

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.textContent.trim()
    console.log("[v0] Acción ejecutada:", action)

    // Add visual feedback
    button.style.transform = "scale(0.98)"
    setTimeout(() => {
      button.style.transform = ""
    }, 100)

    alert(`Acción: ${action}\n\nEsta funcionalidad se conectará con tu backend.`)
  })
})

// Simulate real-time updates (optional demo feature)
function updateStats() {
  const statValues = document.querySelectorAll(".stat-value")

  statValues.forEach((stat) => {
    const currentValue = Number.parseInt(stat.textContent.replace(/,/g, ""))
    const change = Math.floor(Math.random() * 10) - 5
    const newValue = currentValue + change

    if (change !== 0) {
      stat.style.transition = "color 0.3s"
      stat.style.color = change > 0 ? "#10b981" : "#ef4444"

      setTimeout(() => {
        stat.style.color = ""
      }, 1000)
    }
  })
}

// Update stats every 30 seconds (optional - comment out if not needed)
// setInterval(updateStats, 30000);

console.log("[v0] Sistema de Departamento de Piso cargado correctamente")
