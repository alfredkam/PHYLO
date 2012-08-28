(function() {
    $(document).ready(function(){
        $('.dataTable').dataTable({
            "sPaginationType": "full_numbers",
            "aaSorting": [[ 5, "desc" ]],
            "oLanguage": {
                "sUrl": "js/extra/datatable_" + window.langOpt.toUpperCase() + ".txt"
            },
            "fnDrawCallback": function ( oSettings ) {
                if ( oSettings.bSorted || oSettings.bFiltered ) {
                    for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ ) {
                        $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                    }
                }
            },
            "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] } ]                    
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
}