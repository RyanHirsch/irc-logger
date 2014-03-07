module.exports = function(grunt) {
    // Add the grunt-mocha-test tasks.
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    growl: true
                },
                src: ['test/**/*-test.js']
            }
        },
        watch: {
            test: {
                files: ['**/*.js', '!node_modules/**'],
                tasks: ['mochaTest']
            },
            jshint: {
                files: ['**/*.js', '!node_modules/**'],
                tasks: ['jshint']
            }
        },
        jshint: {
            all: ['**/*.js', '!node_modules/**']
        }
    });

    grunt.registerTask('default', ['jshint' ,'mochaTest', 'watch']);

};