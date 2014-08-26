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
			"child" : this.library.morph.index_loop({ 
				subject : [].concat( define.with.content ),
				else_do : function ( loop ) {
					var type = loop.indexed.type || "regular"
					return loop.into.concat({
						"class" : define.class_name[type],
						"text"  : loop.indexed.text
					})
				}
			})
		}
	},
})