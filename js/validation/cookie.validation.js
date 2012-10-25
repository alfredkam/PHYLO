(function() {

	$.cookie = {
		//c_name : name of cookie
		//returns value or ""
		read : function(c_name) {
			var value = this.check(c_name);	
			if(value != null && value != "")
				return value;
			else
				return "";
		},
		//c_name : name of cookie
		//value : the value to store
		//exdays : expire date [int]
        create : function(c_name, value, loginmode, days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var mylogin = " mode="+loginmode+";";
            if (days) {
                var expires = " expires="+date.toGMTString()+";";
            } else {
                var expires = "";
            }
            document.cookie = c_name+"="+value+";"+mylogin+expires+" path=/";
        },
        //c_name : name of cookie
		//returns value or null
		check : function(c_name) {
			var nameEQ = c_name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		//c_name : name of cookie
		delete : function (c_name) {
			this.create(c_name,"",-1);
		}	
	}

})();
