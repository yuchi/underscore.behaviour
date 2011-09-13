// Underscore.behaviour
// (c) Pier Paolo Ramon

// Version 0.0.1


(function(root){
	'use strict';

	var _b = {
		// Here functions will be listed
	};

	// CommonJS environment
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = _b;
	}

	// Integration with Underscore.js
	else if (typeof root._ !== 'undefined' && root._.mixin) {
		root._.mixin(_b);
	}

	// Or take possess of `_` itself
	else {
		root._ = _b;
	}

})(this||window)
