class MaterialManager {
  constructor() {
    // this.materials = [
    //   {
    //     id: "1",
    //     partNumber: "MT-001",
    //     description: "Tornillo hexagonal M8x20",
    //     finalProducts: ["PF-100", "PF-102"],
    //     client: "Industrias ABC",
    //   },
    //   {
    //     id: "2",
    //     partNumber: "MT-002",
    //     description: "Arandela plana 8mm",
    //     finalProducts: ["PF-100"],
    //     client: "Manufacturas XYZ",
    //   },
    //   {
    //     id: "3",
    //     partNumber: "MT-003",
    //     description: "Tuerca hexagonal M8",
    //     finalProducts: ["PF-101", "PF-102"],
    //     client: "Industrias ABC",
    //   },
    // ]

    // this.finalProductOptions = ["PF-100", "PF-101", "PF-102", "PF-103", "PF-104", "PF-105"]
    // this.selectedProducts = []

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.renderMaterials()
    this.populateFinalProductSelect()
  }

  setupEventListeners() {
    // Menu toggle
    document.getElementById("menuToggle").addEventListener("click", () => {
      this.toggleSidebar()
    })

    // Sidebar close
    document.getElementById("sidebarClose").addEventListener("click", () => {
      this.closeSidebar()
    })

    // Modal controls
    document.getElementById("newMaterialBtn").addEventListener("click", () => {
      this.openModal()
    })

    document.getElementById("modalClose").addEventListener("click", () => {
      this.closeModal()
    })

    document.getElementById("cancelBtn").addEventListener("click", () => {
      this.closeModal()
    })

    document.getElementById("clearFormBtn").addEventListener("click", () => {
      this.clearForm()
    })

    document.getElementById("submitBtn").addEventListener("click", () => {
      this.submitForm()
    })

    // Final product selection
    document.getElementById("finalProductSelect").addEventListener("change", (e) => {
      this.addFinalProduct(e.target.value)
    })

    // Search functionality
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.filterMaterials(e.target.value)
    })

    // Close modal on overlay click
    document.getElementById("modalOverlay").addEventListener("click", (e) => {
      if (e.target.id === "modalOverlay") {
        this.closeModal()
      }
    })

    // Close sidebar on overlay click
    document.addEventListener("click", (e) => {
      const sidebar = document.getElementById("sidebar")
      const menuToggle = document.getElementById("menuToggle")

      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        this.closeSidebar()
      }
    })
  }

  toggleSidebar() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.toggle("open")
  }

  closeSidebar() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.remove("open")
  }

  openModal() {
    document.getElementById("modalOverlay").classList.add("show")
    this.clearForm()
  }

  closeModal() {
    document.getElementById("modalOverlay").classList.remove("show")
    this.clearForm()
  }

  clearForm() {
    document.getElementById("materialForm").reset()
    this.selectedProducts = []
    this.renderSelectedProducts()
  }

  populateFinalProductSelect() {
    const select = document.getElementById("finalProductSelect")
    select.innerHTML = '<option value="">Seleccionar producto final...</option>'

    this.finalProductOptions.forEach((product) => {
      const option = document.createElement("option")
      option.value = product
      option.textContent = product
      select.appendChild(option)
    })
  }

  addFinalProduct(productId) {
    if (productId && !this.selectedProducts.includes(productId)) {
      this.selectedProducts.push(productId)
      this.renderSelectedProducts()
      document.getElementById("finalProductSelect").value = ""
    }
  }

  removeFinalProduct(productId) {
    this.selectedProducts = this.selectedProducts.filter((id) => id !== productId)
    this.renderSelectedProducts()
  }

  renderSelectedProducts() {
    const container = document.getElementById("selectedProducts")
    container.innerHTML = ""

    this.selectedProducts.forEach((productId) => {
      const productElement = document.createElement("div")
      productElement.className = "selected-product"
      productElement.innerHTML = `
                <span>${productId}</span>
                <button type="button" class="remove-product" onclick="materialManager.removeFinalProduct('${productId}')">
                    <i class="fas fa-times"></i>
                </button>
            `
      container.appendChild(productElement)
    })
  }

  submitForm() {
    const form = document.getElementById("materialForm")
    const formData = new FormData(form)

    const partNumber = formData.get("partNumber").trim()
    const description = formData.get("description").trim()
    const client = formData.get("client").trim()

    if (!partNumber || !description || !client) {
      alert("Por favor, complete todos los campos obligatorios.")
      return
    }

    // Check if part number already exists
    if (this.materials.some((material) => material.partNumber === partNumber)) {
      alert("El número de parte ya existe. Por favor, use uno diferente.")
      return
    }

    const newMaterial = {
      id: Date.now().toString(),
      partNumber,
      description,
      client,
      finalProducts: [...this.selectedProducts],
    }

    this.materials.push(newMaterial)
    this.renderMaterials()
    this.closeModal()

    // Show success message
    this.showNotification("Material registrado exitosamente", "success")
  }

  deleteMaterial(id) {
    if (confirm("¿Está seguro de que desea eliminar este material?")) {
      this.materials = this.materials.filter((material) => material.id !== id)
      this.renderMaterials()
      this.showNotification("Material eliminado exitosamente", "success")
    }
  }

  renderMaterials(materialsToRender = embarques) {
    const tbody = document.getElementById("materialsTableBody")
    tbody.innerHTML = ""

    if (materialsToRender.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        No se encontraron materiales
                    </td>
                </tr>
            `
      return
    }

    materialsToRender.forEach((embarque) => {
    let partidas = JSON.parse(embarque.partidas)
    let resumenes = JSON.parse(embarque.resumen)
    let mifecha = new Date(embarque.fecha)
    mifecha = mifecha.toLocaleDateString('es-ES')
      const row = document.createElement("tr")
        let fila = `
                <td><strong>${mifecha}</strong></td>
                <td>${embarque.folio}</td>
                <td>
                    <div class="product-tags">
                        ${partidas
                          .map((product) => `<span class="product-tag">${product.numeroParte}</span>`)
                          .join("")}
                    </div>
                </td>
                    <td>${resumenes.totalPiezas.toLocaleString('en-US')}
                    
                </td>
                <td>
                    <button class="action-btn" onclick="materialManager.deleteMaterial('${embarque.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    
                    <button class="action-btn" onclick="ingresarMaterial(${embarque.id})" title="ingresar a almacen">
                        <i class="fa-solid fa-warehouse"></i>
                    </button>
                    
                </td>
            `
        row.innerHTML = fila
        tbody.appendChild(row)
    })
  }

  filterMaterials(searchTerm) {
    const filtered = this.materials.filter((material) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        material.partNumber.toLowerCase().includes(searchLower) ||
        material.description.toLowerCase().includes(searchLower) ||
        material.client.toLowerCase().includes(searchLower) ||
        material.finalProducts.some((product) => product.toLowerCase().includes(searchLower))
      )
    })

    this.renderMaterials(filtered)
  }

  showNotification(message, type = "info") {
    // Simple notification system
    const notification = document.createElement("div")
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "var(--success-color)" : "var(--primary-color)"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`
document.head.appendChild(style)

// Initialize the application
let materialManager
document.addEventListener("DOMContentLoaded", () => {
  materialManager = new MaterialManager()
})


  function ingresarMaterial(id){
    let embarque = embarques.find(e => e.id === id );
    window.location.href = `ingreso/${id}`
  }

