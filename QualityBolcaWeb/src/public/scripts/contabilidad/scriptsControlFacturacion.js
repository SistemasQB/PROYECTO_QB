// Datos de ejemplo

// Estado de la aplicación
let invoices = []
let filteredInvoices = []
const expandedInvoices = new Set()
let searchTerm = ""
let statusFilter = "all"
let currentContextInvoice = null

let currentPage = 1
let itemsPerPage = 50
let currentEditInvoice = null

// Elementos del DOM
const searchInput = document.getElementById("search-input")
const statusSelect = document.getElementById("status-filter")
const invoiceCount = document.getElementById("invoice-count")
const invoiceTbody = document.getElementById("invoice-tbody")
const contextMenu = document.getElementById("context-menu")
const deleteModal = document.getElementById("delete-modal")
const invoiceToDelete = document.getElementById("invoice-to-delete")
const cancelDeleteBtn = document.getElementById("cancel-delete")
const confirmDeleteBtn = document.getElementById("confirm-delete")

const itemsPerPageSelect = document.getElementById("items-per-page")
const firstPageBtn = document.getElementById("first-page")
const prevPageBtn = document.getElementById("prev-page")
const nextPageBtn = document.getElementById("next-page")
const lastPageBtn = document.getElementById("last-page")
const currentPageSpan = document.getElementById("current-page")
const totalPagesSpan = document.getElementById("total-pages")
const showingFromSpan = document.getElementById("showing-from")
const showingToSpan = document.getElementById("showing-to")
const totalRecordsSpan = document.getElementById("total-records")

const editModal = document.getElementById("edit-modal")
const closeEditModalBtn = document.getElementById("close-edit-modal")
const cancelEditBtn = document.getElementById("cancel-edit")
const saveEditBtn = document.getElementById("save-edit")
const editForm = document.getElementById("edit-invoice-form")

// Importación de Lucide
const lucide = window.lucide // Assuming Lucide is available globally

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos de Lucide
  lucide.createIcons()

  // Event listeners
  searchInput.addEventListener("input", handleSearch)
  statusSelect.addEventListener("change", handleStatusFilter)
  cancelDeleteBtn.addEventListener("click", closeDeleteModal)
  confirmDeleteBtn.addEventListener("click", confirmDelete)

  itemsPerPageSelect.addEventListener("change", handleItemsPerPageChange)
  firstPageBtn.addEventListener("click", () => goToPage(1))
  prevPageBtn.addEventListener("click", () => goToPage(currentPage - 1))
  nextPageBtn.addEventListener("click", () => goToPage(currentPage + 1))
  lastPageBtn.addEventListener("click", () => {
    const totalPages = getTotalPages()
    goToPage(totalPages)
  })

  closeEditModalBtn.addEventListener("click", closeEditModal)
  cancelEditBtn.addEventListener("click", closeEditModal)
  saveEditBtn.addEventListener("click", saveEditInvoice)

  // Cerrar menú contextual al hacer click fuera
  document.addEventListener("click", closeContextMenu)

  // Cerrar modal al hacer click en overlay
  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal || e.target.classList.contains("modal-overlay")) {
      closeDeleteModal()
    }
  })

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal || e.target.classList.contains("modal-overlay")) {
      closeEditModal()
    }
  })

  // Renderizar tabla inicial
  renderTable()
})

// Manejar búsqueda
function handleSearch(e) {
  searchTerm = e.target.value
  renderTable()
}

// Manejar filtro de estado
function handleStatusFilter(e) {
  statusFilter = e.target.value
  renderTable()
}

// Filtrar facturas
function getFilteredInvoices() {
  return facturas.filter((invoice) => {
    const matchesSearch =
      invoice.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.receptor.toLowerCase().includes(searchTerm.toLowerCase()) 
      // || invoice.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.estatusPago === statusFilter

    return matchesSearch && matchesStatus
  })
}

// Obtener total pagado
function getTotalPaid(payments) {
  return payments.reduce((sum, p) => sum + p.conversion, 0)
}

// Formatear fecha
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("es-ES")
}

