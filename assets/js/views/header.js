(function(){
	define([
		'jquery',
		'backbone',
		'mustache'
	], function($, Backbone, Mustache,tpl) {
		var HeaderView = Backbone.view.extend({
			el : "header",
			initalize : function(options) {
				options = options || {};
				options.tpl = tpl;
				this.model = options.model;
				this.profile = new Profile();

				var self = this;
				this.listenTo(this.model, "change reset", this.render);
			},
			render : function() {
				
				return this;
			}
		});

		return HeadView;
	});
})();
