import express from "express";

import SolicitudM from "../models/atraccion/solicitud.js"

import {
    Testcleaver
} from "../models/index.js";

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
        res.json({ ok: true });
        return;
    } catch (error) {
        console.log('error al enviar informaicon' + error);
        res.status(400).send({ ok: false, message: error });
        return
    }



}

controller.test = async (req, res) => {

    // const resultador =  JSON.stringify(registro, null, 2)
    res.render('admin/atraccion/test', {
        csrfToken: req.csrfToken()
    });
}

controller.test2 = async (req, res) => {

    // const resultador =  JSON.stringify(registro, null, 2)
    const {
        nombre,
        estadoCivil,
        sexo,
        edad,
        escolaridad,
        puesto,
        fechaNac,
        Persuasivo,
        Gentil,
        Humilde,
        Original,
        Fuerza_de_Voluntad,
        Mente_Abierta,
        Complaciente,
        Animoso,
        Obediente,
        Quisquilloso,
        Inconquistable,
        Jugueton,
        Aventurero,
        Receptivo,
        Cordial,
        Moderado,
        Agresivo,
        Alma_de_la_Fiesta,
        Comodino,
        Temeroso,
        Confiado,
        Simpatizador,
        Tolerante,
        Afirmativo,
        Respetuoso,
        Emprendedor,
        Optimista,
        Servicial,
        Indulgente,
        Esteta,
        Vigoroso,
        Sociable,
        Agradable,
        Temeroso_de_Dios,
        Tenaz,
        Atractivo,
        Ecuanime,
        Preciso,
        Nervioso,
        Jovial,
        Valiente,
        Inspirador,
        Sumiso,
        Timido,
        Parlanchin,
        Controlado,
        Convencional,
        Decisivo,
        Cauteloso,
        Determinado,
        Convincente,
        Bonachon,
        Disciplinado,
        Generoso,
        Animoso2,
        Persistente,
        Adaptable,
        Disputador,
        Indiferente,
        Sangre_Liviana,
        Cohibido,
        Exacto,
        Franco,
        Buen_Companero,
        Dócil,
        Atrevido,
        Leal,
        Encantador,
        Competitivo,
        Alegre,
        Considerado,
        Armonioso,
        Amiguero,
        Paciente,
        Confianza_en_si_Mismo,
        Mesurado_para_Hablar,
        Diplomatico,
        Audaz,
        Refinado,
        Satisfecho,
        Dispuesto,
        Deseoso,
        Consecuente,
        Entusiasta,
        Admirable,
        Bondadoso,
        Resignado,
        Caracter_Firme,
        Conforme,
        Confiable,
        Pacifico,
        Positivo,
        Inquieto,
        Popular,
        Buen_Vecino,
        Devoto
    } = req.body

    const InventarioR = await Testcleaver.create({
        nombre,
        estadoCivil,
        sexo,
        edad,
        escolaridad,
        puesto,
        fechaNac,
        Persuasivo,
        Gentil,
        Humilde,
        Original,
        Fuerza_de_Voluntad,
        Mente_Abierta,
        Complaciente,
        Animoso,
        Obediente,
        Quisquilloso,
        Inconquistable,
        Jugueton,
        Aventurero,
        Receptivo,
        Cordial,
        Moderado,
        Agresivo,
        Alma_de_la_Fiesta,
        Comodino,
        Temeroso,
        Confiado,
        Simpatizador,
        Tolerante,
        Afirmativo,
        Respetuoso,
        Emprendedor,
        Optimista,
        Servicial,
        Indulgente,
        Esteta,
        Vigoroso,
        Sociable,
        Agradable,
        Temeroso_de_Dios,
        Tenaz,
        Atractivo,
        Ecuanime,
        Preciso,
        Nervioso,
        Jovial,
        Valiente,
        Inspirador,
        Sumiso,
        Timido,
        Parlanchin,
        Controlado,
        Convencional,
        Decisivo,
        Cauteloso,
        Determinado,
        Convincente,
        Bonachon,
        Disciplinado,
        Generoso,
        Animoso2,
        Persistente,
        Adaptable,
        Disputador,
        Indiferente,
        Sangre_Liviana,
        Cohibido,
        Exacto,
        Franco,
        Buen_Companero,
        Dócil,
        Atrevido,
        Leal,
        Encantador,
        Competitivo,
        Alegre,
        Considerado,
        Armonioso,
        Amiguero,
        Paciente,
        Confianza_en_si_Mismo,
        Mesurado_para_Hablar,
        Diplomatico,
        Audaz,
        Refinado,
        Satisfecho,
        Dispuesto,
        Deseoso,
        Consecuente,
        Entusiasta,
        Admirable,
        Bondadoso,
        Resignado,
        Caracter_Firme,
        Conforme,
        Confiable,
        Pacifico,
        Positivo,
        Inquieto,
        Popular,
        Buen_Vecino,
        Devoto
    })

    res.json({ ok: true });
}

export default controller;