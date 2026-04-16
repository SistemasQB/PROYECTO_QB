import axios from 'axios';
import multer from 'multer';
import manejadorErrores from '../middleware/manejadorErrores.js';

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

import sequelizeClase from '../public/clases/sequelize_clase.js';
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


export default controlador