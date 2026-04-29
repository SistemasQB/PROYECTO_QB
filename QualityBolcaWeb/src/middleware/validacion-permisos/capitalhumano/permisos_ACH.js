function parsear(raw) {
    if (!raw) return {}
    try { return typeof raw === 'string' ? JSON.parse(raw) : raw }
    catch { return {} }
}

/**
 * Solo jefes y supervisores (de cualquier área) pueden crear requisiciones.
 * Verifica que permisos.permisos incluya 'jefe' o 'supervisor'.
 */
export function soloSolicitantes(req, res, next) {
    const p       = parsear(req.usuario?.permisos)
    const niveles = Array.isArray(p.permisos) ? p.permisos.map(x => x.toLowerCase()) : []

    const roles = Array.isArray(p.roles) ? p.roles.map(x => x.toLowerCase()) : []

    if (roles.includes('administrador') || niveles.includes('jefe') || niveles.includes('supervisor')) return next()

    return res.status(403).render('admin/default/permisos_insuficientes.ejs', {
        error: 'Solo jefes, supervisores y administradores pueden crear requisiciones de personal.',
        csrfToken: req.csrfToken()
    })
}

/**
 * Solo el jefe de ACH puede autorizar o rechazar requisiciones.
 * Verifica que roles incluya 'ach' Y permisos incluya 'jefe'.
 */
export function soloAutorizadoresACH(req, res, next) {
    const p       = parsear(req.usuario?.permisos)
    const roles   = Array.isArray(p.roles)    ? p.roles.map(x => x.toLowerCase())   : []
    const niveles = Array.isArray(p.permisos) ? p.permisos.map(x => x.toLowerCase()) : []

    if (roles.includes('ach') && niveles.includes('jefe')) return next()

    return res.status(403).render('admin/default/permisos_insuficientes.ejs', {
        error: 'No tienes permisos para autorizar requisiciones.',
        csrfToken: req.csrfToken()
    })
}

/**
 * Permite acceso a jefes/supervisores de cualquier área
 * Y al jefe de ACH. Usada en el GET para decidir qué vista renderizar.
 */
export function accesoACH(req, res, next) {
    const p       = parsear(req.usuario?.permisos)
    const roles   = Array.isArray(p.roles)    ? p.roles.map(x => x.toLowerCase())   : []
    const niveles = Array.isArray(p.permisos) ? p.permisos.map(x => x.toLowerCase()) : []

    const esAutorizadorACH = roles.includes('ach') && niveles.includes('jefe')
    const esSolicitante    = roles.includes('administrador') || niveles.includes('jefe') || niveles.includes('supervisor')

    if (esAutorizadorACH || esSolicitante) return next()

    return res.status(403).render('admin/default/permisos_insuficientes.ejs', {
        error: 'No tienes acceso al módulo de Atracción de Capital Humano.',
        csrfToken: req.csrfToken()
    })
}
