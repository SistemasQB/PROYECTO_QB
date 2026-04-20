// --- Áreas por piso ------------------------------------------------
const areasPorPiso = {
  piso1: [
    'Oficina de vigilancia', 
    'Baño de hombres', 
    'Baño de mujeres', 
    'Sala de entrevistas', 
    'Área de ACH e infraestructura', 
    'Área de gestión de capital humano', 
    'Oficina (doctor)', 
    'Patio trasero', 
    'Sala de juntas 2',
  ],
  piso2: [
    'Comedor', 
    'Sala de juntas principal', 
    'Área administrativa', 
    'Oficina g. de sorteo', 
    'Oficina dirección de administración', 
    'Oficina gerente de ventas', 
    'Oficina ingeniería de calidad', 
    'Oficina de dirección de sorteo',
  ],
};

// --- Fecha automática ----------------------------------------------
(function setFechaAuto() {
  const el = document.getElementById('fechaAuto');
  if (!el || el.textContent.trim()) return;
  const now = new Date();
  const opts = { day: '2-digit', month: '2-digit', year: 'numeric',
                 hour: '2-digit', minute: '2-digit' };
  el.textContent = now.toLocaleDateString('es-MX', opts);
})();

// --- Select de piso → área -----------------------------------------
(function initPisoArea() {
  const pisoSel = document.getElementById('piso');
  const areaSel = document.getElementById('area');
  const formReporte = document.getElementById('reporteForm');
  if (!pisoSel || !areaSel) return;

  pisoSel.addEventListener('change', function () { 
    const areas = areasPorPiso[this.value] || [];
    areaSel.innerHTML = '<option value="" disabled selected>Seleccionar área</option>';
    areas.forEach(function (a) {
      const opt = document.createElement('option');
      opt.value = a.toLowerCase().replace(/\s+/g, '_');
      opt.textContent = a;
      areaSel.appendChild(opt);
    });
    areaSel.disabled = areas.length === 0;
  });

  if (formReporte) {
    formReporte.addEventListener('reset', function () {
      areaSel.innerHTML = '<option value="" disabled selected>— Selecciona piso primero —</option>';
      areaSel.disabled = true;
      
      pisoSel.style.borderColor = '';
      pisoSel.style.boxShadow = '';
      areaSel.style.borderColor = ''; 
      areaSel.style.boxShadow = '';
    });
  }
})();

// --- Upload de fotos (Inline Slot) --------------------------------
(function initUpload() {
  const uploadSlot  = document.getElementById('uploadSlot');
  const fotosInput  = document.getElementById('fotosInput');
  const previewGrid = document.getElementById('previewGrid');
  const fotoError   = document.getElementById('fotoError');
  const MAX_FILES   = 3;
  const MAX_MB      = 5;
  let archivos      = [];

  if (!uploadSlot || !fotosInput) return;

  // Clic en el área → abrir selector
  uploadSlot.addEventListener('click', function () { fotosInput.click(); });

  // Drag & Drop
  uploadSlot.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadSlot.classList.add('drag-over');
  });
  uploadSlot.addEventListener('dragleave', function () {
    uploadSlot.classList.remove('drag-over');
  });
  uploadSlot.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadSlot.classList.remove('drag-over');
    procesarArchivos(Array.from(e.dataTransfer.files));
  });
  fotosInput.addEventListener('change', function () {
    const fotosReporte = Array.from(this.files);
    this.value = ''; 
    procesarArchivos(fotosReporte);
  });

  function procesarArchivos(nuevos) {
    fotoError.classList.add('hidden');
    const validos = nuevos.filter(function (f) {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(ext) && f.size <= MAX_MB * 1024 * 1024;
    });

    if (archivos.length + validos.length > MAX_FILES) {
      fotoError.classList.remove('hidden');
      return;
    }

    validos.forEach(function (f) {
      const numeroDeFoto = archivos.length + 1; 
      const archivoRenombrado = renombrarArchivo(f, numeroDeFoto);
      archivos.push(archivoRenombrado);
    });

    renderPreviews();
  }
  function agregarPreview(src, idx) {
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.dataset.idx = idx;
    item.innerHTML =
      '<img src="' + src + '" alt="Preview" />' +
      '<button type="button" class="preview-remove" title="Eliminar">✕</button>';
    item.querySelector('.preview-remove').addEventListener('click', function (e) {
      e.stopPropagation();
      archivos.splice(idx, 1);
      renderPreviews();
    });
    previewGrid.appendChild(item);
  }
  function renderPreviews() {
    previewGrid.innerHTML = '';
    archivos.forEach(function (f, i) {
      const reader = new FileReader();
      reader.onload = function (e) { agregarPreview(e.target.result, i); };
      reader.readAsDataURL(f);
    });
    sincronizarInput();

    // Mostrar/Ocultar el botón de añadir
    if (archivos.length >= MAX_FILES) {
      uploadSlot.style.display = 'none';
    } else {
      uploadSlot.style.display = 'flex';
    }
  }
  function sincronizarInput() {
    const dt = new DataTransfer();
    archivos.forEach(function (f) { dt.items.add(f); });
    fotosInput.files = dt.files;
  }

  // Escuchar cuando el formulario se resetee
  const formReporte = document.getElementById('reporteForm');
  if (formReporte) {
    formReporte.addEventListener('reset', function () {
      archivos = [];
      previewGrid.innerHTML = '';
      fotosInput.value = '';
      uploadSlot.style.display = 'flex';
      window.location.reload();
    });
  }
})();

