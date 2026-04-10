import Anthropic from '@anthropic-ai/sdk';

class ClaudeBot {

    constructor({ model = 'claude-sonnet-4-6' } = {}) {
        this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        this.model = model;
    }

    // ─── API PÚBLICA ──────────────────────────────────────────────────────────

    /**
     * Extrae esquemas de modelos Sequelize.
     * Acepta: modelo individual, barril { key: Modelo }, array de cualquier combinación.
     * Filtra automáticamente campos VIRTUAL (como el campo 'semana' en tickets.js).
     * @param {Function|Object|Array} modelos
     * @returns {Array<{ tabla: string, base: string, columnas: Array }>}
     */
    extraerEsquemas(modelos) {
        const listaModelos = this.#normalizarModelos(modelos);
        const esquemas = [];

        for (const modelo of listaModelos) {
            try {
                const tabla = this.#obtenerNombreTabla(modelo);
                const base  = modelo.sequelize?.config?.database ?? 'desconocida';

                const columnas = Object.entries(modelo.rawAttributes)
                    .filter(([, attr]) => attr.type?.key !== 'VIRTUAL')
                    .map(([campo, attr]) => {
                        const col = {
                            nombre:        attr.field ?? campo,
                            alias:         campo,
                            tipo:          this.#obtenerTipo(attr),
                            primaryKey:    attr.primaryKey    === true,
                            autoIncrement: attr.autoIncrement === true,
                            allowNull:     attr.allowNull     !== false,
                        };
                        if (attr.comment) col.descripcion = attr.comment;
                        if (attr.defaultValue != null && typeof attr.defaultValue !== 'object')
                            col.default = String(attr.defaultValue);
                        return col;
                    });

                esquemas.push({ tabla, base, columnas });
            } catch (err) {
                console.warn(`[ClaudeBot] No se pudo procesar un modelo: ${err.message}`);
            }
        }

        return esquemas;
    }

    /**
     * Clasifica el tema de un mensaje dentro de un catálogo de temas definido por el usuario.
     * Es el único método que requiere datos manuales ya que los temas no se derivan de los modelos.
     * @param {string} mensaje
     * @param {Array<{ nombre: string, descripcion: string }>} temas
     * @returns {{ tema: string, confianza: 'alta'|'media'|'baja', razon: string } | null}
     */
    async determinarTema(mensaje, temas = []) {
        try {
            if (!temas.length) throw new Error('Se requiere al menos un tema en el catálogo.');

            const temasFormateados = temas.map(t => `- ${t.nombre}: ${t.descripcion}`).join('\n');

            const res = await this.client.messages.create({
                model:      this.model,
                max_tokens: 300,
                tools: [{
                    name: 'clasificar_tema',
                    description: 'Clasifica el tema del mensaje',
                    input_schema: {
                        type: 'object',
                        properties: {
                            tema:      { type: 'string', description: 'Nombre exacto del tema del catálogo' },
                            confianza: { type: 'string', enum: ['alta', 'media', 'baja'] },
                            razon:     { type: 'string', description: 'Por qué se clasificó así' }
                        },
                        required: ['tema', 'confianza', 'razon']
                    }
                }],
                tool_choice: { type: 'tool', name: 'clasificar_tema' },
                messages: [{
                    role: 'user',
                    content: `Determina de qué tema trata el siguiente mensaje.\n\nTemas disponibles:\n${temasFormateados}\n\nMensaje: "${mensaje}"`
                }]
            });

            return this.#extraerToolUse(res);
        } catch (err) {
            console.error(`[ClaudeBot] determinarTema: ${err}`);
            return null;
        }
    }

