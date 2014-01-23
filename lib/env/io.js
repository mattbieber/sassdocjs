/**
 I/O related helper functions
 @module lib/env/io
 */

var _ = require('lodash'),
	_sd = require('./const'),
	_error = require('../util/errorhandler'),
	fs = require('fs'),
	path = require('path'),
	nondest = require('nondest'),
	yamlconf = require('yaml-config'),
	log = require('../util/logger');

var temppath;

function _makedir(filepath, result) {

	result = result ? result : null;

	try {
		fs.mkdirSync(filepath);
		result = result || filepath;
	}
	catch (err) {
		switch(err.code) {
			case 'ENOENT':
				result = _makedir(path.dirname(filepath), result);
				_makedir(filepath, result);
				break;
			case 'EISDIR':
				break;
			case 'EEXIST':
				result = filepath;
				break;
			default:
				var _stat;
				try { _stat = fs.statSync(filepath); }
				catch (err) {
					_error({
						message: 'error calling stat _makedir',
						infile: 'io.js',
						fatal: true,
						err: err,
						args: { 'path' : filepath }
					});
				}
				if (!_stat.isDirectory()) {
					_error({
						message: 'path exists & not a directory',
						infile: 'io.js',
						fatal: true,
						err: err,
						args: { 'path' : filepath }
					});
				}
		}
	}

	return result;
}


/**
 * Load defaults from sassdocjs.yml
 *
 * @param {string} filepath - path to source
 * @param {object} callback - completion callback
 * @returns {object} - yaml config data
 */
exports.getEnvironmentFile = function(filepath, callback) {

	callback = callback || function () {};
	if(!filepath) { return false; }

	var data = null,
		err = null,
		success = true,
		configpath = path.join(filepath, 'sassdocjs.yml');

	try {
		if(fs.existsSync(configpath)) {
			data = yamlconf.readConfig(configpath);
		} else {
			log([ _sd.LOGGING.WARN, 'io.js', 'no yaml config file found', filepath]);
			success = false;
		}
	} catch(e) {
		err = e;
	}
	callback(err, data);

	return success;
};

/**
 * Load defaults from sassdocjs.yml
 *
 * @param {string} filepath - path to source
 * @param {object} callback - completion callback
 * @returns {object} - yaml config data
 */
exports.getProjectReadme = function(filepath, callback) {

	callback = callback || function () {};
	if(!filepath) { return false; }

	var data = null,
		err = null,
		success = true,
		configpath = path.join(filepath, 'readme.md');

	try {
		if(fs.existsSync(configpath)) {
			data = fs.readFileSync(configpath);
		} else {
			log([ _sd.LOGGING.WARN, 'io.js', 'no README.md config file found', filepath]);
			success = false;
		}
	} catch(e) {
		err = e;
	}
	callback(err, data);

	return success;
};

/**
 * Find files matching include / exlude filters & recursion specificity.
 *
 * - deep copy directory to work from
 * @param {object} env - app config environment.
 * @param {object} callback - completion callback
 * @returns {string[]} file list through callback
 */
exports.getSourceFiles = function(env, callback) {

    callback = callback || function () {};

	var userpath = path.resolve(env.fileparams[_sd.ENV.PATH_INPUT]),
		err = null,
		result = null;

	nondest.create(userpath, { 
		filter: /.+(\.scss)$/i
	}).on('available', function(temppath) {

		var fileresult = [];
		function _files(pathname) {	
			try {
				var files = fs.readdirSync(pathname);

				files.forEach(function(f){
					var name = path.join(temppath, f),
						stats = fs.statSync(name);
					
					if(stats.isDirectory()){ _files(name); }
					if(stats.isFile()){ fileresult.push(name); }
				});
			}
			catch(err) {
				_error(err);
			}
		}

		_files(temppath);
		result = fileresult.slice(0);

		log([ _sd.LOGGING.INFO, 'io.js', 'found sass source count', result.length, userpath]);
		callback(err, result);

	}).on('error', function(err) {
		callback(err, result);
	});
};

