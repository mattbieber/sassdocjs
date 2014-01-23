/*global module:false*/
module.exports = function(grunt) {

	grunt.initConfig({
		shell: {
			runtest: {
				options: {                        // Options
					stdout: true
				},
				command: 'mocha'
			}
		},
		jshint: {
			src: ['Gruntfile.js', 'lib/**/*.js'],
			options: {
				node: true,
				curly: true,
				eqeqeq: false,
				smarttabs: true,
				immed: true,
				latedef: false,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					require: true,
					define: true,
					requirejs: true,
					describe: true,
					expect: true,
					it: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'shell']);

};