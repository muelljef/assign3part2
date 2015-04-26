//initializing global variables
var globalGist = [];
var favorites = [];
var localCheck = "true";
var pagesDisplay;
var languages = [];

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

//function removes the favorite with given gistId
//calls saves the favorites (to local)
//calls write favorites (to html) to update page
function removeFavorite(gistId) {
  var i;
  var len = favorites.length;
  for (i = 0; i < len; i++) {
    if (favorites[i].id === gistId) {
      break;
    }
  }
  favorites.splice(i, 1);
  saveFavorites();
  writeFavorites();
}

//function gets the gist of the current object
//calls function to remove favorite
function getGistAndRemoveFromFavorites() {
  var gistId = this.getAttribute("gistId");
  removeFavorite(gistId);
}

//Function to write the favorites to html
function writeFavorites() {
  //get the reference for the search results
  var favoritesDiv = document.getElementById("favorites");
  //clear the div
  favoritesDiv.innerHTML = '';
  //declaring variables needed
  var i, desc, url, id, div, button, a, descText;
  var len = favorites.length;
  for (i = 0; i < len; i++) {
    //set desc, url, and id
    desc = favorites[i].description;
    url = favorites[i].html_url;
    id = favorites[i].id;
    //create a div for the result
    div = document.createElement("div");
    div.id = id;
    //create the button and append it
    button = document.createElement("button");
    button.setAttribute("gistId", id);
    button.innerHTML = "- unfav";
    button.onclick = getGistAndRemoveFromFavorites;
    div.appendChild(button);
    //create the description and link
    a = document.createElement("a");
    if (desc === "") {
      desc = "NO DESCRIPTION";
    }
    descText = document.createTextNode(desc);
    a.appendChild(descText);
    a.href = url;
    div.appendChild(a);
    //append the div to the html
    favoritesDiv.appendChild(div);
  }
}

//Functions to run when window loads
window.onload = function () {
  //check if local storage is accessible, let user know if it's not
  localStorage.setItem('check', localCheck);
  if (localStorage.getItem('check') !== "true") {
    alert('local storage is not accessible, favorites will not work');
  }
  //check if there is a favorites in local storage and load it
  if (localStorage.getItem("favorites")) {
    favorites = JSON.parse(localStorage.getItem("favorites"));
  }
  //write the favorites to the html
  writeFavorites();
};

//Filter the results by languages
function filterResults() {
  var i, j, prop;
  var langLen = languages.length;
  var len = globalGist.length;
  //create boolean for all objects
  for (i = 0; i < len; i++) {
    //initiate boolean to true, if there are no filters
    //results will display because next loop should not start.
    globalGist[i].hasLang = true;
  }

  //an iteration for each language
  for (j = 0; j < langLen; j++) {
    //iterate over all objects
    for (i = 0; i < len; i++) {
      //iterate over all properties in the .files, essentially check all files
      for (prop in globalGist[i].files) {
        //check if the .files has its own property
        if (globalGist[i].files.hasOwnProperty(prop)) {
          if (globalGist[i].files[prop].language === languages[j]) {
            globalGist[i].hasLang = true;
          } else if (j === 0) {
            //if there is at least 1 language to filter
            //set boolean to false on first iter
            //if the language is not found.
            globalGist[i].hasLang = false;
          }
        }
      }
    }
  }
}

//check for favorites. This flags the results
//so favorites are filtered from the results
//when writeResults is called
function checkFavorites() {
  var i, j;
  var len = globalGist.length;
  var favLen = favorites.length;
  for (i = 0; i < len; i++) {
    //initialize favorited status to false
    globalGist[i].favorited = false;
    for (j = 0; j < favLen; j++) {
      if (globalGist[i].id === favorites[j].id) {
        //make favorited status true if favorited
        globalGist[i].favorited = true;
      }
    }
  }
}


//This function finds and favorites the gist
function favoriteResult(gistId) {
  var i;
  var len = globalGist.length;
  //find the favorite
  for (i = 0; i < len; i++) {
    if (globalGist[i].id === gistId) {
      break;
    }
  }
  //add it to the favorites array
  favorites.push(globalGist[i]);
  //save the favorites locally
  saveFavorites();
  //write the new favorites to screen
  writeFavorites();
  //update the favorites flag on results
  checkFavorites();
  //write the results
  writeResults();
}

function getGistandFavorite() {
  //identify the gist to be favorited
  var gistId = this.getAttribute("gistId");
  favoriteResult(gistId);
}

