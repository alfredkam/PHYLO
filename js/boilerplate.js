//Filename: boilerplate.js 
(function() {
	//Enclosure
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		//These are path alias that we configured in js/main.js
	], function($, _, Backbone, Mustache) {
		//Above we have passed in jquery , underscore, backbone and mustache
		// They will not be accessible in the global scope

		return {};
		// what we return here will be used by other modules
	});
})();
