define({
	
	define : {
		require : [
			"morph",
			"event_master",
			"eloquent",
			"transistor",
		],
		allow : "*"
	},

	make : function ( define ) {
		var body, self, content, event_circle, part_name
		self      = this
		part_name = this.library.morph.get_the_keys_of_an_object( define.part )
		body      = this.library.transistor.make( this.define_body({
			part_name  : part_name,
			class_name : define.class_name,
			title      : define.title,
			button     : define.button,
			part       : define.part,
		}))
		content   = this.library.morph.homomorph({
			object : define.part,
			with   : function ( member ) {
				var part
				part = self.library.eloquent.make({
					class_name : define.class_name,
					part       : member.value
				})
				part.transistor.append(
					body.get("box body").body
				)
				if ( member.count > 0 ) { 
					part.transistor.body.style.display = "none"
				}
				return part
			}
		})
		event_circle = Object.create( this.library.event_master ).make({
			state : {
				body : {
					main     : body,
					subtitle : ( part_name.length > 1 ? body.get("box subtitle") : false ),
					body     : body.get("box body"),
					content  : content
				},
				button : this.library.morph.index_loop({
					subject : define.button,
					into    : {},
					else_do : function ( loop ) {
						var button_name
						button_name            = self.convert_text_to_option_name( loop.indexed.text )
						loop.into[button_name] = loop.indexed.with
						return loop.into
					}
				}),
				page   : {
					on   : part_name[0],
					name : part_name
				}
			},
			events : [
				{ 
					called       : "move button click",
					that_happens : [
						{ 
							on : body.body,
							is : [ "click" ]
						}
					],
					only_if : function ( heard ) { 
						return ( heard.event.target.hasAttribute("data-box-change") )
					}
				},
				{
					called       : "regular button click",
					that_happens : [
						{
							on : body.body,
							is : [ "click" ]
						}
					],
					only_if  : function ( heard ) { 
						return ( heard.event.target.hasAttribute("data-box-button") )
					}
				}
			],	
		})
		event_circle.add_listener([
			{
				for       : "regular button click",
				that_does : function ( heard ) {
					var button_name
					button_name = heard.event.target.getAttribute("data-box-button")
					heard.state.button[button_name].call( {}, self.create_button_click_object({
						state : heard.state,
						event : heard.event,
						name  : button_name
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
						with_minus : ( heard.event.target.getAttribute("data-box-change") === "next" ),
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
		])
		body.append(
			document.body
		)
	},

	define_body : function ( define ) { 
		var definition
		definition = {
			"class"    : "package_main_softscreen_wrap",
			"position" : "fixed",
			"top"      : "0px",
			"z-index"  : "999",
			"child"    : [
				{
					"class"    : "package_main_box_to_the_side_wrap package_body",
					"mark_as"  : "box body",
					"position" : "relative",
					"child"    : [
						{ 
							"class" : define.class_name.box.title_wrap,
							"child" : [
								{
									"class"   : define.class_name.box.title,
									"mark_as" : "box title",
									"text"    : define.title,
								}
							]
						},
						{
							"class"   : define.class_name.box.body,
							"mark_as" : "box body"
						}
					].concat( this.define_button( define ) )
				},
			]
		}

		if ( define.part_name.length > 1 ) { 
			definition.child[0].child[0].child = definition.child[0].child[0].child.concat({
				"class"   : define.class_name.box.subtitle,
				"mark_as" : "box subtitle",
				"text"    : "Viewing: "+ this.convert_option_name_to_regular_name( define.part_name[0] )
			})
		}

		return definition
	},

	create_button_click_object : function ( button ) {
		var self = this
		return {
			close : function () {
				document.body.removeChild( button.state.body.main.body )
			},
			get_state : function () {
				var option, set
				set    = {}
				option = self.library.morph.homomorph({
					object : button.state.body.content,
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

	get_index_and_name_of_next_page : function ( get ) {
		var current_name_index, next_index, default_index, final_index
		current_name_index = get.name.indexOf( get.on )
		default_index      = ( get.with_minus ? get.name.length-1 : 0 )
		next_index         = ( get.with_minus ? current_name_index - 1 : current_name_index + 1 )
		final_index        = ( get.name[next_index] === undefined  ? default_index : next_index )
		return { 
			name  : get.name[final_index],
			index : final_index
		}
	},

	define_button : function ( define ) {
		var number_of_pages, buttons, self
		self            = this
		number_of_pages = this.library.morph.get_the_keys_of_an_object( define.part ).length
		buttons         = [
			{
				"class" : define.class_name.box.button.wrap,
				"child" : []
			}
		]
		if ( number_of_pages > 1 ) {
			buttons[0].child = buttons[0].child.concat([
				{
					"class"           : define.class_name.box.button.regular,
					"text"            : "Previous Part",
					"data-box-change" : "previous",
				},
				{
					"class"           : define.class_name.box.button.regular,
					"text"            : "Next Part",
					"data-box-change" : "next",
				}
			])
		}

		buttons[0].child = buttons[0].child.concat(this.library.morph.index_loop({
			subject : define.button,
			else_do : function ( loop ) {
				var definition, button_type
				button_type = loop.indexed.type || "regular"
				definition  = {
					"class"           : define.class_name.box.button[button_type],
					"text"            : loop.indexed.text,
					"data-box-button" : self.convert_text_to_option_name( loop.indexed.text )
				}
				return loop.into.concat( definition )
			}
		}))
		return buttons
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

	convert_text_to_option_name : function ( text ) { 
		return text.replace(/\s/g, "_").toLowerCase()
	},
})