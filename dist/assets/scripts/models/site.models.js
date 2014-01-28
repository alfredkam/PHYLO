/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/!function(){define(["jquery/jquery","underscore/underscore","backbone/backbone","mustache/mustache","views/request.views","views/navBar.views"],function(a,b,c){var d=c.Model.extend({defaults:{lang:"EN"},initialize:function(a){this.url="js/models/tutorial/"+a.lang+"-tutorial.js"},fetch:function(b){var c=this;a.ajax({url:c.url,dataType:"json"}).done(function(a){c.set({data:a}),b&&b.success&&b.success()}).fail(function(a){console.log("Tutorial Model fail",a)})},getData:function(){return this.get("data")}});return{Tutorial:d}})}();