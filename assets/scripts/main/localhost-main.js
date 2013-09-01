require.config({

	baseUrl : "../..",

	paths : {
		// Require Plugins
		text : "lib/require/text",

		// Others
		json : "lib/json/json2",
		jquery: "lib/jquery/jquery-1.9.1",
//		jquery : "lib/jquery/jquery-1.8.3",
		underscore : "lib/underscore/underscore-1.4.4",
		backbone : "lib/backbone/backbone",
		marionette : "lib/marionette/backbone.marionette",		
		"backbone.wreqr" : "lib/marionette/backbone.wreqr",
		"backbone.babysitter" : "lib/marionette/backbone.babysitter",
		"backbone.eventbinder" : "lib/marionette/backbone.eventbinder",
		mustache : "lib/mustache/mustache",
		spectrum: "lib/spectrum/spectrum",
		flot : "lib/flot/jquery.flot",
		"flot.time" : "lib/flot/jquery.flot.time",
		"flot.pie" : "lib/flot/jquery.flot.pie",
		"flot.threshold" : "lib/flot/jquery.flot.threshold",
		"flot.stack" : "lib/flot/jquery.flot.stack",
		"flot.crosshair" : "lib/flot/jquery.flot.crosshair",
		"moment" : "lib/moment/moment"
	},

	/*
	 * shim is used to export js files that do not follow the AMD module style
	 * It is also used to define dependencies for scripts that DO follow the
	 * module style.
	 */
	shim : {

		json : {
			exports : "JSON"
		},

		jquery : [ "json" ],

		underscore : {
			deps : [ "json" ],
			exports : "_"
		},

		backbone : {
			deps : [ "json", "underscore", "jquery" ],
			exports : "Backbone"
		},
		
		marionette : {
			deps : [ "jquery", "backbone", "underscore" ]			
		},
		
		"backbone.wreqr" : {
			deps : [ "backbone" ]
		},
		
		mustache : [ "json" ],
		spectrum: ['jquery'],
		
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
	}
});

require([ "marionette", "mustache", "js/App" ], function(Marionette,
		Mustache, App) {
	// var consoleUtils = new WebConsoleUtils({
	// debug: config.DEBUG
	// });
	//	
	// consoleUtils.initConsole();

	// var dashboard = new DashboardRouter();
	// Backbone.history.start();
	// Assigning Renderer
	Backbone.Marionette.Renderer.render = function(template, data) {
		//console.log("rendering with this now:");
//		console.log(data);
		if (typeof template === "function") {
			return Mustache.render(template(), data);
		}
		return Mustache.render(template, data);
	};	
	
	App.start();
});
