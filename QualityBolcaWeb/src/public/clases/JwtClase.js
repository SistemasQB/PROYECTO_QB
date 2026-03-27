import JWT from "jsonwebtoken";

class JwtClase {
    constructor() {}
    static generarLinkReporte(id) {
      return JWT.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "60d",
      });   
    }
    static validarToken(token) {
      return JWT.verify(token, process.env.JWT_SECRET);
    }
}