/* FlagBack
 * waitfor -- everything. cbpipe + async-waitfor
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.FlagBack = factory();
  }
}(this, function() {
    var _wf = function() {
        var wf = function() {
            this.ran = false;
            this.q = [];
        };
        
        wf.prototype.builder = function() {
            var that = this;
            
            return function(cb) {
                if(typeof cb == 'function') {
                    if(that.ran === true) {
                        cb();
                    } else {
                        that.q.push(cb);
                    }
                } else {
                    if(that.ran === false) {
                        that.q.forEach(function(v, i, a) {
                            v();
                        });
                        
                        that.q = [];
                    }
                    
                    that.ran = true;
                }
            };
        };
        
        return (new wf()).builder();
    },
    waitFor = _wf,
    CBpipe = function(cb, once) {
        this.stack = [];
        this.cbs = 0;
        this.cb = cb;
        this.once = (typeof once == 'boolean') ? once : false;
        this.called = false;
        this.wait = waitFor();
    };
    
    CBpipe.prototype.add = function() {
        var that = this, 
            i = that.stack.push(function() {
                setTimeout(function() {
                    delete that.stack[i];
                    that.cbs--;
                    
                    if(that.cbs === 0 && (that.once ? (that.called === false) : !that.once)) {
                        that.stack = [];
                        that.called = true;
                        that.cb();
                    }
                }, 1);
            }) - 1;
        
        that.cbs++;
        
        return function() {
            that.wait(that.stack[i]);
        };
    };
    
    CBpipe.prototype.flow = function() {
        this.wait();
    };
    
    return CBpipe;
}));
