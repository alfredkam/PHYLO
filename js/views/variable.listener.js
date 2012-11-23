(function(){
	define([
		'jquery',
		'underscore',
		'backbone'
	],function($, _, Backbone) {
		var obj = Backbone.View.extend({
			//only detect window change
			change : function(_default, _diffFactor, _stepFunction, _maxWait, callBack) {
				var check = function(_step) {
					if(window[_default] != _diffFactor)
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
