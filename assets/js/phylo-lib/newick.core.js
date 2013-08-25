/**
 * Newick format parser in JavaScript.
 *
 * Copyright (c) Jason Davies 2010.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Example tree (from http://en.wikipedia.org/wiki/Newick_format):
 *
 * +--0.1--A
 * F-----0.2-----B            +-------0.3----C
 * +------------------0.5-----E
 *                            +---------0.4------D
 *
 * Newick format:
 * (A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;
 *
 * Converted to JSON:
 * {
 *   name: "F",
 *   branchset: [
 *     {name: "A", length: 0.1},
 *     {name: "B", length: 0.2},
 *     {
 *       name: "E",
 *       length: 0.5,
 *       branchset: [
 *         {name: "C", length: 0.3},
 *         {name: "D", length: 0.4}
 *       ]
 *     }
 *   ]
 * }
 *
 * Converted to JSON, but with no names or lengths:
 * {
 *   branchset: [
 *     {}, {}, {
 *       branchset: [{}, {}]
 *     }
 *   ]
 * }
 */
/*
	Modified by: Alfred Kam
	Reason: For client - side usage
*/
(function() {
  function g() {}
  g.prototype.parse = function(s) {
    var ancestors = [];
    var tree = {};
    var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
    for (var i=0; i<tokens.length; i++) {
      var token = tokens[i];
      switch (token) {
        case '(': // new branchset
          var subtree = {};
          tree.branchset = [subtree];
          ancestors.push(tree);
          tree = subtree;
          break;
        case ',': // another branch
          var subtree = {};
          ancestors[ancestors.length-1].branchset.push(subtree);
          tree = subtree;
          break;
        case ')': // optional name next
          tree = ancestors.pop();
          break;
        case ':': // optional length next
          break;
        default:
          var x = tokens[i-1];
          if (x == ')' || x == '(' || x == ',') {
            tree.name = token;
          } else if (x == ':') {
            tree.length = parseFloat(token);
          }
      }
    }
    return tree;
  };
	var proto = g.prototype,
			attr = [["parse",proto.parse]];
	//common.exportSingleton("newick",g,attr);
	$.newick = {};
	$.newick.parse = proto.parse;
})();
/*
var str = "((((hg19,rheMac2),mm9),(bosTau4,(canFam2,pteVam1))),(loxAfr3,dasNov2));";
console.log(str);
var j = newick.parse(str);
var parse = function(j,c) {
	if(j.name.constructor.toString().indexOf("Array") == -1) {
		if(j.name != "")
			console.log("Depth "+c+" >"+j.name);
	} else {
		for(var i=0;i<j.name.length;i++)
			if(j.name[i] != "") 
				console.log("Depth "+c+" >"+j.name[i]);
	}
	if(j.branchset != undefined)
		if(j.branchset.constructor.toString().indexOf("Array") == -1)	
			parse(j.branchset,c+1);
		else
			for(var i=0;i<j.branchset.length;i++)
				parse(j.branchset[i],c+1);
}
parse(j,0);

var i=0;
var safe = [];
var buildTree = function(j,c) {
	if(j.name.constructor.toString().indexOf("Array") == -1) {
		if(j.name != "") { 
			return j.name;
			//console.log("Depth "+c+" >"+j.name);
		}
	} 
	if(j.branchset != undefined)
		if(j.branchset.constructor.toString().indexOf("Array") == -1) {	
			buildTree(j.branchset,c+1);
		} else {
			var x = buildTree(j.branchset[0],c+1);
			var y = buildTree(j.branchset[1],c+1);
			//if(x != "" && y != "") {
				if(typeof(x) == "string" && typeof(y) == "string") {
					if(x != "" && y != "") { 
						var d =  { "lv" : i++, "depth": c, "child" : 0,"node1": x , "node2": y}; 
						console.log(d);
						return d;
					}
				} else if((typeof(x) == "string" && typeof(y) == "object") || (typeof(x) =="object" && typeof(y) =="string")) {
					if(x == "") {
						if(safe.length < 1)	
							safe.push(y);
						else {
							x = safe.pop();
							if(typeof(y) == "object" && typeof(x) == "object") {
								var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(y) == "object") {
								var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : x, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(x) == "object") {
								var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : y, "node2" : x.lv};
								console.log(d);
								return d;
							}
						}
					} else if(y == "") {
						if(safe.length < 1)
							safe.push(x);
						else {
							y = safe.pop();
							if(typeof(y) == "object" && typeof(x) == "object") {
								var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(y) == "object") {
								var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : x, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(x) == "object") {
								var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : y, "node2" : x.lv};
								console.log(d);
								return d;
							}
						}
					} else {
							if(typeof(y) == "object" && typeof(x) == "object") {
								var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(y) == "object") {
								var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : x, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(x) == "object") {
								var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : y, "node2" : x.lv};
								console.log(d);
								return d;
							}
					}
				} else if(typeof(x) == "object" && typeof(y) == "object") {
					var d = { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" :y.lv };
					console.log(d);
					return d;
				}
			//}
		//	for(var i=0;i<j.branchset.length;i++) {
		//		buildTree(j.branchset[i],c+1);
		//	}
		}
	return "";
}

buildTree(j,0); */
