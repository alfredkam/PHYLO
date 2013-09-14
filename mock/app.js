'use strict'

var http = require("http"),
    request = require("request"),
    express = require("express"),
    path = require('path');

var app = express();

//common configurations

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
   // app.use(express.logger());
});

app.configure('development', function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    /* need to indicate the directory you will be serving */
    app.use(express.static('../'));
    app.use(express.errorHandler());
});

// Mock
// app.post("/phpdb/phyloExpertDB.php",function(req, res){
//    res.send(200);
// });

/* Example of mocking http GET */
app.get("/", function(req, res){
    /* return your desired response */
    // using either res.send() or res.json()
    res.json({});
});

/* Example of mocking http POST */
app.post("/", function(req, res){
    /* return your desired response */
    // using either res.send() or res.json()
    res.json({});
});

/* Example of mocking http PUT */
app.put("/", function(req, res){
    /* return your desired response */
    // using either res.send() or res.json()
    res.json({});
});

/* Example of mocking http DELETE */
app.delete("/", function(req, res){
    /* return your desired response */
    // using either res.send() or res.json()
    res.json({});
});

//set server to listen to ...
http.createServer(app).listen(app.get('port'), function(){
    console.info('Express server listening on port '+ app.get('port'));
});