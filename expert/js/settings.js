
/**
 * @constructor
 */
function Settings(){
    this.prefix = "dcsettings-"
}

Settings.prototype.set = function(key, val){
    var strVal = JSON.stringify(val);
    localStorage.setItem(this.prefix + key, strVal);
}

Settings.prototype.get = function(key){
    var res = localStorage.getItem(this.prefix + key);
    return JSON.parse(res);
}

Settings.prototype.apply = function(){
    
}