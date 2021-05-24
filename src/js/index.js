const { ipcRenderer, BrowserWindowProxy } = require('electron');
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain, MenuItem } = electron;
const path = require('path');
const url = require('url');
let optionsWindow;
let editStateDataWindow;
let overwriteStateDataWindow;
let addCsvToProblemFilesWindow;
require('update-electron-app')()

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createMainWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 650,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../html/index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  ipcMain.on('filesList:send', function (e, item) {
    //console.log(item);
    mainWindow.webContents.send('filesList:send');
    currentFileWindow.close();
    mainWindow.reload();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //insert Menu
  Menu.setApplicationMenu(mainMenu);


  //********************context menu*******************
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  mainWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(mainWindow, params.x, params.y)


  })

  //**************accessing localStorage(no use yet) */
  mainWindow.webContents
    .executeJavaScript('localStorage.getItem("speedMode");', true)
    .then(result => { console.log(`SpeedMode: ${result}`) });

  ipcMain.on('reloadOnClose', () => {
    app.relaunch()
    app.exit()

  })

};
const createCurrentFilesWindow = () => {
  currentFileWindow = new BrowserWindow({
    width: 400,
    height: 650,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Paste in or Clear Current Files '
  });
  currentFileWindow.loadFile(path.join(__dirname, '../html/currentFiles.html'));
  //currentFileWindow.webContents.openDevTools();
  //garbage collection
  currentFileWindow.on('closed', () => currentFileWindow = null);
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  currentFileWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(currentFileWindow, params.x, params.y)

  })

};
const createGuideWindow = () => {
  guideWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'A Helpful Guide'
  });
  guideWindow.loadFile(path.join(__dirname, '../html/guide.html'));
  guideWindow.maximize();
  //currentFileWindow.webContents.openDevTools();
  //garbage collection
  guideWindow.on('closed', () => guideWindow = null);
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  guideWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(guideWindow, params.x, params.y)

  })

};


const createAddendumWindow = () => {
  addendumWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Edit Addendum Text Here'
  });
  addendumWindow.loadFile(path.join(__dirname, '../html/addendum.html'));
addendumWindow.maximize();
  //addendumWindow.webContents.openDevTools();
  //garbage collection
  addendumWindow.on('closed', () => currentFileWindow = null);
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  addendumWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(addendumWindow, params.x, params.y)
  })

};
const createOptionsWindow = () => {
  optionsWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Paste in or Clear Current Files '
  });
  optionsWindow.loadFile(path.join(__dirname, '../html/options.html'));
  optionsWindow.maximize()
  //garbage collection
  optionsWindow.on('closed', () => optionsWindow = null);
};

const createTableWindow = () => {
  tableWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Upload Saved Data as CSV'
  });
  tableWindow.loadFile(path.join(__dirname, '../html/tableWindow.html'));
  tableWindow.maximize()

  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  tableWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(tableWindow, params.x, params.y)

  })
  //tableWindow.webContents.openDevTools();

  //garbage collection
  tableWindow.on('closed', () => tableWindow = null);
};
const createProblemFilesWindow = () => {
  problemFileWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Problem files'
  });

  problemFileWindow.loadFile(path.join(__dirname, '../html/problemFile.html'));
  problemFileWindow.maximize()
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  problemFileWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(problemFileWindow, params.x, params.y)

  })

  //currentFileWindow.webContents.openDevTools();


  //garbage collection
  problemFileWindow.on('closed', () => problemFileWindow = null);
};
const createIssuedFilesWindow = () => {
  issuedFileWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Issued files'
  });
  issuedFileWindow.loadFile(path.join(__dirname, '../html/issuedFiles.html'));
  issuedFileWindow.maximize()

  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  issuedFileWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(issuedFileWindow, params.x, params.y)

  })
  //currentFileWindow.webContents.openDevTools();
  //garbage collection
  issuedFileWindow.on('closed', () => issuedFileWindow = null);
};
const createReportPopUp = () => {
  createReportPopUpWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'View Issued Files Report'
  });
  createReportPopUpWindow.loadFile(path.join(__dirname, '../html/reportPopUp.html'));
  createReportPopUp.maximize()

  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  createReportPopUp.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(createReportPopUp, params.x, params.y)

  })

  // currentFileWindow.webContents.openDevTools();
  //garbage collection


  createReportPopUpWindow.on('closed', () => createReportPopUpWindow = null);
};


