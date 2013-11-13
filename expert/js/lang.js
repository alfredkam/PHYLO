function Language(){
    
}

Language.shortcut = {
    "bc-best": ['body','play','gameselect','game_board','field_4'],
    "bc-score": ['body','play','gameselect','game_board','field_1'],
    "sb-best": ['body','play','gameselect','game_board','field_4'],
    "sb-par": ['body','play','gameselect','game_board','field_2'],
    "t-ancestor": []
};

Language.get = function(key){
    var rec = function rec(tree, keys, index, def){
        if (index == keys.length){
            if (typeof tree == 'string'){
                return tree;
            }else{
                return def;
            }
        }
        return rec(tree[keys[index]], keys, index + 1, def);
    }
    if (Language.data){
        var str = rec(Language.data, Language.shortcut[key], 0, key);
        if (key == 'bc-best' || key == 'sb-best'){
            return str.split(' ')[0];
        }
        return str;
    }else{
        return key;
    }
}

function setLanguage(lang){
    var getLanguageFile = function(lang, callback){
        $.getJSON(
            LANG_DIR + lang + LANG_EXT,
            function(data){
                console.log(LANG_DIR + lang + LANG_EXT);
                callback(data);
            }
        );
    };
    var setText = function(){
        console.log('lang set');
        $("label[for='stats-matches']").html(LANG['body']['play']['gameselect']['game_board']['field_9']);
        $("label[for='stats-gapexts']").html(LANG['body']['play']['gameselect']['game_board']['field_12']);
        $("label[for='stats-stage']").html(LANG['body']['play']['gameselect']['game_board']['field_3']);
        $("label[for='stats-mismatches']").html(LANG['body']['play']['gameselect']['game_board']['field_10']);
        $("label[for='stats-gaps']").html(LANG['body']['play']['gameselect']['game_board']['field_11']);
        $("label[for='stats-par']").html(LANG['body']['play']['gameselect']['game_board']['field_2']);
        
        $("label[for='scores-best']").html(LANG['body']['play']['gameselect']['game_board']['field_4']);
        $("label[for='scores-score']").html(LANG['body']['play']['gameselect']['game_board']['field_1']);
        
        $("#menu-play > a").html(LANG['header']['field_1']);
        $("#menu-highscores > a").html(LANG['header']['field_7']);
        $("#menu-contact > a").html(LANG['header']['field_3']);
        
        $("#stage-redirect").attr("placeholder", LANG['body']['play']['gameselect']['levelselect']['level_id']['field_2']);
    };
    
    if (!lang){
        lang = "en-us";
    }
    getLanguageFile(lang, function(data){
        LANG = data;
        Language.data = data;
        setText();
        redrawEverything();
    });  
}

$(function(){
    setLanguage();
});
