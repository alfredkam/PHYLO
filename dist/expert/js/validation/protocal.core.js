!function(){var doc=document,win=window,url="../../../phpdb/phyloExpertDB.php";$.protocal={login:function(a,b,c){var d=7,e="mode="+d+"&user="+a+"&pass="+b;$.ajax({type:"POST",url:url,data:e}).done(function(a){c(a)}).fail(function(){bootbox.alert("Could not connect to server, please try again later")})},register:function(a,b,c,d){var e=6,f="mode="+e+"&user="+a+"&pass="+b+"&email="+c;$.ajax({type:"POST",url:url,data:f}).done(function(a){d(a)}).fail(function(){$("div.login-warning").show().html("Could not connect to server, please try again later")})},sendEndGameScore:function(status,fn){var mode=3;"completed"==status&&(mode=4);var data="mode="+mode+"&id="+$.phylo.id+"&user="+window.guest+"&align="+$.board.getJsonAlignments()+"&score="+$.phylo.currentScore;$.ajax({type:"POST",url:url,data:data}).done(function(re){var json=eval("["+re+"]")[0];fn(json)}).fail(function(){console.log(">> failed to connect to database to submit end game score"),console.log(">> loading end game dummy data");var dummy='{"0":"CONGENITAL PTOSIS","disease_link":"CONGENITAL PTOSIS","1":"67","play_count":"67","2":"13","fail_count":"13","3":"42","best_score":"42","4":"1375","running_score":"1375","5":"unki2aut","highscore_user":"unki2aut"}',json=eval("["+dummy+"]")[0];fn(data)})},sendHighScore:function(){var a="mode=4&id="+$.phylo.id+"&user="+window.guest+"&align="+$.board.getJsonAlignments()+"&score="+$.phylo.bestScore;$.ajax({type:"POST",url:url,data:a}).done(function(){}).fail(function(){console.log(">> failed to send highscore")})},getPuzzleInfo:function(){var data="mode=3&id="+$.phylo.id;$.ajax({type:"POST",url:url,data:data}).done(function(re){var json={};try{json=eval("["+re+"]")[0]}catch(err){return DEBUG&&console.log("@getPuzzleInfo error parsing"),void 0}}).fail(function(){})},read:function(a){if(void 0==a)this.type=$.helper.get("type"),this.score=$.helper.get(this.type);else{var b=a.type;this.tp=0,this.score=a.num,this.tp=b}},replay:function(){var data=$.protocal.previousData;DEBUG&&console.log(data);try{var j=eval("["+data+"]")[0].level}catch(err){return DEBUG&&console.log(err),void 0}$.phylo.id=j.attributes.id;for(var i=0;i<j.sequence.length;i++)j.sequence[i]=j.sequence[i].replace(/-/g,"_").toUpperCase();$.phylo.get={},$.phylo.get.sequence=j.sequence,DEBUG&&(j.sequence,j.tree),$.phylo.get.treeString=j.tree;var tree=$.newick.parse(j.tree);$.phylo.get.tree=tree,$.main.callBack()},request:function(setting){var str="",type=this.tp,score=this.score;"random"==type?str+="mode=1&diff="+score:"disease"==type?(mode=2,str+="mode=2&id="+score):"level"==type&&(mode=2,str+="mode=2&id="+score),$.ajax({url:url,data:str,type:"POST"}).done(function(data){console.log(data),data=data.replace("@",""),$.protocal.previousData=data,DEBUG&&console.log(data);try{var j=eval("["+data+"]")[0].level}catch(err){return DEBUG&&console.log(err),void 0}$.phylo.id=j.attributes.id;for(var i=0;i<j.sequence.length;i++)j.sequence[i]=j.sequence[i].replace(/-/g,"_").toUpperCase();$.phylo.get={},$.phylo.get.sequence=j.sequence,DEBUG&&(j.sequence,j.tree),$.phylo.get.treeString=j.tree;var tree=$.newick.parse(j.tree);$.phylo.get.tree=tree,$.main.callBack()}).fail(function(){var dummy='{"level":{"attributes":{"id":"1462"},"sequence":["CCTT-CGAAG-----TAAGAA","CCTT-CGAAG-----TGAGAA","CCC--TGGTG-----TAAGAT","GAGG-CAGGC-----------","gcag-cgggc---agcgggcg"],"tree":"(((hg19,rheMac2),mm9),(bosTau4,canFam2));"}}';console.log(">> Cannnot connect to database"),console.log(">> loading dummy data"),$.protocal.previousData=dummy;try{var j=eval("["+dummy+"]")[0].level}catch(err){return DEBUG&&console.log(err),void 0}$.phylo.id=j.attributes.id;for(var i=0;i<j.sequence.length;i++)j.sequence[i]=j.sequence[i].replace(/-/g,"_").toUpperCase();$.phylo.get={},$.phylo.get.sequence=j.sequence,DEBUG&&(j.sequence,j.tree),$.phylo.get.treeString=j.tree;var tree=$.newick.parse(j.tree);$.phylo.get.tree=tree,$.main.callBack()})}}}();