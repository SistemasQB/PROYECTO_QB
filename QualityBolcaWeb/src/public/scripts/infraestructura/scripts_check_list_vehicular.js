let estadoFormulario = {
  datosUnidad:{},
  componentesPrincipales:{},
  llantas:{},
  accesoriosUnidad:{},
  fluidos:{},
  sistemaElectrico:{},
  evidencias:[],
  observaciones: '',
  estatus:'ABIERTO',
  observacionesLogistica:{}
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inspection-form")
  const inputs = form.querySelectorAll("input, select, textarea")
  const progressBar = document.getElementById("progress-bar")
  const progressText = document.getElementById("progress-text")
  const navItems = document.querySelectorAll(".nav-item")
  const sections = document.querySelectorAll(".form-section")

  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const sidebar = document.getElementById("sidebar")
  const mobileOverlay = document.getElementById("mobile-overlay")
  const closeSidebar = document.getElementById("close-sidebar")
  cargarInfo()
  // Mobile menu functionality
  function openSidebar() {
    sidebar.classList.add("open")
    mobileOverlay.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function closeSidebarFn() {
    sidebar.classList.remove("open")
    mobileOverlay.classList.remove("show")
    document.body.style.overflow = ""
  }

  mobileMenuBtn.addEventListener("click", openSidebar)
  closeSidebar.addEventListener("click", closeSidebarFn)
  mobileOverlay.addEventListener("click", closeSidebarFn)

  // Progress tracking
  function updateProgress() {
    const totalFields = inputs.length
    let filledFields = 0

    inputs.forEach((input) => {
      if (input.type === "radio") {
        if (document.querySelector(`input[name="${input.name}"]:checked`)) {
          filledFields++
        }
      } else if (input.value.trim() !== "") {
        filledFields++
      }
    })

    const progress = Math.round((filledFields / totalFields) * 100)
    progressBar.style.width = progress + "%"
    progressText.textContent = progress + "%"
  }

  // Auto-save functionality
  function saveToLocalStorage() {
    const formData = {}
    inputs.forEach((input) => {
      if (input.type === "radio") {
        if (input.checked) {
          formData[input.name] = input.value
        }
      } else {
        formData[input.name] = input.value
      }
    })
    localStorage.setItem("vehicle-inspection-draft", JSON.stringify(formData))
  }

  // Load saved data
  function loadFromLocalStorage() {
    
    const savedData = localStorage.getItem("vehicle-inspection-draft")
    if (savedData) {
      const formData = JSON.parse(savedData)
      Object.keys(formData).forEach((key) => {
        const input = document.querySelector(`[name="${key}"]`)
        if (input) {
          if (input.type === "radio") {
            const radioInput = document.querySelector(`input[name="${key}"][value="${formData[key]}"]`)
            if (radioInput) radioInput.checked = true
          } else {
            if(key.includes('foto')) return;
            input.value = formData[key]
          }
        }
      })
      updateProgress()
    }
  }

  // Smooth scrolling navigation
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" })

        // Update active nav item
        navItems.forEach((nav) => nav.classList.remove("active"))
        this.classList.add("active")

        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
          closeSidebarFn()
        }
      }
    })
  })

  // Event listeners
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateProgress()
      saveToLocalStorage()
    })
  })

  // Save draft button
  document.getElementById("save-draft").addEventListener("click", () => {
    saveToLocalStorage()
    alert("Borrador guardado correctamente")
  })

  // Form submission
  // form.addEventListener("submit", (e) => {
  //   e.preventDefault()
  //   if (confirm("¿Está seguro de enviar la inspección? Esta acción no se puede deshacer.")) {
  //     localStorage.removeItem("vehicle-inspection-draft")
  //     alert("Inspección enviada correctamente")
  //     form.reset()
  //     updateProgress()
  //   }
  // })

  // Initialize
  loadFromLocalStorage()
  updateProgress()

  // Photo upload functionality
  
  const photoInputs = document.querySelectorAll('input[type="file"]')
  photoInputs.forEach((input) => {
    input.addEventListener("change", function (e) {
      const file = e.target.files[0]
      const container = this.closest(".photo-upload-container")
      const uploadArea = container.querySelector(".photo-upload-area")
      const preview = container.querySelector(".photo-preview")
      const img = preview.querySelector("img")
      const removeBtn = preview.querySelector(".remove-photo")

      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert("El archivo es demasiado grande. El tamaño máximo es 5MB.")
          this.value = ""
          return
        }

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target.result
          uploadArea.querySelector("label").style.display = "none"
          preview.classList.add("show")
        }
        reader.readAsDataURL(file)

        // Remove photo functionality
        removeBtn.addEventListener("click", () => {
          input.value = ""
          uploadArea.querySelector("label").style.display = "block"
          preview.classList.remove("show")
          img.src = ""
        })
      }
    })
  })

  agregarEscuchas()
})


