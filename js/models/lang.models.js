(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
	], function( $, _, Backbone, Mustache) {
		var translate = Backbone.Model.extend({
			defaults: {
				'back' : "{{body.misc.field 17}}",
				'login' : "{{body.play.gameselect.login.field 2}}",
				'logout' : "{{body.play.gameselect.login.field 17}}",
				'cancel' : "{{body.misc.field 16}}",
				'register' : "{{body.play.gameselect.login.field 3}}",
				'contribute' : "{{body.misc.field 1}}",
				'feedback' : "{{body.misc.field 3}}",
				'github' : "<i class='icon-github'></i>{{body.misc.field 4}} GitHub",
				'username' : "{{body.play.gameselect.login.field 7}}",
				'password' : "{{body.play.gameselect.login.field 8}}",
				'email' : "{{body.misc.field 5}}",	
				'customize' : "{{body.misc.field 10}}",
				'music' : "",
				'boardColor' : "{{body.misc.field 12}}",
				'dnaColor' : "{{body.misc.field 13}}",
				'restoreDefault' : "{{body.misc.field 14}}",
				'save' : "{{body.misc.field 15}}",
				'cancel' : "{{body.misc.field 16}}",
				'settingUp' : "{{body.misc.field 2}}",
				'ok' : "{{body.misc.field 18}}",
				'classic' : '{{header.field 12}}',
				'theme' : '{{body.misc.field 11}}',
				'quitGame':'{{body.misc.field 19}}',
			},
		});
		return translate;
	});
})();
