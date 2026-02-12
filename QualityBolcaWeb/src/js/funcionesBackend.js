class custonFunctions{
    constructor(){
        this.functions = {}
    }

    static peticionJson(liga, cabezales = {}){
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

}

export default custonFunctions;