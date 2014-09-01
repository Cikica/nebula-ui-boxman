define({
	define : {
		allow   : "*",
		require : ["morph"]
	},

	define_date_format : function ( date ) {
		return date.day.number +" "+ date.month.name +" "+ date.year
	},

	get_day : function ( day ) {
		var date, self
		self = this
		date = ( day ? this.get_day_map_for( day ) : this.get_day_map_for( new Date() ) )
		return {
			date : date,
			previous_month : function () {
				return self.get_day({
					year  : this.date.year,
					month : this.date.month.number - 2,
					day   : this.date.day.number
				})
			},
			next_month : function () {
				// console.log( this.date.month.number )
				return self.get_day({
					year  : this.date.year,
					month : this.date.month.number,
					day   : this.date.day.number
				})
			},
			get_month_map : function () {
				return self.get_month_day_map_for({
					year  : this.date.year,
					month : this.date.month.number - 1
				})
			},
			previous_day : function () { 
				return self.get_day({
					year  : this.date.year,
					month : this.date.month.number - 1,
					day   : this.date.day.number - 1
				})
			},
			next_day : function () {
				return self.get_day({
					year  : this.date.year,
					month : this.date.month.number - 1,
					day   : this.date.day.number + 1
				})
			}
		}
	},

	get_current_day_map : function () {
		return this.get_day_map_for( new Date() )
	},

	get_current_month_map : function () { 
		return this.get_month_day_map_for( new Date() )
	},

	get_month_day_map_for : function ( what ) {
		var self = this
		what = ( what.constructor === Date ? { year : what.getFullYear(), month : what.getMonth() } : what )
		return this.library.morph.while_greater_than_zero({
			count   : this.get_number_of_days_for( what ),
			into    : [],
			if_done : function ( result ) {
				return result.reverse()
			},
			else_do : function ( loop ) {
				return loop.into.concat(self.get_day_map_for({
					year  : what.year,
					month : what.month,
					day   : loop.count
				}))
			}
		})
	},

	get_day_map_for : function ( what ) {
		var date = ( what.constructor === Date ? what : new Date( what.year, what.month, what.day ) )
		return { 
			year   : date.getFullYear(),
			month  : {
				name   : this.get_month_name_from_number( date.getMonth() ),
				number : date.getMonth() + 1
			},
			day    : { 
				name            : this.get_day_name_from_number( date.getDay() ),
				week_day_number : date.getDay(),
				number          : date.getDate()
			}
		}
	},

	get_day_name_from_number : function ( day_number ) { 
		var day_name = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		]
		return day_name[day_number]
	},

	get_month_name_from_number : function ( month_number ) { 
		var month_name = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		]
		return month_name[month_number]
	},

	get_number_of_days_for : function ( what ) { 
		return ( 32 - new Date( what.year, what.month, 32 ).getDate() )
	}
})