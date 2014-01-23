/**
 * Filter module
 *
 * @module lib/src/filter
 * implements EventEmitter
 *
 *  emits:
 *  + FILTER_COMMENT_FILTERED
 *  + FILTER_COMPLETE
 */
var _ = require('lodash'),
	_sd = require('../env/const'),
	_error = require('../util/errorhandler'),
	fs = require('fs'),
	util = require('util'),
	log = require('../util/logger');

var dictionary = require('./../lang/dictionary');

/**
 * filters sass source that comment documents
 * @private
 */
function _filtercode() {
	var _self = this;
	var line = this.processingBlock._lineno- 1,
		complete = false,
		result = [] ;

	var counts = {
		left: 0,
		right: 0
	};

	var _first = _self.buffer[line];

	if(_first !== undefined || _first.trim() !== '') {
		while(!complete) {
			var str = _self.buffer[line];
			var len = str.length;

			for(var i=0;i<len;i++) {
				if(str.charCodeAt(i) == 123) { counts.left++; }
				if(str.charCodeAt(i) == 125) { counts.right++; }
			}

			result.push(str);
			line++;
			complete = (counts.left === 0 || counts.right < counts.left) ? false : true;
		}
	}
	this.processingBlock._sass = result;
}

/**
 * assign the kind or definition to use for the comment block
 * @private
 */
function _filterkind() {

	if(this.processingBlock === null || this.processingBlock._sass.length === 0) { return false; }

	var str = this.processingBlock._sass[0],
		charcode = str.charCodeAt(0),
		_def = dictionary.lookUpWithIdentifier(charcode);

	if(_def) {
		this.processingBlock._kind = _def.type_def;

		if(_def.name_position == 1) {
			if(_def.type_def === 'var') {
				this.processingBlock._name = str.substr(1, str.indexOf(':')).trim();
}
			else {
				this.processingBlock._name = str.substr(1, str.indexOf(' ')).trim();

			}

		}

		if(_def.name_position == 2) {

			this.processingBlock._name = str.substring(str.indexOf(' '), str.indexOf('(')).trim();
		}

	}
}

/**
 * filter any tags (params, returns, etc) in the comment clock
 * @private
 */
function _filtertags() {

	if(this.processingItem === null) { return false; }

	this.processingLine = this.processingLine.trim();
	var _def = dictionary.lookUpDefinition(this.processingItem.kind);

	if(_def && _def.shouldParse !== false) {
		var result,
			_paraminfo = {};

		/* name */
		if(_def.canHaveName != _sd.VALIDATION.NOT_ALLOWED) {
			result = _sd.REGEX.PARAM_NAME.exec(this.processingLine);
			if(this.processingItem.kind == 'var') {
				

			}
			if(result) {
				this.processingItem.name = result[0].trim();
				this.processingLine = this.processingLine.replace(result[0], '');
				result = null;
			}
		}

		/*  {type(s)} - get type name(s) */
		if(_def.canHaveMeta != _sd.VALIDATION.NOT_ALLOWED) {
			result = _sd.REGEX.PARAM.exec(this.processingLine);

			if(result) {
				var _type = _sd.REGEX.PARAM_ENTRY.exec(result[0]);
				this.processingItem.type = _type[0].trim();
				this.processingLine = this.processingLine.replace(result[0], '');
				result = null;
			}
		}

		// TODO param meta - optional, defaults

		/* description */
		if(this.processingLine.charAt(0) == '-') {
			this.processingLine  = this.processingLine.slice(1).trim();
		}
		this.processingItem.description = this.processingLine.trim();
	}
}

/**
 * filters parsed comment blocks into sassdocjs related data
 * @constructor
 */
exports.Filter = function() {

	var _self = this;

	/* implement base */
	require('./base').workerBase.call(this, { typeName: 'Filter' });

	this.processingLine = this.processingBlock = null;

	/**
	 * Processes comment blocks for a file
	 * with each line
	 * - get @elements and put in array
	 * - test each for documentable possibility
	 * - if documentable take @name and everything up to next @documentable or EOL
	 * - if array length == 0 it's a description continuation
	 *
	 * @param {Object} context data - parser obj, callback - callback
	 * @returns {Object} - self via callback
	 */
	this.process = function(context) {

		var parser = context.data,
			callback = context.callback;

		this.buffer = context.data.buffer;

		var _block,
			_self = this,
			_count = 0;

		var _predicate = function(val) { return val !== ''; };

		while(_block = parser.queue.dequeue()) {
			this.processingBlock = {
				_id: util.format('%s.%d', _block.filename, ++_count),
				_filename: _block.filename,
				_lineno: _block.lineno,
				_usedin: _block.usedin,
				_prefix: null,
				_description: '',
				_kind: null,
				_itemcount: 0,
			    _items: [],
				_sass: [],
				_raw: _block
			};

			_filtercode.call(this);
			_filterkind.call(this);

			/* strip out blank lines */
			var cleanData = _.filter(_block.data, _predicate);
			var _item_id = 0;

			/* each line */
			for(var i=0;i<cleanData.length;i++) {
				var cleanline = cleanData[i].trim();

				if(cleanline.length > 0) {
					var _handled = false;
					this.processingLine = cleanline;

					/* @ match */
					var result;
					while(result = _sd.REGEX.TYPE.exec(this.processingLine)) {
						_handled = true;
						var _kind_src = result[0].trim();
						var _kind =  _kind_src.slice(1);
						this.processingLine = this.processingLine.replace(_kind_src, '');
						this.processingItem = { id: ++_item_id, kind: _kind, type: '', name: '', description: '', src: cleanline, paraminfo: {} };

						if(dictionary.isDefined(_kind)) {
							this.processingItem.kind = _kind;
							_filtertags.call(this);

							if(this.processingItem.src.length > 0) {
								this.processingBlock._itemcount++;
								this.processingBlock._items.push(this.processingItem);
								this.processingItem = null;
								this.emit(_sd.EVENTS.FILTER_COMMENT_FILTERED);
							}
						}
					}

					// TODO check description or can be muiltiline

					/* append any description newline to appropriate entity */
					if(!_handled) {
						if(!this.processingItem && this.processingBlock._itemcount > 0) {
							_.last(this.processingBlock._items).description += util.format('%s\n', cleanline.trim());
						} else {
							this.processingBlock._description += util.format('%s\n', cleanline.trim());
						}
					}
				}
			}

			this.queue.enqueue(this.processingBlock);
			this.emit(_sd.EVENTS.FILTER_COMPLETE);
		}

		// feedback - number of comment blocks filtered
		log([ _sd.LOGGING.INFO, 'filter', 'filtered comment blocks count', parser.processingFilename, _self.queue.getLength() ]);

		// uncomment to create test spec data
		// require('../env/io').saveJson('test-filter.json', _self.queue.items());

		callback(null, this);
	};
};

/** exports */
exports.Filter.prototype = Object.create( require('events').EventEmitter.prototype );