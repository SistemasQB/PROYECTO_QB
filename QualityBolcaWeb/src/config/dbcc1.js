import Sequelize from 'sequelize'
import dotenv from "dotenv";
dotenv.config({path: '.env'})

const dbcc1 = new Sequelize(process.env.BDCC1_NOMBRE, process.env.BDCC1_USER, process.env.BDCC1_PASS,{
    host: process.env.BDCC1_HOST,
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


export default dbcc1;