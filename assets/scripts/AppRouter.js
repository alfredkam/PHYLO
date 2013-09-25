//Filename: dashboard

define([  
        //LIBRARIES
        "jquery",
		"backbone",
		"marionette"
], function(
		$, Backbone, Marionette
){
	
	var DashboardRouter = Backbone.Marionette.AppRouter.extend({
		appRoutes:{
			"!/mobile/:lang" : "tabletUX",
			"!/mobile" : "tabletUX",
			"!/mobile/:lang/settings" : "tabletSettings",
			'!/contribute' : "contribute",
			"!/:lang/BETA/RNA" : "rna",
			"!/:lang/Play/Puzzle/:id" : "puzzle",
			// "!/:lang/Play/aws/:id" : "mechanicalTurk",
			"!/:lang/Play" : "play",
			"!/:lang/Play/:AMA": "play",
			"!/Play/puzzle/:id" : "puzzle",
			"!/:lang/Tutorial" : "tutorial",
			"!/:lang/History" : "history",
			"!/:lang/Ranking" : "ranking",
			"!/:lang/About" : "about",
			"!/:lang/Credits" : "credits",
			"!/:lang/Expert" : "expert",
			"!/:lang/" : "defaultRoute",
			"!/:lang" : "defaultRoute",
			"!/*path" : "defaultRoute",
			"" :"defaultRoute"
		}
	});
	return DashboardRouter;
});
