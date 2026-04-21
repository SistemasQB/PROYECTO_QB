import 'dotenv/config'
import express from "express";
import {default as customerController} from './../controllers/customerController.js';
import upload3 from "../middleware/cargararchivo.js";
import protegerRuta from '../middleware/protegetRuta.js';
import rutasPublicas from "../middleware/rutasPublicas.js";
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // ventana de 15 minutos
    max: 10,                    // máximo 10 intentos por IP
    message: { ok: false, msg: 'Demasiados intentos. Espera 15 minutos.' }
});

const router = express.Router();
//rutas de login
router.get('/',rutasPublicas, customerController.formularioLogin);
router.get('/login', rutasPublicas, customerController.formularioLogin);
router.post('/login', loginLimiter, customerController.autenticar);
//ruta logout
router.post('/logout', protegerRuta,customerController.logout);
//rutas de registro
router.get('/registro', customerController.formularioRegistro);
router.post('/registro', customerController.registrar);
//confirmacion de token
router.get('/confirmar/:token', customerController.confirmar)

router.get('/olvide-password', customerController.formularioOlvidePassword);
router.post('/olvide-password', customerController.resetPassword)
router.get('/olvide-password/:token', customerController.comprobarToken)
router.post('/olvide-password/:token', customerController.nuevoPassword)

router.get('/inicio', protegerRuta,customerController.inicio)

export default router;
