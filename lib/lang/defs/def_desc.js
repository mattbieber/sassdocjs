/**
 * language definition file for a description (unused)
 * @module lib/lang/defs/def_desc
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'description',
		canHaveValue: _sd.VALIDATION.REQUIRED,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.NOT_ALLOWED,
		canHaveName: _sd.VALIDATION.NOT_ALLOWED

	});

	/* definitions must implement validate */
	this.validate = function() {

	};

}

/** exports */
module.exports = new _lang_def();
