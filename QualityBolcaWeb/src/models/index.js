<<<<<<< HEAD
// import { Sequelize } from 'sequelize';
// import modelosSorteo from '../models/sorteo/barrilModelosSorteo.js'
// import modelosInfraestructura from './infraestructura/barril_modelo_compras.js';
// import modelosSistemas from './sistemas/barril_modelos_sistemas.js';
=======
import { Sequelize } from 'sequelize';
import modelosSorteo from '../models/sorteo/barrilModelosSorteo.js'
import modelosInfraestructura from './infraestructura/barril_modelo_compras.js';
import modelosSistemas from './sistemas/barril_modelos_sistemas.js';
import modelonom10001 from './generales/nom10001.js';
import nom10006 from './generales/nom10006.js';
>>>>>>> ramaAlex

// const sequelize = new Sequelize('informacionQB', process.env.BD_USER, process.env.BD_PASS, {host: process.env.BD_HOST,dialect: process.env.BD_DIALECT});
// const qb = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: process.env.BD_DIALECT})
// const compras = new Sequelize(process.env.BD_COMPRAS, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: process.env.BD_DIALECT})
// const calidad = new Sequelize(process.env.BD_CALIDAD, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: process.env.BD_DIALECT})
// const sistemas = new Sequelize(process.env.BD_SISTEMAS, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: process.env.BD_DIALECT})

<<<<<<< HEAD
// informaciongch.belongsTo(informacionpuesto, { foreignKey: 'idpuesto', targetKey: 'idpuesto' });
// informacionpuesto.hasOne(informaciongch, { foreignKey: 'idpuesto', sourceKey: 'idpuesto' });
=======
// Definir asociaciones
// Comunicacion.belongsTo(Gch_Alta, { foreignKey: 'curp', targetKey: 'id' });
// Gch_Alta.hasOne(Comunicacion, { foreignKey: 'curp', sourceKey: 'id' });
// informacionpuesto.belongsTo(informaciongch, { foreignKey: 'idpuesto', targetKey: 'idpuesto' });
// informaciongch.hasOne(informacionpuesto, { foreignKey: 'idpuesto', sourceKey: 'idpuesto' });


modelonom10001.belongsTo(nom10006, { foreignKey: 'idpuesto', targetKey: 'idpuesto' });
nom10006.hasOne(modelonom10001, { foreignKey: 'idpuesto', sourceKey: 'idpuesto' });
>>>>>>> ramaAlex

// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     await qb.sync({force: false});
//     await compras.sync({force: false});
//     await calidad.sync({force: false});
//     await sistemas.sync({force: false});
//     console.log('Base de datos sincronizada');
    
//   } catch (error) {
//     console.error('Error al sincronizar la base de datos:', error);
//   }
// })();

// export default{
//   modelosSorteo,
//   modelosInfraestructura,
//   modelosSistemas
// };

// function conexion(db){
//   return new Sequelize(db, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: process.env.BD_DIALECT})
// }


