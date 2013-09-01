
define([
        "backbone",
        "marionette",
        //templates
        "text!tpl/app/Footer.mustache",

], function(backbone, Marionette, tpl){
	
	var FooterView = Marionette.ItemView.extend({
		model : new Backbone.Model({ year : new Date().getFullYear() }),
		template : tpl
	});
	
	return FooterView;
});
