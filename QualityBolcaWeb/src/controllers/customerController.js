import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { transporter } from "../../index.js";

import {
    Cps,
    ControlDispositivos,
    DocumentosControlados,
    EncuestaS,
    juegos,
    Mejora,
    pedirCurso,
    precios,
    puestos,
    registroCurso,
    registroma,
    requisicion,
    verificacion5s,
    CheckListVehiculos,
    Listas,
    Requisicion,
    Curso,
    RegistroCursos,
    Comunicacion,
    Usuario,
    // Gch_Alta,
    informaciongch,
    informacionpuesto,
    Glosario
} from "../models/index.js";

import Swal from 'sweetalert2'
import multer from "multer";
import mimeTypes from "mime-types";
import { check, validationResult } from "express-validator";
import { alerta } from "../../index.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";


const upload = multer({ dest: 'files/' })

const app = express();
// const upload = multer({ dest: 'images/' })
const controller = {};

controller.formularioLogin = (req, res) => {
    res.render('auth/login', {
        errores: '',
        usuario: '',
        csrfToken: req.csrfToken()
    })
}

controller.autenticar = async (req, res) => {
    // await check('email').isEmail().withMessage('El correo es obligatorio').run(req);
    // await check('password').notEmpty().withMessage('La contrseña es obligatoria').run(req);
        const { codigoempleado, password } = req.body
        
    if (codigoempleado == '' || password == '') {
        res.status(400).send({ msg: 'Completa los campos', ok: false });
        return
    }

   //comporbar si el usuario existe

    const usuario = await Usuario.findOne({ where: { codigoempleado } })
    if (!usuario) {
        res.status(400).send({ msg: 'El usuario no existe', ok: false });
        return
    }
    //Comprobar si el usuario este confirmado
    if (!usuario.confirmado) {
        res.status(400).send({ msg: 'tu cuenta no ha sido confirmada', ok: false });
        return
    }

    // Revisar la contrseña

    if (!usuario.verificarPasssword(password)) {
        res.status(400).send({ msg: 'La contrseña no es correcta', ok: false });
        return
    }

    //Autenticar al usuario

    const token = generarJWT(usuario.codigoempleado)

    //Almacenar en una cookie

    res.cookie('_token', token, {
        httpOnly: true,
        secure: false,
    })

    res.status(200).send({ ok: true });
    return
}

controller.formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        errores: '',
        usuario: '',
        csrfToken: req.csrfToken()
    })
}

controller.formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        csrfToken: req.csrfToken(),
        errores: ''
    })
}

controller.resetPassword = async (req, res) => {
    // await check('email').isEmail().withMessage('Esto no parece un email').run(req);

    // let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    // if (!resultado.isEmpty()) {
    //     return res.render('auth/olvide-password', {
    //         csrfToken: req.csrfToken(),
    //         errores: resultado.array()
    //     })
    // }

    //Buscar el usuario




    const { codigoempleado } = req.body
    // res.status(400).send({ msg: req.body, ok: false });
    const usuario = await Usuario.findOne({ where: { codigoempleado: codigoempleado } })
    console.log(codigoempleado);
    

    if (!usuario) {
        res.status(400).send({ msg: 'Usuario no encontrado', ok: false });
        return
    }
    const usuario2 = await Informaciongch.findOne({ where: { codigoempleado: codigoempleado } })
    //Generar un token y enviar email
    usuario.token = generarId();
    await usuario.save();

    //Enviar un email
    emailOlvidePassword({
        email: usuario2.CorreoElectronico,
        nombre: usuario2.nombrelargo,
        token: usuario.token
    })
    //Mostrar mensaje de confirmacion
    res.status(200).send({ msg: 'Informacion enviada con exito', ok: true });
    return
}

controller.comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/reset-password', {
            csrfToken: req.csrfToken(),
            token
        })
    }

    //Mostrar formulario para modificar la contrseña

    res.render('auth/reset-password', {
        csrfToken: req.csrfToken(),
        token
    })
}

