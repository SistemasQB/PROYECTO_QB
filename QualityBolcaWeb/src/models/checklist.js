import { DataTypes } from 'sequelize'
import db from "../config/db.js";

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
    },
    observacionesG:{
        type: DataTypes.TEXT,
        defaultValue: 'N/A'
    }
})

export default CheckListVehiculos;