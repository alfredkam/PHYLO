
define([
        "backbone",
        "marionette",
        //templates
        "text!tpl/app/footer/FooterNav.mustache",

], function(backbone, Marionette, tpl){
	
	var FooterView = Marionette.ItemView.extend({
		template : tpl
	});
	
	return FooterView;
});
