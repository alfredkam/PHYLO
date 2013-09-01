

define([
        "backbone",
        "marionette",
        "underscore"
], function(Backbone, Marionette, _){
	
	var AppLayout = Marionette.Layout.extend({
		regions: {
			headerRegion: "#header-wrapper",
			contentRegion: "#app-content",
			footerRegion: "#footer"			
		}
	});
	
	return AppLayout;
});