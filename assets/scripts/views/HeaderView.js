//Filename: boilerplate.js

define([
        //LIBRARIES
        "jquery",
        "marionette",
        //OTHER
        
        //TEMPLATES
        "text!tpl/app/Header.mustache",
        
        //NO EXPORTS

], function($, Marionette, tpl){
	var HeaderView = Marionette.ItemView.extend({
        initialize : function (options){
            this.lang = options.lang;
            this.model.set({
                lang : this.lang
            });
        },
		template: tpl,
		events: {
			//"click button.logout": "logout"
		}
	});
	
  return HeaderView;
  
});