var demoObj = ["codeacademy", "edx", "udemy", "Bucky's room"];
var links = ["http://www.codecademy.com", "http://www.edx.org", "http://www.udemy.com", "https://www.thenewboston.com/videos.php"];

window.onload = function () {
  //document.getElementById("results").textContent = "changed results";
  console.log("Hello");
}

function demo(desc, url) {
  //document.getElementById("results");
  //get the reference for the search results
  var resultsList = document.getElementById("results");
  //create the list object
  var li = document.createElement("li");
  var a = document.createElement("a");
  var txt = "helloWorld ";
  var descText = document.createTextNode(txt);
  a.appendChild(descText);
  a.href = url;
  li.appendChild(a);
  resultsList.appendChild(li);
}

demo(demoObj[0], links[0]);

//only way to make sure local storage exists is to write to it, then check you get that value back.

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
        for (i = 0; i < len; i++) {
          demo(myObj[i].description, myObj[i].html_url);
        }
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



