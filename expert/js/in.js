function getSequences(callback) {
    var url = 'ajax/fetch?';
    if (args['space']){
        url = url + 'space=' + args['space'] + '&';
    }
    if (args['name']){
        url = url + 'name=' + args['name'] + '&';
    }
    if (args['id']){
        url = url + 'id=' + args['id'] + '&';
    }else{
        url = url + 'id=1&';
    }

    $.getJSON(
        url,
        function(data){
            var parsed = parseInput(data);
            callback(parsed, data);
        }
    );

    //var sample = [ [ [ '.ACGAAAGATAAAAAGC..', 'AGCGCATAACCATGCAC..' ], '..CAGTTACTTGTAAGC..' ], '..GTAAAAATAGTATTCAG' ];
    //$.getJSON(url, process);
}

function parseInput(data){
    var flatten = function flat(tree, out){
        if (tree instanceof Array){
            flat(tree[0], out);
            flat(tree[1], out);
        }else{
            out.push(tree);
        }
    }
    
    var sequences = new Array;
    flatten(data, sequences);
    var parsed = new Array(sequences.length);
    for (var i = 0; i < sequences.length; i++){
        parsed[i] = new Array();
        var j;
        var k;
        for (j = 0, k = 0; j < sequences[i].length; j++, k++){
            switch(sequences[i].charAt(j)){
                case 'A':
                    parsed[i][k] = {id:0, colCount:j};
                    break;
                case 'U':
                case 'T':
                    parsed[i][k] = {id:1, colCount:j};
                    break;
                case 'C':
                    parsed[i][k] = {id:2, colCount:j};
                    break;
                case 'G':
                    parsed[i][k] = {id:3, colCount:j};
                    break;
                default:
                    k--;
            }
        }
    }
    return parsed;
}
