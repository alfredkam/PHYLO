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
			"!/:lang/play" : "play",
			"!/:lang/play/:AMA": "play",
			"!/play" : "play",
			"!/:lang/tutorial" : "tutorial",
			"!/tutorial" : "tutorial",
			"!/:lang/history" : "history",
			"!/history" : "history",
			"!/:lang/ranking" : "ranking",
			"!/ranking" : "ranking",
			"!/:lang/about" : "about",
			"!/about" : "about",
			"!/:lang/credits" : "credits",
			"!/credits" : "credits",
			"!/:lang/expert" : "expert",
			"!/expert" : "expert",
			"!/:lang/tablet:settings" : "tabletSettings",
			"!/:lang" : "anotherDefaultRoute",
			"*actions" : "defaultRoute"
		}
	});
	return DashboardRouter;
});
