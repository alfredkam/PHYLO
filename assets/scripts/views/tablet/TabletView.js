define([
    "jquery",
    "backbone",
    "marionette",
    "underscore",
    //tpl
    "text!tpl/tablet/TabletMenu.mustache"
], function(
    $, Backbone, Marionette, _,
    tpl
){
    var TabletView = Marionette.ItemView.extend({
        initialize : function(options){
            // console.log(this.model.toJSON());
            this.lang = options.lang;
            this.user = options.user;
            this.model.set({
                lang: this.lang,
                user : this.user.toJSON().name
            });
        },
        template : tpl
    });

    return TabletView;
});