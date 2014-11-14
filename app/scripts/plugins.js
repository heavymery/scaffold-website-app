// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

//--------------------------------------------------------------------------
//
//  Extends
//
//--------------------------------------------------------------------------

//----------------------------------
//  String
//----------------------------------

// usage: "{0} is {1} ...".format("A", "B");
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

//----------------------------------
//  Array
//----------------------------------

Array.prototype.contains = function( value ){
    for(var i in this){
        if( this.hasOwnProperty(i) && this[i] === value){
            return true;
        }
    }
    return false;
};

//----------------------------------
//  Modernizr
//----------------------------------

Modernizr.cssprefixed = function(str) {
    return this.prefixed(str).replace(/([A-Z])/g, 
        function(str,m1) {
            return '-' + m1.toLowerCase();
        }
    ).replace(/^ms-/,'-ms-');
};

//--------------------------------------------------------------------------
//
//  Adjust cross-browser issues
//
//--------------------------------------------------------------------------

//----------------------------------
//  requestAnimationFrame
//----------------------------------

window.requestAnimationFrame 
    = window.requestAnimationFrame || window.mozRequestAnimationFrame 
    || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

//--------------------------------------------------------------------------
//
//  Helpers
//
//--------------------------------------------------------------------------

//----------------------------------
//  User Agent
//----------------------------------

// browser user-agent
var userAgent = window.navigator.userAgent.toLowerCase();

// browser app-version
var appVersion = window.navigator.appVersion.toLowerCase();

// check flag that browser is opera or not.
var isOpera = (userAgent.indexOf('opera')+1?1:0);

// check flag that browser is safari or not.
var isSafari = (appVersion.indexOf('safari')+1?1:0);

/**
 * Get Browser name
 * @return {string} chrome, safari, gecko(firefox), opera, ie(is6|ie7|ie8|ie9).
 */
var getBrowserName = function() {
    if (userAgent.indexOf('opera') != -1) {
        return 'opera';
    } else if (userAgent.indexOf("msie") != -1) {
        if (appVersion.indexOf("msie 6.") != -1) {
           return 'ie6';
        } else if (appVersion.indexOf("msie 7.") != -1) {
           return 'ie7';
        } else if (appVersion.indexOf("msie 8.") != -1) {
           return 'ie8';
        } else if (appVersion.indexOf("msie 9.") != -1) {
           return 'ie9';
        } else {
            return 'ie';
        }
    } else if (userAgent.indexOf('chrome') != -1) {
        return 'chrome';
    } else if (userAgent.indexOf('safari') != -1) {
        return 'safari';
    } else if (userAgent.indexOf('gecko') != -1) {
        return 'gecko';
    } else {
        return undefined;
    }
};

//----------------------------------
//  Browser size, Scroll position
//----------------------------------

/**
 * Get screen size.
 * @return {object} x/y: current width/height, mx/my: minum width/height.
 */
var getScreenSize = function() {
    var obj = new Object();
    
    if (!isSafari && !isOpera) {
        obj.x = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
        obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
    } else {
        obj.x = window.innerWidth;
        obj.y = window.innerHeight;
    }
    
    obj.mx = parseInt((obj.x)/2);
    obj.my = parseInt((obj.y)/2);
    
    obj.toString = function(){
        return this.x + "x" + this.y + "(min-" + this.mx + "x" + this.my + ")";
    };
    return obj;
};

/**
 * Get document size.
 */
function getDocumentSize() {
    var obj = new Object();
    obj.x = document.documentElement.scrollWidth || document.body.scrollWidth;
    obj.y = document.documentElement.scrollHeight || document.body.scrollHeight;
    
    obj.toString = function(){
        return this.x + "x" + this.y;
    };
    return obj;
}

/**
 * Get scroll position.
 */
function getScrollPosition() {
    var obj = new Object();
    obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
    obj.y = document.documentElement.scrollTop || document.body.scrollTop;
    
    obj.toString = function(){
        return this.x + "x" + this.y;
    };
    return obj;
}

/**
 * Scroll to top with scroll-animation.
 */
var scrollToTop = function() {
    $('body , html').animate({ scrollTop: 0 }, "normal", "easeOutQuad");
};

/**
 * Open new window(not tab).
 */
var openPopupWindow = function(url, width, height) {
    var left = Number((window.screen.width - width)/2);
    var top = Number((window.screen.height - height)/2);
    
    window.open(url,"_blank","toolbar=0,location=0,menubar=0," + 
                    "width={0},height={1},left={2},top={3}".format(width, height, left, top));
};

//----------------------------------
//  Touch gestures
//----------------------------------

/**
 * Available touch gestures.
 * - Tap
 * - Double Tap
 * - Flick
 * - Drag
 * - Pinch Open (Spread)
 * - Pinch Close (Pinch)
 * - Touch and hold (Press)
 * - Two-finger scroll (Drag with two-finger)
 */
var touchStartHandler = function(event) {
    $(this).attr("touchstarted","true");
    $(this).attr("touchmoved","false");
};

var touchMoveHandler = function(event) {
    $(this).attr("touchmoved","true");
};

var touchEndHandler = function(event, tapedHandler) {
    if(event.target.attr("touchmoved") != "true") {
        //console.log("tap");
        tapedHandler();
    }
};