// Formatear moneda
function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`
}

// Obtener icono de estado
function getStatusIcon(status) {
  const icons = {
    paid: "check-circle",
    pending: "clock",
    overdue: "alert-circle",
    cancelled: "alert-circle",
  }
  return icons[status] || "file-text"
}

// Obtener texto de estado
function getStatusText(status) {
  const texts = {
    paid: "Pagada",
    pending: "Pendiente",
    overdue: "Vencida",
    cancelled: "Cancelada",
  }
  return texts[status] || status
}

// Obtener texto de estado de pago
function getPaymentStatusText(status) {
  const texts = {
    completed: "Completado",
    pending: "Pendiente",
    failed: "Fallido",
  }
  return texts[status] || status
}

// Renderizar tabla
function renderTable(invoices = facturas) {
  
  const paginatedInvoices = getPaginatedInvoices()
  const totalFiltered = getFilteredInvoices().length
  // Actualizar contado
   invoiceCount.textContent = `${totalFiltered} facturas`

  // Limpiar tabla
  invoiceTbody.innerHTML = ""

  // Renderizar cada factura
  paginatedInvoices.forEach((invoice) => {
    // Fila principal
    const row = document.createElement("tr")
    row.className = "invoice-row"
    row.dataset.invoiceId = invoice.id
    const isExpanded = expandedInvoices.has(invoice.id)
    
    const pagos = JSON.parse(invoice.pago)
    let totalPaid = 0
    if (pagos.length > 0) {
      invoice.pagos = pagos
      totalPaid = getTotalPaid(pagos)
    }
      
    row.innerHTML = `
            <td>
                <div class="invoice-info">
                    <i data-lucide="chevron-right" class="chevron ${isExpanded ? "expanded" : ""}"></i>
                    <div>
                        <div class="invoice-number">${invoice.uuid}</div>
                        <div class="invoice-description">${invoice.descripcion}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="font-weight-500">${invoice.receptor}</div>
            </td>
            <td>
                <div class="font-weight-500">${formatCurrency(invoice.total)}</div>
            </td>
            <td>
                <div class="date-info">
                    <i data-lucide="calendar" style="width: 1rem; height: 1rem; color: var(--muted-foreground);"></i>
                    ${formatDate(invoice.fechaFactura)}
                </div>
            </td>
            <td>
                <div class="date-info">
                    <i data-lucide="calendar" style="width: 1rem; height: 1rem; color: var(--muted-foreground);"></i>
                    ${formatDate(invoice.fechaFactura)}
                </div>
            </td>
            <td>
                <div class="status-info">
                    <i data-lucide="${getStatusIcon(invoice.estatusPago)}" class="status-icon ${invoice.estatusPago}"></i>
                    <span class="badge status-${invoice.estatusPago}">${getStatusText(invoice.estatusPago)}</span>
                </div>
            </td>
            <td>
                <div class="amount-info">${formatCurrency(totalPaid)}</div>
                <div class="amount-secondary">de ${formatCurrency(invoice.total)}</div>
            </td>
        `

    // Event listeners para la fila
    row.addEventListener("click", () => toggleExpanded(invoice.id))
    row.addEventListener("contextmenu", (e) => handleRightClick(e, invoice.id))

    invoiceTbody.appendChild(row)

    // Fila expandida con pagos
    if (isExpanded) {
      const paymentsRow = document.createElement("tr")
      paymentsRow.className = "payments-row"

      let paymentsContent = ""
      if (typeof (invoice.pagos) === 'object'){
        console.log('entro',invoice.pagos)
        const paymentsHtml = invoice.pagos.map((payment) => `
                    <div class="payment-item">
                        <div class="payment-left">
                            <div class="payment-amount">
                                <i data-lucide="dollar-sign" style="width: 1rem; height: 1rem; color: var(--primary);"></i>
                                ${formatCurrency(payment.conversion)}
                            </div>
                            <div class="payment-details">
                                ${payment.method} • ${payment.reference}
                            </div>
                        </div>
                        <div class="payment-right">
                            <div style="font-size: 0.75rem; color: var(--muted-foreground);">
                                ${formatDate(payment.fechaPago)}
                            </div>
                            <span class="badge status-${payment.status === "completed" ? "paid" : "pending"}">
                                ${getPaymentStatusText(payment.status)}
                            </span>
                        </div>
                    </div>
                `,
          )
          .join("")

        paymentsContent = `
                    <div class="payments-container">
                        <h4 class="payments-header">
                            <i data-lucide="credit-card" style="width: 1rem; height: 1rem;"></i>
                            Pagos Registrados (${invoice.pagos.length})
                        </h4>
                        <div>
                            ${paymentsHtml}
                        </div>
                    </div>
                `
      } else {
        console.log('no hay pagos')
        paymentsContent = `
                    <div class="payments-container">
                        <div class="no-payments">
                            <i data-lucide="credit-card"></i>
                            <p>No hay pagos registrados para esta factura</p>
                        </div>
                    </div>
                `
      }

      paymentsRow.innerHTML = `<td colspan="7">${paymentsContent}</td>`
      invoiceTbody.appendChild(paymentsRow)
    }
  })
  updatePaginationInfo()
  // Reinicializar iconos de Lucide
  lucide.createIcons()
}

// Alternar expansión de factura
function toggleExpanded(invoiceId) {
  
  if (expandedInvoices.has(invoiceId)) {
    console.log(`se va a ELIMINAR el id ${invoiceId}`)
    expandedInvoices.delete(invoiceId)
  } else {
    console.log(`se va a agregar el id ${invoiceId}`)
    expandedInvoices.add(invoiceId)
  }
  renderTable()
}

// Manejar click derecho
function handleRightClick(e, invoiceId) {
  e.preventDefault()
  currentContextInvoice = invoiceId

  // Posicionar menú contextual
  contextMenu.style.left = `${e.clientX}px`
  contextMenu.style.top = `${e.clientY}px`
  contextMenu.classList.remove("hidden")

  // Event listeners para opciones del menú
  const menuItems = contextMenu.querySelectorAll(".context-menu-item")
  menuItems.forEach((item) => {
    item.replaceWith(item.cloneNode(true)) // Remover listeners anteriores
  })

  const newMenuItems = contextMenu.querySelectorAll(".context-menu-item")
  newMenuItems.forEach((item) => {
    item.addEventListener("click", handleContextMenuAction)
  })
}

// Manejar acciones del menú contextual
function handleContextMenuAction(e) {
  const action = e.currentTarget.dataset.action

  switch (action) {
    case "view":
      console.log("Ver detalles de factura:", currentContextInvoice)
      break
    case "edit":
      // console.log("Editar factura:", currentContextInvoice)
      showDeleteModal()
      break
    case "cancel":
      showDeleteModal()
      break
  }

  closeContextMenu()
}

// Cerrar menú contextual
function closeContextMenu() {
  contextMenu.classList.add("hidden")
  currentContextInvoice = null
}

// Mostrar modal de confirmación
function showDeleteModal() {
  const invoice = invoices.find((inv) => inv.id === currentContextInvoice)
  if (invoice) {
    invoiceToDelete.textContent = invoice.number
    deleteModal.classList.remove("hidden")
  }
}

// Cerrar modal de confirmación
function closeDeleteModal() {
  deleteModal.classList.add("hidden")
}

// Confirmar eliminación
function confirmDelete() {
  if (currentContextInvoice) {
    invoices = invoices.map((invoice) =>
      invoice.id === currentContextInvoice ? { ...invoice, status: "cancelled" } : invoice,
    )
    renderTable()
  }
  closeDeleteModal()
}

function getTotalPages() {
  const filtered = getFilteredInvoices()
  return Math.ceil(filtered.length / itemsPerPage)
}

function getPaginatedInvoices() {
  const filtered = getFilteredInvoices()
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
}

function updatePaginationInfo() {
  const filtered = getFilteredInvoices()
  const totalPages = getTotalPages()
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, filtered.length)

  currentPageSpan.textContent = currentPage
  totalPagesSpan.textContent = totalPages
  showingFromSpan.textContent = filtered.length > 0 ? start : 0
  showingToSpan.textContent = end
  totalRecordsSpan.textContent = filtered.length

  // Deshabilitar botones según la página actual
  firstPageBtn.disabled = currentPage === 1
  prevPageBtn.disabled = currentPage === 1
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0
  lastPageBtn.disabled = currentPage === totalPages || totalPages === 0
}

function goToPage(page) {
  const totalPages = getTotalPages()
  if (page >= 1 && page <= totalPages) {
    currentPage = page
    renderTable()
  }
}

function handleItemsPerPageChange(e) {
  itemsPerPage = Number.parseInt(e.target.value)
  currentPage = 1
  renderTable()
}
function showEditModal() {
  const invoice = invoices.find((inv) => inv.id === currentContextInvoice)
  if (!invoice) return

  currentEditInvoice = invoice.id

  // Llenar el formulario con los datos actuales
  document.getElementById("edit-number").value = invoice.number
  document.getElementById("edit-client").value = invoice.client
  document.getElementById("edit-amount").value = invoice.amount
  document.getElementById("edit-date").value = invoice.date
  document.getElementById("edit-due-date").value = invoice.dueDate
  document.getElementById("edit-status").value = invoice.status
  document.getElementById("edit-description").value = invoice.description

  editModal.classList.remove("hidden")
  lucide.createIcons()
}

function closeEditModal() {
  editModal.classList.add("hidden")
  currentEditInvoice = null
  editForm.reset()
}

function saveEditInvoice() {
  if (!currentEditInvoice) return

  // Obtener valores del formulario
  const updatedInvoice = {
    number: document.getElementById("edit-number").value,
    client: document.getElementById("edit-client").value,
    amount: Number.parseFloat(document.getElementById("edit-amount").value),
    date: document.getElementById("edit-date").value,
    dueDate: document.getElementById("edit-due-date").value,
    status: document.getElementById("edit-status").value,
    description: document.getElementById("edit-description").value,
  }

  // Actualizar la factura en el array
  invoices = invoices.map((invoice) =>
    invoice.id === currentEditInvoice ? { ...invoice, ...updatedInvoice } : invoice,
  )

  console.log("Factura actualizada:", updatedInvoice)

  // Renderizar tabla y cerrar modal
  renderTable()
  closeEditModal()
}