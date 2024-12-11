import express from "express";

import RegistroMa from "../models/registroma.js";




const app = express();

const controller = {};

controller.registroMA = async(req, res) => {
    const registro = await RegistroMa.findAll();
    const resultador =  JSON.stringify(registro, null, 2)
    res.render('admin/sistemas/registromati',{
        resultador
    });
}

export default controller;