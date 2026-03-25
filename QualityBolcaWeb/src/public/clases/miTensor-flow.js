import * as tf from '@tensorflow/tfjs-node';
import * as cocossd from '@tensorflow-models/coco-ssd';
import mobilenet from '@tensorflow-models/mobilenet';
import fs from 'fs';
import path from 'path';



class miTensorFlowClasificacion {
  constructor({imagenesOk, imagenesNG,imgSize = 224}) {
    this.imgSize = imgSize;
    this.model = null;
    this.imagenesOk = imagenesOk;
    this.imagenesNG = imagenesNG;
    this.extraerFeatures = null;
    if(!this.imagenesOk || !this.imagenesNG) throw new Error('se requieren las rutas de imagenes');
    
  }
  async crearModelo() { //transfer learning
    try {
    const baseModel = await mobilenet.load({ version: 2, alpha: 1.0 });

    // Función para extraer embeddings
    this.extraerFeatures = (imgTensor) => baseModel.infer(imgTensor, true);

    // Clasificador encima de los embeddings
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [1280] }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(0.0001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
    console.log("✅ Modelo con transfer learning creado");
  } catch (error) {
    throw new Error(error);
  }

}


  crearModeloDe0() {
  try {
    const model = tf.sequential();
    // BLOQUE 1: Captura de formas básicas (bordes, colores)
    model.add(tf.layers.conv2d({
      inputShape: [this.imgSize, this.imgSize, 3],
      filters: 32,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));
    //filtros
    model.add(tf.layers.batchNormalization()); // Estabiliza el aprendizaje
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    
    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    
    model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    // capa de clasificacion
    model.add(tf.layers.flatten());
    
    // Capa densa con Dropout (evita vicio)
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 })); // Apaga neuronas al azar para que el modelo sea más fuerte
    
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(0.0001), // Un learning rate más bajo para que no se pase de largo aprendiendo
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
    console.log("✅ Modelo creado");
  } catch (error) {
    throw new Error(error);
  }
}

//🔹 Cargar imágenes desde carpeta
  async cargarImagenesDeCarpeta(folderPath, label) { //INDEPENDIENTE
    try {
        const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
        const images = [];
        for (const file of files) {
          console.log(folderPath,file);
          const filePath = path.join(folderPath, file);
          const buffer = fs.readFileSync(filePath);
          const imageTensor = tf.node.decodeImage(buffer, 3)
            .resizeBilinear([this.imgSize, this.imgSize]) //resizeNearestNeighbor
            .toFloat()
            .div(tf.scalar(255.0));

          images.push({ tensor: imageTensor, label });
        }
      return images;  
    } catch (error) {
      throw new Error(error);
    }
    
  }

  // 🔹 Preparar dataset
  async cargarSet() { //INDEPENDIENTE
    try {
      const defectos = await this.cargarImagenesDeCarpeta(this.imagenesNG, 0); 
      const normales = await this.cargarImagenesDeCarpeta(this.imagenesOk, 1); 
      const allData = defectos.concat(normales); 
      
      const baseModel = await mobilenet.load({ version: 2, alpha: 1.0 });
      this.extraerFeatures = (imgTensor) => baseModel.infer(imgTensor, true).squeeze();

      // 🔹 Pasar cada imagen por MobileNet y eliminar la dimensión extra
      const features = allData.map(d => this.extraerFeatures(d.tensor).squeeze()); 
      const xs = tf.stack(features);  // ahora xs = [batch, 1280]
      const ys = tf.tensor1d(allData.map(d => d.label), 'float32'); 

      console.log('set cargado correctamente');
      console.log('xs shape:', xs.shape); // debería ser [N, 1280]
      console.log('ys shape:', ys.shape); // debería ser [N]
      return { xs, ys };  

    } catch (error) {
      throw new Error(error);
    }
    
  }

  

  // 🔹 Entrenar modelo
  async entrenarModelo(xs, ys, epochs = 25) { //REQUIERE MODELO CARGADO
    try {
      if (!this.model) throw new Error('Modelo no cargado');
    await this.model.fit(xs, ys, {
      epochs,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: tf.callbacks.earlyStopping({ patience: 3 })
    });

    console.log("✅ Entrenamiento completo");
    } catch (error) {
      throw new Error(error);
    }
    
  }

  // 🔹 Guardar modelo
  async guardarModelo(path) { //REQUIERE MODELO CARGADO
    await this.model.save(`file://${path}`);
    console.log(`✅ Modelo guardado en ${path}`);
  }

  // 🔹 Cargar modelo
  async cargarModelo(path) {
    const baseModel = await mobilenet.load({ version: 2, alpha: 1.0 });
    this.extraerFeatures = (imgTensor) => baseModel.infer(imgTensor, true).squeeze();

    this.model = await tf.loadLayersModel(`file://${path}`);
    console.log("✅ Modelo cargado");
  }

  // 🔹 Evaluar imagen nueva
  async prediccion(imagePath) { //requieres modelo cargado
    const buffer = fs.readFileSync(imagePath);
    const imgTensor = tf.node.decodeImage(buffer, 3)
      .resizeBilinear([this.imgSize, this.imgSize])
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();
    const features = this.extraerFeatures(imgTensor).squeeze().expandDims(); // [1,1280]
    const prediction = this.model.predict(features);
    const prob = prediction.dataSync()[0];
    console.log('prediccion completada')
    return prob;
  }
}

  // 🔹 Crear modelo CNN
  // crearModelo() {//INDEPENDIENTE
  //   try {
  //     const model = tf.sequential();
  //   model.add(tf.layers.conv2d({
  //     inputShape: [this.imgSize, this.imgSize, 3],
  //     filters: 32,
  //     kernelSize: 3,
  //     activation: 'relu'
  //   }));
  //   model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  //   model.add(tf.layers.conv2d({
  //     filters: 64,
  //     kernelSize: 3,
  //     activation: 'relu'
  //   }));
  //   model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  //   model.add(tf.layers.conv2d({
  //     filters: 128, 
  //     kernelSize: 3,
  //     activation: 'relu'
  //   }));
  // model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  //   model.add(tf.layers.flatten());
  //   model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  //   model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  //   model.compile({
  //     optimizer: tf.train.adam(),
  //     loss: 'binaryCrossentropy',
  //     metrics: ['accuracy']
  //   });

  //   this.model = model;
  //   } catch (error) {
  //     throw new Error(error);  
  //   }
    
  // }
class miTensorFlowContador {
  constructor() {
    this.detector = null;
  }

  async cargarDetectorPreentrenado() {//independiente
    this.detector = await cocossd.load();
    console.log("✅ Detector de objetos cargado");
  }

  async contarPiezas(imagePath) { //ideal si tuviera el detector cargado si no se carga en automatico
    if (!this.detector) await this.cargarDetectorPreentrenado();

    const buffer = fs.readFileSync(imagePath);
    const imgTensor = tf.node.decodeImage(buffer, 3).expandDims();

    const predictions = await this.detector.detect(imgTensor);

    // Aquí puedes filtrar por la clase que más se parezca a tus piezas
    const piezas = predictions.filter(p => p.class === "bottle" || p.class === "cup");

    return piezas.length;
  }
}

const utilidadesTensorFlow = {
  miTensorFlowClasificacion,
  miTensorFlowContador
  
};

export default utilidadesTensorFlow;
