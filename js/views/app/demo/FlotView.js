define([ "jquery", "underscore", "backbone", "marionette", "flot",
         "text!tpl/app/flotDemo.mustache", ],
         function($, _, Backbone,
        		 Marionette, flot,tpl)
        		 {

	var FlotView = Marionette.ItemView.extend({
		updatePlot:{},
		sineData:[],
		sinePos:0,
		tagName : "div",
		className : "",
		id : "flotDemoContent",
		template : tpl,
		flot2Options:  {
					yaxis: { min: -2.5, max: 2.5,  },
					xaxis: { show: false, },			
		},
		ui : {
			graph1 : 'div.flot1',
			graph2 : 'div.flot2',


		},
		initialize : function(options)
		{
			this.model = options.model || new Backbone.Model();

		},
		onShow : function()
		{
			var data = [];
			for (var i = 0; i < 50; i+=0.5){       
				data.push([i, Math.cos(i)+i]);
			}
			var options = {
					series: {
						lines: { show: true },
						yaxis: { min: 0, max: 50 },
						xaxis: { show: false }						
					},
					grid: {
						backgroundColor: { colors: ["#f2f2f2", "#2f2f2f"]  }
					},
			};

			$.plot(this.ui.graph1,
					[
					 {
						 data:data,points:{symbol: "circle"}
					 }
					 ],
					 options);
			
			
			this.updatePlot = $.plot(this.ui.graph2,  [this.getNextSine()] , this.flot2Options);



			this.update();

		},
		getNextSine: function() {
			if(this.sinePos>10000){
				this.sinePos=0;
			}
			this.sineData=this.sineData.slice(1);
			while (this.sineData.length < 50) {
				this.sineData.push([this.sinePos,2*Math.sin(this.sinePos)]);
				this.sinePos+=0.05;
			}
			return this.sineData;
		},
		update:function() {
			this.updatePlot = $.plot(this.ui.graph2,  [this.getNextSine()] , this.flot2Options);
			var self=this;
			setTimeout(function(){self.update();}, 30);
		}
	});
	return FlotView;
        		 });


