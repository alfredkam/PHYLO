define([
    //Libraries
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    //Views,
    "scripts/views/app/footer/FooterNavView",
    "scripts/views/app/footer/RecentNewsView",
    //Templates
    'text!tpl/app/footer/FooterLayout.mustache'
], function(
    $, _ , Backbone, Marionette,
    FooterNav, RecentNewsView,
    tpl
){
    var FooterLayout = Marionette.Layout.extend({
        initialize : function(){
            this.model.set("year",new Date().getFullYear());
            this.model.on("change", this.updateTemplate, this);
        },
        template : tpl,
        regions : {
            nav : new Marionette.Region({
                el : "#footerNav"
            }),
            recentNews : new Marionette.Region({
                el : "#recentNews"
            })
        },
        updateTemplate : function(){
            this.regions.nav.reset();
            this.regions.nav.show(new FooterNav({
                model : this.model
            }));
        },
        onShow : function() {
            this.regions.recentNews.show(new RecentNewsView({

            }));
        }
    });
    return FooterLayout;
});