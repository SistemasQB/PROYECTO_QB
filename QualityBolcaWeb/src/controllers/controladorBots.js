import axios from 'axios';
import manejadorErrores from '../middleware/manejadorErrores.js';

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

export default controlador