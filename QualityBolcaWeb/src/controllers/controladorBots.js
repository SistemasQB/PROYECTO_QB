import axios from 'axios';
import multer from 'multer';
import { Op } from 'sequelize';
import manejadorErrores from '../middleware/manejadorErrores.js';
import { Reporte, Cotizacion, ReporteBody } from '../models/capturacion/barril_modelo_capturacion.js';
import modeloVistaEmpleados from '../models/generales/vistaEmpleados.js';
import { where } from 'sequelize';
import sequelizeClase from "../public/clases/sequelize_clase.js";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";
import nom10006 from '../models/generales/nom10006.js';
import Informaciondepartamento from '../models/generales/nom10003.js';
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

const SYSTEM_PROMPT_REPORTES = `Eres el Asistente de Reportes de Quality Bolca, una empresa sorteadora de calidad que envía inspectores a plantas de clientes para verificar la calidad de sus productos fabricados. Tu única función es ayudar a capturar, validar y estructurar los datos necesarios para generar reportes de inspección diarios.

Si alguien te pregunta sobre cualquier otro tema ajeno al llenado de reportes, recházalo amablemente y explícale que eres el asistente de reportes de Quality Bolca, especializado exclusivamente en la captura y validación de reportes de inspección de calidad.

CONTEXTO:
Los servicios que ofrece Quality Bolca son: Selección o Retrabajo. El servicio de Retrabajo incluye tanto selección como retrabajo de las piezas.

ESTRUCTURA DEL REPORTE:

[SECCIÓN 1 - DATOS DE CABECERA]
Estos campos se capturan por la interfaz antes del dictado — NO los solicites al inspector ni los incluyas en "missing":
- planta, cliente, turno, numeroParte, nombreParte, tipoServicio
Campos automáticos del sistema — NUNCA solicitar: fechaInspeccion, numeroReporte, elaboro

[SECCIÓN 2 - ÍTEMS DEL REPORTE]
Cada reporte corresponde a un único número de parte. El reporte tiene N ítems (uno por cada conjunto de piezas inspeccionadas).

ESTRUCTURA FIJA DEL DICTADO POR ÍTEM (el inspector siempre sigue este orden):
  1. IDENTIFICADORES — Primero en el dictado. Siempre hay al menos uno. Pueden ser varios consecutivos.
     El inspector dice el tipo y luego el valor. TODO lo que diga antes de las cantidades de piezas son identificadores.
     Tipos válidos:
       "Lote [valor]"                    → identificadores.lote
       "Número de serie [valor]"         → identificadores.serie
       "Serie [valor]"                   → identificadores.serie
       "RAN [valor]"                     → identificadores.ran
       "Fecha de producción [valor]"     → identificadores.fechaProduccion
       "Fecha de arribo [valor]"         → identificadores.fechaArribo
     Ejemplo con varios: "Lote J42, Serie 1234" → { "lote": "J42", "serie": "1234" }
     NUNCA preguntes si algo es o no un identificador — si el inspector lo dijo antes de las piezas, es un identificador.

  2. TOTAL DE PIEZAS — El inspector dice algo como "total [N]", "total de piezas [N]", "[N] piezas total".

  3. PIEZAS NG — El inspector dice "[N] NG", "NG [N]", "[N] piezas malas", "[N] piezas no conformes".

  4. PIEZAS RECUPERADAS / SCRAP (orden variable, según aplique):
     "[N] recuperadas", "[N] se recuperaron", "[N] al scrap", "scrap [N]", etc.

  5. INCIDENCIAS — El inspector dice: "Incidencias, [N] piezas por [defecto], [M] por [defecto]..."
     o variantes como "Incidencias, [N] [defecto], [M] [defecto]..."
     Cada defecto → un objeto { descripcion: "[defecto]", cantidad: N }

CÁLCULOS AUTOMÁTICOS (no los pide el inspector — los calculas tú):
  - piezasOK = totalPiezas - piezasNG  (SIEMPRE calculado, no se dicta)
  - Selección: piezasScrap = piezasNG, piezasRecuperadas = 0 (SIEMPRE calculados)
  - Retrabajo: si el inspector solo menciona uno de los dos (recuperadas O scrap), calcula el otro como piezasNG - el mencionado

QUÉ DEBE DECIR EXPLÍCITAMENTE EL INSPECTOR (lo demás se calcula):
  ✔ Al menos un identificador
  ✔ totalPiezas
  ✔ piezasNG
  ✔ En Retrabajo: al menos una de (piezasRecuperadas, piezasScrap)
  ✔ Las incidencias si las hay (descripción + cantidad cada una)

  ✘ piezasOK — nunca la pide (se calcula)
  ✘ piezasScrap en Selección — nunca la pide (siempre = piezasNG)
  ✘ piezasRecuperadas en Selección — nunca la pide (siempre = 0)

VALIDACIONES (devuelve type "missing" si):
  - No hay ningún identificador
  - Falta totalPiezas
  - Falta piezasNG
  - En Retrabajo: no se mencionó ninguna de recuperadas/scrap
  - La suma de incidentes ≠ piezasNG cuando se dictaron incidencias (indica el error con los valores exactos)
  - En Retrabajo: recuperadas + scrap ≠ piezasNG (indica el error con los tres valores)

REGLAS DE FORMATO DE DATOS:
  - Todos los conteos son números enteros. Nunca texto: usa 5, no "cinco"; 0, no "cero".
  - Identificadores: cadena alfanumérica tal como la dicta el inspector.
  - Solo incluye en "identificadores" los tipos mencionados; omite los demás.

PREGUNTAS FRECUENTES — RESPUESTAS FIJAS:
Cuando el usuario haga alguna de las siguientes preguntas, usa SIEMPRE el texto exacto indicado dentro del campo "text". No improvises ni modifiques el contenido.

---
PREGUNTA: ¿Qué eres? / ¿Qué puedes hacer? / ¿Cómo funciona?
RESPUESTA (campo "text"):
## ¿Qué soy?
Soy el **Asistente de Reportes** de Quality Bolca. Mi función es ayudarte a capturar, validar y estructurar reportes de inspección de calidad.

## ¿Qué puedo hacer?
• Guiarte en el llenado del reporte paso a paso
• Validar automáticamente que los números cuadren
• Recibir información por **voz** (dictado)

---
PREGUNTA: ¿Cómo lleno un reporte? / ¿Cómo funciona el reporte?
RESPUESTA (campo "text"):
## Paso 1 — Datos de cabecera
• **Planta**, **cliente**, **turno**
• **Número y nombre de parte** (dato del empaque)
• **Tipo de servicio**: Selección o Retrabajo

## Paso 2 — Dictado de ítems
Por cada ítem, dicta en este orden:
1. **Identificadores**: di el tipo y el valor — "Lote J42", "Serie 1234", "RAN 001". Pueden ser varios.
2. **Total de piezas** inspeccionadas
3. **Piezas NG**
4. **Piezas recuperadas y/o scrap** (solo Retrabajo)
5. **Incidencias**: "Incidencias, 15 piezas por rayadura, 5 por pulido"
Las piezas OK se calculan automáticamente.

---
PREGUNTA: ¿Qué datos necesito? / ¿Qué información necesitas?
RESPUESTA (campo "text"):
## Datos de cabecera (se capturan antes del dictado)
• **Planta**, **cliente** y **turno**
• **Número y nombre de parte**
• **Tipo de servicio**: Selección o Retrabajo

## Por cada ítem (orden de dictado)
1. **Identificadores** (uno o varios): "Lote J42", "Serie 1234", "RAN 001", "Fecha de producción 15 enero"
2. **Total de piezas** inspeccionadas
3. **Piezas NG**
4. **Recuperadas / Scrap** (solo Retrabajo, en cualquier orden)
5. **Incidencias**: "Incidencias, 15 piezas por rayadura, 5 por pulido"
Las piezas OK se calculan solas — no es necesario decirlas.

---
PREGUNTA: Selección vs Retrabajo / ¿Cuál es la diferencia entre Selección y Retrabajo?
RESPUESTA (campo "text"):
## Selección
Se revisan las piezas para separarlas en **OK** y **NG**. Las piezas NG se descartan completamente como **Scrap** — no se intervienen.

## Retrabajo
Incluye la selección **y** la intervención física de las piezas NG para corregir el defecto. Las piezas NG se dividen en:
• **Recuperadas** — reparadas y liberadas como OK
• **Scrap** — piezas que no pudieron recuperarse

---
FLUJO DE TRABAJO:
1. Si la pregunta coincide con alguna de las preguntas frecuentes anteriores, responde con el texto fijo correspondiente usando type "text".
2. Si el usuario proporciona datos de un ítem, extrae todos los campos posibles.
3. Si el input viene de voz puede haber errores de transcripción; infiere el dato cuando sea razonable y señala cualquier ambigüedad.
4. Verifica que haya al menos un identificador y aplica validaciones matemáticas.
5. Responde:
   - Tema ajeno al reporte: usa type "text" para rechazar amablemente y explicar tu función.
   - Si falta información o hay errores matemáticos: usa type "missing".
   - Si todo está completo y validado: usa type "report".

FORMATO DE RESPUESTA OBLIGATORIO:
NUNCA incluyas texto fuera del JSON. Solo JSON puro y válido.

Para rechazos o aclaraciones generales (type "text"):
El campo "text" puede contener formato ligero usando estas convenciones — úsalas con moderación, solo cuando la estructura aporte claridad real:
  - ## Título de sección  →  encabezado de sección
  - **término**           →  énfasis en palabras clave
  - • elemento           →  ítem de lista (usa • literal, no guion)
Nunca abuses del formato. Mantén el tono formal y profesional de Quality Bolca.

{"type":"text","text":"tu respuesta aquí"}

Cuando falte información o haya errores matemáticos:
{"type":"missing","text":"Descripción clara de lo que falta o no cuadra.","missingFields":["Nombre del campo 1","Nombre del campo 2"]}

Cuando el ítem esté completo y todas las validaciones pasen:
{"type":"report","text":"Confirmación breve del ítem validado.","report":{"items":[{"identificadores":{"lote":"J42","serie":"1234"},"totalPiezas":500,"piezasOK":480,"piezasNG":20,"piezasRecuperadas":5,"piezasScrap":15,"incidentes":[{"descripcion":"rayones profundos","cantidad":15},{"descripcion":"pulido","cantidad":5}],"muestra":0,"resultado":"","libero":""}]}}
NOTAS CRÍTICAS:
- En "identificadores" incluye ÚNICAMENTE los tipos que el inspector mencionó — no agregues campos vacíos.
- muestra siempre 0, resultado siempre "", libero siempre "".
- No solicites ni incluyas planta, cliente, turno, numeroParte, nombreParte, tipoServicio, elaboro — esos vienen de la cabecera.`;
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

        const systemPrompt = SYSTEM_PROMPT_REPORTES;

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
        let missingFields, report;

        try {
            const cleanText = rawText.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            const parsed = JSON.parse(cleanText);
            type = ['missing', 'report'].includes(parsed.type) ? parsed.type : 'text';
            reply = parsed.text || rawText;
            if (type === 'missing' && parsed.missingFields) missingFields = parsed.missingFields;
            if (type === 'report' && parsed.report) report = parsed.report;
        } catch {
            // Si Claude no devolvió JSON válido, tratamos la respuesta como texto plano
        }

        const responsePayload = { ok: true, type, reply };
        if (missingFields) responsePayload.missingFields = missingFields;
        if (report) responsePayload.report = report;

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

        const systemPrompt = SYSTEM_PROMPT_REPORTES;

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            { model: 'claude-haiku-4-5-20251001', max_tokens: 2048, system: systemPrompt, messages: messagesWithPdf },
            { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' } }
        );

        const rawText = response.data.content[0].text;
        let type = 'text', reply = rawText, missingFields, report;

        try {
            const cleanText = rawText.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            const parsed = JSON.parse(cleanText);
            type = ['missing', 'report'].includes(parsed.type) ? parsed.type : 'text';
            reply = parsed.text || rawText;
            if (type === 'missing' && parsed.missingFields) missingFields = parsed.missingFields;
            if (type === 'report' && parsed.report) report = parsed.report;
        } catch { /* texto plano */ }

        const responsePayload = { ok: true, type, reply };
        if (missingFields) responsePayload.missingFields = missingFields;
        if (report) responsePayload.report = report;
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
            modelo: nom10006
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

        let clasePuesto = new sequelizeClase({ modelo: nom10006 });
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

