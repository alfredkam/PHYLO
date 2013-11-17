
General flow for creating / push distribution copy
=====
1. git add dist -f
2. git subtree pull --prefix=dist [dist repo url] [refs spec]
3. git commit -am 'merged dist with conflict'
4. grunt build
5. Test dist build @localhost:XXXX/dist
6. git add dist -f
7. git commit -am 'new dist snapshot'
8. git subtree push --prefix=dist [dist repo url] [refs spec] <br>
. <br>
. <br>
. <br>
last - 1. git rm -r --cache dist <br>
last. git c 'ommited dist snapshot'

General Flow for creating a repo to deploy on server
=====
1. ssh to your remote server
2. git clone --bare [repo url] [repo name]
3. edit [repo name]/hooks/post-recieve - here is a sample https://gist.github.com/alfredkam/6383071#file-gistfile1-txt-L8, remember to change line 8
4. on your local copy
5. git remote add [remote name] [repo server url]
6. git commit -am 'snapshot'
7. git push [repo server url] [remote name]