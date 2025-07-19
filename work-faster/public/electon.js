const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require ('path');

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: 'Work Faster',
        width: 400,
        height:430.
    });

    const startUrl = url.format({
        pathname:path.join(__dirname,
            '../build/index.html'), //connect to the react app
            protocol: 'file',
            slashes: true,
    });

    mainWindow.loadURL(startUrl); //load app in electron window
}

app.whenReady().then(createMainWindow);