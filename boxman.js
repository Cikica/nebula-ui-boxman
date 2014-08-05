define({
	
	define : {
		require : [
			"morphism",
			"node_maker",
			"dropdown"
		],
		allow : "*"
	},

	make : function ( define ) {
		var body, self
		self = this
		body = this.library.node_maker.make_node({
			type      : "div",
			attribute : { 
				"class" : "package_call_logger_box_wrap"
			},
			children : [
				{
					type      : "div",
					attribute : { 
						"class" : "package_call_logger_box_title"
					},
					property : { 
						textContent : define.title
					}
				},
				{
					type      : "div",
					attribute : { 
						"class" : "package_call_logger_box_body"
					},
					children : this.library.morphism.index_loop({
						array   : define.part,
						else_do : function ( loop ) {
							var definition
							if ( loop.indexed.type === "text" ) { 
								definition = self.define_text_part({
									has : loop.indexed.has 
								})
							}
							if ( loop.indexed.type === "list" ) { 
								definition = self.define_list_part({
									has : loop.indexed.has 
								})
							}

							if ( loop.indexed.type === "input" ) { 
								definition = self.define_input_part({
									has : loop.indexed.has 
								})
							}

							if ( loop.indexed.type === "select" ) { 
								definition = self.define_dropdown({
									has : loop.indexed.has
								})
							}

							return loop.into.concat( definition )
						}
					})
				},
				{
					type      : "div",
					attribute : {
						"class" : "package_call_logger_box_submit_wrap"
					},
					children : this.library.morphism.index_loop({
						array   : define.button,
						else_do : function ( loop ) {
							return loop.into.concat(self.define_button({
								button : loop.indexed
							}))
						}
					})
				}
			]
		})
		return body
	},

	define_dropdown : function ( dropdown ) {

		var definition
		definition = { 
			type      : "div",
			attribute : {
				"class" : "package_main_regular_wrap",
			},
			children : [
				{ 
					type      : "div",
					attribute : {
						"class" : "package_main_small_title",
					},
					property  : { 
						textContent : dropdown.has.title || ""
					}
				}
			]
		}
		definition.children = definition.children.concat(this.library.dropdown.make({
			option     : dropdown.has.option,
			class_name : {
				main                 : "package_main_dropdown",
				option_wrap          : "package_main_dropdown_option_wrap",
				option               : "package_main_dropdown_option",
				option_selected_wrap : "package_main_dropdown_option_selected_wrap",
				option_selected      : "package_main_dropdown_option_selected",
				option_selector      : "package_main_dropdown_option_selector",
			}
		}))

		return definition
	},

	define_button : function ( define ) { 
		return { 
			type      : "div",
			attribute : { 
				"class" : "package_main_regular_button"
			},
			property : { 
				textContent : define.button.text
			}
		}
	},

	define_text_part : function ( text ) {
		return { 
			type      : "div",
			attribute : {
				"class" : "package_call_logger_box_text_wrap"
			},
			children : this.library.morphism.index_loop({ 
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
					return loop.into.concat({ 
						type : "div",
						attribute : { 
							"class" : class_name
						},
						property : { 
							textContent : loop.indexed.content
						}
					})
				}
			})
		}
	},

	define_list_part : function ( list ) {
		return { 
			type      : "div",
			attribute : {
				"class" : "package_call_logger_box_list_wrap"
			},
			children : [
				{
					type : "div",
					attribute : {
						"class" : "package_call_logger_box_list_title"
					},
					property : {
						textContent : list.has.title
					}
				},
				{
					type      : "div",
					attribute : {
						"class" : "package_call_logger_box_list_container"
					},
					children  : this.library.morphism.index_loop({ 
						array   : [].concat( list.has.text ),
						else_do : function ( loop ) {
							var notation
							notation = ( loop.index + 1 ) + "."
							if ( list.has.notation ) {  
								notation = list.has.notation
							}

							return loop.into.concat({
								type      : "div",
								attribute : { 
									"class" : "package_call_logger_box_list_member_wrap"
								},
								children : [
									{
										type      : "div",
										attribute : { 
											"class" : "package_call_logger_box_list_notation"
										},
										property : { 
											textContent : notation
										}
									},
									{
										type      : "div",
										attribute : { 
											"class" : "package_call_logger_box_list_line"
										},
										property : { 
											textContent : loop.indexed
										}
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
			type      : "div",
			attribute : {
				"class" : "package_main_regular_wrap",
			},
			children : [
				{ 
					type      : "div",
					attribute : {
						"class" : "package_main_small_title",
					},
					property  : { 
						textContent : input.has.title || ""
					}
				},
				{ 
					type      : ( input.has.size === "small" ? "input" : "textarea" ),
					attribute : {
						"class"       : ( input.has.size === "small" ? "package_main_input" : "package_main_textarea" ),
						"placeholder" : ( input.has.placeholder ? input.has.placeholder : "" ),
						"value"       : ( input.has.value ? input.has.value : "" )
					},
					property  : { 
						textContent : input.has.value || ""
					}
				}
			]
		}
	}
})