import Sequelize from 'sequelize'
import dotenv from "dotenv";
dotenv.config({path: '.env'})

const dbVentas = new Sequelize(process.env.BD_VENTAS, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT || 3306,
    dialect: process.env.BD_DIALECT,
    define: { timestamps: false },
    pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
    operatorAliases: false,
    logging: false,
});

export default dbVentas;
