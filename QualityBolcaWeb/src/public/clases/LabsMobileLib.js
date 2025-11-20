import fetch from "node-fetch";
class LabsMobileLib {
    mifetch = fetch()
    constructor(){
         
    }
    
    enviarSms(){
        mifetch('',{
            method: '',
            body: ''
        }).then((data) => {
            console.log(data)
        })
    }

}

export default LabsMobileLib;