function cargarInfo(){
  const comboUnidad = document.getElementById('unidad');  
  let carros = unidades.map((unidad) => {
    return `<option value='${unidad.vehiculo}'>${unidad.vehiculo}</option>`
  }).join("")
  
  comboUnidad.innerHTML= carros
  // agregarEscuchas()
}

function agregarEscuchas(){
  const resp = document.getElementById('responsable')
  resp.value = 'GERARDO MORALES'
  const radioCat = document.getElementById('cat_ok')
  radioCat.checked = true
  const radioBat = document.getElementById('bat_ok')
  radioBat.checked = true
  //escucha del input de unidad y falta agregar los demas campos de las demas unidades
  const comboUnidad = document.getElementById('unidad');  
  comboUnidad.addEventListener('change', (e) => { 
    const unidad = e.target.value
    datos = unidades.find((u) => u.vehiculo == unidad)
    const campoPlacas = document.getElementById('placas')
    const campoRegion = document.getElementById('regionUnidad')
    const campoPoliza = document.getElementById('numeroPoliza')
    const vigenciaPoiliza = document.getElementById('vigenciaPoliza')

    campoPlacas.value = datos.placas
    campoRegion.value = datos.ubicacion
    
    campoPoliza.value = datos.numeroPoliza
    let fecha = new Date(datos.fechaVencimientoPoliza)
    let formatoFecha = fecha.toISOString().split("T")[0]
    
    vigenciaPoiliza.value = formatoFecha
    

  })

  //escucha del btn de envio del formulario
  const btnEnvio = document.getElementById('btnEnvio')
  btnEnvio.addEventListener('click', (e)=>{
    if(validandoInformacion()){
      
      juntadoInformacion()
    }
  })

}

async function juntadoInformacion(){
  let contFotos = document.getElementById('fotos')
  let fotos = contFotos.querySelectorAll('input')
  if(fotos){
    fotos.forEach((inp) => {
        let archivo = inp.files[0]
        if(!archivo) return;
        estadoFormulario.evidencias.push(archivo)
    })
  }
  estadoFormulario.tipo = 'insert'
  estadoFormulario._csrf = tok
  let miFormData = new FormData()
  
  Object.entries(estadoFormulario).forEach(([key, value]) => {
    if (key === 'evidencias') {
      value.forEach((archivo) => {
        miFormData.append('evidencias', archivo); // múltiples archivos con mismo key
      });
    }else if(typeof value === 'object'){
      // estadoFormulario[key] = JSON.stringify(value)
      miFormData.append(key, JSON.stringify(value))
    }else{
      miFormData.append(key, value)
    }
    
    
  })
  
  await fetchGenerica('crudCheck-list-vehicular',miFormData,'check-list-vehicular')
  localStorage.removeItem("vehicle-inspection-draft")
}

