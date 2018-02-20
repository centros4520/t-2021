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
            source: '.',
            dist: 'dist',
            dev: 'dev',
            baseurl: ''
        },
        env : {
            production : {
              JEKYLL_ENV : 'production'
            },
        },
        watch: {
            sass: {
                files: ['<%= app.source %>/_sass/**/*.{scss,sass}'],
                tasks: ['sass:server']
            },
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
                    // '.jekyll/**/*.{html,yml,md,mkd,markdown}',
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
                        '<%= app.dev %>',
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
                '.tmp',
                '<%= app.dev %>'
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
                    dest: '<%= app.dev %>/<%= app.baseurl %>'
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
                    // removeEmptyAttributes: true,
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
                    '<%= app.dev %>/<%= app.baseurl %>/js/scripts.js': ['<%= app.source %>/assets/js/**/*.js']
                }
            },
            dist: {
                options: {
                    compress: true,
                    preserveComments: false,
                    report: 'min'
                },
                files: {
                    '<%= app.dist %>/<%= app.baseurl %>/js/scripts.js': ['<%= app.source %>/assets/js/**/*.js']
                }
            }
        },
        sass: {
            server: {
                options: {
                    
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.source %>/_sass',
                    src:  ['main.scss'],
                    dest: '<%= app.dev %>/assets',
                    ext: '.css'
                }]
            },
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.source %>/_sass/',
                    src: ['main.scss'],
                    dest: '<%= app.dist %>/assets',
                    ext: '.css'
                }]
            }
        },
        uncss: {
            options: {
                htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
                report: 'gzip'
            },
            dist: {
                src: '<%= app.dist %>/<%= app.baseurl %>/**/*.html',
                dest: '<%= app.dist %>/<%= app.baseurl %>/sacss/blog.css'
            }
        },
        postcss: {
            options: {
            //   map: true, // inline sourcemaps
              // or
              map: {
                  inline: false, // save all sourcemaps as separate files...
                  annotation: '<%= app.dist %>/<%= app.baseurl %>/assets/' // ...to the specified directory
              },
              processors: [
                require('pixrem')(), // add fallbacks for rem units
                require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                require('cssnano')() // minify the result
              ]
            },
            dist: {
              src: '<%= app.dist %>/<%= app.baseurl %>/assets/*.css'
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
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/assets',
                    src: '**/*.{jpg,jpeg,png,gif}',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/assets'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app.dist %>/<%= app.baseurl %>/assets',
                    src: '**/*.svg',
                    dest: '<%= app.dist %>/<%= app.baseurl %>/assets'
                }]
            }
        },
        copy: {
            server: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= app.source %>',
                    src: ['assets/images/**/*'],
                    dest: '.tmp/<%= app.baseurl %>'
                }]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    dir: '<%= app.dist %>/<%= app.baseurl %>',
                    login:'albhardy',
                    remote: 'https://github.com/albhardy/albhardy.github.io.git',
                    remoteBranch:'master',
                    branch: 'master',
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
            'sass:server',
            'uglify:server',
            'connect:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('build', [
        'env:production',
        'clean:dist',
        'jekyll:dist',
        // 'imagemin',
        // 'svgmin',
        'sass:dist',
        // 'uncss',
        'postcss',
        'uglify:dist',
        'htmlmin'      
    ]);
    grunt.registerTask('dist', [
        'build',
        'connect:dist',
        'watch'
    ]);
    grunt.registerTask('deploy', [
        // 'build',
        'buildcontrol'
    ]);
    grunt.registerTask('default', [
        'serve'
    ]);
};