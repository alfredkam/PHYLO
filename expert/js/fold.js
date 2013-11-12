/**
seqs - object, Ex:
    {"sequences": ["ACT", "ACG"], "fold":"<.>"}
*/
function FoldCalculator(seqs){
    this.SHARP = 4;         // min size of a corner, prevent sharp corners
    this.THRESHOLD = 10;    // threshold score for considering as a basepair 
    this.p = {              // matrix used for scoring
        "A":{"A": 0, "C": 0, "G": 0, "U": 2, ".": 0},
        "C":{"A": 0, "C": 0, "G": 4, "U": 0, ".": 0},
        "G":{"A": 0, "C": 4, "G": 0, "U": 1, ".": 0},
        "U":{"A": 2, "C": 0, "G": 1, "U": 0, ".": 0},
        ".":{"A": 0, "C": 0, "G": 0, "U": 0, ".": 0}
    };
    this.po = {              // alternative score matrix
        "A":{"A": 0, "C": 0, "G": 0, "U": 1, ".": 0},
        "C":{"A": 0, "C": 0, "G": 1, "U": 0, ".": 0},
        "G":{"A": 0, "C": 1, "G": 0, "U": 0, ".": 0},
        "U":{"A": 1, "C": 0, "G": 0, "U": 0, ".": 0},
        ".":{"A": 0, "C": 0, "G": 0, "U": 0, ".": 0}
    };
    
    // matrix for comparing folds
    // inner-most term ordering: different, extra, missing
    // ex. [1,0,0] if the two is simply different
    this.diffMatrix = {      
        "<":{"<": [0,0,0], ">": [1,0,0], ".": [0,0,1] },
        ">":{"<": [1,0,0], ">": [0,0,0], ".": [0,0,1] },
        ".":{"<": [0,1,0], ">": [0,1,0], ".": [0,0,0] }
    };
    
    this.original = seqs["fold"];
    this.sequences = seqs["sequences"];
}

/**
fold - string, Ex:
    "<.>"
*/
FoldCalculator.prototype.diffOriginal = function(fold){
    var difference = 0;
    var extra = 0;
    var missing = 0;
    var score;
    for (var i = 0; i < fold.length; i++){
        score = this.diffMatrix[this.original.charAt(i)][fold.charAt(i)];
        difference += score[0];
        extra += score[1];
        missing += score[2];
    }
    return {"difference": difference, "extra": extra, "missing": missing};
}

FoldCalculator.prototype.score = function(){
    return this.foldAll(this.sequences, this.p);
}

/**
original - string, Ex:
    "<.>"
*/
FoldCalculator.prototype.setOriginal = function(original){
    this.original = original;
}

/**
seqs - object, Ex:
    {"sequences": ["ACT", "ACG"], "fold":"<.>"}
*/
FoldCalculator.prototype.setAll = function(seqs){
    this.original = seqs.fold;
    this.sequences = seqs.sequences;
}

/**
seqs - array, Ex:
    ["ACT", "ACG"]
*/
FoldCalculator.prototype.setSeqs = function(seqs){
    this.sequences = seqs;
}

FoldCalculator.prototype.getOriginal = function(){
    return this.original;
}

FoldCalculator.sums = function(a, b, arr, weight){
	var ret = 0;
	for (var i = 0; i < arr.length; i++){
		ret += weight[arr[i].charAt(a)][arr[i].charAt(b)];
	}
    return ret;
}

FoldCalculator.prototype.backtrack = function(i, j, n, arr, parenArr){
    var k;
    k = arr[j*n + i];
    if ((0-this.THRESHOLD) <= k && k <= -1){
        console.log("go neg");
        parenArr[i] = '.';
        parenArr[j] = '.';
        this.backtrack(i+1, j-1, n, arr, parenArr);
    }else if (k < 0){
        parenArr[i] = '<';
        parenArr[j] = '>';
        this.backtrack(i+1, j-1, n, arr, parenArr);
    }else{
        if (i <= k && k+1 <= j){
            this.backtrack(i, k, n, arr, parenArr);
            this.backtrack(k+1, j, n, arr, parenArr);
        }
    }
}

FoldCalculator.prototype.foldAll = function(seqs, weight){
    var output = {};
    var n = seqs[0].length;
    var arr = new Array(n * n);
    
    /*
    D[i,j] = max {  D[i+1, j-1] + w(i,j)
                    D[i,k] + D[k+1,j]        where i <= k < j }
    where    w is weight (p/po)
            D is DP array (arr)
    */
    // init matrix
    for (var i = 0; i < n; i++){
        arr[i*n + i] = 0;
    }
    for (var i = 1; i < n; i++){
        arr[i*n + i-1] = 0;
    }
    // calculate
    for (var i = n-1; i >= 0; i--){
        for (var j = i; j < n; j++){
            if (j - i <= this.SHARP){        // disallow sharp bends
                arr[j*n + i] = -1;        // not paired
                arr[i*n + j] = 0;        // no score
            }else{
				var t = FoldCalculator.sums(i, j, seqs, weight);
                var max = arr[(i+1)*n + j-1] + t;
                arr[j*n + i] = -1 - t;
                
                for (var k = i; k < j; k++){
                    t = arr[i*n + k] + arr[(k+1)*n + j];
                    if (t > max){
                        max = t;
                        arr[j*n + i] = k;
                    }
                }
                arr[i*n + j] = max;
            }
        }
    }
    output.score = arr[n-1];
    var parenArr = new Array();
    this.backtrack(0,n-1,n,arr,parenArr);
    var str = "";
    for (var i = 0; i < parenArr.length; i++){
        if (parenArr[i] != null){
            str += parenArr[i];
        }else{
            str += '.';
        }
    }
    output.fold = str;
    return output;
}




