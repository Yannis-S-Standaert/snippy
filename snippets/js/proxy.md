
proxy
js
name:proxy,name:object
---
const @:name:proxy:@ = new Proxy(@:name:object:@, {
	get: function (target, property) {
		// default behavior
		return target[property];
	},

	set: function (target, property, value) {
		// default behavior
		target[property] = value;
	}
});
