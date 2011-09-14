//    Underscore.behaviour
//    (c) Pier Paolo Ramon
//    Underscore.behaviour is freely distributable under the MIT license

//    Version 0.0.1


(function(root){
	'use strict';

	// Where to find the wrapped function;
	var originalNS = '__original';

	// Walks the wrappings searching for the original function.
	Function.prototype.getOriginal = function () {
		var fn = this;
		while (typeof fn[originalNS] === 'function') {
			fn = fn[originalNS];
		}
		return fn;
	};

	// Lock the wrapping chain to the context of call.
	Function.prototype.finalize = function () {
		this[originalNS] = null;
		return this;
	};

	// Internal dummy logger. Can be replaced with `_b.setLogger`.
	var _log = function (message, args, status) {
		/* Nothing. */
	}

	// Internal function used to implement `_.throttle`, `_.limit` and `_.debounce`.
	//
	// Stolen from Underscore.js, where it's a private function called
	// `limit`.
	var limiter = function(func, wait, debounce) {
		var base = arguments;
		var timeout, limited;
		limited = function() {
			var context = this, args = arguments;
			var throttler = function() {
				timeout = null;
				func.apply(context, args);
			};
			if (debounce) {
				_log('debouncing',base,{context:context,timeout:timeout,args:args});
				clearTimeout(timeout);
			}
			if (debounce || !timeout) {
				_log(debounce ? 'debounced execution' : 'throttled execution',base,{context:context,timeout:timeout,args:args});
				timeout = setTimeout(limited, wait);
			}
		};
		limited[originalNS] = func;
		return limited;
	};

	var _b = {

		// Returns a function, that, when invoked, will only be triggered
		// at most once during a given window of time. If `immediate` is
		// set to `true` this behaves as an alias for `_.limit`.
		//
		// This overwrites Underscore's implementation, without breaking
		// compatibility, just extends it to understand the `immediate`
		// case and `trailing`.
		//
		// **Proven to act as Underscore.js 1.1.7, future or previous
		// versions must be tested and verified**
		throttle: function(func, wait, immediate, trailing) {
			return !immediate ? limiter(func, wait, false) : _b.limit(func, wait, trailing);
		},

		// Returns a function, that, when invoked, will be triggered
		// immediately but repeated calls will be deferred until
		// `wait` time has passed.
		//
		// When `trailing` is set to `false` or not defined at all every
		// call for `wait` milliseconds after execution will be swallowed.
		//
		// When `trailing` is set to `true` then if during `wait`
		// milliseconds after execution another call happens, the call's
		// context and arguments are stored and the execution delayed
		// of `wait` milliseconds.
		//
		// When an execution get delayed when another one has been delayed
		// before, the old execution (and its arguments) is removed and
		// ovverwritten with the last one.
		limit: function(func, wait, trailing) {
			var base = arguments;
			var timeout, limited, clear, next;
			clear = function(force) {
				_log('clearing',base,{next:next,clear:clear,timeout:timeout});
				clearTimeout(timeout);
				timeout = null;
				if ((trailing || force) && next) {
					_log('trailed execution',base,{next:next,clear:clear,timeout:timeout});
					limited.apply(next.context, next.args);
				}
			};
			limited = function() {
				var context = this, args = arguments;
				_log('call (limited)',base,{args:args,next:next,clear:clear,timeout:timeout});
				// Checking for `!timeout` permits both the first call and the
				// first call after `clear`ing to launch an execution.
				if (!timeout) {
					_log('limited (first) execution',base,{args:args,next:next,clear:clear,timeout:timeout});
					next = null;
					func.apply(context, args);
					timeout = setTimeout(clear, wait);
				} else if (trailing) {
					_log('trailing delay',base,{args:args,next:next,clear:clear,timeout:timeout});
					next = {
						context: context,
						args: args
					}
				} else {
					_log('swalloing',base,{args:args,next:next,clear:clear,timeout:timeout});
				}
			};
			limited.forceExecution = function () {
				clear(true);
			};
			limited.clear = clear;
			limited[originalNS] = func;
			return limited;
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

	// Replace the dummy logger with the one of your choice!
	_b.setLogger = function (loggerFunc) {
		_log = loggerFunc;
	}

})(this||window)