    /**
     * Genera un query SQL a partir de esquemas ya extraídos.
     * Se puede llamar directamente si ya tienes los esquemas filtrados.
     * @param {string} mensaje
     * @param {Array<{ tabla: string, base: string, columnas: Array }>} esquemas - Output de extraerEsquemas()
     * @returns {{ query: string, explicacion: string, usa_replacements: boolean, parametros?: object, advertencias?: string[] } | null}
     */
    async generarQuery(mensaje, esquemas = []) {
        try {
            if (!esquemas.length) throw new Error('Se requiere al menos un esquema para generar el query.');

            const esquemasFormateados = esquemas.map(e => {
                const cols = e.columnas.map(c => {
                    const flags = [
                        c.primaryKey    ? 'PK'       : '',
                        c.autoIncrement ? 'AUTO_INC' : '',
                        !c.allowNull    ? 'NOT NULL' : '',
                    ].filter(Boolean).join(' ');

                    const partes = [`    - ${c.nombre}`];
                    if (c.alias !== c.nombre) partes.push(`(alias: ${c.alias})`);
                    partes.push(`[${c.tipo}]`);
                    if (flags)         partes.push(flags);
                    if (c.default)     partes.push(`default: ${c.default}`);
                    if (c.descripcion) partes.push(`— ${c.descripcion}`);
                    return partes.join(' ');
                }).join('\n');

                return `Tabla: "${e.tabla}" | Base: "${e.base}"\nColumnas:\n${cols}`;
            }).join('\n\n' + '─'.repeat(50) + '\n\n');

            const res = await this.client.messages.create({
                model:      this.model,
                max_tokens: 2000,
                system: `Eres un experto en SQL (SQL Server / MySQL).
Reglas estrictas que debes seguir siempre:
1. Usa SIEMPRE parámetros con :nombre para valores variables. Nunca concatenes input del usuario.
2. Usa alias descriptivos en el SELECT (no uses SELECT *).
3. Si la consulta cruza múltiples bases de datos, usa la sintaxis [base].[dbo].[tabla].
4. Solo usa columnas que existan en los esquemas provistos. No inventes columnas.
5. Si hay ambigüedad en los datos, inclúyela en advertencias.`,
                tools: [{
                    name: 'generar_query_sql',
                    description: 'Genera un query SQL seguro y parametrizado',
                    input_schema: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'Query SQL completo listo para ejecutarse'
                            },
                            explicacion: {
                                type: 'string',
                                description: 'Qué hace el query en lenguaje natural'
                            },
                            usa_replacements: {
                                type: 'boolean',
                                description: 'Si el query contiene parámetros :nombre'
                            },
                            parametros: {
                                type: 'object',
                                description: 'Objeto { nombreParam: valorEjemplo } con cada reemplazo necesario'
                            },
                            advertencias: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Limitaciones, supuestos o ambigüedades del query generado'
                            }
                        },
                        required: ['query', 'explicacion', 'usa_replacements']
                    }
                }],
                tool_choice: { type: 'tool', name: 'generar_query_sql' },
                messages: [{
                    role: 'user',
                    content: `Genera un query SQL para responder la siguiente consulta:\n"${mensaje}"\n\nEsquemas disponibles:\n\n${esquemasFormateados}`
                }]
            });

            return this.#extraerToolUse(res);
        } catch (err) {
            console.error(`[ClaudeBot] generarQuery: ${err}`);
            return null;
        }
    }

    /**
     * Pipeline completo: extrae esquemas → identifica bases relevantes → genera query.
     * Es el método principal de uso. Solo necesita el mensaje y los modelos.
     * @param {string} mensaje - Pregunta o consulta del usuario
     * @param {Function|Object|Array} modelos - Modelos Sequelize: barriles, individuales o mezcla
     * @returns {{
     *   basesSeleccionadas: string[],
     *   razonSeleccion: string,
     *   requiereJoinEntreBases: boolean,
     *   queryGenerado: object
     * } | null}
     */
    async procesarConsulta(mensaje, modelos) {
        try {
            const todosLosEsquemas = this.extraerEsquemas(modelos);
            if (!todosLosEsquemas.length) {
                console.error('[ClaudeBot] No se extrajeron esquemas. Verifica que los modelos sean válidos.');
                return null;
            }

            const seleccion = await this.#seleccionarBases(mensaje, todosLosEsquemas);
            if (!seleccion?.bases?.length) {
                console.warn('[ClaudeBot] No se pudieron identificar bases de datos relevantes.');
                return null;
            }

            let esquemasRelevantes = todosLosEsquemas.filter(e => seleccion.bases.includes(e.base));

            if (!esquemasRelevantes.length) {
                // Fuzzy fallback: Claude a veces devuelve nombres con leve variación
                esquemasRelevantes = todosLosEsquemas.filter(e =>
                    seleccion.bases.some(b =>
                        e.base.toLowerCase().includes(b.toLowerCase()) ||
                        b.toLowerCase().includes(e.base.toLowerCase())
                    )
                );

                if (!esquemasRelevantes.length) {
                    console.warn(`[ClaudeBot] Sin esquemas para las bases: ${seleccion.bases.join(', ')}`);
                    return null;
                }
            }

            const queryGenerado = await this.generarQuery(mensaje, esquemasRelevantes);
            if (!queryGenerado) return null;

            return {
                basesSeleccionadas:     seleccion.bases,
                razonSeleccion:         seleccion.razon,
                requiereJoinEntreBases: seleccion.requiere_join_entre_bases ?? false,
                queryGenerado
            };
        } catch (err) {
            console.error(`[ClaudeBot] procesarConsulta: ${err}`);
            return null;
        }
    }

    // ─── PRIVADOS ─────────────────────────────────────────────────────────────

    /**
     * Identifica las bases de datos relevantes usando el catálogo auto-generado.
     * Es privado porque solo se usa dentro del pipeline.
     */
    async #seleccionarBases(mensaje, esquemas) {
        try {
            const catalogo = this.#generarCatalogoBases(esquemas);
            const catalogoFormateado = catalogo
                .map(db => `- "${db.nombre}" → tablas: ${db.tablas.join(', ')}`)
                .join('\n');

            const res = await this.client.messages.create({
                model:      this.model,
                max_tokens: 500,
                tools: [{
                    name: 'seleccionar_bases',
                    description: 'Selecciona las bases de datos necesarias para responder la consulta',
                    input_schema: {
                        type: 'object',
                        properties: {
                            bases: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Nombres EXACTOS de las bases tal como aparecen en el catálogo (incluyendo mayúsculas)'
                            },
                            razon: {
                                type: 'string',
                                description: 'Por qué esas tablas/bases son las correctas para la consulta'
                            },
                            requiere_join_entre_bases: {
                                type: 'boolean',
                                description: 'Si responder la consulta requiere cruzar datos de más de una base'
                            }
                        },
                        required: ['bases', 'razon', 'requiere_join_entre_bases']
                    }
                }],
                tool_choice: { type: 'tool', name: 'seleccionar_bases' },
                messages: [{
                    role: 'user',
                    content: `Analiza la consulta y determina de qué base(s) de datos proviene la información.\n\nCatálogo disponible (nombre → tablas):\n${catalogoFormateado}\n\nConsulta: "${mensaje}"`
                }]
            });

            return this.#extraerToolUse(res);
        } catch (err) {
            console.error(`[ClaudeBot] #seleccionarBases: ${err}`);
            return null;
        }
    }

    /** Normaliza cualquier combinación de modelos/barriles a un array plano de modelos Sequelize. */
    #normalizarModelos(input) {
        const lista = [];
        const agregar = (item) => {
            if (this.#esModeloSequelize(item)) {
                lista.push(item);
            } else if (item && typeof item === 'object' && !Array.isArray(item)) {
                for (const val of Object.values(item)) {
                    if (this.#esModeloSequelize(val)) lista.push(val);
                }
            }
        };

        Array.isArray(input) ? input.forEach(agregar) : agregar(input);
        return lista;
    }

    /** Detecta si un objeto es un modelo Sequelize válido (clase del modelo, no instancia). */
    #esModeloSequelize(obj) {
        return (
            obj != null &&
            typeof obj === 'function' &&
            typeof obj.rawAttributes === 'object' &&
            obj.rawAttributes !== null &&
            typeof obj.sequelize === 'object'
        );
    }

    /**
     * Obtiene el nombre real de la tabla.
     * Maneja: tableName (correcto), tablename (typo), schema mode (objeto).
     */
    #obtenerNombreTabla(modelo) {
        if (typeof modelo.getTableName === 'function') {
            const raw = modelo.getTableName();
            if (typeof raw === 'string') return raw;
            if (raw?.tableName) return raw.tableName;
        }
        return (
            modelo.options?.tableName ??
            modelo.options?.tablename ??
            modelo.name ??
            'desconocida'
        );
    }

    /**
     * Extrae el tipo de dato como string legible: 'VARCHAR(255)', 'INTEGER', 'DATE', etc.
     * Cadena de fallback robusta para cubrir todos los DataTypes de Sequelize.
     */
    #obtenerTipo(attr) {
        const type = attr.type;
        if (!type) return 'UNKNOWN';

        if (type.key) {
            const len = type.options?.length ?? type._length;
            return len ? `${type.key}(${len})` : type.key;
        }

        return type.constructor?.name ?? String(type) ?? 'UNKNOWN';
    }

    /** Agrupa esquemas por base de datos para generar el catálogo que se pasa al LLM. */
    #generarCatalogoBases(esquemas) {
        const mapa = new Map();
        for (const e of esquemas) {
            if (!mapa.has(e.base)) mapa.set(e.base, { nombre: e.base, tablas: [] });
            mapa.get(e.base).tablas.push(e.tabla);
        }
        return [...mapa.values()];
    }

    /** Helper DRY: extrae el input del tool_use de cualquier respuesta de Claude. */
    #extraerToolUse(respuesta) {
        const toolUse = respuesta.content.find(b => b.type === 'tool_use');
        return toolUse?.input ?? null;
    }
}

export default ClaudeBot;
