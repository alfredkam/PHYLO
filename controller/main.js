(function(){
	requirejs.config({
		baseUrl : 'js/blueprint',
		paths : {
		     	DNA : '../DNA',
		     	RNA : '../RNA',
		     	theme : '../theme',
			menu : '../menu',
			validation : '../validation',
			controller : '../../controller',
		},
		shim : {
			'backbone' : {
				deps : ['underscore', 'jquery'],
			},
			'bootstrap' : {
				deps : ['jquery','jquery-ui'],
			},
			'mustache' : {
				deps : ['jquery'],
			},
			'menu/interface.menu' : {
				deps : ['menu/settings.menu']
			},		
			'DNA/main.core' : {
				deps : ['jquery', 'jquery-ui'],	
			},
			'RNA/main.rna' : {

			},
			'controller/hashbang.page' : {
				deps : ['jquery','DNA/helper.core','DNA/timer.core','DNA/lang.module','menu/tailor.menu','controller/main.page','menu/events.menu'],
			},
		}
	});
	require(['yepnope'],
		function() {
			//loads tablet UX
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
	require(['jquery']);
	require(['bootstrap','mustache']);
	require(['backbone']);
})();
