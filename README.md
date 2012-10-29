PHYLO
=====

PHYLO nightly build can be found at 
http://phylo.cs.mcgill.ca/nightly/index.html#!play

PHYLO - RNA in pre-Alpha
http://phylo.cs.mcgill.ca/nightly/index.html#!rna

Master Branch contains the most recent experimental release

Production Branch contains the most recent stable release

All versions contains an offline mode with dummy data for development 

If you are using chrome for development, you will need to execute this in your terminal : 

	open /Applications/Google\ Chrome.app --args --allow-file-access-from-files --allow-access-control-allow-origin

This will tackle the cross domain issue when working locally. 

Current version supports browsers and mobile browsers with screen size bigger than 1024 * 768

This build includes options, it can be found at js/options_template.js

	window.DEBUG //enables debug log

	window.guest //tell us its anoymous
	
	window.DEV.disableMenu //disables Menu
	
	window.DEV.disableSplash //disables Splash 
	
	window.DEV.disableMusic //disables the background music

To enable options w/ .gitignore

	cd js

	cp options_template.js options.js
	
	git add .  

	git rm --cache options.js

	git commit -a -m 'ignored options.js'
