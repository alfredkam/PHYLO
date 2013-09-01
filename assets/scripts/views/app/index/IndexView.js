define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/index/Index.mustache",
], function(
        $, _, Backbone, Marionette,
        tpl
) {
     var IndexView = Marionette.ItemView.extend({
         initialize : function(options) {
            this.lang = options.lang || {};
         },
         template : tpl,
         onClose : function() {
             console.log(tpl);
         }
     });
     return IndexView;
});
        
