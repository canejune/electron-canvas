
let myCanvas;
let myCanvasCtx;
var posY = 0;

function drawBox(posY) {
  myCanvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  myCanvasCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  myCanvasCtx.fillRect(0, posY, 80, 40);
}

window.onload = function () {
  myCanvas = document.getElementById('canvas');
  myCanvasCtx = myCanvas.getContext('2d');

  myCanvas.width = 80;
  myCanvas.height = window.innerHeight - 20;
  
  drawBox(posY);

  myCanvas.addEventListener('mousemove', (e) => {
    if (e.buttons !== 0) {
      posY = e.offsetY;
      drawBox(posY);      
    } 
  });

  myCanvas.addEventListener('mousedown', (e) => {
    if (e.buttons !== 0) {
      posY = e.offsetY;
      drawBox(posY);      
    } 
  });

}

window.onresize = function () {
  myCanvas.width = 80;
  myCanvas.height = window.innerHeight - 20;

  drawBox(posY);
}