const SYSTEM_PROMPT_NORMALIZE =
    'Eres un normalizador de texto para formularios industriales de calidad. ' +
    'El texto fue capturado por reconocimiento de voz y puede contener palabras en lugar de símbolos o dígitos. ' +
    'Convierte el texto al formato correcto del campo. ' +
    'Responde ÚNICAMENTE con el valor normalizado: sin explicaciones, sin comillas, sin puntuación extra.';

controlador.normalizarCampo = async (req, res) => {
    try {
        const { transcript, hint } = req.body;

        if (!transcript || !hint) {
            return res.status(400).json({ ok: false, error: 'transcript y hint son requeridos.' });
        }

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 64,
                system: SYSTEM_PROMPT_NORMALIZE,
                messages: [{ role: 'user', content: `${hint}\n\nTexto capturado por voz: "${transcript}"` }]
            },
            {
                headers: {
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            }
        );

        const normalized = response.data.content[0].text.trim();
        return res.json({ ok: true, normalized });

    } catch (error) {
        if (error.response) {
            return res.status(500).json({ ok: false, error: 'Error al normalizar el campo.' });
        }
        manejadorErrores(res, error);
    }
};

controlador.reportesSupervisores = async (req, res) => {
    try {
        res.render('bots/supervisor_reportes.ejs', { csrfToken: req.csrfToken() })
    } catch (error) {
        manejadorErrores(res, error);
    }
}

