define([
        "jquery",
        "underscore",
        "backbone",
        "marionette",
        
        // template
        "text!tpl/slider_view.mustache"
], function($, _, Backbone, Marionette, 
		tpl){
	var SliderView = Marionette.ItemView.extend({
		tagName : 'div',
		className : "col_12 paddle embeddedPaddle",
		template : tpl,
		ui : {
			paddle : 'div.gasPaddle',
			leftBar : 'div.leftPaddle',
			rightBar : 'div.rightPaddle',
			leftScore : 'div.leftScore',
			rightScore : "div.rightScore",
			container : "div.col_8"
		},
		
		events: {
			"mousedown div.gasPaddle" : "listen"
		},
		
		listen : function(e){			
			this.bindEvent();
		},
		
		onMove : function(e){
			var width = this.ui.container.width();
			var paddleWidth = this.ui.paddle.width();
			var offset = parseInt(this.ui.leftBar.offset().left);						
			
			// Calculating relative position according to current position of the cursor relative to the slide bar
			var relPos = parseInt(((e.pageX - offset - paddleWidth / 2) / (width - paddleWidth)) * 100);
			
			if( relPos < 0 ) {
				this.left = 0;
			} else if ( relPos > 100 ) {
				this.left = 100;
			} else {
				this.left = relPos;
			}
			
			// setting score
			this.ui.leftScore.html(this.left + "%");
			this.ui.rightScore.html((100 - this.left) + "%");
			
			// changing paddle position
			var paddlePos = (width - paddleWidth) / width * this.left;
			this.ui.paddle.css({ "left" : paddlePos + "%" });
			
			// Changing bar position
			var leftCss = ((width - paddleWidth) * this.left / 100 + (paddleWidth / 2) ) / width * 100;
			var rightCss = 100 - leftCss;
			this.ui.leftBar.css({ width : leftCss + '%' });
			this.ui.rightBar.css({ width : rightCss + '%' });
			
		},
		
		bindEvent : function(){
			var self = this;
			if('ontouchstart' in window.document.documentElement) {
				$(window.document).bind("touchmove", function(e){
					e.preventDefault();
					if(e.originalEvent.touches && e.originalEvent.touches.length) {
						e = e.originalEvent.touches[0];
					}
					self.onMove(e);
				});
				
				$(window.document).bind("touchend", function(e){
					e.stopPropagation();
					$(this).unbind("touchmove");
					$(this).unbind("touchend");
				});
			}
			
			$(window.document).mousemove(function(e){
				self.onMove(e);
			});
			
			$(window.document).mouseup(function(e){
				e.stopPropagation();
				$(this).unbind("mousemove");
				$(this).unbind("mouseup");
				self.model.set({
					left: self.left,
					right : 100 - self.left,
				});
			});	
		},
		
		init: function(){
			// setting max-width for the paddle
			this.ui.paddle.css({ "max-width" : "50px" });
			
			// adjusting left and right color width
			var left = this.model.get('left');
			var width = this.ui.container.width();
			var paddleWidth = this.ui.paddle.width();
			var leftCss = ((width - paddleWidth) * left / 100 + (paddleWidth / 2) ) / width * 100;
			var rightCss = 100 - leftCss;
			this.ui.leftBar.css({ width : leftCss + '%' });
			this.ui.rightBar.css({ width : rightCss + '%' });
			
			// adjusting paddle position
			var paddlePos = (width - paddleWidth) / width * left;
			this.ui.paddle.css({ "left" : paddlePos + "%" });
			this.left = left;
		},
		
		onChange : function() {
			this.left = this.model.get('left');
			
			var width = this.ui.container.width();
			var paddleWidth = this.ui.paddle.width();
			var offset = parseInt(this.ui.leftBar.offset().left);
			
			// setting score
			this.ui.leftScore.html(this.left + "%");
			this.ui.rightScore.html((100 - this.left) + "%");
			
			// changing paddle position
			var paddlePos = (width - paddleWidth) / width * this.left;
			this.ui.paddle.css({ "left" : paddlePos + "%" });
			
			// Changing bar position
			var leftCss = ((width - paddleWidth) * this.left / 100 + (paddleWidth / 2) ) / width * 100;
			var rightCss = 100 - leftCss;
			this.ui.leftBar.css({ width : leftCss + '%' });
			this.ui.rightBar.css({ width : rightCss + '%' });
		},
		
		onShow : function(){			
//			console.log('slider view showing');
			this.init();
			// bind model's change
			this.model.on('change', this.onChange, this);
			
		},
		
		onClose: function(){
			this.model.off(null, null, this);
		}
		
	});
	
	return SliderView;
});