(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'views/request.views',
		'views/navBar.views',
	],
   	function($, _, Backbone , Mustache, Request, NavBar) { 
		var Tutorial = Backbone.Model.extend({
			defaults:{
				lang: "EN",
                
			},
		    initialize: function(lang){
			//set it to autoload when created
			    this.url="../tutorial/"+this.get("lang")+"-tutorial.js";
				console.log(this.get("lang"));
		            this.fetch();
		    },
		});

		return {
			Tutorial : Tutorial,
		}
	}
);

})();

