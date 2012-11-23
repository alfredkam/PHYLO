(function(){
	define([
		'jquery',
		'underscore',
		'backbone'
	],function($, _, Backbone) {
		var obj = Backbone.View.extend({
			change : function(_default, _diffFactor, _stepFunction, _maxWait, callBack) {
				console.log(_stepFunction + " < > "+_maxWait);
				var check = function(_step) {
					console.log(_step);
					if(_default != _diffFactor)
						return callBack(true);
					else if(_step >= _maxWait)
						return callBack(false);
					else
						window.setTimeout(function(_step) {
							check(parseInt(_step+_stepFunction));
						},_stepFunction);
				};
				check(0);
			},
		});					
		return obj;
	});
})();
