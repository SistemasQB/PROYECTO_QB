import express from "express";
import Verificacion5s from "../models/verificacion5s.js"


const app = express();

const controller = {};

controller.verificacion5s = (req, res) => {
    res.render('admin/calidad/verificacion5s');
}

controller.verificacion5s2 = (req, res) => {
    
}

export default controller;