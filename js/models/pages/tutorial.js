define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'views/request.views',
		'views/navBar.views',
	],
    
var Tutorial = Backbone.Model.extend({
    defaults:{
        lang: "EN",
        },
    initialize: function(lang){
        //set it to autoload when created
            this.fetch(lang);
        }
    ,
    fetch: function(lang){
        $.ajax(
            url:lang+"-tutorial.js"
            dataType: JSON,
            
        ).done(function(resp){
            this.set({data:resp});


        }
        );
        

    }
    

});
);
/*
var tutLangs = Backbone.Collection.extend({

    model:Tutorial,
    url:"../../js/tutorial/"

}
*/
/*
var Tutview = Backbone.View.extend({
    el:"#mid-panel",
    
    //when initializing, feed in a template or error  
    template:template||"error";
    render:function(){},
    
    getTemplate:function(){
        $.ajax({
				type : "GET",
				statusCode : {
					412 : function() {
						console.log(">> Warning : Status Code 412; Retrying URL : "+url);
						self.loadFailCounter+=1;
						if(self.loadFailCounter == 5) {
							//window.location.reload(true);	
							$(".warning-cancel").hide();
							$(".warning-ok").hide();
							$(".warning-msg").html("<i class='icon-remove'></i><br><b>Aww Snap!</b><br>  Something went wrong.  Please reload the page to continue!");
							$(".warning-bg").css({
								height: $(document).height(),
								width: $(document).width(),
							});
							$(".warning-bg").fadeIn();
							$(".warning").fadeIn();
						} else {
							self.protocal(url);
						}
					},
				},	
				url : url,
			}).done(function(re) {
				if (mush){
                    $.ajax({

                        type:"GET",
                        url:""
                    })
                    re= Mustache.render(tpl,window.json.tutorial);
                    self.change(re);
                    });


                }
                else{

                self.change(re);
                }
                
			});

}
*/

