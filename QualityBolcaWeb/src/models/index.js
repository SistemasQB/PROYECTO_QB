//Aqui se hacen las comunicacions entre las tablas, se crean las asociaciones

import { default as Asistencia } from "./asistencia.js"
import { default as Cps } from "./cps.js"
import { default as ControlDispositivos } from "./ControlDispositivos.js"
import { default as DocumentosControlados } from "./documentosControlados.js"
import { default as EncuestaS } from "./encuestaSatisfaccion.js"
import { default as juegos } from "./juegos.js"
import { default as Mejora } from "./mejoraContinua.js"
import { default as pedirCurso } from "./pedirCurso.js"
import { default as precios } from "./precios.js"
import { default as puestos } from "./puestos.js"
import { default as registroCurso } from "./registroCursos.js"
import { default as registroma } from "./registroma.js"
import { default as requisicion } from "./requisicion.js"
import { default as verificacion5s } from "./verificacion5s.js"
import { default as CheckListVehiculos } from "./checklist.js"
import { default as Listas } from "./listas.js"
import { default as Requisicion } from "./requisicion.js"
import { default as Curso } from "./cursos.js"
import { default as RegistroCursos } from "./registroCursos.js"
import { default as Comunicacion } from "./comunicacion.js"
import { default as Usuario } from "./Usuario.js"
import { default as Gch_Alta } from "./gch_alta.js";
import { default as informaciongch } from "./informaciongch.js";
import { default as informacionpuesto } from "./informacionpuesto.js";
import { default as Glosario } from "./glosario.js";

// import { default as adminController } from './../controllers/adminController.js';

/*
    Asociaciones
    => 1:1 hasOne
    => 1:1 belongsTo
    => 1:N hasMany
    => M:N belongsToMany
*/

Comunicacion.belongsTo(Gch_Alta, { foreignKey: 'curp', targetKey: 'id' });
Gch_Alta.hasOne(Comunicacion, { foreignKey: 'curp', sourceKey: 'id' });

informacionpuesto.belongsTo(informaciongch, { foreignKey: 'idpuesto', targetKey: 'idpuesto' });
informaciongch.hasOne(informacionpuesto, { foreignKey: 'idpuesto', sourceKey: 'idpuesto' });



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
    Glosario
}
