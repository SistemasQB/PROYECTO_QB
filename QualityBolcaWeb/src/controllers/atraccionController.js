import express from "express";

import SolicitudM from "../models/atraccion/solicitud.js"

const app = express();

const controller = {};

controller.solicitudes = async (req, res) => {
    const registro = await SolicitudM.findAll();
    // const resultador =  JSON.stringify(registro, null, 2)
    res.render('admin/atraccion/solicitudes',{
        registro
    });
}

export default controller;