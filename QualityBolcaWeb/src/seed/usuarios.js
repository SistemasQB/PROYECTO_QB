import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre: 'oscar',
        email: 'ockapapyr99@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios