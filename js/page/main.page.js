(function() {
	$.page = {
		play : function() {
			this.protocal("content/play.html");
		},
		change : function(content) {
			$("#mid-panel").html(content);
		},
		protocal : function(url) {
			var self = this;
			$.ajax({
				url : url,
				type : "post",
			}).done(function(re) {
				self.change(re);	
			});
		},
	};
})();
