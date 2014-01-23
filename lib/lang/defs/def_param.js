/**
 * language definition file for a Sass arg parameter
 * http://sass-lang.com/documentation/file.SASS_REFERENCE.html#keyword_arguments
 *
 * @module lib/lang/defs/def_param
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'param',
		canHaveName: _sd.VALIDATION.OPTIONAL,
		canHaveValue: _sd.VALIDATION.OPTIONAL,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.OPTIONAL
	});

	/* definitions must implement validate */
	this.validate = function() {

	};
}

/** exports */
module.exports = new _lang_def();