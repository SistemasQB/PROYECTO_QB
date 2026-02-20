
    // Initialize with today's date
    document.addEventListener('DOMContentLoaded', function() {
        conversionObjetos()
        const today = new Date().toISOString().split('T')[0];
        // document.getElementById('issueDate').value = today;
        cargarData()
        
        // Set due date to 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        // document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
        
        // Add initial item row
        addItem();
    });

    // Item counter for unique IDs
    let itemCounter = 0;

    // Update header invoice number
    function updateHeaderInvoiceNumber() {
      const invoiceNumber = document.getElementById('invoiceNumber').value;
      document.getElementById('headerInvoiceNumber').textContent = invoiceNumber || 'Nueva Factura';
    }

    // Add new item row
    function addItem() {
      itemCounter++;
      const tbody = document.getElementById('itemsTableBody');
      const row = document.createElement('tr');
      row.id = `item-${itemCounter}`;
      row.innerHTML = `
        <td>
          <input type="text" class="form-input input-description" name="description" placeholder="Descripción del producto o servicio">
        </td>
        <td>
          <input type="number" class="form-input" name="quantity" value="1" min="1" step="1" onchange="calculateRowTotal(${itemCounter})">
        </td>
        <td>
          <input type="number" class="form-input" name="unitPrice" value="0" min="0" step="0.01" onchange="calculateRowTotal(${itemCounter})">
        </td>
        <td>
          <input type="number" class="form-input" name="taxRate" value="16" min="0" max="100" step="0.01" onchange="calculateRowTotal(${itemCounter})">
        </td>
        <td>
          <input type="text" class="form-input form-input-readonly" name="total" value="$0.00" readonly>
        </td>
        <td>
          <button type="button" class="btn btn-ghost btn-icon" onclick="removeItem(${itemCounter})" title="Eliminar">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    }

    // Remove item row
    function removeItem(id) {
      const row = document.getElementById(`item-${id}`);
      if (row) {
        row.remove();
        calculateTotals();
      }
    }

    // Calculate row total
    function calculateRowTotal(id) {
      const row = document.getElementById(`item-${id}`);
      if (!row) return;

      const quantity = parseFloat(row.querySelector('[name="quantity"]').value) || 0;
      const unitPrice = parseFloat(row.querySelector('[name="unitPrice"]').value) || 0;
      const taxRate = parseFloat(row.querySelector('[name="taxRate"]').value) || 0;

      const subtotal = quantity * unitPrice;
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax;

      row.querySelector('[name="total"]').value = formatCurrency(total);
      calculateTotals();
    }

    // Calculate all totals
    function calculateTotals() {
      const rows = document.querySelectorAll('#itemsTableBody tr');
      let subtotal = 0;
      let totalTax = 0;

      rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('[name="quantity"]').value) || 0;
        const unitPrice = parseFloat(row.querySelector('[name="unitPrice"]').value) || 0;
        const taxRate = parseFloat(row.querySelector('[name="taxRate"]').value) || 0;

        const rowSubtotal = quantity * unitPrice;
        const rowTax = rowSubtotal * (taxRate / 100);

        subtotal += rowSubtotal;
        totalTax += rowTax;
      });

      const discount = parseFloat(document.getElementById('discount').value) || 0;
      const grandTotal = subtotal + totalTax - discount;

      document.getElementById('subtotal').textContent = formatCurrency(subtotal);
      document.getElementById('totalTax').textContent = formatCurrency(totalTax);
      document.getElementById('grandTotal').textContent = formatCurrency(grandTotal);
    }

    // Format currency
    function formatCurrency(amount) {
      return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Get form data
    function getFormData() {
      const items = [];
      const rows = document.querySelectorAll('#itemsTableBody tr');
      
      rows.forEach(row => {
        items.push({
          description: row.querySelector('[name="description"]').value,
          quantity: parseFloat(row.querySelector('[name="quantity"]').value) || 0,
          unitPrice: parseFloat(row.querySelector('[name="unitPrice"]').value) || 0,
          taxRate: parseFloat(row.querySelector('[name="taxRate"]').value) || 0
        });
      });

      return {
        invoiceNumber: document.getElementById('invoiceNumber').value,
        issueDate: document.getElementById('issueDate').value,
        dueDate: document.getElementById('dueDate').value,
        status: document.getElementById('status').value,
        issuer: {
          name: document.getElementById('issuerName').value,
          taxId: document.getElementById('issuerTaxId').value,
          address: document.getElementById('issuerAddress').value,
          phone: document.getElementById('issuerPhone').value,
          email: document.getElementById('issuerEmail').value
        },
        client: {
          name: document.getElementById('clientName').value,
          taxId: document.getElementById('clientTaxId').value,
          address: document.getElementById('clientAddress').value,
          phone: document.getElementById('clientPhone').value,
          email: document.getElementById('clientEmail').value
        },
        items: items,
        discount: parseFloat(document.getElementById('discount').value) || 0,
        payment: {
          method: document.getElementById('paymentMethod').value,
          bankName: document.getElementById('bankName').value,
          accountNumber: document.getElementById('accountNumber').value
        },
        notes: document.getElementById('notes').value,
        terms: document.getElementById('terms').value
      };
    }

    // Show notification
    function showNotification(message, type = 'success') {
      const notification = document.getElementById('notification');
      const notificationText = document.getElementById('notificationText');
      
      notification.className = `notification ${type}`;
      notificationText.textContent = message;
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }

    // Set button loading state
    function setButtonLoading(buttonId, loading) {
      const button = document.getElementById(buttonId);
      const span = button.querySelector('span');
      const svg = button.querySelector('svg');
      
      if (loading) {
        button.disabled = true;
        svg.style.display = 'none';
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.id = `${buttonId}-spinner`;
        button.insertBefore(spinner, span);
        span.textContent = 'Procesando...';
      } else {
        button.disabled = false;
        const spinner = document.getElementById(`${buttonId}-spinner`);
        if (spinner) spinner.remove();
        svg.style.display = '';
        span.textContent = buttonId === 'btnSave' ? 'Guardar' : 'Actualizar';
      }
    }

    // Save invoice (POST)
    async function saveInvoice() {
      const data = getFormData();
      
      // Validate required fields
      if (!data.invoiceNumber) {
        showNotification('El número de factura es requerido', 'error');
        return;
      }

      setButtonLoading('btnSave', true);

      try {
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          showNotification('Factura guardada exitosamente', 'success');
          console.log('Invoice saved:', result);
        } else {
          const error = await response.json();
          showNotification(error.message || 'Error al guardar la factura', 'error');
        }
      } catch (error) {
        console.error('Error saving invoice:', error);
        showNotification('Error de conexión al guardar', 'error');
      } finally {
        setButtonLoading('btnSave', false);
      }
    }

    // Update invoice (PUT)
    async function updateInvoice() {
      const data = getFormData();
      
      // Validate required fields
      if (!data.invoiceNumber) {
        showNotification('El número de factura es requerido', 'error');
        return;
      }

      setButtonLoading('btnUpdate', true);

      try {
        const response = await fetch(`/api/invoices/${encodeURIComponent(data.invoiceNumber)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          showNotification('Factura actualizada exitosamente', 'success');
          console.log('Invoice updated:', result);
        } else {
          const error = await response.json();
          showNotification(error.message || 'Error al actualizar la factura', 'error');
        }
      } catch (error) {
        console.error('Error updating invoice:', error);
        showNotification('Error de conexión al actualizar', 'error');
      } finally {
        setButtonLoading('btnUpdate', false);
      }
    }

    // Reset form
    function resetForm() {
      if (confirm('¿Está seguro de que desea cancelar? Se perderán todos los cambios.')) {
        document.getElementById('invoiceForm').reset();
        document.getElementById('itemsTableBody').innerHTML = '';
        itemCounter = 0;
        addItem();
        
        // Reset dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('issueDate').value = today;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
        
        // Reset totals display
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('totalTax').textContent = '$0.00';
        document.getElementById('grandTotal').textContent = '$0.00';
        
        updateHeaderInvoiceNumber();
        showNotification('Formulario reiniciado', 'success');
      }
    }
    function conversionObjetos(){
        miFactura.complemento = JSON.parse(miFactura.complemento)
        miFactura.datosEmision = JSON.parse(miFactura.datosEmision)
        miFactura.datosEmision.folioCompuesto = miFactura.datosEmision.serie + "-" + miFactura.datosEmision.folio
    }
    
    function cargarData(){
      console.log(miFactura)
      const form = document.getElementById("invoiceForm")
      const inputs = form.querySelectorAll("input, select, textarea")
      console.log(inputs.length)
      for(const input of inputs){
        console.log('el nombre:',input.id)
      }
    }