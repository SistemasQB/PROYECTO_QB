import jwt from "jsonwebtoken";


const generarId = () => Date.now().toString(32) + Math.random().toString().substring(2);

const generarJWT = (id, email) => jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '1d'
})

export {
    generarId,
    generarJWT
}