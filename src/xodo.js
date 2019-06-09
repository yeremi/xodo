/** --------------------------------------
 * Xodo Javascript Library
 * -------------------------------------*/
(function (window, document) {
    "use strict";

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
    /* var xdo_methods_non_supporting_browsers = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn',
            'quote', 'substring', 'toLowerCase', 'toUpperCase', 'charAt',
            'charCodeAt', 'indexOf', 'lastIndexOf', 'startsWith', 'endsWith',
            'trim', 'trimLeft', 'trimRight', 'toLocaleLowerCase',
            'toLocaleUpperCase', 'localeCompare', 'match', 'search',
            'replace', 'split', 'substr', 'concat', 'slice', 'fromCharCode'
        ],
        xdo_methods_non_supporting_browsers_length = xdo_methods_non_supporting_browsers.length,
        xdo_assignStringGeneric = function (methodName) {
            var method = String.prototype[methodName];
            String[methodName] = function (arg1) {
                return method.apply(arg1, Array.prototype.slice.call(arguments, 1));
            };
        };

    for (var i = 0; i < xdo_methods_non_supporting_browsers_length; i++) {
        xdo_assignStringGeneric(xdo_methods_non_supporting_browsers[i]);
    } */

    /** --------------------------------
     *           CONTRUCTORS
     * -------------------------------- **/

    var elem_xdo;
    document = window.document;
    var xdo = function (selector) {
        return new xdo.Xodo.init(selector);
    };
    xdo.Xodo = xdo.prototype = {
        init: function (selector) {
            var elements = new Sizzl(selector);
            for (var i = 0; i < elements.length; i++) {
                this[i] = elements[i];
            }
            this.length = elements.length;
            elem_xdo = this;
        }
    };

    /** --------------------------------
     *              Version
     * -------------------------------- **/
    xdo.Xodo.version = '1.5.1';

    /** --------------------------------
     *           INIT
     * -------------------------------- **/
    xdo.Xodo.init.prototype = xdo.Xodo;

    /** --------------------------------
     *              Util
     * -------------------------------- **/
    xdo.Xodo.extend = xdo.prototype = function (args) {
        var destination = xdo.Xodo;
        for (var property in args) {
            //noinspection JSUnfilteredForInLoop
            destination[property] = args[property];
        }
        return this;
    };

    xdo.Xodo.forEach = xdo.prototype = function (callback) {
        this.map(callback);
        return this;
    };

    xdo.Xodo.map = xdo.prototype = function (callback) {
        var results = [], i = 0;
        for (; i < this.length; i++) {
            results[i] = callback.call(this[i], i, this);
        }
        return results;
    };

    xdo.Xodo.mapOne = function (callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    /*xdo.Xodo.one = xdo.prototype = function (callback) {
     var map = this.map(callback);
     return map.length > 1 ? map : map[0];
     }; */

    xdo.Xodo.each = xdo.prototype = function (obj, callback, args) {
        var value, length, isArray;
        length = obj.length;
        isArray = this.isArraylike(obj);
        var i;

        if (args) {
            if (isArray) {
                for (i = 0; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

            // A special, fast, case for the most common use of each
        } else {
            if (isArray) {
                for (i = 0; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    xdo.Xodo.find = xdo.prototype = function (selector) {
        return new Sizzl(selector);
    };

    xdo.Xodo.trim = xdo.prototype = function (str) {
        str = str.replace(/^\s\s*/, '');
        var ws = /\s/, i = str.length;
        while (ws.test(str.charAt(--i))){}
        return str.slice(0, i + 1);
    };

    xdo.Xodo.access = xdo.prototype = function (elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0,
            length = elems.length,
            bulk = key === null;

        // Varios valores
        if (this.type(key) === "object") {
            chainable = true;
            for (i in key) {
                xdo.Xodo.access(elems, fn, i, key[i], true, emptyGet, raw);
            }

            // Un valor
        } else if (value !== undefined) {
            chainable = true;

            if (!this.isFunction(value)) {
                raw = true;
            }

            if (bulk) {
                if (raw) {
                    fn.call(elems, value);
                    fn = null;
                } else {
                    bulk = fn;
                    fn = function (elem, key, value) {
                        return bulk.call(xdo(elem), value);
                    };
                }
            }

            if (fn) {
                for (; i < length; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }
        }

        return chainable ? elems :
            // Gets
            bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    };

    xdo.Xodo.camelCase = xdo.prototype = function (string) {
        return string.replace(xdo.Xodo.REGEX_MS_PREFIX, "ms-").replace(xdo.Xodo.REGEX_DASH, this.fcamelCase);
    };

    xdo.Xodo.fcamelCase = xdo.prototype = function (all, letter) {
        return letter.toUpperCase();
    };

    /** --------------------------------
     *        METHODS TYPE
     *  -------------------------------- **/
    xdo.Xodo.type = xdo.prototype = function (obj) {
        if (obj === null) {
            return String(obj);
        }
        // Support: Safari <= 5.1
        return typeof obj === "object" || typeof obj === "function" ? xdo.Xodo.class2type[xdo.Xodo.toString.call(obj)] || "object" : typeof obj;
    };
    // --------------
    xdo.Xodo.isString = xdo.prototype = function (value) {
        return Object.prototype.toString.call(value) === "[object String]";
    };
    xdo.Xodo.isNumber = xdo.prototype = function (value) {
        return Object.prototype.toString.call(value) === "[object Number]";
    };
    xdo.Xodo.isArray = xdo.prototype = function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };
    xdo.Xodo.isObject = xdo.prototype = function (value) {
        return Object.prototype.toString.call(value) === "[object Object]";
    };
    xdo.Xodo.isFunction = xdo.prototype = function (value) {
        return Object.prototype.toString.call(value) === "[object Function]";
    };
    xdo.Xodo.isWindow = xdo.prototype = function (obj) {
        return obj !== null && obj === obj.window;
    };
    xdo.Xodo.isArraylike = xdo.prototype = function (obj) {
        var length = obj.length,
            type = xdo.Xodo.type(obj);
        if (xdo.Xodo.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj);
    };
    xdo.prototype.toString = function () {
        return "[object xdo]"; // TODO retornar a função nativa toString [native code]
    };

    /* --------------------------------
     *   GLOBALS VARS - Using Extend
     * -------------------------------- */
    xdo.Xodo.extend({
        // Regular expressions
        REGEX_NONPX: /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i,
        REGEX_MARGIN: /^margin/,
        REGEX_MS_PREFIX: /^-ms-/,
        REGEX_RELNUMBER: /^([+-])=([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))/i,
        REGEX_CLASS: /[\t\r\n\f]/g,
        REGEX_NONWHITE: /\S+/g,
        REGEX_DASH: /-([\da-z])/gi,

        GLOBAL_CSS_PREFIXES: ["Webkit", "O", "Moz", "ms"],
        // Styles
        cssProps: {
            "float": "cssFloat"  //TODO Verificar deste jeito "cssFloat" : "styleFloat"
        },
        cssHooks: {
            "opacity": {},
            "height": {},
            "width": {},
            "margin": {},
            "padding": {},
            "borderWidth": {}
        },
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
        cssNormalTransform: {
            "letterSpacing": 0,
            "fontWeight": 400
        },
        support: {
            "checkOn": true,
            "optSelected": true,
            "reliableMarginRight": true,
            "boxSizingReliable": true,
            "pixelPosition": true,
            "noCloneChecked": true,
            "optDisabled": true,
            "radioValue": true,
            "checkClone": true,
            "focusinBubbles": false,
            "clearCloneStyle": true,
            "cors": true,
            "ajax": true,
            "boxSizing": true
        },
        class2type: {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object",
            "[object Error]": "error"
        }
    });

    /** --------------------------------
     *          HELPER FUNCTIONS
     *  -------------------------------- **/
    xdo.Xodo.vendorPropName = xdo.prototype = function (style, name) {
        if (name in style) {
            return name;
        }
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = xdo.Xodo.GLOBAL_CSS_PREFIXES.length;
        while (i--) {
            name = xdo.Xodo.GLOBAL_CSS_PREFIXES[i] + capName;
            if (name in style) {
                return name;
            }
        }
        return origName;
    };

    xdo.Xodo.getStyles = xdo.prototype = function (elem) {
        return window.getComputedStyle(elem, null);
    };

    xdo.Xodo.currentCSS = xdo.prototype = function (elem, name, _computed) {
        var width, minWidth, maxWidth, computed = _computed || xdo.Xodo.getStyles(elem),

        // Support: IE9
        // getPropertyValue is only needed for .css('filter') in IE9
            ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
            style = elem.style;

        if (computed) {

            if (ret === "" && !xdo.Xodo.contains(elem.ownerDocument, elem)) {
                ret = xdo.Xodo.style(elem, name);
            }

            // "hack by Dean Edwards"
            // this is against the CSSOM draft spec:
            // http://dev.w3.org/csswg/cssom/#resolved-values
            if (xdo.Xodo.REGEX_NONPX.test(ret) && xdo.Xodo.REGEX_MARGIN.test(name)) {

                // Remember the original values
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                // Put in the new values to get a computed value out
                style.minWidth = style.maxWidth = style.width = ret;
                ret = computed.width;

                // Revert the changed values
                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }
        return ret;
    };

    xdo.Xodo.contains = xdo.prototype = function (context, elem) {
        if ((context.ownerDocument || context) !== document) {
            //setDocument(context);
            new Sizzl(context);
        }
        return xdo.Xodo.contains(context, elem);
    };

    xdo.Xodo._css = xdo.prototype = function (elem, name, extra, styles) {
        var val, num, hooks, origName = xdo.Xodo.camelCase(name);

        // Make sure that we're working with the right name
        name = xdo.Xodo.cssProps[origName] || (xdo.Xodo.cssProps[origName] = xdo.Xodo.vendorPropName(elem.style, origName));

        // gets hook for the prefixed version followed by the unprefixed version
        hooks = xdo.Xodo.cssHooks[name] || xdo.Xodo.cssHooks[origName];

        // If a hook was provided get the computed value from there
        if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
        }

        // Otherwise, if a way to get the computed value exists, use that
        if (val === undefined) {
            val = xdo.Xodo.currentCSS(elem, name, styles);
        }

        //convert "normal" to computed value
        if (val === "normal" && name in xdo.Xodo.cssNormalTransform) {
            val = xdo.Xodo.cssNormalTransform[name];
        }

        // Return, converting to number if forced or a qualifier was provided and val looks numeric
        if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || xdo.Xodo.isNumeric(num) ? num || 0 : val;
        }
        return val;
    };

    /** ----------------------------------
     *          Events handler
     * --------------------------------- */

    xdo.Xodo.onload = xdo.prototype = function (callback) {
        var oldonload = window.onload;
        if (typeof window.onload !== "function") {
            window.onload = callback;
        } else {
            window.onload = function () {
                if (oldonload) {
                    oldonload();
                }
                callback();
            };
        }
        return this;
    };

    xdo.Xodo.ready = xdo.prototype = function (callback) {
        var er = /complete|loaded|interactive/;
        if (er.test(document.readyState)) {
            return callback(this);
        } else {
            return this.addEvent(document, "DOMContentLoaded", function () {
                return callback(this);
            });
        }
    };

    xdo.Xodo.bindEvent = xdo.prototype = function (sEventType, fnHandler) {
        return this.forEach(function () {
            if (this.addEventListener) {
                this.addEventListener(sEventType, fnHandler, false);
            } else if (this.attachEvent) {
                this.attachEvent("on" + sEventType, fnHandler);
            } else {
                this["on" + sEventType] = fnHandler;
            }
        });
    };

    xdo.Xodo.unbindEvent = xdo.prototype = function (type, fnHandler) {
        return this.forEach(function () {
            if (this.removeEventListener) {
                this.removeEventListener(type, fnHandler, false);
            } else if (this.detachEvent) {
                this.detachEvent("on" + type, fnHandler);
            } else {
                this["on" + type] = null;
            }
        });
    };

    xdo.Xodo.resize = xdo.prototype = function (callback) {
        var oldResize = window.onresize;
        if (typeof window.onresize !== 'function') {
            window.onresize = callback;
        } else {
            window.onresize = function () {
                if (oldResize) {
                    oldResize();
                }
                callback();
            };
        }
        return this;
    };

    /** --------------------------------
     *              DOM
     *  -------------------------------- **/

    xdo.Xodo.html = xdo.prototype = function (html) {
        if (typeof html !== "undefined") {
            return this.forEach(function () {
                this.innerHTML = html;
            });
        } else {
            return this.mapOne(function () {
                return this.innerHTML;
            });
        }
    };
    xdo.Xodo.append = xdo.prototype = function (eString) {
        if (typeof eString !== "undefined") {
            return this.mapOne(function () {
                this.innerHTML += eString;
            });
        }
    };
    xdo.Xodo.prepend = xdo.prototype = function (eString) {
        if (typeof eString !== "undefined") {
            return this.mapOne(function () {
                this.innerHTML = eString + this.innerHTML;
            });
        }
    };
    xdo.Xodo.addClass = xdo.prototype = function (value) {
        var classes, elem, cur, clazz, j, i = 0,
            len = this.length,
            proceed = typeof value === "string" && value;
        if (xdo.Xodo.isFunction(value)) {
            return this.each(function (j) {
                xdo(this).addClass(value.call(this, j, this.className));
            });
        }
        if (proceed) {
            classes = (value || "").match(xdo.Xodo.REGEX_NONWHITE) || [];
            for (; i < len; i++) {
                elem = this[i];
                cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(xdo.Xodo.REGEX_CLASS, " ") : " ");
                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        if (cur.indexOf(" " + clazz + " ") < 0) {
                            cur += clazz + " ";
                        }
                    }
                    elem.className = this.trim(cur);
                }
            }
        }
        return this;
    };
    xdo.Xodo.removeClass = xdo.prototype = function (value) {
        var classes, elem, cur, clazz, j, i = 0,
            len = this.length,
            proceed = arguments.length === 0 || typeof value === "string" && value;
        if (this.isFunction(value)) {
            return this.each(function (j) {
                xdo(this).removeClass(value.call(this, j, this.className));
            });
        }
        if (proceed) {
            classes = (value || "").match(xdo.Xodo.REGEX_NONWHITE) || [];
            for (; i < len; i++) {
                elem = this[i];
                cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(xdo.Xodo.REGEX_CLASS, " ") : "");
                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        // Remove *all* instances
                        while (cur.indexOf(" " + clazz + " ") >= 0) {
                            cur = cur.replace(" " + clazz + " ", " ");
                        }
                    }
                    elem.className = value ? this.trim(cur) : "";
                }
            }
        }
        return this;
    };
    xdo.Xodo.hasClass = xdo.prototype = function (selector) {
        var className = " " + selector + " ",
            l = this.length;
        for (var i = 0; i < l; i++) {
            /** if ((" " + this[i].className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1) {
                return true;
            } **/
            if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(xdo.Xodo.REGEX_CLASS, " ").indexOf(className) >= 0) {
                return true;
            }
        }
        return false;
    };

    xdo.Xodo.css = xdo.prototype = function (name, value) {
        return xdo.Xodo.access(this, function (elem, name, value) {
                var styles, len, map = {}, i = 0;

                if (xdo.Xodo.isArray(name)) {
                    styles = xdo.Xodo.getStyles(elem);
                    len = name.length;
                    for (; i < len; i++) {
                        map[name[i]] = this._css(elem, name[i], false, styles);
                    }
                    return map;
                }
                return value !== undefined ? xdo.Xodo.style(elem, name, value) : this.css(elem, name);
            },
            name, value, arguments.length > 1);
    };

    xdo.Xodo.style = xdo.prototype = function (elem, name, value, extra) {
        // Don't set styles on TEXT and COMMENTS nodes
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
        }

        var ret, type, hooks, origName = this.camelCase(name),
            style = elem.style;

        name = xdo.Xodo.cssProps[origName] || (xdo.Xodo.cssProps[origName] = xdo.Xodo.vendorPropName(style, origName));

        hooks = xdo.Xodo.cssHooks[name] || xdo.Xodo.cssHooks[origName];

        if (value !== undefined) {
            type = typeof value;
            if (type === "string" && (ret = xdo.Xodo.REGEX_RELNUMBER.exec(value))) {
                value = (ret[1] + 1) * ret[2] + parseFloat(this.css(elem, name));
                type = "number";
            }

            if (value === null || type === "number" && isNaN(value)) {
                return;
            }

            if (type === "number" && !xdo.Xodo.cssNumber[origName]) {
                value += "px";
            }

            if (!xdo.Xodo.support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style[name] = "inherit";
            }

            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                style[name] = value;
            }

        } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                return ret;
            }
            return style[name];
        }
    };

    xdo.Xodo.width = xdo.prototype = function (margin) {
        var chainable = arguments.length;
        return xdo.Xodo.access(this, function (elem, type, value) {
            var doc;
            if (xdo.Xodo.isWindow(elem)) {
                return elem.document.documentElement.clientWidth;
            }
            if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                    elem.body.scrollWidth, doc.scrollWidth,
                    elem.body.offsetWidth, doc.offsetWidth,
                    doc.clientWidth
                );
            }
            return xdo.Xodo.style(elem, type, value, null);

        }, 'width', margin, chainable, null);
    };

    xdo.Xodo.height = xdo.prototype = function (margin) {
        var chainable = arguments.length;
        return xdo.Xodo.access(this, function (elem, type, value) {
            var doc;
            if (xdo.Xodo.isWindow(elem)) {
                return elem.document.documentElement.clientHeight;
            }
            if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                    elem.body.scrollHeight, doc.scrollHeight,
                    elem.body.offsetHeight, doc.offsetHeight,
                    doc.clientHeight
                );
            }
            return xdo.Xodo.style(elem, type, value, null);

        }, 'height', margin, chainable, null);
    };

    xdo.Xodo.remove = xdo.prototype = function () {
        for (var i = 0; i < this.length; i++) {
            if (this[i].parentNode) {
                this[i].parentNode.removeChild(this[i]);
            }
        }
        return this;
    };

    /** ----------------------------------
     *          Easing Calcs
     * --------------------------------- */
    xdo.Xodo.extend({
        backInSeed: 1.70158,
        ease: function (n) {
            var q = 0.07813 - n / 2,
                Q = Math.sqrt(0.0066 + q * q),
                x = Q - q,
                X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                y = -Q - q,
                Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                t = X + Y + 0.25;
            return Math.pow(1 - t, 2) * 3 * t * 0.1 + (1 - t) * 3 * t * t + t * t * t;
        },
        easeIn: function (n) {
            return Math.pow(n, 1.7);
        },
        easeOut: function (n) {
            return Math.pow(n, 0.48);
        },
        easeInOut: function (n) {
            var q = 0.48 - n / 1.04,
                Q = Math.sqrt(0.1734 + q * q),
                x = Q - q,
                X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                y = -Q - q,
                Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                t = X + Y + 0.5;
            return (1 - t) * 3 * t * t + t * t * t;
        },
        backIn: function (n) {
            return n * n * ((xdo.Xodo.backInSeed + 1) * n - xdo.Xodo.backInSeed);
        },
        backOut: function (n) {
            n = n - 1;
            return n * n * ((xdo.Xodo.backInSeed + 1) * n + xdo.Xodo.backInSeed) + 1;
        },
        elasticIn: function (n) {
            if (n === 0 || n === 1) {
                return n;
            }
            var p = 0.3,
                s = p / 4;
            return Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
        },
        elasticOut: function (n) {
            return 1 - xdo.Xodo.elasticIn(1 - n);
        },
        bounceIn: function (n) {
            return 1 - xdo.Xodo.bounceOut(1 - n);
        },
        bounceOut: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + 0.75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + 0.9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + 0.984375;
                    }
                }
            }
            return l;
        }
    });

    /** ----------------------------------
     *    xdoMatrix animate Methods
     * --------------------------------- */
    xdo.Xodo.xdoMatrix = xdo.prototype = function (elem, style, from, to, easing, time, callback) {
        if (!elem) return;
        var unit = 'px';
        var ease = easing || 'ease';
        callback = callback || function () {
        };
        var start = new Date().getTime(),
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                //elem.style[style] = (from+step*(to-from) * xdo.Xodo[ease]((step))) + unit;
                //xdo('#' + elem.id).css(style, (from + step * (to - from) * xdo.Xodo[ease]((step))) + unit);
                var trace = (from+step*(to-from) * xdo.Xodo[ease]((step))) + unit;
                xdo.Xodo.style(elem, style, trace);
                if (step == 1) {
                    onend();
                    clearInterval(timer);
                }
            }, 4);

        function onend() {
            callback.call(elem);
        }

        elem.style[style] = from + unit;
    };

    window.xdo = window.elem_xdo = xdo;
    document.xdo = document.elem_xdo = xdo;

})(window, document);