const createCheckCheckerPopUp = (fileObject) => {
  createCheckCheckerPopUpWindow = new BrowserWindow({
    width: 600,
    height: 300,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: '\"Doing the Money\"'
  });



  createCheckCheckerPopUpWindow.loadFile(path.join(__dirname, '../html/checkCheckerPopUp.html'));

  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))

  createCheckCheckerPopUpWindow.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(createCheckCheckerPopUpWindow, params.x, params.y)

  })



  // currentFileWindow.webContents.openDevTools();
  //garbage collection

  createCheckCheckerPopUpWindow.on('closed', () => createCheckCheckerPopUpWindow = null);
};



const createFileReportPopUp = () => {
  createFileReportPopUpWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'View Issued File to Copy and Save'
  });
  createFileReportPopUpWindow.loadFile(path.join(__dirname, '../html/reviewFile.html'));
  createFileReportPopUpWindow.maximize();
  //createFileReportPopUpWindow.webContents.openDevTools();
  //garbage collection

  createFileReportPopUpWindow.on('closed', () => createFileReportPopUpWindow = null);
};

const createClearProblemFilesWindow = () => {
  clearProblemFileWindow = new BrowserWindow({
    width: 400,
    height: 100,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Are you Sure?'
  });
  clearProblemFileWindow.loadFile(path.join(__dirname, '../html/clearProblemConfirmationPopUp.html'));
  //currentFileWindow.webContents.openDevTools();
  //garbage collection
  clearProblemFileWindow.on('closed', () => clearProblemFileWindow = null);
};
const createClearStateDataWindow = () => {
  clearStateDataWindow = new BrowserWindow({
    width: 500,
    height: 150,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Are you Sure?'
  });
  clearStateDataWindow.loadFile(path.join(__dirname, '../html/clearStoredDataConfiramtionPopup.html'));
  //currentFileWindow.webContents.openDevTools();
  //garbage collection
  clearStateDataWindow.on('closed', () => clearStateDataWindow = null);
};

const createAddCsvToProblemFilesWindow = () => {
  addCsvToProblemFilesWindow = new BrowserWindow({
    width: 500,
    height: 150,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Are you Sure?'
  });
  addCsvToProblemFilesWindow.loadFile(path.join(__dirname, '../html/addCsvtoproblemFilesConvirmationWindow.html'));
  //addCsvToProblemFilesWindow.webContents.openDevTools();
  //garbage collection
  addCsvToProblemFilesWindow.on('closed', () => addCsvToProblemFilesWindow = null);
};



const createOverwriteStateDataConfirmationWindow = () => {
  overwriteStateDataWindow = new BrowserWindow({
    width: 500,
    height: 150,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Are you Sure?'
  });
  overwriteStateDataWindow.loadFile(path.join(__dirname, '../html/overwriteStateDataConfirmationPopUp.html'));
  //overwriteStateDataWindow.webContents.openDevTools();
  //garbage collection
  overwriteStateDataWindow.on('closed', () => overwriteStateDataWindow = null);
};

ipcMain.on('openOverwriteConfirmationWindow', function () {
  createOverwriteStateDataConfirmationWindow()
});
ipcMain.on('closeOverwriteConfirmation', function () {
  overwriteStateDataWindow.close()
});

ipcMain.on('openAddProblemFilesConfirmationWindow', function () {
  createAddCsvToProblemFilesWindow()
});
ipcMain.on('closeAddProblemFilesConfirmationWindow', function () {
  addCsvToProblemFilesWindow.close()
});

