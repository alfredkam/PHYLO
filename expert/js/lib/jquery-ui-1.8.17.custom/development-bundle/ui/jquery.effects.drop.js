/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/!function(a){a.effects.drop=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","opacity"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"left";a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var g="up"==f||"down"==f?"top":"left",h="up"==f||"left"==f?"pos":"neg",i=b.options.distance||("top"==g?c.outerHeight({margin:!0})/2:c.outerWidth({margin:!0})/2);"show"==e&&c.css("opacity",0).css(g,"pos"==h?-i:i);var j={opacity:"show"==e?1:0};j[g]=("show"==e?"pos"==h?"+=":"-=":"pos"==h?"-=":"+=")+i,c.animate(j,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){"hide"==e&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}}(jQuery);