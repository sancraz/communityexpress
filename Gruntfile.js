module.exports = function (grunt) {
     'use strict';

    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        indexFile: 'prod-index.html'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
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
                        cwd: '<%= yeoman.app %>/build',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/public/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
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
                    {
						src: '<%= yeoman.app %>/scripts/owl.carousel.min.js',
						dest: '<%= yeoman.dist %>/scripts/owl.carousel.min.js'
                    },
                    {
						src: '<%= yeoman.app %>/styles/owl.carousel.css',
						dest: '<%= yeoman.dist %>/styles/owl.carousel.css'
                    }, 
                    { 
						src: '<%= yeoman.app %>/styles/owl.transitions.css',
						dest: '<%= yeoman.dist %>/styles/owl.transitions.css'
                    },
                    {
						src: '<%= yeoman.app %>/styles/animate.min.css',
						dest: '<%= yeoman.dist %>/styles/animate.min.css'
                    },
                    {
                    	src: '<%= yeoman.app %>/build/bundle.js',
                    	dest: '<%= yeoman.dist %>/scripts/bundle.js'
                    },
                    {
                    	src: '<%= yeoman.app %>/build/styles.css',
                    	dest: '<%= yeoman.dist %>/styles/styles.css'
                    }
                ]
            }
        },
    });

	grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', function() {
    	grunt.task.run('copy')
    });
 
};
