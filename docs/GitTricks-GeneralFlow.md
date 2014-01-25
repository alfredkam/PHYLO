
##General flow for creating / push distribution copy
1. git add dist -f
2. git commit -am 'added dist snapshot'
3. git subtree pull --prefix=dist [dist repo url] [refs spec]
4. git commit -am 'merged dist with conflict'
5. grunt build
6. Test dist build @localhost:XXXX/dist
7. git add dist -f
8. git commit -am 'new dist snapshot'
9. git subtree push --prefix=dist [dist repo url] [refs spec]
10. git rm -r --cache dist
11. git commit 'ommited dist snapshot'

##General flow for cloning a repo to deploy on server
1. ssh to your remote server
2. git clone --bare [repo url] [repo name]
3. edit [repo name]/hooks/post-recieve - here is a sample https://gist.github.com/alfredkam/6383071#file-gistfile1-txt-L8, remember to change line 8
4. on your local copy
5. git remote add [remote name] [repo server url]
6. git commit -am 'snapshot'
7. git push [repo server url] [remote name]