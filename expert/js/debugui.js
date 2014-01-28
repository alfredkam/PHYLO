/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/$(function(){var a=$("<div></div>").attr({id:"debug-wrapper",width:800}).css({width:800,margin:20});a.bind("mousedown",function(){return!1}),$("#page").append(a),$.getScript("js/lib/jquery-ui-1.8.17.custom.min.js").done(function(){var b=$("<div></div>").attr({id:"debug-scoring"});b.append($("<p></p>").append($("<label></label>").attr({"for":"debug-score-input"}).text("Scoring Threshold")).append($("<input></input>").attr({type:"text",id:"debug-score-input",value:"10"})).append($("<div></div>").attr({id:"debug-score-slider",width:300}).slider({min:1,max:100,value:10,slide:function(a,b){$("#debug-score-input").val(b.value),folder.THRESHOLD=b.value,foldrecalcneeded=!0}}))),$("#debug-score-input").val($("#debug-score-slider").slider("value")),a.append(b)}).fail(function(){console.log("Could not load jquery UI")})});