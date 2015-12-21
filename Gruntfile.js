var webpackDevConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        indexFile: 'prod-index.html'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        webpack: {
            options: webpackDevConfig,
            start: {
            },
            watch: {
                watch: true,
                keepalive: true
            }
        },
        clean: {
            js: ["dist/scripts/*.js", "!dist/scripts/*.min.js"]
        },
        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: [
                    'app/build/bundle.js',
                    'app/vendor/scripts/moment.min.js',
                    'app/vendor/scripts/owl.carousel.min.js',
                    'app/vendor/scripts/fullcalendar.min.js',
                    'app/vendor/scripts/jquery.jqplot.min.js',
                    'app/vendor/scripts/jqplot.barRenderer.min.js',
                    'app/vendor/scripts/jqplot.categoryAxisRenderer.min.js',
                    'app/vendor/scripts/jqplot.pointLabels.min.js',
                    'app/vendor/scripts/jquery-migrate-1.2.1.min.js',
                    'app/vendor/scripts/jquery-radiobutton.min.js',
                    'app/vendor/scripts/jquery.mask.min.js',
                    'app/vendor/scripts/sitelette.js'
                ],
                dest: 'dist/scripts/main.js',
            },
        },
        uglify: {
            options: {
                compress: true,
                mangle: true
            },
            target: {
                src: 'dist/scripts/main.js',
                dest: 'dist/scripts/main.min.js'
            }
        },
        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16
            },
            assets: {
                files: [{
                    src: ['<%= yeoman.dist %>/index.php']
                }]
            }
        },
        cssmin: {
            target: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        // '<%= yeoman.app %>/vendor/styles/animate.min.css',
                        '<%= yeoman.app %>/vendor/styles/owl.carousel.css',
                        '<%= yeoman.app %>/vendor/styles/jquery.jqplot.min.css',
                        '<%= yeoman.app %>/vendor/styles/fullcalendar.min.css',
                        '<%= yeoman.app %>/vendor/styles/sitelette_theme1.css',
                        '<%= yeoman.app %>/vendor/styles/sitelette_theme2.css',
                        '<%= yeoman.app %>/vendor/styles/main.css',
                        '<%= yeoman.app %>/build/styles.css'
                    ]
                }
            },
            options: {
                report: 'min'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            '*.{ico,txt,png}',
                            '.htaccess',
                        ],
                        dest: '<%= yeoman.dist %>'
                    },
                    {
						expand: true,
						cwd: 'no_sitelette',
						src: '{,*/}*',
						dest: '<%= yeoman.dist %>/no_sitelette'
                    },
                    {
                        expand: true,
                        cwd: 'd',
                        src: '{,*/}*',
                        dest: '<%= yeoman.dist %>/d'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/vendor/jquery_mobile_1_4/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>//vendor/jquery_mobile_1_4/images'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles/icons',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/styles/icons/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/build',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/styles/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/styles/images'
                    },
                    {
                        src: '<%= yeoman.app %>/production-index.php',
                        dest: '<%= yeoman.dist %>/index.php'
                    },
                    {
                        src: '<%= yeoman.app %>/parser_api_utility.php',
                        dest: '<%= yeoman.dist %>/parser_api_utility.php'
                    },
                    {
						src: '<%= yeoman.app %>/sitelette-production.php',
						dest: '<%= yeoman.dist %>/sitelette-production.php'
                    },
                ]
            }
        },
    });

    grunt.registerTask('default', ['webpack:start']);
    grunt.registerTask('build', [
        'concat',
        'uglify',
        'clean',
        'cssmin',
        'copy',
        'cacheBust'
    ]);
 
};
