      const electron = require('electron');
      const {ipcRenderer} = electron;
      const ul = document.querySelector('ul');
    
      //catch add item
      ipcRenderer.on('item:add', function(e,items){//items is an ARRAY of objects
        items.forEach(function(item){//item is one element/object of the Array
          const li = document.createElement('li');
          const itemText = document.createTextNode(item.WineID+" "+item.Name + " "+item.Category+" "+item.Type+" "+item.Year+" "+item.Winery+" "+item.Purchased+" "+item.Rating);//ref property of obj
          li.appendChild(itemText);
          ul.appendChild(li);

        })
      });

          
      //clear
      ipcRenderer.on('item:clear', function(){
        ul.innerHTML = '';
      });

      

