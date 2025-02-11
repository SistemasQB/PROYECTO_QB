import Sequelize from 'sequelize'
import dotenv from "dotenv";
dotenv.config({path: '.env'})

const dbSQLS = new Sequelize(process.env.SQLSBD_NOMBRE, process.env.SQLSBD_USER, process.env.SQLSBD_PASS,{
    host: process.env.SQLSBD_HOST,
    port: process.env.SQLSPORT,
    dialect: 'mssql',
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


export default dbSQLS;


/*
SQLSPORT = 1433


SQLSBD_NOMBRE = 'ctQUALITY_BOLCA'
SQLSBD_USER = 'sistemasQB'
SQLSBD_PASS = 'inf*2023sistemas'
SQLSBD_HOST = '172.16.10.155'
*/