controlador.firmarReporte = async (req, res) => { //realiza la firma de un reporte, actualiza el campo firma en items y cambia el estatus del reporte a signed
    try {
        let usuarioCodigo = req.usuario?.codigoempleado;
        if (!usuarioCodigo) {
            return res.status(401).json({
                ok: false,
                error: 'No se detectó la sesión del usuario.'
            });
        }

        const { bodyId } = req.body;
        if (!bodyId) {
            return res.status(400).json({
                ok: false,
                error: 'Se requiere el ID del reporte body (bodyId).'
            });
        }

        let clase = new sequelizeClase({
            modelo: modelosGenerales.modelonom10001
        });

        let datosUsuario = await clase.obtener1Registro({
            criterio: { codigoempleado: usuarioCodigo }
        });

        if (!datosUsuario) {
            return res.status(404).json({
                ok: false,
                error: 'No se encontraron los datos del supervisor.'
            });
        }

        const nombreSupervisor = datosUsuario.nombrelargo.trim();

        const bodyDelReporte = await ReporteBody.findByPk(bodyId);

        if (!bodyDelReporte) {
            return res.status(404).json({
                ok: false,
                error: 'No se encontró el contenido (body) de este reporte para firmar.'
            });
        }

        // Actualizar las columnas reales del reporte_body (no el JSON items)
        bodyDelReporte.status = 'signed';
        bodyDelReporte.firma = nombreSupervisor.toUpperCase();
        bodyDelReporte.fecha_firma = new Date();
        await bodyDelReporte.save();

        const totalBodiesFirmados = 1;

        const reporteCabecera = await Reporte.findByPk(bodyDelReporte.reporte_id);

        if (reporteCabecera) {
            reporteCabecera.status = 'signed';
            await reporteCabecera.save();
        }

        return res.json({
            ok: true,
            mensaje: 'Reporte firmado y actualizado exitosamente',
            firmaAplicada: nombreSupervisor,
            nuevoEstatus: 'signed',
            totalBodiesFirmados
        });

    } catch (error) {
        console.error('[firmarReporte] Error:', error);
        manejadorErrores(res, error);
    }
};

