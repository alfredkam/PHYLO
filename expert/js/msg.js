function MessageBox(id){
    this._area = $("#" + id);
    this._area.bind("mousedown", function(){return false;});
}
MessageBox.prototype.println = function(str){
    this._area.val(this._area.val() + str + "\n");
    this._area.scrollTop(this._area.get(0).scrollHeight);
    return this;
}
MessageBox.prototype.append = function(str){
    this._area.val(this._area.val() + str);
    return this;
}
MessageBox.prototype.clear = function(){
    this._area.val("");
    return this;
}
MessageBox.prototype.setText = function(str){
    this._area.val(str);
    console.log(this._area.val());
    return this;
}
MessageBox.prototype.getText = function(){
    return this._area.val();
}