//----------------------------------
//  Parse RSS feeds
//----------------------------------

/**
 * Parse RSS
 * (load RSS feeds data as json)
 * 
 * @param {string} url RSS url.
 * @param {number} count Feeds count for load. 
 * @param {function} callback 
 */
var parseRSS = function(url, count, callback) {
  $.ajax({
    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + count + '&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    success: function(data) {
      callback(data.responseData.feed);
    }
  });
};

//----------------------------------
//  Count SNS share
//----------------------------------

/**
 * Tweet Count
 * (load twitter tweets counts)
 * 
 * @param {string} element that show count number
 * @param {string} target shared url 
 */
var tweetCount = function (target, url) {
    if(!target) return;
    var pageURL = (url) ? url : location.href;

    $.ajax({
        type: 'GET',
        url: 'http://urls.api.twitter.com/1/urls/count.json',
        data: {
                url : encodeURI(pageURL),
                noncache: new Date()
        },
        dataType: 'jsonp',
        success: function(data) {
            target.text(data.count);
            //console.log(target);
            //console.log("twitter tweet:" + data.count);
        }
    });
};

/**
 * Like Count
 * (load facebook like counts)
 * 
 * @param {string} element that show count number 
 * @param {string} target shared url 
 */
var likeCount = function (target, url) {
    if(!target) return;
    var pageURL = (url) ? url : location.href;

    $.ajax({
        type: 'GET',
        url: 'http://graph.facebook.com/' + pageURL,
        dataType: 'jsonp',
        success: function(data) {
            var count = (data.shares)? data.shares : 0;
            target.text(count);
            //console.log("facebook like:" + count);
        }
    });
};

/**
 * Hatebu Count
 * (load hatena book-mark counts)
 * 
 * @param {string} element that show count number 
 * @param {string} target shared url 
 */
var hatebuCount = function (target, url) {
    if(!target) return;
    var pageURL = (url) ? url : location.href;

    $.ajax({
        type: 'GET',
        url: 'http://api.b.st-hatena.com/entry.count',
        data: {
                url : pageURL
        },
        dataType: 'jsonp',
        success: function(data) {
            var count = (data)? data : 0;
            target.text(count);
            //console.log("hatena book-mark:" + count);
        }
    });
};

//--------------------------------------------------------------------------
//
//  jQuery Plugins
//
//--------------------------------------------------------------------------

//----------------------------------
//  Helpers
//----------------------------------

(function($){
    
    if(!$.hm) $.hm = {};
    
    $.extend($.hm, {
        
        getPoint : function(event) {
            var point;
                
            if(event.type.indexOf("touch") != -1) {
                if(event.touches && event.touches.length > 0) {
                    point = { 
                        x:event.touches[0].pageX,
                        y:event.touches[0].pageY
                    };
                } else {
                    point = { 
                        x:event.changedTouches[0].pageX,
                        y:event.changedTouches[0].pageY
                    };
                }
            } else {
                point = { 
                    x:event.pageX,
                    y:event.pageY
                };
            }
            
            return point;
        },
        
        orientation : function() {
            switch(window.orientation) {
                case 0: // Portrait
                    // document.body.setAttribute('orient', 'portrait');
                    //window.alert("Portrait");
                    return "portrait";
             
                case -90: // Landscape (right, screen turned clockwise)
                    // document.body.setAttribute('orient', 'landscape');
                    //window.alert("Landscape (right, screen turned clockwise)");
                    return "landscape-90";
             
                case 90: // Landscape (left, screen turned counterclockwise)
                    // document.body.setAttribute('orient', 'landscape');
                    //window.alert("Landscape (left, screen turned counterclockwise)");
                    return "landscape+90";
             
                case 180: // Portrait (upside-down portrait)
                    // document.body.setAttribute('orient', 'portrait');
                    //window.alert("Portrait (upside-down portrait)");
                    return "portrait+180";
            }
        },
        
        /**
         * Get matrix object from CSS transform value. 
         */
        getMatrix : function(value) {
            var matrix;
            //console.log(value);
            
            var matrixArray = value.substr(7, value.length - 8).split(', ');
            if(matrixArray.length == 6) {
                matrix = {
                    transX: parseFloat(matrixArray[4]), transY: parseFloat(matrixArray[5]),
                    scaleX: parseFloat(matrixArray[0]), scaleY: parseFloat(matrixArray[3]),
                    screwX: parseFloat(matrixArray[1]), screwY: parseFloat(matrixArray[2])
                };
            } else {
                matrix = {
                    transX: parseFloat(matrixArray[12]), transY: parseFloat(matrixArray[13]), transZ: parseFloat(matrixArray[14]),
                    scaleX: parseFloat(matrixArray[0]) , scaleY: parseFloat(matrixArray[5]) , scaleZ: parseFloat(matrixArray[10]),
                    screwX: parseFloat(matrixArray[1]) , screwY: parseFloat(matrixArray[4])
                };
            }
            
            //console.log(matrix);
            
            return matrix;
        },
        
        /**
         * Check that UserAgent is mobile browser, or not(PC browser).
         * @return {boolean} true: UA is mobile browser, false: UA is PC browser.
         */
        isMobile : (
            (userAgent.indexOf('iphone') > 0 && userAgent.indexOf('ipad') == -1) 
            || userAgent.indexOf('ipod') > 0 || userAgent.indexOf('android') > 0
        )
        
    });
    
})(jQuery);

