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
    'text!tpl/app/footer/FooterLayout.mustache',
    'text!tpl/app/footer/RecentNewsTitle.mustache'
], function(
    $, _ , Backbone, Marionette,
    FooterNav, RecentNewsView, FooterStatsView,
    tpl, recentNewsTitleTpl
){
    var FooterLayout = Marionette.Layout.extend({
        initialize : function(){
            var self = this;
            this.model.set("year",new Date().getFullYear());
            this.model.on("change", this.updateTemplate, this);
            var tempModel = Backbone.Model.extend({
                url: "/phpdb/openPhyloClassicStatus.php"
            });
            this.statsModel = new tempModel();
            this.statsModel.on("change", this.updateStats, this);
            this.statsModel.fetch();
            window.setInterval( function() {
                self.statsModel.fetch({
                    success : function() {
                        self.updateStats();
                    //    console.log("updated");
                    }
                });
            }, 30000);
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
            }),
            recentNewsTitle : new Marionette.Region({
                el : "#recentNewsTitle"
            })
        },
        updateStats : function() {
            this.regions.stats.reset();
            this.regions.stats.show(new FooterStatsView({
                langModel : this.model,
                model : this.statsModel
            }));
        },
        recentNewsTitleView : Marionette.ItemView.extend({
            template : recentNewsTitleTpl
        }),
        updateTemplate : function(){
            var self = this;
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
            // this.regions.recentNews.reset();
            // this.regions.recentNews.show(new RecentNewsView({
            //     model : this.model
            // }));
            this.regions.recentNewsTitle.reset();
            this.regions.recentNewsTitle.show(new self.recentNewsTitleView({
                model : this.model
            }));
        },
        onShow : function() {
            this.regions.recentNews.reset();
            this.regions.recentNews.show(new RecentNewsView());
        }
    });
    return FooterLayout;
});