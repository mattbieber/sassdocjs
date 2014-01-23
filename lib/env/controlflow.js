/**
 * Control flow module for worker processes
 *
 * inspiration: http://book.mixu.net/node/ch7.html
 * @module lib/env/controlflow
 */

/**
 * Iterate over tasks until completed
 *
 * @param {object[]} tasks
 * @param {object} iterator obj
 * @param callback
 */
function _go(data, iterator, callback) {
	callback = callback || function () {};

	if (!data.length) { return callback(); }

	var completed = 0;
	var iterate = function () {
		iterator(data[completed], function (err) {
			if (err) {
				callback(err);
				callback = function () {};
			}
			else {
				completed += 1;
				if (completed >= data.length) { callback(null); }
				else { iterate(); }
			}
		});
	};
	iterate();
}

/**
 * private iterator
 * @param {object[]} tasks to perform
 * @returns {object} callback function
 */
var _iterator = function (tasks) {
	var makeCallback = function (index) {
		var fn = function () {
			if (tasks.length) {
				tasks[index].apply(null, arguments);
			}
			return fn.next();
		};
		fn.next = function () {
			return (index < tasks.length - 1) ? makeCallback(index + 1): null;
		};
		return fn;
	};
	return makeCallback(0);
};

/** exports */
exports.Flow = function() { };

/**
 * exports - linear
 * chained flow tasks
 *
 * @param {object[]} tasks to perform
 * @returns {object} results through callback function
 */
exports.Flow.prototype.linear = function(tasks, callback) {
	callback = callback || function () {};

	var results = {};
	_go(Object.keys(tasks), function (k, callback) {
		tasks[k](function (err) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (args.length <= 1) {
				args = args[0];
			}
			results[k] = args;
			callback(err);
		});
	}, function (err) {
		callback(err, results);
	});

};

/**
 * exports - sequence
 * sequential flow tasks
 *
 * @param {object[]} tasks to perform
 * @returns {object} results through callback function
 */
exports.Flow.prototype.sequence = function (tasks, callback) {
	callback = callback || function () {};

	if (tasks.constructor !== Array) {
		var err = new Error('');
		return callback(err);
	}
	if (!tasks.length) {
		return callback();
	}
	var tmp_iterator = function (iterator) {
		return function (err) {
			if (err) {
				callback.apply(null, arguments);
				callback = function () {};
			}
			else {
				var args = Array.prototype.slice.call(arguments, 1);
				var next = iterator.next();
				if (next) {
					args.push(tmp_iterator(next));
				}
				else {
					args.push(callback);
				}
				setImmediate(function () {
					iterator.apply(null, args);
				});
			}
		};
	};
	tmp_iterator(_iterator(tasks))();
};



