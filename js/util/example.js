//Filename: boilerplate.js 
(function() {
	//Enclosure
	define([
		'jquery/jquery',
		'underscore/underscore',
		'backbone/backbone',
		'mustache/mustache',
		//These are path alias that we configured in js/main.js
	], function($, _, Backbone, Mustache) {
		//Above we have passed in jquery , underscore, backbone and mustache
		// They will not be accessible in the global scope
		var init = function() {

			console.log("calling from example file");

			console.log(window.location.hash);
		
		};

		return {
			init : init
		}
		// what we return here will be used by other modules
	});
})();
