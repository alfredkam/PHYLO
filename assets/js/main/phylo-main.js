require.config({
	
	baseUrl: "assets/js/..",
	waitSeconds : 15,
	paths: {
		//Require Plugins
		text: "bower_components/requirejs-text/text",
		//Core API / Framework / Plugins
		json: "bower_components/json/json2",
		jquery: "bower_components/jquery/jquery.min",
		underscore: "bower_components/underscore/underscore-min",
		backbone: "bower_components/backbone/backbone",
		mustache: "bower_components/mustache/mustache",
		"backbone.babysitter" : "bower_components/backbone.babysitter/lib/backbone.babysitter.min",
		"backbone.wreqr" : "bower_components/backbone.Wreqr/lib/backbone.wreqr.min",
		"moment" : "bower_components/moment/moment",
		"dustjs" : "bower_components/dustjs/dist/dust-full-0.3.0.min",
		"yepnope" : "bower_components/yepnope/yepnope.1.5.4-min",
		"bootstrap" : "bower_components/bootstrap/dist/js/bootstrap.min",
		"jquery-ui" : "bower_components/jquery-ui/ui/minified/jquery-ui.min"
	},
	/*
	 * shim is used to export js files that do not follow the AMD module style
	 * It is also used to define dependencies for scripts that DO follow the module style.
	 */
	shim: {
		json: {
			exports: "JSON"
		},
		jquery: ["json"],
		
		underscore: {
			deps: ["json"],
			exports: "_"
		},
		backbone: {
			deps: ["json", "underscore", "jquery"],
			exports: "Backbone"
		},
		mustache: ["json"],
		marionette : {
			deps : ["json", "jquery", "underscore","backbone"],
			exports : "Marionette"
		},
		flot : {
			deps : [ "json", "jquery" ],
			exports : "jQuery"
		},
		"flot.time" : {
			deps : [ "json", "jquery", "flot" ],
			exports : "jQuery"
		},
		"flot.crosshair" : {
			deps : [ "json", "jquery", "flot" ],
			exports : "jQuery"
		},
		"flot.pie" : {
			deps : [ "json", "jquery", "flot" ],
			exports : "jQuery"
		},
		"flot.threshold" : {
			deps : [ "json", "jquery", "flot", "flot.time" ],
			exports : "jQuery"
		},
		"flot.stack" : {
			deps : [ "json", "jquery", "flot", "flot.time", "flot.crosshair" ],
			exports : "jQuery"
		}
		/*
		bootstrap : {
			deps : ["jquery"]
		}*/
	}
});

require(["js/util/WebConsoleUtils", "backbone", "js/Router"], function(WebConsoleUtils, Backbone, Router){
	
	//TODO: Starting point
	var config = window['phylo'].getConfig();
	var configDebug = config.DEBUG;
	
	//TODO: Choose if you want to follow the current config debug flag, or your own.
	var consoleUtils = new WebConsoleUtils({
		//debug: debug flag here
	});
	
	var router = new Router();
	Backbone.history.start();
	
	consoleUtils.initConsole(/*debgu flag here*/);
});
