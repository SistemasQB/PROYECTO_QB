import nodeCron from "node-cron";

class miCron{
    constructor() {
    this.cron = nodeCron;
    this.jobs = {}; // aquí guardamos los jobs activos
  }

  // Crear y registrar un nuevo job
  iniciarCron(nombre, recurrencia, accion) {
    if (this.jobs[nombre]) {
      console.log(`Ya existe un job con el nombre: ${nombre}`);
      return;
    }

    const job = this.cron.schedule(recurrencia, () => {
      accion();
    }, {
      timezone: "America/Mexico_City"
    });

    this.jobs[nombre] = job;
    console.log(`Job "${nombre}" iniciado con recurrencia "${recurrencia}"`);
  }

  // Ejecutar manualmente la acción de un job
  ejecutarManual(nombre, accion) {
    if (!this.jobs[nombre]) {
      console.log(`No existe el job: ${nombre}`);
      return;
    }
    accion();
    console.log(`Job "${nombre}" ejecutado manualmente`);
  }

  // Detener un job
  detenerJob(nombre) {
    if (this.jobs[nombre]) {
      this.jobs[nombre].stop();
      console.log(`Job "${nombre}" detenido`);
    } else {
      console.log(`No existe el job: ${nombre}`);
    }
  }

  // Reiniciar un job
  reiniciarJob(nombre) {
    if (this.jobs[nombre]) {
      this.jobs[nombre].start();
      console.log(`Job "${nombre}" reiniciado`);
    } else {
      console.log(`No existe el job: ${nombre}`);
    }
  }

  // Eliminar un job
  eliminarJob(nombre) {
    if (this.jobs[nombre]) {
      this.jobs[nombre].stop();
      delete this.jobs[nombre];
      console.log(`Job "${nombre}" eliminado`);
    } else {
      console.log(`No existe el job: ${nombre}`);
    }
  }
}


module.exports = miCron;


