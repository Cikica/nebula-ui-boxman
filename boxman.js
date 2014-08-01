define({
	
	define : {
		require : [
			"morphism",
			"node_maker"
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

	define_button : function ( define ) { 
		return { 
			type      : "div",
			attribute : { 
				"class" : "package_call_logger_box_submit_button"
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
				array   : [].concat( text.has.text ),
				else_do : function ( loop ) { 
					console.log( loop.indexed )
					return loop.into.concat({ 
						type : "div",
						attribute : { 
							"class" : "package_call_logger_box_text_line"
						},
						property : { 
							textContent : loop.indexed
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
											textContent : list.has.notation
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
})