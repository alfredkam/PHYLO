
define([
        "backbone",
        "marionette",
        //templates
        "text!tpl/app/Footer.mustache",

], function(backbone, Marionette, tpl){
	
	var FooterView = Marionette.ItemView.extend({
		initialize : function(options) {
            this.lang = options.lang;
            this.model.set("year",new Date().getFullYear());
        },
		template : tpl
	});
	
	return FooterView;
});
