 /**
 * Parser module
 *
 * @module lib/src/parser
 * implements EventEmitter
 *
 *  emits:
 *  + PARSER_COMMENT_FOUND
 *  + PARSER_COMPLETE
 */

var _ = require('lodash'),
	_sd = require('../env/const'),
	_error = require('../util/errorhandler'),
	fs = require('fs'),
	path = require('path'),
	util = require('util'),
	log = require('../util/logger'),
	readline = require('readline'),
	stream = require('stream');

/**
 * Parses a file for comment blocks
 * @constructor
 */
exports.Parser = function() {

	var _self = this;

	/* implement base */
	require('./base').workerBase.call(this, { typeName: 'Parser' });

	this.processingFilename = null;

	/**
	 * process a file sassfor doc comments
	 * @param context - the filename to process, callback
	 * @returns {Object} - self via callback
	 */
	this.process = function(context) {

		var _self = this;
		var env = require('../env/context'),
			callback = context.callback;
		var filename =
			this.processingFilename = context.data;

		/* append trailing \n to document for reading */
		fs.appendFileSync(filename, '\n', 'utf-8', function (err) {
			if (err) { throw err; }
		});

		var readstream = fs.createReadStream(filename);
		var writestream = new stream();
		readstream.readable = true;
		writestream.writable = true;

		var lineno = 0;
		try {
			var rl = readline.createInterface({
				input: readstream,
				output: writestream,
				terminal: false

			/* on line */
			}).on('line',function (line) {
				_self.buffer.push(line);

			/* on close */
			}).on('close', function () {

				var block_buffer = [];
				
				var _head,
					_tail;
					_tail = _head = false;

				while(!_tail) {
					var _line = _.last(_self.buffer);
					if(_line === '') {
						_self.buffer.pop();
					} else {
						_tail = true;	
						continue;
					}
				}

				while(!_head) {
					var _headline = _.first(_self.buffer);
					if(_headline === '') {
						_self.buffer.shift();
					} else {
						_head = true;	
						continue;
					}
				}

				_.each(_self.buffer, function(item, index){
					var cleanline = item.trim();
					_self.add(index, cleanline);
				});

				_self.context.linecount = Object.keys(_self.items).length;
				log([ _sd.LOGGING.INFO, 'parser.js', 'read lines', filename, _self.context.linecount ]);

				_.each(_.values(_self.items), function(line, index) {

					var unbuffered_line = true;

					/* find comment start */
					var start = _sd.REGEX.DOCBLOCK_START.exec(line);
					if (start != null && block_buffer.length === 0) {
						block_buffer.push(line.replace(_sd.REGEX.DOCBLOCK_START, _sd.STRINGS.EMPTY_SPACE));
						unbuffered_line = false;
					}

					/* find document end */
					var end = _sd.REGEX.DOCBLOCK_END.exec(line);
					if (end != null && block_buffer.length > 0) {
						block_buffer[block_buffer.length-1] = block_buffer[block_buffer.length-1].replace(_sd.REGEX.DOCBLOCK_END, _sd.STRINGS.EMPTY_SPACE);
						
						_self.queue.enqueue({

							filename: path.basename(filename),
							lineno: index+2,
							data: block_buffer.slice(0) });

						_self.emit(_sd.EVENTS.PARSER_COMMENT_FOUND);
						block_buffer.length = 0;
						return 1;
					}

					/* push inner comment line */
					if (block_buffer.length > 0 && unbuffered_line) {
						block_buffer.push(line.replace(_sd.REGEX.STARS, _sd.STRINGS.EMPTY_SPACE));
					}
				});

				_self.emit(_sd.EVENTS.PARSER_COMPLETE);
				log([ _sd.LOGGING.INFO, 'parser', 'comment blocks found', _self.queue.getLength() ]);

				callback(null, _self);
			});

		} catch (e) {
			_error({
				message: 'parser error',
				infile: 'parser.js',
				fatal: false,
				err: e,
				args: { 'path' : filename }
			});
		}
	};
};

/** exports */
exports.Parser.prototype = Object.create( require('events').EventEmitter.prototype );


