(function() {
	define([
		'jquery/jquery',
		'underscore/underscore',
		'backbone/backbone',
		'views/site.views',
		'views/navBar.views',
		'models/site.models',
		'util/example'
	], function($, _ , Backbone, Views, NavBar, Models, example) {
		var Routes = Backbone.Router.extend({
			routes : {
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

		var init = function() {
			require(['views/navBar.actions']);

            //set default lang
            
            // BEGIN FIXME (Quick hack to detect language)
            var userLang = navigator.language || navigator.userLanguage;
            var language = userLang.substring(0,2).toUpperCase();
            console.log("Browser language: " + language);
            switch (language) {
                case "EN":
                case "FR":
                case "SP":
                case "DE":
                case "PT":
                case "RO":
                case "RU":
                case "KO":
                case "HE":
                    window.langOpt = language;
                    break;
                case "ZH":
                    var languageExtension = headers['Accept-Language'].substring(0,5).toUpperCase();
                    console.log("Browser extended language: " + languageExtension);
                    if (languageExtension == "ZH-HK") {
                        window.langOpt = "ZH-HK";
                    } else {
                        window.langOpt = "ZH-CN";
                    };
                    break;
                default:
                    window.langOpt = "EN";
                    break;
            }
            // END FIXME
           
			//window.langOpt = "EN";
           
			//initalize
			var navBar = new NavBar;
			navBar.init();
			var route = new Routes;
           
			route.on('route:play', function(lang, dev) {
				if(dev) {
					if(dev == "IAMADEV") 
						window.DEV.logging = true;	
					else if(dev == "IAMADEV+DEBUG") {
						window.DEV.logging = true;
						window.DEBUG = true;
					} else if(dev == "NOMUSIC") {
						window.DEV.disableMusic = true;
					}
					
				}
				if(lang == undefined) {
                    console.log(lang);
				} else lang.toUpperCase();
				navBar.set(lang,"play");
				var playView = new Views.Play;
                console.log("render >> " +lang);
				playView.render(lang);
			});

			route.on('route:puzzle',function(lang, id) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang, "play");
				var playView = new Views.Play;
				playView.renderPuzzle(lang, id);	
			});

			route.on('route:mechanicalTurk', function(lang, id) {
				//you can write additional script here
				
				id = id.replace(/\?.*/,"");
				console.log(id);
				console.log("calling as link");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang, "play");
				var playView = new Views.Play;
				playView.renderPuzzle(lang, id);	
			});
		
			route.on('route:rna',function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang, "play");
				var rnaView = new Views.RNA;
				rnaView.render(lang);
			});

			route.on('route:tutorial', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"tutorial");
				var tutorialModel = new Models.Tutorial({lang:lang});
				var tutorialView = new Views.Tutorial;
                tutorialModel.fetch({success:function(){
				    tutorialView.render(tutorialModel.get("data"));}
                });
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
				window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
			});

			route.on('route:contribute',function() {
				window.location = "http://phylo.cs.mcgill.ca/contribute";
			});

			route.on('route:tabletSettings', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"play");
				var tabletSettingsView = new Views.TabletSettings;
				tabletSettingsView.render(lang);	
			});
			
			route.on('route:anotherDefaultRoute', function(lang) {
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				navBar.set(lang,"play");
				var playView = new Views.Play;
				playView.render(lang);
			});

			route.on('route:defaultRoute', function(lang) {
                     
                
                // BEGIN FIXME (Quick hack to detect language)
                var lang;
                var userLang = navigator.language || navigator.userLanguage;
                var language = userLang.substring(0,2).toUpperCase();
                switch (language) {
                    case "EN":
                    case "FR":
                    case "SP":
                    case "DE":
                    case "PT":
                    case "RO":
                    case "RU":
                    case "KO":
                    case "HE":
                        lang = language;
                        break;
                    case "ZH":
                        var languageExtension = headers['Accept-Language'].substring(0,5).toUpperCase();
                        if (languageExtension == "ZH-HK") {
                            lang = "ZH-HK";
                        } else {
                            lang = "ZH-CN";
                        };
                        break;
                    default:
                        lang = "EN";
                        break;
                }
                var playView = new Views.Play;
                navBar.set(lang,"play");
                playView.render(lang);
                     
                // END FIXME
                
                // EN default code
                //var lang = "EN";
				//var playView = new Views.Play;
				//navBar.set(lang,"play");
				//playView.render(lang);
			});

			Backbone.history.start();
		}

		return {
			init : init
		}
	});
})();
