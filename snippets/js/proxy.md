
proxy
js
name:proxy,name:object
---
const @:name:proxy:@ = new Proxy(@:name:object:@, {
	get: function (target, property) {
		// default behavior
		return target[property];
	},

	set: function (target, property, value, receiver) {
		// default behavior
		Reflect.set(target, property, value, receiver);
	},

	deleteProperty: function(target, property) {
		return Reflect.deleteProperty(target, property);
	}
});
