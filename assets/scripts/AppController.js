//LIBRARIES

define([ 
        //LIBRARIES
         "jquery", 
         "backbone", 
         "marionette",
         //VIEWS
         "js/views/HeaderView", 
         "js/views/FooterView", 
         "js/views/app/demo/DemoLayout",
         "js/views/app/home/HomeView",
         //LAYOUT
         "js/views/AppLayout"
         //Modules

         //NO EXPORTS goes last
], function(
		$, Backbone, Marionette, 
		HeaderView, FooterView, DemoView, HomeView,
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

		initHeaderFooter : function(pageName)
		{
			// a good place for code that needs to be ran every page
			if (!this.regions.headerRegion.currentView)
			{
				console.log(new HeaderView({}));
				this.regions.headerRegion.show(new HeaderView({}));
			}

			if (!this.regions.footerRegion.currentView)
			{
				console.log(new FooterView({}));
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
		}
	});

	return DashboardController;
});
