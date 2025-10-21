import { Sequelize } from 'sequelize';
import { default as Asistencia } from './asistencia.js';
import { default as Cps } from './cps.js';
import { default as ControlDispositivos } from './ControlDispositivos.js';
import { default as DocumentosControlados } from './documentosControlados.js';
import { default as EncuestaS } from './encuestaSatisfaccion.js';
import { default as juegos } from './juegos.js';
import { default as Mejora } from './mejoraContinua.js';
import { default as pedirCurso } from './pedirCurso.js';
import { default as precios } from './precios.js';
import { default as puestos } from './puestos.js';
import { default as registroCurso } from './registroCursos.js';
import { default as registroma } from './registroma.js';
import { default as requisicion } from './requisicion.js';
import { default as verificacion5s } from './verificacion5s.js';
import { default as CheckListVehiculos } from './checklist.js';
import { default as Listas } from './listas.js';
import { default as Requisicion } from './requisicion.js';
import { default as Curso } from './cursos.js';
import { default as RegistroCursos } from './registroCursos.js';
import { default as Comunicacion } from './comunicacion.js';
import { default as Usuario } from './Usuario.js';
import { default as Gch_Alta } from './gch_alta.js';
import { default as informaciongch } from './informaciongch.js';
import { default as informacionpuesto } from './informacionpuesto.js';
import { default as Glosario } from './glosario.js';
import { default as Departamentos } from './departamentos.js';
import { default as Inventario } from './inventario.js';
import { default as Mantenimiento } from './mantenimiento.js';
import { default as Vales } from './vales.js';
import { default as Testcleaver } from './atraccion/testcleaver.js';
import { default as BuzonQuejas } from './buzonQuejas.js';
import { default as Vacaciones } from './vacaciones.js';
import { default as Solicitudservicio } from './solicitudservicio.js';
import { default as Solicitud } from './atraccion/solicitud.js';
import { default as Empleados } from './empleado.js';
import { default as Cc1 } from './cc1.js';
import { default as Checklistcc1 } from './sorteo/cc1/checklistcc1.js';
import { default as PersonalCC1 } from './sorteo/cc1/PersonalCC1.js';
import { default as CotizacionesCC1 } from './sorteo/cc1/cotizacionesCC1.js';
import { default as Controlpiezas } from './sorteo/cc1/controlpiezas.js';
import { default as Controlpiezas2 } from './sorteo/cc1/controlpiezas2.js';
import { default as LoteCC1 } from './sorteo/cc1/lote.js';
// import { default as bitacoraActividades } from './bitacoraActividades.js';
import { default as Semanal } from './nominas/semanal.js';
import { default as modeloDirectorioCalidad } from './calidad/directorioPersonal.js';
import { default as bitacoraActividades } from './calidad/bitacoraActividades.js';
import modelosSorteo from '../models/sorteo/barrilModelosSorteo.js'
import modelosInfraestructura from './infraestructura/barril_modelo_compras.js';
import modelosSistemas from './sistemas/barril_modelos_sistemas.js';



// Configuración de Sequelize
const sequelize = new Sequelize('informacionQB', 'admin', '8646559a', {
  host: '86.38.218.253',
  dialect: 'mariadb' // o el dialecto que estés utilizando
});
const qb = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: 'mariadb'})
const compras = new Sequelize(process.env.BD_COMPRAS, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: 'mariadb'})
const calidad = new Sequelize(process.env.BD_CALIDAD, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: 'mariadb'})
const sistemas = new Sequelize(process.env.BD_SISTEMAS, process.env.BD_USER, process.env.BD_PASS,{ host: process.env.BD_HOST, dialect: 'mariadb'})

// Definir asociaciones
// Comunicacion.belongsTo(Gch_Alta, { foreignKey: 'curp', targetKey: 'id' });
// Gch_Alta.hasOne(Comunicacion, { foreignKey: 'curp', sourceKey: 'id' });
// informacionpuesto.belongsTo(informaciongch, { foreignKey: 'idpuesto', targetKey: 'idpuesto' });
// informaciongch.hasOne(informacionpuesto, { foreignKey: 'idpuesto', sourceKey: 'idpuesto' });

informaciongch.belongsTo(informacionpuesto, { foreignKey: 'idpuesto', targetKey: 'idpuesto' });
informacionpuesto.hasOne(informaciongch, { foreignKey: 'idpuesto', sourceKey: 'idpuesto' });

// Vales.belongsTo(informaciongch, { foreignKey: 'numeroEmpleado', targetKey: 'codigoempleado' });
// Vales.hasOne(informaciongch, { foreignKey: 'numeroEmpleado', targetKey: 'codigoempleado' });
// Vales.hasOne(Inventario, { foreignKey: 'IdFolio', targetKey: 'folio' });
// Inventario.belongsTo(Vales, { foreignKey: 'folio', targetKey: 'idFolio' });
// Vales.hasOne(Inventario, { foreignKey: 'folio', sourceKey: 'idFolio' });

// Sincronizar la base de datos
(async () => {
  try {
    await sequelize.sync({ force: true });
    await qb.sync({force: true});
    await compras.sync({force: true});
    await calidad.sync({force: true});
    await sistemas.sync({force: true});
    console.log('Base de datos sincronizada');
    
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
})();

export {
  Asistencia,
  Cps,
  ControlDispositivos,
  DocumentosControlados,
  EncuestaS,
  juegos,
  Mejora,
  pedirCurso,
  precios,
  puestos,
  registroCurso,
  registroma,
  requisicion,
  verificacion5s,
  CheckListVehiculos,
  Listas,
  Requisicion,
  Curso,
  RegistroCursos,
  Comunicacion,
  Usuario,
  Gch_Alta,
  informaciongch,
  informacionpuesto,
  Glosario,
  Departamentos,
  Inventario,
  Mantenimiento,
  Vales,
  Testcleaver,
  BuzonQuejas,
  Vacaciones,
  Solicitudservicio,
  Empleados,
  Cc1,
  Checklistcc1,
  Solicitud,
  bitacoraActividades,
  Semanal,
  PersonalCC1,
  CotizacionesCC1,
  Controlpiezas,
  LoteCC1,
  Controlpiezas2,
  modelosSorteo,
  modeloDirectorioCalidad,
  modelosInfraestructura,
  modelosSistemas
};