Docs page

Setting up environment for osx
======
1. install homebrew (http://brew.sh/)
2. brew install node
3. brew install npm
4. npm install node-dev
5. npm install grunt -g
6. npm install bower -g
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
1. assets/scripts/main/main.js - controls the environment {dev, stage, production} [Also the inital javascript initalization]
2. assets/scripts/main/PHYLO-main* - the requirejs-AMD configurations

To extend this framework
======
We use Mariontte! You can easily create an <a href='https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md'>Marionette Itemview</a> to create modules / components.

Skeleton
======
We've based our skeleton from this <a href='https://github.com/alfredkam/Boilerplates/tree/master/Marionette'>repo</a> 



