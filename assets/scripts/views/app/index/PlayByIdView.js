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
    $, _, Backbone, Marionette, Mustache,Request,
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
            request.getJsonLang(this.lang, function(json) {
                window.lang = json;
                $("#mid-panel").html(Mustache.render(this.template, json));
                request.complete();
                require(["views/gameMenu.actions", "DNA/main.core"], function() {
                    if ($.main == undefined) {
                        var fn = function() {
                            if ($.main == undefined) {
                                window.setTimeout(function() {
                                    fn()
                                }, 100);
                            } else {
                                $("#draw").hide();
                                $("#menu").hide();
                                $.main.init({
                                    type: "disease",
                                    num: this.id
                                });
                            }
                        }
                        fn();
                    } else {
                        $("#draw").hide();
                        $("#menu").hide();
                        $.main.init({
                            type: "disease",
                            num: this.id
                        });
                    }
                });
            });
            $("#m_contribute").unbind().click(function() {
                window.location.hash = $(this).attr("href");
            });
        },
        // render: function(lang) {
        //     selectTab("play");
        //     request.getTemplate("templates/play.html", function(context) {
        //         request.getJsonLang(lang, function(json) {
        //             window.lang = json;
        //             $("#mid-panel").html(Mustache.render(context, json));
        //             request.complete();
        //             if (window.DEV.disableMenu) {
        //                 window.setTimeout(function() {
        //                     $("#draw").hide();
        //                     $("#menu").hide();
        //                     if (window.location.hash.match(/rna/i) != null) {
        //                         //  $.rna.init();
        //                     } else {
        //                         $.main.init({
        //                             type: "random",
        //                             num: 3
        //                         });
        //                     }
        //                 }, 500);
        //             }
        //         });
        //     });
        //     $("#m_contribute").unbind().click(function() {
        //         window.location.hash = $(this).attr("href");
        //     });
        // }
    });
    return IndexView;
});