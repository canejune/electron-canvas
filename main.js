const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs')
const es = require('event-stream')

// require('electron-reload')(__dirname);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Open Log File',
          click: () => {
            dialog.showOpenDialog(
                {
                  properties: ['openFile']
                }).then(result => {
                    if (!result.canceled) {
                        console.log(result.filePaths)
                        startTimeMs = -1;
                        mainWindow.webContents.send('rexTable', rexTable);
                        readFile(result.filePaths[0])
                    }
                }).catch(err => {
                  console.log(err)
                })
        }},
        { role: 'quit' }
      ]
    },
     { role: 'editMenu' },
     { role: 'viewMenu' },
     { role: 'windowMenu' },
     { role: 'help' }
    ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

};

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})





var totalLine = 0;

rexTable = [
  {
    rex: /GlMeSrdAsicinit/,
    option:'rex',
    mode: 'show',
    fgRGB: [0, 0, 0],
    bgRGB: [255, 255, 255],
  },
  {
    rex: /elapsed/,
    option:'rex',
    mode: 'show',
    fgRGB: [255, 0, 0],
    bgRGB: [255, 255, 255],
  },
  {
    rex: /Error/,
    option:'rex',
    mode: 'show',
    fgRGB: [0, 0, 0],
    bgRGB: [255, 0, 0],
  },
  {
    rex: /AddCrcRequest/,
    option:'rex',
    mode: 'show',
    fgRGB: [0, 0, 255],
    bgRGB: [255, 255, 255],
  },
];

let parsedLines = [];
let startTimeMs =  -1;

function parseLine(line, lineNumber) {
  const regexTime = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/;
  let found = [];
  let parsedLine = null;

  for (i in rexTable) {
    r = line.search(rexTable[i].rex);
    if (r >= 0) {
      found.push(i);
    }
  }

  if (found.length > 0) {
    let timeMs = new Date(line.match(regexTime)[0]).getTime();
    if (startTimeMs < 0) {
      startTimeMs = timeMs;
    }
    //console.log(lineNumber, ' : ', found, ' : ', timeMs, ' : ', line);
    parsedLine = {
      lineNumber: lineNumber,
      timeMs: timeMs - startTimeMs,
      indexSearchTable: found,
      line : line
    };
    parsedLines.push(parsedLine);
  }
  return parsedLine;
}

function readFile(filePath) {
  let s = fs.createReadStream(filePath)
  .pipe(es.split())
  .pipe(
    es.mapSync( line => {
        totalLine++;
        //console.log(line);
        let pl = parseLine(line, totalLine);
        if (pl) {
          mainWindow.webContents.send('parsedLine', pl);
        }
    })
    .on('error', err => {
        console.log(err);
    })
    .on('end', () => {
        console.log('Read All');
        console.log(totalLine);
    })
  )
}
