/**
 * language definition file for a usage example
 * @module lib/lang/defs/def_example
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'example',
		canHaveValue: _sd.VALIDATION.NOT_ALLOWED,
		canHaveDescription: _sd.VALIDATION.REQUIRED,
		canHaveMeta:  _sd.VALIDATION.NOT_ALLOWED

	});

	/* definitions must implement validate */
	this.validate = function() {

	};
}

/** exports */
module.exports = new _lang_def();