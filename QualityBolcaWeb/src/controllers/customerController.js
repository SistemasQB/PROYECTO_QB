import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../../index.js";
import Usuario from "../models/Usuario.js"
import Listas from "../models/listas.js"
import Gch_Alta from "../models/gch_alta.js"
import CheckListVehiculos from "../models/checklist.js";
import ControlDispositivos from "../models/ControlDispositivos.js"
import EncuestaS from "../models/encuestaSatisfaccion.js"
import Swal from 'sweetalert2'
import multer from "multer";
import mimeTypes from "mime-types";
import requisicion from "../models/requisicion.js";
import { check, validationResult } from "express-validator";
import { alerta } from "../../index.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";



const upload = multer ({dest: 'files/'})

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
    await check('email').isEmail().withMessage('El correo es obligatorio').run(req);
    await check('password').notEmpty().withMessage('La contrseña es obligatoria').run(req);
    let error
    
    let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        // console.log('Campos vacios');
        // error = [{}];
        res.status(400).send({ msg: 'Completa los campos', ok: false});
        // return res.render('auth/login', {
        //     errores: resultado.array(),
        //     csrfToken: req.csrfToken(),
        // })
        return
    }
    
    const { email, password } = req.body

    //comporbar si el usuario existe

    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        // return res.render('auth/login', {
        //     errores: [{ msg: 'El usuario no existe' }],
        //     csrfToken: req.csrfToken(),
        // })
        error = [{  }];
        
        // res.send(errores)
        res.status(400).send({msg: 'El usuario no existe', ok: false});
        return
    }
    // console.log('El usuario buscado es:' + usuario.nombre);
    //Comprobar si el usuario este confirmado
    if (!usuario.confirmado) {
        // return res.render('auth/login', {
        //     errores: [{ msg: 'tu cuenta no ha sido confirmada' }],
        //     csrfToken: req.csrfToken(),
        // })
        error = [{  }];
        // res.send(errores)
        res.status(400).send({msg: 'tu cuenta no ha sido confirmada', ok: false});
        return
    }

    // Revisar la contrseña

    if (!usuario.verificarPasssword(password)) {
        // return res.render('auth/login', {
        //     errores: [{ msg: 'La contrseña no es correcta' }],
        //     csrfToken: req.csrfToken(),
        // })
        error = [{  }];
        // res.send(errores)
        res.status(400).send({msg: 'La contrseña no es correcta', ok: false});
        return
    }

    //Autenticar al usuario

    const token = generarJWT(usuario.id, usuario.email)

    //Almacenaren luna cookie

    res.cookie('_token', token, {
        httpOnly: true,
        secure: true,
    })

    res.status(200).send({ok: true});
    return
    // res.render('auth/login', {
    //     errores: '',
    //     usuario: '',
    //     csrfToken: req.csrfToken()
    // })
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
    await check('email').isEmail().withMessage('Esto no parece un email').run(req);

    let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar el usuario

    const { email } = req.body
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/olvide-password', {
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El email no pertenece a ningun usuario' }]
        })
    }

    //Generar un token y enviar email
    usuario.token = generarId();
    await usuario.save();

    //Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('auth/confirmar-cuenta', {
        errores: ''
    })
}

controller.comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            csrfToken: req.csrfToken(),
            error: true
        })
    }

    //Mostrar formulario para modificar la contrseña

    res.render('auth/reset-password', {
        csrfToken: req.csrfToken(),
        errores: ''
    })
}

controller.nuevoPassword = async (req, res) => {
    // Validar la contrseña
    await check('password').isLength({ min: 6 }).withMessage('La contrseña debe tener minimo 6 caracteres').run(req);

    let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            errores: resultado.array(),
            csrfToken: req.csrfToken()
        })
    }

    const { token } = req.params
    const { password } = req.body
    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({ where: { token } })

    //Hasear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        errores: ''
    })
}

controller.registrar = async (req, res) => {
    //validaciones
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('puesto').notEmpty().withMessage('El puesto no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('Esto no parece un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contrseña debe tener minimo 6 caracteres').run(req);
    await check('confirm-password').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                puesto: req.body.puesto,
                email: req.body.email
            }
        })
    }

    //Extraer los datos
    const { nombre, email, puesto, password } = req.body

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (existeUsuario) {
        return res.render('auth/registro', {
            errores: [{ msg: 'El usuario ya esta registrado' }],
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                puesto: req.body.puesto,
                email: req.body.email
            }
        })
    }


    //Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        puesto,
        email,
        password,
        token: generarId()
    });


    // Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrando al usuario que confirme correo

    res.render('auth/confirmar-cuenta', {
        errores: ''
    })

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

controller.paginaSolicitud = (req, res) => {
    res.render('auth/solicitud')
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
    const { plantaA } = req.params
    const planta = await Listas.findAll();
    const resultadoPlanta = JSON.parse(JSON.stringify(planta, null, 2));
    const gch_alta = await Gch_Alta.findAll({
        // atributes: ['id', 'apellidoPaterno', 'apellidoMaterno', 'nombre', 'planta'],
        where: {
            planta: plantaA,
        },
    });
    const resultadoGch = JSON.parse(JSON.stringify(gch_alta, null, 2));

    res.render('todos/asistencia', {
        resultadoGch,
        resultadoPlanta
    })
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
    console.log(req.body);
    console.log(req.file);
    

    // res.render('auth/agregar-imagen', {
    //     csrfToken: req.csrfToken(),
    //     mensaje: true
    // })
}

controller.paginaSolicitud2 = (req, res) => {
    const datos = req.body;

    req.getConnection((err, conn) => {
        // console.log(datos.nombre)
        // conn.query('insert into solicitudEmpleo set ?', [datos], (err, customers) => {
        conn.query(`insert into solicitudEmpleo set puesto='analista', sueldo='10000', nombre='nose', correo='info.sistemas@qualitybolca.com', telefono='4492737260', direccion='amazonita 313', adeudos='1';`, (err, customers) => {
            if (err) {
                res.json(err);
            }
            res.render('auth/solicitud', {
            });
        });
    });
}

controller.uploads = (req, res) => {
    console.log('Entrando al post1');
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
    const directorio = await Gch_Alta.findAll({
        attributes: ['NOMBRE', 'PUESTO', 'REGION']
    });
    const resultadoGch = JSON.parse(JSON.stringify(directorio, null, 2));
    res.render('auth/directorio', {
        resultadoGch
    })
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
                console.log("Message sent: %s", info.messageId);
                // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.semail>
            }
            main().catch(console.error);
        });
    });
}

export default controller;