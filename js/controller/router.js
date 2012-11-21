(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'views/site.views',
		'views/navBar.views',
	], function($, _ , Backbone, Views, NavBar) {
		var Routes = Backbone.Router.extend({
			routes : {
				"!/:lang/play" : "play",
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
				"*actions" : "defaultRoute"
			}
		});

		var init = function() {
			//set default lang
			window.langOpt = "EN";
			//initalize
			var navBar = new NavBar;
			navBar.init();
			var route = new Routes;
			route.on('route:play', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				var playView = new Views.Play;
				playView.render(lang);
			});

			route.on('route:tutorial', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				var tutorialView = new Views.Tutorial;
				tutorialView.render(lang);
			});

			route.on('route:history', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				var historyView = new Views.History;	
				historyView.render(lang);
			});
		
			route.on('route:about', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				var aboutView = new Views.About;
				aboutView.render(lang);
			});

			route.on('route:credits', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				var creditsView = new Views.About;
				creditsView.render(lang);
			});

			route.on('route:ranking', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				var rankingView = new Views.Ranking;
				rankingView.render(lang);
			});

			route.on('route:expert', function(lang) {
				window.location = "http://phylo.cs.mcgill.ca/dcanv";
			});

			route.on('route:defaultRoute', function(lang) {
				var lang = "EN";
				var playView = new Views.Play;
				playView.render(lang);
			});

			Backbone.history.start();
		}

		return {
			init : init,
		}
	});
})();
