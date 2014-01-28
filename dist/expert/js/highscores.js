/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/function load(a){$("#table-hs > thead").empty(),$("#table-hs > tbody").empty(),$.getJSON("ajax/hs.php?type="+a,function(a){$("#table-hs > thead").append(createRow(a.header,"<th></th>"));for(var b=$("#table-hs"),c=0;c<a.rank.length;c++)switch(a.rank[c][0]){case"highlight":b.append(createRow(a.rank[c][1],"<td></td>").addClass("highlight"));break;case"empty":b.append($("<tr></tr>").html("<p>&nbsp;</p>"));break;case"string":b.append($("<tr></tr>").append($("<td></td>").text(a.rank[c][1]).css({"text-align":"center",border:"none"}).attr("colspan",a.header.length)));break;default:a.rank[c].length>1&&b.append(createRow(a.rank[c][1],"<td></td>"))}$("#table-hs tr td, #table-hs tr th").css("text-align","center"),$("#table-hs tr td:first-child, #table-hs tr th:first-child").css("text-align","left"),$("#table-hs tr td:last-child, #table-hs tr th:last-child").css("text-align","right"),$("#table-hs tr td:only-child, #table-hs tr th:only-child").css("text-align","center")})}function createRow(a,b){for(var c=$("<tr></tr>"),d=0;d<a.length;d++)$(b).html(a[d]).appendTo(c);return c}$(function(){var a="my";switch(window.location.hash){case"#top10":a="top10";break;case"#my":default:a="my"}console.log(a),$("#tab-"+a).addClass("active"),load(a)});