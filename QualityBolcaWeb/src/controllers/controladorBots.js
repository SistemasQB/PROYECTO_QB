import axios from 'axios';
import multer from 'multer';
import { Op } from 'sequelize';
import manejadorErrores from '../middleware/manejadorErrores.js';
import { Reporte, Cotizacion, ReporteBody } from '../models/capturacion/barril_modelo_capturacion.js';
import Empleados from '../models/empleado.js';
import { where } from 'sequelize';
import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import { informacionpuesto } from "../models/index.js";
import Informaciondepartamento from "../models/informaciondepartamento.js";
import { QueryTypes } from 'sequelize';
import db from "../config/db.js";
import dbReportes from "../config/dbReportes.js";

const storage = multer.memoryStorage();
export const uploadPdf = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'), false);
        }
    }
});

const controlador = {}

controlador.botReportes = (req, res) => {
    try {
        res.render('bots/botPrueba.ejs', { csrfToken: req.csrfToken() })
    } catch (error) {
        manejadorErrores(res, error)
    }
}

controlador.botChat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ ok: false, error: 'El campo messages es requerido.' });
        }

        const systemPrompt = `Eres un asistente virtual especializado exclusivamente en reportes empresariales.
Solo puedes responder preguntas relacionadas con: reportes de producción, reportes de calidad, reportes de inventario, indicadores operativos, métricas de planta, análisis de datos industriales y temas directamente vinculados a la operación y reportería de la empresa.
Si el usuario pregunta sobre cualquier otro tema que no esté relacionado con reportes empresariales, debes responder amablemente que solo puedes ayudar con consultas sobre reportes de la empresa y redirigir la conversación hacia ese ámbito.
Responde siempre en español, de forma clara y concisa.

FORMATO DE RESPUESTA OBLIGATORIO:
Debes responder SIEMPRE con un objeto JSON válido. No incluyas texto fuera del JSON, no uses bloques de código markdown, solo el JSON puro.

Cuando la respuesta sea solo texto:
{"type":"text","text":"tu respuesta aquí"}

Cuando el usuario pida una gráfica, análisis visual, comparativa o cualquier dato que se beneficie de visualización:
{"type":"chart","text":"análisis o explicación breve","chart":{"chartType":"bar","title":"Título de la gráfica","labels":["Etiqueta1","Etiqueta2"],"datasets":[{"label":"Serie","data":[10,20],"backgroundColor":"#4f8ef7"}]}}

Tipos de gráfica permitidos: "bar", "line", "pie", "doughnut".
Para "pie" y "doughnut", backgroundColor debe ser un array de colores (uno por label).
Si el usuario pide una gráfica pero no proporciona datos reales, genera datos de ejemplo ilustrativos y menciona en el campo "text" que son datos de ejemplo.`;

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 2048,
                system: systemPrompt,
                messages
            },
            {
                headers: {
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            }
        );

        const rawText = response.data.content[0].text;

        let type = 'text';
        let reply = rawText;
        let chart = undefined;

        try {
            const cleanText = rawText.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            const parsed = JSON.parse(cleanText);
            type = parsed.type === 'chart' ? 'chart' : 'text';
            reply = parsed.text || rawText;
            if (type === 'chart' && parsed.chart) {
                chart = parsed.chart;
            }
        } catch {
            // Si Claude no devolvió JSON válido, tratamos la respuesta como texto plano
        }

        const responsePayload = { ok: true, type, reply };
        if (chart) responsePayload.chart = chart;

        return res.json(responsePayload);

    } catch (error) {
        if (error.response) {
            const apiError = new Error(error.response.data?.error?.message || 'Error en la API de Claude');
            apiError.status = error.response.status;
            return manejadorErrores(res, apiError);
        }
        manejadorErrores(res, error);
    }
}

