(function() {
	(function() {
		function g() {};
		g.prototype.GET = function(pid) {
			var $_GET = {};

			document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			    function decode(s) {
				return decodeURIComponent(s.split("+").join(" "));
				}

			    $_GET[decode(arguments[1])] = decode(arguments[2]);
			});

			return $_GET[pid];
		};
	
		g.prototype.tutorial = function() {
			//var str = '<iframe src="http://player.vimeo.com/video/32459877?title=0&amp;byline=0&amp;portrait=0&amp;color=ff9933&amp;autoplay=1" width="801" height="412" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			var str= '<iframe src="http://phylo.cs.mcgill.ca/tutorial/'+window.langOpt.toUpperCase()+'/index.html" width="840" height="550" class="iframe-tutorial"></iframe>';
			$(".info").html(str);
				
		};
		
		g.prototype.about = function() {
			var about = lang[0].body.play.about;

			var str = "<div id='content'>";
			for(var i=1;i<=10;i+=2) {
				str+="<h1>"+about["field "+i]+"</h1><p>"+about["field "+(i+1)]+"</p>";
			}

			str+="</div>";
			$(".info").html(str);

		};
		g.prototype.results = function() {
			var l = lang[0].body.play.results;	
			var str = "";
			str+= '<div id="content">'+
			'<div style="text-align:center;">'+
			'<h1>'+l["field 1"]+'</h1>'+
			'<iframe name="2011results" src="2011results/index.html" height="400" width="300" frameborder=0></iframe>'+
			'<p>'+l["field 2"]+'<a href="2011results/phylo_data_release_2011.zip">phylo_data_release_2011.zip</a></p>'+
			'</div></div>';
			$(".info").html(str);
		};

		g.prototype.ranks = function() {
			var l = lang[0].body.play.ranking;	
			var str = "";
			str+= '<div id="content"><div id="ranking"><h1>'+l["field 1"]+'</h1>'+
			'<table><tr><td class="panel"><ul class="menu">'+
			'<li><a href="#">'+l["field 3"]+'</a>'+
			'<ul><li><a href="2011ranking/all_categories.html" target="rankingframe">'+l["field 4"]+'</a></li>'+
    			'<li><a href="2011ranking/first_contributor_all_categories.html" target="rankingframe">'+l["field 5"]+'</a></li>'+
			'</ul></li><li><a href="#">'+l["field 6"]+'</a>'+
			'<ul>'+
   			'<li><a href="2011ranking/blood_and_immune_system.html" target="rankingframe">'+l["field 7"]+'</a></li>'+
   			'<li><a href="2011ranking/bone_and_skin.html" target="rankingframe">'+l["field 8"]+'</a></li>'+
   			'<li><a href="2011ranking/brain_and_nervous_system.html" target="rankingframe">'+l["field 9"]+'</a></li>'+
   			'<li><a href="2011ranking/cancer.html" target="rankingframe">'+l["field 10"]+'</a></li>'+
   			'<li><a href="2011ranking/digestive_system.html" target="rankingframe">'+l["field 11"]+'</a></li>'+
   			'<li><a href="2011ranking/heart_and_circulatory_system.html" target="rankingframe">'+l["field 12"]+'</a></li>'+
   			'<li><a href="2011ranking/metabolic_disorders.html" target="rankingframe">'+l["field 13"]+'</a></li>'+
   			'<li><a href="2011ranking/muscles.html" target="rankingframe">'+l["field 14"]+'</a></li>'+
   			'<li><a href="2011ranking/reproduction_system.html" target="rankingframe">'+l["field 15"]+'</a></li>'+
   			'<li><a href="2011ranking/respiratory_system.html" target="rankingframe">'+l["field 16"]+'</a></li>'+
   			'<li><a href="2011ranking/sensory_system.html" target="rankingframe">'+l["field 17"]+'</a></li>'+
			'</ul>'+
			'</li>'+
			'<li><a href="#">'+l["field 18"]+'</a>'+
			'<ul>'+
   			'<li><a href="2011ranking/disease_catalog.html" target="rankingframe">'+l["field 19"]+'</a></li>'+
   			'<li><a href="2011ranking/scoring.html" target="rankingframe">'+l["field 22"]+'</a></li>'+
			'</ul>'+
			'</li>'+
			'</ul>'+
			'</td><td><iframe name="rankingframe" src="2011ranking/all_categories.html" width="600" height="445"></iframe>'+
			'</td></tr></table></div></div>';
			
    			$(".info").html(str);

			var s = document.createElement("script");
			s.src = "togglemenu.js";
			s.type = "text/javascript";
			document.getElementsByTagName("head")[0].appendChild(s);	


		};
		
		g.prototype.credits = function() {
			var credits = lang[0].body.play.credit;
			var str = "<div id='content'>";
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
			str+"</div>";
			$(".info").html(str);

		};

		g.prototype.start = function() {
			if(this.GET("pid") != undefined) {
				$("#sandbox").hide();
				$(".info").show();
				if(this.GET("pid") == "tutorial") 
					this.tutorial();
				else if(this.GET("pid") == "about")
					this.about();
				else if(this.GET("pid") == "credits")
					this.credits();
				else if(this.GET("pid") == "results") 
					this.results();
				else if(this.GET("pid") == "ranks")
					this.ranks();
				else {
					$("#sandbox").show();
					$(".info").hide();
				}
			} 
			this.footer();
		};
		g.prototype.footer  = function(){
			$("#lang-ranking").html(lang[0].header["field 5"]);
			$("#lang-result").html(lang[0].header["field 8"]);
			$("#lang-more").html(lang[0].body.footer["field 1"]); 
			$("#lang-community").html(lang[0].body.footer["field 2"]); 
		};
		var proto = g.prototype,
			attr = [
				[ "start",proto.start],
				];
		common.exportSingleton("session",g,attr);
	})();	

	(function() {
		$(document).ready(function() {
			
			var active = function() {
				try {
				if(lang) {
					session.start();
				} else 
					window.setTimeout(function() {
						active();
					},50);
				} catch (err) {
					window.setTimeout(function() {
						active();
					},50);
				}
			};

			active();

		});
	})();	
})();
