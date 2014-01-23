/**
 * language definition file for a Sass mixin
 * http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins
 *
 * @module lib/lang/defs/def_mixin
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'mixin',
		value: 64, //@
		name_position: 2,
		context: _sd.CONTEXT.FIRST_CLASS,
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