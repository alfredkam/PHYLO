define([
        "underscore"
], function(_){
	var GraphHelper = function(){
		
		/*
		 * returns array of dates in either daily increments or hourly increments
		 */
		this.getUTCDateRange = function(days) {
			var now = new Date();
			var end = new Date(now);
			var start = new Date(now);
			start.setUTCDate(end.getUTCDate() - days - 1);
			end.setUTCDate(now.getUTCDate() + 1);
			start.setUTCHours(0, 0, 0, 0);
			end.setUTCHours(0, 0, 0, 0);
			var ranges = [];
			if ( days <= 7 ) {
				// make hourly ranges
				while ( start <= end ) {
					ranges.push(new Date(start));
					start.setUTCHours(start.getUTCHours() + 1);
				}
			} else {
				// make daily ranges;
				while ( start <= end ) {
					ranges.push(new Date(start));
					start.setUTCDate(start.getUTCDate() + 1);
				}
			}
			
			return ranges;
		};
		
		/*
 		 * returns date range
		 */
		this.getDateRange = function(days){
			var now = new Date();
			var end = new Date(now);
			end.setDate(end.getDate());			// Giving a buffer
			var start = new Date(now);
			start.setUTCDate(end.getUTCDate() - days); // Giving a buffer
			
			return {
				start : start,
				end : end
			};
		};
		
		/*
		 * returns sorted stack records of data aggregated by iterator function* 
		 */
		this.getStackData = function(days, list, iterator, context){
			var dataModels = [];
			
			// Aggregating data
			_.each(list, function(model) {
				
				// for each hourly 
				var record = [];
				if ( days <= 7 ) {
					record = model.get('hourly'); 
				} else {
					record = model.get('daily');
				}
				
				var dataModel = {
					label : model.get('name'),
					data : 0	
				};
				
				var calculated = _.map(record, iterator, context);
				var sum = 0;
				_.each(calculated, function(num){
					sum += num;
				});
				dataModel.data = sum;
				dataModels.push(dataModel);				
			}, this);
			return dataModels;
		};
		
		this.getTimelyRecord = function(days, label, record, iterator, context) {
			
			var utcRanges = this.getUTCDateRange(days);
			
			var dataModel = {
				label : label,
				data : []	
			};
			
			var dataRecords = {};
			_.each(record, function(value, date){
				dataRecords[new Date(date)] = value;					
			}, this);
			
			// do call back iteration
			var keys = _.keys(dataRecords);
			var values = _.map(dataRecords, iterator, context);
			dataRecords = _.object(keys, values);				
			
			_.each(utcRanges, function(date){
				if ( dataRecords[date] ) {
					dataModel.data.push(_.toArray({
						date : new Date(date).getTime(),
						value : dataRecords[date]
					}));
				}
				
			}, this);
			
			// sorting data
			dataModel.data = _.sortBy(dataModel.data, function(elem){
				return elem[0];
			});
			
			return dataModel;
		};
		/*
		 * returns sorted time records of data aggregated by iterator function* 
		 */
		this.getTimelyData = function(days, list, iterator, context) {
			var dataModels = [];
			_.each(list, function(model) {
				// for each hourly 
				var record = [];
				var utcRanges = this.getUTCDateRange(days);
				if ( days <= 7 ) {
					record = model.get('hourly'); 
				} else {
					record = model.get('daily');
				}
				
				var dataModel = {
					label : model.get('name'),
					data : []	
				};
				
				var dataRecords = {};
				_.each(record, function(value, date){
					dataRecords[new Date(date)] = value;					
				}, this);
				
				// do call back iteration
				var keys = _.keys(dataRecords);
				var values = _.map(dataRecords, iterator, context);
				dataRecords = _.object(keys, values);				
				// filling zeroes
				_.each(utcRanges, function(date){
					if ( !dataRecords[date] ) {
						dataRecords[date] = 0;
					}
					dataModel.data.push(_.toArray({
						date : new Date(date).getTime(),
						value : dataRecords[date]
					}));
					
				}, this);
				
				dataModels.push(dataModel);
			}, this);
			// assigning total data to atttributes
			// sorting data
			
			_.each(dataModels, function(model){
				model.data = _.sortBy(model.data, function(elem){
					return elem[0];
				});
			}, this);
			
			return dataModels;
		};
	};
	
	return GraphHelper;
});