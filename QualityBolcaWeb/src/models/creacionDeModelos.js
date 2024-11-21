const Asistencia = db.define('asistencia', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    planta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    semana:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estatus:{
        type: DataTypes.STRING,
        allowNull: false
    },
    razon: DataTypes.STRING
})


// --------------------------------------------------------------------------

const CheckListVehiculos  = db.define('checkListVehiculos', {
    unidad:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    placas:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    kilometraje:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    region:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    usuario:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    responsable:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    ddm:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    ddmar:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    ddev:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    dder:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    ddp:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    dim:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    dimar:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    diev:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    dier:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    dip:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tdm:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tdmar:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tdev:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tder:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tdp:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tim:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    timar:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tiev:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tier:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tip:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    
    catalizador:{
        type: DataTypes.STRING,
        
        defaultValue: 'NO TIENE'
    },
    // if(marcaCatalizador != 'N/A'){catalizador = "OK"}else{catalizador = "NO TIENE"})
    marcaCatalizador:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },  
    SerieCatalizador:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    Bateria:{
        type: DataTypes.STRING,
        
        defaultValue: 'No Tiene'
    },  
    // if(marcaBateria != ('N/A'){Bateria = "OK"}else{Bateria = "NO TIENE"})  
    marcaBateria:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },  
    SerieBateria:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    tarjetaCirculacion:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    vigenciaTarjetaCirculacion:{
        type: DataTypes.DATE,
        
        defaultValue: '2000-01-01 00:00:00'
    },
    polizaSeguro:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    vigenciaPolizaSeguro:{
        type: DataTypes.DATE,
        
        defaultValue: '2000-01-01 00:00:00'
    },
    verificacionVehicular:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    vigenciaVerificacionVehicular:{
        type: DataTypes.DATE,
        
        defaultValue: '2000-01-01 00:00:00'
    },
    manual:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    vigenciaManual:{
        type: DataTypes.DATE,
        
        defaultValue: '2000-01-01 00:00:00'
    },
    licencia:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    vigenciaLicencia:{
        type: DataTypes.DATE,
        
        defaultValue: '2000-01-01 00:00:00'
    },
    anticongelante:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    nivelAceite:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    aceiteDireccion:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    aceiteTransmision:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    liquidoFrenos:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    liquidoClutch:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    limpiezaInterior:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    limpiezaExterior:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    claxon:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    luzFreno:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    intermitentes:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    direccionales:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    luzReversa:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    luzCuartos:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    luzBajas:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    },
    luzAltas:{
        type: DataTypes.STRING,
        
        defaultValue: 'N/A'
    }
})


// -----------------------------------------------------------------

const Comunicacion = db.define('comunicacion', {
    id:{
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono:{
        type: DataTypes.STRING,
        allowNull: true
    }
})

// -------------------------------------------------------------------------------------

const Curso = db.define('cursos', {
    nombreCurso: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacitador: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    correoContacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFinal: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'abierto'
    },
    horarioInicio: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'abierto'
    },
    horarioFinal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'abierto'
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
})



// -----------------------------------------------------------------------------


const EncuestaS = db.define('encuestaS', {
    nombreC: DataTypes.STRING,
    nombreU: DataTypes.STRING,
    puesto: DataTypes.STRING,
    telefon: DataTypes.STRING,
    correo: DataTypes.STRING,
    question1: DataTypes.INTEGER,
    question1c: DataTypes.STRING,
    question2: DataTypes.INTEGER,
    question2c: DataTypes.STRING,
    question3: DataTypes.INTEGER,
    question3c: DataTypes.STRING,
    question4: DataTypes.INTEGER,
    question4c: DataTypes.STRING,
    question5: DataTypes.INTEGER,
    question5c: DataTypes.STRING,
    question6: DataTypes.INTEGER,
    question6c: DataTypes.STRING,
    question7: DataTypes.INTEGER,
    question7c: DataTypes.STRING,
    question8: DataTypes.BOOLEAN,
    question8c: DataTypes.STRING,
    question9c: DataTypes.STRING
})


// -------------------------------------------------------------


