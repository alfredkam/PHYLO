$(function(){
    var type = "my"
    switch (window.location.hash){
        case "#top10":
            type = "top10";
            break;
        case "#my":
        default:
            type = "my";
            break;
    }
    console.log(type);
    $("#tab-" + type).addClass("active");
    load(type);
});


function load(type){
    $("#table-hs > thead").empty();
    $("#table-hs > tbody").empty();
    $.getJSON(
        'ajax/hs.php?type=' + type,
        function(data){
            $("#table-hs > thead").append(createRow(data.header, "<th></th>"));
            var table = $("#table-hs");
            for (var i = 0; i < data.rank.length; i++){
                switch (data.rank[i][0]){
                    case "highlight":
                        table.append(createRow(data.rank[i][1], "<td></td>").addClass("highlight"));
                        break;
                    case "empty":
                        table.append($("<tr></tr>").html("<p>&nbsp;</p>"));
                        break;
                    case "string":
                        table.append(
                            $("<tr></tr>").append(
                                $("<td></td>")
                                    .text(data.rank[i][1])
                                    .css({
                                        "text-align": "center",
                                        "border": "none"
                                        })
                                    .attr("colspan", data.header.length)
                            )
                        );
                        break;
                    default:
                        if (data.rank[i].length > 1){
                            table.append(createRow(data.rank[i][1], "<td></td>"));
                        }
                        break;
                }
            }
            
            // first and last cols are left and right aligned, respectively.
            // other columns are centered
            $("#table-hs tr td, #table-hs tr th").css(
                "text-align", "center"
            );
            $("#table-hs tr td:first-child, #table-hs tr th:first-child").css(
                "text-align", "left"
            );
            $("#table-hs tr td:last-child, #table-hs tr th:last-child").css(
                "text-align", "right"
            );
            $("#table-hs tr td:only-child, #table-hs tr th:only-child").css(
                "text-align", "center"
            );
        }
    );
}

/**
 * Creates a single row in a table.
 * data: an array of strings to be put into the row
 * type: type of DOM element to create for each item. Ex. "<td></td>"
 * returns a DOM tr element.
 */
function createRow(data, type){
    var ret = $("<tr></tr>");
    for (var i = 0; i < data.length; i++){
        $(type).html(data[i]).appendTo(ret);
    }
    return ret;
}
