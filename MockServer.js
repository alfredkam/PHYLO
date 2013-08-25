console.log("Mock Server Starting");

var http = require("http");
var request = require("request");
var express = require("express");

var port = 9000;

var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static('./')); /* need to indicate the directory you will be serving */
app.use(express.logger());

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

console.log("Listening on port "+port);
app.listen(port);
