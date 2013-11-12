'use strict'
var USE_REALSERVER = false;
var $ = require("jquery");
var http = require("http"),
    request = require("request"),
    express = require("express"),
    path = require('path'),
    phpExpress = require('php-express')({
            binPath: '/usr/bin/php' // php bin path.
        });

var app = express();

//common configurations
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.set("views",path.join(__dirname, '../'));
    app.engine('php', phpExpress.engine);
    app.set('view engine', 'php');
   // app.use(express.logger());
});

app.configure('development', function(){
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
app.get("/expert/ajax/fetch", function(req, res){
    res.json([["TAGCACTTTGGGAGGCTGAGGTAGGCAGATTGCCTAAGCTCAGGTGTTCAAGACCACCCTAGGCAACATGGTGAAACCCTGTCTCTACTAAAATAC-------AAAAAAAAAAAAAAAAATGGTGGCACACATCTGTAGTC-CCA----GCTACTTGAGAGGCTGAAGCAGGA---GAATCGCTTGAACTCGGGAGGTGGAGGCTGTAGTGAGCCA---AG------------ACTCCAGCCTGGGTGACAGAGCAAGACCCTGTCTCAAAA---AATAAATAAATAAAATACAAAA-AA",["TAGCACTTTGGGAGGCTGAGGTAGGCAGATTGCCTAAGCTCAGGAGTTCGAGACCACCCTAGGCACCATGGTGAAACCCTGTCTCTACTAAAAAAA----AAAAAAAAAAAAAAAAAAAATGGTGGCACACATCTGTAGTC-CCA----GCTACTTGGGAGGCTGAGACAGAA---GAATCACTTAAACTCGCAAGGCGGAGGTTGTAGTGAGCCG---AG------------ATTCCAGCCTGGGTGACAGAGCAAGACCCCGTTCTAAAAATAAATAAATAAATAAAATACAAAA-AA","TAGCACTTTGGGAGGCTGAGGTAGGCAGATTGCCTAAGCTCAGGAGTTCGAGACCACCCTAGGCACCATGGTGAAACCCTGTCTCTACTAAA-----------AATAAAATTTTAAAAAATGGTGGTACACATCTGTAGTC-CCA----GCTACTTGGGAGGCTGAGACAGAA---GAATCACTTGAACTCGCAAGGCGGAGGTTGTAGTGAGCCG---AG------------ATTCCAGCCTGGGTGACAGAGCAAGACCCCGTTCTAAAAATAAATAAATAAATAAAATACAAAA-AA"]],"TAGCAC-TTGGGAGGCTGAGGCAGGCAGATTGCCTGAGCTCAGGAGTTTGAGACCACCCTGGG-------------CCGTGTCTCTACTAAAATAC----------------AAAAAAATTGGTGGCATATATCTGTAGTC-CCA----GCTACTTGGGAGGCTGAGACAGGA---GAATCACTTGAACTCAGGAGGTAGAGGTTACAGTGAGCCA---AG------------CCTGCAGCCTAGGTGACAAAGCAGGACTCCGTCTCAAAA------AAATAAATAAAAAACAAAATCA"]);
});
app.get("/dist/expert/ajax/fetch", function(req, res){
    res.json([["TAGCACTTTGGGAGGCTGAGGTAGGCAGATTGCCTAAGCTCAGGTGTTCAAGACCACCCTAGGCAACATGGTGAAACCCTGTCTCTACTAAAATAC-------AAAAAAAAAAAAAAAAATGGTGGCACACATCTGTAGTC-CCA----GCTACTTGAGAGGCTGAAGCAGGA---GAATCGCTTGAACTCGGGAGGTGGAGGCTGTAGTGAGCCA---AG------------ACTCCAGCCTGGGTGACAGAGCAAGACCCTGTCTCAAAA---AATAAATAAATAAAATACAAAA-AA",["TAGCACTTTGGGAGGCTGAGGTAGGCAGATTGCCTAAGCTCAGGAGTTCGAGACCACCCTAGGCACCATGGTGAAACCCTGTCTCTACTAAAAAAA----AAAAAAAAAAAAAAAAAAAATGGTGGCACACATCTGTAGTC-CCA----GCTACTTGGGAGGCTGAGACAGAA---GAATCACTTAAACTCGCAAGGCGGAGGTTGTAGTGAGCCG---AG------------ATTCCAGCCTGGGTGACAGAGCAAGACCCCGTTCTAAAAATAAATAAATAAATAAAATACAAAA-AA","TAGCACTTTGGGAGGCTGAGGTAGGCAGATTGCCTAAGCTCAGGAGTTCGAGACCACCCTAGGCACCATGGTGAAACCCTGTCTCTACTAAA-----------AATAAAATTTTAAAAAATGGTGGTACACATCTGTAGTC-CCA----GCTACTTGGGAGGCTGAGACAGAA---GAATCACTTGAACTCGCAAGGCGGAGGTTGTAGTGAGCCG---AG------------ATTCCAGCCTGGGTGACAGAGCAAGACCCCGTTCTAAAAATAAATAAATAAATAAAATACAAAA-AA"]],"TAGCAC-TTGGGAGGCTGAGGCAGGCAGATTGCCTGAGCTCAGGAGTTTGAGACCACCCTGGG-------------CCGTGTCTCTACTAAAATAC----------------AAAAAAATTGGTGGCATATATCTGTAGTC-CCA----GCTACTTGGGAGGCTGAGACAGGA---GAATCACTTGAACTCAGGAGGTAGAGGTTACAGTGAGCCA---AG------------CCTGCAGCCTAGGTGACAAAGCAGGACTCCGTCTCAAAA------AAATAAATAAAAAACAAAATCA"]);
});
app.get("/", function(req, res){
    /* return your desired response */
    // using either res.send() or res.json()
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'Mock+Developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Twitter', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.json({});
});
app.get("/dist", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'Mock+Developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Twitter', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.json({});
})

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
app.get("/phpdb/openPhyloClassicStatus.php", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'Mock+Developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Twitter', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.json(
        {"total":110514,"last":[{"user":"LouisSloboda","PuzzleID":"695","date":"2013-10-03","diseaseCategory":"Cancer","diseaseName":"BRCA1"},{"user":"jerome","PuzzleID":"1219","date":"2013-10-03","diseaseCategory":null,"diseaseName":"BRCA1"},{"user":"LouisSloboda","PuzzleID":"737","date":"2013-10-03","diseaseCategory":"Cancer","diseaseName":"p53-1"},{"user":"Guest","PuzzleID":"174","date":"2013-10-03","diseaseCategory":"Cancer","diseaseName":"P53-1"},{"user":"jerome","PuzzleID":"481","date":"2013-10-03","diseaseCategory":"","diseaseName":"p53-1"}]}
    );
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

/* render php / expert mock*/
// we also mock the login
app.get("/expert/welcome", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/welcome.php");
});
app.get("/expert/playmenu", function(req, res){
    // cookie to be accessible by client side
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/playmenu.php");
});
app.get("/expert/interactive-dev",function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("mock/expert/interactive-dev.mock.php");
});
app.get("/expert/history", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/history.php");
});
app.get("/expert/about", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/about.php");
});
//mock the dist directory
app.get("/dist/expert/welcome", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/welcome.php");
});
app.get("/dist/expert/playmenu", function(req, res){
    // cookie to be accessible by client side
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/playmenu.php");
});
app.get("/dist/expert/interactive-dev",function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("mock/expert/interactive-dev.mock.php");
});
app.get("/dist/expert/history", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/history.php");
});
app.get("/dist/expert/about", function(req, res){
    res.cookie('logid','132474510',{maxAge:900000, httpOnly: false});
    res.cookie('fullname', 'developer', {maxAge:900000, httpOnly: false});
    res.cookie('loginmode', 'Classic', {maxAge:900000, httpOnly: false});
    res.cookie('username', 'Twitter_11111111', { maxAge: 900000, httpOnly: false});
    res.render("expert/about.php");
});
//mock phylo expert response
app.post("/phpdb/phyloExpertDB.php", function(req,res){
    res.send("succ");
});
app.get("/phpdb/phyloExpertDB.php", function(req,res){
    res.send("succ");
});
/* end of mocking routes */

//set server to listen to ...
http.createServer(app).listen(app.get('port'), function(){
    console.info('Express server listening on port '+ app.get('port'));
});
