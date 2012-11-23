(function(){
	define([
		'jquery',
		'underscore',
		'backbone'
	],function($, _, Backbone) {
		var obj = Backbone.View.extend({
			change : function(_default, _diffFactor, _stepFunction, _maxWait, callBack) {
				var check = function(_step) {
					if(_default != _diffFactor)
						return callBack(true);
					else if(_step >= _maxWait)
						return callBack(false);
					else
						window.setTimeout(function() {
							check(parseInt(_step+_stepFunction));
						},_stepFunction);
				};
				check(0);
			},
		});					
		return obj;
	});
})();
