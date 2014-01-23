/**
 * Error handling module
 * @module lib/util/errorhandler
 *
 * get error related data and attempt to deconstruct err stack before logging
 * based on https://gist.github.com/iamkvein/2006752
 */

var _err = require('./errorhandler');

var _error = function(msg, obj) {
	_err({
		message: msg,
		infile: 'hook.js',
		fatal: false,
		err: new Error(''),
		args: { 'obj' : obj }
	});
};

/**
 * exports
 * @param {object} obj to hijack
 */
module.exports = function(obj) {

	if (obj.hook || obj.unhook) { _error('object already hooked', obj); }

	/**
	 * hook into the object swapping out method
	 * @param {string} _meth_name
	 * @param {object} _fn
	 * @param {bool} _is_async
	 */
	obj.hook = function(_meth_name, _fn, _is_async) {
		var self = this,
			meth_ref;

		if (Object.prototype.toString.call(self[_meth_name]) !== '[object Function]') { _error('invalid method name' + _meth_name, obj); }
		if (self.unhook.methods[_meth_name]) { _error('method already hooked' + _meth_name, obj); }
		meth_ref = (self.unhook.methods[_meth_name] = self[_meth_name]);

		self[_meth_name] = function() {
			var args = Array.prototype.slice.call(arguments);

			while (args.length < meth_ref.length) { args.push(undefined); }

			args.push(function() {
				var args = arguments;

				if (_is_async) {
					process.nextTick(function() {
						meth_ref.apply(self, args);
					});
				} else {
					meth_ref.apply(self, args);
				}
			});

			_fn.apply(self, args);
		};
	};

	/**
	 * unhook method
	 * @param {string} _meth_name
	 */
	obj.unhook = function(_meth_name) {
		var self = this,
			ref  = self.unhook.methods[_meth_name];

		if (ref) {
			self[_meth_name] = self.unhook.methods[_meth_name];
			delete self.unhook.methods[_meth_name];
		} else {
			_error('method not hokked' + _meth_name, obj);
		}
	};

	obj.unhook.methods = {};
};