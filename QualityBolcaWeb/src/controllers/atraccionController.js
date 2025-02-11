import express from "express";

import SolicitudM from "../models/atraccion/solicitud.js"

const app = express();

const controller = {};

controller.solicitudes = async (req, res) => {
    const registro = await SolicitudM.findAll({
        order: [['createdAt', 'DESC']]
    });
    // const resultador =  JSON.stringify(registro, null, 2)
    res.render('admin/atraccion/solicitudes', {
        registro,
        csrfToken: req.csrfToken()
    });
}

controller.solicitudes2 = async (req, res, next) => {
    const { id, estatus, comentario } = req.body

    const { nombre } = req.usuario

    console.log(req.baseUrl);
    

    const registro = await SolicitudM.findByPk(id);

    registro.estatus = estatus
    registro.comentario = comentario
    registro.revisado = nombre

    try {
        await registro.save();
        res.json({ ok: true});
        return;
    } catch (error) {
        console.log('error al enviar informaicon' + error);
        res.status(400).send({ ok: false, message: error });
        return
    }



}

export default controller;