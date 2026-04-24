import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import modelosGenerales from "../models/generales/barrilModelosGenerales.js";

const middlewareAccesoArchivo = async (req, res, next) => {
const apiKey = req.headers["x-api-key"];
const token = req.cookies?._token;

// ── CASO 1: Aplicación de escritorio (API Key) ──────────────────────
if (apiKey) {
    try {
        const keysActivas = await modelosGenerales.api_keys.findAll({
            where: { activa: 1 },
        });

    let keyValida = false;
    for (const registro of keysActivas) {
        const coincide = await bcrypt.compare(apiKey, registro.key_hash);
        if (coincide) {
        keyValida = true;
        break;
        }
    }

    if (!keyValida) {
        return res.status(401).json({ ok: false, msg: "API key inválida" });
    }

    // Marcas que es cliente de escritorio — acceso limitado
    req.clienteValidado = { tipo: "desktop", departamento: null };
    return next();
    } catch (error) {
    console.error("Error validando API key:", error);
    return res.status(500).json({ ok: false, msg: "Error de servidor" });
    }
}

  // ── CASO 2: Usuario web (JWT en cookie) ─────────────────────────────
if (token) {
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.clienteValidado = {
        tipo: "web",
        id: decoded.id,
        departamento: decoded.departamento, // viene del JWT al hacer login
        puesto: decoded.puesto,
    };
    return next();
    } catch (error) {
    return res
        .status(401)
        .json({ ok: false, msg: "Sesión inválida o expirada" });
    }
}

// ── CASO 3: Sin credenciales ─────────────────────────────────────────
return res.status(401).json({ ok: false, msg: "No autorizado" });
};

export default middlewareAccesoArchivo;
