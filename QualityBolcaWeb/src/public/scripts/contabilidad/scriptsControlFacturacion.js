// Datos de ejemplo
const mockInvoices = [
  {
    id: "1",
    number: "REY-1260",
    client: "APTIV DELCO",
    amount: 21000,
    date: "2025-10-09",
    dueDate: "2025-11-09",
    status: "paid",
    description: "DEL 1 AL 5 DE OCTUBRE",
    payments: [
      {
        id: "p1",
        amount: 21000,
        date: "2025-10-20",
        method: "Transferencia",
        reference: "20251020-001",
        status: "completed",
      },
      // {
      //   id: "p2",
      //   amount: 7500,
      //   date: "2024-02-10",
      //   method: "Cheque",
      //   reference: "CHQ-002",
      //   status: "completed",
      // },
    ],
  },
  {
    id: "2",
    number: "CEL-3946",
    client: "DECOPLAS, S.A. DE C.V.",
    amount: 25000,
    date: "2025-05-13",
    dueDate: "2025-05-13",
    status: "pending",
    description: "servicio de inspeccion",
    payments: [
      {
        id: "p3",
        amount: 12500,
        date: "2024-01-25",
        method: "Transferencia",
        reference: "TRF-003",
        status: "completed",
      },
    ],
  },
  {
    id: "3",
    number: "REY-1234",
    client: "APTIV DELCO",
    amount: 6900,
    date: "2025-10-17",
    dueDate: "2025-11-17",
    status: "overdue",
    description: "Traspaleo",
    payments: [],
  },
]

// Estado de la aplicación
let invoices = [...mockInvoices]
const expandedInvoices = new Set()
let searchTerm = ""
let statusFilter = "all"
let currentContextInvoice = null

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

  // Cerrar menú contextual al hacer click fuera
  document.addEventListener("click", closeContextMenu)

  // Cerrar modal al hacer click en overlay
  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal || e.target.classList.contains("modal-overlay")) {
      closeDeleteModal()
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
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })
}

// Obtener total pagado
function getTotalPaid(payments) {
  return payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
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
  const filteredInvoices = getFilteredInvoices()
  // Actualizar contador
  invoiceCount.textContent = `${filteredInvoices.length} facturas`

  // Limpiar tabla
  invoiceTbody.innerHTML = ""

  // Renderizar cada factura
  filteredInvoices.forEach((invoice) => {
    // Fila principal
    const row = document.createElement("tr")
    row.className = "invoice-row"
    row.dataset.invoiceId = invoice.id

    const isExpanded = expandedInvoices.has(invoice.id)
    const totalPaid = getTotalPaid(invoice.payments)

    row.innerHTML = `
            <td>
                <div class="invoice-info">
                    <i data-lucide="chevron-right" class="chevron ${isExpanded ? "expanded" : ""}"></i>
                    <div>
                        <div class="invoice-number">${invoice.number}</div>
                        <div class="invoice-description">${invoice.description}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="font-weight-500">${invoice.client}</div>
            </td>
            <td>
                <div class="font-weight-500">${formatCurrency(invoice.amount)}</div>
            </td>
            <td>
                <div class="date-info">
                    <i data-lucide="calendar" style="width: 1rem; height: 1rem; color: var(--muted-foreground);"></i>
                    ${formatDate(invoice.date)}
                </div>
            </td>
            <td>
                <div class="date-info">
                    <i data-lucide="calendar" style="width: 1rem; height: 1rem; color: var(--muted-foreground);"></i>
                    ${formatDate(invoice.dueDate)}
                </div>
            </td>
            <td>
                <div class="status-info">
                    <i data-lucide="${getStatusIcon(invoice.status)}" class="status-icon ${invoice.status}"></i>
                    <span class="badge status-${invoice.status}">${getStatusText(invoice.status)}</span>
                </div>
            </td>
            <td>
                <div class="amount-info">${formatCurrency(totalPaid)}</div>
                <div class="amount-secondary">de ${formatCurrency(invoice.amount)}</div>
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
      if (invoice.payments.length > 0) {
        const paymentsHtml = invoice.payments
          .map(
            (payment) => `
                    <div class="payment-item">
                        <div class="payment-left">
                            <div class="payment-amount">
                                <i data-lucide="dollar-sign" style="width: 1rem; height: 1rem; color: var(--primary);"></i>
                                ${formatCurrency(payment.amount)}
                            </div>
                            <div class="payment-details">
                                ${payment.method} • ${payment.reference}
                            </div>
                        </div>
                        <div class="payment-right">
                            <div style="font-size: 0.75rem; color: var(--muted-foreground);">
                                ${formatDate(payment.date)}
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
                            Pagos Registrados (${invoice.payments.length})
                        </h4>
                        <div>
                            ${paymentsHtml}
                        </div>
                    </div>
                `
      } else {
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

  // Reinicializar iconos de Lucide
  lucide.createIcons()
}

// Alternar expansión de factura
function toggleExpanded(invoiceId) {
  if (expandedInvoices.has(invoiceId)) {
    expandedInvoices.delete(invoiceId)
  } else {
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
      console.log("Editar factura:", currentContextInvoice)
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
