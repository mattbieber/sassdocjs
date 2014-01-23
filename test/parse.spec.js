/**
 * sassdocjs mocha tests
 */

var _           = require('lodash'),
	_sd         = require('../lib/env/const'),
	fs          = require('fs'),
	util        = require('util'),
	path        = require('path'),
	out         = process.stdout,
	should      = require('should'),
	colors      = require('colors'),
	IO          = require('../lib/env/io'),
	nondest     = require('nondest'),
	exec        = require('child_process').exec;

describe('sassdocjs parse tests', function() {

	var	Parser 		= require('../lib/src/parser').Parser,
		Filter 		= require('../lib/src/filter').Filter,
		Maker 		= require('../lib/src/maker').Maker,
		Worker 		= require('../lib/src/worker').Worker,
		baseclass 	= require('../lib/src/base').workerBase;

	function TestObj(){
		baseclass.call(this, { typeName: 'Test Object' });
	}

	TestObj.prototype = Object.create(baseclass.prototype);

	var fixtures = {};

	/**
	 * add any fixtures here
	 * @type {{filename: string, directory: string, linecount: number, blockcount: number}}
	 */
	fixtures.test01 = {
		filename: 'test/fixtures/test01.scss',
		linecount: 101,
		blockcount: 11,
		varcount: 5,
		nullcount: 1,
		mixincount: 2,
		placeholdercount: 1,
		idcount: 1,
		classcount: 1,
		filtercomments: 19
	};

	fixtures.test02 = {
		filename: 'test/fixtures/test02.scss',
		linecount: 95,
		blockcount: 3
	};

	fixtures.test03 = {
		filename: 'test/fixtures/test03.scss',
		linecount: 95,
		blockcount: 3
	};

	/* ----> change test fixure here <---- */
	var fixture = fixtures.test01,
		_testpath,
		_tempfile,
		result;

	before(function(done) {

		require('../lib/util/hook')(out);
		out.hook('write', function(string, encoding, fd, write) {
			write(string);
		});

		_testpath = fixture.filename.substring(0, fixture.filename.lastIndexOf(('.')));

		console.log('using test path: %s', _testpath.cyan);

		nondest.create(_testpath, {
			filter: /.+(\.scss)$/i
		}).on('available', function(temppath) {
				console.log('avail' + temppath);
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

				_files(temppath)

				result = fileresult.slice(0);
				_tempfile = result[0];
				done();
			}).on('error', function(err) {
				done();
			});
	});

	after(function(done) {
		out.unhook('write');
		IO.cleanUp();
		done();
	});

	beforeEach(function(done){ done(); });

	afterEach(function(done){ done(); });

	/* -- TESTS -- */
	
	/* parser */
	describe('parser', function(){

		var parser;

		before(function(done){
			filename = _tempfile;
			console.log('using temp file: %s', filename.cyan);
			parser = new Parser();

			parser.process({
                data: filename,
                callback: function(){
	                debugger;
                    result = arguments[1];
	                done();
                }
            });

		});

		after(function(done){
			// uncomment to create test spec data
			var testdata = {
				items: result.queue.items(),
				buffer: result.buffer
			};
			IO.saveJson(path.join(_testpath, 'test-parser.json'), testdata);

			done();
		});

		 it('should', function(done) {
		 	done();
		 });

		it(util.format('should have parsed %d lines', fixture.linecount), function(done) {
           result.context.linecount.should.equal(fixture.linecount);
			done();
		});

		it(util.format('should have found %d doc comment blocks', fixture.blockcount), function(done) {
			result.queue.items().length.should.equal(fixture.blockcount);
			done();
		});
	});

	/* filter */
	describe('filter', function(){

		var filter
		var _result;

		before(function(done){

			filter = new Filter();
			filename = path.join(_testpath, 'test-parser.json');
			console.log('using temp file: %s', filename.cyan);

			var test_obj = new TestObj();

			fs.readFile(filename, 'utf8', function (err, data) {
				if (err) {
					throw(err);
					return;
				}

				var _data = JSON.parse(data);

				_.each(_data.items, function(item){
					test_obj.queue.enqueue(item);
				});

				test_obj.buffer = _data.buffer;
				filter.process({
					data: test_obj,
					callback: function(){
						_result = arguments[1];
						result = [];
						_.each(_result.queue.items(), function(item){
							var ln = item._lineno,
							kind = item._kind;
							result.push({ line: ln, type: kind });
						});

						done();
					}
				});
			});
		});

		after(function(done){
			//uncomment to create test spec data
			// var testdata = {
			// 	items: _result.queue.items(),
			// 	buffer: _result.buffer
			// };
			// IO.saveJson(path.join(_testpath, 'test-filter.json'), testdata);

			done();
		});

			
		it(util.format('should have found %d doc comment blocks', fixture.blockcount), function(done) {
			
			Object.keys(result).length.should.equal(fixture.blockcount);
			done();
		});
		it(util.format('should have found %d doc comment  of type $var', fixture.varcount), function(done) {
			
			_.where(result, { type: 'var' }).length.should.equal(fixture.varcount);
			done();
		});

		it(util.format('should have found %d doc comment  of type @mixin', fixture.mixincount), function(done) {
			
			_.where(result, { type: 'mixin' }).length.should.equal(fixture.mixincount);
			done();
		});
		
		it(util.format('should have found %d doc comment  of type %placeholder', fixture.placeholdercount), function(done) {
			
			_.where(result, { type: 'placeholder' }).length.should.equal(fixture.placeholdercount);
			done();
		});
		
		it(util.format('should have found %d doc comment  of type #id', fixture.idcount), function(done) {
			
			_.where(result, { type: 'id' }).length.should.equal(fixture.idcount);
			done();
		});

		it(util.format('should have found %d doc comment  of type .class', fixture.classcount), function(done) {
			
			_.where(result, { type: 'class' }).length.should.equal(fixture.classcount);
			done();
		});

		it(util.format('should have found %d doc comment  of type @module (null)', fixture.nullcount), function(done) {
			
			_.where(result, { type: null }).length.should.equal(fixture.nullcount);
			done();
		});
	});

	/* maker */
	describe('maker', function(){

		var maker,
			count = 0;

		before(function(done){

			maker = new Maker()
				.on(_sd.EVENTS.MAKER_SASSDOCLET_CREATED, function(sassdoclet){
					//IO.saveJson(path.join(_testpath, 'test-worker-' + ++count + '.json'), sassdoclet);
				});

			filename = path.join(_testpath, 'test-filter.json');
			console.log('using %s', filename.cyan);

			var test_obj = new TestObj();

			fs.readFile(filename, 'utf8', function (err, data) {
				if (err) {
					throw(err);
					return;
				}

				var _data = JSON.parse(data);

				_.each(_data.items, function(item){
					test_obj.queue.enqueue(item);
				});

				maker.process({
					data: test_obj,
					callback: function(obj, count){
						result = count;
						done();
					}
				});
			});
		});

		it(util.format('should have created %d sass doclets', fixture.blockcount), function(done) {
			result.should.equal(fixture.blockcount);
			done();
		});
	});

	/* worker */
	describe('worker', function(){

		var worker;

		before(function(done){

			worker = new Worker()

				.on(_sd.EVENTS.WORKER_COMPLETED, function() {

					result = this;
					//IO.saveJson(path.join(_testpath, 'test-worker.json'), result);
					done();
				});

			filename = _tempfile;
			console.log('using %s', filename.cyan);

			worker.process(filename);
		});


		it(util.format('should have %d parsedComments', fixture.blockcount), function(done) {
			result.parsedComments.should.equal(fixture.blockcount);
			done();
		});

		it(util.format('should have %d filteredComments', fixture.filteredComments), function(done) {
			result.filteredComments.should.equal(fixture.filtercomments);
			done();
		});

		it(util.format('should have sassdocCount of %d', fixture.blockcount), function(done) {
			result.sassdocCount.should.equal(fixture.blockcount);
			done();
		});
	});

});