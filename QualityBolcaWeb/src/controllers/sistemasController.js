import express from "express";

import {
    registroma
} from "../models/index.js";




const app = express();

const controller = {};

controller.registroMA = async(req, res) => {
    const registro = await registroma.findAll();
    const resultador =  JSON.stringify(registro, null, 2)
    res.render('admin/sistemas/registromati',{
        resultador
    });
}

export default controller;