controlador.botChatWithPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ ok: false, error: 'No se recibió ningún archivo PDF.' });
        }

        let messages = [];
        try {
            messages = JSON.parse(req.body.messages || '[]');
        } catch {
            return res.status(400).json({ ok: false, error: 'El campo messages no es JSON válido.' });
        }

        const userText = req.body.userText || '';

        let pdfText = '';
        try {
            const { default: pdfParse } = await import('pdf-parse');
            const pdfData = await pdfParse(req.file.buffer);
            pdfText = pdfData.text?.trim() || '';
            console.log(`[botChatWithPdf] PDF recibido: ${req.file.originalname} | buffer: ${req.file.buffer.length} bytes | texto: ${pdfText.length} chars`);
        } catch (parseErr) {
            console.error('[botChatWithPdf] pdf-parse error:', parseErr.message);
            return res.status(422).json({ ok: false, error: `No se pudo leer el PDF: ${parseErr.message}` });
        }

        if (!pdfText) {
            console.warn('[botChatWithPdf] pdf-parse no extrajo texto del PDF.');
            return res.status(422).json({ ok: false, error: 'El PDF no contiene texto extraíble. Asegúrate de que no sea un PDF escaneado.' });
        }

        const maxChars = 12000;
        const pdfContent = pdfText.length > maxChars
            ? pdfText.substring(0, maxChars) + '\n\n[... contenido recortado por longitud ...]'
            : pdfText;

        const enrichedContent = `El usuario ha adjuntado un PDF con el siguiente contenido:\n\n---\n${pdfContent}\n---\n\n${userText ? `Pregunta del usuario: ${userText}` : 'Por favor analiza el contenido del PDF anterior.'}`;

        const messagesWithPdf = [...messages];
        if (messagesWithPdf.length > 0 && messagesWithPdf[messagesWithPdf.length - 1].role === 'user') {
            messagesWithPdf[messagesWithPdf.length - 1] = { role: 'user', content: enrichedContent };
        } else {
            messagesWithPdf.push({ role: 'user', content: enrichedContent });
        }

        const systemPrompt = `Eres un asistente virtual especializado exclusivamente en reportes empresariales.
Solo puedes responder preguntas relacionadas con: reportes de producción, reportes de calidad, reportes de inventario, indicadores operativos, métricas de planta, análisis de datos industriales y temas directamente vinculados a la operación y reportería de la empresa.
Si el usuario pregunta sobre cualquier otro tema que no esté relacionado con reportes empresariales, debes responder amablemente que solo puedes ayudar con consultas sobre reportes de la empresa y redirigir la conversación hacia ese ámbito.
Responde siempre en español, de forma clara y concisa.

FORMATO DE RESPUESTA OBLIGATORIO:
Debes responder SIEMPRE con un objeto JSON válido. No incluyas texto fuera del JSON, no uses bloques de código markdown, solo el JSON puro.

Cuando la respuesta sea solo texto:
{"type":"text","text":"tu respuesta aquí"}

Cuando el usuario pida una gráfica, análisis visual, comparativa o cualquier dato que se beneficie de visualización:
{"type":"chart","text":"análisis o explicación breve","chart":{"chartType":"bar","title":"Título de la gráfica","labels":["Etiqueta1","Etiqueta2"],"datasets":[{"label":"Serie","data":[10,20],"backgroundColor":"#4f8ef7"}]}}

Tipos de gráfica permitidos: "bar", "line", "pie", "doughnut".
Para "pie" y "doughnut", backgroundColor debe ser un array de colores (uno por label).
Si el usuario pide una gráfica pero no proporciona datos reales, genera datos de ejemplo ilustrativos y menciona en el campo "text" que son datos de ejemplo.`;

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            { model: 'claude-haiku-4-5-20251001', max_tokens: 2048, system: systemPrompt, messages: messagesWithPdf },
            { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' } }
        );

        const rawText = response.data.content[0].text;
        let type = 'text', reply = rawText, chart = undefined;

        try {
            const cleanText = rawText.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            const parsed = JSON.parse(cleanText);
            type = parsed.type === 'chart' ? 'chart' : 'text';
            reply = parsed.text || rawText;
            if (type === 'chart' && parsed.chart) chart = parsed.chart;
        } catch { /* texto plano */ }

        const responsePayload = { ok: true, type, reply };
        if (chart) responsePayload.chart = chart;
        return res.json(responsePayload);

    } catch (error) {
        if (error.response) {
            const apiError = new Error(error.response.data?.error?.message || 'Error en la API de Claude');
            apiError.status = error.response.status;
            return manejadorErrores(res, apiError);
        }
        manejadorErrores(res, error);
    }
};

controlador.reportesDiarios = async (req, res) => {
    try {
        res.render('bots/reportesDiarios.ejs', { csrfToken: req.csrfToken() })
    } catch (error) {
        manejadorErrores(res, error);
    }
}

