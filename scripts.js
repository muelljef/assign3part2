var globalGist = [];
var favorites = [];

window.onload = function () {
  if (localStorage.getItem("favorites")) {
    favorites = JSON.parse(localStorage.getItem("favorites"));
  }
  writeFavorites();
}

//only way to make sure local storage exists is to write to it, then check you get that value back.

function filterResults(lang) {
  var i, j;
  var langLen = lang.length;
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
      for (var prop in globalGist[i].files) {
        //check if the .files has its own property (part of org obj, not added to prototype)
        if (globalGist[i].files.hasOwnProperty(prop)) {
          if (globalGist[i].files[prop].language === lang[j]) {
            globalGist[i].hasLang = true;
          } else if (j === 0) {
            //if there is at least 1 language to filter, set boolean to false on first iter
            //if the language is not found.
            globalGist[i].hasLang = false;
          }
        }
      }
    }
  }
}

function writeResults() {
  //get the reference for the search results
  var resultsDiv = document.getElementById("results");
  //from https://coderwall.com/p/nygghw/don-t-use-innerhtml-to-empty-dom-elements. claims code is faster
  //for removing all elements than resultsDiv.innerHTML = ''
  while (resultsDiv.firstChild) resultsDiv.removeChild(resultsDiv.firstChild);
  var i;
  var len = globalGist.length;
  for(i = 0; i < len; i++){
    if (globalGist[i].hasLang === true && globalGist[i].favorited === false) {
      var desc = globalGist[i].description;
      var url = globalGist[i].html_url;
      var id = globalGist[i].id;
      //create a div for the result
      var div = document.createElement("div");
      div.id = id;
      //create the description and link
      var a = document.createElement("a");
      if (desc === "") {
        desc = "NO DESCRIPTION";
      }
      var descText = document.createTextNode(desc);
      a.appendChild(descText);
      a.href = url;
      div.appendChild(a);
      //create the button and append it
      var button = document.createElement("button");
      button.setAttribute("gistId", id);
      button.innerHTML = "+ fav";
      button.onclick = function () {
        //identify the gist to be favorited
        var gistId = this.getAttribute("gistId");
        favoriteResult(gistId);
      };
      div.appendChild(button);
      //append the div to the html
      resultsDiv.appendChild(div);
    }
  }
}

function writeFavorites() {
  //get the reference for the search results
  var favoritesDiv = document.getElementById("favorites");
  //from https://coderwall.com/p/nygghw/don-t-use-innerhtml-to-empty-dom-elements. claims code is faster
  //for removing all elements than favoritesDiv.innerHTML = ''
  while (favoritesDiv.firstChild) favoritesDiv.removeChild(favoritesDiv.firstChild);
  var i;
  var len = favorites.length;
  for (i = 0; i < len; i++) {
    var desc = favorites[i].description;
    var url = favorites[i].html_url;
    var id = favorites[i].id;
    //create a div for the result
    var div = document.createElement("div");
    div.id = id;
    //create the description and link
    var a = document.createElement("a");
    if (desc === "") {
      desc = "NO DESCRIPTION";
    }
    var descText = document.createTextNode(desc);
    a.appendChild(descText);
    a.href = url;
    div.appendChild(a);
    //create the button and append it
    var button = document.createElement("button");
    button.setAttribute("gistId", id);
    button.innerHTML = "- unfav";
    button.onclick = function () {
      var gistId = this.getAttribute("gistId");
      removeFavorite(gistId);
    };
    div.appendChild(button);
    //append the div to the html
    favoritesDiv.appendChild(div);
  }
}

function getPublicGists() {
  //create the request
  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to get HTTP request';
  }
  //var pages = document.getElementsByName('quantity')[0].value;
  var url = 'https://api.github.com/gists/public';
  /*if (x === 0) {
    var url = 'https://api.github.com/gists/public?page=1&per_page=100';
  } else if (x === 1) {
    var url = 'https://api.github.com/gists/public?page=2&per_page=100';
  }*/
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        //convert the response
        globalGist = JSON.parse(req.responseText);
        //filter the results for a language
        var languages = [];
        filterResults(languages);
        //filter the favorites from the results
        checkFavorites();
        //write the results to the page
        writeResults(globalGist);
      } else {
        // there was a problem with the request,
        // for example the response may contain a 404 (Not Found)
        // or 500 (Internal Server Error) response code
        alert("request status error");
      }
    } else {
      // still not
    }
  }
  //Make the request to the server
  /*for getting multple pages will need to use url variable with url = 'https://api.github.com/gists/public' to start
  then use url += '?' urlStringify(params);
  params = {
    numPages: (user selected value);
    replace the url in req.open with the variable url
  */

  req.open('GET', url, true);
  req.send(null);
}

function favoriteResult(gistId) {
  var i;
  var len = globalGist.length;
  for (i = 0; i < len; i++) {
    if (globalGist[i].id === gistId) {
      break;
    }
  }
  favorites.push(globalGist[i]);
  saveFavorites();
  writeFavorites();
  checkFavorites();
  writeResults();
}

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
  //should I add writeResults to have the unfavorited return?
}

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

function saveFavorites(){
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