// --- Renombrar archivos -------------------------------------------
function renombrarArchivo(archivoOriginal, indiceFoto) {
  //Folio
  const folioEl = document.getElementById('folioAuto');
  const folio = folioEl && folioEl.textContent.trim() !== '' ? folioEl.textContent.trim() : 'REP-0001';

  // Fecha (YYYYMMDD)
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const fecha = `${anio}${mes}${dia}`;

  //  Numero random
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  //  Extensión
  const nombreDividido = archivoOriginal.name.split('.');
  const extension = nombreDividido[nombreDividido.length - 1].toLowerCase();

  //  Contatenar Folio, fecha, numeror random, numero de foto y extension
  const nuevoNombre = `${folio}_${fecha}_${randomNum}(${indiceFoto}).${extension}`;

  // Retornar los nuevos archivo con la modificación del nombre
  return new File([archivoOriginal], nuevoNombre, {
    type: archivoOriginal.type,
    lastModified: archivoOriginal.lastModified,
  });
}

// --- Validación antes de enviar -----------------------------------
(function initSubmit() {
  const form      = document.getElementById('reporteForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); 

    const piso  = document.getElementById('piso');
    const area  = document.getElementById('area');
    const falla = document.getElementById('falla');
    let valido  = true;

    [piso, area, falla].forEach(function (el) {
      if (!el) return;
      if (!el.value || el.value.trim() === '') {
        el.style.borderColor = 'var(--rojo-error)';
        el.style.boxShadow   = '0 0 0 3px rgba(220,38,38,0.12)';
        valido = false;
      } else {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
      }
    });

    if (!valido) {
      const primerError = form.querySelector('[style*="rojo"]');
      if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.innerHTML   = 'Procesando...';

    const formData = new FormData(form);
    const csrfToken = document.querySelector('input[name="_csrf"]').value;
    const areaSeleccionada = formData.get('area') || '';
    const areaFormateada = areaSeleccionada.replace(/_/g, ' ');
    const areaCapitalizada = areaFormateada.charAt(0).toUpperCase() + areaFormateada.slice(1);
    
    const fechaAutoEl = document.getElementById('fechaAuto');
    const fechaTexto = fechaAutoEl ? fechaAutoEl.textContent.trim() : 'Fecha actual';
    const pisoTexto = formData.get('piso') === 'piso1' ? 'Piso 1' : 'Piso 2';

    fetch('crudFormularioReportes', {
      method: 'POST',
      headers: {
        'CSRF-Token': csrfToken
      },
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Reporte registrado',
          width: 380, 
          html: `
            <div style="text-align: left; font-size: 0.9rem; color: #1a2535; font-family: 'Segoe UI', system-ui, sans-serif;">
              <p style="margin: 0 0 15px; text-align: center; color: #4a5568; font-size: 0.95rem;">
                La incidencia fue enviada al departamento correspondiente.
              </p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="color: #718096; font-weight: 600;">Folio:</span>
                  <strong style="color: #000000; font-size: 1.1rem; letter-spacing: 0.5px;">${data.folio}</strong>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #718096; font-weight: 600;">Fecha:</span>
                  <span>${fechaTexto}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #718096; font-weight: 600;">Ubicación:</span>
                  <span style="text-align: right;">${areaCapitalizada} (${pisoTexto})</span>
                </div>
              </div>
            </div>
          `,
          confirmButtonText: 'Entendido',
          confirmButtonColor: 'var(--marino-oscuro)', 
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = 'Enviar reporte';
            form.reset();
          }
        });
      } else {
        Swal.fire('Error', data.message || 'Hubo un problema al guardar el reporte.', 'error');
        submitBtn.disabled  = false;
        submitBtn.innerHTML = 'Enviar reporte';
      }
    })
    .catch(error => {
      console.error('Error en la petición POST:', error);
      Swal.fire('Error de conexión', 'No se pudo conectar con el servidor.', 'error');
      submitBtn.disabled  = false;
      submitBtn.innerHTML = 'Enviar reporte';
    });
  });

  // Limpiar estilos al escribir
  ['piso', 'area', 'falla'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      this.style.borderColor = '';
      this.style.boxShadow   = '';
    });
    el.addEventListener('change', function () {
      this.style.borderColor = '';
      this.style.boxShadow   = '';
    });
  });
})();

// --- Caracteres restantes en textarea de falla y observaciones --------
(function initContadores() {
  const campos = [
    { inputId: 'falla', contadorId: 'contadorFalla', limite: 1000 },
    { inputId: 'observaciones', contadorId: 'contadorObs', limite: 500 }
  ];

  campos.forEach(campo => {
    const inputEl = document.getElementById(campo.inputId);
    const contadorEl = document.getElementById(campo.contadorId);

    if (!inputEl || !contadorEl) return;

    const actualizarContador = () => {
      const longitudActual = inputEl.value.length;
      contadorEl.textContent = `${longitudActual} / ${campo.limite}`;

      if (longitudActual >= campo.limite) {
        contadorEl.className = 'char-counter limit';
      } else if (longitudActual >= campo.limite * 0.8) {
        contadorEl.className = 'char-counter warning';
      } else {
        contadorEl.className = 'char-counter';
      }
    };

    inputEl.addEventListener('input', actualizarContador);
    const formReporte = document.getElementById('reporteForm');
    if (formReporte) {
      formReporte.addEventListener('reset', () => {
        setTimeout(actualizarContador, 10); 
      });
    }
  });
})();