	//LIBRARIES

define([ 
        //LIBRARIES
         "jquery",
         "backbone",
         "marionette",
         //VIEWS
         "scripts/views/HeaderView",
         // "scripts/views/FooterView",
         "scripts/views/app/footer/FooterLayout",
         "scripts/views/app/index/IndexView",
         "scripts/views/app/index/PlayByIdView",
         "scripts/views/app/tutorial/TutorialView",
         "scripts/views/app/about/AboutView",
         "scripts/views/app/credits/CreditsView",
         "scripts/views/app/ranking/RankingView",
         "scripts/views/app/history/HistoryView",
         "scripts/views/app/CustomizeView",
         //tablet view
         "scripts/views/tablet/TabletView",
         "scripts/views/tablet/TabletSettingsView",
         //LAYOUT
         "scripts/views/AppLayout",
         //Modules

         //NO EXPORTS goes last
         "nprogress",
         "yepnope"
], function(
		$, Backbone, Marionette,
		HeaderView, FooterLayout, IndexView, PlayByIdView, TutorialView, AboutView, CreditsView, RankingView, HistoryView, 
		CustomizeView,
		TabletView, TabletSettingsView,
		AppLayout
) {
	var DashboardController = Marionette.Controller.extend({

		initialize : function()
		{
			this.isInit = this.isInit || false;
			window.isTablet = navigator.userAgent.match(/(iPad|Android .* Chrome\/[.0-9]* (?!Mobile)|Opera Tablet|Android .* (?!Mobile)|Tablet|silk|kindle fire)/i) != null;
			//check if ipad and load ipad fix
			var isiPad = navigator.userAgent.match(/(ipad)/i);
			yepnope({
				test : isiPad,
				yep : ['assets/css/ipad-fix.css']
			});
			//test mode script injection
			yepnope({
				test : window.DEV.enableTabletMode,
				yep : 'assets/css/tablet.css'
			});
			//check if mobile phone
			var isMobile = navigator.userAgent.match(/(iPhone|Android .* Mobile)/i) != null;
			window.isMobile = isMobile;
			//check if Win 64 FF
			var isFF = navigator.userAgent.match(/Mozilla.* Firefox/) != null;
			yepnope({
				test : isFF,
				yep : ['assets/css/FF-Win-fix.css']
			});

			this.isTablet = window.isTablet;

			if (!this.isInit)
			{
				this.currentLang = "EN";
				this.currentPage = "";
				this.regions = this.regions || new AppLayout({
					el : "#app"
				});
				this.currentRoute = "/";
				this.isInit = true;
				this.user = (new Backbone.Model({
					name : ""
				}));
				this.langModel = (new Backbone.Model());
				this.user.on("change", this.updateHeader, this);
				this.regions.footerRegion.reset();
				this.regions.footerRegion.show(new FooterLayout({
					model : this.langModel
				}));
			}
		},
		updateHeader : function(){
			this.regions.headerRegion.reset();
			this.regions.headerRegion.show(new HeaderView({
				model : this.langModel,
				user : this.user,
				lang : this.currentLang,
				format : (this.isTablet? "tablet" : "desktop")
			}));
			pageName = this.currentPage;
			this.setActiveLink(pageName);
		},
		initHeaderFooter : function(pageName, lang)
		{
			NProgress.start();
			var langModel = {};
			var self = this;
			lang = lang || "EN";
			lang.toUpperCase();

			if(!this.regions.customizeRegion.currentView) {
				this.regions.customizeRegion.show(new CustomizeView({}));
			}

			// a good place for code that needs to be ran every page 
			
			if(!this.lang || this.lang != lang) {
				this.lang = lang;

				$.ajax({
					url :"assets/scripts/models/lang/"+lang+".js",
					async: false,
					dataType: 'json',
					// contentType	: 'application/x-www-form-urlencoded; charset=UTF-8'
				}).done(function(data,resp){
					langModel = data;
					window.lang= langModel;
				}).fail(function(data,resp){
					console.log(lang,data);
					console.log("@controller, grab file failed");
					langModel = data;
					// console.log(data);
					window.lang = langModel;
				}).error(function(){
					console.log("@controller, lanuage does not exist, defaulting to EN");
					self.lang = "EN";
					lang = "EN";
					$.ajax({
						url : "assets/scripts/models/lang/EN.js",
						async: false,
						dataType : 'json'
					}).done(function(data, resp){
						langModel = data;
						window.lang = langModel;
					});
				});
				//exporting it out
				langModel.lang = lang;
				this.langModel.set(langModel); //= (new Backbone.Model(langModel));

				this.regions.headerRegion.reset();
				this.regions.headerRegion.show(new HeaderView({
					model : this.langModel,
					user : this.user,
					lang : lang,
					format : (this.isTablet? "tablet" : "desktop")
				}));
			}

			this.currentLang = lang;
			this.currentPage = pageName;
			this.setActiveLink(pageName);
		},
		setActiveLink : function(pageName) {
			var self = this;
			$("#nav ul li").each(function(){
				if($(this).children("a").attr("href") == "#!/"+self.lang+"/"+pageName){
					$(this).children("a").children("div").addClass("onSelect");
				} else {
					$(this).children("a").children("div").removeClass("onSelect");
				}
			});

			$("#language-list div a").each(function(){
				var lang = $(this).attr("name");
				$(this).attr("href", "#!/"+lang+"/"+pageName);
			});
		},
		login : function()
		{
			console.log("rendering login view");
			// resetting header and footer region
			this.regions.headerRegion.reset();
			this.regions.footerRegion.reset();
			this.regions.contentRegion.reset();

			this.regions.contentRegion.show(new LoginView());
		},
		defaultRoute : function(lang) {
			// alert(this.isTablet);
			if(this.isTablet)
				window.location = "#!/mobile";
				//Backbone.history.navigator("#!/mobile");
			if(this.isMobile)
				window.location = "#!/mobile";

			// BEGIN FIXME (Quick hack to detect language)
            var lang = "EN";
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
            // var playView = new Views.Play;
            // navBar.set(lang,"play");
            // playView.render(lang);
            // 
            this.initHeaderFooter("Play", lang);
            this.regions.contentRegion.reset();
          	this.regions.contentRegion.show(new IndexView({
          		lang : lang
          	}));
          	NProgress.done();
            // END FIXME
		},
		// this still in old format
		tabletSettings : function(lang){
			//force set to true
			this.isTablet = true;
			this.initHeaderFooter("", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new TabletSettingsView({
				lang : this.lang,
				model : this.langModel
			}));
			NProgress.done();
		},
		contribute : function() {
			window.location = "http://phylo.cs.mcgill.ca/contribute";
		},
		expert : function(lang) {
			window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
		},
		ranking : function(lang) {
			this.initHeaderFooter("Ranking", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new RankingView({
				lang : this.lang,
				model : this.langModel
			}));
			NProgress.done();
		},
		credits : function(lang){
			this.initHeaderFooter("Credits", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new CreditsView({
				lang : this.lang,
				model : this.langModel
			}));
			NProgress.done();
		},
		about : function(lang){
			this.initHeaderFooter("About", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new AboutView({
				lang : this.lang,
				model : this.langModel
			}));
			NProgress.done();
		},
		// what does history do? no memory of it
		history : function(lang){
			this.initHeaderFooter("History", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new HistoryView({
				lang : this.lang,
				model : this.langModel,
				user : this.user
			}));
			NProgress.done();
		},
		tutorial : function(lang){
			this.initHeaderFooter("Tutorial", lang);
			$.ajax({
				url :"assets/scripts/models/tutorial/"+this.lang+"-tutorial.js",
				async: false,
				dataType: 'json'
			}).done(function(data,resp){
				TutorialModel = data;
			}).fail(function(data,resp){
				console.log("failed")
				TutorialModel = data;
			});
			//exporting it out
			this.tutorialModel = (new Backbone.Model(TutorialModel));


			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new TutorialView({
				lang : this.lang,
				model : this.tutorialModel
			}));
			NProgress.done();
		},
		// should depreciate this?
		rna : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang, "Play");
			var rnaView = new Views.RNA;
			rnaView.render(lang);
			NProgress.done();
		},
		// should depreciate this?
		mechanicalTurk : function(lang, id) {
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
			NProgress.done();
		},
		// need to update the format for this one
		puzzle : function(lang, id){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			this.initHeaderFooter("Play", lang);
			this.regions.contentRegion.reset();

			var playView = new PlayByIdView({
				lang: lang,
				id: id
			});
			this.regions.contentRegion.show(playView);
			NProgress.done();
		},
		play : function(lang, dev){
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
			this.initHeaderFooter("Play", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new IndexView({
				lang : this.lang
			}));
			NProgress.done();
		},
		tabletUX : function(lang) {
			//assume its tablet
			//force set to tablet
			this.isTablet = true;
			this.initHeaderFooter("",lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new TabletView({
				model : this.langModel,
				lang : this.lang,
				user : this.user
			}));
			NProgress.done();
		}
	});

	return DashboardController;
});
