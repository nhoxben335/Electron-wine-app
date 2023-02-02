const {ipcRenderer} = require('electron')
const knex = require("knex")({
    client: "sqlite3",
    connection:{
        filename:"./wine.db"
    },
    useNullAsDefault: true
});

// Submit buttons
const searchButton = document.getElementById("searchButton");
const updateButton = document.getElementById("updateButton");

// Button event listeners
searchButton.addEventListener('click', searchWine);
updateButton.addEventListener('click', updateWine);

// Search Pasta
function searchWine(){
	var pID = parseInt(document.getElementById("wine_id_search").value);
	ipcRenderer.send('item:search', pID) //call to index.js
}

// Update Pasta - send to main.js
function updateWine(){
        let itemInfo = [];
		
		itemInfo.push(document.getElementById('wine_id_found').value); 	
		itemInfo.push(document.getElementById('wine_name').value); 
		itemInfo.push(document.getElementById('wine_category').value); 
		itemInfo.push(document.getElementById('wine_type').value); 
		itemInfo.push(document.getElementById('wine_year').value);
		itemInfo.push(document.getElementById('wine_winery').value);
		itemInfo.push(document.getElementById('wine_purchased').value);   
		itemInfo.push(document.getElementById('wine_rating').value); 

		ipcRenderer.send('item:update', itemInfo);
}

//Received from main.js
ipcRenderer.on('item:found', (event, rows) => {
	rows.forEach(function(row){
		
		document.getElementById('wine_id_found').value = row.WineID; 	
		document.getElementById('wine_name').value = row.Name; 
		document.getElementById('wine_category').value = row.Category; 
		document.getElementById('wine_type').value = row.Type; 
		document.getElementById('wine_year').value = row.Year; 
		document.getElementById('wine_winery').value = row.Winery; 
		document.getElementById('wine_purchased').value = row.Purchased;
		document.getElementById('wine_rating').value = row.Rating;  

	})
})

