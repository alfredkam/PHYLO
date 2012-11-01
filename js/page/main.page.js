(function() {
	$.page = {
		expert : function() {
			window.location = "http://phylo.cs.mcgill.ca/dcanv";
		},
		ranking : function() {
            // FIXME? protocal use POST not GET
            $.ajax({
				url : "http://phylo.cs.mcgill.ca/phpdb/fullrankingsget.php?lang=" + window.langOpt.toUpperCase(),
                //url : "content/ranking.html",
				type : "post",
			}).done(function(re) {
                $("#mid-panel").html(re);
                $.getScript("js/ranking/ranking.js");
                $.hashbang.panelReady();
            });
            
		},
		history : function() {
            $.ajax({
				url : "http://phylo.cs.mcgill.ca/phpdb/userrecordget.php?username=" + window.guest,
                //url : "content/history.html",
				type : "post",
			}).done(function(re) {
                $("#mid-panel").html(re);
                $.getScript("js/history/history.js");
		$.hashbang.panelReady();
            });
		},
		rna : function() {
			this.protocal("content/rna.html");
		},	
		play : function() {
			this.protocal("content/play.html");
		},
		tutorial : function() {
			$("#mid-panel").html('<div class="wrapper"><iframe src="http://phylo.cs.mcgill.ca/tutorial/'+window.langOpt.toUpperCase()+'/index.html" width="840" height="550" class="iframe-tutorial"></iframe></div>');
		},
		about : function() {
			var about = window.lang.body.play.about;
			var str = "<div class='wrapper'><div class='wrapper-inner'>";
			for(var i=1;i<=10;i+=2) {
				str+="<h1>"+about["field "+i]+"</h1><p>"+about["field "+(i+1)]+"</p>";
			}
			str+="</div></div>";
			$("#mid-panel").html(str);
		},
		credits : function() {
			var credits = window.lang.body.play.credit;
			var str = "<div class='wrapper'><div class='wrapper-inner'>";
			str+= "<h2>"+credits["field 1"]+"</h2>"+
				'<ul><li><a href="mailto:jerome.waldispuhl@mcgill.ca">Jérôme Waldispühl</a></li><li><a href="mailto:blanchem@mcb.mcgill.ca">Mathieu Blanchette</a></li></ul>'+
				"<h2>"+credits["field 8"]+"</h2>"+
				'<ul><li>Luis Sarmenta</li></ul>'+
				"<h2>"+credits["field 2"]+"</h2>"+
				'<ul><li><a href="mailto:alfred.kam@mail.mcgill.ca">Alfred Kam</a></li><li><a href="mailto:daniel.kwak@mail.mcgill.ca">Daniel Kwak</a></li><li><a href="mailto:clarence@mail.mcgill.ca">Clarence Leung</a></li><li><a href="mailto:chu.wu2@mail.mcgill.ca">Chu Wu</a></li><li><a href="mailto:eleyine.zarour@mail.mcgill.ca">Eleyine Zarour</a></li></ul>'+
				"<h2>"+credits["field 3"]+"</h2>"+
				'<ul><li><a href="mailto:akawry@cs.mcgill.ca">Alex Kawrykow</a></li><li><a href="mailto:grouma@cs.mcgill.ca">Gary Roumanis</a></li></ul>'+
                                "<h2>"+credits["field 9"]+"</h2>"+
                                '<ul><li>Badea Alexandru (Romanian/Română)</li><li>Gustavo Hime &amp; Susana Pereira (Portuguese/Português)</li><li>Erez Garty &amp; <a href=\"http://davidson.weizmann.ac.il/\">The Davidson Institute of Science Education</a> (Hebrew/עברית)</li><li>Efraín Martínez (Spanish/Español)</li><li>James Junzhi Wen (Chinese/简体中文)</li></ul>'+
				"<h2>"+credits["field 4"]+"</h2>"+
				'<ul> <li><a href="http://www.nserc-crsng.gc.ca/">Natural Sciences and Engineering Research Council of Canada</a></li><li><a href="http://www.nokia.com/">Nokia</a></li>  <li><a href="http://www.cs.mcgill.ca/">McGill School of Computer Science</a></li> </ul>'+
				"<h2>"+credits["field 5"]+"</h2>"+
				'<ul><li><a href="http://www.facebook.com/group.php?gid=127713783941517">Facebook</a></li> <li><a href="https://plus.google.com/u/0/b/111453047184263548841/111453047184263548841/posts">Google+</a></li></ul>'+
				"<h2>"+credits["field 6"]+"</h2>"+
				'<ul><li>Xavier Garozzo / Jérôme Barel / Jérôme Waldispühl</li>   </ul>'+
				"<h2>"+credits["field 7"]+"</h2>"+
				'<ul><li>Andrew Bogecho, Katherine Gombay, Kailesh Mussai, William Raillant-Clark, James Shubin, Ron Simpson.</li>  </ul>';
			str+"</div></div>";

			$("#mid-panel").html(str);

		},
		change : function(content) {
			$("#mid-panel").html(content);
		},
		protocal : function(url) {
			var self = this;
			$.ajax({
				statusCode : {
					412 : function() {
						console.log(">> Warning : Status Code 412; Retrying URL : "+url);
						self.protocal(url);
					},
				},	
				url : url,
				type : "post",
			}).done(function(re) {
				self.change(re);	
			});
		},
	};
})();
