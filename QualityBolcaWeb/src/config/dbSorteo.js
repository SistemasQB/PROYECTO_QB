import Sequelize from 'sequelize'
import dotenv from "dotenv";
dotenv.config({path: '.env'})

const dbSorteo = new Sequelize(process.env.BDSORTEO, process.env.BD_USER, process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: 3306,
    dialect: process.env.BD_DIALECT,
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


export default dbSorteo;