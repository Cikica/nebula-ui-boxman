define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"calendar_logic",
			"event",
			"body",
			"listener"
		]
	},

	make : function () {
		console.log( this.get_day().next_day().date )
		console.log("entrude young messenger")
	},

	define_state : function ( define ) {
		return this.library.event.define_state( define )
	},
	
	define_event : function ( define ) { 
		return this.library.event.make( define )
	},

	define_listener : function ( define ) { 
		return this.library.listener.make( define )
	},

	define_body : function ( define ) { 
		return this.library.body.make( define )
	}
})