import Sequelize from 'sequelize'
import dotenv from "dotenv";
dotenv.config({path: '.env'})

const dbCompras = new Sequelize(process.env.BD_COMPRAS, process.env.BD_USER, process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timpestamps: true
    },
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});


export default dbCompras;