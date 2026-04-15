class custonFunctions{
    constructor(){
        this.functions = {}
    }

    static async peticionJson(liga, cabezales = {}){
        return fetch(liga,{
            method: 'GET',
            headers: cabezales
        })
        .then(resp =>{ 
            const tipoDato = resp.headers.get('content-type');
            if (tipoDato && tipoDato.includes('application/json')){
                return resp.json();
            }
            resp.json()
        })
        .then(res => {
            if(typeof res === 'object'){
                const cambio = res.bmx.series[0].datos[0].dato
                return cambio;
            }else{
                return res;
            }
            
        }).catch(err => console.log(err));
    }
    static async peticionTipoCambioPorFecha(dia){
        return await fetch(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/${dia}/${dia}`,
        {method: 'GET', headers: {method: 'GET', 'Bmx-Token': process.env.tokenBanxico}}).then(
            res => res.json().then(
                (res) => {
                    console.log('llego antes de la respuesta',res)
                    return res.bmx.series[0].datos[0].dato}
            )
        ).catch(err => console.log(err));
    }

    static generarFechas(numMesInicio, anioInicio ){
        const inicio = new Date(anioInicio, numMesInicio, 1);
        const fin = new Date(anioInicio, numMesInicio + 1, 1);
        return {inicio, fin}
    }

    static getSafeRedirect(req) {
        let redirectUrl = req.session.returnTo || '/inicio';
        delete req.session.returnTo;

        // Validar que sea una ruta interna
        if (typeof redirectUrl !== 'string' || !redirectUrl.startsWith('/')) {
            return redirectUrl = '/inicio';
        }

        // Opcional: lista blanca de rutas permitidas
        // const allowedPaths = ['/inicio', '/reportes', '/perfil'];
        // if (!allowedPaths.includes(redirectUrl)) {
        //     redirectUrl = '/inicio';
        // }

        // return redirectUrl;
}



}

export default custonFunctions;