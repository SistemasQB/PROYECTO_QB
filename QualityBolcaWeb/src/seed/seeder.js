import categorias from './categorias.js'
import precios from './categorias.js'
import usuario from './usuarios.js'

import Categoria from '../models/categoria.js'
import Precios from '../models/precios.js'
import db from '../config/db.js'

import { usuario } from "../models/index.js";

// npm run db:importar

const importarDatos = async () =>{
    try {
        // Autenticar 
        await db.authenticate()
        //Generar las columnas
        await db.sync()
        // insertar los datos

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precios.bulkCreate(precios)
        ])

        console.log('Datos importados Correctamentes');
        exit()
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const eliminarDatos = async() =>{
    try {
        await Promise.all([
            Categoria.destroy({where: {}, truncate: true}),
            Precios.destroy({where: {}, truncate: true})
        ])

        // await db.sync({force: true})
        console.log('Datos Eliminados Correctamente');
        exit()
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

if (process.argv[2] === "-i") {
    importarDatos()
}
if (process.argv[2] === "-e") {
    eliminarDatos()
}
