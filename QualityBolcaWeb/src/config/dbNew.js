import Sequelize from 'sequelize'
import dotenv from "dotenv";
dotenv.config({path: '.env'})

const dbNew = new Sequelize(process.env.DB_NEW, process.env.BD_USER, process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
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

export default dbNew;