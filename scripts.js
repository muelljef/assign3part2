window.onload = function () {
  //document.getElementById("results").textContent = "changed results";
  console.log("Hello");
}

//only way to make sure local storage exists is to write to it, then check you get that value back.

function filterResults(filterObj, lang) {
  var i, j;
  var langLen = lang.length;
  var len = filterObj.length;
  //create boolean for all objects
  for (i = 0; i < len; i++) {
    //initiate boolean to false
    filterObj[i].hasLang = false;
  }

  //an iteration for each language
  for (j = 0; j < langLen; j++) {
    //iterate over all objects
    for (i = 0; i < len; i++) {
      //iterate over all properties in the .files, essentially check all files
      for (var prop in filterObj[i].files) {
        //check if the .files has its own property (part of org obj, not added to prototype)
        if (filterObj[i].files.hasOwnProperty(prop)) {
          if (filterObj[i].files[prop].language == lang[j]) {
            filterObj[i].hasLang = true;
          }
        }
      }
    }
  }
  return filterObj;
}

function writeResults(resultObj) {
  //document.getElementById("results");
  //get the reference for the search results
  var filtObj = filterResults(resultObj, ["JSON", "HTML", "JavaScript"]);
  var resultsList = document.getElementById("results");
  var i;
  var len = resultObj.length;
  for(i = 0; i < len; i++){
    if (filtObj[i].hasLang === true) {
      var desc = resultObj[i].description;
      var url = resultObj[i].html_url;
      //create the list object
      var li = document.createElement("li");
      var a = document.createElement("a");
      if (desc === "") {
        desc = "blank";
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
        var i;
        var myObj = JSON.parse(req.responseText);
        var len = myObj.length;
        /*for (i = 0; i < len; i++) {
          demo(myObj[i].description, myObj[i].html_url);
        }*/
        writeResults(myObj);
        //console.log(typeof (myObj));
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



