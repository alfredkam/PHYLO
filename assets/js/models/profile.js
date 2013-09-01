define([
	'jquery',
	'mustache',
	'backbone'
], function($, Mustache, Backbone) {
	var profile = Backbone.Model.Extend({
		defaults : {
			lang : "EN",
			name : "",
			expert : false
		}

	});	
});
