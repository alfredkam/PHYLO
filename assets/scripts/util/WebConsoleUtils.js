define([
        
], function() {
	
	var WebConsoleUtils = function(options){
		var options = options || {};
		
		this.debug = options.debug;
	};
	
	WebConsoleUtils.prototype = {
			
			initConsole: function(doDebug){
				var debug = this.debug;
				
				if(doDebug)
				{
					debug = true;
				}
				
				var method;
			    var noop = function () {};
			    var methods = [
			        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			        'timeStamp', 'trace', 'warn'
			    ];
			    var length = methods.length;
			    var console = (window.console = window.console || {});

			    while (length--) {
			        method = methods[length];

			        // stub undefined methods or all methods if debug set to false
			        if (!console[method] || !debug) {
			            console[method] = noop;
			        }
			    }
			}
	};
	
	return WebConsoleUtils;
	
});