controlador.publicarReporte = async (req, res) => {
    try {
        let usuarioCodigo = req.usuario?.codigoempleado;
        if (!usuarioCodigo) {
            return res.status(401).json({ ok: false, error: 'No se detectó la sesión del usuario.' });
        }

        // Obtener bodyId y reporteId del body del request
        const { bodyId, reporteId } = req.body;
        if (!bodyId) {
            return res.status(400).json({ ok: false, error: 'Se requiere el ID del body del reporte (bodyId).' });
        }

        // Cargar el ReporteBody para validar y actualizar columnas reales
        const bodyDelReporte = await ReporteBody.findByPk(bodyId);
        if (!bodyDelReporte) {
            return res.status(404).json({ ok: false, error: 'No se encontró el contenido (body) del reporte.' });
        }

        // Validar que el body está firmado antes de publicar
        if (bodyDelReporte.status !== 'signed') {
            return res.status(400).json({
                ok: false,
                error: 'El reporte debe estar firmado antes de publicar.'
            });
        }

        // Actualizar la columna real del reporte_body (no el JSON items)
        bodyDelReporte.status = 'published';
        await bodyDelReporte.save();

        // Determinar el reporte_id: se prefiere el que viene en el body,
        // si no se envió se toma el del registro del body
        const idReporte = reporteId ?? bodyDelReporte.reporte_id;

        // Buscar la cabecera del reporte en la base de datos
        const reporteCabecera = await Reporte.findByPk(idReporte);
        if (!reporteCabecera) {
            return res.status(404).json({ ok: false, error: 'No se encontró el reporte.' });
        }

        if (reporteCabecera.status === 'published') {
            return res.json({
                ok: true,
                mensaje: 'El reporte ya se encontraba publicado.',
                nuevoEstatus: 'published'
            });
        }

        reporteCabecera.status = 'published';
        await reporteCabecera.save();

        return res.json({
            ok: true,
            mensaje: 'Reporte publicado exitosamente',
            nuevoEstatus: 'published',
            reporteId: reporteCabecera.id
        });

    } catch (error) {
        manejadorErrores(res, error);
    }
}


