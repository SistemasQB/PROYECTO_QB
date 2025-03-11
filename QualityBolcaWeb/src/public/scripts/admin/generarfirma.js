document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('signatureCanvas');
  const placeholderText = document.getElementById('placeholderText');
  const clearButton = document.getElementById('clearButton');
  const downloadButton = document.getElementById('downloadButton');
  
  let ctx = canvas.getContext('2d');
  let isDrawing = false;
  let hasDrawn = false;
  
  // Obtener el código de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code') || 'default';

  // Inicializar canvas
  function initCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
  }
  
  // Manejar redimensionamiento de ventana
  function handleResize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Guardar dibujo actual
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Redimensionar canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Restaurar configuración de contexto y dibujo
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.drawImage(tempCanvas, 0, 0);
  }
  
  // Comenzar a dibujar
  function startDrawing(e) {
    isDrawing = true;
    
    let clientX, clientY;
    
    if (e.type === 'touchstart') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  }
  
  // Dibujar
  function draw(e) {
    if (!isDrawing) return;
    
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevenir desplazamiento en dispositivos táctiles
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    
    if (!hasDrawn) {
      hasDrawn = true;
      placeholderText.style.display = 'none';
      downloadButton.disabled = false;
    }
  }
  
  // Dejar de dibujar
  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.closePath();
  }
  
  // Limpiar canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn = false;
    placeholderText.style.display = 'flex';
    downloadButton.disabled = true;
  }
  
  // Descargar firma como WEBP con metadatos
  async function downloadSignature() {
    if (!hasDrawn) return;
    
    try {
      // Crear un blob con los metadatos
      const metadata = new Blob([JSON.stringify({ code })], { type: 'application/json' });
      
      // Crear un ImageBitmap del canvas
      const imageBitmap = await createImageBitmap(canvas);
      
      // Crear un OffscreenCanvas
      const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
      const offscreenCtx = offscreen.getContext('2d');
      
      // Dibujar el ImageBitmap en el OffscreenCanvas
      offscreenCtx.drawImage(imageBitmap, 0, 0);
      
      // Crear un blob con la imagen y los metadatos
      const imageBlob = await offscreen.convertToBlob({
        type: 'image/webp',
        quality: 0.95
      });
      
      // Combinar la imagen y los metadatos
      const finalBlob = new Blob([imageBlob, metadata], { type: 'image/webp' });
      
      // Crear y hacer clic en el enlace de descarga
      const url = URL.createObjectURL(finalBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `signature_${code}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al crear o descargar la imagen:', error);
      alert('Hubo un error al descargar la imagen. Por favor, intente de nuevo.');
    }
  }
  
  // Inicializar
  initCanvas();
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  
  // Eventos de ratón
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  
  // Eventos táctiles
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
  
  // Eventos de botones
  clearButton.addEventListener('click', clearCanvas);
  downloadButton.addEventListener('click', downloadSignature);
});