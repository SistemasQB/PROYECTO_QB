import express from "express";
import controladorGenerales from "../controllers/controladorGeneral.js";


const routerGeneral = express.Router();

//rutas de obtencion de api_key
routerGeneral.post('/getApi_Key', controladorGenerales.api_key);


export default routerGeneral;