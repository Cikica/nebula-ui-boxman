define({

	define : {
		allow   : "*",
		require : [
			"morph"
		],
	},

	make : function () {
		return {}
	},

	define_body : function ( define ) {
		return {
			"class" : define.class_name.wrap,
			"child" : this.define_list( define )
		}
	},

	define_list : function ( define ) {
		var self = this
		return this.library.morph.index_loop({
			subject : define.with.list,
			else_do : function ( loop ) {
				var item_definition
				item_definition = self.get_item_defintion_object_from_regular_definition( loop.indexed )

				if ( item_definition.invalid ) { 
					return loop.into
				} else { 
					return loop.into.concat({ 
						"class" : define.class_name.item_wrap,
						"child" : [
							{
								"class" : define.class_name.item_text_wrap,
								"child" : [
									{ 
										"class" : define.class_name.item_notation,
										"text"  : define.with.notation || "-"
									},
									{ 
										"class" : define.class_name.item_text,
										"text"  : item_definition.text
									}
								]
							}
						].concat(( 
							item_definition.list && item_definition.list.length > 0 ? 
								{
									"class" : define.class_name.item_list,
									"child" : self.define_list({
										class_name : define.class_name,
										with       : { 
											notation   : define.with.notation,
											list       : item_definition.list
										}
									})
								}
								: []
						))
					})
				}
			}
		})
	},

	get_item_defintion_object_from_regular_definition : function ( definition ) { 

		if ( definition.constructor === Object ) { 
			return definition
		}

		if ( definition.constructor === String ) { 
			return {
				text : definition,
				list : []
			}
		}

		return {
			invalid : true
		}
	}
})