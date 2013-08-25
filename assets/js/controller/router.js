(function() {
	define([
		'jquery/jquery',
		'underscore/underscore',
		'backbone/backbone',
		'views/site.views',
		'views/navbar.views',
		'models/site.models',
		'util/example'
	], function($, _ , Backbone, Views, Navbar, Models, example) {
		var Router = Backbone.Router.extend({
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
			},
            initalize : function(lang, nameOfTab) {
                if(this.init === undefined) {
                    require(['views/this.navbar.actions']);
                    //set default lang
                    
                    // BEGIN FIXME (Quick hack to detect language)
                    var userLang = navigator.language || navigator.userLanguage;
                    var language = userLang.substring(0,2).toUpperCase();
                    console.log("Browser language detected: " + language);
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
                            }
                            break;
                        default:
                            window.langOpt = "EN";
                            break;
                    }
                    console.log("@router, init");
                    this.navbar = new Navbar;
                    this.navbar.init();
                    this.init = true;
                } else {
                    this.navbar.set(lang, nameOfTab);
                }
            },
            play : function(lang, dev) {
                this.initalize(lang, "play");
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
				//this.navbar.set(lang,"play");
				var playView = new Views.Play;
                console.log("render >> " +lang);
				playView.render(lang);
			},  
            puzzle : function(lang, id) {
                this.initalize(lang, "play");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				//this.navbar.set(lang, "play");
				var playView = new Views.Play;
				playView.renderPuzzle(lang, id);	
			},
            mechanicalTurk : function(lang, id) {
				//you can write additional script here
				this.initalize(lang, "play");
				id = id.replace(/\?.*/,"");
				console.log(id);
				console.log("calling as link");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
			//	this.navbar.set(lang, "play");
				var playView = new Views.Play;
				playView.renderPuzzle(lang, id);	
			},
            rna : function(lang) {
                this.initalize(lang, "play");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
			//	this.navbar.set(lang, "play");
				var rnaView = new Views.RNA;
				rnaView.render(lang);
			},
            tutorial : function(lang) {
                this.initalize(lang, "tutorial");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				//this.navbar.set(lang,"tutorial");
				var tutorialModel = new Models.Tutorial({lang:lang});
				var tutorialView = new Views.Tutorial;
                tutorialModel.fetch({success:function(){
				    tutorialView.render(tutorialModel.get("data"));}
                });
			},
            history : function(lang) {
                this.initalize(lang, "history");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
			//	this.navbar.set(lang,"history");
				var historyView = new Views.History;	
				historyView.render(lang);
			},
            about : function(lang) {
                this.initalize(lang,"about");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				//this.navbar.set(lang,"about");
				var aboutView = new Views.About;
				aboutView.render(lang);
			},
            credits : function(lang) {
                this.initalize(lang, "credits");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
				//this.navbar.set(lang,"credits");
				var creditsView = new Views.Credits;
				creditsView.render(lang);
			},
            ranking : function(lang) {
                this.initalize(lang, "ranking");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
			//	this.navbar.set(lang,"ranking");
				var rankingView = new Views.Ranking;
				rankingView.render(lang);
			},
            expert : function(lang) {
				window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
			},
            contribute : function() {
				window.location = "http://phylo.cs.mcgill.ca/contribute";
			},
            tabletSettings : function(lang) {
                this.initalize(lang, "play");
				if(lang === undefined){
					lang = "EN";
				} else lang.toUpperCase();
				//this.navbar.set(lang,"play");
				var tabletSettingsView = new Views.TabletSettings;
				tabletSettingsView.render(lang);	
			},
            anotherDefaultRoute : function(lang) {
                this.initalize(lang, "play");
				if(lang == undefined) {
					lang = "EN";
				} else lang.toUpperCase();
			//	this.navbar.set(lang,"play");
				var playView = new Views.Play;
				playView.render(lang);
			},
            defaultRoute : function(lang) {
                this.initalize(lang, "play"); 
                
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
              //  this.navbar.set(lang,"play");
                playView.render(lang);
                     
                // END FIXME
                
                // EN default code
                //var lang = "EN";
				//var playView = new Views.Play;
				//this.navbar.set(lang,"play");
				//playView.render(lang);
            }
		});
    
        return Router;

	});
})();
