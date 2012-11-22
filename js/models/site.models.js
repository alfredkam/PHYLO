(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'views/request.views',
		'views/navBar.views',
	],
    function($, _, Backbone , Mustache, Request, NavBar) { 
		var Tutorial = Backbone.Model.extend({
			defaults:{
				lang: "EN",
			},
		    initialize: function(pageLang){
			//set it to autoload when created
            //this.set({lang:lang});
			    this.url="js/models/tutorial/"+pageLang.lang+"-tutorial.js";
                //this.fetch();
			},
            
		    fetch: function(callback){
                var self = this;
                $.ajax({
                    url: self.url,
                    dataType: 'json',
                }).done(function(resp){
                    //console.log(this);
                    self.set({data:resp});
                    if(callback && callback.success){
                        callback.success();
                    }
                    
                    
                }).fail(function(resp){
                    console.log("Tutorial Model fail",resp);   
                });
               return; 
                                    
                    
            },
            getData:function(){
                return this.get("data");
                //return this.attribites.data;

            }
		});

		return {
			Tutorial : Tutorial,
		}
	}
);

})();

