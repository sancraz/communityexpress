// var webpackDevConfig = require('./webpack.config.js'),
//     siteletteWebpackConfig = require('./webpack-sitelette.config.js'),
//     chalkboardsWebpackConfig = require('./webpack-chalkboards.config.js'),
//     config;
var grunt = require('grunt');
var argv = require('yargs').argv;

grunt.log.write(argv.project);

if (argv.project == 'sitelette') {
    var webpackConfig = require('./webpack-sitelette.config.js');
} else if (argv.project == 'chalkboards') {
    var webpackConfig = require('./webpack-chalkboards.config.js');
};

// stop webpack watch and keepalive
webpackConfig.watch = false;
webpackConfig.keepalive = false;

// Creating multiple stylesheet's paths with diff themes (for cssmin task)
var themes = function() {
    // Number of themes
    var themeNumber = 4;
    var distStyle = {};
    for (var i = 1; i < themeNumber+1; i++) {
        var styles='<%= yeoman.app %>/build/styles.css',
            distFile='<%= yeoman.dist %>/build/styles'+i+'.css',
            themeName='<%= yeoman.app %>/styles/themes/theme'+i+'/sitelette_theme'+i+'.css';
        distStyle[distFile] = [styles, themeName];
    };
    return distStyle;
};

module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    var webpack = require('webpack');

    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        indexFile: 'prod-index.html',
        project: argv.project
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        webpack: {
            options: webpackConfig,
            start: {
            }
        },
        clean: [
            '<%= yeoman.dist %>',
            '<%= yeoman.app %>/build'
        ],
        uglify: {
            options: {
                compress: true,
                mangle: true
            },
            target: {
                src: '<%= yeoman.dist %>/build/bundle.js',
                dest: '<%= yeoman.dist %>/build/bundle.js'
            }
        },
        cssmin: {
            target: {
                files: themes()
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
                        cwd: '<%= yeoman.app %>/no_sitelette',
                        src: '{,*/}*',
                        dest: '<%= yeoman.dist %>/no_sitelette'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/desktop',
                        src: ['**'],
                        dest: '<%= yeoman.dist %>/desktop'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/error_page',
                        src: '{,*/}*',
                        dest: '<%= yeoman.dist %>/error_page'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/build',
                        src: '{,*/}*',
                        dest: '<%= yeoman.dist %>/build'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles/icons',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/styles/icons/'
                    },
                    {
                        src: '<%= yeoman.app %>/index.php',
                        dest: '<%= yeoman.dist %>/index.php'
                    },
                    {
                        src: '<%= yeoman.app %>/parser_api_utility.php',
                        dest: '<%= yeoman.dist %>/parser_api_utility.php'
                    },
                    {
                        src: '<%= yeoman.app %>/<%= yeoman.project %>-production.php',
                        dest: '<%= yeoman.dist %>/<%= yeoman.project %>.php'
                    },
                    {
                        src: '<%= yeoman.app %>/Mobile_Detect.php',
                        dest: '<%= yeoman.dist %>/Mobile_Detect.php'
                    },
                    {
                        src: '<%= yeoman.app %>/styles/themes/theme2/sprite_navbar_theme2.png',
                        dest: '<%= yeoman.dist %>/build/sprite_navbar_theme2.png'
                    },
                    {
                        src: '<%= yeoman.app %>/styles/themes/theme2/sprite_buttons_theme9.png',
                        dest: '<%= yeoman.dist %>/build/sprite_buttons_theme9.png'
                    }
                ]
            }
        }
    });
    grunt.registerTask('default', function() {
        grunt.task.run([
            'clean',
            'webpack',
            'copy',
            'uglify',
            'cssmin'
        ]);
    });

    grunt.registerTask('build', [
        'clean',
        'webpack',
        'copy',
        'uglify',
        'cssmin'
    ]);

    grunt.registerTask('sitelette', function() {
        yeomanConfig.appName = 'sitelette';
        grunt.task.run([
            'clean',
            'webpack',
            'copy',
            'uglify',
            'cssmin'
        ]);
    })
};