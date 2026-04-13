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