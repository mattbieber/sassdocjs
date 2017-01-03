/**
 * language definition file for @extend
 * @module lib/lang/defs/def_extends
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'extends',
		canHaveValue: _sd.VALIDATION.REQUIRED,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.OPTIONAL,
		canHaveName: _sd.VALIDATION.NOT_ALLOWED

	});

	/* definitions must implement validate */
	this.validate = function() {

	};

}

/** exports */
module.exports = new _lang_def();
