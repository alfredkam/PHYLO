/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/jQuery.cookie=function(a,b,c){if(arguments.length>1&&(null===b||"object"!=typeof b)){if(c=jQuery.extend({},c),null===b&&(c.expires=-1),"number"==typeof c.expires){var d=c.expires,e=c.expires=new Date;e.setDate(e.getDate()+d)}return document.cookie=[encodeURIComponent(a),"=",c.raw?String(b):encodeURIComponent(String(b)),c.expires?"; expires="+c.expires.toUTCString():"",c.path?"; path="+c.path:"",c.domain?"; domain="+c.domain:"",c.secure?"; secure":""].join("")}c=b||{};var f,g=c.raw?function(a){return a}:decodeURIComponent;return(f=new RegExp("(?:^|; )"+encodeURIComponent(a)+"=([^;]*)").exec(document.cookie))?g(f[1]):null};