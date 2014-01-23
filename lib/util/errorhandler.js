/**
 * Error handling module
 * @module lib/util/errorhandler
 *
 * get error related data and attempt to deconstruct err stack before logging
 */

var _sd = require('../env/const'),
	util = require('util'),
	colors = require('colors');

/**
 * exports
 * @param {object} obj - The exception to handle.
 *
 * obj
 *  message {string}
 *  infile (string} - file/func (rough where indicator)
 *  fatal {boolean}
 *  err {object} - Error obj
 *  args {object[]} - any extra info
 */
module.exports = function(obj) {

	var	err = obj.err,
		stack = err.stack,
		name = err.name,
		message = err.message,
		stackdata = [];


	stack.forEach(function (frame) {
		stackdata.push(util.format('%d\t[%s] %s',
			frame.getLineNumber(),
			frame.getFunctionName(),
			frame.getFileName()
		));
	});

	require('./logger')([
		_sd.LOGGING.ERROR,
		obj.infile,
		obj.err.toString(),
		util.format('fatal: %s', obj.fatal),
		stackdata,
		obj.args
	]);

	/* fail is nec'y */
	if(obj.fatal) { process.exit(1); }
};



