define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/tutorial/Tutorial.mustache",
], function(
        $, _, Backbone, Marionette,
        tpl
) {
     var TutorialView = Marionette.ItemView.extend({
         initialize : function(options) {
            this.lang = options.lang || {};
         },
         template : tpl
     });
     return TutorialView;
});
        
