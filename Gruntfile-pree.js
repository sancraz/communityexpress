// To build a project from console run commands with changed name (e.g sitelette)
// grunt --project=sitelette
// webpack --config webpack-sitelette.config.js
var grunt = require('grunt');
var argv = require('yargs').argv;

grunt.log.write('compiling Pree');

var webpackConfig = require('./webpack-pree.config.js');

// stop webpack watch and keepalive
webpackConfig.watch = false;
webpackConfig.keepalive = false;

// Creating multiple stylesheet's paths with diff themes (for cssmin task)
var themes = function() {
  // Number of themes
  var themeNumber = 4;
  var distStyle = {};

  for (var i = 1; i <= themeNumber; i++) {
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
    app: 'app/app_pree',
    dist: 'dist',
    indexFile: 'prod-index.html',
    project: 'pree'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    webpack: {
      options: webpackConfig,
      start: {
      }
    },
    clean: [
      './dist.zip',
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
          // copy the vendor folder
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['vendor/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy the img files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['img/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy the img files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['styles/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy the root files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['*.html','*.php'],
            dest: '<%= yeoman.dist %>'
          },  // copy the bootstrap files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['build/bundle.js'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    compress: {
      dist: {
        options: {
          archive: './dist.zip',
          mode: 'zip'
        },
        files: [
          { src: './dist/**' }
        ]
      }
    },
    // Here will be replacements for production files
    replace: {
      dist: {
        src: ['<%= yeoman.app %>/index.php'],
        dest: '<%= yeoman.dist %>/',
        replacements: [{
          from: 'app_chalkboards/',
          to: ''
        },{
          from: 'app_sitelette/',
          to: ''
        },{
          from: 'dev-',
          to: ''
        }]
      }
    }
  });
  grunt.registerTask('default', function() {
    grunt.task.run([
      'clean',
      'webpack',
      'copy'

      //  'replace',
      //  'uglify',
      //  'cssmin',
      //  'compress'
    ]);
  });
};
