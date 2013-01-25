(function(){
	requirejs.config({
		waitSeconds : 15,
		baseUrl : 'lib',
		paths : {
		     	DNA : '../js/phylo-lib',
		     	RNA : '../js/RNA',
			validation : '../js/views/validation',
			controller : '../js/controller',
			misc : '../js/misc',
			lang : '../lang',
			views : '../js/views',
			models : '../js/models',
			dev : '../js/devTools'
		},
		shim : {
			'jquery/jquery-ui' : {
				deps : ['jquery/jquery']
			},
			'jquery/jquery' : {
				exports : "$"
			},
			'yepnope/yepnope' : {
				exports : "yepnope"
			},
			'underscore/underscore' : {
				exports : "_"
			},
			'backbone/backbone' : {
				deps : ['underscore/underscore', 'jquery/jquery'],
				exports : "Backbone"
			},
			'bootstrap/bootstrap' : {
				deps : ['jquery/jquery','jquery/jquery-ui']
			},
			'mustache/mustache' : {
				deps : ['jquery/jquery']
			},
			'views/customizeGame.actions' : {
				deps : ['jquery/jquery']
			},
			'views/gameMenu.actions' : {
				deps : ['jquery/jquery','models/disease.data','DNA/main.core']
			},		
			'DNA/stage.core' : {
				deps : ['DNA/physics.engine', 'DNA/events.engine','DNA/engine.core']
			},
			'DNA/main.core' : {
				deps : ['jquery/jquery', 'jquery/jquery-ui','DNA/helper.core', 'DNA/timer.core','DNA/physics.engine',
					'DNA/endGame.theme','DNA/events.engine','DNA/engine.core','DNA/stage.core',
					'DNA/sequence.core','DNA/splash.theme','DNA/tree.core','DNA/multiSelect.core',
					'DNA/newick.core','DNA/lang.module','DNA/fitch.core','DNA/board.theme','DNA/highlighter.theme',
					'DNA/protocal.core','DNA/score.theme','views/customizeGame.actions']	
			},
			'DNA/protocal.core' : {
				deps : ['jquery/jquery']
			},
			'RNA/stage.ext' : {
				deps : ['jquery/jquery','DNA/stage.core']
			},
			'RNA/sequence.ext' : {	
				deps : ['jquery/jquery', 'DNA/sequence.core']
			},
			'RNA/main.rna' : {
				deps : ['DNA/main.core','RNA/stage.ext','RNA/sequence.ext']	
			},
			'jquery/jquery.dataTables' : {
				deps : ['jquery/jquery','jquery/jquery-ui']
			},
			'views/detectIE.actions' :  {
				deps : ['jquery/jquery','DNA/helper.core']
			},		
			'bootbox/bootbox' : {
				deps : ['jquery/jquery','bootstrap/bootstrap']
			},
			'controller/site.controller' : {
				deps : ['jquery/jquery']
			},
			'menu/navBar.actions' : {
				deps : ['jquery/jquery','views/request.views']
			},
			'menu/tailor.menu' : {
				deps : ['jquery/jquery']
			},
			'DNA/timer.core' : {
				deps : ['jquery/jquery']
			},
			'DNA/lang.module' : {
				deps : ['jquery/jquery']
			},
			'validation/cookie.validation' : {
				deps : ['jquery/jquery']
			},
			'validation/login.validation' : {
				deps : ['jquery/jquery', 'DNA/protocal.core', 'validation/cookie.validation']
			},
			'views/DT_bootstrap_ranking.actions' : {
				deps : ['jquery/jquery','bootstrap/bootstrap','jquery/jquery.dataTables']
			},
			'views/DT_bootstrap_history.actions' : {
				deps : ['jquery/jquery','bootstrap/bootstrap','jquery/jquery.dataTables']
			},
			'DNA/helper.core' : {
				deps : ['jquery/jquery']
			},
			'views/site.views' : {
				deps : ['views/request.views','views/variable.listener']
			},	
			'views/navBar.views' : {
				deps : ['jquery/jquery','underscore/underscore', 'backbone/backbone','DNA/timer.core','views/lang.views']
			},
			'controller/router' : {
				deps : ['jquery/jquery','underscore/underscore','backbone/backbone','views/site.views','views/navBar.views']
			},
			'dev/devTools' : {
				deps : ['jquery/jquery']
			},
			'jquery/jquery.notify' : {
				deps : ['jquery/jquery', 'jquery/jquery-ui']
			},	
		}
	});
	require(['yepnope/yepnope'],
		function() {
			//loads tablet UX
			window.isTablet = navigator.userAgent.match(/(iPad|Android .* Chrome\/[.0-9]* (?!Mobile)|Opera Tablet|Android .* (?!Mobile)|Tablet|silk|kindle fire)/i) != null;
			yepnope({
				test : isTablet,
				yep : ['css/tablet.css','js/views/tablet.js'],
				nope : ['css/media1280.css','css/media1180.css','css/media1024.css']
			});
			//check if ipad and load ipad fix
			var isiPad = navigator.userAgent.match(/(ipad)/i);
			yepnope({
				test : isiPad,
				yep : ['css/ipad-fix.css']
			});
			//test mode script injection
			yepnope({
				test : window.DEV.enableTabletMode,
				yep : 'css/tablet.css'
			});
			//check if mobile phone
			var isMobile = navigator.userAgent.match(/(iPhone|Android .* Mobile)/i) != null;
			if(isMobile) 
				window.location = "http://phylo.cs.mcgill.ca/archive/js/F2011";
			//check if Win 64 FF
			var isWinFF = navigator.userAgent.match(/Windows .* Firefox/) != null;
			yepnope({
				test : isWinFF,
				yep : ['css/FF-Win-fix.css']
			});
		}
	);

	require([
		'jquery/jquery',
		'underscore/underscore',
		'backbone/backbone',
		'mustache/mustache',
		'controller/router'
	],function($, _, Backbone, Mustache, Router) {
		Router.init();
	});

	require(['jquery/jquery.notify']);
	require(['dev/devTools']);
	require(['views/detectIE.actions']);
	require(['bootstrap/bootstrap']);
	require(['views/customizeGame.actions']);
	require(['bootbox/bootbox']);
	window.setTimeout(function() {
	require(['validation/login.validation']);
	},500);
})();
