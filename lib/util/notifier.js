/**
 * Generic event emitter
 *
 * @module lib/util/notifier
 * @implements EventEmitter
 */
var events = require('events').EventEmitter;

/**
 * @constructor
 */
function Notifier() {
	var _self = this;
	events.call(this);

	this.notify = function(n) {
		_self.emit(n);
	};
}

require('util').inherits(Notifier, events);

/**
 * exports
 */
module.exports = new Notifier();