

    const btnRubro = document.querySelectorAll('.btnRubro');
    const nombreEquipo = document.getElementById('nombreEquipo');
    const mejoraForm = document.getElementById('mejoraForm');
    
    let rubro = ''
    var mejoragrupal = 0
    function rubroSeleccionado(num1) {
        btnRubro[0].classList.remove('btnselected');
        btnRubro[1].classList.remove('btnselected');
        btnRubro[2].classList.remove('btnselected');
        btnRubro[3].classList.remove('btnselected');
        btnRubro[num1].classList.add('btnselected');
        rubro = btnRubro[num1].innerText

    }



    nombreEquipo.addEventListener('keyup', () => {
        if (nombreEquipo.value === '') {
            document.getElementById('containerParticipantes').style.display = 'none';
            mejoragrupal = 0

        } else {
            document.getElementById('containerParticipantes').style.display = 'block';
            mejoragrupal = 1
        }
    })

    function contarEquipo() {
        const nombre_participantes = document.getElementById('nombre_participantes').value;

        // Dividir los valores por la coma y eliminar espacios adicionales
        let elementos = nombre_participantes.split(",").map(item => item.trim()).filter(item => item !== "");

        // Contar la cantidad de elementos
        return elementos.length + 1;

    }

    function concatenarbeneficios() {

        let checkboxes = document.getElementsByClassName('checkboxbeneficios');

        let valoresConcatenados = ""

        for (c = 0; c < checkboxes.length; c++) {
            if (checkboxes[c].checked) {
                valoresConcatenados += checkboxes[c].value + ','
            }
        }

        const beneficiosadd = document.getElementById('beneficiosadd');

        // let valoresConcatenados = checkboxes.map(checkbox => checkbox.value).join(',');

        let resultado = valoresConcatenados + beneficiosadd.value;

        return resultado
    }

    function obtenerFechaFormato() {
        let fecha = new Date();
        let año = fecha.getFullYear();
        let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Sumar 1 porque los meses van de 0 a 11
        let dia = String(fecha.getDate()).padStart(2, '0'); // Asegurar que tenga dos dígitos

        return `${año}-${mes}-${dia}`;
    }

    mejoraForm.addEventListener('submit', function (e) {

        e.preventDefault();

        Swal.fire({
            title: "Ingresa tu correo para recibir el estado de tu mejora",
            input: "email",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            inputValidator: (value) => {
                const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regexCorreo.test(value)) {
                    return "Por favor, ingresa un correo válido";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const correo = result.value; // Aquí capturas el correo
                enviarMejora(correo);
            }
        });

    })

    const inversionSi = document.getElementById('inversion-si');

    inversionSi.addEventListener('change', () => {
        if (inversionSi.checked) {
            Swal.fire({
                title: "Recuerda",
                text: "Si tu mejora requiere inversión, debes consultarlo con el departamento correspondiente",
                icon: "info"
            });
        }
    })


    function enviarMejora(correo) {
        // var contarEquipo = contarEquipo();
        // var concatenarbeneficios = concatenarbeneficios();
        const formData = new FormData(mejoraForm);
        formData.append('generador_idea', document.getElementById('nombre').value);
        formData.append('fecha', obtenerFechaFormato());
        formData.append('email', correo);
        formData.append('numero_participantes', contarEquipo());
        formData.append('rubro', rubro);
        formData.append('beneficios', concatenarbeneficios());
        formData.append('mejora_grupal', mejoragrupal);
        formData.append('titulo_analisis', 'nombre.pdf');
        
        let campos = {
            _csrf: tok,
            fecha: formData.get('fecha'),
            nombreMejora: formData.get('nombre_mejora'),
            generadorIdea: formData.get('generador_idea'),
            nombreEquipo: formData.get('nombre_equipo'),
            numeroParticipantes: formData.get('numero_participantes'),
            nombreParticipantes: formData.get('nombre_participantes'),
            nombreRegistra: formData.get('generador_idea'),
            puesto: '',
            procesoAplicaMejora: formData.get('proceso_aplica_mejora'),
            regionAplicaMejora: formData.get('region_aplica_mejora'),
            rubro: formData.get('rubro'),
            beneficios: formData.get('beneficios'),
            inversion: formData.get('inversion'),
            monto: formData.get('monto'),
            recuperacion: formData.get('recuperacion'),
            situacionActual: formData.get('situacion_actual'),
            situacionMejora: formData.get('situacion_mejora'),
            mejoraGrupal: formData.get('mejora_grupal'),
            estatus: 'INGRESADA',
            email: formData.get('email'),
            tituloAnalisis: 'N/A',
            procesoPerteneces: formData.get('proceso_pertenece'),
            tipo:'insert',
            fechaRecepcion: Date.now(),
            puesto: usuario.descripcion,
        }
        
        if (document.getElementById('indexmejora').value == '') {
            envioJson('crudMejoras', campos, 'mejoracontinua');
        } else {
            campos.id = document.getElementById('indexmejora').value
            campos.tipo = 'update'
            envioJson('crudMejoras', campos, 'mejoracontinua');
            
        }
    }
