function validarAcceso(campos){
return  (req, res, next) => {
  
    let permisosUsuario = null;
    try {
      permisosUsuario = JSON.parse(req.usuario.permisos)}
      catch(e){
        console.error('Error al parsear los permisos del usuario:', e);  
        return res.status(401).render('admin/default/permisos_insuficientes.ejs',{ error: 'Acceso denegado: usuario no autenticado o sin datos de acceso', _csrf: req.csrfToken() });
      }
    const {roles, permisos, jerarquia} = campos
    if (!permisosUsuario || (!roles || !permisos || !jerarquia)) {
      return res.status(401).render('admin/default/permisos_insuficientes.ejs',{ error: 'Acceso denegado: usuario no autenticado o sin datos de acceso', _csrf: req.csrfToken() });
    }
    if (permisosUsuario.roles.includes('administrador')) {
      return next();
    }
    const tieneRol = roles.length === 0 || roles.some(rol => permisosUsuario.roles?.includes(rol));
    const tienePermiso = permisos.length === 0 || permisos.some(permiso => permisosUsuario.permisos?.includes(permiso));
    const tieneJerarquia = permisosUsuario.jerarquia <= jerarquia  ? true: false;

    if (tieneRol && tienePermiso && tieneJerarquia) {
      return next();
    }

    return res.status(403).render('admin/default/permisos_insuficientes.ejs',{ error: 'Acceso denegado: permisos insuficientes' ,csrfToken: req.csrfToken() });
  };
}

export default validarAcceso;