// -----------------------------------------------------------------------------
// All below may still contain bugs or at least typos in the comments !!
// It should be sufficent to run our Webengineering lab Exercises, however you are
// very much invited to change this file..
// ~ thank you, that's what I'm about to do :)
//------------------------------------------------------------------------------
// This node.js application uses the express package as its implementation of a
// web server
// for more info, see: http://expressjs.com
// --------------------------------------------------------------
// Here we define all the required modules and services
var express = require('express');        // critical module for building a Web Server App
// Here are some basic packages we need together with express
var bodyParser = require('body-parser'); // helper routines to parse data as JSON in request body
var fetch = require('node-fetch');       // http Server requests similar to the Client Version
var basicAuth = require('express-basic-auth'); // Some basic HTTP Header Authorization
require('dotenv').config(); //DOTenv for including API keys
//----------------------------------------------------------------------------
// create a new express based Web Server
// ---------------------------------------------------------------------------
var app = express();
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');
// app.use('/static', express.static('/views/HTML'))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// -----------------------------------------------------------------------------
// The Code enables CORS, just in case you want to explore this
// option
// -----------------------------------------------------------------------------
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// -----------------------------------------------------------------------------
// the WebServer now listens to http://localhost:6001 / http gets and posts
// -----------------------------------------------------------------------------
var server = app.listen(6001, function() {
  console.log('Started server on port:', 6001);
  console.log('');
});
// -----------------------------------------------------------------------------
// The following serve for different url paths
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// localhost:6001/redirect
// will redirect us to the repository for this project on github
// -----------------------------------------------------------------------------
app.get('/redirect', function(req, res){
   res.redirect('https://github.com/zerklickt/web-engineering');
});
// -----------------------------------------------------------------------------
// localhost:6001/home
//  show start page
// -----------------------------------------------------------------------------
app.get('/home', function(req, res){
  var docname = "index.html";
  var options = {root: __dirname + '/public/'}
  res.sendFile(docname, options, function (err) { // send this file
   if (err) {
     res.send(err);
   }
 });
});
//------------------------------------------------------------------------------
// localhost:6001/proxy?url_to_be_proxied
// The incoming request will transfered using the fetch package
//------------------------------------------------------------------------------
app.all('/proxy', function(req, res){
  var decompose = req.originalUrl.split("?");
  var fullurl = decompose[1] + "?" + decompose[2];
  //console.log("Proxy Server reached", fullurl);
  fullurl = fullurl.replace("url=","");
  fetch(fullurl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
  })
  .then(checkStatus)  // do some basic status checking first.. throw an exception in case of trouble
  .then((response) => response.json())
  .then((json) => {res.send({error: null, status: json.status, response: json});
          })
  .catch((err) => {
    res.send({error: err, status: err, response: ""});
  });
  function checkStatus(response) {
      if (response.ok) { // res.status >= 200 && res.status < 300
          return response;
      } else {
          throw {message : response.statusText};
      }
  }
});
//------------------------------------------------------------------------------
// localhost:6001/api-proxy?url_to_be_proxied
// The incoming request will transfered using the fetch package
// This proxy is intented to be used for applying credentials (such as api keys) to external API requests
// While this proxy is based on the one that was provided already, some additions were made
//------------------------------------------------------------------------------
app.all('/api-proxy', function(req, res){
    var decompose = req.originalUrl.split("?");
    var fullurl = decompose[1] + "?" + decompose[2];
    //console.log("Api Proxy reached", fullurl);
    fullurl = fullurl.replace("url=","");
    
    //altered Code
    if(/^http[s]?:\/\/api\.openweathermap\.org\/.+/.test(fullurl)){
      fullurl += "&appid=" + process.env.API_OPENWEATHER_KEY;
      //console.log("└ Service: Weather\n");
    }

    /*
    // This was my first attempt, but it is quite insecure since the proxy does not check if the request is sent to the real weather api.
    // A hacker could simply set up a request to his own server with the service parameter specified and obtain the key, which is why I discarded it.

    var params = decompose[2].split("&");
    for(const param of params){
      //check if service parameter is specified
      if(param.split("=")[0] === "service"){
        const serviceName = param.split("=")[1];

        // Depending on the service that was intented to be queried, the corresponding API credentials from .env are applied
        switch(true){
          case (serviceName === "weather"):
            fullurl += "&appid=" + process.env.API_OPENWEATHER_KEY;
            console.log("└ Service: Weather\n");
            break;
          // apply more cases when dealing with more services
          default:
              break;
        }
        break;
      }
    }
    */

    fetch(fullurl, {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
    })
    .then(checkStatus)  // do some basic status checking first.. throw an exception in case of trouble
    .then((response) => response.json())
    .then((json) => {res.send(json);
            })
    .catch((err) => {
      res.send({error: err, status: err, response: ""});
    });
    function checkStatus(response) {
        if (response.ok) { // res.status >= 200 && res.status < 300
            return response;
        } else {
            throw {message : response.statusText};
        }
    }
});

app.get('*', function(req, res){
  var docname = "404.html";
  var options = {root: __dirname + '/public/'}
  res.sendFile(docname, options, function (err) { // send this file
   if (err) {
     res.send(err);
   } else {
     console.log('Unexpected request on', req.originalUrl,', sending 404');
   }
 });
});
