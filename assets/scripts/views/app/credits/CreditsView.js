define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/credits/Credits.mustache",
], function(
        $, _, Backbone, Marionette,
        tpl
) {
     var CreditsView = Marionette.ItemView.extend({
         initialize : function(options) {
            this.lang = options.lang || {};
         },
         template : tpl
     });
     return CreditsView;
});
        
