!function(a){a.effects.clip=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","height","width"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"vertical";a.effects.save(c,d),c.show();var g=a.effects.createWrapper(c).css({overflow:"hidden"}),h="IMG"==c[0].tagName?g:c,i={size:"vertical"==f?"height":"width",position:"vertical"==f?"top":"left"},j="vertical"==f?h.height():h.width();"show"==e&&(h.css(i.size,0),h.css(i.position,j/2));var k={};k[i.size]="show"==e?j:0,k[i.position]="show"==e?0:j/2,h.animate(k,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){"hide"==e&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()}})})}}(jQuery);