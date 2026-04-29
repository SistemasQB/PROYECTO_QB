import manejadorErrores from '../middleware/manejadorErrores.js';
import sequelizeClase from '../public/clases/sequelize_clase.js';
import { capitalHumano } from '../models/QBnew/catalogos/barrilCatalogos.js';
import modelosCapitalHumano from '../models/QBnew/capitalHumano/barrilCapitalHumano.js';
import modelosGenerales from '../models/generales/barrilModelosGenerales.js';
import { Op } from 'sequelize';
import { emailAutorizacionACH } from '../helpers/emails.js';

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
    tipos_contratacion:       'descripcion',
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

function parsearPermisos(raw) {
    if (!raw) return {}
    return typeof raw === 'string' ? JSON.parse(raw) : raw
}

controlador.requisicionPersonalOperativo = async (req, res) => {
    try {
        const clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 })
        const datosUsuario = await clase.obtener1Registro({ criterio: { codigoempleado: req.usuario.codigoempleado } })

        const clasePuesto = new sequelizeClase({ modelo: modelosGenerales.nom10006 })
        const puesto = await clasePuesto.obtener1Registro({ criterio: { idpuesto: datosUsuario.idpuesto } })

        const claseDept = new sequelizeClase({ modelo: modelosGenerales.modelonom10003 })
        const departamento = await claseDept.obtener1Registro({ criterio: { iddepartamento: datosUsuario.iddepartamento } })

        datosUsuario.puesto = puesto ? puesto.descripcion : ''
        datosUsuario.departamento = departamento ? departamento.descripcion : ''

        const permisos      = parsearPermisos(req.usuario.permisos)
        const roles         = Array.isArray(permisos?.roles)    ? permisos.roles.map(r => r.toLowerCase())    : []
        const niveles       = Array.isArray(permisos?.permisos) ? permisos.permisos.map(r => r.toLowerCase()) : []
        const esAutorizador = roles.includes('ach') && niveles.includes('jefe')

        if (esAutorizador) {
            const claseReq = new sequelizeClase({ modelo: modelosCapitalHumano.Requisiciones })
            const requisiciones = await claseReq.ejecutarQuery({
                query: `
                    SELECT r.*, cr.nombre_region, cp.nombre_planta
                    FROM ach_requisiciones_personal r
                    LEFT JOIN c_regiones cr ON cr.id = r.id_region
                    LEFT JOIN c_plantas  cp ON cp.id = r.id_planta
                    ORDER BY r.fecha_requisicion DESC
                `
            })
            return res.status(200).render('admin/capitalhumano/ACH/autorizacionRequisiciones.ejs', {
                token: req.csrfToken(),
                datosUsuario,
                requisiciones: requisiciones || []
            })
        }

        res.status(200).render('admin/capitalhumano/ACH/requisicionPersonalOperativo.ejs', {
            token: req.csrfToken(),
            datosUsuario
        });
    } catch (error) {
        console.error('Error en controlador.requisicionPersonalOperativo:', error);
        return manejadorErrores(res, error);
    }
}

controlador.autorizarRequisicion = async (req, res) => {
    try {
        const { id } = req.params
        const { accion, fecha_compromiso, email_solicitante } = req.body

        if (!['autorizar', 'rechazar'].includes(accion)) {
            return res.status(400).json({ ok: false, mensaje: 'Acción no válida.' })
        }

        if (accion === 'autorizar') {
            if (!fecha_compromiso || String(fecha_compromiso).trim() === '') {
                return res.status(400).json({ ok: false, mensaje: 'La fecha compromiso es obligatoria para autorizar.' })
            }
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!email_solicitante || !regexEmail.test(email_solicitante)) {
                return res.status(400).json({ ok: false, mensaje: 'El correo del jefe solicitante es obligatorio y debe ser válido.' })
            }
        }

        const clase = new sequelizeClase({ modelo: modelosCapitalHumano.Requisiciones })
        const datos = {
            estatus:            accion === 'autorizar' ? 'en_proceso' : 'rechazada',
            autorizado_por:     req.usuario.codigoempleado,
            fecha_autorizacion: new Date().toISOString().slice(0, 10)
        }
        if (accion === 'autorizar') {
            datos.fecha_compromiso = fecha_compromiso
            // datos.email_solicitante = email_solicitante  — activar después de correr el ALTER TABLE
        }

        const actualizado = await clase.actualizarDatos({ id, datos })

        if (!actualizado) return res.status(500).json({ ok: false, mensaje: 'No se pudo actualizar la requisición.' })

        if (accion === 'autorizar') {
            const numId = parseInt(id, 10)
            clase.ejecutarQuery({
                query: `
                    SELECT r.id, r.cantidad_personal, r.fecha_compromiso,
                           cr.nombre_region, cp.nombre_planta
                    FROM ach_requisiciones_personal r
                    LEFT JOIN c_regiones cr ON cr.id = r.id_region
                    LEFT JOIN c_plantas  cp ON cp.id = r.id_planta
                    WHERE r.id = ${numId}
                    LIMIT 1
                `
            }).then(rows => {
                if (rows && rows[0]) {
                    emailAutorizacionACH({ destinatario: email_solicitante, datos: rows[0] })
                        .catch(e => console.error('[ACH Email]', e))
                }
            }).catch(e => console.error('[ACH Email Query]', e))
        }

        return res.status(200).json({
            ok: true,
            mensaje: accion === 'autorizar' ? 'Requisición autorizada correctamente.' : 'Requisición rechazada.'
        })
    } catch (error) {
        console.error('Error en controlador.autorizarRequisicion:', error)
        return res.status(500).json({ ok: false, mensaje: 'Error interno.' })
    }
}

