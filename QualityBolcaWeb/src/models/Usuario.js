import { DataTypes } from 'sequelize'
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Usuario = db.define('usuario', {
    codigoempleado:{
        type: DataTypes.STRING(30),
        primaryKey: true
    },
    permisos:{
        type: DataTypes.STRING,
        allowNull: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fotografia:{
        type: DataTypes.STRING,
        allowNull: true
    },
    token: DataTypes.STRING,
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    jefedirecto: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
},{
    timestamps: false,
    hooks:{
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash( usuario.password, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes:{
                exclude: ['password','token','confirmado']
            }
        },
        
    }
})

//Metodo Personalizado

Usuario.prototype.verificarPasssword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

export default Usuario;