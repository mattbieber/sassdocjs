/**
 * language definition file for a CSS class
 * @module lib/lang/defs/def_class
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'class',
		value: 46, //.
		name_position: 1,
		context: _sd.CONTEXT.FIRST_CLASS,
		canHaveValue: _sd.VALIDATION.REQUIRED,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.NOT_ALLOWED
	});

	/* definitions must implement validate */
	this.validate = function() {

	};

}

/** exports */
module.exports = new _lang_def();