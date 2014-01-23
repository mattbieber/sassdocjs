/**
 * IO module to get lang definitions into dictionary
 * @module lib/lang/definitions
 */

var _       = require("lodash"),
	_sd    = require('../env/const'),
	_error  = require('../util/errorhandler'),
	path    = require('path'),
	fs      = require('fs'),
	util    = require('util'),
	IO      = require('../env/io.js');


/**
 * exports
 * @param {object} dictionary - the dictionary module to populate
 */
exports.defineTags = function(dictionary) {

	var filepath = path.join(__dirname,'defs'),
		files;

	IO.getDefinitions(filepath, function(err, obj){
		if(err) {
			_error({
				message: 'error getting definitions for path',
				infile: 'definitions.js',
				fatal: false,
				err: err,
				args: { 'path' : filepath }
			});
		}

		files = obj;

		try {
			for(var i = 0; i < files.length; i += 1) {
				var filename = files[i];
				var def_name = path.basename(filename, '.js');
				var item = require(util.format('./defs/%s', def_name));
				dictionary.defineTag(item);
			}
		}
		catch(e) {
			_error({
				message: 'error in define tags',
				where: 'definitions.js',
				fatal: false,
				err: e
			});
		}
	});
};

