Notes
=====

We are now using requirejs and routerjs (backbone), you can read more about it at http://requirejs.org/ & http://backbonetutorials.com/what-is-a-router/ <br>

main.js contains all the rules for the dependencies and this is where you should define your dependencies too. ie your javascript files, we do not include in index.html any more but we define them in main.js <br>
site.controller.js is used to define the rules in what each page should load <br>
hashbang.controller.js is used to determine the hashbang and to define the rules for the hashbang, it depends on site.controller.js <br>

router.js contains all the rules for the site's url route.

options_template.js is used to fasten your development, ie skipping screens disable the default music.  If you want to start disabling / skip modules on inital load.  Make a copy of options_tempate.js and name is options.js and change the booleans!
