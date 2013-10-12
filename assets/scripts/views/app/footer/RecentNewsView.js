define([
        "backbone",
        "marionette",
        //templates
        "text!tpl/app/footer/RecentNews.mustache",

], function(backbone, Marionette, tpl){
    
    var RecentNews = Marionette.ItemView.extend({
        template : tpl
    });
    
    return RecentNews;
});
