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
			'!/contribute' : "contribute",
			"!/:lang/BETA/RNA" : "rna",
			"!/:lang/Play/Puzzle/:id" : "puzzle",
			"!/:lang/Play/aws/:id" : "mechanicalTurk",
			"!/:lang/Play" : "play",
			"!/:lang/Play/:AMA": "play",
			"!/Play" : "play",
			"!/Play/puzzle/:id" : "puzzle",
			"!/:lang/Tutorial" : "tutorial",
			"!/Tutorial" : "tutorial",
			"!/:lang/History" : "history",
			"!/History" : "history",
			"!/:lang/Ranking" : "ranking",
			"!/Ranking" : "ranking",
			"!/:lang/About" : "about",
			"!/About" : "about",
			"!/:lang/Credits" : "credits",
			"!/Credits" : "credits",
			"!/:lang/Expert" : "expert",
			"!/Expert" : "expert",
			"!/:lang/tablet:settings" : "tabletSettings",
			"!/:lang" : "play",
			"*actions" : "defaultRoute"
		}
	});
	return DashboardRouter;
});