// ─── Helpers internos ────────────────────────────────────────────────────────

/**
 * Obtiene los datos del supervisor que está logueado.
 * Retorna { datosUsuario, nombreUsuario } o lanza error si no hay sesión.
 */
async function obtenerDatosSupervisor(req, res) {
    const usuarioCodigo = req.usuario?.codigoempleado;
    if (!usuarioCodigo) {
        res.status(401).json({ ok: false, error: 'No se detectó la sesión del usuario.' });
        return null;
    }

    const clase = new sequelizeClase({ modelo: modelosGenerales.modelonom10001 });
    const datosUsuario = await clase.obtener1Registro({ criterio: { codigoempleado: usuarioCodigo } });

    const clasePuesto = new sequelizeClase({ modelo: nom10006 });
    const puesto = await clasePuesto.obtener1Registro({ criterio: { idpuesto: datosUsuario.idpuesto } });

    const claseDepartamento = new sequelizeClase({ modelo: Informaciondepartamento });
    const departamento = await claseDepartamento.obtener1Registro({ criterio: { iddepartamento: datosUsuario.iddepartamento } });

    datosUsuario.puesto = puesto ? puesto.descripcion : '';
    datosUsuario.departamento = departamento ? departamento.descripcion : '';
    const nombreUsuario = datosUsuario.nombrelargo;

    return { datosUsuario, nombreUsuario };
}

// ─── P-05: Bandeja del supervisor ────────────────────────────────────────────

/**
 * Consulta central de bandeja: devuelve los reportes pendientes/firmados
 * del supervisor autenticado. Reutilizada por la vista y el endpoint JSON.
 */
async function consultaBandeja(nombreFiltro) {
    const querySQL = `
        SELECT
            r.id AS reporte_id,
            rb.id AS body_id,
            r.nombre_inspector,
            r.turno,
            r.status,
            r.created_at,
            c.id AS cotizacion_id,
            c.planta,
            c.cliente,
            c.numero_parte,
            c.nombre_parte,
            c.nombre_supervisor,
            rb.numero_items,
            rb.status AS body_status,
            rb.firma,
            rb.fecha_firma
        FROM reportes r
        INNER JOIN cotizaciones c ON r.cotizacion_id = c.id
        LEFT JOIN reporte_body rb ON r.id = rb.reporte_id
        WHERE c.nombre_supervisor LIKE :supervisorFiltro
          AND rb.status IN ('pending', 'signed')
        ORDER BY r.created_at DESC;
    `;

    return dbReportes.query(querySQL, {
        replacements: { supervisorFiltro: `%${nombreFiltro}%` },
        type: QueryTypes.SELECT
    });
}