controller.nuevoPassword = async (req, res) => {
    // Validar la contrseña
    const { password, password2 } = req.body
    if (password.length < 6) {
        res.status(400).send({ msg: 'la contraseña debe tener minimo 6 caracteres', ok: false });
        return
    }

    if (password !== password2) {
        res.status(400).send({ msg: 'las contraseñas no son iguales', ok: false });
        return
    }
    //Verificar que el resultado este vacio

    const { token } = req.params
    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({ where: { token } })

    //Hasear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save()

    res.status(200).send({ msg: 'Contraseña cambiada con exito', ok: true });
        return
}

controller.registrar = async (req, res) => {

    console.log('entrando al controller de registro');
    
    //validaciones
    await check('codigoempleado').notEmpty().withMessage('El Codigo de empleado no puede ir vacio').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contrseña debe tener minimo 6 caracteres').run(req);
    await check('confirm-password').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);
    console.log('entrando al controller de registro', resultado);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            errores: resultado.array(),
            csrfToken: req.csrfToken()
        })
    }

    //Extraer los datos
    const { codigoempleado, password } = req.body
    // console.log('nose', codigoempleado);
    
    //Verificar si el usuario ya esta registrado
    const gchUsuario = await informaciongch.findOne({ where: { codigoempleado } })

    console.log(gchUsuario);
    
    
    if (!gchUsuario) {
        // return res.render('auth/registro', {
        //     errores: [{ok: false, msg: 'El usuario no Existe' }],
        //     csrfToken: req.csrfToken()
        // })
        res.status(400).send({ ok: false, msg: 'El usuario no Existe' });
        return
    }

    // console.log('nose2', codigoempleado);
    //Verificar que el usuario existe
    const existeUsuario = await Usuario.findOne({ where: { codigoempleado } })
    console.log(existeUsuario);
    if (existeUsuario) {
        // return res.render('auth/registro', {s
        
        //     errores: [{ ok: false, msg: 'El usuario ya esta registrado' }],
        //     csrfToken: req.csrfToken()
        // })
        res.status(400).send({ ok: false, msg: 'El usuario ya esta registrado' });
        return
    }


    //Almacenar usuario
    const usuario = await Usuario.create({
        codigoempleado: codigoempleado,
        password,
        token: generarId()
    });


    // Enviar email de confirmacion
    emailRegistro({
        nombre: gchUsuario.nombrelargo,
        email: gchUsuario.CorreoElectronico,
        token: usuario.token
    })

    //Mostrando al usuario que confirme correo

    res.status(200).send({ ok: true, correo:gchUsuario.CorreoElectronico });
    return

}

controller.confirmar = async (req, res) => {
    const { token } = req.params;
    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            errores: 'error el token ya no existe'
        })
    }

    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    return res.render('auth/confirmar-cuenta', {
        errores: ''
    })
}

controller.inicio = (req, res) => {
    res.render('auth/index')
}

