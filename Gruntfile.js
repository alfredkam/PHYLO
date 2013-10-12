'use strict';

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var Config = {
        app : 'app',
        dist : 'dist'
    };

    grunt.initConfig({
        mochaTest : {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/*.js'
                ]
            }
        },
        clean: {
            server: '.tmp'
        },
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

    grunt.registerTask('test',[
        //for server mocha side
        'mochaTest'
    ]);

    grunt.registerTask('default',[
        'test'
    ]);
};
