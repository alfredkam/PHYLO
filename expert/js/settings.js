/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/function Settings(){this.prefix="dcsettings-"}Settings.prototype.set=function(a,b){var c=JSON.stringify(b);localStorage.setItem(this.prefix+a,c)},Settings.prototype.get=function(a){var b=localStorage.getItem(this.prefix+a);return JSON.parse(b)},Settings.prototype.apply=function(){};