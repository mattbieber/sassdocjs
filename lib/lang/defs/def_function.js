/**
 * language definition file for a Sass function
 * http://sass-lang.com/documentation/file.SASS_REFERENCE.html#function_directives
 *
 * @module lib/lang/defs/def_function
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'function',
		context: _sd.CONTEXT.FIRST_CLASS,
		name_position: 2,
		canHaveValue: _sd.VALIDATION.REQUIRED,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.OPTIONAL

	});

	/* definitions must implement validate */
	this.validate = function() {

	};

}
/** exports */
module.exports = new _lang_def();
