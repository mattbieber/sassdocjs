/**
 * template build config
 */

module.exports = function(grunt) {

	grunt.initConfig({
		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'sass',
					src: ['*.scss'],
					dest: 'css',
					ext: '.css'
				}]
			}
		},
		copy: {
			build: {
				cwd: './',
				src: [ 'css/**/*', 'fonts/*', 'images/*', 'js/**/*', 'lib/**/*', '*.md', 'index.html' ],
				dest: 'build',
				expand: true,
				mode: 0777

			}
		},
		clean: {
			build: {
				src: [ 'build' ]
			}
		},
		chmod: {
			options: {
				mode: '777'
			},
			target: {
				src: ['build/**/*']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-chmod');

	grunt.registerTask(
		'build',
		'Compiles all of the assets and copies the files to the build directory.',
		[ 'clean', 'sass', 'copy', 'chmod' ]
	);
};