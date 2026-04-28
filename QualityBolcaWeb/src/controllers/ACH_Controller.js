import manejadorErrores from '../middleware/manejadorErrores.js';
import sequelizeClase from '../public/clases/sequelize_clase.js';
import { capitalHumano } from '../models/QBnew/catalogos/barrilCatalogos.js';
import modelosCapitalHumano from '../models/QBnew/capitalHumano/barrilCapitalHumano.js';
import { Op } from 'sequelize';

// Campos obligatorios de primer nivel para una solicitud de empleo
const CAMPOS_REQUERIDOS_SOLICITUD = [
    'puesto',
    'ap_paterno',
    'ap_materno',
    'nombres',
    'fecha_nacimiento',
    'sexo',
    'calle',
    'colonia',
    'telefono',
    'email',
    'curp',
    'lugar_nacimiento',
    'nacionalidad',
    'vive_con',
    'estado_civil',
    'tabaco',
    'alcohol',
    'drogas',
    'escolaridad',
    'pasaporte',
    'visa',
    'como_se_entero',
    'familiar_en_qb'
]

/**
 * Mapa de catálogos permitidos: clave de req.body.catalogo → campo de ordenamiento ASC.
 * Actúa como whitelist de seguridad: cualquier clave fuera de este objeto es rechazada.
 * Para exponer un catálogo nuevo basta con agregar una línea aquí.
 */
const CATALOGOS_CONFIG = {
    departamentos:            'nombre_departamento',
    escolaridades:            'descripcion',
    infonavitTiposDescuentos: 'descripcion',
    motivosBaja:              'descripcion',
    plantas:                  'nombre_planta',
    puestos:                  'nombre_puesto',
    regiones:                 'nombre_region',
    tiposContratos:           'descripcion',
};

let controlador = {}

controlador.inicio = (req, res) => {
    try {
        return res.render('admin/capitalhumano/inicioCapitalHumano.ejs', { token: req.csrfToken() });
    } catch (error) {
        console.error('Error en controlador.inicio:', error);
        return manejadorErrores(res, error);
    }
}

controlador.solicitudParcial = (req, res) => {
    try {
        res.status(200).render('admin/capitalHumano/solicitudParcial.ejs', { token: req.csrfToken() });
    } catch (error) {
        console.error('Error en controlador.solicitudParcial:', error);
        return manejadorErrores(res, 'sucedio un error inesperado al cargar la vista de solicitud parcial');
    }
}


controlador.catalogos = async (req, res) => {
    try {
        const catalogo = req.body.catalogo;
        if (!Object.prototype.hasOwnProperty.call(CATALOGOS_CONFIG, catalogo)) {
            return res.status(400).json({ token: req.csrfToken(), ok: false, msg: 'Catálogo no reconocido.' });
        }
        const campoOrden = CATALOGOS_CONFIG[catalogo];
        console.log(campoOrden, catalogo);
        const clase = new sequelizeClase({ modelo: capitalHumano[catalogo] });
        const resultado = await clase.obtenerDatosPorCriterio({
            criterio:     { id: { [Op.gt]: 0 } },
            ordenamiento: [[campoOrden, 'ASC']],
        });

        return res.status(200).json({ token: req.csrfToken(), data: resultado, ok: true, msg: 'Catálogo cargado correctamente' });
    } catch (error) {
        console.error('Error en controlador.catalogos:', error);
        return res.status(500).json({ token: req.csrfToken(), ok: false, msg: 'Error al cargar el catálogo' });
    }
}

