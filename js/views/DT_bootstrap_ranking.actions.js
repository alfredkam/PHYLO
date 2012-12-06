$(document).ready(function(){

    /* Default class modification */
    $.extend( $.fn.dataTableExt.oStdClasses, {
        "sWrapper": "dataTables_wrapper form-inline"
    } );

    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
    {
        console.log("fnPagingInfo:"+oSettings);
        return {
            "iStart":         oSettings._iDisplayStart,
            "iEnd":           oSettings.fnDisplayEnd(),
            "iLength":        oSettings._iDisplayLength,
            "iTotal":         oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
            "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
        };
    }

    /* Bootstrap style pagination control */

    $.extend( $.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function( oSettings, nPaging, fnDraw ) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function ( e ) {
                    e.preventDefault();
                    if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                        fnDraw( oSettings );
                    }
                };
                $(nPaging).addClass('pagination').append(
                    '<ul>'+
                        '<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
                        '<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
                    '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
                $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
             },

            "fnUpdate": function ( oSettings, fnDraw ) {
             
                console.log("fnUpdate:"+oSettings);
                console.log("fnUpdate 2:"+oSettings.oInstance);
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo(oSettings);
                var an = oSettings.aanFeatures.p;
                var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                if ( oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                }
                else if ( oPaging.iPage <= iHalf ) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                    // Add the new list items and their event handlers
                    for ( j=iStart ; j<=iEnd ; j++ ) {
                        sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                        $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                            .insertBefore( $('li:last', an[i])[0] )
                            .bind('click', function (e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                                fnDraw( oSettings );
                            } );
                    }

                    // Add / remove disabled classes from the static elements
                    if ( oPaging.iPage === 0 ) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }

                    if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
             
                console.log("CLOSE fnUpdate:"+oSettings);
             
            }
        }
    } );
                  
                  
function g(){};

 g.prototype.init = function() {

    /* Table initialisation */
    $('.table').dataTable( {
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "oLanguage": {
            "sUrl": "js/models/dataTable/datatable_" + window.langOpt.toUpperCase() + ".txt"
        },
        "aaSorting": [[ 5, "desc" ]],
        "fnDrawCallback": function ( oSettings ) {
            console.log("fnDrawCallback:"+oSettings);
            if ( oSettings.bSorted || oSettings.bFiltered ) {
                for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ ) {
                     $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                }
                /*
                this.$('td:first-child', {"filter":"applied"}).each( function (i) {
                    that.fnUpdate( i+1, this.parentNode, 0, false, false );
                });
                 */
                          
            }
        },
        "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] } ],
        "sPaginationType": "bootstrap",
    });
                  
                  
    // select buttons
                  
    $("#showall").unbind().click(function(){
        $("#weekly").hide();
        $("#monthly").hide();
        $("#alltime").show();
        $("#ranking li.active").removeClass('active');
        $("#ranking li.all").addClass('active');
        $('.table').dataTable.fnDrawCallback(oSettings);
    });
    $("#showmonth").unbind().click(function(){
        $("#alltime").hide();
        $("#weekly").hide();
        $("#monthly").show();
        $("#ranking li.active").removeClass('active');
        $("#ranking li.month").addClass('active');
        $('.table').dataTable.fnDrawCallback(oSettings);
    });
    $("#showweek").unbind().click(function(){
        $("#alltime").hide();
        $("#monthly").hide();
        $("#weekly").show();
        $("#ranking li.active").removeClass('active');
        $("#ranking li.week").addClass('active');
        $('.table').dataTable.fnDrawCallback(oSettings);
    });

	$("#ranking .nav-tabs li a").each(function() {
		$(this).attr("href","javascript:void(0)");
	});
	
                    
    // initial display
    $("#weekly").hide();
    $("#monthly").hide();
    $("#alltime").show();
}

var attr = [
		["init",g.prototype.init]
		];

window.common.exportSingleton("rankingTable",g, attr);
                  
});
