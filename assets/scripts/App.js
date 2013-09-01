define([
	"scripts/config", 
	"scripts/util/WebConsoleUtils", 
	//LIBRARY
	"backbone",
	"marionette",
	"mustache",
	//CONTROLLER
	"scripts/AppController",
	//ROUTER
	"scripts/AppRouter",
	//LAYOUT
	"scripts/views/AppLayout",
	//MODELS
	//OTHERS
	"scripts/util/vent/vent"
], function(
		config, WebConsoleUtils, 
		Backbone, Marionette, Mustache, 
		AppController, AppRouter, AppLayout,
		vent
){
	
	var App = new Marionette.Application();
	
	App.addInitializer(function(){	
		
		// Assigning controller
		var controller = new AppController();
		var router = new AppRouter({ controller : controller });		
		
	});
	
	App.on('initialize:after', function(){
		Backbone.history.start();
	});
	
	return App;
});	