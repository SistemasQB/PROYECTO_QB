import express from "express";
import Verificacion5s from "../models/verificacion5s.js"
import Sequelize, { DATE, where } from 'sequelize'
import { Op, QueryTypes } from 'sequelize'
import fs from 'fs';

import XlsxPopulate from "xlsx-populate";

import { emailMejoraRespuesta } from "../helpers/emails.js";

import {
  Mejora,
  Semanal
} from "../models/index.js";
import { ok } from "assert";


const app = express();

const controller = {};

controller.subirsemanal = (req, res) => {

  res.render('admin/nominas/subirsemanal', {
    csrfToken: req.csrfToken()
  });

};

controller.subirsemanal2 = (req, res) => {
  const excelPath = './src/public/semanal/semanal.xlsm';

  XlsxPopulate.fromFileAsync(excelPath)
    .then(workbook => {
      const sheet = workbook.sheet(2); // primera hoja
      const rows = [];
      let rowIndex = 7;
      const columnaB2 = sheet.cell(`B2`).value();
      const columnaB4 = sheet.cell(`B4`).value();

      while (true) {

        const columnaA = sheet.cell(`A${rowIndex}`).value();
        const columnaB = sheet.cell(`B${rowIndex}`).value();
        const columnaE = sheet.cell(`E${rowIndex}`).value();
        const columnaL = sheet.cell(`L${rowIndex}`).value();
        const columnaP = sheet.cell(`P${rowIndex}`).value();
        const columnaT = sheet.cell(`T${rowIndex}`).value();
        const columnaY = sheet.cell(`Y${rowIndex}`).value();
        const columnaAC = sheet.cell(`AC${rowIndex}`).value();
        const columnaAG = sheet.cell(`AG${rowIndex}`).value();
        const columnaAL = sheet.cell(`AL${rowIndex}`).value();
        const columnaAP = sheet.cell(`AP${rowIndex}`).value();
        const columnaAT = sheet.cell(`AT${rowIndex}`).value();
        const columnaAY = sheet.cell(`AY${rowIndex}`).value();
        const columnaBC = sheet.cell(`BC${rowIndex}`).value();
        const columnaBG = sheet.cell(`BG${rowIndex}`).value();
        const columnaBL = sheet.cell(`BL${rowIndex}`).value();
        const columnaBP = sheet.cell(`BP${rowIndex}`).value();
        const columnaBT = sheet.cell(`BT${rowIndex}`).value();
        const columnaBY = sheet.cell(`BY${rowIndex}`).value();
        const columnaCC = sheet.cell(`CC${rowIndex}`).value();
        const columnaCG = sheet.cell(`CG${rowIndex}`).value();
        const columnaCL = sheet.cell(`CL${rowIndex}`).value();
        const columnaCP = sheet.cell(`CP${rowIndex}`).value();
        const columnaCT = sheet.cell(`CT${rowIndex}`).value();
        const columnaCV = sheet.cell(`CV${rowIndex}`).value();
        const columnaCW = sheet.cell(`CW${rowIndex}`).value();
        const columnaCX = sheet.cell(`CX${rowIndex}`).value();
        const columnaCY = sheet.cell(`CY${rowIndex}`).value();
        const columnaCZ = sheet.cell(`CZ${rowIndex}`).value();
        const columnaDH = sheet.cell(`DH${rowIndex}`).value();
        const columnaDM = sheet.cell(`DM${rowIndex}`).value();
        const columnaDS = sheet.cell(`DS${rowIndex}`).value();
        const columnaDW = sheet.cell(`DW${rowIndex}`).value();

        // Detener si todas están vacías
        if (
          [columnaA, columnaB].every(v => v === null || v === undefined || v === '')
        ) break;




        let vLunes = convertirHoraDecimalAEntero(columnaL) + convertirHoraDecimalAEntero(columnaP) + convertirHoraDecimalAEntero(columnaT)
        let vMartes = convertirHoraDecimalAEntero(columnaY) + convertirHoraDecimalAEntero(columnaAC) + convertirHoraDecimalAEntero(columnaAG)
        let vMiercoles = convertirHoraDecimalAEntero(columnaAL) + convertirHoraDecimalAEntero(columnaAP) + convertirHoraDecimalAEntero(columnaAT)
        let vJueves = convertirHoraDecimalAEntero(columnaAY) + convertirHoraDecimalAEntero(columnaBC) + convertirHoraDecimalAEntero(columnaBG)
        let vViernes = convertirHoraDecimalAEntero(columnaBL) + convertirHoraDecimalAEntero(columnaBP) + convertirHoraDecimalAEntero(columnaBT)
        let vSabado = convertirHoraDecimalAEntero(columnaBY) + convertirHoraDecimalAEntero(columnaCC) + convertirHoraDecimalAEntero(columnaCG)
        let vDomingo = convertirHoraDecimalAEntero(columnaCL) + convertirHoraDecimalAEntero(columnaCP) + convertirHoraDecimalAEntero(columnaCT)
        let vSemana = vLunes + vMartes + vMiercoles + vJueves + vViernes + vSabado + vDomingo

        let nSemana = columnaB4.split(' ')

        rows.push({
          clave: columnaA,
          nombre: columnaB,
          puesto: columnaE,
          lunes: vLunes,
          martes: vMartes,
          miercoles: vMiercoles,
          jueves: vJueves,
          viernes: vViernes,
          sabado: vSabado,
          domingo: vDomingo,
          semanatotal: vSemana,
          prestamo: parseInt(columnaCW) || 0,
          infonavit: parseInt(columnaCX) || 0,
          fca: parseInt(columnaCY) || 0,
          gfiscal: parseInt(columnaCZ) || 0,
          deducciones: parseInt(columnaDH) || 0,
          bono: parseInt(columnaDM) || 0,
          percepcion: parseInt(columnaDS) || 0,
          neto: parseInt(columnaDW) || 0,
          fechainicio: convertirFechaExcelANormal(columnaB2),
          semana: nSemana[1]
        });
        rowIndex++;
      }

      return rows;
    })
    .then(data => {
      console.log('Registros obtenidos:', data);
      // Aquí puedes llamar a la función que guarda en Sequelize

      guardarSemanal(data)

      res.status(200).send({ msg: 'Datos Cargados', ok: true });
    })
    .catch((err) => {
      res.status(400).send({ msg: "Error al cargar los datos", ok: false }),
        console.log('Error al leer Excel:', err)
    }
    );


  async function guardarSemanal(data) {
    try {
      await Semanal.bulkCreate(data);
    } catch (error) {
      console.error('Error al guardar en Semanal:', error);
    }
  }
  // res.render('admin/nominas/subirsemanal', {
  //   csrfToken: req.csrfToken()
  // });
}

