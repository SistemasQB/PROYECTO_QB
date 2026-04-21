import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Empleados = dbNew.define('gch_empleados', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    clave: {
        type: DataTypes.CHAR(5),
        allowNull: false,
        unique: true,
        defaultValue: '00000'
    },
    nss: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        unique: true,
        defaultValue: '00000000000'
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    curp: {
        type: DataTypes.CHAR(18),
        allowNull: true,
        unique: true,
        defaultValue: null
    },
    rfc: {
        type: DataTypes.CHAR(13),
        allowNull: true,
        unique: true,
        defaultValue: null
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    lugar_nacimiento: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'N/A'
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: null  // 'H' / 'M'
    },
    estado_civil: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'N/A'
    },
    id_escolaridad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    generacion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    estatus: {
        type: DataTypes.ENUM('ALTA', 'BAJA'),
        allowNull: false,
        defaultValue: 'ALTA'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_empleados',
    freezeTableName: true,
    timestamps: false
})

Empleados.asociar = (modelos) => {
    Empleados.belongsTo(modelos.Escolaridades, {
        foreignKey: 'id_escolaridad',
        as: 'escolaridad'
    })
    Empleados.hasOne(modelos.EmpleadosContacto, {
        foreignKey: 'id_empleado',
        as: 'contacto'
    })
    Empleados.hasOne(modelos.EmpleadosContactoEmergencia, {
        foreignKey: 'id_empleado',
        as: 'contactoEmergencia'
    })
    Empleados.hasOne(modelos.EmpleadosPosicion, {
        foreignKey: 'id_empleado',
        as: 'posicion'
    })
    Empleados.hasMany(modelos.HistorialEmpleo, {
        foreignKey: 'id_empleado',
        as: 'historialEmpleo'
    })
    Empleados.hasOne(modelos.EmpleadosDocumentos, {
        foreignKey: 'id_empleado',
        as: 'documentos'
    })
    Empleados.hasOne(modelos.EmpleadosBeneficios, {
        foreignKey: 'id_empleado',
        as: 'beneficios'
    })
    Empleados.hasOne(modelos.EmpleadosReclutamiento, {
        foreignKey: 'id_empleado',
        as: 'reclutamiento'
    })
    Empleados.hasMany(modelos.InfonavitCreditos, {
        foreignKey: 'id_empleado',
        as: 'creditosInfonavit'
    })
    Empleados.belongsToMany(modelos.Eventos, {
        through: modelos.EmpleadosEventos,
        foreignKey: 'id_empleado',
        otherKey: 'id_evento',
        as: 'eventos'
    })
    Empleados.belongsToMany(modelos.Cursos, {
        through: modelos.EmpleadosCursos,
        foreignKey: 'id_empleado',
        otherKey: 'id_curso',
        as: 'cursos'
    })
}

export default Empleados
