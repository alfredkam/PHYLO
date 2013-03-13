<a href='http://phylo.cs.mcgill.ca'>PHYLO</a>
=====
Aligning genomic data is a fundamental but difficult (NP-hard) problem in Biology. We developed Phylo, a casual video game which solutions are used to compare genomes.  In this project, we implemented a complete gaming framework and an API for human-computing video games in genomics.  <b>Come help solve science through playing games!</b>

The most recent experimental release can be found at http://phylo.cs.mcgill.ca/master/index.html

I want to contribute!
=====
That is awesome! Just fork the project on github.  Create a topic branch, write some code and let us know! <a href='#getting-started'>Click here to jump to Getting Started</a><br>
No worries if you cannot code, check out this page instead http://phylo.cs.mcgill.ca/contribute

I want to leave a feedback!
=====
We love to hear from you, you can post it at https://github.com/McGill-CSB/PHYLO/issues

Contacts
=====
Principal Investigator (Media and scientific contact) : Jerome Waldispuhl - jerome.waldispuhl@mcgill.ca<br>
Lead Developer / UX (Technical Inquiries) : Alfred Kam - alfred.kam@mail.mcgill.ca or alfred@appfuel.me

License
=====

PHYLO is released under the McGill - License, which has been specifically designed for human-computing and crowdsourcing software developments. Learn more at https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt<br>
Copyright (2012) McGill University, Alfred Kam, Jerome Waldispuhl and other contributors.

Getting Started
=====
Checkout this link if you are new to git: <a href='http://www.alfredkam.com/git-cheat-sheet/'>Git CheatSheet</a>
- Master Branch contains the most recent experimental release
- feature/RNA Branch is used for PHYLO-RNA experimental release
- feature/integration Branch is used for integration testing 
- Production Branch contains the most recent stable release

We are using Model - View - Controller + Observer Design Pattern<br>
All versions contains an offline mode with dummy data for development<br> 

Before hacking away, a quick note on the dev environment<br>
If you are using chrome for development, you will need to execute this in your terminal : 

	open /Applications/Google\ Chrome.app --args --allow-file-access-from-files --allow-access-control-allow-origin

This will tackle the cross domain issue when working locally. 

This build includes options, it can be found at `controller/options_template.js`

	window.DEBUG //enables debug log
	window.guest //tell us its anoymous
	window.DEV.disableMenu //disables Menu
	window.DEV.disableSplash //disables Splash 
	window.DEV.disableMusic //disables the background music
	window.DEV.enableTabletMode //forces browsers to load tablet mode.
	window.DEV.logging //prompts on screen logging

To prompt on-screen logging, similar to Growl on a mac

	//code under devTools.prompts.notify
	console.notify({ title : "" , text : "" , type : <optional>});
	console.notify("any string");

To enable options with `.gitignore`, make sure the `.gitignore` is under the directory of `options_template.js` and it contains the value of `- options.js`. Subsequently, in a terminal

	cd controller
	cp options_template.js options.js
	
You can edit `options.js` to modify the development options.<br>
Note: Do not delete `options_template.js`.

To ensure your options file is not tracked by git, execute in a terminal

	git rm --cache options.js
	git commit -a -m 'untrack options.js'

Options may also be triggered through the following URLs:
<table>
  <tr><td>Show development logs</td><td>http://phylo.cs.mcgill.ca/master/#!/EN/play/IAMADEV</td></tr>
  <tr><td>Show debug logs</td><td>http://phylo.cs.mcgill.ca/master/#!/EN/play/IAMADEV+DEBUG</td></tr>
</table>


Router Setup
====
<table>
  <tr><td>PHYLO DNA</td><td>index.html#!/<language>/play</td></tr>
  <tr><td>PHYLO DNA with specified puzzle</td><td>index.html#!/<language>/play/puzzle/<puzzle id></td></tr>
  <tr><td>PHYLO RNA</td><td>index.html#!/<langauge>/BETA/RNA</td><tr>
</table>
	
To Learn more, see https://github.com/McGill-CSB/PHYLO/blob/master/js/controller/router.js

Hot deploy branches
=====
Every single time a push is made to these branches, it is automatically deployed to the live server
- [Master Branch] http://phylo.cs.mcgill.ca/master/index.html
- [feature/RNA Branch] http://phylo.cs.mcgill.ca/feature/RNA/index.html#!/EN/BETA/RNA
- If want your own hot deploy branch, you can create an issue here (https://github.com/McGill-CSB/PHYLO/issues) and assign it to @alfredkam

Devices Supported
=====
Current version supports all major browsers (except IE 6-8) and tablet browsers with screen size bigger than 1024px * 768px.  Tablets have their own custome UX <br>
For the Mobile Phone Development, please checkout either archive branch or http://phylo.cs.mcgill.ca/archive/js/F2011/index.shtml and it is no longer supported.  

Quick Crash Course
=====
<a href="http://alfredkam.com/best-way-to-develop-a-website/">Overview</a><br>
<a href="https://github.com/alfredkam/MVPjs">Boiler Plate (stock version) </a>
