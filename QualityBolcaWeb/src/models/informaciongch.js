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
        type: DataTypes.CHAR(10),
        allowNull: false
    },
    nombre:{
        type: DataTypes.CHAR(50),
        allowNull: false
    },
    fotografia:{
        type: DataTypes.CHAR(100),
        allowNull: false
    },
    apellidopaterno:{
        type: DataTypes.CHAR(84),
        allowNull: false
    },
    apellidomaterno:{
        type: DataTypes.CHAR(84),
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
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    estadocivil:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    sexo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    curpi:{
        type: DataTypes.CHAR(6),
        allowNull: false
    },
    curpf:{
        type: DataTypes.CHAR(8),
        allowNull: false
    },
    numerosegurosocial:{
        type: DataTypes.CHAR(15),
        allowNull: false
    },
    umf:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rfc:{
        type: DataTypes.CHAR(4),
        allowNull: false
    },
    homoclave:{
        type: DataTypes.CHAR(4),
        allowNull: false
    },
    cuentapagoelectronico:{
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    sucursalpagoelectronico:{
        type: DataTypes.CHAR(50),
        allowNull: false
    },
    bancopagoelectronico:{
        type: DataTypes.CHAR(3),
        allowNull: false
    },
    estadoempleado:{
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    sueldodiario:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechasueldodiario:{
        type: DataTypes.DATE,
        allowNull: false
    },
    sueldovariable:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechasueldovariable:{
        type: DataTypes.DATE,
        allowNull: false
    },
    sueldopromedio:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechasueldopromedio:{
        type: DataTypes.DATE,
        allowNull: false
    },
    sueldointegrado:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechasueldointegrado:{
        type: DataTypes.DATE,
        allowNull: false
    },
    calculado:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    afectado:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    calculadoextraordinario:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    afectadoextraordinario:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    interfazcheqpaqw:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    modificacionneto:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    fechaalta:{
        type: DataTypes.DATE,
        allowNull: false
    },
    cuentacw:{
        type: DataTypes.CHAR(31),
        allowNull: false
    },
    tipocontrato:{
        type: DataTypes.CHAR(2),
        allowNull: false
    },
    basecotizacionimss:{
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    tipoempleado:{
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    basepago:{
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    formapago:{
        type: DataTypes.CHAR(3),
        allowNull: false
    },
    zonasalario:{
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    calculoptu:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    calculoaguinaldo:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    modificacionsalarioimss:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    altaimss:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    bajaimss:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    cambiocotizacionimss:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    expediente:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    telefono:{
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    codigopostal:{
        type: DataTypes.CHAR(5),
        allowNull: false
    },
    direccion:{
        type: DataTypes.CHAR(60),
        allowNull: false
    },
    poblacion:{
        type: DataTypes.CHAR(60),
        allowNull: false
    },
    estado:{
        type: DataTypes.CHAR(3),
        allowNull: false
    },
    nombrepadre:{
        type: DataTypes.CHAR(60),
        allowNull: false
    },
    nombremadre:{
        type: DataTypes.CHAR(60),
        allowNull: false
    },
    numeroafore:{
        type: DataTypes.CHAR(50),
        allowNull: false
    },
    fechabaja:{
        type: DataTypes.DATE,
        allowNull: true
    },
    causabaja:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    sueldobaseliquidacion:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    campoextra1:{
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    campoextra2:{
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    campoextra3:{
        type: DataTypes.CHAR(40),
        allowNull: false
    },
    fechareingreso:{
        type: DataTypes.DATE,
        allowNull: false
    },
    ajustealneto:{
        type: DataTypes.FLOAT,
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
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ccampoextranumerico2:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ccampoextranumerico3:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ccampoextranumerico4:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ccampoextranumerico5:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    cestadoempleadoperiodo:{
        type: DataTypes.CHAR(4),
        allowNull: false
    },
    cfechasueldomixto:{
        type: DataTypes.DATE,
        allowNull: false
    },
    csueldomixto:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    NumeroFonacot:{
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    CorreoElectronico:{
        type: DataTypes.CHAR(60),
        allowNull: false
    },
    TipoRegimen:{
        type: DataTypes.CHAR(2),
        allowNull: false
    },
    ClabeInterbancaria:{
        type: DataTypes.CHAR(30),
        allowNull: false
    },
    EntidadFederativa:{
        type: DataTypes.CHAR(2),
        allowNull: false
    },
    Subcontratacion:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    ExtranjeroSinCURP:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    TipoPrestacion:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DiasVacTomadasAntesdeAlta:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    DiasPrimaVacTomadasAntesdeAlta:{
        type: DataTypes.FLOAT,
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
        type: DataTypes.TINYINT,
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