/**
 * Middleware: usuarioLocals
 *
 * Lee el JWT desde la cookie "_token" directamente (sin depender de
 * req.usuario, que lo pone protegetRuta más tarde dentro de los routers).
 * Si el token es válido consulta nom10001 + nom10006 + tablaUsuarios y
 * expone res.locals.usuarioInfo para que todas las vistas EJS tengan acceso
 * al perfil del empleado sin código extra en cada controlador.
 *
 * En rutas públicas o cuando el token es inválido/ausente el valor es null;
 * las vistas deben comprobar: <% if (usuarioInfo) { %> ... <% } %>
 */

import jwt from 'jsonwebtoken';
import sequelizeClase from '../public/clases/sequelize_clase.js';
import modelosGenerales from '../models/generales/barrilModelosGenerales.js';
import tablaUsuarios from '../models/generales/modelo_usuarios.js';

const usuarioLocals = async (req, res, next) => {
    // Valor por defecto: null (rutas públicas o sin sesión válida)
    res.locals.usuarioInfo = null;

    // Leemos el token igual que protegetRuta — desde la cookie "_token"
    const { _token } = req.cookies || {};
    if (!_token) return next();

    let codigoempleado;
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        codigoempleado = decoded.codigoempleado;
    } catch {
        // Token expirado o inválido → no bloqueamos, solo dejamos null
        return next();
    }

    try {
        // Paso 1: fotografia viene del modelo de usuarios (igual que protegetRuta)
        const usuarioRow = await tablaUsuarios
            .scope('eliminarPassword')
            .findByPk(codigoempleado);

        const fotografia = usuarioRow ? (usuarioRow.fotografia || null) : null;

        // Paso 2: nombre completo y puesto desde nom10001
        const claseEmpleado = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 });
        const datosEmpleado = await claseEmpleado.obtener1Registro({
            criterio: { codigoempleado }
        });

        if (!datosEmpleado) return next();

        // Paso 3: descripcion del puesto desde nom10006
        let descPuesto = 'Sin puesto';
        if (datosEmpleado.idpuesto) {
            const clasePuesto = new sequelizeClase({ modelo: modelosGenerales.nom10006 });
            const datosPuesto = await clasePuesto.obtener1Registro({
                criterio: { idpuesto: datosEmpleado.idpuesto }
            });
            if (datosPuesto && datosPuesto.descripcion) {
                descPuesto = datosPuesto.descripcion;
            }
        }

        const nombrelargo = datosEmpleado.nombrelargo || `${datosEmpleado.nombre} ${datosEmpleado.apellidopaterno}`;

        // Nombre corto: nom10001 guarda "APELLIDOP APELLIDOM NOMBRE1 NOMBRE2"
        // Devolvemos "NOMBRE1 APELLIDOP" para que sea legible en el sidebar
        const nombreCorto = (() => {
            const partes = nombrelargo.trim().split(/\s+/);
            if (partes.length >= 3) return `${partes[2]} ${partes[0]}`;
            return partes.slice(0, 2).join(' ');
        })();

        res.locals.usuarioInfo = {
            codigoempleado,
            nombrelargo,
            nombreCorto,
            puesto: descPuesto,
            correo: datosEmpleado.correoelectronico || '',
            fotografia,
            inicial: (datosEmpleado.nombre || nombrelargo || 'U')[0].toUpperCase()
        };

    } catch (error) {
        // No bloqueamos la solicitud si falla la consulta opcional
        console.error('[usuarioLocals] Error al obtener datos de usuario:', error.message);
    }

    return next();
};

export default usuarioLocals;
