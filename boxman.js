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
		var body, self, content, event_circle
		self         = this
		body         = this.library.transistor.make({
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
		event_circle = Object.create( this.library.event_master ).make({
			state : {

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
		// event_circle.add_listener({

		// })
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
		body.append(
			document.body
		)
	},

	define_button : function ( define ) {
		var number_of_pages, buttons
		number_of_pages = this.library.morph.get_the_keys_of_an_object( define.part ).length
		buttons         = []
		if ( number_of_pages > 1 ) {
			buttons = buttons.concat([
				{
					"class"           : define.class_name.button.box,
					"text"            : "Previous Part",
					"data-box-change" : "previous",
				},
				{
					"class"           : define.class_name.button.box,
					"text"            : "Next Part",
					"data-box-change" : "next",
				}
			])
		}
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