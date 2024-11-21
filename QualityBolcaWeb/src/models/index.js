//Aqui se hacen las comunicacions entre las tablas, se crean las asociaciones

import Listas from "./listas.js"
import Requisicion from "./requisicion.js"
import Curso from "./cursos.js"
import RegistroCursos from "./registroCursos.js"
import Comunicacion from "./comunicacion.js"
import Usuario from "./Usuario.js"
import Gch_Alta from "./gch_alta.js";

/*
    Asociaciones
    => 1:1 hasOne
    => 1:1 belongsTo
    => 1:N hasMany
    => M:N belongsToMany
*/

Comunicacion.belongsTo(Gch_Alta, { foreignKey: 'curp', targetKey: 'id' });
Gch_Alta.hasOne(Comunicacion, { foreignKey: 'curp', sourceKey: 'id' });

export {
    Listas,
    Requisicion,
    Curso,
    RegistroCursos,
    Comunicacion,
    Usuario,
    Gch_Alta
}