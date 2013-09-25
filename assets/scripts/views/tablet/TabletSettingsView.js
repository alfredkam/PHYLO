define([
    "jquery",
    "backbone",
    "marionette",
    "underscore",
    //tpl
    "text!tpl/tablet/TabletSettings.mustache"
], function(
    $, Backbone, Marionette, _,
    tpl
){
    var TabletView = Marionette.ItemView.extend({
        initialize : function(options){
            // console.log(this.model.toJSON());
            this.lang = options.lang;
            this.model.set({
                lang: this.lang,
            }, {
                silent : true
            });
        },
        template : tpl
    });

    return TabletView;
});