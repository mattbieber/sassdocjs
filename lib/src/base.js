/**
 * Base class for for worker-type objects
 * provides base collection functionality & process implementation
 *
 * @module lib/src/base
 */

var _    = require('lodash'),
	_sd = require('../env/const');

/** @namespace */
var _factory = {};

/**
 * helper function to get implementor
 * @param {object[]} args - arguments
 * @param {string} name - name of class implementor
 * @returns {object}
 */
_factory.getTarget = function (args, name) {

	if (args) { return (args.length) > 1 ? args[0] : {}; }
	return null;
};

/**
 * helper function for options parsing
 * @param {object[]} args
 * @returns {object}
 */
_factory.getOptions = function(args){

	if(args){ return (args.length) === 1 ? args[0]  || {} : (args.length) > 1 ? args[1] || {} : {}; }
	return null;
};

/**
 * base collection class
 * @returns {object}
 */
_factory.collectionBase = function() {

	var args = arguments;
	var obj = _factory.getTarget(args, "Collection");

	(function () {
		var _self = this;
		var _options = _factory.getOptions(args);

		/** @member {object[]} temp storage */
		this.buffer   = _options.buffer || [];
		/** @member {object} main collection for implementor  */
		this.items  = _options.items || {};
		/** @member {string} id   */
		this.id     = _options.id || '';
		/** @member {number} id   */
		this.itemCount = function() { return Object.keys(this.items).length; };
		/** @member {key, val} add an item to the collection   */
		this.add =  _options.add || function(key, val){ _self.items[key] = val; return _self; };
		/** @member {key, val} add an item to the collection returning last  */
		this.addAndReturn = _options.addAndReturn || function(key, val){ _self.items[key] = val; return _.last(_self.items); };
		/** @member {object} remove an item from the collection   */
		this.remove = _options.remove || function(item){ _self.items = _.without(_self.items, item); };
		/** @member clear the collection   */
		this.clear = _options.clear || function() { _self.items = {}; };
		/** @member {string} id   */
		this.typeName = _options.typeName || 'typeName not set';

	}).apply(this, args);

	return this;
};

/**
 * base queue class
 * @returns {_factory}
 */
_factory.workerBase = function() {

	var args = arguments;
	var obj = _factory.getTarget(args, "Worker");

	(function () {
		var _self = this;
		var _options = _factory.getOptions(args);

		var _queue = [];
		var _offset = 0;

		this.context = {
			data: null,
			callback: null
		};

		/** @member {object} - current item   */
		this.processingItem = null;

		/**
		 * main worker method to implement
		 * @abstract
		 */
		this.process = function() { throw(new Error('Process not implemented.')); };
		/** total queue count  */
		this.queuedCount = 0;
		/** current queue count */
		this.currentQueuedCount = 0;
		/** internal queue   */
		this.queue = {
			/** @member {number} queue length */
			getLength: function() { return (_queue.length - _offset); },
			/** @member {bool} is queue empty */
			isEmpty: function() { return (_queue.length === 0); },
			/** @member - empty the queue */
			empty: function() { _queue.length = _self.queuedCount = 0; },
			/** @member {object[]} return all queued items */
			items: function(){ return _queue;},
			/** @member {object} get item at the front of the queue without dequeuing it */
			peek: function(){ return (_queue.length > 0 ? _queue[_offset] : undefined); },
			/** @member {object} push object to queue */
			enqueue: function(item) {
				_queue.push(item);
				_self.queuedCount++;
				return _self;
			},
			/** @member - push the current item to queue */
			enqueueProcessingItem: function() {
				_queue.push(_self.processingItem);
				_self.queuedCount++;
				return _self;
			},
			/** @member {object} return queued obj */
			dequeue: function(){
				if (_queue.length === 0) { return undefined; }

				// store the item at the front of the queue
				var item = _queue[_offset];

				// increment the offset and remove the free space if necessary
				if (++ _offset * 2 >= _queue.length) {
					_queue  = _queue.slice(_offset);
					_offset = 0;
				}
				_self.queuedCount--;
				return item;
			}
		};

	}).apply(this, args);

	return this;
};

/**
 * exports - collection base class
 * @param {object[]} options
 */
exports.collectionBase = function(options) {
	_factory.collectionBase.call(this, options);
};

/**
 * exports - worker  base class
 * @implements  coolection base
 * @param {object[]} options
 */
exports.workerBase = function(options) {
	_factory.collectionBase.call(this, options);
	_factory.workerBase.call(this, options);
};

