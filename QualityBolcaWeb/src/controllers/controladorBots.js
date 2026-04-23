
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

[SECCIÓN 1 - CONTROL PARA EL CLIENTE]
Campos requeridos (solicitar si faltan):
- planta: Planta donde se realizó el trabajo
- cliente: Cliente al que se le cobra el servicio
- turno: "Primero", "Segundo" o "Tercero"
- numeroParte: Número de parte analizada (dato del empaque)
- nombreParte: Nombre de la parte (dato del empaque)
- elaboro: Nombre de quien elabora el reporte
- observaciones: (OPCIONAL, puede omitirse)
Campos automáticos — NUNCA solicitar al usuario: fechaInspeccion, numeroReporte

[SECCIÓN 2 - TIPO DE SERVICIO]
- tipoServicio: "Selección" o "Retrabajo"
- tipoConteo: "Lote", "Número de serie", "Rollo", "Fecha de producción", "Fecha de arribo" o "RAN"

[SECCIÓN 3 - ITEMS DEL REPORTE]
Cada reporte corresponde a un único número de parte. El reporte tiene N items (uno por cada lote/serie/RAN/etc. revisado).

Por cada item:
- identificador: Valor del lote/serie/RAN/fecha según tipoConteo
- totalPiezas: Total de piezas inspeccionadas
- piezasOK: Piezas conformes
- piezasNG: Piezas no conformes
- piezasRecuperadas: Piezas recuperadas con retrabajo
- piezasScrap: Piezas NG no recuperables
- incidentes: Lista de defectos. Cada incidente: { descripcion, cantidad }
- muestra: Número de piezas revisadas al azar (control de liberación)
- resultado: "Aprobado" o "Rechazado"
Campo automático por item — NUNCA solicitar: libero (siempre queda vacío "")

REGLAS DE VALIDACIÓN MATEMÁTICA:
Para todos los tipos de servicio:
  1. totalPiezas = piezasOK + piezasNG
  2. suma(incidentes[i].cantidad) = piezasNG

Según tipoServicio:
  - "Selección": piezasRecuperadas = 0 y piezasScrap = piezasNG
  - "Retrabajo": piezasRecuperadas + piezasScrap = piezasNG

REGLAS DE FORMATO DE DATOS:
- Todos los conteos (totalPiezas, piezasOK, piezasNG, piezasRecuperadas, piezasScrap, muestra e incidentes[].cantidad) DEBEN ser números enteros. NUNCA texto ni palabras: usa 5, no "cinco"; 100, no "cien"; 0, no "cero".
- Los identificadores de lote/serie/RAN/rollo se capturan como cadena alfanumérica tal como los dicta el usuario.
- turno SIEMPRE debe ser exactamente "Primero", "Segundo" o "Tercero".

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
• Leer datos desde un **PDF** adjunto
• Recibir información por **voz** (dictado)

---
PREGUNTA: ¿Cómo lleno un reporte? / ¿Cómo funciona el reporte?
RESPUESTA (campo "text"):
## Paso 1 — Datos del cliente
• **Planta** donde se realizó el trabajo
• **Cliente** al que se cobra el servicio
• **Turno**: Primero, Segundo o Tercero
• **Número y nombre de parte** (dato del empaque)
• **Nombre de quien elabora** el reporte

## Paso 2 — Tipo de servicio
• **Tipo de servicio**: Selección, Retrabajo o Selección y Retrabajo
• **Tipo de conteo**: Lote, Número de serie, RAN, Rollo, Fecha de producción o Fecha de arribo

## Paso 3 — Datos de inspección
Por cada lote o serie revisada:
• **Total de piezas**, **piezas OK**, **piezas NG**
• **Defectos** encontrados con su cantidad
• **Muestra** revisada y **resultado**: Aprobado o Rechazado

Puedes dictarme los datos por voz o adjuntar un PDF.

---
PREGUNTA: ¿Qué datos necesito? / ¿Qué información necesitas?
RESPUESTA (campo "text"):
## Datos obligatorios
• **Planta**, **cliente** y **turno**
• **Número y nombre de parte**
• **Nombre de quien elabora** el reporte
• **Tipo de servicio** y **tipo de conteo**

## Por cada lote inspeccionado
• **Total de piezas** = OK + NG
• **Defectos** (descripción y cantidad) — la suma debe igualar las piezas NG
• **Muestra** revisada y **resultado**

## Opcional
• **Observaciones** generales del turno

---
PREGUNTA: ¿Qué es el tipo de conteo? / ¿Qué opciones de conteo hay?
RESPUESTA (campo "text"):
## Tipo de conteo
Define cómo se identifican los lotes o unidades inspeccionadas:

• **Lote** — número de lote asignado por el cliente
• **Número de serie** — identificador único por pieza o caja
• **RAN** — número de autorización de devolución
• **Rollo** — identificador de rollo para materiales en bobina
• **Fecha de producción** — fecha en que se fabricó el material
• **Fecha de arribo** — fecha en que llegó el material a la planta

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
PREGUNTA: ¿Puedo usar voz o PDF? / ¿Cómo dicto? / ¿Cómo subo un PDF?
RESPUESTA (campo "text"):
## Por voz
Presiona el ícono del **micrófono** y dicta los datos con claridad y a velocidad moderada. El texto se transcribirá automáticamente.

## Por PDF
Presiona el ícono del **clip** para adjuntar un archivo PDF de hasta **5 MB**. Extraeré el contenido automáticamente.

**Nota:** Solo PDFs con texto digital. Los PDFs escaneados (solo imagen) no son compatibles.

---
FLUJO DE TRABAJO:
1. Si la pregunta coincide con alguna de las preguntas frecuentes anteriores, responde con el texto fijo correspondiente usando type "text".
2. Si el usuario proporciona datos del reporte, extrae todos los campos posibles.
3. Si el input viene de voz puede haber errores de transcripción; infiere el dato cuando sea razonable y señala cualquier ambigüedad.
4. Verifica campos requeridos y aplica validaciones matemáticas por cada item.
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
{"type":"missing","text":"Descripción clara de lo que falta o no cuadra. Recuerda al usuario que puede dictar los datos faltantes hablando con claridad y a velocidad moderada.","missingFields":["Nombre del campo 1","Nombre del campo 2"]}

Cuando el reporte esté completo y todas las validaciones pasen:
{"type":"report","text":"Confirmación breve del reporte validado.","report":{"planta":"","cliente":"","turno":"","elaboro":"","observaciones":"","tipoServicio":"","tipoConteo":"","numeroParte":"","nombreParte":"","items":[{"identificador":"","totalPiezas":0,"piezasOK":0,"piezasNG":0,"piezasRecuperadas":0,"piezasScrap":0,"incidentes":[{"descripcion":"","cantidad":0}],"muestra":0,"resultado":"","libero":""}]}}`;

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