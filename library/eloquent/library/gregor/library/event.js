define({
	define : {
		allow   : "*",
		require : [
			"calendar_logic"
		]
	},

	define_state : function ( define ) { 
		return {
			body  : define.body.get("gregor "+ define.for ),
			map   : {},
			value : this.library.calendar_logic.get_day()
		}
	},
	
	make : function ( define ) { 
		var self = this
		return [
			{ 
				called       : "gregor chose month",
				that_happens : [
					{ 
						on : define.with.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-gregor-set-month") )
				}
			},
			{ 
				called       : "gregor toggle calendar",
				that_happens : [
					{ 
						on : define.with.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-gregor-set-date") )
				}
			},
			{
				called       : "gregor chose date",
				that_happens : [
					{ 
						on : define.with.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-gregor-day-number") )
				}
			}
		]
	},
})