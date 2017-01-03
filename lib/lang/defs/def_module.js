/**
 * language definition file for a module
 * @module lib/lang/defs/def_module
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	var _self = this;

	/* implement base */
	definitionBase.call(this, {
		type_def: 'module',
		context: _sd.CONTEXT.FIRST_CLASS,
		canHaveValue: _sd.VALIDATION.REQUIRED,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.NOT_ALLOWED,
		canHaveCode:  _sd.VALIDATION.NOT_ALLOWED
	});

	/* definitions must implement validate */
	this.validate = function(doc, item) {
		var errs = this.isValidItem(doc,item);

		if(errs.length > 0) {

		}
		var x = /[^/]+$/.exec(item.name);

	};

}
/** exports */
module.exports = new _lang_def();