define({

	define : {
		allow   : "*",
		require : [
			"morphism",
			"transistor",
			"event_master",
		],
	},

	make : function ( define ) {
		return {}
	},

	define_event : function ( define ) {
		return [
			{
				called       : "scribe_keypress",
				that_happens : [
					{
						on : define.body,
						is : [ "keyup" ]
					}
				],
				only_if      : function ( heard ) {
					return ( heard.event.target.hasAttribute("data-scribe-name") )
				}
			},
		]
	},

	define_listener : function ( define ) { 
		return [
			{
				for       : "scribe_keypress",
				that_does : function ( heard ) {
					var name, value
					name  = heard.event.target.getAttribute("data-scribe-name")
					value = heard.event.target.value
					heard.state.option[name] = value
					return heard
				},
			}
		]
	},

	define_body : function ( define ) {
		
		var type
		
		if ( define.size === "small" ) {
			type = "input"
		}

		if ( define.size === "large" ) {
			type = "textarea"
		}

		return { 
			"class" : define.class_name.main,
			child   : [
				{
					"class"            : define.class_name[define.size],
					"data-scribe-name" : define.name,
					"type"             : type,
				}
			]
		}
	}
	
})