controlador.editarRequisicion = async (req, res) => {
    try {
        const { id } = req.params
        const datos   = req.body

        const actualizar = {}
        if (datos.id_region         !== undefined) actualizar.id_region         = Number(datos.id_region)
        if (datos.id_planta         !== undefined) actualizar.id_planta         = Number(datos.id_planta)
        if (datos.cantidad_personal !== undefined) actualizar.cantidad_personal = Number(datos.cantidad_personal)
        if (datos.caracteristicas)                 actualizar.caracteristicas   = String(datos.caracteristicas).trim()
        if (datos.tipo_contratacion)               actualizar.tipo_contratacion = String(datos.tipo_contratacion).trim()
        if (datos.sexo)                            actualizar.sexo              = String(datos.sexo).trim()
        if (datos.edad_min          !== undefined) actualizar.edad_min          = Number(datos.edad_min)
        if (datos.edad_max          !== undefined) actualizar.edad_max          = Number(datos.edad_max)
        if (datos.rolar_turno)                     actualizar.rolar_turno       = String(datos.rolar_turno).trim()
        actualizar.rolar_especificacion = datos.rolar_especificacion ? String(datos.rolar_especificacion).trim() : null
        if (datos.epp_especial)                    actualizar.epp_especial      = String(datos.epp_especial).trim()
        if (datos.protocolo_ingreso)               actualizar.protocolo_ingreso = String(datos.protocolo_ingreso).trim()
        if (Array.isArray(datos.dias_descanso)  && datos.dias_descanso.length  > 0) actualizar.dias_descanso  = JSON.stringify(datos.dias_descanso)
        if (Array.isArray(datos.dias_protocolo) && datos.dias_protocolo.length > 0) actualizar.dias_protocolo = JSON.stringify(datos.dias_protocolo)

        if (Object.keys(actualizar).length === 0) {
            return res.status(400).json({ ok: false, mensaje: 'No hay campos para actualizar.' })
        }

        const clase = new sequelizeClase({ modelo: modelosCapitalHumano.Requisiciones })
        const ok = await clase.actualizarDatos({ id, datos: actualizar })

        if (!ok) return res.status(500).json({ ok: false, mensaje: 'No se pudo editar la requisición.' })

        return res.status(200).json({ ok: true, mensaje: 'Requisición actualizada correctamente.' })
    } catch (error) {
        console.error('Error en controlador.editarRequisicion:', error)
        return res.status(500).json({ ok: false, mensaje: 'Error interno al editar la requisición.' })
    }
}

const CAMPOS_REQUERIDOS_REQUISICION = [
    'id_region', 'id_planta', 'cantidad_personal', 'caracteristicas',
    'tipo_contratacion', 'sexo', 'edad_min', 'edad_max',
    'rolar_turno', 'epp_especial', 'protocolo_ingreso'
]

controlador.guardarRequisicion = async (req, res) => {
    try {
        const datos = req.body

        const faltantes = CAMPOS_REQUERIDOS_REQUISICION.filter(campo => {
            const valor = datos[campo]
            return valor === undefined || valor === null || String(valor).trim() === ''
        })
        if (faltantes.length > 0) {
            return res.status(400).json({ ok: false, mensaje: `Faltan campos requeridos: ${faltantes.join(', ')}` })
        }

        if (!Array.isArray(datos.dias_descanso) || datos.dias_descanso.length < 1) {
            return res.status(400).json({ ok: false, mensaje: 'Selecciona al menos un día de descanso.' })
        }
        if (!Array.isArray(datos.dias_protocolo) || datos.dias_protocolo.length < 1) {
            return res.status(400).json({ ok: false, mensaje: 'Selecciona al menos un día de protocolo.' })
        }

        const datosInsertar = {
            creado_por:           req.usuario.codigoempleado,
            id_region:            Number(datos.id_region),
            id_planta:            Number(datos.id_planta),
            cantidad_personal:    Number(datos.cantidad_personal),
            caracteristicas:      String(datos.caracteristicas).trim(),
            tipo_contratacion:    String(datos.tipo_contratacion).trim(),
            sexo:                 String(datos.sexo).trim(),
            edad_min:             Number(datos.edad_min),
            edad_max:             Number(datos.edad_max),
            rolar_turno:          String(datos.rolar_turno).trim(),
            rolar_especificacion: datos.rolar_especificacion ? String(datos.rolar_especificacion).trim() : null,
            epp_especial:         String(datos.epp_especial).trim(),
            dias_descanso:        JSON.stringify(datos.dias_descanso),
            protocolo_ingreso:    String(datos.protocolo_ingreso).trim(),
            dias_protocolo:       JSON.stringify(datos.dias_protocolo),
            fecha_requisicion:    new Date().toISOString().slice(0, 10),
            estatus:              'pendiente'
        }

        const clase = new sequelizeClase({ modelo: modelosCapitalHumano.Requisiciones })
        const insertado = await clase.insertar({ datosInsertar })

        if (!insertado) {
            return res.status(500).json({ ok: false, mensaje: 'No se pudo guardar la requisición. Intenta de nuevo.' })
        }

        return res.status(200).json({ ok: true, mensaje: 'Requisición enviada correctamente. El equipo de ACH la procesará a la brevedad.' })

    } catch (error) {
        console.error('Error en controlador.guardarRequisicion:', error)
        return res.status(500).json({ ok: false, mensaje: 'Error interno al guardar la requisición.' })
    }
}

export default controlador;