ipcMain.on('clearProblemFiles:send', function () {
  createClearProblemFilesWindow()
});

ipcMain.on('viewReportPopUp:send', function () {
  createReportPopUp()
});


ipcMain.on('viewCheckCheckerPopUp:send', function (viewCheckCheckerPopUp) {
  createCheckCheckerPopUp(viewCheckCheckerPopUp)
});
ipcMain.on('openAddendumWindow:send', function () {
  createAddendumWindow()
});

ipcMain.on('viewFileReportPopUp:send', function () {
  createFileReportPopUp()
});

ipcMain.on('closeAfterClearProblemFiles:send', (e) => {
  clearProblemFileWindow.close()
  problemFileWindow.close()
});

ipcMain.on('problemFileAdd:send', (e) => {
  problemFileWindow.close()
  mainWindow.reload();
})


ipcMain.on('closeProblems', () => {
  problemFileWindow.close()

})
ipcMain.on('addProblemFiles:send', () => {
  problemFileWindow.close()
});


const createEditBtnsWindow = () => {
  currentFileWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'enter button info to add to main screen'
  });
  currentFileWindow.loadFile(path.join(__dirname, '../html/editBtns.html'));
  //currentFileWindow.webContents.openDevTools();
  //garbage collection
  currentFileWindow.on('closed', () => currentFileWindow = null);
};
const createEditStateDataWindow = () => {
  editStateDataWindow = new BrowserWindow({
    width: 400,
    height: 800,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Edit State Specific Data'
  });
  editStateDataWindow.loadFile(path.join(__dirname, '../html/editStateData.html'));
  // currentFileWindow.webContents.openDevTools();
  //garbage collection
  editStateDataWindow.on('closed', () => editStateDataWindow = null);
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//Create Menu Template 
const mainMenuTemplate = [
  {
    label: 'Files',
    submenu: [
      {
        label: 'Update Current Files List',
        click() {
          createCurrentFilesWindow();
        }
      },
      {
        label: 'View Problem Files',
        click() {
          createProblemFilesWindow();
        }
      },
      {
        label: 'View Issued Files',
        click() {
          createIssuedFilesWindow();
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: '&Edit',
    submenu: [
      {
        label: 'Edit Copy Buttons',
        click() {
          createEditBtnsWindow();
        }
      },
      {
        label: 'Edit State Data',
        click() {
          createEditStateDataWindow();
        }
      },
      {
        label: 'Options',
        click() {
          createOptionsWindow();
        }
      },
      {
        label: 'Addendum Text',
        click() {
          createAddendumWindow();
        },
      },
        {
        label: 'View and Uploaded saved file data',
        click() {
          createTableWindow();
        }
      }
      
      
]
  },
{
  label: 'Links',
    submenu: [
      {
        label: 'Fidelity Rate Calc',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://ratecalculator.fnf.com/')
        }
      },
      {
        label: 'FATICO Rate Calc',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://facc.firstam.com/')
        }
      },
      {
        label: 'AgentTrax(FNF)',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://login.agenttrax.com/')
        }
      }, {
        label: 'AgentNet(FATICO)',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://agency.myfirstam.com/')
        }
      }, {
        label: 'Florida Rate Calc',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://www.fntgflorida.com/')
        }
      }
    ]
},
{
  label: '&Help',
    submenu: [
      {
        label: 'DON\'T PANIC',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://random.dog/')
        }
      },
      {
        label: 'A Helpful Guide',
        click() {
          createGuideWindow()
        }
      }

    ]
}

];
// If mac, add empty item to menu
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

//add dev tools if not in prodcumtion
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
ipcMain.on('closeOptions', () => {
  optionsWindow.close()
})

ipcMain.on('restartApp', () => {
  app.relaunch()
  app.exit()
})
ipcMain.on('closeClearStateDataWindow', () => {
  clearStateDataWindow.close()
})

ipcMain.on('openClearStoredStateDataConfirmationPopUp:send', () => {
  createClearStateDataWindow()
})