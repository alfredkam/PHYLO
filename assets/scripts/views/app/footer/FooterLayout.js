define([
    //Libraries
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    //Views,
    "scripts/views/app/footer/FooterNavView",
    //Templates
    'text!tpl/app/footer/FooterLayout.mustache'
], function(
    $, _ , Backbone, Marionette,
    FooterNav,
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
            })
        },
        updateTemplate : function(){
            this.regions.nav.reset();
            this.regions.nav.show(new FooterNav({
                model : this.model
            }));
        },
        onShow : function() {
            
        }
    });
    return FooterLayout;
});