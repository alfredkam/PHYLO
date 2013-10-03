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
            this.model.set({
                "totalPuzzles" : this.langModel.toJSON().body.footer.totalPuzzles,
                "recentSubmit" : this.langModel.toJSON().body.footer.recentSubmit
            },{
                silent : true
            });
            // console.log(this.model.toJSON());
        },
        template : tpl
    });

    return FooterStatsView;
});