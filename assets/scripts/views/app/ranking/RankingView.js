define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/ranking/Ranking.mustache",
         //No Export
         "dataTables"
], function(
        $, _, Backbone, Marionette,
        tpl
) {
    var RankingView = Marionette.ItemView.extend({
        initialize : function(options) {
            this.lang = options.lang || {};
        },
        template : tpl,
        ui : {
            body : "#ranking-body"
        },
        addHtml : function(data){
            this.ui.body.html(data);
            $("table").dataTable({
                "sPaginationType": "full_numbers"
            });
        },
        onShow : function() {
            //  dataTables.init();
            var html = "";
            var self = this;
            $.ajax({
                method : "POST",
                url : "http://phylo.cs.mcgill.ca/phpdb/fullrankingsget.php?lang="+this.lang
            }).done(function(data){
                self.addHtml(data);
            }).fail(function(){
                $.ajax({
                    method : "GET",
                    url : "assets/scripts/dummy/ranking.dummy"
                }).done(function(data){
                    self.addHtml(data);
                });
            });
        }
     });
     return RankingView;
});
        
