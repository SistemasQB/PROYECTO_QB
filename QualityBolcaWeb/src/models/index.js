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
// import { default as Gch_Alta } from './gch_alta.js';
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

// Configuración de Sequelize
const sequelize = new Sequelize('informacionQB', 'admin', '8646559a', {
  host: '86.38.218.253',
  dialect: 'mariadb' // o el dialecto que estés utilizando
});

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
  // Gch_Alta,
  informaciongch,
  informacionpuesto,
  Glosario,
  Departamentos,
  Inventario,
  Mantenimiento,
  Vales,
  Testcleaver,
  BuzonQuejas,
  Vacaciones
};