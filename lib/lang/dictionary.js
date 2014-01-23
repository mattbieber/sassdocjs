/**
 * Language definition module
 * @module lib/lang/dictionary
 */

var _ = require('lodash'),
	_sd = require('../env/const'),
	log = require('../util/logger'),
	_defs = {};

/**
 * helper class for land definition objects
 * @param {object} obj - source data for land object
 */
function LangDefinition(obj) {

	var _self = this;

	this.defname = obj.title;
	Object.keys(obj).forEach(function(p) { _self[p] = obj[p]; });
    return this;
}

/**
 * dictionary definition object
 */
var dictionary = {

	/**
	 * return definition for character code
	 * @param {obj} obj - definition name
	 * @returns {bool} - lang definition is defined
	 */
	defineTag: function(obj) {

		var def = new LangDefinition(obj);
		_defs[def.type_def] = def;

		log([_sd.LOGGING.SUCCESS, 'dictionary.js', 'lang definition loaded', def.type_def]);
		return _defs[def.type_def];
	},

	/**
	 * return definition for character code
	 * @param {string} title - definition name
	 * @returns {bool} - lang definition is defined
	 */
	isDefined: function(title) {
		return _defs[title] !== undefined;
	},

	/**
	 * return definition for name
	 * @param {string} title - definition name
	 * @returns {object} - lang definition
	 */
	lookUpDefinition: function(title) {
		return _defs[title];
	},

	/**
	 * return definition for character code
	 * @param {number} charCode
	 * @returns {object} - lang definition
	 */
	lookUpWithIdentifier: function(charCode) {
		return _.find(_defs, function(obj){
			return obj.value == charCode;
		});
	},

	/**
	 * helper string cleaning function
	 * @param {string} str
	 * @returns {string} - optimized string
	 */
	normalize: function(str) {
		return str.toLowerCase();
	}
};

require('./definitions').defineTags(dictionary);

/**
 * exports
 */
module.exports = dictionary;