/**
 * Load language definition files
 *
 * @param {string} filepath - path to source
 * @param {object} callback - completion callback
 * @returns {object} - yaml config data
 */
exports.getDefinitions = function(filepath, callback) {
	callback = callback || function () {};
	var src = path.join(__dirname, '../lang/defs'),
		err = null,
		result = null;

	try {

		var filters = ['^def_.*\\.js$'],
			files = fs.readdirSync(src);

		/* INCLUDE */
		var regexInclude = [];

		if(typeof(filters) === 'string') { filters = [filters]; }

		filters.forEach(function(filter) {
			if(filter.length > 0) { regexInclude.push(new RegExp(filter)); }
		});

		var length = regexInclude.length;

		files = files.filter(function(filename) {

			var filepathname = path.join(src, filename);
			if(fs.statSync(filepathname).isDirectory()) { return 0; }

			for(var i=0;i<length;i+=1) {
				if(regexInclude[i].test(filename)) { return 1; }
			}
			return 0;
		});

		result = files;
		log([ _sd.LOGGING.INFO, 'io.js', 'found def file count', result.length, src]);

	}
	catch(e) { err = e; }

	callback(err, result);
};

/**
 * Save json parse results for tests
 *
 * @param {string} filepath - path to source
 * @param {object} data - data to save
 */
exports.saveJson = function(filepath, data) {
	fs.writeFile(filepath, JSON.stringify(data, null, 4), function(err) {
		if(err) {
			_error({
				message: 'error saving doc json',
				infile: 'io.js',
				fatal: true,
				err: err,
				args: { 'path' : filepath }
			});

		} else {
			log([_sd.LOGGING.SUCCESS, 'io.js', 'json saved', filepath]);
		}

	});
};

/**
 * Save json parse results for tests
 *
 * @param {string} filepath - path to source
 * @param {object} data - data to save
 */
exports.saveYaml = function(filepath, data) {

	var d = require('js-yaml').dump(data, { indent:2 });
	fs.writeFile(filepath, d, function(err) {
		if(err) {

			_error({
				message: 'error saving doc yaml',
				infile: 'io.js',
				fatal: false,
				err: err,
				args: { 'path' : filepath }
			});

		} else {
			log([_sd.LOGGING.SUCCESS, 'io.js', 'yaml saved', filepath]);
		}

	});
};


/**
 * Save project data file
 *
 * @param {string} filepath - path to source
 * @param {object} data - data to save
 */
exports.saveProject = function(p, data, tmpl) {
	var fp = _makedir(p);
	var filepath = path.join(fp, 'sassdocjs-data.js');
	var stream = fs.createWriteStream(filepath, { 'flags': 'w', mode: '0777' });

	stream.on('open', function(fd) {
		stream.write('define({\n\tproject: ' + JSON.stringify(data.projinfo), null, 4);
		stream.write(',\n\tdata: ' + JSON.stringify(_.toArray(data.datainfo), null, 4));
		stream.write(',\n\treadme: ' + JSON.stringify(data.readme), null, 4);
		stream.end('\n});');
	});

	stream.on('error', function(err) {
		if(err) {
			_error({
				message: 'error saving doc project file',
				infile: 'io.js',
				fatal: true,
				err: err,
				args: { 'path' : filepath }
			});

		}
	}).on('finish', function(){
			require('../util/cp').copy(tmpl, fp)
				.on('available', function(projpath) {
					log([_sd.LOGGING.SUCCESS, 'io.js', 'project saved', projpath]);
				});
	});
};

/**
 * Remove temp directory
 */
exports.cleanUp = function() {

	nondest.remove(function(e) {
		if(e) {
			_error({
				message: 'error removing temp directory',
				infile: 'io.js',
				fatal: false,
				err: e,
				args: { 'path' : temppath }
			});
		}
	});
	
};
