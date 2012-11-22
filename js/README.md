Notes
=====
First of all we are using model view controller + observer design patterns.<br>
We are using backbone js / require js / mustache to add structure to this web application.

The current structure:
	js/views	<=== responsible for display materials and actions (events)<br>
	js/models 	<=== responsible for data models<br>
	js/controller 	<=== defines the site routes<br>
	template 	<=== contains the html template<br>
	
	DNA		<=== the base framework for the game, it depeneds on jquery (for now)<br>
	RNA		<=== depends on DNA (base framework)<br>


Backbone is mainly used to add structure , backbonejs.org <br>
Backbone Router is used for defining the site url rules<br>
Require acts like php includes or include once and allows you to define the namespace , requirejs.org<br> 
Mustache is for templating , mustache.github.com<br>

Recommended Read
=====
http://backbonetutorials.com/organizing-backbone-using-modules/ <br>
http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-part-1-getting-started/ <br>
http://backbonetutorials.com/what-is-a-router/ <br>
