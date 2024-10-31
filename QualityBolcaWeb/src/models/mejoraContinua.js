import { DataTypes } from 'sequelize';
import db from "../config/db.js";

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

// Definir relaciones
Mejora.hasMany(Beneficio, { foreignKey: 'mejora_id' });
Mejora.hasMany(ProcesoMejora, { foreignKey: 'mejora_id' });
Beneficio.belongsTo(Mejora, { foreignKey: 'mejora_id' });
ProcesoMejora.belongsTo(Mejora, { foreignKey: 'mejora_id' });

export { Mejora, Beneficio, ProcesoMejora };
