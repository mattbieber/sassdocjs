/**
 Runtime process event handlers
 @module lib/env/runtime
 */

var _error = require('../util/errorhandler');

/** exports */
module.exports = (function() {

	/** exit - clean up temp files */
	process.on('exit', function() {
		require('./io').cleanUp();
	});

	/** uncaughtException - throw error */
	process.on('uncaughtException', function(e) {
		_error({
			message: 'caught by process.on',
			infile: 'runtime.js',
			fatal: true,
			err: e
		});
	});

	/** stdout error - throw error */
	process.stdout.on('error', function(e) {
		_error({
			message: 'error process stdout',
			infile: 'runtime.js',
			fatal: true,
			err: e
		});
	});

})();