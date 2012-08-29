//(function() {
    $(document).ready(function(){
        $('.dataTable').dataTable({
            "sPaginationType": "full_numbers",
            "oLanguage": {
                "sUrl": "js/extra/datatable_" + window.langOpt.toUpperCase() + ".txt"
            },
        });

        $("#showall").click(function(){
            $("#weekly").hide();
            $("#monthly").hide();
            $("#alltime").show();
            $("#showmonth").css("background-color","#fff");
            $("#showmonth").css("color","#000");
            $("#showweek").css("background-color","#fff");
            $("#showweek").css("color","#000");
            $("#showall").css("background-color","#CC0000");
            $("#showall").css("color","#fff");
        });
        $("#showmonth").click(function(){
            $("#alltime").hide();
            $("#weekly").hide();
            $("#monthly").show();
            $("#showall").css("background-color","#fff");
            $("#showall").css("color","#000");
            $("#showweek").css("background-color","#fff");
            $("#showweek").css("color","#000");
            $("#showmonth").css("background-color","#CC0000");
            $("#showmonth").css("color","#fff");
        });
        $("#showweek").click(function(){
            $("#alltime").hide();
            $("#monthly").hide();
            $("#weekly").show();
            $("#showall").css("background-color","#fff");
            $("#showall").css("color","#000");
            $("#showmonth").css("background-color","#fff");
            $("#showmonth").css("color","#000");
            $("#showweek").css("background-color","#CC0000");
            $("#showweek").css("color","#fff");
        });

    // initial display

            $("#weekly").hide();
            $("#monthly").hide();
            $("#alltime").show();
            $("#showall").css("background-color","#CC0000");
            $("#showall").css("color","#fff");
    });
//});