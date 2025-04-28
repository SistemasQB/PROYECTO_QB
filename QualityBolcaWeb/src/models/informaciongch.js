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
        allowNull: true
    },
    idpuesto:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idtipoperiodo:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idturno:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    codigoempleado:{
        type: DataTypes.CHAR(10),
        allowNull: true
    },
    nombre:{
        type: DataTypes.CHAR(50),
        allowNull: true
    },
    fotografia:{
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    apellidopaterno:{
        type: DataTypes.CHAR(84),
        allowNull: true
    },
    apellidomaterno:{
        type: DataTypes.CHAR(84),
        allowNull: true
    },
    nombrelargo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fechanacimiento:{
        type: DataTypes.DATE,
        allowNull: true
    },
    lugarnacimiento:{
        type: DataTypes.CHAR(40),
        allowNull: true
    },
    estadocivil:{
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: 'S'
    },
    sexo:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    curpi:{
        type: DataTypes.CHAR(6),
        allowNull: true
    },
    curpf:{
        type: DataTypes.CHAR(8),
        allowNull: true
    },
    numerosegurosocial:{
        type: DataTypes.CHAR(15),
        allowNull: true
    },
    umf:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rfc:{
        type: DataTypes.CHAR(4),
        allowNull: true
    },
    homoclave:{
        type: DataTypes.CHAR(4),
        allowNull: true
    },
    cuentapagoelectronico:{
        type: DataTypes.CHAR(20),
        allowNull: true
    },
    sucursalpagoelectronico:{
        type: DataTypes.CHAR(50),
        allowNull: true
    },
    bancopagoelectronico:{
        type: DataTypes.CHAR(3),
        allowNull: true
    },
    estadoempleado:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    sueldodiario:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fechasueldodiario:{
        type: DataTypes.DATE,
        allowNull: true
    },
    sueldovariable:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fechasueldovariable:{
        type: DataTypes.DATE,
        allowNull: true
    },
    sueldopromedio:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fechasueldopromedio:{
        type: DataTypes.DATE,
        allowNull: true
    },
    sueldointegrado:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fechasueldointegrado:{
        type: DataTypes.DATE,
        allowNull: true
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
        allowNull: true
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
        allowNull: true
    },
    cuentacw:{
        type: DataTypes.CHAR(31),
        allowNull: true
    },
    tipocontrato:{
        type: DataTypes.CHAR(2),
        allowNull: true
    },
    basecotizacionimss:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    tipoempleado:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    basepago:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    formapago:{
        type: DataTypes.CHAR(3),
        allowNull: true
    },
    zonasalario:{
        type: DataTypes.CHAR(1),
        allowNull: true
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
        allowNull: true
    },
    telefono:{
        type: DataTypes.CHAR(20),
        allowNull: true
    },
    codigopostal:{
        type: DataTypes.CHAR(5),
        allowNull: true
    },
    direccion:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    poblacion:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    estado:{
        type: DataTypes.CHAR(3),
        allowNull: true
    },
    nombrepadre:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    nombremadre:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    numeroafore:{
        type: DataTypes.CHAR(50),
        allowNull: true
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
        allowNull: true
    },
    campoextra2:{
        type: DataTypes.CHAR(40),
        allowNull: true
    },
    campoextra3:{
        type: DataTypes.CHAR(40),
        allowNull: true
    },
    fechareingreso:{
        type: DataTypes.DATE,
        allowNull: true
    },
    ajustealneto:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    timestamp:{
        type: DataTypes.DATE,
        allowNull: true
    },
    cidregistropatronal:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ccampoextranumerico1:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ccampoextranumerico2:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ccampoextranumerico3:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ccampoextranumerico4:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ccampoextranumerico5:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    cestadoempleadoperiodo:{
        type: DataTypes.CHAR(4),
        allowNull: true
    },
    cfechasueldomixto:{
        type: DataTypes.DATE,
        allowNull: true
    },
    csueldomixto:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    NumeroFonacot:{
        type: DataTypes.CHAR(20),
        allowNull: true
    },
    CorreoElectronico:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    TipoRegimen:{
        type: DataTypes.CHAR(2),
        allowNull: true
    },
    ClabeInterbancaria:{
        type: DataTypes.CHAR(30),
        allowNull: true
    },
    EntidadFederativa:{
        type: DataTypes.CHAR(2),
        allowNull: true
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
        allowNull: true
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