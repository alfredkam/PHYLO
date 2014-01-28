/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/function getSequences(a){var b="ajax/fetch?";args.space&&(b=b+"space="+args.space+"&"),args.name&&(b=b+"name="+args.name+"&"),args.id?b=b+"id="+args.id+"&":b+="id=1&",$.getJSON(b,function(b){var c=parseInput(b);console.log(c),console.log(b),a(c,b)})}function parseInput(a){var b=function h(a,b){a instanceof Array?(h(a[0],b),h(a[1],b)):b.push(a)},c=new Array;b(a,c);for(var d=new Array(c.length),e=0;e<c.length;e++){d[e]=new Array;var f,g;for(f=0,g=0;f<c[e].length;f++,g++)switch(c[e].charAt(f)){case"A":d[e][g]={id:0,colCount:f};break;case"U":case"T":d[e][g]={id:1,colCount:f};break;case"C":d[e][g]={id:2,colCount:f};break;case"G":d[e][g]={id:3,colCount:f};break;default:g--}}return d}