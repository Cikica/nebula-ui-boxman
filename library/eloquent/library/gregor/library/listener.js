define({
	
	define : {
		allow : "*",
		require : [
			"morph",
			"calendar_logic",
			"body",
			"transistor",
		]
	},

	get_new_month : function ( define ) {

	},

	make : function ( define ) { 
		var self = this
		return [ 
			{ 
				for       : "gregor chose month",
				that_does : function ( heard ) {
					var body, name, option_state, calendar_body, calendar_body_parent, next_month
					
					name                  = heard.event.target.getAttribute("data-gregor-name")
					option_state          = heard.state.option[name]
					new_month             = self.library.calendar_logic.get_day({
						year  : option_state.value.date.year,
						month : heard.event.target.getAttribute("data-gregor-set-month"),
						day   : 1
					})
					calendar_body         = option_state.calendar || option_state.body.get("gregor calendar "+ name )
					calendar_body_parent  = calendar_body.body.parentElement
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.class_name,
						name       : name,
						with       : {},
						month      : new_month.get_month_map(),
						day        : new_month
					}))
					option_state.calendar.body.style.display = "block"
					option_state.value    = new_month
					option_state.selected = false
					calendar_body_parent.removeChild( calendar_body.body )
					option_state.calendar.append( calendar_body_parent )
					return heard
				}
			},
			{ 
				for       : "gregor toggle calendar",
				that_does : function ( heard ) {
					var option_state, name, calendar_body
					name                        = heard.event.target.getAttribute("data-gregor-set-date")
					option_state                = heard.state.option[name]
					calendar_body               = option_state.calendar || option_state.body.get("gregor calendar "+ name )
					calendar_body.body.style.display = (
						calendar_body.body.style.display === "block" ?
							"none" : "block"
					)
					return heard
				}
			},
			{
				for       : "gregor chose date",
				that_does : function ( heard ){
					
					var date, name, option_state, text_body, previous_date_body, calendar_body

					name               = heard.event.target.getAttribute("data-gregor-name")
					option_state       = heard.state.option[name]
					calendar_body      = option_state.calendar || option_state.body.get("gregor calendar "+ name)
					text_body          = option_state.body.get("gregor text "+ name).body
					previous_date_body = ( option_state.selected ?
						option_state.selected : 
						calendar_body.get("gregor current date "+ name ).body
					)
					date               = self.library.calendar_logic.get_day({
						year  : heard.event.target.getAttribute("data-gregor-year"),
						month : parseInt( heard.event.target.getAttribute("data-gregor-month-number") ) - 1,
						day   : heard.event.target.getAttribute("data-gregor-day-number"),
					})
					previous_date_body.setAttribute("class", "package_main_calendar_day_number")
					option_state.selected            = heard.event.target
					option_state.value               = date
					text_body.textContent            = date.date.day.number +" "+ date.date.month.name +" "+ date.date.year
					calendar_body.body.style.display = "none"
					heard.event.target.setAttribute("class", "package_main_calendar_day_number_selected")
					return heard
				}
			}
		]
	},
})