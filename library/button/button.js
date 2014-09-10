define({
	
	define : {
		allow   : "*",
		require : [
			"morph",
			"event_master",
			"transistor"
		]
	},

	make : function ( define ) {
		var self, event_circle, body
		body         = this.library.transistor.make( this.define_body( define ) )
		event_circle = Object.create( this.library.event_master ).make({
			state  : this.define_state( define ),
			events : this.define_event({
				with : define,
				body : body
			})
		})
		event_circle.add_listener( this.define_listener() )

		return { 
			body  : body,
			state : event_circle
		}
	},

	define_state : function () {
		return {}
	},

	define_event : function ( define ) {
		return [
			{ 
				"called"       : "move button click",
				"that_happens" : [
					{ 
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-box-button-change") )
				}
			},
			{
				"called"       : "regular button click",
				"that_happens" : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if  : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-box-button") )
				}
			}
		]
	},

	define_listener : function ( define ) {
		return [
			{
				for       : "regular button click",
				that_does : function ( heard ) {
					var button_name
					button_name = heard.event.target.getAttribute("data-box-button")
					heard.state.button[button_name].call( {}, self.create_button_click_object({
						state  : heard.state,
						event  : heard.event,
						name   : button_name
					}))
					return heard 
				}
			},
			{
				for       : "move button click",
				that_does : function ( heard ) {
					var next_page, page_name
					page_name = heard.state.page.on
					next_page = self.get_index_and_name_of_next_page({
						with_minus : ( heard.event.target.getAttribute("data-box-change") !== "next" ),
						name       : heard.state.page.name,
						on         : heard.state.page.on,
					})
					heard.state.page.on = next_page.name
					heard.state.body.content[page_name].transistor.body.style.display      = "none"
					heard.state.body.content[next_page.name].transistor.body.style.display = "block"
					heard.state.body.subtitle.body.textContent                             = "Viewing: "+ self.convert_option_name_to_regular_name( next_page.name )
					return heard
				}
			}
		]
	},

	define_body : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.wrap,
			"child" : this.library.morph.index_loop({
				subject : define.button,
				else_do : function ( loop ) { 
					return loop.into.concat(self.define_button({
						class_name : define.class_name,
						button     : loop.indexed,
						provided   : define.provided
					}))
				}
			})
		}
	},

	define_button : function ( define ) {

		var definition = ( 
			define.button.constructor === String ? 
				{ type : define.button } :
				define.button
		)

		if ( definition.type === "close" ) { 
			return { 
				"class"                 : define.class_name.close || define.class_name.button,
				"data-box-button-close" : "true",
				"text"                  : definition.text || "Close"
			}
		}

		if ( definition.type === "next" || definition.type === "previous" ) { 
			return { 
				"class"                  : define.class_name.change || define.class_name.button,
				"data-box-button-change" : definition.type,
				"text"                   : definition.text || definition.type[0].toUpperCase() + definition.type.slice(1)
			}
		}
	}

})