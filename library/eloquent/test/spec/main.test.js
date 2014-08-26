var eloquent
eloquent = window.main
// can make it so you set the class names ealry on 
// then you just use a new make method to supply parts
describe("Defines", function() {explo
	eloquent.make({
		class_name : { 
			text : {
				"wrap"     : "",
				"regular"  : "",
				"imporant" : "",
			},
		},
		part : [
			{
				type : "text",
				with : {
					content : [
						{ 
							type : "bold",
							text : "One",
						},
						{ 
							type : "underline",
							text : "Two",
						},
						{ 
							type : "italic",
							text : "Three",
						}
					]
				},
			}
		]	
	})
})