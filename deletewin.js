const {ipcRenderer} = require('electron')
const knex = require("knex")({
    client: "sqlite3",
    connection:{
        filename:"./wine.db"
    },
    useNullAsDefault: true
});

// Submit button
const deleteButton = document.getElementById("deleteButton");

// Button event listeners
deleteButton.addEventListener('click', deletePasta);


// Delete Pasta
function deletePasta(){
	var pID = parseInt(document.getElementById("wine_id").value);
	ipcRenderer.send('item:delete', pID) //call to index.js
	
}
