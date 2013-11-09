'use strict';

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*', './package.json').forEach(grunt.loadNpmTasks);

    var Config = {
        app : './assets',
        dist : './dist',
        phyloLib : './assets/scripts/phylo-lib'
    };

    grunt.initConfig({
        config : Config,
        bower : {
            install :{}
        },
        clean : {
            dist : ['.tmp', '<%= config.dist %>/*'],
            server: '.tmp'
        },
        imagemin : {
            // https://github.com/gruntjs/grunt-contrib-imagemin
            dynamic : {
                files : [{
                    expand : true,
                    cwd : "<%= config.app %>/img",
                    src : '**/*.{png,jpg,jpeg,svg}',
                    dest : '<%= config.dist %>/assets/img'
                }]
            }
        },
        htmlmin : {
            // https://github.com/gruntjs/grunt-contrib-htmlmin
            dist: {                                      // Target
              options: {                                 // Target options
                removeComments: true,
                collapseWhitespace: true
              },
              files: {                                   // Dictionary of files
                '<%= config.dist %>/index.html': '<%= config.app %>/../index.html',     // 'destination': 'source'
              }
            },
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
                            '<%= config.app %>/../expert/*',
                            '<%= config.app %>/sounds/*',
                            '<%= config.app %>/scripts/main/main.js',
                            // '<%= config.app %>/css/*'
                        ]
                    }
                ]
            }
        },
        uglify : {
            options :  {
                mangle : true,
            },
            my_target : {
                files : {
                    "<%= config.dist %>/assets/scripts/phylo-lib/phylo-lib.min.js" : ['<%= config.app %>/scripts/phylo-lib/phylo-lib.js'],
                    "<%= config.app %>/scripts/phylo-lib/phylo-lib.min.js" : ['<%= config.app %>/scripts/phylo-lib/phylo-lib.js'],
                }
            }
        },
        cssmin : {
            minify : {
                expand : true,
                cwd : "<%= config.app %>",
                src : ["<%= config.app %>/css/*.css", "!<%= config.app %>/css/ipad-fix.css", "!<%= config.app %>/css/tablet.css"],
                dest : "<%= config.dist %>/assets/css"
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
        'cssmin',
        'uglify',
        'requirejs:compile',
        'imagemin',
        'htmlmin',
        'copy',
         // 'copy',

    ]);
    grunt.registerTask('stage',[
        'clean',
        'concat:phyloLib',
        'uglify',
        'requirejs:stage',
    ]);
    grunt.registerTask('test',[
        //for server mocha side
        'mochaTest'
    ]);
    grunt.registerTask('setup'[
        'bower'
    ]);
    grunt.registerTask('default',[
        'test'
    ]);
};
