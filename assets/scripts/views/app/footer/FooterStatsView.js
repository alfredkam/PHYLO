define([
    //Libraries
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    //Templates
    "text!tpl/app/footer/FooterStats.mustache"
], function(
    $, _, Backbone, Marionette,
    tpl
) {
    var FooterStatsView = Marionette.ItemView.extend({
        initialize : function(opts){
            this.langModel = opts.langModel;
            var total = this.model.get("total") || 0;
            total = total.toString();
            var temp = "";
            var counter = 1;
            for (var i=total.length-1;i>=0;i--) {
                if(counter == 3) {
                    temp= ","+total[i]+temp;
                    counter = 0;
                } else {
                    counter+=1;
                    temp=""+total[i]+temp;
                }
            }
            this.model.set({
                "lang" : this.langModel.get("lang"),
                "puzzleID" : this.langModel.toJSON().body.footer.puzzleID,
                "user" : this.langModel.toJSON().body.footer.user,
                "disease" : this.langModel.toJSON().body.play.ranking["field 15"],
                "number" : temp,
                "totalPuzzles" : this.langModel.toJSON().body.footer.totalPuzzles,
                "recentSubmit" : this.langModel.toJSON().body.footer.recentSubmit,
                "unclassified" : this.langModel.toJSON().body.footer.unclassified
            },{
                silent : true
            });
        },
        template : tpl
    });

    return FooterStatsView;
});