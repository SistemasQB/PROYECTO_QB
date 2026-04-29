import bcrypt from "bcrypt";
import barrilmodelosgenerales from '../models/generales/barrilModelosGenerales.js'
import { check, validationResult } from "express-validator";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword, emailContacto } from "../helpers/emails.js";
import Usuario from "../models/generales/modelo_usuarios.js";
import sequelizeClase from "../public/clases/sequelize_clase.js";
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
    try {
        const { codigoempleado, password } = req.body
        if (codigoempleado == '' || password == '') {
            res.status(400).send({ msg: 'Completa los campos', ok: false });
            return
        }
        
    //comporbar si el usuario existe
        const usuario = await barrilmodelosgenerales.usuarios.findOne({ where: { codigoempleado } })
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
        let redireccion = req.session.returnTo || '/inicio';
        delete req.session.returnTo
        if (typeof redireccion !== 'string' || !redireccion.startsWith('/')) {
            redireccion = '/inicio';
        }
        if(process.env.NODE_ENV === 'production'){
            res.cookie('_token', token, {httpOnly: true, secure: true,})    
            return res.status(200).send({ ok: true, redirect: redireccion });
        }
            res.cookie('_token', token, {httpOnly: true, secure: false,})
            return res.status(200).send({ ok: true, redirect: redireccion });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: 'Hubo un error', ok: false });
    }

}

controller.logout = async (req, res) => {
    res.clearCookie('_token');
    return res.json({
        ok: true,
        redirect: '/login'
    });
}

controller.formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        errores: '',
        usuario: '',
        csrfToken: req.csrfToken()
    })
}

controller.registrar = async (req, res) => {
    //validaciones
    await check('codigoempleado').notEmpty().withMessage('El Codigo de empleado no puede ir vacio').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contrseña debe tener minimo 6 caracteres').run(req);
    await check('confirm-password').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Las contraseñas no son iguales').run(req);

    let resultado = validationResult(req);
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            errores: resultado.array(),
            csrfToken: req.csrfToken()
        })
    }

    //Extraer los datos
    const { codigoempleado, password } = req.body
    
    //Verificar si el usuario ya esta registrado

    const gchUsuario = await barrilmodelosgenerales.modelonom10001.findOne({ where: { codigoempleado } })
    // const gchUsuario = await informaciongch.findOne({ where: { codigoempleado } })

    if (!gchUsuario) {
        res.status(400).send({ ok: false, msg: 'El usuario no Existe' });
        return
    }

    
    //Verificar que el usuario existe
    const existeUsuario = await Usuario.findOne({ where: { codigoempleado } })
    if (existeUsuario) {
        return res.status(400).send({ ok: false, msg: 'El usuario ya esta registrado' });
    }
    //validar el gchusuario para saber porque no esta dando el correo y porque esta fallando el envio de correo
    //Almacenar usuario
    const usuario = await Usuario.create({
        codigoempleado: codigoempleado,
        password,
        token: generarId()
    });

    //validar aqui
    // Enviar email de confirmacion
    emailRegistro({
        nombre: gchUsuario.nombrelargo,
        email: gchUsuario.correoelectronico,
        token: usuario.token
    })

    //Mostrando al usuario que confirme correo

    res.status(200).send({ ok: true, correo:gchUsuario.correoelectronico });
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

controller.formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        csrfToken: req.csrfToken(),
        errores: '' 
    })
}

controller.resetPassword = async (req, res) => {
    try {
        const { codigoempleado } = req.body
        let clase = new sequelizeClase({ modelo: barrilmodelosgenerales.usuarios});
        let usuario = await clase.obtener1Registro( { codigoempleado , raw:true})
        if (!usuario) {
            return res.status(400).send({ msg: 'No se encontro el usuario en la DB', ok: false });
        }
        usuario.token = generarId();
        const token = usuario.token
        console.log('el primer usuario es ', usuario)
        const actualizacion = await clase.actualizarDatos({ id: usuario.id, datos: { token: usuario.token }})
        if (!actualizacion){
            return res.status(400).send({ msg: 'Error al actualizar la informacion', ok: false });
        }
        clase = new sequelizeClase({modelo: barrilmodelosgenerales.modelonom10001})
        usuario = await clase.obtener1Registro({ criterio: { codigoempleado }, raw: true })
        //Enviar un email
        console.log(usuario)
        emailOlvidePassword({
            email: usuario.correoelectronico,
            nombre: usuario.nombrelargo,
            token: token
        })
        
        return res.status(200).send({ msg: 'Informacion enviada con exito', ok: true });
    } catch (error) {
        console.error(`sucedio un error en la clase sequelize,error: ${error}`)
        return res.status(400).send({ msg: 'Error al procesar la peticion', ok: false });
    }
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

controller.inicio = (req, res) => {
    res.render('auth/index', {
        csrfToken: req.csrfToken()
    })
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------

export default controller;