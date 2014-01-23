/**
 * Base class for language definitions to implement
 *
 * @module lib/lang/defs/_def
 * + implementors must provide for validate()
 */

var _sd = require('../../env/const');

function _def(args) {

	(function () {

		/** @member {string} the language name of the item being defined */
		this.type_def = args.type_def || null;
        /** @member {enum} _sd.CONTEXT value - top level or supportive */
		this.context = args.context || _sd.CONTEXT.SUPPORTIVE;
		/** @member {object} value for the item  */
		this.value = args.value || null;
		/** @member {string} description of the item */
		this.description = null;
		/** @member {object} arbitrary data for the item */
		this.meta = null;
		/** @member {number} where to find name after charAt(0) */
		this.name_position = args.name_position || 0;

		/** @member {bool} */
		this.canHaveValue = args.canHaveValue || _sd.VALIDATION.OPTIONAL;
		/** @member {bool} */
		this.canHaveDescription = args.canHaveDescription || _sd.VALIDATION.OPTIONAL;
		/** @member {bool} */
		this.canHaveMeta = args.canHaveMeta || _sd.VALIDATION.OPTIONAL;
		/** @member {bool} */
		this.canHaveName = args.canHaveName || _sd.VALIDATION.OPTIONAL;
		/** @member {bool} */
		this.canHaveCode = args.canHaveCode || _sd.VALIDATION.REQUIRED;
		/** @member {bool} */
		this.shouldParse = this.canHaveMeta != this.canHaveName != this.canHaveDescription != _sd.VALIDATION.NOT_ALLOWED;

		/**
		 * bit fieldish checks for basic rules
		 */
		this.isValidItem = function(doc, item) {
			var result = [],
				len = 0;

			/* name */
			if(item.name && item.name.constructor == ''.constructor) {
				len = item.name.length;

				if(len > 0 && this.canHaveName == _sd.VALIDATION.NOT_ALLOWED)
				{ result.push('no name allow'); }

				if(len === 0 && this.canHaveName == _sd.VALIDATION.REQUIRED)
				{ result.push('name req'); }
			}

			/* code */
			if(this.context == _sd.CONTEXT.FIRST_CLASS) {
				len = doc.sass.length;

				if(len > 0 && this.canHaveCode == _sd.VALIDATION.NOT_ALLOWED)
				{ result.push('no code allow'); }

				if(len === 0 && this.canHaveCode == _sd.VALIDATION.REQUIRED)
				{ result.push('code req'); }

			}

			// test top level


			return result;

		};
		/**
		 * validation rules set by implementor
		 * @abstract
		 * @returns {bool} true | false
		 */
		this.validate = function() { throw new Error('validate not implemented'); };

	}).apply(this, args);

	return this;
}

/** exports */
exports.definitionBase = _def;

