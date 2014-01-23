/**
 * Worker module
 *
 * @module lib/src/worker
 * implements EventEmitter
 *
 *  emits:
 *  + WORKER_COMPLETED
 */

var _ = require('lodash'),
	_sd = require('../env/const'),
	_error = require('../util/errorhandler'),
	fs = require('fs'),
	path = require('path'),
	log = require('../util/logger'),
	util = require('util'),
	controlflow = require('../env/controlflow').Flow,
	Parser = require('./../src/parser.js').Parser,
	Filter = require('./../src/filter.js').Filter,
	Maker = require('./maker.js').Maker;

/**
 * Controller object to direct parser, filter, builder
 * @constructor
 */
exports.Worker = function(id) {

	var _self = this;

	/* implement base */
	require('./base').workerBase.call(this, { typeName: 'Worker' });

	/** @member {object} worker id */
	this.id = id;
	/** @member {object} parser */
	this.parser = new Parser();
	/** @member {object} filter */
	this.filter = new Filter();
	/** @member {object} obj builder */
	this.maker = new Maker();
	/** @member {object} work flow */
	this._async = new controlflow();
	/** @member {number} counts */
	this.parsedComments = this.filteredComments = this.sassdocCount = 0;

	/* events */
	this.parser.on(_sd.EVENTS.PARSER_COMMENT_FOUND, function() {
		_self.parsedComments++;
		log([_sd.LOGGING.INFO, 'worker.js', 'comment found', this.processingFilename]);

	});

	this.filter.on(_sd.EVENTS.FILTER_COMMENT_FILTERED, function() {
		_self.filteredComments++;
		log([ _sd.LOGGING.INFO, 'worker.js', 'filtered comment block', this.processingBlock.kind  ]);

	});

	this.maker.on(_sd.EVENTS.MAKER_SASSDOCLET_CREATED, function(sassdoclet){
		_self.sassdocCount++;
		_self.add(_self.sassdocCount, sassdoclet);
		log([ _sd.LOGGING.INFO, 'worker.js', 'sassdoclet created', sassdoclet.id  ]);

	});

	/**
	 * process a file for sassdoc comments
	 * @param {string} filename - the file to process
	 */
	this.process = function(filename) {
		var _self = this;
		this.filename = filename;

		/** send file through sequence */
		this._async.sequence([
			function(callback) {
				_self.parser.process({
					data: _self.filename,
					callback: callback
				});
			},
		    function(parser, callback) {
			    _self.filter.process({
					data: parser,
				    callback: callback
			    });
		    },
		    function(filter, callback) {
			    _self.maker.process({
				    data: filter,
				    callback: callback
			    });
		    }
	    ],
	    function(err, result) {
			if(err) {
				_error({
					message: 'error in worker sequence',
					infile: 'worker.js',
					fatal: false,
					err: err,
					args: { 'filename' : filename }
				});
			}

		  _self.emit(_sd.EVENTS.WORKER_COMPLETED);
		});
	};

	return this;
};

/** exports */
exports.Worker.prototype = Object.create(require('events').EventEmitter.prototype);