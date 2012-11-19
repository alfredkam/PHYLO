(function(){
	requirejs.config({
		baseUrl : 'js/blueprint',
		paths : {
		     DNA : '../DNA',
		     RNA : '../RNA',
		     theme : '../theme',
		},
		shim : {
			'backbone' : {
				deps : ['underscore', 'jquery'],
			},
			'yepnope' : {
				exports : 'yepnope',
			},
			'bootstrap' : {
				deps : ['jquery','jquery-ui'],
			},
			'mustache' : {
				deps : ['jquery'],
			}
			'DNA/
		}
	});
	//loads tablet UX
	require(['yepnope'],
		function(yepnope) {
			window.isTablet = navigator.userAgent.match(/(iPad|Android .* Chrome\/[.0-9]* (?!Mobile)|Opera Tablet|Android .* (?!Mobile)|Tablet)/i) != null;
			yepnope({
				test : isTablet,
				yep : 'css/tablet.css',
				nope : ['css/media1280.css','css/media1180.css','css/media1024.css'],
			});
			//test mode script injection
			yepnope({
				test : window.DEV.enableTabletMode,
				yep : 'css/tablet.css',
			});
		}
	);
	require(['bootstrap','mustache']);
	require(['backbone']);
})();
