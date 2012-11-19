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
			misc : '../misc',
			lang : '../../lang',
			tutorial : '../tutorial',
			ranking : '../ranking',
			history : '../history',
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
			'theme/main.theme' : {
				deps : ['jquery'],
			},
			'menu/interface.menu' : {
				deps : ['jquery','menu/settings.menu','menu/disease.menu','DNA/main.core']
			},		
			'DNA/main.core' : {
				deps : ['jquery', 'jquery-ui','jquery-mobile','DNA/helper.core', 'DNA/timer.core','DNA/physics.engine',
					'DNA/endGame.theme','DNA/events.engine','DNA/engine.core','DNA/stage.core',
					'DNA/sequence.core','DNA/splash.theme','DNA/tree.core','DNA/multiSelect.core',
					'DNA/newick.core','DNA/lang.module','DNA/fitch.core','DNA/board.theme','DNA/highlighter.theme',
					'DNA/protocal.core','DNA/score.theme','theme/main.theme'],	
			},
			'RNA/main.rna' : {
				deps : ['jquery','jquery-ui','DNA/main.core','RNA/stage.ext','RNA/sequence.ext'],	
			},
			'controller/hashbang.page' : {
				deps : ['jquery','DNA/helper.core','DNA/timer.core','DNA/lang.module','menu/tailor.menu','controller/site.controller','menu/events.menu'],
			},
			'jquery.dataTable' : {
				deps : ['jquery','jquery-ui'],
			},
			'misc/detectIE' :  {
				deps : ['jquery','DNA/helper.core']
			},		
			'bootbox' : {
				deps : ['jquery','bootstrap'],
			},
			'validation/login.validation' : {
				deps : ['jquery', 'validation/cookie.validation'],
			},
			'ranking/DT_bootstrap_ranking' : {
				deps : ['jquery','bootstrap','jquery.dataTable'],
			},
			'history/DT_bootstrap_history' : {
				deps : ['jquery','bootstrap','jquery.dataTable'],
			},
			'DNA/helper.core' : {
				deps : ['jquery'],
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
	require(['misc/detectIE']);
	require(['bootstrap','mustache']);
	require(['backbone']);
	require(['theme/main.theme']);
	require(['bootbox']);
	require(['validation/login.validation']);
	require(['controller/hashbang.page'],function() {
		$.hashbang.load($.hashbang.get());
	});
})();
