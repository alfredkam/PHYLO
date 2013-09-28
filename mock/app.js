'use strict'
var USE_REALSERVER = false;
var $ = require("jquery");
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

/* start of mocking routes */

// app.post("/phpdb/phyloExpertDB.php",function(req, res){
//    res.send(200);
// });

/* Example of mocking http GET */
app.get("/", function(req, res){
    /* return your desired response */
    // using either res.send() or res.json()
    res.json({});
});
app.get("/phpdb/openPhyloClassicDB.php",function(req,res){
        if(USE_REALSERVER){
        $.ajax({
            url:"http://phylo.cs.mcgill.ca/phpdb/openPhyloClassicDB.php",
            //dataType:"json"
            }).done(function(data){
                res.send(data);

            });
        }
        else{
        res.send(JSON.stringify(

            {"Brain":["1","2","3","50","51"],
            "Metabolic": ["4", "5", "6", "7"],
            "Blood": ["47", "48", "49", "61"],
            "Heart": ["53", "54", "70"],
            "": ["60", "64", "157", "169"],
            "Muscles": ["65", "66", "67"],
            "Cancer": ["89", "100", "126"],
            "Digestive": ["99", "114"],
            "Respiratory": ["1195", "1196"],
            "Bone": ["1228", "1229", "1230"]
            })
            );

        }
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
/* end of mocking routes */

//set server to listen to ...
http.createServer(app).listen(app.get('port'), function(){
    console.info('Express server listening on port '+ app.get('port'));
});
