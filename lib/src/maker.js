/**
 * Maker module
 *
 * @module lib/src/maker
 * implements EventEmitter
 *
 *  emits:
 *  + MAKER_SASSDOCLET_CREATED
 */
var _ = require('lodash'),
	_sd = require('../env/const'),
	_error = require('../util/errorhandler'),
	fs = require('fs'),
	log = require('../util/logger'),
	SassDoclet = require('./../sassdoclet').SassDoclet;

/**
 * turns filtered comment blocks into sassdoclet
 * @constructor
 */
exports.Maker = function() {

	/* implement base */
	require('./base').workerBase.call(this, { typeName: 'Maker' });

	/**
	 * create sassdoclet
	 * @param {Object} context data - filter obj, callback - callback
	 * @returns {number} - count
	 */
	this.process = function(context) {

		var _self = this;
		var _count = 0,
			_sass_src,
			filter = context.data,
			callback = context.callback;

		while(_sass_src = filter.queue.dequeue()) {
			var sassDoclet = new SassDoclet(_sass_src);

			for(var i=0;i<_sass_src._items.length;i++) {
				sassDoclet.addItem(_sass_src._items[i]);
			}

			if(sassDoclet.validate()) {
				_self.emit(_sd.EVENTS.MAKER_SASSDOCLET_CREATED, sassDoclet);
			}
			_count++;
		}

		log([ _sd.LOGGING.INFO, 'maker', 'sassdoc count', _count]);

		callback(null, _count);
	};
};

/** exports */
exports.Maker.prototype = Object.create( require('events').EventEmitter.prototype );
