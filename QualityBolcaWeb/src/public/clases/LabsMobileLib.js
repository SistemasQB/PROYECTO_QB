import fetch from "node-fetch";

class LabsMobileLib {
    constructor({username = process.env.LABUSER, password = process.env.LABKEY}) {
        this.username = username;
        this.password = password;
        this.apiUrl = "https://api.labsmobile.com/json/send";
    }

    async enviarSms({mensaje = "mensaje de prueba", destinatario = [{msisdn: "4492733698"}]}) {
        try {
            const respuesta = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + Buffer.from(`${this.username}:${this.password}`).toString("base64")
                },
                body: JSON.stringify({
                    message: mensaje,
                    recipient: destinatario
                })
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);
            return data;
        } catch (error) {
            console.error("Error enviando SMS:", error);
        }
    }

    async envioGrupal(mensaje, numeros) {
        return this.enviarSms({
            mensaje,
            destinatario: numeros.map(num => ({ msisdn: num }))
        });
    }
}

export default LabsMobileLib;