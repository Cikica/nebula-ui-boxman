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
		event_circle.add_listener( this.define_listener({
			body : body
		}))

		return { 
			body  : body,
			state : event_circle
		}
	},

	define_state : function ( define ) {
		return {
			close : { 
				body : define.provided.box
			},
			change : {
				body      : define.provided.content,
				title     : define.provided.title,
				index     : 0,
				page_body : define.provided.content.children[0],
				on_page   : define.provided.part_name[0],
				page_name : define.provided.part_name
			},
			submit : {
				with : this.library.morph.index_loop({
					subject : define.button,
					into    : {},
					else_do : function ( loop ) {
						if ( loop.indexed.constructor === Object && loop.indexed.type === "submit" ) {
							loop.into[loop.index] = loop.indexed.with
						}
						return loop.into
					}
				})
			}
		}
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
				"called"       : "submit button click",
				"that_happens" : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if  : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-box-button-submit") )
				}
			},
			{
				"called"       : "close button click",
				"that_happens" : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if  : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-box-button-close") )
				}
			},
		]
	},

	define_listener : function ( define ) {
		var self = this
		return [
			{
				for       : "submit button click",
				that_does : function ( heard ) {
					var button_index, submit_method
					button_index  = heard.event.target.getAttribute("data-box-button-index")
					submit_method = heard.state.submit.with[button_index]
					submit_method({
						
					})
					// heard.state.close.body.parentElement.removeChild( heard.state.close.body )

					return heard 
				}
			},
			{
				for       : "move button click",
				that_does : function ( heard ) {

					var content, page_index, direction, previous_button, next_button,
					current_page_body, previous_page_body

					direction                = heard.event.target.getAttribute("data-box-button-change")
					content                  = heard.state.change.body.children
					previous_button          = define.body.get("previous change button").body
					next_button              = define.body.get("next change button").body
					heard.state.change.index = self.get_linear_index_for_page({
						index     : heard.state.change.index,
						length    : heard.state.change.page_name.length-1,
						direction : direction
					})
					current_page_body                          = heard.state.change.body.children[heard.state.change.index]
					heard.state.change.page_body.style.display = "none"
					current_page_body.style.display            = "block"
					heard.state.change.page_body               = current_page_body
					previous_button.style.display              = ( heard.state.change.index === 0 ? "none" : "block" )
					next_button.style.display                  = ( heard.state.change.index === heard.state.change.page_name.length-1 ? "none" : "blocK" )
					heard.state.change.on_page                 = heard.state.change.page_name[heard.state.change.index]
					heard.state.change.title.textContent       = self.convert_option_name_to_regular_name( heard.state.change.on_page )

					return heard
				}
			},
			{ 
				for       : "move button click",
				that_does : function ( heard ) {
					self.library.morph.homomorph({ 
						object : heard.state.submit.with,
						with   : function ( member ) {
							
							define.body.get("button "+ member.key ).body.style.display = ( 
								heard.state.change.index === heard.state.change.page_name.length-1 ? 
									"block" : 
									"none"
							)

							return ""
						}
					})
					return heard
				}
			},
			{
				for       : "close button click",
				that_does : function ( heard ) {
					heard.state.close.body.parentElement.removeChild( heard.state.close.body )
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
						class_name   : define.class_name,
						button       : loop.indexed,
						button_index : loop.index,
						provided     : define.provided
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
				"text"                  : definition.called || "Close"
			}
		}

		if ( definition.type === "next" || definition.type === "previous" ) { 
			return { 
				"class"                  : define.class_name.change || define.class_name.button,
				"mark_as"                : definition.type +" change button",
				"data-box-button-change" : definition.type,
				"display"                : ( definition.type === "previous" ? "none" : "block" ),
				"text"                   : definition.called || definition.type[0].toUpperCase() + definition.type.slice(1)
			}
		}

		if ( definition.type === "submit" ) { 
			return { 
				"class"                  : define.class_name.submit || define.class_name.button,
				"data-box-button-submit" : definition.type,
				"mark_as"                : "button "+ define.button.index,
				"display"                : ( define.provided.part_name.length > 1 ? "none" : "block" ),
				"data-box-button-index"  : define.button_index,
				"text"                   : definition.called || definition.type[0].toUpperCase() + definition.type.slice(1)
			}
		}
	},

	get_linear_index_for_page : function ( get ) {
		if ( get.direction === "next" ) {
			return ( get.index >= get.length ? get.length : get.index + 1 )
		} else {
			return ( get.index < 1 ? 0 : get.index -1 )
		}
	},

	convert_option_name_to_regular_name : function ( option_name ) { 
		return this.library.morph.index_loop({
			subject : option_name.split("_"),
			if_done : function ( loop ) {
				return loop.into.join(" ")
			},
			else_do : function ( loop ) {
				return loop.into.concat(( loop.indexed[0].toUpperCase() + loop.indexed.slice(1) ))
			}
		})
	},
})