function validandoInformacion(){
  //validacion de datos de la unidad
  let conte = document.getElementById('informacionVehiculo')
  let cam = conte.querySelectorAll('input, select')
  let informacion = {}
  for(let e of cam){
    if(!e.value) {
        sobresalir(e)
        return false
      }
      informacion[e.name] = e.value
  }
  estadoFormulario.datosUnidad =informacion;
  
  //documentacion  
  let obligatorios = [
      document.getElementById('tarjeta_circulacion'),
      document.getElementById('numeroPoliza'),
      document.getElementById('licencia'),
  ]
    for(let el of obligatorios) {
        if(!el.value) {
          sobresalir(el)
      return;
        }
    }

  let vigencias = [
    document.getElementById('vigenciaTarjetaCirculacion'), 
    document.getElementById('vigenciaPoliza'),
    document.getElementById('vigencia_licencia')
  ]

  for(let i = 0; i < vigencias.length; i++ ) {
      let el = vigencias[i]
      let ob = obligatorios[i]
      if(ob.name == 'tarjeta_circulacion' ){
        if (ob.name === 'tarjeta_circulacion' && ob.value === 'NO') {
          
          sobresalir(ob, 'comnicate con el departamento de logistica, para que compartan el dato de la tarjeta de circulacion')
          return false;
        }
      if (!el.value) {
        sobresalir(el);
        return;
      }
      }else{ 
        if(!el.value) {
          sobresalir(el)
          return;
        }
      }
        
    }

    let cont = document.getElementById('documentacion')
    let camp = cont.querySelectorAll('input, select')
    let documentacion = {}
    for(let e of camp) {
      
      if(!e.value ){
        documentacion[e.name] = 'N/A'
      }else{
        documentacion[e.name] = e.value
      }
    }
    informacion.documentacion = documentacion
    estadoFormulario.datosUnidad =informacion;
  
  //validacion de las llantas
  let divs = ['ldd','ldi','ltd','lti']
  
  for(let nd of divs)   {
        const con = document.getElementById(nd)
        let campos = con.querySelectorAll('input, select')
        let datos = {};
        for(let ele of campos){
            if(!ele.value) {
              sobresalir(ele)
              return false;
            }
            datos[ele.name] = ele.value
        };
        estadoFormulario.llantas[nd] = datos;
    }
    //llanta de refaccion
    let cr = document.getElementById('llr')
    let camposs = cr.querySelectorAll('input, select')
    let ref = {}
    for(let ele of camposs){
      if(!ele.value){
        ref[ele.name] = 'N/A'
        continue;
      }
      ref[ele.name] = ele.value
    }
    estadoFormulario.llantas.llr = ref

  //validacion de catalizador y bateria
    const ids= ['contBat','contCat']
    ids.map((t) => {
        let cont = document.getElementById(t)
        let campos = cont.querySelectorAll('input')
        let resul = {}
        if(campos[0].checked){
          resul.funcional = true
          resul.marca = campos[2].value || 'N/A'
          resul.serie = campos[3].value || 'N/A'
        }else{
          resul.funcional = false
          resul.marca = campos[2].value || 'N/A'
          resul.serie = campos[3].value || 'N/A'
        }

        if(t == 'contBat'){
          estadoFormulario.componentesPrincipales.bateria = resul
        }else{
          estadoFormulario.componentesPrincipales.catalizador = resul
        }
    })

    //validacion de accesorios del vehiculo
    let contenedor = document.getElementById('accesorios')
    let campos = contenedor.querySelectorAll('select')
    let accesorios = {}
    
    for(let e of campos) {
      if(!e.value) {
        sobresalir(e)
        return false
      }
      accesorios[e.name] = e.value
    }
    estadoFormulario.accesoriosUnidad = accesorios
    //fluidos
    contenedor = document.getElementById('fluidos')
    campos = contenedor.querySelectorAll('select')
    let fluidos = {}
    
    for(let e of campos){
      if(!e.value) {
        sobresalir(e)
        return false
      }
      fluidos[e.name] = e.value
    }
    estadoFormulario.fluidos= fluidos

    //sistema electrico
     contenedor = document.getElementById('electrico')
     campos = contenedor.querySelectorAll('select')
     let SE = {}
     
    for(let e of campos) {
      if(!e.value) {
        sobresalir(e)
        return false
      }
      SE[e.name] = e.value
    }
    estadoFormulario.sistemaElectrico = SE

    let misObservaciones = document.getElementById('observaciones')
    if(misObservaciones){
      if(!misObservaciones.value){
        estadoFormulario.observaciones = "N/A"
        return true
      }
      estadoFormulario.observaciones = misObservaciones.value
    }

    return true
  
}

function sobresalir(el, mensaje = `Debes completar el campo ${el.name}`){
  alert(mensaje)
          el.classList.add('errorcito')
          el.scrollIntoView({
          behavior: 'smooth',      // 'auto' o 'smooth'
          block: 'center',          // 'start', 'center', 'end', 'nearest'
          inline: 'nearest'        // para scroll horizontal si aplica
      })
      setTimeout(() => {
          el.classList.remove('errorcito');
      }, 5000);
      
}