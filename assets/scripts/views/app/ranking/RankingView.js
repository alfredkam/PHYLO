define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/ranking/Ranking.mustache",
         //Modules
         "dataTables"
], function(
        $, _, Backbone, Marionette,
        tpl,
        dataTables

) {
     var RankingView = Marionette.ItemView.extend({
         initialize : function(options) {
            this.lang = options.lang || {};
         },
         template : tpl,
         onShow : function() {
            dataTables.init();
         }
     });
     return RankingView;
});
        
