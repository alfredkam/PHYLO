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
         template : tpl
     });
     return IndexView;
});
        
