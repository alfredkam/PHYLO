require.config({
	waitSeconds : 15,
	baseUrl : "assets/",

	paths : {
		// Require Plugins
		text : "bower_components/requirejs-text/text",
		// Others
		json : "bower_components/json/json2",
		jquery: "bower_components/jquery/jquery.min",
		underscore : "bower_components/underscore/underscore-min",
		backbone : "bower_components/backbone/backbone-min",
		marionette : "bower_components/marionette/lib/core/backbone.marionette.min",		
		"backbone.wreqr" : "bower_components/backbone.wreqr/lib/backbone.wreqr.min",
		"backbone.babysitter" : "bower_components/marionette/public/backbone.babysitter",
		// "backbone.eventbinder" : "bower_components/marionette/backbone.eventbinder",
		mustache : "bower_components/mustache/mustache",
		dust : "bower_components/dustjs/dust-full-0.3.0.min",
		spectrum: "bower_components/spectrum/spectrum",
		'jquery-ui' : 'bower_components/jquery-ui/ui/minified/jquery-ui.min',
		bootstrap : 'bower_components/bootstrap/dist/js/bootstrap.min',
		// flot : "bower_components/flot/jquery.flot",
		// "flot.time" : "bower_components/flot/jquery.flot.time",
		// "flot.pie" : "bower_components/flot/jquery.flot.pie",
		// "flot.threshold" : "bower_components/flot/jquery.flot.threshold",
		// "flot.stack" : "bower_components/flot/jquery.flot.stack",
		// "flot.crosshair" : "bower_components/flot/jquery.flot.crosshair",
		yepnope : "bower_components/yepnope/yepnope",
		"moment" : "bower_components/moment/moment",
		bootbox : "bower_components/bootbox/bootbox.min",
		dataTables : "bower_components/dataTables/media/js/jquery.dataTables",
        DNA : 'scripts/phylo-lib',
        RNA : 'scripts/RNA',
		validation : 'scripts/views/validation',
		controller : 'scripts/controller',
		misc : 'scripts/misc',
		lang : 'scripts/lang',
		views : 'scripts/views',
		models : 'scripts/models',
		dev : 'scripts/util/devTools',
		util : 'scripts/util',
		//remapping js -> scripts
		js : 'scripts/',
		tpl : "../tpl"
	},

	/*
	 * shim is used to export js files that do not follow the AMD module style
	 * It is also used to define dependencies for scripts that DO follow the
	 * module style.
	 */
	shim : {

		json : {
			exports : "JSON"
		},

		jquery : [ "json" ],

		underscore : {
			deps : [ "json" ],
			exports : "_"
		},

		backbone : {
			deps : [ "json", "underscore", "jquery" ],
			exports : "Backbone"
		},
		
		marionette : {
			deps : [ "jquery", "backbone", "underscore" ],
			exports : "Marionette"		
		},
		bootstrap : ['jquery'],
		
		"backbone.wreqr" : {
			deps : [ "backbone" ]
		},
		
		mustache : [ "json" ],
		spectrum: ['jquery'],
		'jquery-ui' : {
			deps : ['jquery']
		},
		dataTables : ['jquery'],
		
		// flot : {
		// 	deps : [ "json", "jquery" ],
		// 	exports : "jQuery"
		// },
		// "flot.time" : {
		// 	deps : [ "json", "jquery", "flot" ],
		// 	exports : "jQuery"
		// },
		// "flot.crosshair" : {
		// 	deps : [ "json", "jquery", "flot" ],
		// 	exports : "jQuery"
		// },
		// "flot.pie" : {
		// 	deps : [ "json", "jquery", "flot" ],
		// 	exports : "jQuery"
		// },
		// "flot.threshold" : {
		// 	deps : [ "json", "jquery", "flot", "flot.time" ],
		// 	exports : "jQuery"
		// },
		// "flot.stack" : {
		// 	deps : [ "json", "jquery", "flot", "flot.time", "flot.crosshair" ],
		// 	exports : "jQuery"
		// }
		// 
		'views/customizeGame.actions' : {
			deps : ['jquery']
		},
		'views/gameMenu.actions' : {
			deps : ['jquery','models/disease.data','DNA/main.core']
		},		
		'DNA/stage.core' : {
			deps : ['DNA/physics.engine', 'DNA/events.engine','DNA/engine.core']
		},
		'DNA/main.core' : {
			deps : ['jquery', 'jquery-ui','DNA/helper.core', 'DNA/timer.core','DNA/physics.engine',
				'DNA/endGame.theme','DNA/events.engine','DNA/engine.core','DNA/stage.core',
				'DNA/sequence.core','DNA/splash.theme','DNA/tree.core','DNA/multiSelect.core',
				'DNA/newick.core','DNA/lang.module','DNA/fitch.core','DNA/board.theme','DNA/highlighter.theme',
				'DNA/protocal.core','DNA/score.theme','views/customizeGame.actions']	
		},
		'DNA/protocal.core' : {
			deps : ['jquery']
		},
		'RNA/stage.ext' : {
			deps : ['jquery','DNA/stage.core']
		},
		'RNA/sequence.ext' : {	
			deps : ['jquery', 'DNA/sequence.core']
		},
		'RNA/main.rna' : {
			deps : ['DNA/main.core','RNA/stage.ext','RNA/sequence.ext']	
		},
		'jquery.dataTables' : {
			deps : ['jquery','jquery-ui']
		},
		'views/detectIE.actions' :  {
			deps : ['jquery','DNA/helper.core']
		},		
		'bootbox' : {
			deps : ['jquery','bootstrap']
		},
		// 'controller/site.controller' : {
		// 	deps : ['jquery']
		// },
		'menu/navBar.actions' : {
			deps : ['jquery','views/request.views']
		},
		'menu/tailor.menu' : {
			deps : ['jquery']
		},
		'DNA/timer.core' : {
			deps : ['jquery']
		},
		'DNA/lang.module' : {
			deps : ['jquery']
		},
		'validation/cookie.validation' : {
			deps : ['jquery']
		},
		'validation/login.validation' : {
			deps : ['jquery', 'DNA/protocal.core', 'validation/cookie.validation']
		},
		'views/DT_bootstrap_ranking.actions' : {
			deps : ['jquery','bootstrap','dataTables']
		},
		'views/DT_bootstrap_history.actions' : {
			deps : ['jquery','bootstrap','dataTables']
		},
		'DNA/helper.core' : {
			deps : ['jquery']
		},
		'views/site.views' : {
			deps : ['views/request.views','views/variable.listener']
		},	
		'views/navBar.views' : {
			deps : ['jquery','underscore', 'backbone','DNA/timer.core','views/lang.views']
		},
		'controller/router' : {
			deps : ['jquery','underscore','backbone','views/site.views','views/navBar.views']
		},
		'dev/devTools' : {
			deps : ['jquery']
		},
		'jquery.notify' : {
			deps : ['jquery', 'jquery-ui']
		},
		'util/example' : {
			deps : ['jquery', 'backbone', 'underscore','mustache']
		}	
	}
});

