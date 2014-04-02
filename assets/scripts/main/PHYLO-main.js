require.config({
	waitSeconds : 40,
	baseUrl : "assets/",

	paths : {
		// Require Plugins
		text : "bower_components/requirejs-text/text",
		// Others
		backbone : "bower_components/backbone/backbone-min",	
		marionette : "bower_components/marionette/lib/backbone.marionette.min",	
		"backbone.wreqr" : "bower_components/backbone.wreqr/lib/backbone.wreqr.min",
		"backbone.babysitter" : "bower_components/marionette/public/backbone.babysitter",
		// "backbone.eventbinder" : "bower_components/marionette/backbone.eventbinder",
		json : "bower_components/json/json2",
		jquery: "bower_components/jquery/jquery.min",
		underscore : "bower_components/underscore/underscore-min",
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
		misc : 'scripts/misc',
		lang : 'scripts/lang',
		dev : 'scripts/util/devTools',
		util : 'scripts/util',
		//remapping js -> scripts
		js : 'scripts/',
		views : 'scripts/views',
		models : 'scripts/models',
		controller : 'scripts/controller',
		tpl : "tpl",
		nprogress : "bower_components/nprogress/nprogress",
		phyloStart : 'scripts/phylo-lib/menu/gameMenu.actions',
		modernizr : "bower_components/modernizr/modernizr",
		//mocks for canvg
		canvg : "bower_components/canvg",
		csb : 'http://132.206.3.203/jsapi/csb'
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
		jquery : {
			deps : [ "json" ],
			exports : "jQuery"
		},
		underscore : {
			deps : [ "json" ],
			exports : "_"
		},
		backbone : {
			deps : [ "jquery", "underscore" ],
			exports : "Backbone"
		},
		marionette : {
			deps : [ "jquery", "backbone", "underscore"],
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
		// 'scripts/phylo-lib/menu/gameMenu.actions' : {
		// 	deps : ['jquery','models/disease.data','DNA/main.core']
		// },
		phyloStart : {
			deps : ['jquery', 'jquery-ui','models/disease.data','DNA/main.core','DNA/helper.core', 'DNA/timer.core','DNA/physics.engine',
				'DNA/endGame.theme','DNA/events.engine','DNA/engine.core','DNA/stage.core',
				'DNA/sequence.core','DNA/splash.theme','DNA/tree.core','DNA/multiSelect.core',
				'DNA/newick.core','DNA/lang.module','DNA/fitch.core','DNA/board.theme','DNA/highlighter.theme',
				'DNA/protocal.core','DNA/score.theme']	
		},
		'DNA/stage.core' : {
			deps : ['DNA/physics.engine', 'DNA/events.engine','DNA/engine.core']
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
		'menu/tailor.menu' : {
			deps : ['jquery']
		},
		'DNA/timer.core' : {
			deps : ['jquery']
		},
		'DNA/lang.module' : {
			deps : ['jquery']
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
		"views/HeaderView" : {
			deps : ['validation/cookie.validation.amd','marionette']
		},
		'views/site.views' : {
			deps : ['views/request.views','views/variable.listener']
		},	
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
		},
		"scripts/phylo-lib/protocal.core" : {
			deps : ['jquery'],
			exports : "jQuery"

		}

	}
});

require([ 
	"marionette", "mustache", "scripts/App", "scripts/util/WebConsoleUtils", 
	//NO EXPORT
	"jquery", "nprogress", "bootbox", "modernizr", "csb"
], function(
	Marionette, Mustache, App, WebConsoleUtils
){
	NProgress.start();
	//get configs from main.js
	var config = window["PHYLO"].getConfig();
	//config if to display console
	var consoleUtils = new WebConsoleUtils({
		debug: config.DEBUG
	});	
	consoleUtils.initConsole();

	// Assigning Renderer
	Backbone.Marionette.Renderer.render = function(template, data) {
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