define([
        //LIBRARIES
		 "jquery",
		 "underscore",
		 "backbone",
		 "marionette",
		 //TEMPLATES
		 "text!tpl/app/home/Home.mustache",
], function(
		$, _, Backbone, Marionette, 
		tpl
) {
		 var HomeView = Marionette.ItemView.extend({
			 tagName : "div",
			 className : "",
			 id : "content",
			 template : tpl,
			 onClose : function() {
				 
			 }
		 });
		 return HomeView;
});
		
