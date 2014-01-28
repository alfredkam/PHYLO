/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/!function(a){a.effects.shake=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=(a.effects.setMode(c,b.options.mode||"effect"),b.options.direction||"left"),f=b.options.distance||20,g=b.options.times||3,h=b.duration||b.options.duration||140;a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var i="up"==e||"down"==e?"top":"left",j="up"==e||"left"==e?"pos":"neg",k={},l={},m={};k[i]=("pos"==j?"-=":"+=")+f,l[i]=("pos"==j?"+=":"-=")+2*f,m[i]=("pos"==j?"-=":"+=")+2*f,c.animate(k,h,b.options.easing);for(var n=1;g>n;n++)c.animate(l,h,b.options.easing).animate(m,h,b.options.easing);c.animate(l,h,b.options.easing).animate(k,h/2,b.options.easing,function(){a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)}),c.queue("fx",function(){c.dequeue()}),c.dequeue()})}}(jQuery);