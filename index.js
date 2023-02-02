//imports
const path = require('path');
const Settings = require('./settings.js');
const url = require('url');
let sqlite3 = require("sqlite3");
const fs = require('fs');
let knex = require("knex")({
    client: "sqlite3",
    connection:{
        filename:"./wine.db"
    },
    useNullAsDefault: true
});

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

//variables for windows
let mainWindow;
let addWindow;
let updateWindow;
let deleteWindow;

//CREATE WINDOWS
//Create the settings class
  const settings = new Settings({
  configName: 'user-preferences', //data file in app system folder
  defaults: {
    windowBounds: { width: 600, height: 600 }
  }
});

//function to create main window
function createWindow() {
     // GET dimensions from settings
   let {width, height} = settings.get('windowBounds');

  mainWindow = new BrowserWindow( {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('mainwindow.html');
  mainWindow.on('closed', function() {
    app.quit();
  })

    mainWindow.toggleDevTools();

   mainWindow.on('resize', () =>                                           //NEW
   {
      let {width, height} = mainWindow.getBounds();
      settings.set('windowBounds', {width, height});
   });
   
   mainWindow.webContents.on("did-finish-load", () => 
   {
      let savedTheme = settings.get("theme");
      mainWindow.webContents.insertCSS(savedTheme);
      mainWindow.webContents.send("showUsername", settings.get("currentUser"));
      console.log(settings.get("currentUser"));
   });  

  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
}


//function to create add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: 'Add Item',
	autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    },
  })

	addWindow.loadFile('addwindow.html');
	readDB()
	addWindow.on('close', function() {
		addWindow = null;
	})
}


//function to create update window
function createUpdateWindow(){
  updateWindow = new BrowserWindow({
    width: 500,
    height: 500,
	autoHideMenuBar: true,
    title: 'Update Pasta',
    webPreferences: {
      nodeIntegration: true
    },
  })

  updateWindow.loadFile('updateWindow.html')

  updateWindow.on('close', function() {
    updateWindow = null;
  })

}

//function to create delete window
function createDeleteWindow(){
  deleteWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: 'Delete Item',
	autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    },
  })

  deleteWindow.loadFile('deleteWindow.html')

  deleteWindow.on('close', function() {
    deleteWindow = null;
  })

}

//CRUD METHODS

//Create
ipcMain.on('item:add', function(e, itemInfo) {
  knex("wineTable").insert({
	  name: itemInfo[0],
	  category: itemInfo[1],
	  type: itemInfo[2],
    year: itemInfo[3],
    winery: itemInfo[4],
    purchased: itemInfo[5],
    rating: itemInfo[6]
  })
  .catch(err =>{
    console.log(err)
  })
  .then(() =>{
    readDB();
  })
  addWindow.close();
});

//Read
function readDB()
{
  clearWindow()
  let result = knex.select("WineID","name","category","type","year","winery","purchased","rating").from("wineTable")
  .catch(err =>{
    console.log(err)
  })
  result.then(function(rows){
      mainWindow.webContents.send('item:add',rows);
  })
}

//Search
ipcMain.on('item:search', function(e,id)
{
  let result = knex.select("WineID","Name","Category","Type","Year","Winery","Purchased","Rating").from("wineTable").where('WineID',id)
  .catch(err =>{
    console.log(err)
  })
  result.then(function(rows){
	  updateWindow.webContents.send('item:found',rows);
  })
})

//Update
ipcMain.on('item:update', function(e,itemInfo)
{  
  let id = itemInfo[0] //undefined
  knex("wineTable").where({"WineID": id}).update({
    category: itemInfo[1],
    type: itemInfo[2],
    year: itemInfo[3],
    winery: itemInfo[4],
    purchased: itemInfo[5],
    rating: itemInfo[6]
	  })

  .catch(err =>{
    console.log(err)
  })
  .then(() =>{
	readDB();
  })
	  updateWindow.close();
	  console.log(id +": Updated"); 
	  });


//Delete
ipcMain.on('item:delete', function(e, id){
  knex('wineTable').where({"WineID" : id}).del()
  .catch(err =>{
    console.log(err)
  })
  .then(() =>{
    deleteWindow.close();  
    console.log(id +": deleted");
	readDB();
  })
});

//Clear
function clearWindow()
{
    mainWindow.webContents.send('item:clear');
}//end function clearWindow


//Menu Template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Create',
        click() {createAddWindow()}
      },
      {
        label: 'Read',
        click(){readDB()}
      },
	  {
        label: 'Update',
        click(){createUpdateWindow()}
      },
	  {
        label: 'Delete',
        click(){createDeleteWindow()}
      },
	  {
        label: 'Clear',
        click(){clearWindow()}
      },

	  {
        label: 'Quit',
        click(){app.quit()}
      },
    
    {
        label: 'Themes',
    submenu: [
      {
        label: 'Winter',
        click() {winterTheme()}
      },
    {
        label: 'Spring',
        click() {springTheme()}
      },
      {
        label: 'Summer',
        click() {summerTheme()}
      },
    {
        label: 'Quit',
        click(){app.quit()}
      }
    ]
    } // end-sub 2
  ] // end-sub1
  }
  ]; // template 

app.on('ready', createWindow)


//Functions - you could also use these methods to switch entire
// CSS documents
// store setting and apply selected themes

function winterTheme()
{
    let themeCss = fs.readFileSync("./winter-theme.css").toString();
    console.log(themeCss);
    settings.set('theme', themeCss);
    mainWindow.webContents.insertCSS(themeCss);
  
}

function springTheme(){
    let themeCss =  fs.readFileSync("./spring-theme.css").toString();
  settings.set('theme', themeCss);
    mainWindow.webContents.insertCSS(themeCss);
    console.log(themeCss);
}

function summerTheme()
{
    let themeCss = fs.readFileSync("./summer-theme.css").toString();
    console.log(themeCss);
    settings.set('theme', themeCss);
    mainWindow.webContents.insertCSS(themeCss);
  
}


