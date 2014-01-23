/**
 * Logging module
 *
 * @module lib/util/logger
 * @implements EventEmitter
 */

var _       = require('lodash'),
	_sd     = require('../env/const'),
	fs      = require('fs'),
	path    = require('path'),
	util    = require('util'),
	colors  = require('colors'),
	events  = require('events').EventEmitter;

var _LOG = {
	LEVEL: 0,
	EMITTER: 1,
	MESSAGE: 2,
	FATAL: 3,
	STACK: 4,
	ARGS: 5
};

/**
 * helper to write any queued logitems
 */
function drain_buffer() {
	while(this.log_buffer.length > 0) {
		var logitem = this.log_buffer.shift();
		this.write(logitem);
	}
}

/**
 * helper to construct log data		
 * @param  {object} data 
 * @return {object} loglevel, string message
 */
function make_logitem(data) {

	var loglevel = data[_LOG.LEVEL][1],
		loglevel_val = data[_LOG.LEVEL][0],
		emitter = data[_LOG.EMITTER],
		message = data[_LOG.MESSAGE],
		outlevel =  '';

	switch(data[_LOG.LEVEL][0]) {
		case _sd.LOGGING.ERROR[0]:
			outlevel = loglevel.toString().red;
			break;
		case _sd.LOGGING.INFO[0]:
			outlevel = loglevel.toString().cyan;
			break;
		case _sd.LOGGING.SUCCESS[0]:
			outlevel = loglevel.toString().green;
			break;
		case _sd.LOGGING.FAILURE[0]:
		case _sd.LOGGING.WARN[0]:
			outlevel = loglevel.toString().yellow;
			break;
	}

	var _out = util.format('%s %s - %s', outlevel, emitter.grey, message);

	if(data.length === 6) {
		var arg = data[_LOG.ARGS];
		if(arg) {
			_out += '\nInfo:\n'.green;
			Object.keys(arg).forEach(function(k){
				 _out += k + ':' + arg[k];
			});

		  _out += '\n';
		}
	}

	if(data.length > 4) {
		var stk = data[_LOG.STACK];
		if(stk instanceof Array) { stk = stk.join('\n'); }
		_out += '\nStack:\n'.green;
		_out += stk;

	}


	return { level: loglevel_val, message: _out };
}

/**
 * Module to write to stdout & optional log file
 * @constructor
 */
function Logger() {

	var _self = this;

	this.stream = null;
	this.env = null;
	this.log_buffer = [];
	this.ready = false;
	this.loglevel = 2;

	/* dequeue all buffered stuff */
	require('../util/notifier').on(_sd.EVENTS.ENV_READY, function(obj){
		_self.env = require('../env/context');
		_self.loglevel = _self.env.runenv[_sd.ENV.VERBOSITY].value;
		_self.ready = true;

		drain_buffer.call(_self);
	});

	/**
	 * write out if within log level
	 * @param logitem {object} - loglevel, string message
	 */
	this.write = function(logitem) {
		if(_self.loglevel >= logitem.level) {
			console.log(logitem.message);
	//	if(_self.env.runenv[_sd.ENV.LOG].value) { _self.stream.write(logitem.message); }
		}
	};

	/**
	 * Logging event handler
	 * data: log level, emitter, message, obj aray
	 */
	this.on(_sd.EVENTS.LOG_FIRED, function(data) {

		if(!(data instanceof Array)) { return false; }
		var logitem = make_logitem(data);

		/* buffer until ready */
		if(!_self.ready) { _self.log_buffer.push(logitem); } 
		else { this.write(logitem); }
	});

	/**
	 * exported fn
	 * @param data
	 */
	this.log = function(data) {
		_self.emit(_sd.EVENTS.LOG_FIRED, data);
	};

	process.on('exit', function() {
		if(!process.silent) { drain_buffer.call(_self); }

	});

	events.call(this);
}

util.inherits(Logger, events);

/**
 * @exports Logger.log
 */
module.exports = new Logger().log;