//----------------------------------
//  Mouse Wheel
//----------------------------------

/*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

}));

//----------------------------------
//  CSS 2D Transform
//----------------------------------

/*!
 * CSS 2D Transform 1.0.0
 * http://heavymery.net
 * 
 */
(function($){
    
    $.widget( "hm.transform2d", {
        options:  {
            transformOriginX: 0,
            transformOriginY: 0,
            transX: 0, 
            transY: 0, 
            scaleX: 1, 
            scaleY: 1, 
            skewX: 0, 
            skewY: 0,             
            rotate: 0
        },
        
        _create: function() {
            //console.log(this.namespace + "." + this.widgetName + " create");
            
            this._applyTransform();
        },
        
        _destroy: function() {
            //console.log(this.namespace + "." + this.widgetName + " destroy");
        },
        
        _setOption: function( key, value ) {
            switch ( key ) {
                case "transformOriginX":
                    this.options.transformOriginX = value;
                    break;
                case "transformOriginY":
                    this.options.transformOriginY = value;
                    break;
                case "transX":
                    this.options.transX = value;
                    break;
                case "transY":
                    this.options.transY = value;
                    break;
                case "scaleX":
                    this.options.scaleX = value;
                    break;
                case "scaleY":
                    this.options.scaleY = value;
                    break;
                case "rotate":
                    this.options.rotate = value;
                    break;                    
                case "skewX":
                    this.options.skewX = value;
                    break;
                case "skewY":
                    this.options.skewY = value;
                    break;                                        
                default:
                    return;
            }
            
            this._applyTransform();
        },
        
        _applyTransform: function() {
            
            this.element.css("transform-origin", 
                "{0} {1}".format(this.options.transformOriginX, this.options.transformOriginY));
            
            this.element.css("transform", 
                "translate({0}px,{1}px) scale({2},{3}) rotate({4}deg) skew({5}deg,{6}deg)"
                .format(
                    this.options.transX, this.options.transY, 
                    this.options.scaleX, this.options.scaleY,
                    this.options.rotate,
                    this.options.skewX, this.options.skewY)
                );
            
            // TODO: using matrix?
        }
    
    });
    
    $.widget.bridge("hm_transform2d", $.hm.transform2d);

})(jQuery);

//----------------------------------
//  CSS 3D Transform
//----------------------------------

/*!
 * CSS 3D Transform 1.0.0
 * http://heavymery.net
 * 
 */
(function($){
    
    $.widget( "hm.transform3d", {
        options:  {
            transformOriginX: 0,
            transformOriginY: 0,
            transformOriginZ: 0,
            transX: 0, 
            transY: 0, 
            transZ: 0, 
            scaleX: 1, 
            scaleY: 1, 
            scaleZ: 1, 
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            perspective: 0,
            perspectiveOriginX: 0,
            perspectiveOriginY: 0
        },
        
        _create: function() {
            //console.log(this.namespace + "." + this.widgetName + " create");
            
        },
        
        _init: function() {
            //console.log(this.namespace + "." + this.widgetName + " create");
            
            this.element.css("transform-style", "preserve-3d");
            this._applyTransform();
        },
        
        _destroy: function() {
            //console.log(this.namespace + "." + this.widgetName + " destroy");
        },
        
        _setOption: function( key, value ) {
            switch ( key ) {
                case "transformOriginX":
                    this.options.transformOriginX = value;
                    break;
                case "transformOriginY":
                    this.options.transformOriginY = value;
                    break;
                case "transformOriginZ":
                    this.options.transformOriginZ = value;
                    break;
                case "transX":
                    this.options.transX = value;
                    break;
                case "transY":
                    this.options.transY = value;
                    break;
                case "transZ":
                    this.options.transZ = value;
                    break;                    
                case "scaleX":
                    this.options.scaleX = value;
                    break;
                case "scaleY":
                    this.options.scaleY = value;
                    break;
                case "scaleZ":
                    this.options.scaleZ = value;
                    break;
                case "rotateX":
                    this.options.rotateX = value;
                    break;
                case "rotateY":
                    this.options.rotateY = value;
                    break;
                case "rotateZ":
                    this.options.rotateZ = value;
                    break;
                case "perspective":
                    this.options.perspective = value;
                    break;
                case "perspectiveOriginX":
                    this.options.perspectiveOriginX = value;
                    break;
                case "perspectiveOriginY":
                    this.options.perspectiveOriginY = value;
                    break;
                default:
                    return;
            }
            
            this._applyTransform();
        },
        
        _applyTransform: function() {
            this.element.css("transform-origin", "{0} {1} {2}"
                .format(
                    this.options.transformOriginX, 
                    this.options.transformOriginY, 
                    this.options.transformOriginY
                )
            );
                
            this.element.css("transform", 
                "translate3d({0}px,{1}px,{2}px) scale3d({3},{4},{5}) rotateX({6}deg) rotateY({7}deg) rotateZ({8}deg)"
                .format(
                    this.options.transX, this.options.transY, this.options.transZ, 
                    this.options.scaleX, this.options.scaleY, this.options.scaleZ,
                    this.options.rotateX, this.options.rotateY, this.options.rotateZ
                )
            );
            
            this.element.css("perspective", "{0}".format(this.options.perspective));
            
            this.element.css("perspective-origin", "{0} {1}"
                .format(
                    this.options.perspectiveOriginX, 
                    this.options.perspectiveOriginY
                )
            );
            
            // TODO: using matrix?
        }
    
    });
    
    $.widget.bridge("hm_transform3d", $.hm.transform3d);

})(jQuery);

