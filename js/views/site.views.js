(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'views/request.views',
		'views/navBar.views',
	], function($, _, Backbone,Mustache,Request,navBar) {
		var request = new Request;	
		var playView = Backbone.View.extend({
			render : function(lang) {
				request.get("templates/play.html",lang);
			},
		});

		var historyView = Backbone.View.extend({
			render : function(lang) {

			},
		});
		
		var aboutView = Backbone.View.extend({
			render : function(lang) {
				request.get("templates/about.html",lang);
			},
		});

		var rankingView = Backbone.View.extend({
			render : function(lang) {

			},
		});
		
		var creditsView = Backbone.View.extend({
			render : function(lang) {
				request.get("templates/credits.html",lang);
			},
		});

		var tutorialView = Backbone.View.extend({
			render : function(lang) {
				request.get("templates/tutorial.html",lang);
			},
		});

		return {
			Play : playView,
			History : historyView,
			About : aboutView,
			Ranking : rankingView,
			Credits : creditsView, 
			Tutorial : tutorialView,
		};
	});	
})();