controlador.reportesFiltrados = async (req, res) => {
    try {
        console.log('Reportes filtrados por supervisor iniciando...');

        // 1. Validar que exista el usuario en la request (usamos ? por seguridad)
        let usuarioCodigo = req.usuario?.codigoempleado;

        if (!usuarioCodigo) {
            return res.status(401).json({
                ok: false,
                error: 'No se detectó la sesión del usuario.'
            });
        }

        // --- INICIO DE TU LÓGICA DE USUARIO ---
        let clase = new sequelizeClase({
            modelo: modelosGenerales.modelonom10001
        })
        let datosUsuario = await clase.obtener1Registro({
            criterio: { codigoempleado: usuarioCodigo }
        })

        // obtener puesto
        let clasePuesto = new sequelizeClase({
            modelo: informacionpuesto
        })
        let puesto = await clasePuesto.obtener1Registro({
            criterio: { idpuesto: datosUsuario.idpuesto }
        })

        // obtener departamento
        let claseDepartamento = new sequelizeClase({
            modelo: Informaciondepartamento
        })
        let departamento = await claseDepartamento.obtener1Registro({
            criterio: { iddepartamento: datosUsuario.iddepartamento }
        })

        datosUsuario.puesto = puesto ? puesto.descripcion : ''
        datosUsuario.departamento = departamento ? departamento.descripcion : ''

        // ESTA ES LA VARIABLE CLAVE: El nombre real del supervisor
        const nombreUsuario = datosUsuario.nombrelargo;

        console.log('Usuario:', nombreUsuario, 'Puesto:', datosUsuario.puesto, 'Departamento:', datosUsuario.departamento);
        // --- FIN DE TU LÓGICA DE USUARIO ---


        // --- INICIO DE LÓGICA DE REPORTES ---
        // Limpiamos el nombre por seguridad
        const nombreFiltro = nombreUsuario.trim();

        console.log(`Ejecutando Raw SQL para el supervisor: ${nombreFiltro}`);

        const querySQL = `
            SELECT 
                r.id AS reporte_id,
                r.nombre_inspector,
                r.turno,
                r.created_at,
                c.id AS cotizacion_id,
                c.planta,
                c.cliente,
                c.numero_parte,
                c.nombre_supervisor
            FROM reportes r
            INNER JOIN cotizaciones c ON r.cotizacion_id = c.id
            WHERE c.nombre_supervisor LIKE :supervisorFiltro
            ORDER BY r.created_at DESC;
        `;

        const reportesDelSupervisor = await dbReportes.query(querySQL, {
            // El % antes y después hace la función de comodín para ignorar espacios extra
            replacements: { supervisorFiltro: `%${nombreFiltro}%` },
            type: QueryTypes.SELECT
        });

        // --- RESPUESTA ---
        return res.json({
            ok: true,
            usuarioInfo: {
                nombre: nombreUsuario,
                puesto: datosUsuario.puesto,
                departamento: datosUsuario.departamento
            },
            totalReportes: reportesDelSupervisor.length,
            reportes: reportesDelSupervisor
        });

    } catch (error) {
        console.error('[reportesFiltrados] Error:', error);
        manejadorErrores(res, error);
    }
}


controlador.reportesFiltradosPorParametros = async (req, res) => {
    try {
        // Validar sesión del usuario
        let usuarioCodigo = req.usuario?.codigoempleado;
        if (!usuarioCodigo) {
            return res.status(401).json({ ok: false, error: 'No se detectó la sesión del usuario.' });
        }

        // Leer y validar query params opcionales
        const { fecha, numeroParte } = req.query;

        if (fecha !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({ ok: false, error: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
        }

        // Obtener datos del usuario logueado
        let clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 });
        let datosUsuario = await clase.obtener1Registro({ criterio: { codigoempleado: usuarioCodigo } });

        let clasePuesto = new sequelizeClase({ modelo: informacionpuesto });
        let puesto = await clasePuesto.obtener1Registro({ criterio: { idpuesto: datosUsuario.idpuesto } });

        let claseDepartamento = new sequelizeClase({ modelo: Informaciondepartamento });
        let departamento = await claseDepartamento.obtener1Registro({ criterio: { iddepartamento: datosUsuario.iddepartamento } });

        datosUsuario.puesto = puesto ? puesto.descripcion : '';
        datosUsuario.departamento = departamento ? departamento.descripcion : '';

        const nombreUsuario = datosUsuario.nombrelargo;
        const nombreFiltro = nombreUsuario.trim();

        // Construir query dinámica
        let whereClause = 'WHERE c.nombre_supervisor LIKE :supervisorFiltro';
        const replacements = { supervisorFiltro: `%${nombreFiltro}%` };

        if (fecha) {
            whereClause += ' AND DATE(r.created_at) = :fecha';
            replacements.fecha = fecha;
        }

        if (numeroParte) {
            whereClause += ' AND c.numero_parte = :numeroParte';
            replacements.numeroParte = numeroParte;
        }

        const querySQL = 'SELECT r.id AS reporte_id, r.nombre_inspector, r.turno, r.created_at, ' +
            'c.id AS cotizacion_id, c.planta, c.cliente, c.numero_parte, c.nombre_supervisor ' +
            'FROM reportes r ' +
            'INNER JOIN cotizaciones c ON r.cotizacion_id = c.id ' +
            whereClause + ' ' +
            'ORDER BY r.created_at DESC';

        const reportes = await dbReportes.query(querySQL, {
            replacements,
            type: QueryTypes.SELECT
        });

        return res.json({
            ok: true,
            usuarioInfo: {
                nombre: nombreUsuario,
                puesto: datosUsuario.puesto,
                departamento: datosUsuario.departamento
            },
            filtrosAplicados: {
                fecha: fecha || null,
                numeroParte: numeroParte || null
            },
            totalReportes: reportes.length,
            reportes
        });

    } catch (error) {
        console.error('[reportesFiltradosPorParametros] Error:', error);
        manejadorErrores(res, error);
    }
}


export default controlador