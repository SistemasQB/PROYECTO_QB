import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../../config/db.js";

const Testcleaver = db.define('testcleaver', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estadoCivil:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sexo:{
        type: DataTypes.STRING(1),
        allowNull: false
    },
    edad:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    escolaridad:{
        type: DataTypes.STRING,
        allowNull: false
    },
    puesto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaNac:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Persuasivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Gentil:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Humilde:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Original:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Fuerza_de_Voluntad:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Mente_Abierta:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Complaciente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Animoso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Obediente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Quisquilloso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Inconquistable:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Jugueton:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Aventurero:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Receptivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Cordial:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Moderado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Agresivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Alma_de_la_Fiesta:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Comodino:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Temeroso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Confiado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Simpatizador:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Tolerante:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Afirmativo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Respetuoso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Emprendedor:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Optimista:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Servicial:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Indulgente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Esteta:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Vigoroso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Sociable:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Agradable:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Temeroso_de_Dios:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Tenaz:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Atractivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Ecuanime:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Preciso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Nervioso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Jovial:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Valiente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Inspirador:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Sumiso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Timido:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Parlanchin:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Controlado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Convencional:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Decisivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Cauteloso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Determinado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Convincente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Bonachon:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Disciplinado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Generoso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Animoso2:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Persistente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Adaptable:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Disputador:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Indiferente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Sangre_Liviana:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Cohibido:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Exacto:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Franco:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Buen_Companero:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Dócil:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Atrevido:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Leal:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Encantador:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Competitivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Alegre:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Considerado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Armonioso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Amiguero:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Paciente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Confianza_en_si_Mismo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Mesurado_para_Hablar:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Diplomatico:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Audaz:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Refinado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Satisfecho:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Dispuesto:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Deseoso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Consecuente:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Entusiasta:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Admirable:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Bondadoso:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Resignado:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Caracter_Firme:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Conforme:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Confiable:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Pacifico:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Positivo:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Inquieto:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Popular:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Buen_Vecino:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    Devoto:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
},{
    tableName: 'testcleaver',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Testcleaver;