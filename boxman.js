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
		body      = this.library.transistor.make({
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
							"class"   : define.class_name.box.title,
							"mark_as" : "box title",
							"text"    : define.title,
						},
						{
							"class"   : define.class_name.box.subtitle,
							"mark_as" : "box subtitle",
							"text"    : "Viewing: Submit Box"
						},
						{
							"class"   : define.class_name.box.body,
							"mark_as" : "box body"
						}
					].concat( self.define_button( define ) )
				},
			]
		})
		content      = this.library.morph.homomorph({
			object : define.part,
			with   : function ( member ) {
				var part_body
				part_body = self.library.eloquent.make({
					class_name : define.class_name,
					part       : member.value
				})
				part_body.append(
					body.get("box body").body
				)
				if ( member.count > 0 ) { 
					part_body.body.style.display = "none"
				}
				return part_body
			}
		})
		event_circle = Object.create( this.library.event_master ).make({
			state : {
				body : {
					main     : body,
					subtitle : body.get("box subtitle"),
					body     : body.get("box body"),
					content  : content
				},
				page : {
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
					only_if  : function ( heard ) { 
						return ( heard.event.target.hasAttribute("data-box-change") )
					}
				}
			],	
		})
		event_circle.add_listener({
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
				heard.state.body.content[page_name].body.style.display      = "none"
				heard.state.body.content[next_page.name].body.style.display = "block"
				heard.state.body.subtitle.body.textContent                  = "Viewing: "+ self.convert_option_name_to_regular_name( next_page.name )
				return heard
			}
		})
		body.append(
			document.body
		)
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
		var number_of_pages, buttons
		number_of_pages = this.library.morph.get_the_keys_of_an_object( define.part ).length
		buttons         = []
		if ( number_of_pages > 1 ) {
			buttons = buttons.concat({
				"class" : define.class_name.box.button_wrap,
				"child" : [
					{
						"class"           : define.class_name.box.button.change,
						"text"            : "Previous Part",
						"data-box-change" : "previous",
					},
					{
						"class"           : define.class_name.box.button.change,
						"text"            : "Next Part",
						"data-box-change" : "next",
					}
				]
			})
		}
		buttons.concat(this.library.morph.index_loop({
			subject : define.button,
			else_do : function ( loop ) {
				var definition
				definition = {
					"class"           : define.class_name.box.button,
					"text"            : "Previous Part",
				}
				
					"data-box-change" : "previous",
				},
				console.log( loop.indexed )
				return []
			}
		}))
		return buttons
	},

	format_part : function ( parts ) {
		var self = this
		return this.library.morphism.index_loop({
			array   : parts,
			else_do : function ( loop ) {
				var part
				if ( loop.indexed.type === "button" ) { 
					part = self.format_button( loop.indexed )
				}
				return loop.into.concat( part || loop.indexed )
			}
		})
	},

	format_button : function ( define ) {
		return { 
			type : define.type,
			name : define.name,
			with : {
				method : function ( heard ) {
					heard.option_state = define.with.method.call({}, {
						heard : heard,
						box   : {
							close : function () {
								var box 
								box = event.target.parentElement.parentElement.parentElement
								document.body.removeChild( box )
							},
						},
					})
					return { 
						state : heard.state,
						event : heard.event,
					}
				},
				text : define.with.text
			}
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
})