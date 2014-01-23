/**
 * language definition file for a Sass variable
 * http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variables_
 *
 * @module lib/lang/defs/def_var
 */

var _sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'var',
		value: 36, //$
		name_position: 1,
		context: _sd.CONTEXT.FIRST_CLASS,
		canHaveValue: _sd.VALIDATION.REQUIRED,
		canHaveDescription: _sd.VALIDATION.OPTIONAL,
		canHaveMeta:  _sd.VALIDATION.OPTIONAL
	});

	/* definitions must implement validate */
	this.validate = function(doc, item) {
		var errs = this.isValidItem(doc,item);

		if(errs.length > 0) {
			// handle errors
		}
		/* custom validatation */
		doc.type = item.type || 'not assigned';
		doc.name = item.name = doc.name.substr(0, doc.name.indexOf(':'));


	};

}
/** exports */
module.exports = new _lang_def();
