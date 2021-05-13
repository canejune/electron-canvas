
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
      posY = e.offsetY < 20 ? 0 : e.offsetY - 20;
      drawBox(posY);      
      updateContents(lines, posY, posY + 30)      ;
    } 
  });

  myCanvas.addEventListener('mousedown', (e) => {
    if (e.buttons !== 0) {
      posY = e.offsetY < 20 ? 0 : e.offsetY - 20;
      drawBox(posY);
      updateContents(lines, posY, posY + 30)      ;
    } 
  });

}

window.onresize = function () {
  myCanvas.width = 80;
  myCanvas.height = window.innerHeight - 20;

  drawBox(posY);
}


const {ipcRenderer, TouchBarSlider} = require('electron');

let rexTable = []
let lines = []

ipcRenderer.on('rexTable', (event, rt) => {
  rexTable = rt;
  console.log(rexTable);
  lines = []
})

ipcRenderer.on('parsedLine', (event, line) => {
    lines.push(line);
    const searchResultsTable = document.getElementById('search_results_table');

    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    fgRGB = rexTable[line.indexSearchTable[0]].fgRGB;
    bgRGB = rexTable[line.indexSearchTable[0]].bgRGB;
    td3.style.color = `rgb(${fgRGB[0]},${fgRGB[1]},${fgRGB[2]})`
    td3.style.backgroundColor  = `rgb(${bgRGB[0]},${bgRGB[1]},${bgRGB[2]})`

    td1.appendChild(document.createTextNode(`${line.lineNumber}`));
    td2.appendChild(document.createTextNode(`${line.timeMs}`));
    td3.appendChild(document.createTextNode(`${line.line}`));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    searchResultsTable.appendChild(tr);
});

function updateContents(lines, start, end) {
  const searchResultsTable = document.getElementById('search_results_table');
  searchResultsTable.innerHTML = ''
  lines.slice(start, lines.length < end ? lines.length : end).forEach(line => {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    fgRGB = rexTable[line.indexSearchTable[0]].fgRGB;
    bgRGB = rexTable[line.indexSearchTable[0]].bgRGB;
    td3.style.color = `rgb(${fgRGB[0]},${fgRGB[1]},${fgRGB[2]})`
    td3.style.backgroundColor  = `rgb(${bgRGB[0]},${bgRGB[1]},${bgRGB[2]})`

    td1.appendChild(document.createTextNode(`${line.lineNumber}`));
    td2.appendChild(document.createTextNode(`${line.timeMs}`));
    td3.appendChild(document.createTextNode(`${line.line}`));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    searchResultsTable.appendChild(tr);
  });
}