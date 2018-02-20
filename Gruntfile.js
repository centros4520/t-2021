'use strict';

module.exports = function(grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt, {
        buildcontrol: 'grunt-build-control'
      });

    grunt.initConfig({
        app: {
            source: '',
            dist: 'dist',
            baseurl: ''
        },
        env : {
            production : {
              JEKYLL_ENV : 'production'
            },
        },
        watch: {
            // sass: {
            //     files: ['<%= app.source %>/_assets/scss/**/*.{scss,sass}'],
            //     tasks: ['sass:server', 'autoprefixer']
            // },
            // scripts: {
            //     files: ['<%= app.source %>/_assets/js/**/*.{js}'],
            //     tasks: ['uglify']
            // },
            jekyll: {
                files: ['<%= app.source %>/**/*.{html,yml,md,mkd,markdown}'],
                tasks: ['jekyll:server']
            },
            // images: {
            //     files: ['<%= app.source %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'],
            //     tasks: ['copy:server']
            // },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.jekyll/**/*.{html,yml,md,mkd,markdown}',
                    // '.tmp/<%= app.baseurl %>/css/*.css',
                    // '.tmp/<%= app.baseurl %>/js/*.js',
                    // '.tmp/<%= app.baseurl %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: {
                        target: 'http://localhost:9000/<%= app.baseurl %>'
                    },
                    base: [
                        '.jekyll',
                        '.tmp',
                        '<%= app.source %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: {
                        target: 'http://localhost:9000/<%= app.baseurl %>'
                    },
                    base: [
                        '<%= app.dist %>',
                        '.tmp'
                    ]
                }
            }
        },
        clean: {
            server: [
                '.jekyll',
                '.tmp'
            ],
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= app.dist %>/*',
                        '!<%= app.dist %>/.git*'
                    ]
                }]
            }
        },
        jekyll: {
            options: {
                bundleExec:true,
                config: '_config.yml,_config.build.yml',
                src: '<%= app.source %>'
            },
            dist: {
                options: {
                    config: '_config.yml',
                    dest: '<%= app.dist %>/<%= app.baseurl %>',
                }
            },
            server: {
                options: {
                    config: '_config.yml',
                    dest: '.jekyll/<%= app.baseurl %>'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>',
                    src: '**/*.html',
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        uglify: {
            server: {
                options: {
                    mangle: false,
                    beautify: true
                },
                files: {
                    '.tmp/<%= app.baseurl %>/js/scripts.js': ['<%= app.source %>/_assets/js/**/*.js']
                }
            },
            dist: {
                options: {
                    compress: true,
                    preserveComments: false,
                    report: 'min'
                },
                files: {
                    '<%= app.dist %>/<%= app.baseurl %>/js/scripts.js': ['<%= app.source %>/_assets/js/**/*.js']
                }
            }
        },
        sass: {                              // Task
            options: {
                lineNumbers: true,
                includePaths: '_sass'
            },
            dist: {                            // Target
              options: {                       // Target options
                style: 'expanded',
                
              },
              files: {                         // Dictionary of files
                'main.css': 'main.scss',       // 'destination': 'source'
                'widgets.css': 'widgets.scss'
              }
            },
            server: {
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/css',
                    ext: '.css'
                  }]
            },
          },
        // sass: {
        //     options: {
        //         includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
        //     },
        //     server: {
        //         options: {
        //             sourceMap: true
        //         },
        //         files: [{
        //             expand: true,
        //             cwd: '<%= app.source %>/_assets/scss',
        //             src: '**/*.{scss,sass}',
        //             dest: '.tmp/<%= app.baseurl %>/css',
        //             ext: '.css'
        //         }]
        //     },
        //     dist: {
        //         options: {
        //             outputStyle: 'compressed'
        //         },
        //         files: [{
        //             expand: true,
        //             cwd: '<%= app.source %>/_assets/scss',
        //             src: '**/*.{scss,sass}',
        //             dest: '<%= app.dist %>/<%= app.baseurl %>/css',
        //             ext: '.css'
        //         }]
        //     }
        // },
        uncss: {
            options: {
                htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
                report: 'gzip'
            },
            dist: {
                src: '<%= app.dist %>/<%= app.baseurl %>/**/*.html',
                dest: '<%= app.dist %>/<%= app.baseurl %>/css/blog.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions']
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= app.baseurl %>/css',
                    src: '**/*.css',
                    dest: '.tmp/<%= app.baseurl %>/css'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/css',
                    src: '**/*.css',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/css'
                }]
            }
        },
        critical: {
            dist: {
                options: {
                    base: './',
                    css: [
                        '<%= app.dist %>/<%= app.baseurl %>/css/blog.css'
                    ],
                    minify: true,
                    width: 320,
                    height: 480
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>',
                    src: ['**/*.html'],
                    dest: '<%= app.dist %>/<%= app.baseurl %>'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 0,
                    check: 'gzip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/css',
                    src: ['*.css'],
                    dest: '<%= app.dist %>/<%= app.baseurl %>/css'
                }]
            }
        },
        imagemin: {
            options: {
                progressive: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/img',
                    src: '**/*.{jpg,jpeg,png,gif}',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/img',
                    src: '**/*.svg',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/img'
                }]
            }
        },
        copy: {
            server: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= app.source %>',
                    src: ['img/**/*'],
                    dest: '.tmp/<%= app.baseurl %>'
                }]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    dir: '<%= app.dist %>/<%= app.baseurl %>',
                    // token:'11a41d14757e8580ba3b5524780d7e9a3bebb06a',
                    login:'albhardy',
                    remote: 'https://github.com/albhardy/albhardy.github.io',
                    remoteBranch:'dist',
                    branch: 'dist',
                    commit: true,
                    push: true,
                    connectCommits: false,
                    message:'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
                }
            }
        }
    });

    // Define Tasks
    grunt.registerTask('serve', function(target) {
        grunt.task.run([
            'clean:server',
            'jekyll:server',
            // 'sass:server',
            // 'autoprefixer:server',
            // 'uglify:server',
            'connect:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('build', [
        'env:production',
        'clean:dist',
        'jekyll:dist',
      
    ]);
    grunt.registerTask('deploy', [
        'build',
        'buildcontrol'
    ]);
    grunt.registerTask('default', [
        'serve'
    ]);
};