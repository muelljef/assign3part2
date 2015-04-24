var globalGist = [];

window.onload = function () {
  //document.getElementById("results").textContent = "changed results";
  console.log("Hello");
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
  //filter the results for a language
  var languages = [];
  filterResults(languages);
  //get the reference for the search results
  var resultsList = document.getElementById("results");
  var i;
  var len = globalGist.length;
  for(i = 0; i < len; i++){
    if (globalGist[i].hasLang === true) {
      var desc = globalGist[i].description;
      var url = globalGist[i].html_url;
      //create the list object
      var li = document.createElement("li");
      var a = document.createElement("a");
      if (desc === "") {
        desc = "NO DESCRIPTION";
      }
      var descText = document.createTextNode(desc);
      a.appendChild(descText);
      a.href = url;
      li.appendChild(a);
      resultsList.appendChild(li);
    }
  }
}

function getPublicGists() {
  //create the request
  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to get HTTP request';
  }
  //define what happens when the request is received
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      // everything is good, the response is received
      if (req.status === 200) {
        var myObj = JSON.parse(req.responseText);
        globalGist = myObj;
        writeResults(myObj);
      } else {
        // there was a problem with the request,
        // for example the response may contain a 404 (Not Found)
        // or 500 (Internal Server Error) response code
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
  req.open('GET', 'https://api.github.com/gists/public', true);
  req.send(null);
}