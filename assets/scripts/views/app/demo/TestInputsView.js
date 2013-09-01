define(
		[
		 "jquery",
		 "underscore",
		 "backbone",
		 "marionette",
		 "text!tpl/app/demo/TestInputs.mustache",
		 ],function($,_,Backbone,Marionette,tpl){

			var TestInputViews = Marionette.ItemView.extend({
				tagName:"div",
				className:"",
				id:"demoContent",
				template : tpl,
				initialize:function(options){
					this.model = options.model|| new Backbone.Model();
				},
				onShow:function(){
					
				},
			});
			return TestInputViews;
		});
