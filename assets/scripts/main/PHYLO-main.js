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
		yepnope : "bower_components/yepnope/yepnope",
		"moment" : "bower_components/moment/moment",
		//bootbox : "bower_components/bootbox/bootbox.min",
		bootbox : "bower_components/bootbox/bootbox",
		dataTables : "bower_components/datatables/media/js/jquery.dataTables",
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
		tpl : "tpl",
		nprogress : "bower_components/nprogress/nprogress"
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
		'views/customizeGame.actions' : {
			deps : ['jquery']
		},
		'scripts/phylo-lib/menu/gameMenu.actions' : {
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
				'DNA/protocal.core','DNA/score.theme']	
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
		'menu/tailor.menu' : {
			deps : ['jquery']
		},
		'DNA/timer.core' : {
			deps : ['jquery']
		},
		'DNA/lang.module' : {
			deps : ['jquery']
		},
		// 'validation/cookie.validation' : {
		// 	deps : ['jquery']
		// },
		// 'validation/login.validation' : {
		// 	deps : ['jquery', 'DNA/protocal.core', 'validation/cookie.validation']
		// },
		'views/DT_bootstrap_ranking.actions' : {
			deps : ['jquery','bootstrap','dataTables']
		},
		'views/DT_bootstrap_history.actions' : {
			deps : ['jquery','bootstrap','dataTables']
		},
		'DNA/helper.core' : {
			deps : ['jquery']
		},
		"views/HeaderView" : {
			deps : ['validation/cookie.validation.amd']
		},
		'views/site.views' : {
			deps : ['views/request.views','views/variable.listener']
		},	
		// 'views/navBar.views' : {
		// 	deps : ['jquery','underscore', 'backbone','DNA/timer.core','views/lang.views']
		// },
		'dev/devTools' : {
			deps : ['jquery']
		},
		'jquery.notify' : {
			deps : ['jquery', 'jquery-ui']
		},
		'util/example' : {
			deps : ['jquery', 'backbone', 'underscore','mustache']
		},
		'scripts/views/validation/cookie.validation' : {
			deps : ['jquery']
		},
		"nprogress" : {
			deps : ["jquery"]
		}
	}
});

require([ 
	"marionette", "mustache", "scripts/App","jquery", "nprogress", "bootbox"
], function(
	Marionette, Mustache, App
){
	//should configure nprogress here
	NProgress.start();
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
