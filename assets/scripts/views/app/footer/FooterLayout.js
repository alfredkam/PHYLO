define([
    //Libraries
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    //Views,
    "scripts/views/app/footer/FooterNavView",
    "scripts/views/app/footer/RecentNewsView",
    "scripts/views/app/footer/FooterStatsView",
    //Templates
    'text!tpl/app/footer/FooterLayout.mustache'
], function(
    $, _ , Backbone, Marionette,
    FooterNav, RecentNewsView, FooterStatsView,
    tpl
){
    var FooterLayout = Marionette.Layout.extend({
        initialize : function(){
            this.model.set("year",new Date().getFullYear());
            this.model.on("change", this.updateTemplate, this);
            var tempModel = Backbone.Model.extend({
                url: "/phpdb/openPhyloClassicStatus.php"
            });
            this.statsModel = new tempModel();
            this.statsModel.on("change", this.updateStats, this);
            this.statsModel.fetch();
        },
        template : tpl,
        regions : {
            nav : new Marionette.Region({
                el : "#footerNav"
            }),
            recentNews : new Marionette.Region({
                el : "#recentNews"
            }),
            stats : new Marionette.Region({
                el : "#statsWidget"
            })
        },
        updateStats : function() {
            this.regions.stats.reset();
            this.regions.stats.show(new FooterStatsView({
                langModel : this.model,
                model : this.statsModel
            }));
        },
        updateTemplate : function(){
            //nav region
            this.regions.nav.reset();
            this.regions.nav.show(new FooterNav({
                model : this.model
            }));
            //stats region
            this.regions.stats.reset();
            this.regions.stats.show(new FooterStatsView({
                langModel : this.model,
                model : this.statsModel
            }));
            this.regions.recentNews.reset();
            this.regions.recentNews.show(new RecentNewsView({
                model : this.model
            }));
        }
        // onShow : function() {
        //     this.regions.recentNews.show(new RecentNewsView());
        // }
    });
    return FooterLayout;
});