require(['yepnope'],
	function() {
		//loads tablet UX
		window.isTablet = navigator.userAgent.match(/(iPad|Android .* Chrome\/[.0-9]* (?!Mobile)|Opera Tablet|Android .* (?!Mobile)|Tablet|silk|kindle fire)/i) != null;
		yepnope({
			test : isTablet,
			yep : ['assets/css/tablet.css','assets/scripts/views/tablet.js'],
			nope : ['assets/css/media1280.css','assets/css/media1180.css','assets/css/media1024.css']
		});
		//check if ipad and load ipad fix
		var isiPad = navigator.userAgent.match(/(ipad)/i);
		yepnope({
			test : isiPad,
			yep : ['assets/css/ipad-fix.css']
		});
		//test mode script injection
		yepnope({
			test : window.DEV.enableTabletMode,
			yep : 'assets/css/tablet.css'
		});
		//check if mobile phone
		var isMobile = navigator.userAgent.match(/(iPhone|Android .* Mobile)/i) != null;
		if(isMobile) 
			window.location = "http://phylo.cs.mcgill.ca/archive/js/F2011";
		//check if Win 64 FF
		var isWinFF = navigator.userAgent.match(/Windows .* Firefox/) != null;
		yepnope({
			test : isWinFF,
			yep : ['assets/css/FF-Win-fix.css']
		});
	}
);

require(
[ "marionette", "mustache", "scripts/App","jquery"],
function(Marionette, Mustache, App)
{
	// var consoleUtils = new WebConsoleUtils({
	// debug: config.DEBUG
	// });
	//	
	// consoleUtils.initConsole();

	// var dashboard = new DashboardRouter();
	// Backbone.history.start();
	// Assigning Renderer
	Backbone.Marionette.Renderer.render = function(template, data) {
		//console.log("rendering with this now:");
//		console.log(data);
		if (typeof template === "function") {
			return Mustache.render(template(), data);
		}
		return Mustache.render(template, data);
	};	

	App.start();
});

// require(['jquery/jquery.notify']);
require(['dev']);
require(['views/detectIE.actions']);
require(['views/customizeGame.actions']);
require(['bootbox']);
window.setTimeout(function() {
require(['validation/login.validation']);
},500);
