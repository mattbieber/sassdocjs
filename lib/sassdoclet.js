/**
 * Sassdoclet
 * object which represents sass doc comment
 *
 * @module lib/sassdoclet
 */
var _ = require('lodash'),
	_sd = require('./env/const'),
	_error = require('./util/errorhandler'),
	fs = require('fs'),
	log = require('./util/logger');

var dictionary = require('./lang/dictionary'),
	validator = require('./lang/validator');

/**
 * adds doc tag to doclet
 * @param {object} item
 * @private
 * @this SassDoclet
 */
function _add_to_sassdoclet(item) {

	if (item.context === _sd.CONTEXT.FIRST_CLASS) { this.kind = item.type; }
	this.add(item.type, item);
}

/**
 * adds context - top level or support to doc item
 * @private
 * @this SassDoclet
 */
function _validate(item) {
	var _def = dictionary.lookUpDefinition(item.kind);
	if(_def) {
		_def.validate(this, item);
		this.context = _def.context;

	}
}

/**
 * SassDocletItem class - sassdoclet entry
 * @param {object} src - comment source for item
 * @class
 */
function SassDocletItem(src) {
	for(var prop in src) { this[prop] = src[prop]; }
}

/**
 * SassDoclet class 
 * @param {object} src - comment source for sassdoclet
 * @returns new SassDoclet
 */
exports.SassDoclet = function(src) {

	/* implement base */
	require('./src/base').collectionBase.call(this, { typeName: 'SassDoclet' });

	this.name = src._name;
	this.kind = src._kind;
    this.id = src._id;
	this.filename = src._filename;
	this.lineno = src._lineno;
	this.usedin = src._usedin;
	this.expectedItemCount = src._itemcount;
	this.description = src._description;
	this.prefix = null;
	this.raw = src._raw.data;
	this.sass = src._sass.slice(0);

	if(!this.name || this.name === '') {
		try {
			this.name = src._items[0].name;

		}
		catch(e) {
			_error({
				message: 'cannot find name: ' + e.message,
				infile: 'sassdoclet.js',
				fatal: false,
				err: e,
				args: { source: src }
			});
		}
	}

	if(this.kind == null) {
		try {
			var _kind = src._items[0].kind;
			this.kind = _kind;
		}
		catch(e) {
			_error({
				message: 'cannot find kind: ' + e.message,
				infile: 'sassdoclet.js',
				fatal: false,
				err: e,
				args: { source: src }
			});
		}
	}
	
	return this;
};

/** exports - add item method */
exports.SassDoclet.prototype.addItem = function(src) {
	var item = new SassDocletItem(src);

	_validate.call(this, item);
	_add_to_sassdoclet.call(this, item);
};

/** exports - validate & restructure sassdoclet*/
exports.SassDoclet.prototype.validate = function() {

	var _self = this;
	var env = require('./env/context');

	var _def = dictionary.lookUpDefinition(this.kind);

	/* code */
	if(_def.canHaveCode == _sd.VALIDATION.NOT_ALLOWED) {
		this.sass = [];
	} else {
		if(this.kind === 'var' && this.sass.length > 0) {

			this.sass = this.sass[0];
		} else {
			this.sass = this.sass.join('\n');
		}
	}

	/* description */
	if(this.description.length === 0 && this.itemCount() > 0) {
		try {
			_self.description = _.values(this.items)[0].description;
		}
		catch(e) {
			_error({
				message: 'error trying to assign kind',
				infile: 'sassdoclet.js',
				fatal: false,
				err: e,
				args: { source: this.id }
			});
		}
	}

	/* items */
	this.items = _.filter(this.items, function(item){
		return item.kind != _self.kind;
	});

	/* prefixed */
	if(env.runenv[_sd.ENV.PREFIXED].value) {

		var prefixes = require('./lang/prefix');
		var _matched = false;

		_.each(_.keys(prefixes), function(k) {
			if(_self.name.indexOf(k) === 0) {
				_self.prefix = prefixes[k];
				_self.name = _self.name.replace(k,'');
				return;
			}
		});
	}


	return true;
};


