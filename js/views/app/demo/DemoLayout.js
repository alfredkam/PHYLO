define(
		[
		 "jquery",
		 "underscore",
		 "backbone",
		 "marionette",
		 "js/views/app/demo/TestInputsView",
		 "js/views/app/demo/FlotView",
		 "text!tpl/app/demo/Demo.mustache",
		 
		 ],

		 function($,_,Backbone,Marionette,TestInputsView,FlotView,tpl){
			var regionViews={flot: FlotView, TestInputsView:TestInputsView, page2:Marionette.ItemView,};

			var DemoLayout = Marionette.Layout.extend({
				tagName : "div",
				className : "container",
				id : "content",
				template : tpl,
				initialize : function(options) {
					this.model = options.model || new Backbone.Model();
				},
				regions : {
					sampleRegion: new Marionette.Region({el:"#sampleRegion"}),
				},
				// you can plug in data here for rendering
				templateHelpers: function(){
					return {}; 
				},
				events : {
					"change select#changeDemo": function(e){
						// change the region here!
						var val = $(e.target).val();
						console.log(val);
						this.regions.sampleRegion.show(new regionViews[val]({model:this.model}));
					},
					// captures the event and sets the model
					"change input" : function(e) {
						var input = $(e.target);
						var name = input.prop("name");
						this.model.set(name, input.val());
						console.log(name+" is changed to " + this.model.get(name));
					},
					"change select[id!='changeDemo']": function(e) {
						var input = $(e.target);
						var name = input.prop("name");
						this.model.set(name, input.val());
						console.log(this.model.get(name)+" is changed");
					},
				},


//				you can "fix" the model here for rendering
				serializeData : function() {
					var data = this.model.toJSON();
					return data;
				},
				onShow : function() {
					console.log("onShow is triggered!");
					this.regions.sampleRegion.show(new regionViews['TestInputsView']({model:this.model}))
					// a good place to place bindings for your model here
					console.log("binding the model to the change event!");
					this.model.on("change", function() {
						console.log(this.model);
					}, this);
				},
				onClose : function() {

					this.model.off(null, null, this);
					this.region.close();
				},

			});
			return DemoLayout;
		});	
