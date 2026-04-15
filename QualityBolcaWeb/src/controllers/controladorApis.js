const controlador = {};

controlador.prueba = (req, res) => {
    res.json({ ok: true, msg: "api de prueba" });
};

controlador.semanales = (req, res) => {
    res.json({ ok: true, msg: "api de prueba" });
}
export default controlador;