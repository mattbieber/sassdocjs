/**
 *  Global app config
 *  @module lib/env/context
 *
 *  emits:
 *     + ENV_READY
 */

var __SASSDOCJS_VERSION = '0.0.1';

var _           = require('lodash'),
	_sd         = require('./const'),
	path        = require('path'),
	util        = require('util'),
	semver      = require('semver'),
	IO          = require('./io'),
	log         = require('../util/logger');

/**
 * object containing app & environment data
 */
var _env = {

	/**
	 * runtime related data
	 * @memberof env
	 */
	runenv: {
		start: new Date(),
		status: false,
		finish: null

	},

	/**
	 * file related environment data
	 * @memberof env
	 */
	fileparams: {},

	/**
	 * file data
	 * @memberof env
	 */
	files: {},

	/**
	 * project info settings - name, desctiption, etc
	 * @memberof env
	 */
	project: {},

	/**
	 * version of app used to build project
	 * @memberof env
	 */
	version: null,

	/**
	 * helper info
	 * @returns {object} project info
	 */
	projinfo: function() {

		return {
			name: this.project[_sd.ENV.PROJ_NAME].value,
			logo: this.project[_sd.ENV.PROJ_LOGO].value,
			description: this.project[_sd.ENV.PROJ_DESC].value,
			version: this.project[_sd.ENV.PROJ_VERSION].value,
			authors: this.project[_sd.ENV.PROJ_AUTHORS].value.split(','),
			contributors: this.project[_sd.ENV.PROJ_CONTRIB].value.split(','),
			status: this.project[_sd.ENV.PROJ_STATUS].value,
			created: new Date(),
			sassdocjs_version: __SASSDOCJS_VERSION
		};
	}
};

/**
 * Configure environment object, sourced from
 * defaults, yaml config, command line args
 *
 * @param {object} env
 */
