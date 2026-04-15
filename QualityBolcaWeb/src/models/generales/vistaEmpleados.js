import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const modeloVistaEmpleados = db.define('empleados', {
    codigoempleado: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellidopaterno: {
        type: DataTypes.STRING(84),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    apellidomaterno: {
        type: DataTypes.STRING(84),
        allowNull: true,
        defaultValue: 'SIN DEFINIR'

    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: true,
        
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departamentoLocal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'empleados'
    // hooks:{
    //         beforeCreate: async function (usuario) {
    //             const salt = await bcrypt.genSalt(10);
    //             usuario.password = await bcrypt.hash( usuario.password, salt);
    //         }
    //     },
    //     scopes: {
    //         eliminarPassword: {
    //             attributes:{
    //                 exclude: ['password','token','confirmado']
    //             }
    //         },
    //         eliminarPasswordConfirmado: {
    //             attributes: {
    //                 exclude: ['password','confirmado']
    //             }
    //         }
            
    //     }
    
});

export default modeloVistaEmpleados