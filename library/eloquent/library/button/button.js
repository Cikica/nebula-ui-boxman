define({

	define : {
		allow   : "*",
		require : [
			"morph"
		],
	},

	make : function () {
		return {}
	},

	define_state : function ( define ) {
		return { 
			method : define.with.method,
			text   : define.with.text
		}
	},

	define_event : function ( define ) {
		return [
			{
				called       : "eloquent button click",
				that_happens : [
					{ 
						on : define.with.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-eloquent-button") )
				}
			}
		]
	},

	define_listener : function ( define ) { 
		return [ 
			{ 
				for       : "eloquent button click",
				that_does : function ( heard ) {
					var option_state, name
					name         = heard.event.target.getAttribute("data-eloquent-button")
					option_state = heard.state.option[name]
					return option_state.method.call({}, heard )
				}
			}
		]
	},

	define_body : function ( define ) {
		var type = define.with.type || "regular"
		return {
			"class"                : define.class_name[type],
			"data-eloquent-button" : define.name,
			"text"                 : define.with.text
		}
	},
})