controller.semanal = async (req, res) => {
  let obtenerValores
  await Semanal.findAll({ order: [[Sequelize.literal('semana'), 'DESC']] })
    .then((result) => {
      obtenerValores = result
    });

  res.render('admin/nominas/vistasemanal', {
    csrfToken: req.csrfToken(),
    obtenerValores
  })
}

controller.semanal2 = async (req, res) => {

  const { nombre, semana, fechainicio } = req.body

  console.log(nombre, semana, fechainicio);

  const vAño = new Date().getFullYear();
  const vFecha = new DATE(vAño + '/12/31')
  let obtenerValores
try {
  if(nombre == '' && semana == ''){
    await Semanal.findAll({ order: [[Sequelize.literal('semana'), 'DESC']] })
    .then((result) => {
      obtenerValores = result
    });
  }

  if (nombre) {
    await Semanal.findAll({ where: { nombre: { [Op.like]: '%' + nombre + '%' } }, order: [[Sequelize.literal('semana'), 'DESC']] })
      .then((result) => {
        obtenerValores = result
      });
  } else if (semana) {

    // new Date().getFullYear() + 
    await Semanal.findAll({ where: { semana: semana, fechainicio: { [Op.lte]: vFecha} }, order: [[Sequelize.literal('semana'), 'DESC']] })

      .then((result) => {
        obtenerValores = result
      });
  }


  res.send({
    ok: true,
    csrfToken: req.csrfToken(),
    obtenerValores
  })
} catch (error) {
  res.status(400).send({ msg: "Error al buscar" + error, ok: false })
}
}




function convertirHoraDecimalAEntero(valorDecimalExcel) {
  // Multiplica por 24 para obtener las horas
  const horas = valorDecimalExcel * 24;

  // Puedes redondear si quieres solo la hora completa:
  return Math.round(horas); // o Math.floor(horas), si prefieres truncar
}

function convertirFechaExcelANormal(valorExcel) {
  const fechaBase = new Date(1899, 11, 30); // Excel comienza desde el 0, pero JS arranca desde el 1, así que ajustamos
  fechaBase.setDate(fechaBase.getDate() + valorExcel);
  return fechaBase;
}



export default controller;