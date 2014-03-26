JSFLAGS=--externs ../js/lib/jquery-1.7.externs.js \
--externs ../js/lib/JSON.externs.js \
--compilation_level ADVANCED_OPTIMIZATIONS

#--formatting=pretty_print

JSNOCONSOLE=--js ../js/noconsole.js

project: ../js/dcanv.min.js ../js/dcanv.all.min.js

../js/lib/json.min.js: ../js/lib/JSON.js
	java -jar closure/compiler.jar --js ../js/lib/JSON.js \
--js_output_file ../js/lib/json.min.js

../js/lib/libs.min.js: ../js/lib/json.min.js ../js/lib/bootstrap.min.js \
../js/lib/jquery-1.7.1.min.js
	cat ../js/lib/json.min.js > ../js/lib/libs.min.js
	echo "" >> ../js/lib/libs.min.js
	cat ../js/lib/jquery-1.7.1.min.js >> ../js/lib/libs.min.js
	echo "" >> ../js/lib/libs.min.js
	cat ../js/lib/bootstrap.min.js >> ../js/lib/libs.min.js
	echo "" >> ../js/lib/libs.min.js

../js/consts.js: ../js/consts.php
	php ../js/consts.php > ../js/consts.js
	chmod a+rx ../js/consts.js
	
../js/dcanv.min.js: ../js/consts.js ../js/buttoncolumn.js ../js/fitch.js \
../js/fold.js ../js/htmlelements.js ../js/in.js ../js/lang.js \
../js/msg.js ../js/options.js ../js/scorebar.js ../js/ui.js \
../js/window.js
	java -jar closure/compiler.jar ${JSFLAGS} ${JSNOCONSOLE} \
--js ../js/consts.js \
--js ../js/buttoncolumn.js --js ../js/fitch.js --js ../js/fold.js --js \
../js/htmlelements.js --js ../js/in.js --js ../js/lang.js --js \
../js/msg.js --js ../js/options.js --js ../js/scorebar.js --js \
../js/ui.js --js ../js/window.js --js_output_file ../js/dcanv.min.js 
	chmod a+rx ../js/dcanv.min.js

../js/dcanv.all.min.js: ../js/dcanv.min.js ../js/lib/libs.min.js
	cat ../js/lib/libs.min.js ../js/dcanv.min.js \
> ../js/dcanv.all.min.js
	chmod a+rx ../js/dcanv.all.min.js

clean:
	rm ../js/consts.js
	rm ../js/dcanv.min.js
	rm ../js/dcanv.all.min.js
	rm ../js/lib/libs.min.js
