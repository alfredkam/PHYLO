define([
    //LIBRARIES
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "mustache",
    "scripts/util/Request",
    //TEMPLATES
    "text!tpl/app/index/Index.mustache",
    //this one is the jquery one
    "scripts/views/validation/cookie.validation"

], function(
    $, _, Backbone, Marionette, Mustache, Request,
    tpl
) {
    var IndexView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.lang = options.lang || {};
            this.id = options.id;
            console.log("init");
        },
        template: tpl,
        render: function() {
            var request = new Request();
            // selectTab("play");
            var self = this;
            json=window.lang;
            //console.log(self.template);
            // self.$el.html(Mustache.render(self.template, json));
            self.$el.html(Marionette.Renderer.render(self.template, json));
            $("#mid-panel").fadeIn();
            $("#loading-panel").hide();
            require(["scripts/phylo-lib/menu/gameMenu.actions", "DNA/main.core"], function() {
                if ($.main == undefined) {
                    var fn = function() {
                        if ($.main == undefined) {
                            window.setTimeout(function() {
                                fn();
                            }, 100);
                        } else {
                            $("#draw").hide();
                            $("#menu").hide();
                            $.main.init({
                                type: "disease",
                                num: self.id
                            });
                        }
                    };
                    fn();
                } else {
                    $("#draw").hide();
                    $("#menu").hide();
                    $.main.init({
                        type: "disease",
                        num: self.id
                    });
                }
            });
            $("#m_contribute").unbind().click(function() {
                window.location.hash = $(this).attr("href");
            });
        }
    });
    return IndexView;
});