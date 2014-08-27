define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"event_master",
			"transistor",
			"keyswitch",
			"text",
			"shumput",
			"dropdown",
			"list",
			"tree_option",
			"button"
		]
	},

	make : function ( define ) {
		var self, body, event_circle, part_name_to_package_name

		self                      = this
		part_name_to_package_name = {
			"radio"     : "keyswitch",
			"text"      : "text",
			"input"     : "shumput",
			"list"      : "list",
			"select"    : "dropdown",
			"tree"      : "tree_option",
			"button"    : "button"
		}
		body                 = this.library.transistor.make( this.define_body({
			part_name_to_package_name : part_name_to_package_name,
			class_name                : define.class_name,
			part                      : define.part,
		}))
		event_circle         = Object.create( this.library.event_master ).make({
			state  : {
				option : this.define_state_option({
					part_name_to_package_name : part_name_to_package_name,
					part                      : define.part,
					body                      : body
				}),
			},
			events : this.define_event({
				part_name_to_package_name : part_name_to_package_name,
				class_name                : define.class_name,
				package_name              : this.library.morph.get_the_values_of_an_object( part_name_to_package_name ),
				with                      : { 
					body : body.body
				}
			})
		})
		event_circle.add_listener( this.define_listener({
			class_name   : define.class_name,
			part_name    : this.library.morph.get_the_keys_of_an_object( part_name_to_package_name ),
			package_name : this.library.morph.get_the_values_of_an_object( part_name_to_package_name ),
			with         : {}
		}))

		if ( define.append_to ) { 
			body.append(
				define.append_to
			)
		} else { 
			return {
				transistor : body,
				get_state  : function () { 
					return event_circle.get_state()
				}
			}
		}
	},

	define_state_option : function ( define ) { 
		var self = this
		return this.library.morph.index_loop({
			subject : define.part,
			into    : {},
			else_do : function ( loop ) {
				
				var package_name, package_object
				
				package_name   = define.part_name_to_package_name[loop.indexed.type]
				package_object = self.library[package_name]

				if ( package_object.hasOwnProperty("define_event") ) {
					var option_name = self.convert_text_to_option_name( loop.indexed.name )
					loop.into[option_name] = package_object.define_state({
						for  : loop.indexed.name,
						with : loop.indexed.with,
						body : define.body
					})
				}
				return loop.into
			}
		})
	},

	define_listener : function ( define ) {
		var self = this
		return this.library.morph.index_loop({
			subject : define.package_name,
			else_do : function ( loop ) {
				if ( self.library[loop.indexed].hasOwnProperty("define_listener") ) {
					return loop.into.concat( self.library[loop.indexed].define_listener({
						class_name : define.class_name[define.part_name[loop.index]],
						with       : define.with
					}) )
				} else {
					return loop.into
				}

			}
		})
	},

	define_event : function ( define ) {
		var self = this
		return this.library.morph.index_loop({
			subject : define.package_name,
			else_do : function ( loop ) {
				if ( self.library[loop.indexed].hasOwnProperty("define_event") ) {
					return loop.into.concat( self.library[loop.indexed].define_event({
						with       : define.with
					}))
				} else { 
					return loop.into
				}
			}
		})
	},

	define_body : function ( define ) {
		var default_value, self
		self          = this
		return {
			"class" : define.class_name.wrap,
			"child" : this.loop_through_parts_and_perform_action({
				define : define,
				action : function ( loop ) {
					return loop.package_object.define_body({
						name       : self.convert_text_to_option_name( loop.definition.name || "" ),
						with       : loop.definition.with,
						class_name : define.class_name[loop.definition.type]
					})
				}
			})
		}
	},

	loop_through_parts_and_perform_action : function ( through ) { 
		var self = this
		return this.library.morph.index_loop({
			subject : through.define.part,
			else_do : function ( loop ) {

				if ( through.define.part_name_to_package_name.hasOwnProperty( loop.indexed.type ) ) {
					var package_name
					package_name = through.define.part_name_to_package_name[loop.indexed.type]
					return loop.into.concat( through.action.call({}, {
						package_name   : package_name,
						package_object : self.library[package_name],
						class_name     : through.define.class_name,
						definition     : loop.indexed,
					}) )

				} else { 
					console.warn("Part type : "+ loop.indexed.type +" doth not exist")
					return loop.into
				}
			}
		})
	},

	convert_text_to_option_name : function ( text ) { 
		return text.replace(/\s/g, "_").toLowerCase()
	},
})