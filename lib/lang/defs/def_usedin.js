/**
 * language definition file for detailing where item is structurally used
 * @module lib/lang/defs/def_usedin
 */

var _       = require("lodash"),
	_sd = require('../../env/const'),
	definitionBase = require('./_def').definitionBase;

/**
 * @constuctor
 */
function _lang_def() {

	/* implement base */
	definitionBase.call(this, {
		type_def: 'usedin',
		canHaveName: _sd.VALIDATION.REQUIRED,
		canHaveValue: _sd.VALIDATION.OPTIONAL,
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
		var result = [];
		_.each(item.name.trim().split(','), function(str){
			result.push(str.trim());
		});


		doc.usedin = result;

	};

}

/** exports */
module.exports = new _lang_def();