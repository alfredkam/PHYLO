(function(){
	requirejs.config({
		baseUrl : 'js/blueprint',
		paths : {
		     	DNA : '../DNA',
		     	RNA : '../RNA',
		     	theme : '../theme',
			menu : '../menu',
			validation : '../validation',
			controller : '../controller',
			misc : '../misc',
			lang : '../../lang',
			tutorial : '../tutorial',
			views : '../views',
			models : '../models',
		},
		shim : {
			'jquery' : {
				exports : "$",
			},
			'yepnope' : {
				exports : "yepnope",
			},
			'underscore' : {
				exports : "_",
			},
			'backbone' : {
				deps : ['underscore', 'jquery'],
				exports : "Backbone",
			},
			'bootstrap' : {
				deps : ['jquery','jquery-ui'],
			},
			'mustache' : {
				deps : ['jquery'],
			},
			'views/customizeGame.actions' : {
				deps : ['jquery'],
			},
			'views/gameMenu.actions' : {
				deps : ['jquery','menu/settings.menu','models/disease.data','DNA/main.core'],
			},		
			'DNA/stage.core' : {
				deps : ['DNA/physics.engine', 'DNA/events.engine','DNA/engine.core'],
			},
			'DNA/main.core' : {
				deps : ['jquery', 'jquery-ui','jquery-mobile','DNA/helper.core', 'DNA/timer.core','DNA/physics.engine',
					'DNA/endGame.theme','DNA/events.engine','DNA/engine.core','DNA/stage.core',
					'DNA/sequence.core','DNA/splash.theme','DNA/tree.core','DNA/multiSelect.core',
					'DNA/newick.core','DNA/lang.module','DNA/fitch.core','DNA/board.theme','DNA/highlighter.theme',
					'DNA/protocal.core','DNA/score.theme','views/customizeGame.actions'],	
			},
			'DNA/protocal.core' : {
				deps : ['jquery'],
			},
			'RNA/main.rna' : {
				deps : ['jquery','jquery-ui','DNA/main.core','RNA/stage.ext','RNA/sequence.ext'],	
			},
			'controller/hashbang.controller' : {
				deps : ['jquery','DNA/helper.core','DNA/timer.core','DNA/lang.module','menu/tailor.menu','controller/site.controller','menu/navBar.actions'],
			},
			'jquery.dataTables' : {
				deps : ['jquery','jquery-ui'],
			},
			'views/detectIE.actions' :  {
				deps : ['jquery','DNA/helper.core']
			},		
			'bootbox' : {
				deps : ['jquery','bootstrap'],
			},
			'controller/site.controller' : {
				deps : ['jquery'],
			},
			'menu/navBar.actions' : {
				deps : ['jquery'],
			},
			'menu/tailor.menu' : {
				deps : ['jquery'],
			},
			'DNA/timer.core' : {
				deps : ['jquery'],
			},
			'DNA/lang.module' : {
				deps : ['jquery'],
			},
			'validation/cookie.validation' : {
				deps : ['jquery'],
			},
			'validation/login.validation' : {
				deps : ['jquery', 'DNA/protocal.core', 'validation/cookie.validation'],
			},
			'views/DT_bootstrap_ranking.actions' : {
				deps : ['jquery','bootstrap','jquery.dataTables'],
			},
			'views/DT_bootstrap_history.actions' : {
				deps : ['jquery','bootstrap','jquery.dataTables'],
			},
			'DNA/helper.core' : {
				deps : ['jquery'],
			},
			'views/site.views' : {
				deps : ['views/request.views'],
			},	
			'views/navBar.views' : {
				deps : ['jquery','underscore', 'backbone','DNA/timer.core'],
			},
			'controller/router' : {
				deps : ['jquery','underscore','backbone','views/site.views','views/navBar.views'],
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

	require([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'controller/router',
	],function($, _, Backbone, Mustache, Router) {
		Router.init();
	});

	require(['views/detectIE.actions']);
	require(['bootstrap']);
	require(['views/customizeGame.actions']);
	require(['bootbox']);
	require(['validation/login.validation']);
	/*
	require(['controller/hashbang.controller'],function() {
		$.hashbang.load($.hashbang.get());
	}); */
})();
