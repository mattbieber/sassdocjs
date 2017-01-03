/**
 * - copy template dir & file to destination
 * - tests
 * - multiple src files
 * - strip out comments
 *
 * @project sassdocjs
 * @author Matt Bieber <matt@daftscholars.com>
 * @license MIT - LICENSE.md file included in this distribution.
 */

/** hook into stacktrace creation */
Error.prepareStackTrace = function(e, stack) { return stack; };

require('./env/runtime');

var _           = require('lodash'),
    _sd         = require('./env/const'),
    fs          = require('fs'),
    path        = require('path'),
    util        = require('util'),
    env         = require('./env/context'),
    notifier    = require('./util/notifier'),
    log         = require('./util/logger');

var processor = require('./src/processor.js')
    .on(_sd.EVENTS.PROCESSOR_COMPLETE, function() {

        var projectData = {
            readme: null,
            projinfo: env.projinfo(),
            datainfo: this.items
        };

        var _io = require('./env/io');
        _io.getProjectReadme(env.fileparams[_sd.ENV.PATH_INPUT], function(err, data){

            if(data) {
                data = data.toString('utf-8');
                var html = require('marked')(data);
                projectData.readme = html;
            }

            log([_sd.LOGGING.INFO, 'main.js', 'processor complete count', _.keys(projectData.datainfo).length]);
            _io.saveProject(env.fileparams[_sd.ENV.PATH_OUTPUT], projectData, env.fileparams[_sd.ENV.PATH_TEMPLATE].value);

            if(env.runenv[_sd.ENV.SAVE_CONFIG].value) {
                var yamlpath = path.join(path.resolve(env.fileparams[_sd.ENV.PATH_INPUT]), 'sassdocjs.yml');
                var yamldata = env.serialize();

                _io.saveYaml(yamlpath,yamldata);

            }

        });
    });


/**
 * - main
 *
 * + block until context (app config) is loaded
 * + retrieve source files
 * + pass off to processor
 */
var main = function() {

    var _self = this;

    try
    {
        notifier.notify(_sd.EVENTS.ENV_READY, env);

        require('./env/io').getSourceFiles(env, function(err, files) {
            if(err) { throw err; }
            env.files.source = files;
            _.each(env.files.source, function(filename){ processor.process(filename); });
        });
    }
    catch(e)
    {
        require('./util/errorhandler')({
            message: 'error in main',
            infile: 'main.js',
            fatal: false,
            err: e
        });
    }
};

/** exports */
module.exports = main;
