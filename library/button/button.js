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
			body       : body,
			provided   : define.provided,
			eloquent   : define.provided.eloquent
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
			buttons_to_reveal : this.library.morph.index_loop({
				subject : define.button,
				into    : {},
				else_do : function ( loop ) {

					if ( loop.indexed.show_on ) { 
						if ( loop.into.hasOwnProperty( loop.indexed.shown_on ) ) {
							loop.into[loop.indexed.show_on] = loop.into[loop.indexed.show_on].concat(loop.index)
						} else { 
							loop.into[loop.indexed.show_on] = [loop.index]
						}
					}

					return loop.into
				}
			}),
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
				"called"       : "box button click",
				"that_happens" : [
					{ 
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) {
					return ( heard.event.target.hasAttribute("data-box-button-box") ) 
				}
			},
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
				for       : "box button click",
				that_does : function ( heard ) {
					var box, definition
					definition                       = define.provided.extra_box.checklist
					definition.class_name            = define.provided.class_name
					box                              = define.provided.make_box( definition )
					define.provided.body.style.right = "5%"
					box.body.append( document.body )

					return heard
				}
			},
			{
				for       : "submit button click",
				that_does : function ( heard ) {
					var button_index, submit_method
					button_index  = heard.event.target.getAttribute("data-box-button-index")
					submit_method = heard.state.submit.with[button_index]
					submit_method(self.create_button_click_object({
						eloquent : define.eloquent
					}))
					heard.state.close.body.parentElement.removeChild( heard.state.close.body )

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
						object : heard.state.buttons_to_reveal,
						with   : function ( member ) {
							if ( member.property_name === heard.state.change.on_page ) { 
								self.library.morph.index_loop({
									subject : member.value,
									else_do : function ( loop ) {
										define.body.get("button "+ loop.indexed ).body.style.display = "block"
									}
								})
							} else { 
								self.library.morph.index_loop({
									subject : member.value,
									else_do : function ( loop ) {
										define.body.get("button "+ loop.indexed ).body.style.display = "none"
									}
								})
							}

							return ""
						}
					})

					self.library.morph.homomorph({
						object : heard.state.submit.with,
						with   : function ( member ) {

							define.body.get("button "+ member.property_name ).body.style.display = ( 
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
					var body = heard.state.close.body 
					if ( body.previousSibling.hasAttribute("data-boxman-theman") ) {
						body.previousSibling.firstChild.style.right = "0px"
					}  
					body.parentElement.removeChild( heard.state.close.body )
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
				"mark_as"                : "button "+ define.button_index,
				"display"                : ( define.provided.part_name.length > 1 ? "none" : "block" ),
				"data-box-button-index"  : define.button_index,
				"text"                   : definition.called || definition.type[0].toUpperCase() + definition.type.slice(1)
			}
		}

		if ( definition.type === "box" ) {
			return { 
				"class"                 : define.class_name.box || define.class_name.button,
				"data-box-button-box"   : define.button_index,
				"mark_as"               : "button "+ define.button_index,
				"data-box-button-index" : define.button_index,
				"text"                  : define.called || "Box"
			}
		}
	},

	create_button_click_object : function ( define ) {
		var self = this
		return {
			get_state : function () {
				var option, set
				set    = {}
				option = self.library.morph.homomorph({
					object : define.eloquent,
					set    : "array",
					with   : function ( member ) { 
						set = self.merge_objects({
							first  : member.value.get_state().option,
							second : set
						})
						return member.value
					}
				})
				// this aint statless boi, oh no it aint
				return set
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

	merge_objects : function ( merge ) {
		var second
		second = this.library.morph.copy({ what : merge.second })
		this.library.morph.homomorph({ 
			object  : merge.first,
			with    : function ( member ) { 
				if ( !second.hasOwnProperty( member.property_name ) ) { 
					second[member.property_name] = member.value
				}
				return member.value
			}
		})
		return second
	},
})