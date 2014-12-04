//--------------------------------------------------------------------------
//
//  jQuery Plugin Boilerplate
//
//--------------------------------------------------------------------------

/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in our plugin).

    // Create the defaults once
    var pluginName = "defaultPluginName",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // We already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );

//--------------------------------------------------------------------------
//
//  jQuery UI Widget-factory Plugin Boilerplate
//
//--------------------------------------------------------------------------

/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // define our widget under a namespace of your choice
    // with additional parameters e.g. 
    // $.widget( "namespace.widgetname", (optional) - an 
    // existing widget prototype to inherit from, an object 
    // literal to become the widget's prototype ); 

    $.widget( "namespace.widgetname" , {

        //Options to be used as defaults
        options: {
            someValue: null
        },

        //Setup widget (e.g. element creation, apply theming
        // , bind events etc.)
        _create: function () {

            // _create will automatically run the first time 
            // this widget is called. Put the initial widget 
            // setup code here, then we can access the element 
            // on which the widget was called via this.element. 
            // The options defined above can be accessed 
            // via this.options this.element.addStuff();
        },

        // Destroy an instantiated plugin and clean up 
        // modifications the widget has made to the DOM
        destroy: function () {

            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the 
            // base widget
            $.Widget.prototype.destroy.call( this );
            // For UI 1.9, define _destroy instead and don't 
            // worry about 
            // calling the base widget
        },

        methodB: function ( event ) {
            //_trigger dispatches callbacks the plugin user 
            // can subscribe to
            // signature: _trigger( "callbackName" , [eventObject], 
            // [uiObject] )
            // e.g. this._trigger( "hover", e /*where e.type == 
            // "mouseenter"*/, { hovered: $(e.target)});
            this._trigger( "methodA", event, {
                key: value
            });
        },

        methodA: function ( event ) {
            this._trigger( "dataChanged", event, {
                key: value
            });
        },

        // Respond to any changes the user makes to the 
        // option method
        _setOption: function ( key, value ) {
            switch ( key ) {
            case "someValue":
                // this.options.someValue = doSomethingWith( value );
                break;
            default:
                // this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked 
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );

//--------------------------------------------------------------------------
//
//  jQuery Namespaced Plugin Boilerplate
//
//--------------------------------------------------------------------------

/*!
 * jQuery namespaced "Starter" plugin boilerplate
 * Author: @dougneiner
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $ ) {
    if (!$.myNamespace) {
        $.myNamespace = {};
    };

    $.myNamespace.myPluginName = function ( el, myFunctionParam, options ) {
        // To avoid scope issues, use "base" instead of "this"
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $( el );
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data( "myNamespace.myPluginName" , base );

        base.init = function () {
            base.myFunctionParam = myFunctionParam;

            base.options = $.extend({}, 
            $.myNamespace.myPluginName.defaultOptions, options);

            // Put our initialization code here
        };

        // Sample Function, Uncomment to use
        // base.functionName = function( parameters ){
        // 
        // };
        // Run initializer
        base.init();
    };

    $.myNamespace.myPluginName.defaultOptions = {
        myDefaultValue: ""
    };

    $.fn.mynamespace_myPluginName = function 
        ( myFunctionParam, options ) {
        return this.each(function () {
            (new $.myNamespace.myPluginName( this, 
            myFunctionParam, options ));
        });
    };

})( jQuery );
