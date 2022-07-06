var data =[];
var lat = [];
var lon = [];
var markers = [];
var filterDiv = document.querySelector(".filters");
var storeList = document.querySelector(".store-list");

var mapFunctions = {
  
  fetchData : function (){
    fetch("stores.json")
 .then(response => {
   return response.json();
 })
 .then(jsondata =>  {
    data = jsondata; 
    this.generateFilter(data);
    this.populateStoreList(data);
    this.loadMap(data);
   });
},

generateFilter :  function (data) {
  var n = data.length;
  var uniqueCategories = [];
  var filterArray = [];
  var category = [];
  for(var i = 0; i< n; i++){
    filterArray.push(data[i].category);
    uniqueCategories = [...new Set(filterArray)];
  }


  let list = document.createElement("ul");
  list.classList.add("categories");  

  for(var i = 0; i< uniqueCategories.length; i++){
    let listItem = document.createElement("li");
    listItem.innerText = uniqueCategories[i];
    listItem.addEventListener('click',this.categoryClicked);
    list.appendChild(listItem);   
    filterDiv.appendChild(list);  
  }
},

categoryClicked : function(event){
  let filterdData = mapFunctions.filterByCategory(event.target.innerText);
  mapFunctions.populateStoreList(filterdData);
},

populateStoreList: function(data){
 
 if(storeList){
    storeList.innerHTML = "";
 }

  for(var i = 0; i< data.length; i++){
   
  var storeHtml = ` <div class="store-list__item" data-index="${i}">
                    <img src="${data[i].image}">
                    <div class="store-details">
                    <p>${data[i].name}</p>
                    <span>${data[i].properties.description}</span>
                    </div>
                    </div>`;
  storeList.innerHTML +=storeHtml; 
    
  } 
 
  this.storeListEvent();
},

storeListEvent : function (){
  var list;
  list = document.getElementsByClassName("store-list__item");
  // for(var i = 0; i< list.length; i++){
  //   list[i].addEventListener("click", function (event){ mapFunctions.openMapPopup(event) });
  // }

  document.querySelectorAll('.store-list__item').forEach(item => {
    item.addEventListener('click', event => {
      mapFunctions.openMapPopup(event) ;
    });
  })


},

openMapPopup : function(event){
  console.log(event.target);
   var indexVal = event.target.dataset.index;

  if(markers.length){
   console.log(indexVal);
    markers[indexVal].openPopup();
  }
  console.log(indexVal);
},

filterByCategory :  function (category){  
  return data.filter(store => store.category == category);
 },

loadMap : function (data) {

  var popupHtml; 
  var map = L.map('map').setView([data[0].location.coordinates.x, data[0].location.coordinates.y], 8);
  mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
     L.tileLayer(
    'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=1tH1BN6AxbhIjK55sSvH', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);

  for (var i = 0; i < data.length; i++) {
    popupHtml = '<div style="width:100%">\
    <div><b>Store Name: </b>' + data[i].name + '</br></div>\
    <div><b>Category: </b>'+ data[i].category+'</div>\
    <div><b>Address: </b> ' + data[i].properties.address + '.</div></div>\
    </div>';
    marker = new L.marker([data[i].location.coordinates.x, data[i].location.coordinates.y]).bindPopup(popupHtml).addTo(map);
    markers.push(marker);
  }

}
}

mapFunctions.fetchData();