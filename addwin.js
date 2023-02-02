  // This created the submit form
    const electron = require('electron')
    const {ipcRenderer} = electron
    const form = document.querySelector('form');
    form.addEventListener('submit', submitForm);

    // This send to main js
    function submitForm(e) {
      e.preventDefault();
      let itemInfo = [];
      itemInfo.push(document.querySelector('#name').value);
      itemInfo.push(document.querySelector('#category').value);
      itemInfo.push(document.querySelector('#type').value);
      itemInfo.push(document.querySelector('#year').value);
      itemInfo.push(document.querySelector('#winery').value);
      itemInfo.push(document.querySelector('#purchased').value);
      itemInfo.push(document.querySelector('#rating').value);
      ipcRenderer.send('item:add', itemInfo);
    }

    function loadWineTypes() {
     
     // Red 
      const red = [
              "Cabernet",
              "Cabernet Sauvignon",
              "Chardonnay",
              "Malbec",
              "Merlot",
              "Sirah",
              "Pinot Noir",
              "Port",
              "Other Red Varietie",
              "Red Blends"
              ]

      // White
            const white = [
              "Riesling",
              "Sauvignon Blanc",
              "Verdelho",
              "Semillon",
              "Chardonnay",
              "Pinot Gris / Pinot Grigio",
              "OtherWhiteVarieties",
              "WhiteBlends"
              ]

      // Dessert
            const dessert = [
              "Eiswein (Ice Wine)",
              "Sauterne",
              "Other Dessert Varietie",
              "Dessert Blend",
            ] 

             let category = document.querySelector('#category').value;

            if(category == 'red') {
                removeOptions(document.querySelector('#type')); 
                red.forEach(function(item){
                    var selectTag = document.querySelector("#type");
                    var optionTag = document.createElement("option");
                    optionTag.innerText = item;
                    selectTag.appendChild(optionTag);
                });
            }

            if(category == 'white') {
                removeOptions(document.querySelector('#type')); 
                white.forEach(function(item){
                    var selectTag = document.querySelector("#type");
                    var optionTag = document.createElement("option");
                    optionTag.innerText = item;
                    selectTag.appendChild(optionTag);
                });
            }
            
            if(category == 'dessert') {
                removeOptions(document.querySelector('#type')); 
                dessert.forEach(function(item){
                    var selectTag = document.querySelector("#type");
                    var optionTag = document.createElement("option");
                    optionTag.innerText = item;
                    selectTag.appendChild(optionTag);
                });
            }            

    function removeOptions(selectElement) {
      var i, L = selectElement.options.length - 1;
          for(i = L; i >= 0; i--) {
             selectElement.remove(i);
          }
      }

    }

