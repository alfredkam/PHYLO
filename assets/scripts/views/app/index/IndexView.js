define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/index/Index.mustache",
         //this one is the jquery one
         "scripts/views/validation/cookie.validation"

], function(
        $, _, Backbone, Marionette,
        tpl
) {
     var IndexView = Marionette.ItemView.extend({
         initialize : function(options) {
            this.lang = options.lang || {};
         },
         template : tpl,
         events:{
            "click #volume i":"toggleVolume"

         },
         toggleVolume: function(e){
            var vol=0;
            if($(e.target).hasClass("icon-volume-up-1")){
                $(e.target).removeClass("icon-volume-up-1").addClass("icon-volume-off-1");
            }
            else{
                vol=1;

                $(e.target).addClass("icon-volume-up-1").removeClass("icon-volume-off-1");
            }
            var cusEvent = jQuery.Event( {type:"mute",  vol: vol } );
            $("#muteBtn").trigger(cusEvent);
            return false;
         },
     });
     return IndexView;
});
        
