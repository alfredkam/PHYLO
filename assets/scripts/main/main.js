/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/!function(){var a="PHYLO";window[a]=window[a]||{};var b=window[a],c=b.config=b.config||{};c.env="production";var d={DEBUG:!0,social:{github:{clientId:""},google:{clientId:""}},host:window.location.origin},e={DEBUG:!0,social:{github:{clientId:""},google:{clientId:""}},host:window.location.origin},f={DEBUG:!1,social:{github:{clientId:""},google:{clientId:""}},host:window.location.origin};c.dev=c.dev||{};for(var g in d)c.dev[g]=d[g];c.stage=c.stage||{};for(var g in e)c.stage[g]=e[g];c.production=c.production||{};for(var g in f)c.production[g]=f[g];b.getConfig=function(){return this.config[this.config.env]};var h=document.createElement("script");h.setAttribute("type","text/javascript"),"dev"===c.env&&(h.setAttribute("data-main","assets/scripts/main/"+a+"-main.js"),h.setAttribute("src","assets/bower_components/requirejs/require.js")),"stage"===c.env?(h.setAttribute("data-main","assets/scripts/main/"+a+"-build-stage.compress.js"),h.setAttribute("src","assets/bower_components/requirejs/require.js")):"production"===c.env&&(h.setAttribute("src","assets/scripts/require.min.js"),h.setAttribute("data-main","assets/scripts/main/"+a+"-build.min.js")),document.getElementsByTagName("body")[0].appendChild(h)}();