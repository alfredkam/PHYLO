/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/!function(a){a.effects.slide=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"show"),f=b.options.direction||"left";a.effects.save(c,d),c.show(),a.effects.createWrapper(c).css({overflow:"hidden"});var g="up"==f||"down"==f?"top":"left",h="up"==f||"left"==f?"pos":"neg",i=b.options.distance||("top"==g?c.outerHeight({margin:!0}):c.outerWidth({margin:!0}));"show"==e&&c.css(g,"pos"==h?isNaN(i)?"-"+i:-i:i);var j={};j[g]=("show"==e?"pos"==h?"+=":"-=":"pos"==h?"-=":"+=")+i,c.animate(j,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){"hide"==e&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}}(jQuery);