//----------------------------------
//  DrumPicker
//----------------------------------

/*!
 * DrumPicker 1.0.0
 * http://heavymery.net
 *
 * Copyright 2013 HeavyMery
 * Released under the MIT license.
 * http://...
 *
 * http://.../
 * 
 * Depends:
 *  ...
 */
(function($){
    
    $.widget( "hm.drumpicker", {
        options: {
            selectedItem : null,
            selectedIndex: -1,
            selectedLabel: "",
            selectedValue: null,
            valueProperty: null,
            immediatelyUpdate: false
        },
        
        _container: null,
        _containerWidth: 0,
        _containerHeight: 0,
        
        _children: null,
        _childWidth: 0,
        _childHeight: 0,
        _childrenOrigin: null,
        
        _originX: undefined,
        _originY: undefined,
        _offsetX: 0,
            
        _create: function() {
            //console.log("{0}-{1} create".format(this.widgetFullName, this.uuid));
                    
            this._container = this.element;
            this._children = this._container.children();
            this._childrenOrigin = this._container.children();
            
            this._initialize();
            this._invalidateLayout();
            
            // TODO: set selected option
            this.options.selectedItem = this._children.eq(0);
            
            this.option(this.options);
            
            // set interaction
            var startPoint, oldPoint;
            var startTime;
            var delta;
            var self = this;
            this._container.bind("mousedown touchstart", function() {
                startPoint = $.hm.getPoint(event);
                oldPoint = null;
                
                startTime = Date.now();
                
                self._children.css("transition","");
                
                var lastRendered = new Date();
                requestAnimationFrame(function(){
                    
                    
                    //var now = new Date();
                    //var elapsed = now - lastRendered;
                    //if(elapsed > 1000/30) {
                        //console.log(elapsed);
                        //lastRendered = now;
                        
                        if(moved) {
                            self._invalidateLayout();
                            moved = false;
                        }
                    //}
                    
                   if(startPoint) {
                       requestAnimationFrame(arguments.callee);
                   } 
                });
            });
            
            var moved = false;
            $(document).bind("mousemove touchmove", function() {
                if(startPoint) {
                    var newPoint = $.hm.getPoint(event);
                    if(oldPoint) {
                        delta = {
                            x:newPoint.x - oldPoint.x,
                            y:newPoint.y - oldPoint.y  
                        };
                    } else {
                        delta = {
                            x:newPoint.x - startPoint.x,
                            y:newPoint.y - startPoint.y  
                        };
                    }
                    oldPoint = newPoint;
                    
                    self._offsetX += delta.x;
                    //self._invalidateLayout();
                    moved = true;
                }
            });
            
            $(document).bind("mouseup touchend", function() {
                if(startPoint) {
                    var newPoint = $.hm.getPoint(event);
                    totalDelta = {
                        x:newPoint.x - startPoint.x,
                        y:newPoint.y - startPoint.y  
                    };
                    startPoint = null;
                    
                    var duration = Date.now() - startTime;
                    if((duration < 300 || self._offsetX != 0) // minimum time for inertia animation
                        && totalDelta.x != 0) { 
                        var speed = Math.abs((totalDelta.x / (duration / 10)));
                        //speed *= 100;
                        speed = Math.round(speed);
                        //speed /= 100;
                        //speed = Math.min(speed, 15); // maximum speed
                        var decel = -0.5;
                        //console.log(delta.x, time, speed);
                        //speed - (speed%self._childWidth);
                        //console.log(self._childWidth % speed);
                        
                        
                        var lastRendered = new Date();
                        requestAnimationFrame(function(){
                            //console.log(speed);
                            speed += decel;
                            //if(speed <= 0 && self._offsetX != 0) {
                            //    speed = -decel;
                            //}
                            
                            if(delta.x > 0) {
                                self._offsetX += speed; 
                            } else {
                                self._offsetX -= speed;
                            }
                            
                            //var now = new Date();
                            //var elapsed = now - lastRendered;
                            //if(elapsed > 1000/60) {
                                //console.log(elapsed);
                                //lastRendered = now;
                                
                                self._invalidateLayout();
                            //}
                            
                            if(!startPoint && speed > 0) {    
                                requestAnimationFrame(arguments.callee);
                            } else if (self._offsetX != 0) {
                                var endSpeed = 2;
                                requestAnimationFrame(function(){
                                    self._offsetX = Math.floor(self._offsetX);
                                    if(Math.abs(self._offsetX) < endSpeed) {
                                        self._offsetX = 0;
                                    } else {
                                        if(self._offsetX > 0) {
                                            self._offsetX -= endSpeed;
                                        } else {
                                            self._offsetX += endSpeed;
                                        }
                                    }
                                    
                                    self._invalidateLayout();
                                    
                                    if(self._offsetX != 0) {
                                        requestAnimationFrame(arguments.callee);
                                    } else {
                                        if(!self.options.immediatelyUpdate) {
                                            self._onSelectedItemChanged(self._children.eq(0));
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },
        
        _refresh: function() {
            this._initialize();
            this._invalidateLayout();
        },
        
        _initialize: function() {
            this._container.css("overflow", "hidden");
            
            var containerPosition = this._container.css("position");
            if(containerPosition != "relative" && containerPosition != "absolute") {
                this._container.css("position", "relative");
            }
            
            this._containerWidth = this._container.innerWidth();
            this._containerHeight = this._container.innerHeight();
            
            this._children = this._container.children();
            this._children.css({
                position: "absolute",
                top: 0,
                left: 0
            });
            //this._children.css("transition", "{0} .5s ease-in".format(Modernizr.cssprefixed("transform")));
            this._children.transform3d();
            
            var childWidth = 0;
            var childHeight = 0;
            this._children.each(function(){
               childWidth = Math.max(childWidth, $(this).outerWidth());
               childHeight = Math.max(childHeight, $(this).outerHeight());
            });
            this._childWidth = childWidth;
            this._childHeight = childHeight;
            
            if(this._originX == undefined || this._originY == undefined) {
                this._originX = (this._containerWidth / 2);
                this._originY = (this._containerHeight / 2);
            }
        },
        
        _invalidateLayout: function() {
            if(Math.abs(this._offsetX) >= this._childWidth) {
                // rotate children
                var tempArray = this._children.toArray();
                if(this._offsetX < 0) {
                    // ascending
                    tempArray.push(tempArray.shift());
                } else {
                    // descending
                    tempArray.unshift(tempArray.pop());
                }
                for(var i=0,j=this._children.length; i<j; i++){
                  this._children[i] = tempArray[i];
                };
                
                this._offsetX = 0;
                
                if(this.options.immediatelyUpdate) {
                    this._onSelectedItemChanged(this._children.eq(0));
                }
            }
            
            var legnthHalf = Math.round(this._children.length / 2);
            for (var i = 0; i < legnthHalf; i++) {
                //var offsetX = this._originX + this._offsetX + i * this._childWidth;
                //this._children.eq(i).transform2d({ transX: offsetX - this._childWidth / 2 });
                var left = i * this._childWidth - this._childWidth / 2;
                //this._children.eq(i).css("left","{0}px".format(left));
               this._children.eq(i).transform3d({ transX: this._originX + this._offsetX + left });
            }
            for (var i = legnthHalf; i < this._children.length; i++) {
                //var offsetX = this._originX + this._offsetX + (i - this._children.length) * this._childWidth;
                //this._children.eq(i).transform2d({ transX: offsetX - this._childWidth / 2 });
                var left = (i - this._children.length) * this._childWidth - this._childWidth / 2;
                //this._children.eq(i).css("left","{0}px".format(left));
                this._children.eq(i).transform3d({ transX: this._originX + this._offsetX + left });
            }
        },
          
        _onSelectedItemChanged: function(selectedItem) {
            this._children.removeClass("selected");
            selectedItem.addClass("selected");
            
            this.options.selectedItem  = selectedItem[0];
            this.options.selectedIndex = this._childrenOrigin.index(selectedItem);
            this.options.selectedLabel = selectedItem[0].textContent;
            
            if(this.options.valueProperty) {
                this.options.selectedValue = selectedItem.data(self.options.valueProperty);
            } else {
                this.options.selectedValue = this.options.selectedLabel;
            }
            
            //console.log(this.options);
            
            this._trigger("changed", event, {
                selectedItem : this.options.selectedItem,
                selectedIndex: this.options.selectedIndex,
                selectedIndex: this.options.selectedIndex,
                selectedLabel: this.options.selectedLabel,
                selectedValue: this.options.selectedValue
            });
        },  
        
        _destroy: function() {
            // TODO: unbind event handlers
            //console.log("{0}-{1} destroy".format(this.widgetFullName, this.uuid));
        },
        
        _setOption: function( key, value ) {
            switch(key) {
                case "selectedLabel":
                    var currentIndex = this.options.selectedIndex > -1 ? this.options.selectedIndex : 0;
                    if(value != "") {
                        var self = this; 
                        self._children.each(function(){
                            if($(this)[0].textContent == value) {
                                self._onSelectedItemChanged($(this));
                            }
                        });
                    }
                    //console.log(self.options);
                    var indexOffset = self.options.selectedIndex - currentIndex;
                    if(indexOffset != 0) {
                        var tempArray = this._children.toArray();
                        
                        if(indexOffset > 0) {
                            for(var i = 0; i < indexOffset; i++) {
                                tempArray.push(tempArray.shift());
                            }
                        } else {
                            for(var i = indexOffset; i < 0; i++) {
                                tempArray.unshift(tempArray.pop());
                            }
                        }
                        
                        for(var i=0,j=this._children.length; i<j; i++){
                          this._children[i] = tempArray[i];
                        };
                    }
                    self._invalidateLayout();
                    break;
            }
        },
        
        next: function() {
            //console.log("{0}-{1} next".format(this.widgetFullName, this.uuid));
            
            var speed = 6;
            var decel = 0.5;
            
            var self = this;
            requestAnimationFrame(function(){
                self._offsetX = Math.floor(self._offsetX);
                
                self._offsetX -= speed;
                if(speed > 0) {
                    speed -= decel;
                } else {
                    speed = decel;
                }
                
                self._invalidateLayout();
                
                if(self._offsetX != 0) {
                    requestAnimationFrame(arguments.callee);
                } else {
                    if(!self.options.immediatelyUpdate) {
                        self._onSelectedItemChanged(self._children.eq(0));
                    }
                }
            });
        },
        
        previous: function() {
            //console.log("{0}-{1} previous".format(this.widgetFullName, this.uuid));
            
            var speed = 6;
            var decel = 0.5;
            
            var self = this;
            requestAnimationFrame(function(){
                self._offsetX = Math.floor(self._offsetX);
                
                self._offsetX += speed;
                if(speed > 0) {
                    speed -= decel;
                } else {
                    speed = decel;
                }
                
                self._invalidateLayout();
                
                if(self._offsetX != 0) {
                    requestAnimationFrame(arguments.callee);
                } else {
                    if(!self.options.immediatelyUpdate) {
                        self._onSelectedItemChanged(self._children.eq(0));
                    }
                }
            });
        }
    });

    $.widget.bridge("hm_drumpicker", $.hm.drumpicker);
    
})(jQuery);

//----------------------------------
//  ListerPicker
//----------------------------------

(function($){
    
    $.widget( "hm.listpicker", {
        options: {
            selectedItem : null,
            selectedIndex: -1,
            selectedLabel: "",
            selectedValue: null,
            valueProperty: null
        },
        
        _container: null,
        _children: null,
        
        _create: function() {
            this._container = this.element;
            this._children = this._container.children();
            
            this.option(this.options);
            
            var self = this;
            self._children.bind("click touchstart", function(event){
                event.preventDefault();
                
                var targetItem = $(event.target);
                while(self._children.index(targetItem) < 0) {
                    targetItem = targetItem.parent();
                }
                
                //console.log(targetObj.parent());
                
                self._onSelectedItemChanged(targetItem);
            });
        },
        
        _onSelectedItemChanged: function(selectedItem) {
            if(!(selectedItem instanceof jQuery)) {
                selectedItem = $(selectedItem);
            }
            
            this._children.removeClass("selected");
            selectedItem.addClass("selected");
                
            this.options.selectedItem  = selectedItem[0];
            this.options.selectedIndex = this._children.index(selectedItem);
            this.options.selectedLabel = selectedItem[0].textContent;
            
            if(this.options.valueProperty) {
                this.options.selectedValue = selectedItem.data(this.options.valueProperty);
            } else {
                this.options.selectedValue = this.options.selectedLabel;
            }
            
            //console.log(this.options);
            
            this._trigger("changed", event, {
                selectedItem : this.options.selectedItem,
                selectedLabel: this.options.selectedLabel,
                selectedValue: this.options.selectedValue
            });
        },
        
        _setOption: function( key, value ) {
            //console.log("{0}-{1} _setOption".format(this.widgetFullName, this.uuid));
            switch(key) {
                case "selectedItem":
                    if(value && this._children.index(value) > -1) {
                        this._onSelectedItemChanged(value);
                    }
                    break;
                case "selectedIndex":
                    if(value > -1 && this._children[value]) {
                        this._onSelectedItemChanged(this._children[value]);
                    }
                    break;
                case "selectedLabel":
                    if(value != "") {
                        var self = this; 
                        self._children.each(function(){
                            if($(this)[0].textContent == value) {
                                self._onSelectedItemChanged($(this));
                            }
                        });
                    }
                    break;
                case "selectedValue":
                    if(value) {
                        var self = this; 
                        var valueProperty = self.options.valueProperty;
                        if(valueProperty) {
                            self._children.each(function(){
                                var data = $(this).data(valueProperty);
                                if(data.toString() == value) {
                                    self._onSelectedItemChanged($(this));
                                }
                            });
                        } else {
                            self._children.each(function(){
                                if($(this)[0].textContent == value) {
                                    self._onSelectedItemChanged($(this));
                                }
                            });
                        }
                    }
                    break;
            }
        }
    });
    
    $.widget.bridge("hm_listpicker", $.hm.drumpicker);
    
})(jQuery);

//----------------------------------
//  Flickable
//----------------------------------

(function($){
    
    $.widget( "hm.flickable", {
        options: {
            
        },
        
        _create: function() {
            //console.log("{0}-{1} _create".format(this.widgetFullName, this.uuid));
            //return;
            //console.log(this);
            this.element.transform3d();
            
            var self = this;
            this.element.bind("mousedown touchstart", function(){
                var point = $.hm.getPoint(event);
                self._moveStartPoint = point;
                self._moveStartTime = Date.now();
                self._moveStartTransX = self.element.transform3d("option", "transX");
                
                self.element.removeClass("transition");
            });
            
            $(document).bind("mousemove touchmove", function(){
                if(event.touches && event.touches.length > 1) {
                    return;
                };
                
                var point = $.hm.getPoint(event);
                
                if(self._moveStartPoint) {
                    var delta = {
                        x:point.x - self._moveStartPoint.x,
                        y:point.y - self._moveStartPoint.y  
                    };
                    
                    self.element.transform3d({
                        transX: delta.x + self._moveStartTransX
                    });
                    
                        
                    /*if(!(tuningControl.find(".tuning-panel")).hasClass("visible")) {
                        if(this.element.transform3d("option", "transX") < -10) {
                            tuningControl.addClass("hide");
                        } else {
                            tuningControl.removeClass("hide");
                        }
                    }*/
                }
            });
            
            $(document).bind("mouseup touchend", function(){
                if(self._moveStartPoint) {
                    if(event.touches && event.touches.length > 0) {
                        self._moveStartPoint = getPoint(event);
                        return;    
                    }
                    
                    var point = $.hm.getPoint(event);
                
                    var delta = {
                        x:point.x - self._moveStartPoint.x,
                        y:point.y - self._moveStartPoint.y  
                    };
                    
                    var time = Date.now() - self._moveStartTime;
                    //console.log(delta.x / time);
                    
                    self._moveStartPoint = null;
                    
                    //minTransX = - fretboard.outerWidth() + getDocumentSize().x - 110;
                    if(self._zoomRate >= 1) {
                        //maxTransX = (fretboardZoomRate - 1) * (fretboard.outerWidth() + 110) / 2;
                    } else {
                        //maxTransX = 0;
                        //minTransX = - fretboard.outerWidth() + getDocumentSize().x - 110;
                    }
                    
                    var transX = self.element.transform3d("option", "transX");
                    var offset = self.element.offset();
                    self._minTransX = 
                        - (self.element.outerWidth() * self._zoomRate) 
                        + getDocumentSize().x - (offset.left - transX);
                        
                    self._maxTransX = 
                        (self._zoomRate - 1) * (self.element.outerWidth() + 110) / 2;
                
                    var transX = self.element.transform3d("option", "transX");
                    
                    if(transX > self._maxTransX) {
                        self.element.addClass("transition");
                        self.element.transform3d({transX: self._maxTransX});
                    } else if(transX < self._minTransX) {
                        self.element.addClass("transition");
                        self.element.transform3d({transX: self._minTransX});
                    } else {
                        //fretboard.addClass("transition");
                        //fretboard.css(Modernizr.prefixed("transform"), 
                        //    "translate3d({0}px,{1}px,0) scale({2},{2})"
                        //    .format(parseInt(matrix.transX) + delta.x, matrix.transY, fretboardZoomRate));
                        
                        
                        speed = (delta.x / (time / 10));
                        //speed *= 100;
                        speed = Math.round(speed);
                        //speed /= 100;
                        if(time > 300) speed = 0;
                        
                        //if(speed > 30) speed = 30;
                        
                        //console.log(delta.x, time, speed);
                        
                        if(delta.x > 0) {
                            accel = -0.5;
                        } else {
                            accel = 0.5;
                        }
                        
                        requestAnimationFrame(function(timestamp){
                            if (Math.floor(speed) != 0 && !self._moveStartPoint) {
                                
                                var transX = self.element.transform3d("option", "transX");
                                if(transX > self._minTransX && transX < self._maxTransX) {
                                    speed += accel;
                                    transX += speed;
                                    
                                    self.element.transform3d({transX: transX});
                                    //console.log(Math.round(timestamp/1000));
                                    requestAnimationFrame(arguments.callee);
                                } else if(transX > self._maxTransX) {
                                    self.element.addClass("transition");
                                    self.element.transform3d({transX: self._maxTransX});
                                } else if(transX < self._minTransX) {
                                    self.element.addClass("transition");
                                    self.element.transform3d({transX: self._minTransX});
                                }
                            }
                        });
                    }
                    
                }
            });

            /*this.element.bind("dblclick", this._dblClickHandler);
            $(document).bind('mousewheel', this._mouseWheelHandler);

            window.addEventListener("gesturestart", this._gestureStartHandler);
            window.addEventListener("gesturechange", this._gestureChangeHandler);
            
            window.addEventListener("resize", this._resizeHandler);*/
        },
        
        //_matrix: $.hm.getMatrix($(this.element).css(Modernizr.prefixed("transform"))),
        //_transX: matrix.transX,
        _speed: 1,
        _accel: 1,
        
        _stepHandler: function(timestamp) {
            if (Math.floor(speed) != 0 && !startPoint && (transX > minTransX && transX < maxTransX)) {
                speed += accel;
                transX += speed;
                
                fretboard.css(Modernizr.prefixed("transform"), 
                            "translate3d({0}px,{1}px,0) scale({2},{2})"
                            .format(transX, matrix.transY, fretboardZoomRate));
    
                //console.log(Math.round(timestamp/1000));
                requestAnimationFrame(arguments.callee);
            } else if(transX > maxTransX) {
                matrix = getMatrix(fretboard.css(Modernizr.prefixed("transform")));
                fretboard.addClass("transition");
                fretboard.css(Modernizr.prefixed("transform"), 
                    "translate3d({0}px,{1}px,0) scale({2},{2})"
                    .format(maxTransX, matrix.transY, fretboardZoomRate));
                    
                if(!(tuningControl.find(".tuning-panel")).hasClass("visible")) {
                    tuningControl.removeClass("hide");
                }
            } else if(transX < minTransX) {
                matrix = getMatrix(fretboard.css(Modernizr.prefixed("transform")));
                fretboard.addClass("transition");
                fretboard.css(Modernizr.prefixed("transform"), 
                    "translate3d({0}px,{1}px,0) scale({2},{2})"
                    .format(minTransX, matrix.transY, fretboardZoomRate));
                
                if(!(tuningControl.find(".tuning-panel")).hasClass("visible")) {
                    tuningControl.addClass("hide");
                }    
            }
        },
        
        //_minTransX: - fretboard.outerWidth() + getDocumentSize().x - 110,
        _maxTransX: 0,
        
        _moveStartPoint: null,
        
        _moveStartTime: null,
        
        _moveStartTransX: 0,
        
        _minTransX: 0,
        
        _zoomRate: 1
        
        /*
        _dblClickHandler: function(event) {
            event.preventDefault();
                
            //console.log("dblclick");
            
            if (event.shiftKey){
                if (event.altKey){
                    fretboardZoomRate -= 0.1;
                } else {
                    fretboardZoomRate -= 0.5;
                }
            } else {
                if (event.altKey){
                    fretboardZoomRate += 0.1;
                } else {
                    fretboardZoomRate += 0.5;
                }
            }   
            
            if(fretboardZoomRate < 0.25) {
                fretboardZoomRate = 0.25;
            }
            if(fretboardZoomRate > 2.0) {
                fretboardZoomRate = 2.0;
            }
            
            if(!fretboard.hasClass("transition")) {
                fretboard.addClass("transition");
            }
            //fretboard.css(Modernizr.prefixed("transform"), "scale({0})".format(fretboardZoomRate));
            //fretboard.css(Modernizr.prefixed("transform"), "scale3d({0},{0},{0})".format(fretboardZoomRate));
            var matrix = getMatrix(fretboard.css(Modernizr.prefixed("transform")));
            fretboard.css(Modernizr.prefixed("transform"), 
                //"scale({0},{0})"
                "translate3d({0}px,{1}px,0) scale({2},{2})"
                //.format(fretboardZoomRate));
                .format(matrix.transX, matrix.transY, fretboardZoomRate));    
        },
        
        _mouseWheelHandler: function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            if(fretboard.hasClass("transition")) {
                fretboard.removeClass("transition");
            }
            //console.log(delta, deltaX, deltaY);
            var amount = delta / 100;
            fretboardZoomRate += amount;
            
            fretboardZoomRate = fretboardZoomRate * 100;
            //if(delta < 0) {
            //    fretboardZoomRate = Math.floor(fretboardZoomRate);
            //} else {
                fretboardZoomRate = Math.round(fretboardZoomRate);
            //}
            fretboardZoomRate = fretboardZoomRate / 100;
            
            if(fretboardZoomRate < 0.25) {
                fretboardZoomRate = 0.25;
            }
            if(fretboardZoomRate > 2.0) {
                fretboardZoomRate = 2.0;
            }
            //$("#header p").html(fretboardZoomRate);
            
            //fretboard.css(Modernizr.prefixed("transform"), "scale({0})".format(fretboardZoomRate));
            //fretboard.css(Modernizr.prefixed("transform"), "scale3d({0},{0},{0})".format(fretboardZoomRate));
            //fretboard.css(Modernizr.prefixed("transform"), 
            //  "matrix({2},0,0,{2},{0},{1})"
            //  .format(currentMatrix[4],currentMatrix[5],fretboardZoomRate));
                    
            var matrix = getMatrix(fretboard.css(Modernizr.prefixed("transform")));
            fretboard.css(Modernizr.prefixed("transform"), 
                "translate3d({0}px,{1}px,0) scale({2},{2})"
                .format(matrix.transX, matrix.transY, fretboardZoomRate));    
        },
        
        _startZoomRate: 1,
        
        _gestureStartHandler: function(event) {
            if(fretboard.hasClass("transition")) {
                fretboard.removeClass("transition");
            }
            
            this._startZoomRate = fretboardZoomRate;
        },
        
        _gestureChangeHandler: function(event) {
                event.preventDefault();
                
                fretboardZoomRate =  this._startZoomRate * event.scale;
                
                if(fretboardZoomRate < 0.25) {
                    fretboardZoomRate = 0.25;
                }
                if(fretboardZoomRate > 2.0) {
                    fretboardZoomRate = 2.0;
                }
                
                var matrix = getMatrix(fretboard.css(Modernizr.prefixed("transform")));
                fretboard.css(Modernizr.prefixed("transform"), 
                    "translate3d({0}px,{1}px,0) scale({2},{2})"
                    .format(matrix.transX, matrix.transY, fretboardZoomRate));            
        },

        _resizeEventTimer: null,
        
        _resizeHandler: function(event) {
            clearTimeout(this._resizeEventTimer);
            this._resizeEventTimer = setTimeout(function() {
                var minTransX = - fretboard.outerWidth() + getDocumentSize().x - 110;
                
                var matrix = getMatrix(fretboard.css(Modernizr.prefixed("transform")));
                if(matrix.transX < minTransX) {
                    fretboard.css(Modernizr.prefixed("transform"), 
                        "translate3d({0}px,{1}px,0) scale({2},{2},1)"
                        .format(minTransX, matrix.transY, fretboardZoomRate));
                }
            }, 100);
        },
        */
    });
    
    $.widget.bridge("hm_flickable", $.hm.flickable);
    
})(jQuery);
