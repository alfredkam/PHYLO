//LIBRARIES

define([ 
        //LIBRARIES
         "jquery",
         "backbone",
         "marionette",
         //VIEWS
         "scripts/views/HeaderView",
         "scripts/views/FooterView",
         "scripts/views/app/index/IndexView",
         "scripts/views/app/index/PlayByIdView",
         "scripts/views/app/tutorial/TutorialView",
         "scripts/views/app/about/AboutView",
         "scripts/views/app/credits/CreditsView",
         "scripts/views/app/ranking/RankingView",
         "scripts/views/app/history/HistoryView",
         "scripts/views/app/CustomizeView",
         //LAYOUT
         "scripts/views/AppLayout"
         //Modules

         //NO EXPORTS goes last
], function(
		$, Backbone, Marionette, 
		HeaderView, FooterView, IndexView, PlayByIdView, TutorialView, AboutView, CreditsView, RankingView, HistoryView, CustomizeView,
		AppLayout
) {
	var DashboardController = Marionette.Controller.extend({

		initialize : function()
		{
			this.isInit = this.isInit || false;

			if (!this.isInit)
			{
				this.regions = this.regions || new AppLayout({
					el : "#app"
				});
				this.currentRoute = "/";
				this.isInit = true;
			}
		},

		initHeaderFooter : function(pageName, lang)
		{
			var langModel = {};
			if(!lang) 
				lang = "EN";
			else lang.toUpperCase();

			if(!this.regions.customizeRegion.currentView) 
			{
				this.regions.customizeRegion.show(new CustomizeView({}));
			}

			// a good place for code that needs to be ran every page 
			

			if(!this.lang || this.lang != lang) {
				this.lang = lang;

				$.ajax({
					url :"assets/scripts/models/lang/"+lang+".js",
					async: false,
					dataType: 'json'
				}).done(function(data,resp){
					langModel = data;
				}).fail(function(data,resp){
					console.log("failed")
					langModel = data;
				});
				//exporting it out
				window.lang = langModel;
				this.langModel = (new Backbone.Model(langModel));

				//langModel.fetch();
				//console.log(langModel.toJSON());
				this.regions.headerRegion.reset();
				this.regions.headerRegion.show(new HeaderView({
					model : this.langModel,
					lang : lang
				}));
			}

			// if (!this.regions.headerRegion.currentView)
			// {
			// 	this.regions.headerRegion.reset();
			// 	this.regions.headerRegion.show(new HeaderView({
			// 		model : this.langModel,
			// 		lang : lang
			// 	}));
			// }

			if (!this.regions.footerRegion.currentView)
			{
				this.regions.footerRegion.show(new FooterView({}));
			}
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
		/* use this if to set up login */
		/*
		index : function()
		{
			var result = this.checkLogin();
			if (result)
			{
				// go to default page
				// for now let it be register page
				this.initHeaderFooter();
				// set route here if needed
				// this.currentRoute = "#/performance";
				// this.performance();

				// oh also.. don't forget to initialize header and footer
			}
			else
			{
				// Not logged in
				// show login page
				// this.currentRoute = "#/login";
				// this.login();
			}
		},
		checkLogin : function()
		{
			// var isLoggedIn = false;
			// this.user.fetch({
			// async : false,
			// success : function(model, response) {
			// console.log("logged In");
			// // Logged in, stay in current route unless you are at login
			// // view
			// isLoggedIn = true;
			// }
			// });
			//
			// return isLoggedIn;
			return false;
		}, */
		login : function()
		{
			console.log("rendering login view");
			// resetting header and footer region
			this.regions.headerRegion.reset();
			this.regions.footerRegion.reset();
			this.regions.contentRegion.reset();

			this.regions.contentRegion.show(new LoginView());
		},
		anotherDefaultRoute : function(lang) {
			this.initHeaderFooter("Play", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new TutorialView({
				lang : this.lang,
				model : this.langModel
			}));
		},
		defaultRoute : function(lang) {

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
            // var playView = new Views.Play;
            // navBar.set(lang,"play");
            // playView.render(lang);
            // 
            this.initHeaderFooter("Play", lang);
            this.regions.contentRegion.reset();
          	this.regions.contentRegion.show(new IndexView({
          		lang : lang
          	}));
            // END FIXME
		},
		// this still in old format
		tabletSettings : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"play");
			var tabletSettingsView = new Views.TabletSettings;
			tabletSettingsView.render(lang);	
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
		},
		credits : function(lang){
			this.initHeaderFooter("Credits", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new CreditsView({
				lang : this.lang,
				model : this.langModel
			}));
		},
		about : function(lang){
			this.initHeaderFooter("About", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new AboutView({
				lang : this.lang,
				model : this.langModel
			}));
		},
		// what does history do? no memory of it
		history : function(lang){
			this.initHeaderFooter("History", lang);
			this.regions.contentRegion.reset();
			this.regions.contentRegion.show(new HistoryView({
				lang : this.lang,
				model : this.langModel
			}));
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
		},
		// should depreciate this?
		rna : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang, "Play");
			var rnaView = new Views.RNA;
			rnaView.render(lang);
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
		}
	});

	return DashboardController;
});
