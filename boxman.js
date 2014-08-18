define({
	
	define : {
		require : [
			"morphism",
			"event_master",
			"dropdown",
			"scribe",
			"transistor"
		],
		allow : "*"
	},

	make : function ( define ) {
		var body, self, event_circle
		self         = this
		body         = this.library.transistor.make({
			"class"    : "package_main_softscreen_wrap",
			"position" : "fixed",
			"top"      : "0px",
			"z-index"  : "999",
			child      : [
				{
					"class"    : "package_main_box_to_the_side_wrap package_body",
					"position" : "relative",
					child      : [
						{
							"class" : "package_main_large_title",
							"text"  : define.title
						},
						{
							"class" : "package_main_regular_wrap",
							child   : this.library.morphism.index_loop({
								array   : define.part,
								else_do : function ( loop ) {
									return loop.into.concat( self.get_part_definition({
										detail : define.detail,
										name   : loop.indexed.type,
										has    : loop.indexed.has
									}) )
								}
							})
						},
						{
							"class" : "package_call_logger_box_submit_wrap",
							child   : this.library.morphism.index_loop({
								array   : define.button,
								else_do : function ( loop ) {
									return loop.into.concat(self.define_button({
										button : loop.indexed
									}))
								}
							})
						}
					]
				}
			]
		})
		event_circle = this.library.event_master.make({
			events : [],
			state  : {
				body   : { 
					main : body.body
				},
				option : this.create_option_object_from_part_definition( define.part )
			},
		})
		event_circle.add_event( this.library.dropdown.define_event({
			body : body.body
		}))
		event_circle.add_event( this.library.scribe.define_event({
			body : body.body
		}))
		event_circle.add_event( this.define_event({
			body : body.body
		}))

		event_circle.add_listener( this.library.dropdown.define_listener({
			mark : { 
				open   : "+",
				closed : "-"
			}
		}))
		event_circle.add_listener( this.library.scribe.define_listener() )
		event_circle.add_listener( this.define_listener(
			this.library.morphism.index_loop({
				array   : define.button,
				into    : {},
				else_do : function ( loop ) { 
					var button_name
					button_name            = self.convert_text_to_option_name( loop.indexed.text )
					loop.into[button_name] = loop.indexed
					return loop.into
				}
			})
		) )

		return body
	},

	get_part_definition : function ( part ) {
		var definition
		if ( part.detail.hasOwnProperty( part.name ) ) {
			definition = this.merge_objects({
				first  : part.has,
				second : part.detail[part.name],
			})
		} else { 
			definition = part.has
		}

		return this["define_"+ part.name +"_part"]({
			has : definition 
		})
	},

	define_select_part : function ( dropdown ) {
		console.log( dropdown.has )
		return { 
			"class" : "package_main_regular_wrap",
			child   : [].concat(
				{ 
					"class" : "package_main_small_title",
					"text"  : dropdown.has.title || ""
				},
				this.library.dropdown.define_body({
					option     : {
						default_value : dropdown.has.default_value || dropdown.has.option.choice[0],
						mark          : dropdown.has.mark,
						choice        : dropdown.has.option.choice
					},
					name       : this.convert_text_to_option_name( dropdown.has.title ),
					class_name : {
						main                 : "package_main_dropdown",
						option_wrap          : "package_main_dropdown_option_wrap",
						option               : "package_main_dropdown_option",
						option_selected_wrap : "package_main_dropdown_option_selected_wrap",
						option_selected      : "package_main_dropdown_option_selected",
						option_selector      : "package_main_dropdown_option_selector",
					}
				})
			)
		}
	},

	define_text_part : function ( text ) {
		return {
			"class" : "package_main_regular_wrap",
			child   : this.library.morphism.index_loop({ 
				array   : [].concat( text.has ),
				else_do : function ( loop ) {
					var class_name
					class_name = "package_main_text_normal"
					if ( loop.indexed.type === "bold" ) {
						class_name = "package_main_text_bold"
					}
					if ( loop.indexed.type === "important" ) {
						class_name = "package_main_text_important"
					}
					if ( loop.indexed.type === "title" ) {
						class_name = "package_main_medium_title"
					}
					if ( loop.indexed.type === "italic" ) {
						class_name = "package_main_text_italic"
					}
					if ( loop.indexed.type === "large title" ) {
						class_name = "package_main_large_title"
					}
					return loop.into.concat({
						"class" : class_name,
						"text"  : loop.indexed.content
					})
				}
			})
		}
	},

	define_list_part : function ( list ) {
		return { 
			"class" : "package_main_regular_wrap",
			child   : [
				{
					"class" : "package_main_small_title",
					"text"  : list.has.title
				},
				{
					"class" : "package_main_regular_wrap",
					child   : this.library.morphism.index_loop({ 
						array   : [].concat( list.has.text ),
						else_do : function ( loop ) {
							var notation
							notation = ( loop.index + 1 ) + "."
							if ( list.has.notation ) {  
								notation = list.has.notation
							}

							return loop.into.concat({
								"class" : "package_main_list_wrap",
								child   : [
									{
										"class" : "package_main_list_notation",
										"text"  : notation
									},
									{
										"class" : "package_main_list_text",
										"text"  : loop.indexed
									}
								]
							})
						}
					})
				}
			],
		}
	},

	define_input_part : function ( input ) {
		return {
			"class" : "package_main_regular_wrap",
			child   : [].concat(
				{ 
					"class" : "package_main_small_title",
					"text"  : input.has.title || ""
				},
				this.library.scribe.define_body({
					size       : input.has.size,
					name       : this.convert_text_to_option_name( input.has.title ),
					class_name : {
						small : "package_main_input",
						large : "package_main_textarea"
					}
				})
			)
		}
	},

	merge_objects : function ( merge ) {
		var second
		second = this.library.morphism.copy({ what : merge.second })
		this.library.morphism.homomorph({ 
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

	define_listener : function ( define ) { 
		return [
			{
				for       : "submit",
				that_does : function ( heard ) {
					var button_name
					button_name         = heard.event.target.getAttribute("data-button-name")
					define[button_name].submit.call( {}, {
						close : function () {
							heard.state.body.main.style.display = "none"	
						},
						state : heard.state.option
					})
					return heard
				}
			},
			{
				for       : "close",
				that_does : function ( heard ) {
					heard.state.body.main.style.display = "none"
					return heard
				}
			}
		]
	},

	define_event : function ( define ) { 
		return [
			{ 
				called       : "submit",
				that_happens : [
					{
						on : define.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) {
					return ( heard.event.target.hasAttribute("data-button") && heard.event.target.getAttribute("data-button") === "submit" )
				}
			},
			{ 
				called       : "close",
				that_happens : [
					{
						on : define.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) {
					return ( heard.event.target.hasAttribute("data-button") && heard.event.target.getAttribute("data-button") === "close" )
				}
			}
		]
	},

	create_option_object_from_part_definition : function ( definition ) { 
		var self = this
		return this.library.morphism.index_loop({
			array   : definition,
			into    : {},
			else_do : function ( loop ) {
				if ( ["select", "input"].indexOf( loop.indexed.type ) > -1 ) { 
					var option_name
					option_name            = self.convert_text_to_option_name( loop.indexed.has.title )
					loop.into[option_name] = ""
				}
				return loop.into
			}
		})
	},

	convert_text_to_option_name : function ( text ) { 
		return text.replace(/\s/g, "_").toLowerCase()
	},

	define_button : function ( define ) { 
		var button_type
		button_type = "close"
		if ( define.button.submit ) {
			button_type = "submit"
		}
		return { 
			"class"            : "package_main_regular_button",
			"data-button"      : button_type,
			"data-button-name" : this.convert_text_to_option_name( define.button.text ),
			"text"             : define.button.text
		}
	}
})