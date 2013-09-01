// LIBRARIES

define([ "jquery", "underscore",

], function($, _)
{
	var formats = [ {
		digits : 1000000000,
		replaceWith : "b"
	}, {
		digits : 1000000,
		replaceWith : "m"
	}, {
		digits : 1000,
		replaceWith : "k"
	}, ];
	var NumberFormatterUtil = function(num, options)
	{
		options = options|| {};
		if (_.isNumber(num) && !_.isNaN(num))
		{
//			if(options.round!==false){
//			num = Math.round(num);
//			}
			for (x in formats)
			{
				if (num >= formats[x].digits)
				{
					var number =(num / formats[x].digits).toFixed(2);
					if (number.length>4){
						number = number.substring(0,4);
					}
					if(number[3]=='.'){
						number = number.substring(0,3);
					}
					return number+ formats[x].replaceWith;
				}
			}
			return num;
		}
		return 0;
	};
	return NumberFormatterUtil;
});