controller.controlDispositivos = (req, res) => {
    res.render('todos/controlDispositivos', {
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.controlDispositivos2 = async (req, res) => {
    const { caracteristicas, marca, modelo, tipo, usuario, numeroT, motivo, encargado } = req.body

    const dispsitivo = await ControlDispositivos.create({
        caracteristicas,
        marca,
        modelo,
        tipo,
        usuario,
        numeroT,
        motivo,
        encargado
    });

    res.render('todos/controlDispositivos', {
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

controller.encuestaSatisfaccion = (req, res) => {
    res.render('todos/encuestaSatisfaccion', {
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.encuestaSatisfaccion2 = async (req, res) => {

    const { nombreC, nombreU, puesto, telefon, correo, question1, question1c, question2, question2c, question3, question3c, question4, question4c, question5, question5c, question6, question6c, question7, question7c, question8, question8c, question9c } = req.body
    const encuesta = await EncuestaS.create({ nombreC, nombreU, puesto, telefon, correo, question1, question1c, question2, question2c, question3, question3c, question4, question4c, question5, question5c, question6, question6c, question7, question7c, question8, question8c, question9c })
    res.render('todos/encuestaSatisfaccion', {
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

controller.requisicion = (req, res) => {
    res.render('auth/requisicion')
}

controller.requisicion2 = async (req, res) => {
    const Requisicion = await Requisicion.create(req.body);
}

controller.paginaSolicitud = async (req, res) => {

    // const { cp } = req.params

    // const cps = await Cps.findAll({ attributes: ['colonia', 'estado'], where: { cp: cp } })

    res.render('auth/solicitud', {
        csrfToken: req.csrfToken()
    })
}

controller.paginaSolicitud2 = async (req, res) => {

    const {
        puesto,
        sueldo,
        nombre,
        apellidoP,
        apellidoM,
        correo,
        telefono,
        direccion,
        region,
        cp,
        experiencia,
        adeudos,
        cv } = req.body

    try {
        const resSolcitudM = await Solicitud.create({
            id: uuidv4(),
            puesto,
            sueldo,
            nombre,
            apellidoP,
            apellidoM,
            correo,
            telefono,
            direccion,
            region,
            cp,
            experiencia,
            adeudos,
            cv
        })
        res.json({ ok: true, id: resSolcitudM.id });
        // res.status(200).send({ solId: resSolcitudM.id});
        return
    } catch (error) {
        console.log('error al enviar informaicon' + error);

        res.status(400).send({ ok: false, message: error });
        return
    }



}

controller.paginaSolicitud3 = async (req, res) => {

    const { cp } = req.params

    const cps = await Cps.findAll({ attributes: ['colonia', 'estado'], where: { cp: cp } })

    console.log(cps);

    res.json({ ok: true, id: resSolcitudM.id });
    // res.status(200).send({ solId: resSolcitudM.id});
    return
}

controller.subirSolicitud = async (req, res) => {

    const { id } = req.params
    //validar la solicitud existente


    const solicitud = await Solicitud.findByPk(id)



    if (!solicitud) {
        return res.redirect('/solicitud');
    }

    //validar la solicitud no tenga pdf

    if (solicitud.cv != null) {
        return res.redirect('/solicitud');
    }

    res.render('auth/subirsolicitud', {
        csrfToken: req.csrfToken(),
        solicitud
    })
}

controller.subirSolicitud2 = async (req, res, next) => {
    const { id } = req.params

    const solicitud = await Solicitud.findByPk(id)


    // solicitud.cv = req.file.filename

    // await solicitud.save()

    try {
        // console.log('nombre de la imagen', req.file.filename);

        //almacenar el pdf
        solicitud.cv = req.file.filename
        await solicitud.save()
        next()

    } catch (error) {
        console.log(error);

    }
}

controller.asistencia = async (req, res) => {

    const planta = await Listas.findAll();
    const resultadoPlanta = JSON.parse(JSON.stringify(planta, null, 2));
    // console.log(planta);
    // console.log('All users:', JSON.stringify(planta, null, 2));
    res.render('todos/asistencia', {
        resultadoGch: '',
        resultadoPlanta,
        region: ''
    })
}

controller.asistencia2 = async (req, res) => {
    // const { plantaA } = req.params
    // const planta = await Listas.findAll();
    // const resultadoPlanta = JSON.parse(JSON.stringify(planta, null, 2));
    // const gch_alta = await Gch_Alta.findAll({
    //     // atributes: ['id', 'apellidoPaterno', 'apellidoMaterno', 'nombre', 'planta'],
    //     where: {
    //         planta: plantaA,
    //     },
    // });
    // const resultadoGch = JSON.parse(JSON.stringify(gch_alta, null, 2));

    // res.render('todos/asistencia', {
    //     resultadoGch,
    //     resultadoPlanta
    // })

    res.send('sin terminar asistencia')
}

controller.asistencia3 = (req, res) => {
    res.render('todos/asistencia')
}

controller.cheklist1 = (req, res) => {
    res.render('auth/checklist', {
        mensaje: false,
        csrfToken: req.csrfToken()
    })
}

controller.cheklist2 = async (req, res) => {

    const { unidad,
        placas,
        kilometraje,
        region,
        usuario,
        responsable,
        ddm,
        ddmar,
        ddev,
        dder,
        ddp,
        dim,
        dimar,
        diev,
        dier,
        dip,
        tdm,
        tdmar,
        tdev,
        tder,
        tdp,
        tim,
        timar,
        tiev,
        tier,
        tip,
        catalizador,
        marcaCatalizador,
        SerieCatalizador,
        Bateria,
        marcaBateria,
        SerieBateria,
        tarjetaCirculacion,
        vigenciaTarjetaCirculacion,
        polizaSeguro,
        vigenciaPolizaSeguro,
        verificacionVehicular,
        vigenciaVerificacionVehicular,
        manual,
        vigenciaManual,
        licencia,
        vigenciaLicencia,
        anticongelante,
        nivelAceite,
        aceiteDireccion,
        aceiteTransmision,
        liquidoFrenos,
        liquidoClutch,
        limpiezaInterior,
        limpiezaExterior,
        claxon,
        luzFreno,
        intermitentes,
        direccionales,
        luzReversa,
        luzCuartos,
        luzBajas,
        luzAltas } = req.body
    const checkVehiculos = await CheckListVehiculos.create({
        unidad,
        placas,
        kilometraje,
        region,
        usuario,
        responsable,
        ddm,
        ddmar,
        ddev,
        dder,
        ddp,
        dim,
        dimar,
        diev,
        dier,
        dip,
        tdm,
        tdmar,
        tdev,
        tder,
        tdp,
        tim,
        timar,
        tiev,
        tier,
        tip,
        catalizador,
        marcaCatalizador,
        SerieCatalizador,
        Bateria,
        marcaBateria,
        SerieBateria,
        tarjetaCirculacion,
        vigenciaTarjetaCirculacion,
        polizaSeguro,
        vigenciaPolizaSeguro,
        verificacionVehicular,
        vigenciaVerificacionVehicular,
        manual,
        vigenciaManual,
        licencia,
        vigenciaLicencia,
        anticongelante,
        nivelAceite,
        aceiteDireccion,
        aceiteTransmision,
        liquidoFrenos,
        liquidoClutch,
        limpiezaInterior,
        limpiezaExterior,
        claxon,
        luzFreno,
        intermitentes,
        direccionales,
        luzReversa,
        luzCuartos,
        luzBajas,
        luzAltas
    })
    res.render('auth/checklist', {
        mensaje: true,
        csrfToken: req.csrfToken()
    })
}

controller.agregarImagen = async (req, res) => {
    res.render('auth/agregar-imagen', {
        csrfToken: req.csrfToken(),
        mensaje: false
    })
}

controller.agregarImagen2 = (req, res) => {
    upload.single('file')
    // console.log(req.body);
    // console.log(req.file);


    // res.render('auth/agregar-imagen', {
    //     csrfToken: req.csrfToken(),
    //     mensaje: true
    // })
}


controller.uploads = (req, res) => {
    const datos = req.body;

    if (!datos.nombre) {
        datos.nombre = 'Nombre'
    }
    if (!datos.apellidoP) {
        datos.apellidoP = 'Apellido'
    }
    if (!datos.apellidoM) {
        datos.apellidoM = 'Apellido'
    }

    // const storage = multer.diskStorage({
    //     destination: 'uploads/',
    //     filename: function(req, file, cb){
    //         cb("",datos.nombre + datos.apellidoP + datos.apellidoM + '.' + mimeTypes.extension(file.mimetype));
    //     }
    // })

    // const upload = multer({
    //     storage: storage
    // })

    // upload.single('avatar');
    // console.log('storage ' + storage.filename);

}

controller.paginaDirectorio = async (req, res) => {
    // const directorio = await Gch_Alta.findAll({
    //     attributes: ['NOMBRE', 'PUESTO', 'REGION']
    // });
    // const resultadoGch = JSON.parse(JSON.stringify(directorio, null, 2));
    // res.render('auth/directorio', {
    //     resultadoGch
    // })

    res.send('sin terminar directorio')
}

controller.paginaMantenimiento = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query(`SELECT id_equipo, DATE_FORMAT(fechaMan1, '%Y-%m-%d') as dia1, DATE_FORMAT(fechaMan1, '%Y-%m-%d') as dia2, realizado FROM express.mantenimientoCPU;`, (err, customers) => {
            if (err) {
                res.json(err);
            }
            res.render('auth/mantenimiento', {
                data: customers
            });
        });
    });
}

controller.enviarCorreo = (req, res) => {

    req.getConnection((err, conn) => {
        conn.query(`SELECT * FROM express.mantenimientoCPU;`, (err, customers) => {
            if (err) {
                res.json(err);
            }
            let consulta = customers;

            // for (const [key, datos] of Object.entries(data)) {
            //     `<tr>
            //         <td scope="row">1</td>
            //         <td>${datos.nombre} </td>
            //         <td>${datos.apellidoPaterno} </td>
            //         <td>${datos.apellidoMaterno}</td>
            //     </tr>`
            // }
            let cuerpo = `<style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: center;
        }
        .container {
            background-color: #ffffff00;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(45, 110, 230, 0.1);
            margin: 20px auto;
            padding: 20px;
            max-width: 500px;
        }
        .logo img {
            width: 220px; 
            height: auto; 
            margin-bottom: 20px;
        }
        #logo1{
            background: url("./img/firma1-removebg-preview.png");
        }
        #logo2{
            background: url("public/img/firma1-removebg-preview2.png");
        }

        .signature img {
            width: 200px; 
            height: auto; 
            margin-top: 20px;
            
        }
        .name {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #1a73e8;
        }
        .position {
            font-size: 1.2em;
            margin-bottom: 10px;
            color: #1a73e8;
            font-family: Arial, Helvetica, sans-serif;
        }
        .contact-info {
            font-size: 1em;
            color: #555;
        }
        .contact-info a {
            color: #1a73e8;
            text-decoration: none;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        p{color: #1a73e8;}
    </style>`
            for (const [key, datos] of Object.entries(consulta)) {
                cuerpo = cuerpo + '<h1>' + datos.id_equipo + datos.realizado + '</h1>'
            }
            cuerpo = cuerpo + `<div class="container">
        <div class="logo">
            
            <img id='logo1' src='img/firma1-removebg-preview.png' alt="Logo">
        </div>
        <div class="name">Oscar Arturo De luna Luján</div>
        <div class="position">Analista de Tecnologías de la Información</div>
        <div class="contact-info">
            <p>Mobile: 449-273-72-60</p>
            <p>Aguascalientes, Ags</p>
            <p><a href="https://qualitybolca.com/" target="_blank">https://qualitybolca.com/</a></p>
        </div>
        
        <div class="signature">
            <img id='logo2' src='../public/img/firma1-removebg-preview2.png' alt="Firma">
        </div>
    </div>`
            async function main() {
                // send mail with defined transport object
                const info = await transporter.sendMail({
                    from: "mantenimiento@qualitybolca.net",
                    to: 'info.sistemas@qualitybolca.com',
                    subject: 'Mantenimiento',
                    text: 'hola',
                    html: cuerpo
                });
                // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.semail>
            }
            main().catch(console.error);
        });
    });
}

controller.juegos = async (req, res) => {
    const resultadosJugadores = await Juegos.findAll({
        order: [['wpm', 'DESC']],
        limit: 10,
    });

    res.render('auth/juegos', {
        csrfToken: req.csrfToken(),
        resultadosJugadores
    })
}

controller.juegos2 = async (req, res) => {

    const { nombreJugador, wpm, accuracy } = req.body
    const juegosR = await Juegos.create({
        nombreJugador, wpm, accuracy
    })
    // res.render('auth/juegos', {
    //     csrfToken: req.csrfToken()
    // })
}

controller.documentosControlados = (req, res) => {
    res.render('auth/documentoscontrolados', {
        
    })
}


controller.calidadD = (req, res) =>{
    const { documento } = req.params
    // const documento = 'QB-PR-A-12 Tecnologías de la información.pdf'
    res.render('auth/calidadD', {
        documento
    })
}



export default controller;