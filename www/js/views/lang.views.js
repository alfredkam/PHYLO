(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'models/lang.models',
	], function( $, _, Backbone, Mustache, Lang) {
		var trans = new Lang;
		var translate = Backbone.View.extend({
			set : function(json) {
				
				$(".m_back").html(Mustache.render(trans.get("back"),json));	
				$(".m_login").html(Mustache.render(trans.get("login"),json));
				$("#m_cancel").html(Mustache.render(trans.get("cancel"),json));
				$("#m_register").html(Mustache.render(trans.get("register"),json));
				$("#m_contribute").html(Mustache.render(trans.get("contribute"),json));	
				$("#m_feedback").html(Mustache.render(trans.get("feedback"),json));	
				$("#m_github").html(Mustache.render(trans.get("github"),json));
				$("input#username").attr("placeholder",Mustache.render(trans.get("username"),json));
				$("input#password").attr("placeholder",Mustache.render(trans.get("password"),json));
				$("input#email").attr("placeholder", Mustache.render(trans.get("email"),json));
				$(".m_customize").html(Mustache.render(trans.get("customize"),json));
				$(".m_music").html(Mustache.render(trans.get("music"),json));
				$(".m_boardColor").html(Mustache.render(trans.get("boardColor"),json));
				$(".m_dnaColor").html(Mustache.render(trans.get("dnaColor"),json));
				$(".m_restoreDefault").html(Mustache.render(trans.get("restoreDefault"),json));
				$(".m_save").html(Mustache.render(trans.get("save"),json));
				$(".m_cancel").html(Mustache.render(trans.get("cancel"),json));	
				$(".m_ok").html(Mustache.render(trans.get("ok"),json));
				$(".m_settingUp").html(Mustache.render(trans.get("settingUp"),json));
				$("#m_classic").html(Mustache.render(trans.get("classic"),json));
				$(".m_logout").html(Mustache.render(trans.get("logout"),json));
				$(".m_theme").html(Mustache.render(trans.get("theme"),json));
			},
		});
		return translate;
	});
})();
