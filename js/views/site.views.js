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
				$(this).attr("href",href+"#!/"+$(this).attr("name")+"/"+tag);
			});
		};
	
		var request = new Request;	
		var playView = Backbone.View.extend({
			render : function(lang) {
				selectTab("play");
				request.getTemplate("templates/play.html",lang);
			},
		});

		var historyView = Backbone.View.extend({
			render : function(lang) {
				selectTab("history");
				$("#mid-panel").html("<div id='history-wrapper'></div>");
				request.post(
					"http://phylo.cs.mcgill.ca/phpdb/userrecordget.php?username=" + window.guest,
					function(re) {
						if($("#history-wrapper").length != 0) {
							$("#history-wrapper").html(re);
							require(['history/DT_bootstrap_history'],function() {
								historyTable.init();
							});
						}
						request.complete();
					}
				);
			},
		});
		
		var aboutView = Backbone.View.extend({
			render : function(lang) {
				selectTab("about");
				request.getTemplate("templates/about.html",lang);
			},
		});

		var rankingView = Backbone.View.extend({
			render : function(lang) {
				selectTab("ranking");
				$("#mid-panel").html("<div id='ranking-wrapper'></div>");
				request.post(	
					"http://phylo.cs.mcgill.ca/phpdb/fullrankingsget.php?lang=" + window.langOpt.toUpperCase(),
					function(re) {
						if($("#ranking-wrapper").length != 0) {
							$("#ranking-wrapper").html(re);
							require(['ranking/DT_bootstrap_ranking'],function() {
								rankingTable.init();
							});
						}
						request.complete();
					}
				);
			},
		});
		
		var creditsView = Backbone.View.extend({
			render : function(lang) {
				selectTab("credits");
				request.getTemplate("templates/credits.html",lang);
			},
		});

		var tutorialView = Backbone.View.extend({
			render : function(lang) {
				selectTab("tutorial");
				request.getTemplate("templates/tutorial.html",lang);
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
