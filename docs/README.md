Docs page

Set up environment for OSX
======
1. install homebrew (http://brew.sh/)
2. brew install node
3. brew install npm
4. npm install node-dev
5. npm install grunt-cli -g
6. npm install bower -g
7. cd PHYLO
7. npm install

Running a local server
======
1. cd mock
2. PORT=XXXX node-dev app.js
3. go to your browser and navigate to localhost:XXXX

Prerequisites to this framework
======
1. Marionette (marionettejs.com)
2. Backbone (backbonejs.org)
3. Requirejs (requirejs.org)

Configurations
======
1. assets/scripts/main/main.js - controls the source map {dev, stage, production} [Also the inital javascript initalization]
2. assets/scripts/main/PHYLO-main* - the requirejs-AMD configurations

Dev
====
1. Set assets/scripts/main/main.js to "dev" mode 
<br>
This will allow you to work with non-concat / uncompressed files

Staging
======
1. Set assets/scripts/main/main.js to "stage" mode
2. if neccessary, update assets/scripts/main/PHYLO-main-stage.js
3. if neccessary, update Gruntfile.js
4. grunt stage
<br>
This will concat the assets/scripts directory into one non-uglify file.

Production / Dist Build
====
1. set assets/scripts/main/main.js to "production" mode
2. if neccessary, update assets/scripts/main/PHYLO-main-stage.js
3. if neccessary, update Gruntfile.js
4. grunt build
<br>
This will concat and uglify majority of the js / css files into uglify files.

Partial Testing
=====
1. grunt test
<br>
For now it will run task(s) - jshint.

Expert / Expert Subtree
=====
The Expert build is a subtree and is included in this branch, its subtree is located at https://github.com/McGill-CSB/PHYLO-Expert

Dist Subtree
=====
It is located at https://github.com/McGill-CSB/PHYLO-Dist

To extend this framework
======
We use Mariontte! You can easily create an <a href='https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md'>Marionette Itemview</a> to create modules / components.  Exept for phylo-lib it uses object-literal.

Skeleton
======
We've based our skeleton from this <a href='https://github.com/alfredkam/Boilerplates/tree/master/Marionette'>repo</a> 

Additional Notes
======
subtree usage : git subtree [pull | push ]  --prefix=[location] [repo] [branch]




