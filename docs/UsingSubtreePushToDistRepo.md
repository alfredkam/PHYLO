
General flow for creating / push distribution copy
=====
1. git add dist -f
2. git subtree pull --prefix=dist [dist repo url] [refs spec]
3. git commit -am 'merged dist with conflict'
4. grunt build
5. Test dist build @localhost:XXXX/dist
6. git add dist -f
7. git commit -am 'new dist snapshot'
8. git subtree push --prefix=dist [dist repo url] [refs spec]
.
.
.
last - 1. git rm -r --cache dist
last. git c 'ommited dist snapshot'