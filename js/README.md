Notes
=====
First of all we are using model view controller + observer design patterns.<br>
We are using backbone js / require js / mustache to add structure to this web application.

The current structure:

	js/views	<=== responsible for display materials and actions (events)
	js/models 	<=== responsible for data models, http://backbonetutorials.com/what-is-a-model/
	js/controller 	<=== defines the site routes
	template 	<=== contains the html template
	
	DNA		<=== the base framework for the game, it depeneds on jquery (for now)
	RNA		<=== it extends of the DNA framework


Backbone is mainly used to add structure , backbonejs.org <br>
Backbone Router is used for defining the site url rules<br>
Require acts like php includes or include once and allows you to define the namespace , requirejs.org<br> 
Mustache is for templating , mustache.github.com<br>

	js/Boilerplate.js

This is a js template every one should start using this when writing heavy js codes, it helps solve namespace issues

Recommended Readings
=====
http://backbonetutorials.com/organizing-backbone-using-modules/ <br>
http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-part-1-getting-started/ <br>
http://backbonetutorials.com/what-is-a-router/ <br>
http://blog.andyet.com/2010/oct/29/building-a-single-page-app-with-backbonejs-undersc/<br>