function get_context(env) {

	var _self = this;
	var _cwd = process.cwd();

	this._config = {};

	/**
	 * helper to assign config item
	 * @param alias
	 * @param demand
	 * @param prop
	 * @param def
	 * @param desc
	 * @private
	 */
	var _assign = function(alias, demand, prop, val, desc) {
		this[prop] = {
			demand: demand, alias: alias, describe: desc, default: val
		};
	};

	/* defaults */
	(function(c){
		c.project = {};
		c.fileparams = {};
		c.runenv = {};

		var undef;

		_assign.call(c.project,     'name',         undef, _sd.ENV.PROJ_NAME,      'Untitled',      'name of the project');
		_assign.call(c.project,     'logo',         undef, _sd.ENV.PROJ_LOGO,      '',              'logo file url to appear in documentation header');
		_assign.call(c.project,     'desc',         undef, _sd.ENV.PROJ_DESC,      '',              'project description');
		_assign.call(c.project,     'version',      undef, _sd.ENV.PROJ_VERSION,   '0.0.1',         'version of the documentation');
		_assign.call(c.project,     'authors',      undef, _sd.ENV.PROJ_AUTHORS,   '',              'project author(s)');
		_assign.call(c.project,     'contrib',      undef, _sd.ENV.PROJ_CONTRIB,   '',              'project contributors');
		_assign.call(c.project,     'status',       undef, _sd.ENV.PROJ_STATUS,    '',              'project status');
		_assign.call(c.fileparams,  'exclude',      false, _sd.ENV.FILTER_EXCLUDE, [],              'file pattern for exclusion');
		_assign.call(c.fileparams,  'include',      false, _sd.ENV.FILTER_INCLUDE, ['.*\\.scss$'],  'file pattern for inclusion');
		_assign.call(c.fileparams,  'out',          false, _sd.ENV.PATH_DEST,      path.join(_cwd,  '../doc'), 'output directory for sass documentation');
		_assign.call(c.fileparams,  'templ',        false, _sd.ENV.PATH_TEMPLATE,  path.join(__dirname,       '../../template/build/'), 'path to output template directory');
		_assign.call(c.fileparams,  'recurse',      false, _sd.ENV.RECURSIVE,      false,           'recurse working directory for sass sources');
		_assign.call(c.runenv,      'prefix',       false, _sd.ENV.PREFIXED,       false,           'categorize by prefix (e.g. m- = module)');
		_assign.call(c.runenv,      'log',          false, _sd.ENV.LOG,            false,           'toggle logging');
		_assign.call(c.runenv,      'verbose',      false, _sd.ENV.VERBOSITY,      1,               'logging verbosity');
		_assign.call(c.runenv,      'config',       false, _sd.ENV.SAVE_CONFIG,    false,           'save .yml config file in working directory');
		_assign.call(c.runenv,      'limit',        false, _sd.ENV.WORKER_LIMIT,   4,               'set the allowed file parsing concurrencey');

	}(this._config));

	var _ops = {};
	var _sourcedir = _cwd;

	if(process.argv[2] && process.argv[2].charAt(0) != '-') {

		_sourcedir = path.resolve(process.argv[2]);
	}

	/* yml file */
	this._havefile = IO.getEnvironmentFile(_sourcedir, function(err, obj){

		if(err) { throw err; }

		if(obj && obj.project) {
			_.each(_self._config.project, function(item) {
				if(obj.project.hasOwnProperty(item.alias)) {
					item.default = obj.project[item.alias];
				}
			});
		}

		if(obj && obj.files) {
			_.each(_self._config.fileparams, function(item) {

				if(obj.files.hasOwnProperty(item.alias)) {
					item.default = obj.files[item.alias];
				}
			});
		}

		if(obj && obj.run) {
			_.each(_self._config.runenv, function(item) {
				if(obj.run.hasOwnProperty(item.alias)) {
					item.default = obj.run[item.alias];
				}
			});
		}

		_.defaults(_ops, _self._config.project, _self._config.fileparams, _self._config.runenv, { h: { alias: 'help', default:'', demand:false, describe:'show sassdocjs usage options' }} );

		/* command line */
		var optimist = require('optimist')
			.usage('Create documentation from Sass source files.\nUsage: sassdocjs [path] [options]')
			.options(_ops);

		_self._argv = optimist.argv;
		process.silent = false;

		if (_self._argv.help) {
			process.silent = true;
			optimist.showHelp();
			process.exit(0);
		}


		/* set config data in order of precedence: 1) argv 2) yaml 3) defaults */
		_.each(Object.keys(_self._config), function(key) {

			var propnames = Object.keys(_self._config[key]);

			for(var i=0;i<propnames.length;i++) {
				var obj = _self._config[key][propnames[i]];
			    obj.value = _self._argv[propnames[i]];
			}

		});


	});
	env.fileparams = this._config.fileparams;
	env.fileparams[_sd.ENV.PATH_INPUT] = _sourcedir;
	env.fileparams[_sd.ENV.PATH_OUTPUT] = path.resolve(this._config.fileparams[_sd.ENV.PATH_DEST].value);

	env.project = this._config.project;
	_.defaults(env.runenv, this._config.runenv);

	var _sassdoc_version = require('../../package.json').version;
	env.version = _sassdoc_version;

	env.serialize = function() {
		var _this = this;


		var _ex = _this.fileparams[_sd.ENV.FILTER_EXCLUDE].value,
			_in = _this.fileparams[_sd.ENV.FILTER_INCLUDE].value;

		if(Object.prototype.toString.call(_ex) === '[object Array]') {
			_ex = _ex.join(',');
		}

		if(Object.prototype.toString.call(_in) === '[object Array]') {
			_in = _in.join(',');
		}


		return {
			default: {
				project: {
					name: _this.project[_sd.ENV.PROJ_NAME].value,
					logo: _this.project[_sd.ENV.PROJ_LOGO].value,
					description: _this.project[_sd.ENV.PROJ_DESC].value,
					version: _this.project[_sd.ENV.PROJ_VERSION].value,
					authors: _this.project[_sd.ENV.PROJ_AUTHORS].value,
					contributors: _this.project[_sd.ENV.PROJ_CONTRIB].value,
					status: _this.project[_sd.ENV.PROJ_STATUS].value
				},
				files: {
					exclude: _ex,
					include: _in,
					out: _this.fileparams[_sd.ENV.PATH_DEST].value,
					templ: _this.fileparams[_sd.ENV.PATH_TEMPLATE].value,
					recurse: _this.fileparams[_sd.ENV.RECURSIVE].value
				},
				run: {
					prefix: _this.runenv[_sd.ENV.PREFIXED].value,
					log: _this.runenv[_sd.ENV.LOG].value,
					verbosity: _this.runenv[_sd.ENV.VERBOSITY].value,
					config: _this.runenv[_sd.ENV.SAVE_CONFIG].value,
					limit: _this.runenv[_sd.ENV.WORKER_LIMIT].value
				}
			}

		};
	};
}

/**
 * exports
 *
 * @param callback - callback function
 * @returns {boolean}
 */

new get_context(_env);
module.exports = _env;