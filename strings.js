if(!String.prototype.toHtmlElement){
    String.prototype.toHtmlElement = function(){
        var el;
        var _root = document.createElement('div');
            _root.style.display = "none";
            _root.innerHTML = this;
            if(!_root.firstChild || _root.firstChild.nodeType != 1) {
                el = _root;
                el.removeAttribute("style");
            } else {el = _root.firstChild;}
            return el;
    };
};


