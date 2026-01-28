import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const modelonom10001 = db.define('nom10001',{
    idempleado:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,        
    },
    iddepartamento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    idpuesto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    codigoempleado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: {}
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    fotografia: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    apellidopaterno: {
        type: DataTypes.STRING(84),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    apellidomaterno: {
        type: DataTypes.STRING(84),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    nombrelargo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    fechanacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date('2000-01-01T00:00:00')
    },
    sexo: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    numerosegurosocial: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    estadoempleado: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'A'
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    correoelectronico: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    jefedirecto: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    esBecario: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    tablename:"nom10001",
    timestamps:false,
    freezeTableName: true
})

export default modelonom10001;
