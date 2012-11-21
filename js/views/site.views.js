(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'views/request.views',
		'views/navBar.views',
	], function($, _, Backbone,Mustache,Request,navBar) {

		var selectTab = function(tag) {
			$("#nav a div").removeClass("onSelect");
			$("#"+tag +" div").addClass("onSelect");

			//edit language href to selected tab
			$(".language-list a").each(function() {
				var href = $(this).attr("href").replace(/#!.*$/,"");
				$(this).attr("href",href+"#!"+tag);
			});
		};
	
		var request = new Request;	
		var playView = Backbone.View.extend({
			render : function(lang) {
				selectTab("play");
				request.get("templates/play.html",lang);
			},
		});

		var historyView = Backbone.View.extend({
			render : function(lang) {
				selectTab("history");

			},
		});
		
		var aboutView = Backbone.View.extend({
			render : function(lang) {
				selectTab("about");
				request.get("templates/about.html",lang);
			},
		});

		var rankingView = Backbone.View.extend({
			render : function(lang) {
				selectTab("ranking");

			},
		});
		
		var creditsView = Backbone.View.extend({
			render : function(lang) {
				selectTab("credits");
				request.get("templates/credits.html",lang);
			},
		});

		var tutorialView = Backbone.View.extend({
			render : function(lang) {
				selectTab("tutorial");
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
