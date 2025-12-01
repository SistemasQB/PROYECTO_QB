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
    sexo:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    numerosegurosocial:{
        type: DataTypes.CHAR(15),
        allowNull: true
    },
    estadoempleado:{
        type: DataTypes.CHAR(1),
        allowNull: true
    },
    telefono:{
        type: DataTypes.CHAR(20),
        allowNull: true
    },
    CorreoElectronico:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    jefeDirecto:{
        type: DataTypes.STRING,
        allowNull: true
    },
    esBecario:{
        type:DataTypes.INTEGER,
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