'use strict';

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*', './package.json').forEach(grunt.loadNpmTasks);

    var Config = {
        app : './assets',
        dist : './dist',
        phyloLib : './assets/scripts/phylo-lib',
        banner : "/*\n*\n* PHYLO Distribution Build v3.1.0\n* http://phylo.cs.mcgill.ca\n*\n* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors\n* Under McGill Human-Computing Developer Licence\n* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt\n*\n*/"
    };

    grunt.initConfig({
        config : Config,
        bower : {
            install :{}
        },
        clean : {
            dist : [
                '.tmp',
                '<%= config.dist %>/*',
                '<%= config.dist %>/.*'
            ],
            server : '.tmp'
        },
        imagemin : {
            // https://github.com/gruntjs/grunt-contrib-imagemin
            dynamic : {
                files : [{
                    expand : true,
                    cwd : "<%= config.app %>/img",
                    src : '**/*.{png,jpg,jpeg}',
                    dest : '<%= config.dist %>/assets/img'
                }]
            },
            expertBuild : {
                files : [{
                   expand : true,
                   cwd : "<%= config.dist %>/expert/img",
                   src : '**/*.{png,jpg,jpeg}',
                   dest : '<%= config.dist %>/expert/img'
                }]
            }
        },
        svgmin : {
            options: {                  // Configuration that will be passed directly to SVGO
                plugins: [{
                    removeViewBox: false
                }]
            },
            dist: {                     // Target
                files: [{               // Dictionary of files
                    expand: true,       // Enable dynamic expansion.
                    cwd: '<%= config.app %>/img',     // Src matches are relative to this path.
                    src: ['**/*.svg','!disease/*.svg'],  // Actual pattern(s) to match.
                    dest: '<%= config.dist %>/assets/img'       // Destination path prefix.
                    // ie: optimise img/src/branding/logo.svg and store it in img/branding/logo.min.svg
                }]
            }
        },
        htmlmin : {
            // https://github.com/gruntjs/grunt-contrib-htmlmin
            prepare: {                                      // Target
                options: {                                 // Target options
                    removeComments: false,
                    collapseWhitespace: false
                },
                files: {                                   // Dictionary of files
                    '.tmp/index.html': '<%= config.app %>/../index.html'     // 'destination': 'source'
                }
            },
            dist :  {
                options: {                                 // Target options
                  removeComments: true,
                  collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                  '<%= config.dist %>/index.html': '.tmp/index.html'     // 'destination': '.tmp'
                }
            }
        },
        requirejs: {
            compile : {
                // https://github.com/gruntjs/grunt-contrib-requirejs
                options: {
                    name : "scripts/main/PHYLO-main-stage",
                    baseUrl: '<%= config.app %>',
                    mainConfigFile : '<%= config.app %>/scripts/main/PHYLO-main-stage.js',
                    out : '<%= config.dist %>/assets/scripts/main/PHYLO-build.min.js'
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            },
            stage : {
                options: {
                    optimize : 'none',
                    name : "scripts/main/PHYLO-main-stage",
                    baseUrl: '<%= config.app %>',
                    mainConfigFile : '<%= config.app %>/scripts/main/PHYLO-main-stage.js',
                    out : '<%= config.app %>/scripts/main/PHYLO-build-stage.compress.js'
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            html: '<%= config.app %>/../index.html',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        usemin : {
            html : [".tmp/index.html"],
            options : {
                dirs : ['<%= config.dist %>']
            }
        },
        concat : {
            phyloLib : {
                src : [
                    '<%= config.phyloLib %>/newick.core.js',
                    '<%= config.phyloLib %>/stage.core.js',
                    '<%= config.phyloLib %>/board.theme.js',
                    '<%= config.phyloLib %>/timer.core.js',
                    '<%= config.phyloLib %>/score.theme.js',
                    '<%= config.phyloLib %>/highlighter.theme.js',
                    '<%= config.phyloLib %>/helper.core.js',
                    '<%= config.phyloLib %>/sequence.core.js',
                    '<%= config.phyloLib %>/splash.theme.js',
                    '<%= config.phyloLib %>/events.engine.js',
                    '<%= config.phyloLib %>/protocal.core.js',
                    '<%= config.phyloLib %>/multiSelect.core.js',
                    '<%= config.phyloLib %>/lang.module.js',
                    '<%= config.phyloLib %>/endGame.theme.js',
                    '<%= config.phyloLib %>/physics.engine.js',
                    '<%= config.phyloLib %>/engine.core.js',
                    '<%= config.phyloLib %>/fitch.core.js',
                    '<%= config.phyloLib %>/tree.core.js',
                    '<%= config.phyloLib %>/main.core.js'
                    // '<%= config.phyloLib %>/menu/gameMenu.actions.js'
                ],
                dest : '<%= config.app %>/scripts/phylo-lib/phylo-lib.js'
            }
        },
        copy : {
            // https://github.com/gruntjs/grunt-contrib-copy
            dist : {
                files : [
                    {
                        expand : true,
                        dest : '<%= config.dist %>',
                        src : [
                            '<%= config.app %>/../expert/**',
                            '<%= config.app %>/sounds/**',
                            '<%= config.app %>/scripts/main/main.js',
                            '<%= config.app %>/img/**/*.gif',
                            '<%= config.app %>/scripts/util/options_template.js',
                            '<%= config.app %>/scripts/models/**',
                            '<%= config.app %>/css/**',
                            '<%= config.app %>/img/disease/**/*.svg'
                        ]
                    },
                    {
                        expand : true,
                        cwd : "<%= config.app %>/bower_components/bootstrap/fonts",
                        dest : "<%= config.dist %>/assets/fonts",
                        src : "**",
                        flatten : true
                    }
                ]
            }
        },
        uglify : {
            // https://github.com/gruntjs/grunt-contrib-uglify
            dist : {
                files : {
                    "<%= config.dist %>/assets/scripts/phylo-lib/phylo-lib.min.js" : ['<%= config.app %>/scripts/phylo-lib/phylo-lib.js'],
                    "<%= config.dist %>/assets/scripts/require.min.js" : ["<%= config.app %>/bower_components/requirejs/require.js"]
                }
            },
            dev : {
                files : {
                    "<%= config.app %>/scripts/phylo-lib/phylo-lib.min.js" : ['<%= config.app %>/scripts/phylo-lib/phylo-lib.js'],
                }
            },
            minify : {
                files : [
                    {
                        expand : true,
                        cwd : "<%= config.dist %>/assets/scripts",
                        src : ['**/*.js', '!**/*.min.js'],
                        dest : "<%= config.dist %>/assets/scripts",
                    }
                ]
            },
            expertBuild : {
                files : [
                    {
                        expand : true,
                        cwd : "<%= config.dist %>/expert/js",
                        src : ["**/*.js", "!**/*.min.js"],
                        dest : "<%= config.dist %>/expert/js"
                    }
                ]
            },
            options :  {
                mangle : true,
                banner : "<%= config.banner %>"
            }
        },
        cssmin : {
            combine : {
                options :{
                    banner : "<%= config.banner %>"
                },
                files : {
                    "<%= config.dist %>/assets/css/components-setone.min.css" : [
                        ".tmp/concat/assets/css/components-setone.min.css"
                    ],
                    "<%= config.dist %>/assets/css/custom.min.css" : [
                        ".tmp/concat/assets/css/custom.min.css"
                    ],
                    "<%= config.dist %>/assets/css/components-settwo.min.css" : [
                        ".tmp/concat/assets/css/components-settwo.min.css"
                    ]
                }
            },
            minify: {
                options: {
                    banner : "<%= config.banner %>",
                },
                expand: true,
                cwd: '<%= config.dist %>/assets/css/',
                src: ['**/*.css', '!**/*.min.css'],
                dest: '<%= config.dist %>/assets/css',
                ext: '.css'
            },
            expertBuild : {
                options : {
                    banner : "<%= config.banner %>"
                },
                expand : true,
                cwd : "<%= config.dist%>/expert/css",
                src : ["**/*.css", "!**/*.min.css"],
                dest : "<%= config.dist %>/expert/css",
                ext : ".css"
            }
        },
        rev : {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets : {
                files : [{
                    src : [
                        "<%= config.dist %>/scripts/**/*.js",
                        "<%= config.dist %>/css/**/*.css",
                        "<%= config.dist %>/img/**/*.{png, jpg, jpeg, gif,svg}",
                        "<%= config.dist %>/css/fonts/**"
                    ]
                }]
            }
        },
        minjson : {
            minify : {
               options: {
                   banner : "<%= config.banner %>",
               },
               expand: true,
               cwd: '<%= config.dist %>/assets/scripts/models',
               src: ['**/*.json'],
               dest: '<%= config.dist %>/assets/scripts/models'
            }
        },
        jshint : {
            // https://github.com/gruntjs/grunt-contrib-jshint
            files : [
                'Gruntfile.js',
                '<%= config.app %>/scripts/**/*.js',
                '!<%= config.app %>/scripts/**/*.min.js',
                '!<%= config.app %>/scripts/models/lang/**',
                '!<%= config.app $>/scripts/models/tutorial/**'
            ],
            options : {
                globals : {
                    jQuery : true,
                    console : true,
                    module : true
                },
                ignores : [
                    "<%= config.app %>/scripts/main/PHYLO-build-stage.compress.js",
                    "<%= config.app %>/scripts/phylo-lib/phylo-lib.js",
                    "<%= config.app %>/scripts/phylo-lib/phylo-lib.min.js"
                ]
            }
        }
    });

    // grunt.registerTask('server', function (target) {

    //     grunt.task.run([
    //         'clean:server',
    //         'createDefaultTemplate',
    //         'jst',
    //         'compass:server',
    //         'connect:livereload',
    //         'open',
    //         'watch'
    //     ]);
    // });
    grunt.registerTask('build',[
        'clean',
        'useminPrepare',
        'concat',
        'imagemin:dynamic',
        'svgmin:dist',
        'cssmin:combine',
        'uglify:dist',
        'requirejs:compile',
        'htmlmin:prepare',
        'copy',
        'cssmin:minify',
        'uglify:minify',
        'minjson:minify',
        // 'rev',
        'usemin',
        'htmlmin:dist',
        //expert build clean up
        'imagemin:expertBuild',
        'cssmin:expertBuild',
        'uglify:expertBuild'
    ]);
    grunt.registerTask('stage',[
        'clean',
        'concat:phyloLib',
        'uglify:dev',
        'requirejs:stage',
    ]);
    grunt.registerTask('test',[
        //for server mocha side
        'jshint'
    ]);
    grunt.registerTask('setup'[
        'bower'
    ]);
    grunt.registerTask('default',[
        'test'
    ]);
};