const Gch_Alta = db.define('gch_alta2', {
    estatus: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    fechaAlta: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    apellidoPaterno: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    apellidoMaterno: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    nombre: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    puesto: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    nss: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    calle: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    colonia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    municipio: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    curp: {
        type: DataTypes.STRING(30),
        defaultValue: 'null',
        foreignKey: true
    },
    estadoCivil: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    reclutador: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    semanaAlta: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    departamento: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    correo: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    rfc: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    cp: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    telefono: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    fonacot: {
        type: DataTypes.STRING(60),
        defaultValue: 'null'
    },
    infonavit: {
        type: DataTypes.STRING(60),
        defaultValue: 'null'
    },
    observaciones: {
        type: DataTypes.TEXT,
        defaultValue: 'null'
    },
    fechaNacimiento: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    tarjeta: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    nivelEstudios: {
        type: DataTypes.STRING(100),
        defaultValue: 'null'
    },
    visa: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    nivelIngles: {
        type: DataTypes.STRING(80),
        defaultValue: 'null'
    },
    nombreEmergencia: {
        type: DataTypes.STRING(100),
        defaultValue: 'null'
    },
    telefonoEmergencia: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    sexo: { 
        type: DataTypes.STRING 
    },
    estancia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    garantia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    inicioGarantia: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    inicioServicio: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    licencia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    madre: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    padre: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    pasaporte: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    rfp: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    salario: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    solicitarGarantia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    sueldo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    todosReclutar: {
        type: DataTypes.TEXT,
        defaultValue: 'null'
    },
    turnoPreferencia: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    usaLentes: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    alergiasEnfermedades: {
        type: DataTypes.TEXT,
        defaultValue: 'null'
    },
    region: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    disponibilidadViajar: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    estadoNacimiento: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    tarjetaRecomienda: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    claveGch: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpFiscal: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

// -------------------------------------------------------

const Listas = db.define('plantas', {
    planta: DataTypes.STRING,
    createdAt: false,
    updatedAt: false 
})


// -------------------------------------------------------

const Mejora = db.define('mejora', {
    nombre_mejora: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_autor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email_autor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    mejora_grupal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    puesto_autor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    proceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    mejoras_proceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    regiones_aplica: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo_mejora: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    beneficios_adicionales: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    situacion_actual: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    mejora_propuesta: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false,
});

    // --------------------------------------------------------

const Beneficio = db.define('beneficio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mejora_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Mejora,
            key: 'id'
        },
        allowNull: false,
    },
    tipo_beneficio: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    timestamps: false,
});

    // --------------------------------------------------------

const ProcesoMejora = db.define('proceso_mejora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mejora_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Mejora,
            key: 'id'
        },
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    timestamps: false,
});

// ------------------------------------------------------


const RegistroCursos = db.define('registroCursos', {
    nombreCurso: {
        type: DataTypes.STRING,
        allowNull: false
    },
    asistenciaNombres: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'abierto'
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

// ----------------------------------------------


const Requisicion = db.define('requisicion', {
    rentabilidad:{
        type: DataTypes.STRING,
        allowNull: false
    },
    autoriza:{
        type: DataTypes.STRING,
        allowNull: false
    },
    departamento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    orden:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    fechaEntrega:{
        type: DataTypes.DATE,
        allowNull: false
    },
    total:{
        type: DataTypes.DOUBLE
    },
    situacionActual:{
        type: DataTypes.STRING,
        allowNull: false
    },
    detallesEspectativa:{
        type: DataTypes.STRING,
        allowNull: false
    },
    comentariosAdicionales:{
        type: DataTypes.STRING,
        allowNull: false
    },
    noCuenta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estatus:{
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    solicitante:{
        type: DataTypes.STRING
    },
    puesto:{
        type: DataTypes.STRING
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    planta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jerarquiaSolicitante:{
        type: DataTypes.INTEGER
    },
    asunto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    proceso:{
        type: DataTypes.STRING,
        allowNull: false
    },
    contacto:{
        type: DataTypes.STRING
    },
    foto:{
        type: DataTypes.STRING
    }
})


// ---------------------------------------------

const Usuario = db.define('usuario', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    puesto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
})