/**
 * POST /capitalhumano/solicitud
 * Ruta pública — guarda una nueva solicitud de empleo.
 * No requiere sesión activa; el token CSRF lo provee el formulario público.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
controlador.guardarSolicitud = async (req, res) => {
    try {
        const datos = req.body;

        // ── Validación server-side de campos requeridos ───────────
        const faltantes = CAMPOS_REQUERIDOS_SOLICITUD.filter(campo => {
            const valor = datos[campo];
            return valor === undefined || valor === null || String(valor).trim() === '';
        });

        if (faltantes.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `Faltan campos requeridos: ${faltantes.join(', ')}`
            });
        }

        // ── Validación de formato de email ────────────────────────
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(datos.email)) {
            return res.status(400).json({ ok: false, msg: 'El formato del correo electrónico no es válido.' });
        }

        // ── Validación de formato de CURP (18 caracteres alfanuméricos) ──
        const regexCurp = /^[A-Z0-9]{18}$/i;
        if (!regexCurp.test(datos.curp)) {
            return res.status(400).json({ ok: false, msg: 'El formato de la CURP no es válido.' });
        }

        // ── Construir el objeto a insertar ────────────────────────
        const datosInsertar = {
            puesto:               String(datos.puesto).trim(),
            puesto_otro:          datos.puesto_otro          ? String(datos.puesto_otro).trim()          : null,
            sueldo_deseado:       datos.sueldo_deseado       ? Number(datos.sueldo_deseado)               : null,
            ap_paterno:           String(datos.ap_paterno).trim(),
            ap_materno:           String(datos.ap_materno).trim(),
            nombres:              String(datos.nombres).trim(),
            fecha_nacimiento:     String(datos.fecha_nacimiento).trim(),
            sexo:                 datos.sexo,
            calle:                String(datos.calle).trim(),
            colonia:              String(datos.colonia).trim(),
            cp:                   datos.cp                   ? String(datos.cp).trim()                    : null,
            telefono:             String(datos.telefono).trim(),
            email:                String(datos.email).trim().toLowerCase(),
            curp:                 String(datos.curp).trim().toUpperCase(),
            lugar_nacimiento:     String(datos.lugar_nacimiento).trim(),
            tiempo_residencia:    datos.tiempo_residencia     ? String(datos.tiempo_residencia).trim()    : null,
            nacionalidad:         String(datos.nacionalidad).trim(),
            nacionalidad_otra:    datos.nacionalidad_otra     ? String(datos.nacionalidad_otra).trim()    : null,
            vive_con:             String(datos.vive_con).trim(),
            estatura:             datos.estatura              ? Number(datos.estatura)                    : null,
            peso:                 datos.peso                  ? Number(datos.peso)                       : null,
            estado_civil:         String(datos.estado_civil).trim(),
            tabaco:               datos.tabaco,
            alcohol:              datos.alcohol,
            drogas:               datos.drogas,
            rehabilitacion:       datos.rehabilitacion        ? datos.rehabilitacion                      : null,
            escolaridad:          String(datos.escolaridad).trim(),
            maquinas:             datos.maquinas              ? String(datos.maquinas)                    : null,
            pasaporte:            datos.pasaporte,
            visa:                 datos.visa,
            como_se_entero:       String(datos.como_se_entero).trim(),
            como_se_entero_otro:  datos.como_se_entero_otro   ? String(datos.como_se_entero_otro).trim() : null,
            familiar_en_qb:       datos.familiar_en_qb,
            familiar_nombre:      datos.familiar_nombre       ? String(datos.familiar_nombre).trim()      : null,
            familiar_parentesco:  datos.familiar_parentesco   ? String(datos.familiar_parentesco).trim()  : null,
            fecha_solicitud:      new Date().toISOString().slice(0, 10),
            estatus:              'pendiente'
        }

        const clase = new sequelizeClase({ modelo: modelosCapitalHumano.SolicitudesEmpleo });
        const insertado = await clase.insertar({ datosInsertar });

        if (!insertado) {
            console.error('Error en controlador.guardarSolicitud: insertar() devolvió false');
            return res.status(500).json({ ok: false, msg: 'No se pudo guardar la solicitud. Intente de nuevo más tarde.' });
        }

        return res.status(200).json({ ok: true, msg: 'Solicitud enviada correctamente. Nos pondremos en contacto pronto.' });

    } catch (error) {
        console.error('Error en controlador.guardarSolicitud:', error);
        return res.status(500).json({ ok: false, msg: 'Error interno al guardar la solicitud.' });
    }
}

controlador.requisicionPersonalOperativo = (req, res) => {
    try {
        res.status(200).render('admin/capitalhumano/ACH/requisicionPersonalOperativo.ejs', { token: req.csrfToken() });
    } catch (error) {
        console.error('Error en controlador.requisicionPersonalOperativo:', error);
        return manejadorErrores(res, error);
    }
}

export default controlador;