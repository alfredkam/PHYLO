define([
    //LIBRARIES
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "mustache",
    //TEMPLATES
    "text!tpl/app/CustomizeMusic.mustache",
    "scripts/views/validation/cookie.validation.amd"
], function(
    $, _, Backbone, Marionette, Mustache,
    tpl, cookie
) {
    var CustomizeView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.lang = options.lang || {};
        },

        volTargets: {
            "musicVol": ["game-audio"],
            "countdownVol": ["startSound", "countdownSound"],
            "redrawVol": ["redrawSound"],
            "starVol": ["lightUpSound", "starClickSound"],
            "fxOthersVol": ["endGameSound"]
        },
        template: tpl,
        ui: {},
        events: {
            "click .customize-save": "customizeSave",
            // "click .customize-tab a": "customizeTab",
            "click a.btn[id|='customize']": "volChanges",
            "mute #muteBtn": "muteToggle",
        },
        volChanges: function(e) {
            //var vol = $(e.target).prop("checked")?1:0;
            var vol = $(e.target).hasClass("musicDisabled") ? 1 : 0;
            var target = e.target.id.replace("customize-", "") + "Vol";
            cookie.create(target, vol, 365);
            for (var i in this.volTargets[target]) {
                try {
                    document.getElementById(this.volTargets[target][i]).volume = vol;
                } catch (err) {}
            }
            if ($(e.target).hasClass("musicDisabled")) {
                $(e.target).removeClass("musicDisabled");
            } else {
                $(e.target).addClass("musicDisabled");
            }
            this.checkMuteStat();
            return false;
        },
        muteToggle: function(e) {
            for (var i in this.volTargets) {
                var id = "#customize-" + i.replace("Vol", "");

                if (e.originalEvent.vol === 0) {
                    $(id).addClass("musicDisabled");

                    //$(id).prop("checked",false);
                } else {
                    $(id).removeClass("musicDisabled");
                    //$(id).attr("checked",true);
                }
                // for (var j in this.volTargets[i]) {
                //         document.getElementById(this.volTargets[i][j]).volume = e.data===0?0:1;
                // }
                $(id).trigger("click").trigger("click");
            }
            return false;
        },
        checkMuteStat: function() {
            var tot = 0;
            //checks if its all muted or not;
            for (var i in this.volTargets) {
                for (var j in this.volTargets[i]) {
                    try {
                        tot += document.getElementById(this.volTargets[i][j]).volume;
                    } catch (e) {

                    }
                }
            }
            if (tot === 0) {
                $("#volume i").removeClass("icon-volume-up-1").addClass("icon-volume-off-1");
            } else {
                $("#volume i").addClass("icon-volume-up-1").removeClass("icon-volume-off-1");
            }
        },
        customizeSave: function() {

            $(".musicOptions.customize").hide();
        },
        // customizeTab: function(e) {
        //     $(".customize-tab .row a").each(function() {
        //         $(this).removeClass("customize-tab-onselect");
        //     })
        //     // $(".customize-tab .row").
        //     $(e.target).addClass("customize-tab-onselect");
        //     if ($(e.target).hasClass("tag-theme")) {
        //         $(".customize-theme").show();
        //         $(".customize-music").hide();
        //     } else {
        //         $(".customize-theme").hide();
        //         $(".customize-music").show();
        //     }
        // },
        getSoundSettings: function() {
            var sounds = ["musicVol", "countdownVol", "redrawVol", "starVol", "fxOthersVol"];
            for (var i in sounds) {
                var id = "#customize-" + sounds[i].replace("Vol", "");

                if (parseInt(cookie.read(sounds[i])) === 0) {
                    $(id).addClass("musicDisabled");

                    //$(id).prop("checked",false);
                } else {
                    $(id).removeClass("musicDisabled");
                    //$(id).attr("checked",true);
                }
            }
        },
        templateHelpers: function() {
            return {
                lang: this.lang
            };
        },
        onShow: function() {
            this.getSoundSettings();
            // $(".customize-music").hide();

            // console.log(this.deCode("rgb%28255%2C%20255%2C%20255%29"));
        }
    });
    return CustomizeView;
});