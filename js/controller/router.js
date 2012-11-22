(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'views/site.views',
		'views/navBar.views',
		'models/site.models'
	], function($, _ , Backbone, Views, NavBar, Models) {
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
			require(['views/navBar.actions']);
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
				navBar.set(lang,"play");
				var playView = new Views.Play;
				playView.render(lang);
			});

			route.on('route:tutorial', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"tutorial");
				var tutorialModel = new Models.Tutorial;
				var tutorialView = new Views.Tutorial;
				tutorialView.render(tutorialModel.data);
			});

			route.on('route:history', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"history");
				var historyView = new Views.History;	
				historyView.render(lang);
			});
		
			route.on('route:about', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"about");
				var aboutView = new Views.About;
				aboutView.render(lang);
			});

			route.on('route:credits', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"credits");
				var creditsView = new Views.Credits;
				creditsView.render(lang);
			});

			route.on('route:ranking', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"ranking");
				var rankingView = new Views.Ranking;
				rankingView.render(lang);
			});

			route.on('route:expert', function(lang) {
				window.location = "http://phylo.cs.mcgill.ca/dcanv";
			});

			route.on('route:defaultRoute', function(lang) {
				var lang = "EN";
				var playView = new Views.Play;
				navBar.set(lang,"play");
				playView.render(lang);
			});

			Backbone.history.start();
		}

		return {
			init : init,
		}
	});
})();
