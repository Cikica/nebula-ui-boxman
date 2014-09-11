define({
	
	define : {
		require : [
			"morph",
			"eloquent",
			"transistor",
			"button"
		],
		allow : "*"
	},

	make : function ( define ) {

		var body, self, content, part_name, button

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
		button    = this.library.button.make({
			class_name : { 
				wrap   : "package_main_regular_wrap",
				button : "package_main_gray_button",
				submit : "package_main_regular_button",
				box    : "package_main_regular_button",
			},
			provided : {
				box       : body.body,
				body      : body.get("main body").body,
				title     : ( part_name.length < 2 ? {} : body.get("box subtitle").body ),
				content   : body.get("box body").body,
				eloquent  : content,
				part_name : part_name,
				make_box  : function ( what ) {
					return self.make( what )
				},
				class_name : define.class_name,
				extra_box  : define.box || {},
			},
			button : define.button
		})

		button.body.append( body.get("main body").body )

		return { 
			body  : body,
			state : function () {
				return self.get_box_state( content )
			}
		}
	},

	define_body : function ( define ) { 
		var definition
		definition = {
			"class"              : define.class_name.box.wrap,
			"position"           : "fixed",
			"top"                : "0px",
			"z-index"            : "999",
			"data-boxman-theman" : "yes the man",
			"child"              : [
				{
					"class"    : define.class_name.box.box_wrap,
					"mark_as"  : "main body",
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
					]
				},
			]
		}

		if ( define.part_name.length > 1 ) { 
			definition.child[0].child[0].child = definition.child[0].child[0].child.concat({
				"class"               : define.class_name.box.subtitle,
				"mark_as"             : "box subtitle",
				"data-box-page-title" : define.part_name[0],
				"text"                : "Viewing: "+ this.convert_option_name_to_regular_name( define.part_name[0] )
			})
		}

		return definition
	},

	get_box_state : function ( eloquent ) { 
		var option, set, self
		set    = {}
		self   = this
		option = this.library.morph.homomorph({
			object : eloquent,
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

	convert_text_to_option_name : function ( text ) { 
		return text.replace(/\s/g, "_").toLowerCase()
	}
})