define({
	define : {
		allow   : "*",
		require : [
			"morph",
			"calendar_logic"
		]
	},
	
	make : function ( define ) {
		return { 
			"class"   : define.class_name.wrap,
			"mark_as" : "gregor "+ define.name,
			"child"   : [
				{
					"class" : define.class_name.set_wrap,
					"child" : [
						{ 
							"class"                : define.class_name.set_button,
							"data-gregor-set-date" : define.name,
							"text"                 : define.with.input.text
						},
						{
							"class"   : define.class_name.set_date,
							"mark_as" : "gregor text "+ define.name,
							"text"    : this.library.calendar_logic.define_date_format( this.library.calendar_logic.get_current_day_map() )
						}

					]
				}
			].concat( this.define_calendar({
				class_name : define,
				name       : define.name,
				with       : define.with,
				month      : this.library.calendar_logic.get_current_month_map()
			}))
		}
	},

	define_calendar : function ( define ) {
		return {
			"class"   : "package_main_calendar_wrap",
			"display" : "none",
			"mark_as" : "gregor calendar "+ define.name,
			"child"   : this.define_calendar_body( define )
		}
	},

	define_calendar_body : function ( define ) {
		var self, date
		self = this
		current = define.day || this.library.calendar_logic.get_day()
		return [
			{
				"class" : "package_main_regular_wrap",
				"child" : [
					{
						"class" : "package_main_date_month_wrap",
						"child" : [
							{ 
								"class" : "package_main_date_month_text",
								"text"  : "2014"
							},
						]
					},
					{
						"class" : "package_main_date_month_wrap",
						"child" : [
							{ 
								"class"                 : "package_main_date_month_text",
								"text"                  : current.previous_month().date.month.name,
								"data-gregor-set-month" : current.previous_month().date.month.number-1,
								"data-gregor-name"      : define.name
							},
							{
								"class" : "package_main_date_month_text_current",
								"text"  : current.date.month.name,
							},
							{
								"class"                 : "package_main_date_month_text",
								"text"                  : current.next_month().date.month.name,
								"data-gregor-set-month" : current.next_month().date.month.number-1,
								"data-gregor-name"      : define.name
							}
						]
					}
				]
			},
			{ 
				"class" : "package_main_regular_wrap",
				"child" : this.library.morph.index_loop({
					subject : ["MO","TU","WE","TH","FR","SA","SU"],
					else_do : function ( loop ) { 
						return loop.into.concat({
							"class" : "package_main_calendar_day_name",
							"text"  : loop.indexed
						})
					}
				})
			},
			{
				"class" : "package_main_regular_wrap",
				"child" : this.library.morph.index_loop({
					subject : define.month,
					else_do : function ( loop ) {
						var definition
						definition = {
							"class"             : ( 
								current.date.day.number === loop.indexed.day.number ? 
									"package_main_calendar_day_number_selected" : 
									"package_main_calendar_day_number" 
							),
							"text"                     : loop.indexed.day.number,
							"data-gregor-name"         : define.name,
							"data-gregor-day-name"     : loop.indexed.day.name,
							"data-gregor-day-number"   : loop.indexed.day.number,
							"data-gregor-month"        : loop.indexed.month.name,
							"data-gregor-month-number" : loop.indexed.month.number,
							"data-gregor-year"         : loop.indexed.year
						}

						if ( current.date.day.number === loop.indexed.day.number ) { 
							definition["mark_as"] = "gregor current date "+ define.name
						}

						if ( loop.index === 0 ) {
							loop.into = loop.into.concat( self.library.morph.while_greater_than_zero({
								count   : ( 6 - ( 7 - loop.indexed.day.week_day_number ) % 7 ),
								into    : [],
								else_do : function ( while_loop ) {
									return while_loop.into.concat({
										"class"      : "package_main_calendar_day_number",
										"visibility" : "hidden",
										"text"       : "."
									})
								}
							}))
						}

						if ( loop.indexed.day.week_day_number === 1 ) { 
							loop.into = loop.into.concat({
								"class" : "package_main_calendar_day_seperator",
							})
						}

						return loop.into.concat( definition )
					}
				})
			}
		]
	}
})