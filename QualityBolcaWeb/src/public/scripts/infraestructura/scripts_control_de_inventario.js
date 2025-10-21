// Inventory management functionality
let currentProduct = null

// Sample inventory data
let inventoryData = [
  {
    id: 1,
    codigo: "TOR-M8-001",
    producto: "Tornillos M8 x 20mm",
    categoria: "Ferretería",
    stockActual: 5,
    stockMinimo: 50,
    precioUnitario: 0.25,
    status: "low",
  },
  {
    id: 2,
    codigo: "CAB-RJ45-002",
    producto: "Cable RJ45 Cat6",
    categoria: "Electrónicos",
    stockActual: 150,
    stockMinimo: 20,
    precioUnitario: 2.5,
    status: "normal",
  },
  {
    id: 3,
    codigo: "HER-TAL-003",
    producto: "Taladro Industrial",
    categoria: "Herramientas",
    stockActual: 0,
    stockMinimo: 5,
    precioUnitario: 125.0,
    status: "out",
  },
  {
    id: 4,
    codigo: "TUE-M8-004",
    producto: "Tuercas M8",
    categoria: "Ferretería",
    stockActual: 200,
    stockMinimo: 100,
    precioUnitario: 0.15,
    status: "normal",
  },
]

// Filter inventory function
function filterInventory() {
  const searchInput = document.getElementById("inventorySearch")
  const table = document.getElementById("inventoryTable")
  const rows = table.getElementsByTagName("tr")
  const searchTerm = searchInput.value.toLowerCase()

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.getElementsByTagName("td")
    let found = false

    for (let j = 0; j < cells.length - 1; j++) {
      // Exclude actions column
      const cellText = cells[j].textContent.toLowerCase()
      if (cellText.includes(searchTerm)) {
        found = true
        break
      }
    }

    row.style.display = found ? "" : "none"
  }
}

// Filter by status function
function filterByStatus(status) {
  const table = document.getElementById("inventoryTable")
  const rows = table.getElementsByTagName("tr")
  const filterButtons = document.querySelectorAll(".filter-btn")

  // Update active button
  filterButtons.forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const rowStatus = row.getAttribute("data-status")

    if (status === "all" || rowStatus === status) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  }
}

// Add stock functions
function addStock(productId) {
  const product = inventoryData.find((p) => p.id === productId)
  if (!product) return

  currentProduct = productId

  document.getElementById("productName").value = product.producto
  document.getElementById("currentStock").value = product.stockActual
  document.getElementById("addQuantity").value = ""
  document.getElementById("reason").value = ""

  const modal = document.getElementById("addStockModal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeAddStockModal() {
  const modal = document.getElementById("addStockModal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
  currentProduct = null
}

// Handle add stock form submission
document.getElementById("addStockForm").addEventListener("submit", (e) => {
  e.preventDefault()

  if (!currentProduct) return

  const productIndex = inventoryData.findIndex((p) => p.id === currentProduct)
  if (productIndex === -1) return

  const addQuantity = Number.parseInt(document.getElementById("addQuantity").value)
  const reason = document.getElementById("reason").value

  // Update product stock
  inventoryData[productIndex].stockActual += addQuantity

  // Update status based on new stock
  const product = inventoryData[productIndex]
  if (product.stockActual === 0) {
    product.status = "out"
  } else if (product.stockActual <= product.stockMinimo) {
    product.status = "low"
  } else {
    product.status = "normal"
  }

  // Update table row
  updateInventoryTableRow(currentProduct, inventoryData[productIndex])

  closeAddStockModal()

  // Show success message
  showNotification(`Stock agregado correctamente. Motivo: ${reason}`, "success")
})

function updateInventoryTableRow(productId, productData) {
  const table = document.getElementById("inventoryTable")
  const rows = table.getElementsByTagName("tr")

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.getElementsByTagName("td")

    // Check if this is the correct row by product code
    if (cells[0].textContent === productData.codigo) {
      // Update stock cell
      const stockCell = cells[3]
      stockCell.textContent = productData.stockActual

      // Update stock class
      stockCell.className = ""
      if (productData.status === "out") {
        stockCell.classList.add("stock-out")
      } else if (productData.status === "low") {
        stockCell.classList.add("stock-low")
      } else {
        stockCell.classList.add("stock-normal")
      }

      // Update status badge
      const statusCell = cells[6]
      const statusBadge = statusCell.querySelector(".status-badge")
      statusBadge.className = "status-badge"

      if (productData.status === "out") {
        statusBadge.classList.add("danger")
        statusBadge.textContent = "Agotado"
      } else if (productData.status === "low") {
        statusBadge.classList.add("warning")
        statusBadge.textContent = "Stock Bajo"
      } else {
        statusBadge.classList.add("success")
        statusBadge.textContent = "Normal"
      }

      // Update row data-status
      row.setAttribute("data-status", productData.status)

      break
    }
  }
}

// Edit product function
function editProduct(productId) {
  const product = inventoryData.find((p) => p.id === productId)
  if (!product) return

  // This would open an edit product modal (similar to add stock modal)
  showNotification("Función de edición en desarrollo", "info")
}

// Delete product function
function deleteProduct(productId) {
  const product = inventoryData.find((p) => p.id === productId)
  if (!product) return

  if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.producto}"?`)) {
    // Remove from data
    inventoryData = inventoryData.filter((p) => p.id !== productId)

    // Remove from table
    const table = document.getElementById("inventoryTable")
    const rows = table.getElementsByTagName("tr")

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const deleteBtn = row.querySelector(`[onclick="deleteProduct(${productId})"]`)
      if (deleteBtn) {
        row.remove()
        break
      }
    }

    showNotification("Producto eliminado correctamente", "success")
  }
}

// Add product modal function
function openAddProductModal() {
  showNotification("Función de agregar producto en desarrollo", "info")
}

// Notification function (reused from ordenes.js)
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#4a90e2"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Close modal on escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAddStockModal()
  }
})

// Close modal when clicking outside
document.getElementById("addStockModal").addEventListener("click", function (event) {
  if (event.target === this) {
    closeAddStockModal()
  }
})
