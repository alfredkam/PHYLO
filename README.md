PHYLO
=====

PHYLO - DNA in Beta
http://phylo.cs.mcgill.ca/nightly/index.html#!play

PHYLO - RNA in pre-Alpha
http://phylo.cs.mcgill.ca/nightly/index.html#!rna

All versions contains an offline mode with dummy data for development 

If you are using chrome for development, you will need to execute this in your terminal : 

	open /Applications/Google\ Chrome.app --args --allow-file-access-from-files --allow-access-control-allow-origin

This will tackle the cross domain issue when working locally. 

Current version supports browsers and mobile browsers with screen size bigger than 1024 * 768

This build includes options, it can be found at js/options.js

	window.DEBUG //enables debug log

	window.guest //tell us its anoymous
	
	window.DEV.disableMenu //disables Menu
	
	window.DEV.disableSplash //disables Splash 
