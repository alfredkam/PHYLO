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
			'!/contribute' : "contribute",
			"!/:lang/BETA/RNA" : "rna",
			"!/:lang/play/puzzle/:id" : "puzzle",
			"!/:lang/play/aws/:id" : "mechanicalTurk",
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
			"!/:lang" : "anotherDefaultRoute",
			"*actions" : "defaultRoute"
		}
	});
	return DashboardRouter;
});
