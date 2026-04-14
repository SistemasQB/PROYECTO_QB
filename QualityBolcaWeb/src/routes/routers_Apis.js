import express from "express";
import controladorApis from "../controllers/controladorApis.js";
import validarApiKey from "../middleware/validacion_apiKey.js";

const routerApis = express.Router();

routerApis.get('/semanales', validarApiKey, controladorApis.semanales);
// routerApis.get('/api/usuarios/:codigoempleado', protegerRuta, controladorApis.obtenerUsuario);
// routerApis.post('/api/usuarios', protegerRuta, controladorApis.crearUsuario);
// routerApis.put('/api/usuarios/:codigoempleado/actualizar', protegerRuta, controladorApis.actualizarUsuario);
// routerApis.delete('/api/usuarios/:codigoempleado', protegerRuta, controladorApis.eliminarUsuario);

export default routerApis;