define([
    "jquery",
    "backbone",
    "marionette",
    "underscore",
    //tpl
    "text!tpl/tablet/main_layout.mustache"
], function(
    $, Backbone, Marionette, _,
    tpl
){
    var TabletView = Marionette.ItemView.extend({
        initialize : function(){
        },
        template : tpl
    });

    return TabletView;
});