/*
 * cp.js
 * @module cp
 */


var fs = require('fs'),
	util = require('util'),
	path = require('path'),
	os = require('os'),
	Domain = require('domain');

var WORKER_COUNT = 0,
	WORKER_DONE  = 0;

var _options = {
	id: '',
	limit: 12,
	verify: false,
	orgpath: null,
	destpath: null
};

var _context,
	domain = Domain.create();

/**
 * handle localized errors
 */
domain.on('error', function(err){
	_error(err);
});

/**
 * emit error
 * @param  {Error} err error
 */
var _error = function(err) {
	_context.emit('error',
		new Error(util.format('error @ line %d - %s', err.lineNumber, err.message)));
};

/**
 * deferr execution if limit met
 * @param  {function} fn the func to defer
 */
var _deferred = function(fn) {
	if (typeof(setImmediate) === 'function') { return setImmediate(fn); }
	return process.nextTick(fn);
};


/**
 * get expected file count
 * @param  {string} pathname
 */
var _pre = function(pathname) {
	domain.run(function(){
		try {
			var files = fs.readdirSync(pathname);
			_context.found += files.length;

			files.forEach(function(f){
				var name = path.join(pathname, f);
				if(fs.statSync(name).isDirectory()){ _pre(name); }
			});
		}
		catch(err) { _error(err); }
	});
};

/**
 * recursively copy the filepath to temp
 * @param {string} pathname
 */
var _process = function(pathname) {
	domain.run(function(){

		if(/(^\.)/.test(path.basename(pathname))) {
			return;
		}

		if(WORKER_COUNT >= _options.limit) {
			return _deferred(function() { _process(pathname); });
		}

		WORKER_COUNT++;

		fs.lstat(pathname, function(err, stats) {

			if(err) { throw err; }
			var tmpname = pathname.replace(_options.orgpath, _options.destpath);

			/* directory */
			if(stats.isDirectory()) {
				fs.mkdir(tmpname, function(err) {
					if(err) {
						if(err.code === 'EEXIST') { }
						else {
							throw err;
						}
					}

					fs.readdir(pathname, function(err, items) {
						if(err) { throw(err); }
						items.forEach(function (subitem) {
							_process.call(this, (path.join(pathname, subitem)));
						});
					});
				});

				_complete(tmpname);
				return;
			}

			/* file */
			if(stats.isFile()) {

				var rds = fs.createReadStream(pathname),
					wts = fs.createWriteStream(tmpname, { mode: stats.mode });

					rds.pipe(wts);
					wts.once('finish', function() {
						_complete(tmpname);
						return;
					});
				} else {
					_context.skipped++;
					_complete(tmpname);
					return;
			}

			/* symlink */
			if(stats.isSymbolicLink()) {
				fs.readlink(pathname, function(err, linkpath) {
					if(err) { throw(err); }
					fs.symlink(linkpath, tmpname);
				});

				_complete(tmpname);
				return;
			}
		});

	});
};

/**
 * path item completed
 * @param {string} pathname
 */
var _complete = function(pathname) {

	_context.done++;

	WORKER_DONE++;
	WORKER_COUNT--;

	if(WORKER_DONE == _context.found) {
		_context.emit('finished', _options.destpath);
		return;
	}
};

/**
 * ----------------------------------------------------
 * Cp obj
 */
var Cp = function() {

	_context = this;
	this.found = this.done = this.verify_count = this.skipped = 0;

	domain.run(function() {
		var _self = _context;

		_self.on('finished', function() {
			_context.emit('available', _options.destpath);
		});
	});

	/**
	 * copy
	 * @param  {string} filepath
	 * @param  {string} destpath
	 */
	this.copy = function(filepath, destpath) {
		domain.run(function() {

			if(!filepath) { throw new Error('filepath required for nondest create'); }

			_options.orgpath  = path.resolve(filepath);
			_options.destpath = path.resolve(destpath);

			_pre(filepath);
			_process(filepath);
		});

		return this;
	};

};

/**
 * eventemitter
 */
Cp.prototype = Object.create( require('events').EventEmitter.prototype );

/** exports */
module.exports = new Cp();