controlador.bandejaSupervisor = async (req, res) => {
    try {
        const datos = await obtenerDatosSupervisor(req, res);
        if (!datos) return;
        const { datosUsuario, nombreUsuario } = datos;

        const reportes = await consultaBandeja(nombreUsuario.trim());

        // Agrupar por nombre_inspector en JS usando reduce
        const reportesPorInspector = reportes.reduce((acc, reporte) => {
            const inspector = reporte.nombre_inspector || 'Sin inspector';
            if (!acc[inspector]) acc[inspector] = [];
            acc[inspector].push(reporte);
            return acc;
        }, {});

        res.render('admin/supervisor/bandeja_supervisor.ejs', {
            csrfToken: req.csrfToken(),
            supervisor: {
                nombre: nombreUsuario,
                puesto: datosUsuario.puesto
            },
            reportesPorInspector,
            totalPendientes: reportes.length
        });

    } catch (error) {
        console.error('[bandejaSupervisor] Error:', error);
        manejadorErrores(res, error);
    }
};

// ─── P-05 JSON: datos de bandeja para polling ────────────────────────────────

controlador.bandejaSupervisorData = async (req, res) => {
    try {
        const datos = await obtenerDatosSupervisor(req, res);
        if (!datos) return;
        const { nombreUsuario } = datos;

        const reportes = await consultaBandeja(nombreUsuario.trim());

        const reportesPorInspector = reportes.reduce((acc, reporte) => {
            const inspector = reporte.nombre_inspector || 'Sin inspector';
            if (!acc[inspector]) acc[inspector] = [];
            acc[inspector].push(reporte);
            return acc;
        }, {});

        return res.json({
            ok: true,
            totalPendientes: reportes.length,
            reportesPorInspector
        });

    } catch (error) {
        console.error('[bandejaSupervisorData] Error:', error);
        return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
    }
};

// ─── P-06: Detalle de un reporte (para firma / edición) ──────────────────────

controlador.detalleReporte = async (req, res) => {
    try {
        const { id } = req.params;

        const datos = await obtenerDatosSupervisor(req, res);
        if (!datos) return;
        const { nombreUsuario } = datos;

        const bodyReporte = await ReporteBody.findByPk(id);
        if (!bodyReporte) {
            return res.redirect('/bots/supervisor/bandeja');
        }

        const reporte = await Reporte.findOne({ where: { id: bodyReporte.reporte_id } });
        if (!reporte) {
            return res.redirect('/bots/supervisor/bandeja')
        }
        const cotizacion = await Cotizacion.findByPk(reporte.cotizacion_id);

        let items = [];
        if (bodyReporte) {
            items = bodyReporte.items || [];
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch { items = []; }
            }
            if (!Array.isArray(items)) items = [items];
        }

        res.render('admin/supervisor/detalle_reporte', {
            csrfToken: req.csrfToken(),
            supervisor: { nombre: nombreUsuario },
            reporte,
            cotizacion,
            items,
            bodyId: bodyReporte.id,
            bodyStatus: bodyReporte.status || 'pending',
            bodyFirma: bodyReporte.firma || null,
            bodyFechaFirma: bodyReporte.fecha_firma || null
        });

    } catch (error) {
        console.error('[detalleReporte] Error:', error);
        manejadorErrores(res, error);
    }
};

// ─── P-07: Historial de reportes publicados ───────────────────────────────────

