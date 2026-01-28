function manejadorErrores(res, ex, vista = 'admin/default/vista_error.ejs' ){
    const statusCode = ex.status || ex.statusCode || 500;
    return res.status(statusCode).render(vista, {
        error: {
            mensaje: ex.message,
            stack: ex.stack,
            codigo: statusCode
        }
    });
}

export default manejadorErrores