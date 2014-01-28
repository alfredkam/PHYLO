/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/function MessageBox(a){this._area=$("#"+a),this._area.bind("mousedown",function(){return!1})}MessageBox.prototype.println=function(a){return this._area.val(this._area.val()+a+"\n"),this._area.scrollTop(this._area.get(0).scrollHeight),this},MessageBox.prototype.append=function(a){return this._area.val(this._area.val()+a),this},MessageBox.prototype.clear=function(){return this._area.val(""),this},MessageBox.prototype.setText=function(a){return this._area.val(a),console.log(this._area.val()),this},MessageBox.prototype.getText=function(){return this._area.val()};