// Elementos del DOM
    const modal = document.getElementById('modal');
    const modalAnalisis = document.getElementById('modalAnalisis');
    const openModalBtn = document.getElementById('openModalBtn');
    const openModalBtn2 = document.getElementById('openModalBtn2');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalAnalisisBtn = document.getElementById('modalAnalisis');
    const cancelBtn = document.getElementById('cancelBtn');
    const mejorasGrid = document.getElementById('mejorasGrid');
    const emptyState = document.getElementById('emptyState');
    const totalMejoras = document.getElementById('totalMejoras');

    // Event listeners
    document.addEventListener('DOMContentLoaded', function () {
        renderMejoras();
        updateTotalCount();
    });

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal(modal));
    cancelBtn.addEventListener('click', closeModal);
    closeModalAnalisisBtn.addEventListener('click', closeModal(modalAnalisis));
    // mejoraForm.addEventListener('submit', handleSubmit);

    // Event listener para botones de "abrir modal" en empty state
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('open-modal-btn')) {
            openModal();
        }
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Funciones
    function openModal() {
            document.getElementById('nombre').value = usuario.nombre + ' ' + usuario.apellidopaterno + ' ' + usuario.apellidomaterno;
        document.getElementById('puesto').value = usuario.descripcion
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function openModal2(valores) {
        rubro = valores.rubro
        document.getElementById('indexmejora').value = valores.id;
        btnRubro[0].classList.remove('btnselected');
        btnRubro[1].classList.remove('btnselected');
        btnRubro[2].classList.remove('btnselected');
        btnRubro[3].classList.remove('btnselected');
        switch (valores.rubro) {
            case 'Ahorro':
                btnRubro[0].classList.add('btnselected');
                break;
            case 'Sistema':
                btnRubro[1].classList.add('btnselected');
                break;
            case 'Indirecta':
                btnRubro[2].classList.add('btnselected');
                break;
            case 'Ambiental':
                btnRubro[3].classList.add('btnselected');
                break;
        }



        let beneficios = valores.beneficios.split(',');

        let checkboxes = document.getElementsByClassName('checkboxbeneficios');

        let valoresConcatenados = ""

        for (c = 0; c < checkboxes.length; c++) {
            for (let c1 = 0; c1 < beneficios.length - 1; c1++) {
                if (checkboxes[c].value == beneficios[c1]) {
                    checkboxes[c].checked = true;
                }
            }
        }

        document.getElementById('beneficiosadd').value = beneficios[beneficios.length - 1];

        const inversionSN = document.getElementsByClassName('inversionSN')

        if (valores.inversion == '1') {
            inversionSN[0].checked = true;
        } else {
            inversionSN[1].checked = true;
        }
        //este linea de abajo toma los valores que recibe del servidor y los concatena para obtener el nombre completo
        const nombreLargo = usuario.nombre + ' ' + usuario.apellidopaterno + ' ' + usuario.apellidomaterno
        // <% nombrelargo = obtenerDatos.nombre + ' ' + obtenerDatos.apellidopaterno + ' ' + obtenerDatos.apellidomaterno %>

        document.getElementById('nombre_mejora').value = valores.nombreMejora;
        document.getElementById('nombre').value = nombreLargo;
        document.getElementById('puesto').value = usuario.descripcion;
        document.getElementById('nombreEquipo').value = valores.nombreEquipo;
        // document.getElementById('mejoragrupal').value = valores.numero_participantes
        document.getElementById('nombre_participantes').value = valores.nombreParticipantes;
        document.getElementById('proceso_aplica_mejora').value = valores.procesoAplicaMejora;
        document.getElementById('region_aplica_mejora').value = valores.regionAplicaMejora;
        document.getElementById('monto').value = valores.monto;
        document.getElementById('recuperacion').value = valores.recuperacion;
        document.getElementById('situacion_actual').value = valores.situacionActual;
        document.getElementById('situacion_mejora').value = valores.situacionMejora;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        resetForm();
    }

    function resetForm() {
        document.getElementById('indexmejora').value = '';
        mejoraForm.reset();
    }


    function renderMejoras() {
        if (!mejoras) {
            emptyState.style.display = 'block';
            mejorasGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            mejorasGrid.style.display = 'grid';

            descripcion = mejoras.descripcion;

            mejorasGrid.innerHTML = mejoras.map(mejora => createMejoraCard(mejora)).join('');
        }
    }

    function createMejoraCard(mejora) {
        console.log(mejora)
        let colorcarta = 0;
        let btnActivo = '';
        let btnModificar = 'none';
        
        switch (mejora.estatus) {
            case "INGRESADA":
                colorcarta = 'background-color: #e8f9ff; border: 2px solid rgb(173, 216, 230);'
                btnActivo = 'block';
                // colorcarta = '';
                btnModificar = 'block'
                break;
            case 'REGISTRADA':
                btnActivo = 'none';
                colorcarta = 'background-color: #fff7d7; border: 2px solid rgb(255, 223, 100);'
                break;
            case 2:
                btnActivo = 'none';
                colorcarta = 'background-color: #ffead3; border: 2px solid rgb(255, 135, 0);'
                btnModificar = 'block'
                break;
            case 'ACEPTADA':
                btnActivo = 'none';
                colorcarta = 'background-color: #dfffe1; border: 2px solid rgb(76, 175, 80);';
                break;
            case 'RECHAZADA':
                btnActivo = 'none';
                colorcarta = 'background-color: #ffe6e4; border: 2px solid rgb(244, 67, 54);'
                break;
            case 'DECLINADA':
                btnActivo = 'none';
                colorcarta = 'background-color: #ececec; border: 2px solid rgb(105, 105, 105);'
                break;
            case 'IMPLEMENTADA':
                colorcarta = 'background-color: #d9f8f5; border: 4px solid rgb(64, 224, 208);'
                break;
        }
        //mostrar boton de envio de evidencias
        let btnEvidenciaS = 'none';
        let fechaComite = 0;
        if (mejora.estatus == 'ACEPTADA' && new Date(mejora.fechaRespuestaComite)> new Date(2000,1,1)) {
            const resultado = validarFechas(mejora.fechaRespuestaComite);
            if (resultado.dentroDe15a20 && !mejora.evidencia1 || resultado.paso1Mes && !mejora.evidencia2 || resultado.paso2Meses && !mejora.evidencia3 || resultado.paso3Meses && !mejora.evidencia4) {
                btnEvidenciaS = 'block';
            }
        }

        function validarFechas(fechaBaseStr) {
            const fechaBase = new Date(fechaBaseStr);
            const hoy = new Date();

            // Normalizamos horas para comparar solo fechas
            fechaBase.setHours(0, 0, 0, 0);
            hoy.setHours(0, 0, 0, 0);

            const msPorDia = 1000 * 60 * 60 * 24;
            const diasTranscurridos = Math.floor((hoy - fechaBase) / msPorDia);

            // Condición 1: más de 15 y menos de 20 días
            const dentroDe15a20 = diasTranscurridos > 15 && diasTranscurridos < 20;

            // Condición 2: meses completos
            const fechaMas1Mes = new Date(fechaBase);
            fechaMas1Mes.setMonth(fechaBase.getMonth() + 1);

            const fechaMas2Meses = new Date(fechaBase);
            fechaMas2Meses.setMonth(fechaBase.getMonth() + 2);

            const fechaMas3Meses = new Date(fechaBase);
            fechaMas3Meses.setMonth(fechaBase.getMonth() + 3);

            const paso1Mes = hoy >= fechaMas1Mes;
            const paso2Meses = hoy >= fechaMas2Meses;
            const paso3Meses = hoy >= fechaMas3Meses;

            return {
                diasTranscurridos,
                dentroDe15a20,
                paso1Mes,
                paso2Meses,
                paso3Meses
            };
        }


        const fechaFormateada = new Date(mejora.fecha);
        const beneficiosA = mejora.beneficios.split(',');
        fechaFormateada.setDate(fechaFormateada.getDate() + 1)
        const badgesHtml = beneficiosA.map(tipo =>
            `<span class="badge ${getBadgeClass(tipo)}">${tipo}</span>`
        ).join('');

        console.log(btnActivo, btnModificar, btnEvidenciaS)
        return `
        <div class="mejora-card" style="${colorcarta}">
            <div class="card-header">
                <h3 class="card-title">${mejora.nombreMejora}</h3>
                <div class="card-meta">
                    <div>
                        <i class="fas fa-calendar"></i>
                        ${fechaFormateada.toLocaleDateString('es-ES')}
                    </div>
                    ${mejora.inversion ? '<span class="badge badge-investment">Requiere Inversión</span>' : ''}
                </div>
            </div>
            <div class="card-content">
                <div class="card-section">
                    <div class="card-info">
                        <i class="fas fa-user"></i>
                        <span class="name">${mejora.generadorIdea}</span>
                    </div>
                    <div class="card-info">
                        <i class="fas fa-address-card"></i>
                        <span class="location">${mejora.inversion}</span>
                    </div>
                </div>
                
                <div class="card-section">
                    <div class="section-title">Beneficios:</div>
                    <div class="badges">
                        ${badgesHtml}
                    </div>
                </div>
                
                <div class="card-section">
                    <div class="section-title">Situación Actual:</div>
                    <div class="section-text">${mejora.situacionActual}</div>
                </div>
                
                <div class="card-section">
                    <div class="section-title">Mejora Propuesta:</div>
                    <div class="section-text">${mejora.situacionMejora}</div>
                </div>
                <div class="card-section">
                    <div class="section-title">Respuesta del comite:</div>
                    <div class="section-text">${mejora.motivo}</div>
                </div>
                <div class="card-section">
                    <button class="btn btn-primary" style = "display: ${btnActivo}" id="btnAnalisis" onclick= "openModalSubirAnalisis(${mejora.id})">Subir Análisis</button>
                </div>
                <div class="card-section">
                    <button class="btn" id="btnEvidencia" style = "background-color: #1c6e46; color : white; display: ${btnEvidenciaS}" onclick= "location.href ='/admin/subirevidencia/${mejora.id}'">Subir Evidencia</button>
                </div>
                <div class="card-section">
                    <button class="btn btn-primary"  id="btnModificar" style = "display: ${btnModificar}" onclick= "modificarMejora(${mejora.id})">Modificar Mejora</button>
                </div>
            </div>
        </div>
    `;
    }

    function getBadgeClass(tipo) {
        const badgeClasses = {
            "Genera un Ahorro Material": "badge-material",
            "Genera un Ahorro Económico": "badge-economic",
            "Ahorra Tiempo": "badge-time",
            "Facilita el Trabajo Diario": "badge-work",
            "Mejora el Ambiente Laboral": "badge-environment",
            "Entorno Más Saludable y Sostenible": "badge-sustainable",
            "Efectividad en tu Proceso": "badge-effectiveness",
            "Mitiga el Impacto Negativo": "badge-impact",
            "Cambio en Beneficio de la Organización": "badge-organization"
        };

        return badgeClasses[tipo] || "badge-organization";
    }

    function updateTotalCount() {
        totalMejoras.textContent = `Total de mejoras: ${mejoras.length}`;
    }


    function modificarMejora(mejoraId) {
        const record = mejoras.find(item => item.id === mejoraId);
        openModal2(record);
    }
    function openModalSubirAnalisis(){
        modalAnalisis.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    