controlador.historialPublicados = async (req, res) => {
    try {
        const datos = await obtenerDatosSupervisor(req, res);
        if (!datos) return;
        const { nombreUsuario } = datos;
        const nombreFiltro = nombreUsuario.trim();

        // Leer filtros opcionales desde query params
        const { fecha, numeroParte } = req.query;

        if (fecha !== undefined && fecha !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({ ok: false, error: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
        }

        // Construir query dinámica para publicados
        let whereClause = `WHERE c.nombre_supervisor LIKE :supervisorFiltro AND rb.status = 'published'`;
        const replacements = { supervisorFiltro: `%${nombreFiltro}%` };

        if (fecha) {
            whereClause += ' AND DATE(r.created_at) = :fecha';
            replacements.fecha = fecha;
        }
        if (numeroParte) {
            whereClause += ' AND c.numero_parte = :numeroParte';
            replacements.numeroParte = numeroParte;
        }

        const querySQL = `
            SELECT
                r.id AS reporte_id,
                rb.id AS body_id,
                r.nombre_inspector,
                r.turno,
                r.status,
                r.created_at,
                c.id AS cotizacion_id,
                c.planta,
                c.cliente,
                c.numero_parte,
                c.nombre_supervisor,
                rb.numero_items,
                rb.items,
                rb.firma AS firmado_por,
                rb.fecha_firma AS fecha_firma_item
            FROM reportes r
            INNER JOIN cotizaciones c ON r.cotizacion_id = c.id
            LEFT JOIN reporte_body rb ON r.id = rb.reporte_id
            ${whereClause}
            ORDER BY r.created_at DESC;
        `;

        let reportes = await dbReportes.query(querySQL, {
            replacements,
            type: QueryTypes.SELECT
        });

        // Calcular total_piezas sumando item.total de cada item en el JSON items
        reportes = reportes.map(r => {
            const items = typeof r.items === 'string'
                ? (() => { try { return JSON.parse(r.items); } catch { return []; } })()
                : (r.items || []);
            const totalPiezas = Array.isArray(items)
                ? items.reduce((sum, item) => sum + (item.totalPiezas || item.total || 0), 0)
                : 0;
            return { ...r, total_piezas: totalPiezas };
        });

        // Obtener números de parte únicos de los reportes publicados del supervisor
        // para poblar el select dinámicamente (sin filtros de fecha/parte aplicados)
        const partesSQL = `
            SELECT DISTINCT c.numero_parte
            FROM reportes r
            INNER JOIN cotizaciones c ON r.cotizacion_id = c.id
            LEFT JOIN reporte_body rb ON r.id = rb.reporte_id
            WHERE c.nombre_supervisor LIKE :supervisorFiltro
              AND rb.status = 'published'
            ORDER BY c.numero_parte ASC;
        `;
        const partesRows = await dbReportes.query(partesSQL, {
            replacements: { supervisorFiltro: `%${nombreFiltro}%` },
            type: QueryTypes.SELECT
        });
        const numerosParteUnicos = partesRows.map(p => p.numero_parte).filter(Boolean);

        res.render('admin/supervisor/historial_publicados', {
            csrfToken: req.csrfToken(),
            supervisor: { nombre: nombreUsuario },
            reportes,
            numerosParteUnicos,
            kpis: {
                totalReportes: reportes.length,
                totalLotes: reportes.reduce((sum, r) => sum + (r.numero_items || 0), 0)
            },
            filtros: {
                fecha: fecha || '',
                numeroParte: numeroParte || ''
            }
        });

    } catch (error) {
        console.error('[historialPublicados] Error:', error);
        manejadorErrores(res, error);
    }
};

// ─── P-08: Detalle de reporte publicado (solo lectura) ───────────────────────

controlador.detallePublicado = async (req, res) => {
    try {
        const { id } = req.params;

        const datos = await obtenerDatosSupervisor(req, res);
        if (!datos) return;
        const { nombreUsuario } = datos;

        const bodyReporte = await ReporteBody.findByPk(id);

        if (!bodyReporte) {
            return res.redirect('/bots/supervisor/historial');
        }

        const reporte = await Reporte.findByPk(bodyReporte.reporte_id);

        if (!reporte || reporte.status !== 'published') {
            return res.redirect('/bots/supervisor/historial');
        }

        const cotizacion = await Cotizacion.findByPk(reporte.cotizacion_id);

        let items = bodyReporte.items || [];

        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch {
                items = [];
            }
        }

        if (!Array.isArray(items)) {
            items = [items];
        }

        res.render('admin/supervisor/detalle_publicado', {
            csrfToken: req.csrfToken(),
            supervisor: { nombre: nombreUsuario },
            reporte,
            cotizacion,
            items,
            bodyFirma: bodyReporte.firma || null,
            bodyFechaFirma: bodyReporte.fecha_firma || null
        });

    } catch (error) {
        console.error('[detallePublicado] Error:', error);
        manejadorErrores(res, error);
    }
};

export default controlador