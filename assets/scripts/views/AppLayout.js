

define([
        "backbone",
        "marionette",
        "underscore"
], function(Backbone, Marionette, _){
	
	var AppLayout = Marionette.Layout.extend({
		regions: {
            customizeRegion : "#customizeRegion",
            customizeMusicRegion : "#customizeMusicRegion",

			headerRegion: "#header-wrapper",
			contentRegion: "#app-content",
            footerWidgetRegion : "#footer-widgets",
			footerRegion: "#footer"			
		}
	});
	
	return AppLayout;
});