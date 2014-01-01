/* jshint node: true */
module.exports = function (grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            '* <%=pkg.name %> by <%= pkg.author.email %>\n' +
            '* Version : <%= pkg.version %> \n' +
            '* Author : <%= pkg.author.name %> \n' +
            '* Copyright <%= grunt.template.today("yyyy") %>\n' +
            '*/\n',
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            main: {
                src: ['dist/assets/js/*.js'],
                dest: 'dist/assets/js/main.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            main: {
                src: ['<%= concat.main.dest %>'],
                dest: 'dist/assets/js/main.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: 'dist/assets/js/.jshintrc'
            },
            main: {
                src: ['dist/assets/js/*.js']
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['dist-js']
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');


    //grunt.loadNpmTasks('grunt-recess');
    // remove grunt-recess modules. because not supported my code



    // Test task.
    //grunt.registerTask('test', ['jshint', 'qunit']);

    // JS distribution task.
    grunt.registerTask('dist-js', ['concat', 'jshint', 'uglify']);


    // Full distribution task.
    grunt.registerTask('default', ['dist-js']);


};
