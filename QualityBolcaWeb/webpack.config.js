import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default{
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js'
    },
    output:{
        filename: '[name].js',
        path: path.resolve('./src/public/js')
    },
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules')
        ],
        extensions: ['.js'],
    }
}