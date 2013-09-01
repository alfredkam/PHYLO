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
         //LAYOUT
         "scripts/views/AppLayout"
         //Modules

         //NO EXPORTS goes last
], function(
		$, Backbone, Marionette, 
		HeaderView, FooterView, IndexView,
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
			if(!lang) 
				lang = "EN";	
			// a good place for code that needs to be ran every page
			// 
			if(!this.lang || this.lang != lang) {
				this.lang = lang;

				var langModel = Backbone.Model.extend({
					url : "assets/lang/"+lang+".js"
				});

				var xx = new langModel();

				xx.fetch();

				console.log(xx.toJSON());


				//langModel.fetch();
				//console.log(langModel.toJSON());
			}

			if (!this.regions.headerRegion.currentView)
			{
				this.regions.headerRegion.show(new HeaderView({
					model : langModel,
					lang : lang
				}));
			}

			if (!this.regions.footerRegion.currentView)
			{
				this.regions.footerRegion.show(new FooterView({}));
			}
			// this.setActiveLink(pageName);
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

		home : function() {
			this.initHeaderFooter("home");
			this.curretRoute = "#/home";
			this.regions.contentRegion.show(new HomeView());
//			this.regions.contentRegion.show(new DemoView({model:new Backbone.Model()}));
		},
		demo : function()
		{
			this.initHeaderFooter("demo");
			this.regions.contentRegion.show(new DemoView({model:new Backbone.Model()}));
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
		anotherDefaultRoute : function(lang) {
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"play");
			var playView = new Views.Play;
			playView.render(lang);
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
            this.initHeaderFooter("play", lang);
            this.regions.contentRegion.reset();
          	this.regions.contentRegion.show(new IndexView({
          		lang : lang
          	}));
            // END FIXME
		},
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
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"ranking");
			var rankingView = new Views.Ranking;
			rankingView.render(lang);
		},
		credits : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"credits");
			var creditsView = new Views.Credits;
			creditsView.render(lang);
		},
		about : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"about");
			var aboutView = new Views.About;
			aboutView.render(lang);
		},
		history : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"history");
			var historyView = new Views.History;	
			historyView.render(lang);
		},
		tutorial : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang,"tutorial");
			var tutorialModel = new Models.Tutorial({lang:lang});
			var tutorialView = new Views.Tutorial;
	        tutorialModel.fetch({success:function(){
			    tutorialView.render(tutorialModel.get("data"));}
	        });
		},
		rna : function(lang){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang, "play");
			var rnaView = new Views.RNA;
			rnaView.render(lang);
		},
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
		puzzle : function(lang, id){
			if(lang == undefined) {
				lang = "EN";
			} else lang.toUpperCase();
			navBar.set(lang, "play");
			var playView = new Views.Play;
			playView.renderPuzzle(lang, id);	
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
			if(lang == undefined) {
                console.log(lang);
			} else lang.toUpperCase();
			navBar.set(lang,"play");
			var playView = new Views.Play;
            console.log("render >> " +lang);
			playView.render(lang);
		}
	});

	return DashboardController;
});
