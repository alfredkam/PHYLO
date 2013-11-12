$(function(){
    var wrapper = $("<div></div>").attr({
        id: "debug-wrapper",
        width: 800
    }).css({
        width: 800,
        margin: 20
    });
    wrapper.bind("mousedown", function(){return false;});
    $("#page").append(wrapper);
    
    $.getScript("js/lib/jquery-ui-1.8.17.custom.min.js").done(function() {
        var score = $("<div></div>").attr({
            id: "debug-scoring"
        });
        
        score.append($("<p></p>").append($("<label></label>").attr({
            "for": "debug-score-input"
        }).text("Scoring Threshold")).append($("<input></input>").attr({
            type: "text",
            id: "debug-score-input",
            value: "10"
        })).append($("<div></div>").attr({
            id: "debug-score-slider",
            width: 300
        }).slider({
            min: 1,
            max: 100,
            value: 10,
            slide: function(event, ui){
                $("#debug-score-input").val(ui.value);
                folder.THRESHOLD = ui.value;
                foldrecalcneeded = true;
            }
        })));
        
        $("#debug-score-input").val($("#debug-score-slider").slider("value"));
        
        wrapper.append(score);
    })
    .fail(function(jqxhr, settings, exception) {
        console.log("Could not load jquery UI");
    });
});