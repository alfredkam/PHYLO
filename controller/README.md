Notes
=====

We are now using requirejs, you can read more about it at http://requirejs.org/ <br>
main.js contains all the dependencies and this file is where you should include your dependencies too. ie your javascript files, we do not include in index.html any more. <br>
site.controller.js is used to define the rules in what the page should load <br>
hashbang.controller.js is used to determine the hashbang and to define the rules for the hashbang, it depends on site.controller.js <br>

options_template.js is used to fasten your development, ie skipping screens disable the default music.  If you want to start disabling / skip modules on inital load.  Make a copy of options_tempate.js and name is options.js and change the booleans!
