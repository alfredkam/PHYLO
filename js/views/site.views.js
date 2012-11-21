(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
	], function($, _, Backbone,Mustache) {
		
		var playView = Backbone.View.extend({
			render : function(lang) {
				console.log(lang);				
			},
		});

		var historyView = Backbone.View.extend({
			render : function(lang) {

			},
		});
		
		var aboutView = Backbone.View.extend({
			render : function(lang) {

			},
		});

		var rankingView = Backbone.View.extend({
			render : function(lang) {

			},
		});
		
		var creditsView = Backbone.View.extend({
			render : function(lang) {

			},
		});

		var tutorialView = Backbone.View.extend({
			render : function(lang) {

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
