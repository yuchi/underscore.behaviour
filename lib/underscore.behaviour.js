// Underscore.behaviour
// (c) Pier Paolo Ramon

// Version 0.0.1


(function(root){
	'use strict';

	// Internal function used to implement `_.throttle` and `_.debounce`.
	//
	// Stolen from Underscore.js
	var limit = function(func, wait, debounce) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var throttler = function() {
				timeout = null;
				func.apply(context, args);
			};
			if (debounce) clearTimeout(timeout);
			if (debounce || !timeout) timeout = setTimeout(throttler, wait);
		};
	};

	var _b = {

		// Returns a function, that, when invoked, will only be triggered
		// at most once during a given window of time. If `immediate` is
		// set to `true` this behaves as an alias for `_.throttle`.
		limit: function(func, wait, immediate, trailing) {
			return !immediate ? limit(func, wait, false) : _b.throttle(func, wait, trailing);
		}

		// Returns a function, that, when invoked, will be triggered
		// immediately but repeated calls will be deferred until
		// `wait` time has passed. If `trailing` is set to `true` then
		// when the function is invoked during the delay time it will
		// be executed at the end of the delay time.
		//
		// **Do not confuse this with Underscore.js' own implementation**
		throttle: function(func, wait, trailing) {
			var timeout, throttled, next;
			return (throttled = function() {
				var context = this, args = arguments;
				var clearer = function() {
					clearTimeout(timeout);
					timeout = null;
					if (trailing && next) {
						throttled.apply(next.context, next.args);
					}
				};
				if (!timeout) {
					next = null;
					func.apply(context, args);
					timeout = setTimeout(clearer, wait);
				} else if (trailing) {
					next = {
						context: context,
						args: args
					}
				}
			});
		}
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
