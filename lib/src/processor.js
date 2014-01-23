/**
 * Processor module
 *
 * @module lib/src/processor
 * implements EventEmitter
 *
 *  emits:
 *  + PROCESSOR_FILE_QUEUED
 *  + PROCESSOR_FILE_COMPLETE
 *  + PROCESSOR_COMPLETE
 */

var _ = require('lodash'),
	_sd = require('../env/const'),
	_error = require('../util/errorhandler'),
	fs = require('fs'),
	util = require('util'),
	log = require('../util/logger'),
	__worker = require('./../src/worker.js').Worker;

/**
 * Controller object to direct worker processing
 * @constructor
 */
function Processor(){

	var _self = this;

	/* implement base */
	require('./base').workerBase.call(this, { typeName: 'Processor' });

	var env = require('../env/context');

	/** @member {number} the number of workers to allow */
	this.workerlimit = env.runenv[_sd.ENV.WORKER_LIMIT].value;
	/** @member {number} workers in use */
	this.workercount = 0;
	/** @member {number} count of sassdoclets */
	this.completecount = 0;
	/** @member {number} files in total */
	this.filecount = 0;

	/**
	 * handler for completed event raised by worker obj
	 * adds result to collection & sent to process next item in queue
	 *
	 * @handles EVENTS.WORKER_COMPLETED
	 * @private
	 * @this Worker
	 */
	this._on_worker_completed = function() {

		_self.emit(_sd.EVENTS.PROCESSOR_FILE_COMPLETE);

		_.each(this.items, function(sassdoclet) {
			try {
				_self.add(sassdoclet.id, sassdoclet);
			} catch(e) {
				_error({
					message: 'error on worker completed',
					infile: 'processor.js',
					fatal: false,
					err: e,
					args: { 'sassdoclet_id' : sassdoclet.id }
				});
			}
		});

		log([_sd.LOGGING.SUCCESS, 'processor.js', 'worker completed', _self.completecount, _self.filecount ]);

		_self.completecount++;
		_self.try_next_worker(this);
	};

	/**
	 * attemps to process next item in queue while under worker limit
	 * @param {object} worker - finished worker object, if any
	 * @private
	 */
	this.try_next_worker = function(worker) {

		if(_self.completecount == _self.filecount) {
			_self.emit(_sd.EVENTS.PROCESSOR_COMPLETE);
		}

		if(worker) {
			worker = null;
			_self.workercount--;
		}

		if(_self.completecount < _self.filecount && _self.workercount < _self.workerlimit) {
			var _workerfile = _self.queue.dequeue();

			if(_workerfile) {
				var _worker = new __worker().on(_sd.EVENTS.WORKER_COMPLETED, _self._on_worker_completed);
				_self.workercount++;
				_worker.process(_workerfile);
				return 0;
			}

			setImmediate(_self.try_next_worker);
		}
	};

	/**
	 * process a file for sassdoc comments
	 * @param {string} filename - the file to enqueue
	 */
	this.process = function(filename) {

		_self.queue.enqueue(filename).emit(_sd.EVENTS.PROCESSOR_FILE_QUEUED);
		_self.filecount++;
		_self.try_next_worker();
	};
}

util.inherits(Processor, require('events').EventEmitter);

/** exports */
module.exports = new Processor();

