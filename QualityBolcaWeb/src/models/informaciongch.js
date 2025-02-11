import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Informaciongch = db.define('nom10001', {
    idempleado:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    iddepartamento:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idpuesto:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idtipoperiodo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idturno:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    codigoempleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fotografia:{
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidopaterno:{
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidomaterno:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nombrelargo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechanacimiento:{
        type: DataTypes.DATE,
        allowNull: false
    },
    lugarnacimiento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estadocivil:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sexo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    curpi:{
        type: DataTypes.STRING,
        allowNull: false
    },
    curpf:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numerosegurosocial:{
        type: DataTypes.STRING,
        allowNull: false
    },
    umf:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rfc:{
        type: DataTypes.STRING,
        allowNull: false
    },
    homoclave:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cuentapagoelectronico:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sucursalpagoelectronico:{
        type: DataTypes.STRING,
        allowNull: false
    },
    bancopagoelectronico:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estadoempleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sueldodiario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechasueldodiario:{
        type: DataTypes.DATE,
        allowNull: false
    },
    sueldovariable:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechasueldovariable:{
        type: DataTypes.DATE,
        allowNull: false
    },
    sueldopromedio:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechasueldopromedio:{
        type: DataTypes.DATE,
        allowNull: false
    },
    sueldointegrado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechasueldointegrado:{
        type: DataTypes.DATE,
        allowNull: false
    },
    calculado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    afectado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    calculadoextraordinario:{
        type: DataTypes.STRING,
        allowNull: true
    },
    afectadoextraordinario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    interfazcheqpaqw:{
        type: DataTypes.STRING,
        allowNull: true
    },
    modificacionneto:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaalta:{
        type: DataTypes.DATE,
        allowNull: false
    },
    cuentacw:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipocontrato:{
        type: DataTypes.STRING,
        allowNull: false
    },
    basecotizacionimss:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoempleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    basepago:{
        type: DataTypes.STRING,
        allowNull: false
    },
    formapago:{
        type: DataTypes.STRING,
        allowNull: false
    },
    zonasalario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    calculoptu:{
        type: DataTypes.STRING,
        allowNull: true
    },
    calculoaguinaldo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    modificacionsalarioimss:{
        type: DataTypes.STRING,
        allowNull: true
    },
    altaimss:{
        type: DataTypes.STRING,
        allowNull: true
    },
    bajaimss:{
        type: DataTypes.STRING,
        allowNull: true
    },
    cambiocotizacionimss:{
        type: DataTypes.STRING,
        allowNull: true
    },
    expediente:{
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono:{
        type: DataTypes.STRING,
        allowNull: false
    },
    codigopostal:{
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    poblacion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nombrepadre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nombremadre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroafore:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechabaja:{
        type: DataTypes.DATE,
        allowNull: true
    },
    causabaja:{
        type: DataTypes.STRING,
        allowNull: true
    },
    sueldobaseliquidacion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    campoextra1:{
        type: DataTypes.STRING,
        allowNull: false
    },
    campoextra2:{
        type: DataTypes.STRING,
        allowNull: false
    },
    campoextra3:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechareingreso:{
        type: DataTypes.DATE,
        allowNull: false
    },
    ajustealneto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp:{
        type: DataTypes.DATE,
        allowNull: false
    },
    cidregistropatronal:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ccampoextranumerico1:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ccampoextranumerico2:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ccampoextranumerico3:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ccampoextranumerico4:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ccampoextranumerico5:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cestadoempleadoperiodo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cfechasueldomixto:{
        type: DataTypes.DATE,
        allowNull: false
    },
    csueldomixto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    NumeroFonacot:{
        type: DataTypes.STRING,
        allowNull: false
    },
    CorreoElectronico:{
        type: DataTypes.STRING,
        allowNull: false
    },
    TipoRegimen:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ClabeInterbancaria:{
        type: DataTypes.STRING,
        allowNull: false
    },
    EntidadFederativa:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Subcontratacion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    ExtranjeroSinCURP:{
        type: DataTypes.STRING,
        allowNull: true
    },
    TipoPrestacion:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DiasVacTomadasAntesdeAlta:{
        type: DataTypes.STRING,
        allowNull: true
    },
    DiasPrimaVacTomadasAntesdeAlta:{
        type: DataTypes.STRING,
        allowNull: true
    },
    TipoSemanaReducida:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Teletrabajador:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    Equipo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    Insumo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    DireccionTeletrabajo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    idLider:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    checkColabora:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'nom10001',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
}
)



export default Informaciongch;