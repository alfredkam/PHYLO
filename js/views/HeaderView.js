//Filename: boilerplate.js

define([
        //LIBRARIES
        "jquery",
        "marionette",
        //OTHER
        
        //TEMPLATES
        "text!tpl/app/Header.mustache",
        
        //NO EXPORTS

], function($, Marionette, tpl){
	var HeaderView = Marionette.ItemView.extend({
		template: tpl,
		events: {
			//"click button.logout": "logout"
		}
		//enable if have login
		/*logout: function(e){
			$(e.target.form).submit();
		} */
		
	});
	
  return HeaderView;
  
});