function writeResults() {
  var desc, url, id, descText, div, button, a;
  //get the reference for the search results
  var resultsDiv = document.getElementById("results");
  //clear the div
  resultsDiv.innerHTML = '';
  var i;
  var len = pagesDisplay * 30;
  for (i = 0; i < len; i++) {
    if (globalGist[i].hasLang === true && globalGist[i].favorited === false) {
      desc = globalGist[i].description;
      url = globalGist[i].html_url;
      id = globalGist[i].id;
      //create a div for the result
      div = document.createElement("div");
      div.id = id;
      //create the button and append it
      button = document.createElement("button");
      button.setAttribute("gistId", id);
      button.innerHTML = "+ fav";
      button.onclick = getGistandFavorite;
      div.appendChild(button);
      //create the description and link
      a = document.createElement("a");
      if (desc === "") {
        desc = "NO DESCRIPTION";
      }
      descText = document.createTextNode(desc);
      a.appendChild(descText);
      a.href = url;
      div.appendChild(a);
      //append the div to the html
      resultsDiv.appendChild(div);
    }
  }
}

//AJAX objects edited to based on course lectures and thenewBoston tutorials
//nested server requests were used to get results from two different pages
function createXMLHttpRequestObject() {
  var xml;
  //a try catch block to alert the user if the HTTP request couldn't be made
  try {
    xml = new XMLHttpRequest();
  } catch (e) {
    xml = false;
  }
  if (!xml) {
    alert("Can't create the request object");
    //throw 'Unable to get HTTP request';
  }
  return xml;
}

//create the request
var req = createXMLHttpRequestObject();
var req2 = createXMLHttpRequestObject();

function handleServerResponse2() {
  var temp, i, len;
  if (req2.readyState === 4) {
    if (req2.status === 200) {
      //convert the response
      temp = JSON.parse(req2.responseText);
      i = 0;
      len = temp.length;
      //push all the responses onto the globalGist
      //pushing because there will be two server
      //responses and I don't want to save over the
      //first
      for (i; i < len; i++) {
        globalGist.push(temp[i]);
      }
      //filter the results for a language
      filterResults();
      //filter the favorites from the results
      checkFavorites();
      //write the results to the page
      writeResults(globalGist);
    }
  }
}

function getPublicGists2() {
  //url to get page 2 with 75 gists
  var url2 = 'https://api.github.com/gists/public?page=2&per_page=75';
  //settings for the server request
  req2.open('GET', url2, true);
  req2.onreadystatechange = handleServerResponse2;
  req2.send(null);
}

function handleServerResponse() {
  var temp, i, len;
  if (req.readyState === 4) {
    if (req.status === 200) {
      //convert the response
      temp = JSON.parse(req.responseText);
      i = 0;
      len = temp.length;
      //push all the responses onto the globalGist
      //pushing because there will be two server
      //responses and I don't want to save over the
      //first
      for (i; i < len; i++) {
        globalGist.push(temp[i]);
      }
      //Now that the first response is finished,
      //make the 2nd server request
      getPublicGists2();
    }
  }
}

function getPublicGists() {
   //url to get page 2 with 75 gists
  var url = 'https://api.github.com/gists/public?page=1&per_page=75';
  //settings for the server request
  req.open('GET', url, true);
  req.onreadystatechange = handleServerResponse;
  req.send(null);
}

function getLanguages() {
  //The languages to be checked
  var checks = ['Python', 'JSON', 'JavaScript', 'SQL'];
  var i;
  //if the language is selected at it to the languages array
  //the array is used in the filter function
  for (i = 0; i < checks.length; i++) {
    if (document.getElementsByName(checks[i])[0].checked === true) {
      languages.push(document.getElementsByName(checks[i])[0].value);
    }
  }
}

function searchGists() {
  //get user entry for pages of results to display
  var pages = document.getElementsByName('quantity')[0].value;
  pagesDisplay = parseInt(pages, 10);
  //clear the languages array for new search
  while (languages.length > 0) {
    languages.pop();
  }
  //clear the globalGist array for new search
  while (globalGist.length > 0) {
    globalGist.pop();
  }
  //get user languages
  getLanguages();
  //make the server request if info is valid
  if (typeof pagesDisplay === 'number' &&
      pagesDisplay >= 1 &&
      pagesDisplay <= 5) {
    getPublicGists();
  } else {
    alert("You did not enter a valid # of pages");
  }
}