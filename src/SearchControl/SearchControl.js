/**
 * @fileoverview 百度地图的检索控件，对外开放。
 * 控制搜索框控件和导航控件。
 * 基于Baidu Map API 1.4。
 *
 * @author baidu
 * @version 1.4
 */
/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

(function () {
    //声明baidu包
    var T, baidu = T = baidu || {
        version: "1.3.9"
    };
    //提出guid，防止在与老版本Tangram混用时
    //在下一行错误的修改window[undefined]
    baidu.guid = "$BAIDU$";
    //闭包，里边是所用到的tangram的方法
    (function () {
        /** @ignore
         * @namespace baidu.dom 操作dom的方法。
         */
        baidu.dom = baidu.dom || {};

        /* @ignore
         * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
         * @property target 	事件的触发元素
         * @property pageX 		鼠标事件的鼠标x坐标
         * @property pageY 		鼠标事件的鼠标y坐标
         * @property keyCode 	键盘事件的键值
         */
        baidu.event = baidu.event || {};

        /* @ignore
         * @namespace baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
         */
        baidu.lang = baidu.lang || {};

        /* @ignore
         * @namespace baidu.browser 判断浏览器类型和特性的属性。
         */
        baidu.browser = baidu.browser || {};
        /**
         * 为目标元素添加className
         * @name baidu.dom.addClass
         * @function
         * @grammar baidu.dom.addClass(element, className)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
         * @remark
         * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
         * @shortcut addClass
         * @meta standard
         * @see baidu.dom.removeClass
         *
         *
         * @returns {HTMLElement} 目标元素
         */
        baidu.dom.addClass = function (element, className) {
            element = baidu.dom.g(element);
            var classArray = className.split(/\s+/),
                result = element.className,
                classMatch = " " + result + " ",
                i = 0,
                l = classArray.length;

            for (; i < l; i++) {
                if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
                    result += (result ? ' ' : '') + classArray[i];
                }
            }

            element.className = result;
            return element;
        };

        // 声明快捷方法
        baidu.addClass = baidu.dom.addClass;
        /**
         * 移除目标元素的className
         * @name baidu.dom.removeClass
         * @function
         * @grammar baidu.dom.removeClass(element, className)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} className 要移除的className，允许同时移除多个class，中间使用空白符分隔
         * @remark
         * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
         * @shortcut removeClass
         * @meta standard
         * @see baidu.dom.addClass
         *
         * @returns {HTMLElement} 目标元素
         */
        baidu.dom.removeClass = function (element, className) {
            element = baidu.dom.g(element);

            var oldClasses = element.className.split(/\s+/),
                newClasses = className.split(/\s+/),
                lenOld, lenDel = newClasses.length,
                j, i = 0;
            //考虑到同时删除多个className的应用场景概率较低,故放弃进一步性能优化
            // by rocy @1.3.4
            for (; i < lenDel; ++i) {
                for (j = 0, lenOld = oldClasses.length; j < lenOld; ++j) {
                    if (oldClasses[j] == newClasses[i]) {
                        oldClasses.splice(j, 1);
                        break;
                    }
                }
            }
            element.className = oldClasses.join(' ');
            return element;
        };

        // 声明快捷方法
        baidu.removeClass = baidu.dom.removeClass;

        /**
         * 获取目标元素的computed style值。如果元素的样式值不能被浏览器计算，则会返回空字符串（IE）
         *
         * @author berg
         * @name baidu.dom.getComputedStyle
         * @function
         * @grammar baidu.dom.getComputedStyle(element, key)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} key 要获取的样式名
         *
         * @see baidu.dom.getStyle
         *
         * @returns {string} 目标元素的computed style值
         */

        baidu.dom.getComputedStyle = function (element, key) {
            element = baidu.dom._g(element);
            var doc = baidu.dom.getDocument(element),
                styles;
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
                styles = doc.defaultView.getComputedStyle(element, null);
                if (styles) {
                    return styles[key] || styles.getPropertyValue(key);
                }
            }
            return '';
        };
        /**
         * 获取目标元素的样式值
         * @name baidu.dom.getStyle
         * @function
         * @grammar baidu.dom.getStyle(element, key)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} key 要获取的样式名
         * @remark
         *
         * 为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
         * baidu.dom._styleFixer和baidu.dom._styleFilter可以为本模块提供支持。<br />
         * 其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。
         * @shortcut getStyle
         * @meta standard
         * @see baidu.dom.setStyle,baidu.dom.setStyles, baidu.dom.getComputedStyle
         *
         * @returns {string} 目标元素的样式值
         */

        baidu.dom.getStyle = function (element, key) {
            var dom = baidu.dom;

            element = dom.g(element);
            var value = element.style[key] || (element.currentStyle ? element.currentStyle[key] : "") || dom.getComputedStyle(element, key);

            return value;
        };

        // 声明快捷方法
        baidu.getStyle = baidu.dom.getStyle;

        /**
         * 获取目标元素所属的document对象
         * @name baidu.dom.getDocument
         * @function
         * @grammar baidu.dom.getDocument(element)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @meta standard
         * @see baidu.dom.getWindow
         *
         * @returns {HTMLDocument} 目标元素所属的document对象
         */
        baidu.dom.getDocument = function (element) {
            element = baidu.dom.g(element);
            return element.nodeType == 9 ? element : element.ownerDocument || element.document;
        };


        /**
         * 从文档中获取指定的DOM元素
         * @name baidu.dom.g
         * @function
         * @grammar baidu.dom.g(id)
         * @param {string|HTMLElement} id 元素的id或DOM元素
         * @shortcut g,T.G
         * @meta standard
         * @see baidu.dom.q
         *
         * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
         */
        baidu.dom.g = function (id) {
            if ('string' == typeof id || id instanceof String) {
                return document.getElementById(id);
            } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
                return id;
            }
            return null;
        };
        // 声明快捷方法
        baidu.g = baidu.G = baidu.dom.g;
        /**
         * 从文档中获取指定的DOM元素
         * **内部方法**
         *
         * @param {string|HTMLElement} id 元素的id或DOM元素
         * @meta standard
         * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
         */
        baidu.dom._g = function (id) {
            if (baidu.lang.isString(id)) {
                return document.getElementById(id);
            }
            return id;
        };

        // 声明快捷方法
        baidu._g = baidu.dom._g;


        /**
         * 判断目标参数是否string类型或String对象
         * @name baidu.lang.isString
         * @function
         * @grammar baidu.lang.isString(source)
         * @param {Any} source 目标参数
         * @shortcut isString
         * @meta standard
         * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
         *
         * @returns {boolean} 类型判断结果
         */
        baidu.lang.isString = function (source) {
            return '[object String]' == Object.prototype.toString.call(source);
        };

        // 声明快捷方法
        baidu.isString = baidu.lang.isString;

        /**
         * 事件监听器的存储表
         * @private
         * @meta standard
         */
        baidu.event._listeners = baidu.event._listeners || [];
        /**
         * 为目标元素添加事件监听器
         * @name baidu.event.on
         * @function
         * @grammar baidu.event.on(element, type, listener)
         * @param {HTMLElement|string|window} element 目标元素或目标元素id
         * @param {string} type 事件类型
         * @param {Function} listener 需要添加的监听器
         * @remark
         *
        1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
        2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败

         * @shortcut on
         * @meta standard
         * @see baidu.event.un
         *
         * @returns {HTMLElement|window} 目标元素
         */
        baidu.event.on = function (element, type, listener) {
            type = type.replace(/^on/i, '');
            element = baidu.dom._g(element);

            var realListener = function (ev) {
                    // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
                    // 2. element是为了修正this
                    listener.call(element, ev);
                },
                lis = baidu.event._listeners,
                filter = baidu.event._eventFilter,
                afterFilter, realType = type;
            type = type.toLowerCase();
            // filter过滤
            if (filter && filter[type]) {
                afterFilter = filter[type](element, type, realListener);
                realType = afterFilter.type;
                realListener = afterFilter.listener;
            }

            // 事件监听器挂载
            if (element.addEventListener) {
                element.addEventListener(realType, realListener, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + realType, realListener);
            }

            // 将监听器存储到数组中
            lis[lis.length] = [element, type, listener, realListener, realType];
            return element;
        };

        // 声明快捷方法
        baidu.on = baidu.event.on;

        /**
         * 为目标元素移除事件监听器
         * @name baidu.event.un
         * @function
         * @grammar baidu.event.un(element, type, listener)
         * @param {HTMLElement|string|window} element 目标元素或目标元素id
         * @param {string} type 事件类型
         * @param {Function} listener 需要移除的监听器
         * @shortcut un
         * @meta standard
         * @see baidu.event.on
         *
         * @returns {HTMLElement|window} 目标元素
         */
        baidu.event.un = function (element, type, listener) {
            element = baidu.dom._g(element);
            type = type.replace(/^on/i, '').toLowerCase();

            var lis = baidu.event._listeners,
                len = lis.length,
                isRemoveAll = !listener,
                item, realType, realListener;

            //如果将listener的结构改成json
            //可以节省掉这个循环，优化性能
            //但是由于un的使用频率并不高，同时在listener不多的时候
            //遍历数组的性能消耗不会对代码产生影响
            //暂不考虑此优化
            while (len--) {
                item = lis[len];

                // listener存在时，移除element的所有以listener监听的type类型事件
                // listener不存在时，移除element的所有type类型事件
                if (item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
                    realType = item[4];
                    realListener = item[3];
                    if (element.removeEventListener) {
                        element.removeEventListener(realType, realListener, false);
                    } else if (element.detachEvent) {
                        element.detachEvent('on' + realType, realListener);
                    }
                    lis.splice(len, 1);
                }
            }

            return element;
        };

        // 声明快捷方法
        baidu.un = baidu.event.un;

        ///import baidu.browser;
        if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
            //IE 8下，以documentMode为准
            //在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
            /**
             * 判断是否为ie浏览器
             * @property ie ie版本号
             * @grammar baidu.browser.ie
             * @meta standard
             * @shortcut ie
             * @see baidu.browser.firefox,baidu.browser.safari,baidu.browser.opera,baidu.browser.chrome,baidu.browser.maxthon
             */
            baidu.browser.ie = baidu.ie = document.documentMode || +RegExp['\x241'];
        }

        
        /**
         * @namespace baidu.platform 判断平台类型和特性的属性。
         */
        baidu.platform = baidu.platform || {};

        /**
         * 判断是否为iphone平台
         * @property iphone 是否为iphone平台
         * @grammar baidu.platform.iphone
         * @meta standard
         * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.macintosh,baidu.platform.ipad,baidu.platform.android
         */
        baidu.platform.isIphone = /iphone/i.test(navigator.userAgent);

        /**
         * 判断是否为android平台
         * @property android 是否为android平台
         * @grammar baidu.platform.android
         * @meta standard
         * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.macintosh,baidu.platform.iphone,baidu.platform.ipad
         * @author jz
         */
        baidu.platform.isAndroid = /android/i.test(navigator.userAgent);
        /*
         * Tangram
         * Copyright 2009 Baidu Inc. All rights reserved.
         */

        ///import baidu.platform;

        /**
         * 判断是否为ipad平台
         * @property ipad 是否为ipad平台
         * @grammar baidu.platform.ipad
         * @meta standard
         * @see baidu.platform.x11,baidu.platform.windows,baidu.platform.macintosh,baidu.platform.iphone,baidu.platform.android   
         * @author jz
         */
        baidu.platform.isIpad = /ipad/i.test(navigator.userAgent);

        /**
         * 是否为移动平台
         * @returns {Boolean}
         */
        baidu.isMobile = function() {
            return !!(baidu.platform.isIphone || baidu.platform.isIpad || baidu.platform.isAndroid);
        }

    })();

    /*!
     * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
     * Released under MIT license, http://cubiq.org/license
     */
    (function(window, doc){
    var m = Math,
        dummyStyle = doc.createElement('div').style,
        vendor = (function () {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

        // Style properties
        transform = prefixStyle('transform'),
        transitionProperty = prefixStyle('transitionProperty'),
        transitionDuration = prefixStyle('transitionDuration'),
        transformOrigin = prefixStyle('transformOrigin'),
        transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        transitionDelay = prefixStyle('transitionDelay'),

        // Browser capabilities
        isAndroid = (/android/gi).test(navigator.appVersion),
        isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

        has3d = prefixStyle('perspective') in dummyStyle,
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor !== false,
        hasTransitionEnd = prefixStyle('transition') in dummyStyle,

        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
        TRNEND_EV = (function () {
            if ( vendor === false ) return false;

            var transitionEnd = {
                    ''			: 'transitionend',
                    'webkit'	: 'webkitTransitionEnd',
                    'Moz'		: 'transitionend',
                    'O'			: 'otransitionend',
                    'ms'		: 'MSTransitionEnd'
                };

            return transitionEnd[vendor];
        })(),

        nextFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) { return setTimeout(callback, 1); };
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),

        // Helpers
        translateZ = has3d ? ' translateZ(0)' : '',

        // Constructor
        iScroll = function (el, options) {
            var that = this,
                i;

            that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
            that.wrapper.style.overflow = 'hidden';
            that.scroller = that.wrapper.children[0];

            // Default options
            that.options = {
                hScroll: true,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                topOffset: 0,
                checkDOMChanges: false,		// Experimental
                handleClick: true,

                // Scrollbar
                hScrollbar: true,
                vScrollbar: true,
                fixedScrollbar: isAndroid,
                hideScrollbar: isIDevice,
                fadeScrollbar: isIDevice && has3d,
                scrollbarClass: '',

                // Zoom
                zoom: false,
                zoomMin: 1,
                zoomMax: 4,
                doubleTapZoom: 2,
                wheelAction: 'scroll',

                // Snap
                snap: false,
                snapThreshold: 1,

                // Events
                onRefresh: null,
                onBeforeScrollStart: function (e) { e.preventDefault(); },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null,
                onZoomStart: null,
                onZoom: null,
                onZoomEnd: null
            };

            // User defined options
            for (i in options) that.options[i] = options[i];
            
            // Set starting position
            that.x = that.options.x;
            that.y = that.options.y;

            // Normalize options
            that.options.useTransform = hasTransform && that.options.useTransform;
            that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
            that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
            that.options.zoom = that.options.useTransform && that.options.zoom;
            that.options.useTransition = hasTransitionEnd && that.options.useTransition;

            // Helpers FIX ANDROID BUG!
            // translate3d and scale doesn't work together!
            // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
            if ( that.options.zoom && isAndroid ){
                translateZ = '';
            }
            
            // Set some default styles
            that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
            that.scroller.style[transitionDuration] = '0';
            that.scroller.style[transformOrigin] = '0 0';
            if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
            
            if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
            else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

            if (that.options.useTransition) that.options.fixedScrollbar = true;

            that.refresh();

            that._bind(RESIZE_EV, window);
            that._bind(START_EV);
            if (!hasTouch) {
                if (that.options.wheelAction != 'none') {
                    that._bind('DOMMouseScroll');
                    that._bind('mousewheel');
                }
            }

            if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
                that._checkDOMChanges();
            }, 500);
        };

    // Prototype
    iScroll.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0, currPageY: 0,
        pagesX: [], pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        
        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
                case TRNEND_EV: that._transitionEnd(e); break;
            }
        },
        
        _checkDOMChanges: function () {
            if (this.moved || this.zoomed || this.animating ||
                (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

            this.refresh();
        },
        
        _scrollbar: function (dir) {
            var that = this,
                bar;

            if (!that[dir + 'Scrollbar']) {
                if (that[dir + 'ScrollbarWrapper']) {
                    if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
                    that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                    that[dir + 'ScrollbarWrapper'] = null;
                    that[dir + 'ScrollbarIndicator'] = null;
                }

                return;
            }

            if (!that[dir + 'ScrollbarWrapper']) {
                // Create the scrollbar wrapper
                bar = doc.createElement('div');

                if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
                else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

                bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

                that.wrapper.appendChild(bar);
                that[dir + 'ScrollbarWrapper'] = bar;

                // Create the scrollbar indicator
                bar = doc.createElement('div');
                if (!that.options.scrollbarClass) {
                    bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
                }
                bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
                if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

                that[dir + 'ScrollbarWrapper'].appendChild(bar);
                that[dir + 'ScrollbarIndicator'] = bar;
            }

            if (dir == 'h') {
                that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
                that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
                that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
                that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
                that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
            } else {
                that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
                that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
                that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
                that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
                that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
            }

            // Reset position
            that._scrollbarPos(dir, true);
        },
        
        _resize: function () {
            var that = this;
            setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
        },
        
        _pos: function (x, y) {
            if (this.zoomed) return;

            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;

            if (this.options.useTransform) {
                this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
            } else {
                x = m.round(x);
                y = m.round(y);
                this.scroller.style.left = x + 'px';
                this.scroller.style.top = y + 'px';
            }

            this.x = x;
            this.y = y;

            this._scrollbarPos('h');
            this._scrollbarPos('v');
        },

        _scrollbarPos: function (dir, hidden) {
            var that = this,
                pos = dir == 'h' ? that.x : that.y,
                size;

            if (!that[dir + 'Scrollbar']) return;

            pos = that[dir + 'ScrollbarProp'] * pos;

            if (pos < 0) {
                if (!that.options.fixedScrollbar) {
                    size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
                    if (size < 8) size = 8;
                    that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                }
                pos = 0;
            } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
                if (!that.options.fixedScrollbar) {
                    size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                    if (size < 8) size = 8;
                    that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                    pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
                } else {
                    pos = that[dir + 'ScrollbarMaxScroll'];
                }
            }

            that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
            that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
            that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
        },
        
        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y,
                c1, c2;

            if (!that.enabled) return;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

            if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

            that.moved = false;
            that.animating = false;
            that.zoomed = false;
            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;

            // Gesture start
            if (that.options.zoom && hasTouch && e.touches.length > 1) {
                c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
                c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
                that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

                that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
                that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

                if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
            }

            if (that.options.momentum) {
                if (that.options.useTransform) {
                    // Very lame general purpose alternative to CSSMatrix
                    matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5]);
                } else {
                    x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                    y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
                }
                
                if (x != that.x || y != that.y) {
                    if (that.options.useTransition) that._unbind(TRNEND_EV);
                    else cancelFrame(that.aniTime);
                    that.steps = [];
                    that._pos(x, y);
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                }
            }

            that.absStartX = that.x;	// Needed by snap threshold
            that.absStartY = that.y;

            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

            that._bind(MOVE_EV, window);
            that._bind(END_EV, window);
            that._bind(CANCEL_EV, window);
        },
        
        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY,
                c1, c2, scale,
                timestamp = e.timeStamp || Date.now();

            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

            // Zoom
            if (that.options.zoom && hasTouch && e.touches.length > 1) {
                c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                that.touchesDist = m.sqrt(c1*c1+c2*c2);

                that.zoomed = true;

                scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

                if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
                else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

                that.lastScale = scale / this.scale;

                newX = this.originX - this.originX * that.lastScale + this.x,
                newY = this.originY - this.originY * that.lastScale + this.y;

                this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

                if (that.options.onZoom) that.options.onZoom.call(that, e);
                return;
            }

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
            }
            if (newY > that.minScrollY || newY < that.maxScrollY) {
                newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
            }

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;
            that._pos(newX, newY);
            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }
            
            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
        },
        
        _end: function (e) {
            if (hasTouch && e.touches.length !== 0) return;

            var that = this,
                point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                momentumX = { dist:0, time:0 },
                momentumY = { dist:0, time:0 },
                duration = (e.timeStamp || Date.now()) - that.startTime,
                newPosX = that.x,
                newPosY = that.y,
                distX, distY,
                newDuration,
                snap,
                scale;

            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

            if (that.zoomed) {
                scale = that.scale * that.lastScale;
                scale = Math.max(that.options.zoomMin, scale);
                scale = Math.min(that.options.zoomMax, scale);
                that.lastScale = scale / that.scale;
                that.scale = scale;

                that.x = that.originX - that.originX * that.lastScale + that.x;
                that.y = that.originY - that.originY * that.lastScale + that.y;
                
                that.scroller.style[transitionDuration] = '200ms';
                that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
                
                that.zoomed = false;
                that.refresh();

                if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                return;
            }

            if (!that.moved) {
                if (hasTouch) {
                    if (that.doubleTapTimer && that.options.zoom) {
                        // Double tapped
                        clearTimeout(that.doubleTapTimer);
                        that.doubleTapTimer = null;
                        if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                        that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                        if (that.options.onZoomEnd) {
                            setTimeout(function() {
                                that.options.onZoomEnd.call(that, e);
                            }, 200); // 200 is default zoom duration
                        }
                    } else if (this.options.handleClick) {
                        that.doubleTapTimer = setTimeout(function () {
                            that.doubleTapTimer = null;

                            // Find the last touched element
                            target = point.target;
                            while (target.nodeType != 1) target = target.parentNode;

                            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                                ev = doc.createEvent('MouseEvents');
                                ev.initMouseEvent('click', true, true, e.view, 1,
                                    point.screenX, point.screenY, point.clientX, point.clientY,
                                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                    0, null);
                                ev._fake = true;
                                target.dispatchEvent(ev);
                            }
                        }, that.options.zoom ? 250 : 0);
                    }
                }

                that._resetPos(400);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (duration < 300 && that.options.momentum) {
                momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                newPosX = that.x + momentumX.dist;
                newPosY = that.y + momentumY.dist;

                if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
                if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
            }

            if (momentumX.dist || momentumY.dist) {
                newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

                // Do we need to snap?
                if (that.options.snap) {
                    distX = newPosX - that.absStartX;
                    distY = newPosY - that.absStartY;
                    if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                    else {
                        snap = that._snap(newPosX, newPosY);
                        newPosX = snap.x;
                        newPosY = snap.y;
                        newDuration = m.max(snap.time, newDuration);
                    }
                }

                that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            // Do we need to snap?
            if (that.options.snap) {
                distX = newPosX - that.absStartX;
                distY = newPosY - that.absStartY;
                if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
                else {
                    snap = that._snap(that.x, that.y);
                    if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
                }

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            that._resetPos(200);
            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },
        
        _resetPos: function (time) {
            var that = this,
                resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            if (resetX == that.x && resetY == that.y) {
                if (that.moved) {
                    that.moved = false;
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
                }

                if (that.hScrollbar && that.options.hideScrollbar) {
                    if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                    that.hScrollbarWrapper.style.opacity = '0';
                }
                if (that.vScrollbar && that.options.hideScrollbar) {
                    if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                    that.vScrollbarWrapper.style.opacity = '0';
                }

                return;
            }

            that.scrollTo(resetX, resetY, time || 0);
        },

        _wheel: function (e) {
            var that = this,
                wheelDeltaX, wheelDeltaY,
                deltaX, deltaY,
                deltaScale;

            if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 12;
                wheelDeltaY = e.wheelDeltaY / 12;
            } else if('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail * 3;
            } else {
                return;
            }
            
            if (that.options.wheelAction == 'zoom') {
                deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
                if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
                if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
                
                if (deltaScale != that.scale) {
                    if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    that.wheelZoomCount++;
                    
                    that.zoom(e.pageX, e.pageY, deltaScale, 400);
                    
                    setTimeout(function() {
                        that.wheelZoomCount--;
                        if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                    }, 400);
                }
                
                return;
            }
            
            deltaX = that.x + wheelDeltaX;
            deltaY = that.y + wheelDeltaY;

            if (deltaX > 0) deltaX = 0;
            else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

            if (deltaY > that.minScrollY) deltaY = that.minScrollY;
            else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
        
            if (that.maxScrollY < 0) {
                that.scrollTo(deltaX, deltaY, 0);
            }
        },
        
        _transitionEnd: function (e) {
            var that = this;

            if (e.target != that.scroller) return;

            that._unbind(TRNEND_EV);
            
            that._startAni();
        },


        /**
        *
        * Utilities
        *
        */
        _startAni: function () {
            var that = this,
                startX = that.x, startY = that.y,
                startTime = Date.now(),
                step, easeOut,
                animate;

            if (that.animating) return;
            
            if (!that.steps.length) {
                that._resetPos(400);
                return;
            }
            
            step = that.steps.shift();
            
            if (step.x == startX && step.y == startY) step.time = 0;

            that.animating = true;
            that.moved = true;
            
            if (that.options.useTransition) {
                that._transitionTime(step.time);
                that._pos(step.x, step.y);
                that.animating = false;
                if (step.time) that._bind(TRNEND_EV);
                else that._resetPos(0);
                return;
            }

            animate = function () {
                var now = Date.now(),
                    newX, newY;

                if (now >= startTime + step.time) {
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
                    that._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = m.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                that._pos(newX, newY);
                if (that.animating) that.aniTime = nextFrame(animate);
            };

            animate();
        },

        _transitionTime: function (time) {
            time += 'ms';
            this.scroller.style[transitionDuration] = time;
            if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
            if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
        },

        _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
            var deceleration = 0.0006,
                speed = m.abs(dist) / time,
                newDist = (speed * speed) / (2 * deceleration),
                newTime = 0, outsideDist = 0;

            // Proportinally reduce speed if we are outside of the boundaries
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }

            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;

            return { dist: newDist, time: m.round(newTime) };
        },

        _offset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;
                
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            
            if (el != this.wrapper) {
                left *= this.scale;
                top *= this.scale;
            }

            return { left: left, top: top };
        },

        _snap: function (x, y) {
            var that = this,
                i, l,
                page, time,
                sizeX, sizeY;

            // Check page X
            page = that.pagesX.length - 1;
            for (i=0, l=that.pagesX.length; i<l; i++) {
                if (x >= that.pagesX[i]) {
                    page = i;
                    break;
                }
            }
            if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
            x = that.pagesX[page];
            sizeX = m.abs(x - that.pagesX[that.currPageX]);
            sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
            that.currPageX = page;

            // Check page Y
            page = that.pagesY.length-1;
            for (i=0; i<page; i++) {
                if (y >= that.pagesY[i]) {
                    page = i;
                    break;
                }
            }
            if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
            y = that.pagesY[page];
            sizeY = m.abs(y - that.pagesY[that.currPageY]);
            sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
            that.currPageY = page;

            // Snap with constant speed (proportional duration)
            time = m.round(m.max(sizeX, sizeY)) || 200;

            return { x: x, y: y, time: time };
        },

        _bind: function (type, el, bubble) {
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        },


        /**
        *
        * Public methods
        *
        */
        destroy: function () {
            var that = this;

            that.scroller.style[transform] = '';

            // Remove the scrollbars
            that.hScrollbar = false;
            that.vScrollbar = false;
            that._scrollbar('h');
            that._scrollbar('v');

            // Remove the event listeners
            that._unbind(RESIZE_EV, window);
            that._unbind(START_EV);
            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);
            
            if (!that.options.hasTouch) {
                that._unbind('DOMMouseScroll');
                that._unbind('mousewheel');
            }
            
            if (that.options.useTransition) that._unbind(TRNEND_EV);
            
            if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
            
            if (that.options.onDestroy) that.options.onDestroy.call(that);
        },

        refresh: function () {
            var that = this,
                offset,
                i, l,
                els,
                pos = 0,
                page = 0;

            if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            that.minScrollY = -that.options.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.onRefresh) that.options.onRefresh.call(that);

            that.hScroll = that.options.hScroll && that.maxScrollX < 0;
            that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

            that.hScrollbar = that.hScroll && that.options.hScrollbar;
            that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

            offset = that._offset(that.wrapper);
            that.wrapperOffsetLeft = -offset.left;
            that.wrapperOffsetTop = -offset.top;

            // Prepare snap
            if (typeof that.options.snap == 'string') {
                that.pagesX = [];
                that.pagesY = [];
                els = that.scroller.querySelectorAll(that.options.snap);
                for (i=0, l=els.length; i<l; i++) {
                    pos = that._offset(els[i]);
                    pos.left += that.wrapperOffsetLeft;
                    pos.top += that.wrapperOffsetTop;
                    that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                    that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
                }
            } else if (that.options.snap) {
                that.pagesX = [];
                while (pos >= that.maxScrollX) {
                    that.pagesX[page] = pos;
                    pos = pos - that.wrapperW;
                    page++;
                }
                if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

                pos = 0;
                page = 0;
                that.pagesY = [];
                while (pos >= that.maxScrollY) {
                    that.pagesY[page] = pos;
                    pos = pos - that.wrapperH;
                    page++;
                }
                if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
            }

            // Prepare the scrollbars
            that._scrollbar('h');
            that._scrollbar('v');

            if (!that.zoomed) {
                that.scroller.style[transitionDuration] = '0';
                that._resetPos(400);
            }
        },

        scrollTo: function (x, y, time, relative) {
            var that = this,
                step = x,
                i, l;

            that.stop();

            if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
            
            for (i=0, l=step.length; i<l; i++) {
                if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
                that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
            }

            that._startAni();
        },

        scrollToElement: function (el, time) {
            var that = this, pos;
            el = el.nodeType ? el : that.scroller.querySelector(el);
            if (!el) return;

            pos = that._offset(el);
            pos.left += that.wrapperOffsetLeft;
            pos.top += that.wrapperOffsetTop;

            pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
            pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
            time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

            that.scrollTo(pos.left, pos.top, time);
        },

        scrollToPage: function (pageX, pageY, time) {
            var that = this, x, y;
            
            time = time === undefined ? 400 : time;

            if (that.options.onScrollStart) that.options.onScrollStart.call(that);

            if (that.options.snap) {
                pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
                pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

                pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
                pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

                that.currPageX = pageX;
                that.currPageY = pageY;
                x = that.pagesX[pageX];
                y = that.pagesY[pageY];
            } else {
                x = -that.wrapperW * pageX;
                y = -that.wrapperH * pageY;
                if (x < that.maxScrollX) x = that.maxScrollX;
                if (y < that.maxScrollY) y = that.maxScrollY;
            }

            that.scrollTo(x, y, time);
        },

        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;

            // If disabled after touchstart we make sure that there are no left over events
            this._unbind(MOVE_EV, window);
            this._unbind(END_EV, window);
            this._unbind(CANCEL_EV, window);
        },
        
        enable: function () {
            this.enabled = true;
        },
        
        stop: function () {
            if (this.options.useTransition) this._unbind(TRNEND_EV);
            else cancelFrame(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },
        
        zoom: function (x, y, scale, time) {
            var that = this,
                relScale = scale / that.scale;

            if (!that.options.useTransform) return;

            that.zoomed = true;
            time = time === undefined ? 200 : time;
            x = x - that.wrapperOffsetLeft - that.x;
            y = y - that.wrapperOffsetTop - that.y;
            that.x = x - x * relScale + that.x;
            that.y = y - y * relScale + that.y;

            that.scale = scale;
            that.refresh();

            that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
            that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            that.scroller.style[transitionDuration] = time + 'ms';
            that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
            that.zoomed = false;
        },
        
        isReady: function () {
            return !this.moved && !this.zoomed && !this.animating;
        }
    };

    function prefixStyle (style) {
        if ( vendor === '' ) return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    dummyStyle = null;	// for the sake of it

    if (typeof exports !== 'undefined') exports.iScroll = iScroll;
    else window.iScroll = iScroll;

    })(window, document);

    /**
     * 阻止默认事件处理
     * @param {Event}
     */
    function preventDefault(e){
        var e = window.event || e;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        return false;
    }


    /**
     * 常量searchType
     */
    window.LOCAL_SEARCH   = "1";
    window.TRANSIT_ROUTE  = "2";
    window.DRIVING_ROUTE  = "3";

    /**
     * SearchControl类的构造函数
     * @class 检索控件 <b>入口</b>。
     * @constructor
     */
    function SearchControl (options) {
        this.map       = options.map;
        this.projection = this.map.getMapType().getProjection();
        this.container = baidu.isString(options.container) ? document.getElementById(options.container) : options.container;
        this.type = options.type || LOCAL_SEARCH;
        this.enableAutoLocation = options.enableAutoLocation === false ? false : true; //是否根据IP定位当前城市
        this.initialize();
    }

    SearchControl.prototype = {
        constructor: SearchControl

        /**
         * 初始化操作
         */
        , initialize: function () {
            this.container.innerHTML = this._getHtml();
            this._initDom();
            if (this.enableAutoLocation) {
                this._initLocalCity();
            }
            this._initService();
            this._initCityTab();
            this._bind();
            this.setType(this.type);
        }

        /**
         * 生成控件所需要的dom元素
         */
        , _getHtml: function () {
            var html = [
                '<div id="BMapLib_searchBoxContent" class="BMapLib_schbox">',
                    '<div id="BMapLib_normalBox" class="BMapLib_sc_t sc_box_bg">',
                        '<div id="BMapLib_sc0">',
                            '<table style="width:100%;" border="0" cellpadding="0" cellspacing="0">',
                                '<tr>',
                                    '<td>',
                                        '<div id="BMapLib_cityTab" class="BMapLib_cityTab">',
                                            '<span>北京市</span>',
                                            '<em class="city_icon"></em>',
                                        '</div>',
                                    '</td>',
                                    '<td width="100%">',
                                        '<form id="BMapLib_formPoi" class="BMapLib_seBox"><input data-widget="quickdelete" id="BMapLib_PoiSearch" class="txtPoi" type="search"/><em id="btnPClear" class="BMapLib_xx"></em></form>',
                                    '</td>',
                                    '<td>',
                                        '<div class="BMapLib_sc_t_b sc_btn" id="BMapLib_sc_b0">百度一下</div>',
                                    '</td>',
                                '</tr>',
                            '</table>',
                        '</div>',
                        '<div id="BMapLib_sc1" style="display:none;">',
                            '<table style="width:100%;" border="0" cellpadding="0" cellspacing="0">',
                                '<tr>',
                                    '<td>',
                                        '<div id="BMapLib_sc_b1" class="BMapLib_sc_t_sw sc_btn">',
                                            '<div class="BMapLib_sc_t_sw1"></div>',
                                        '</div>',
                                    '</td>',
                                    '<td width="100%">',
                                        '<div class="BMapLib_dbseBox" style="margin-bottom: 5px;">',
                                            '<em class="BMapLib_ipt_icon BMapLib_txtSta"></em><input class="ipt_txt" type="search" id="BMapLib_txtNavS"/><em id="btnSClear" class="xx"></em>',
                                        '</div>',
                                        '<div class="BMapLib_dbseBox"><em class="BMapLib_ipt_icon BMapLib_txtEnd"></em><input class="ipt_txt" type="search" id="BMapLib_txtNavE"/><em id="btnEClear" class="xx"></em></div>',
                                    '</td>',
                                    '<td>',
                                        '<div class="BMapLib_sc_t_b sc_btn" id="BMapLib_sc_b2">',
                                            '<div class="BMapLib_sc_t_b1"></div>',
                                        '</div>',
                                    '</td>',
                                '</tr>',
                            '</table>',
                        '</div>',
                    '</div>',
                    '<div id="BMapLib_tipBox">',
                    '<div>',
                '</div>'
            ].join("");
            return html;
        }

        /**
         * 获取相关的DOM元素
         */
        , _initDom: function () {
            this.dom = {
                searchBoxContent : baidu.g("BMapLib_searchBoxContent") //容器
                , sc0        : baidu.g("BMapLib_sc0") //普通检索容器
                , sc1        : baidu.g("BMapLib_sc1")     //驾车和公交检索容器，公用一个容器
                , searchText : baidu.g("BMapLib_PoiSearch") //普通检索文本框
                , nSearchBtn : baidu.g("BMapLib_sc_b0")     //普通检索按钮
                , startText  : baidu.g("BMapLib_txtNavS")   //检索起点文本框
                , endText    : baidu.g("BMapLib_txtNavE")   //检索终点文本框
                , hSearchBtn : baidu.g("BMapLib_sc_b2")     //公交或驾车检索按钮
                , changeBtn  : baidu.g("BMapLib_sc_b1")     //交换起终点数据按钮
                , formPoi    : baidu.g("BMapLib_formPoi")   //普通检索表单
                , cityTab    : baidu.g("BMapLib_cityTab").childNodes[0]//城市文本信息
                , tipBox     : baidu.g("BMapLib_tipBox")    //提示信息条
            }
            //存储城市dom
            this.cityListSub = {};
        }

        /**
         * ip定位当前城市
         */
        , _initLocalCity: function () {
            var myCity = new BMap.LocalCity(),
                map = this.map,
                cityTab = this.dom.cityTab;
            myCity.get(function(result){
                var cityName = result.name;
                map.setCenter(cityName);
                cityTab.innerHTML = cityName;
            });
            
        }

        /**
         * 初始化各检索服务
         */
        , _initService: function () {
            var map  = this.map;
            this.localSearch = new BMap.LocalSearch(map, {
                renderOptions:{map: map}
                , onSearchComplete : function (result) {
                    var status = me.localSearch.getStatus();
                    if (status != BMAP_STATUS_SUCCESS) {
                        me.showTipBox(status);
                    } else {
                        if (result.city) {
                            me.setCityTabName(result.city);
                        }
                    }
                }
            });
            var me = this;
            this.transitRoute = new BMap.TransitRoute(map, {
                renderOptions : {map: map}
                , onSearchComplete : function () {
                    var status = me.transitRoute.getStatus();
                    if (status != BMAP_STATUS_SUCCESS) {
                        me.showTipBox(status);
                    }
                }
            });
            this.drivingRoute  = new BMap.DrivingRoute(map, {
                renderOptions:{map: map, autoViewport: true}
                , onSearchComplete : function () {
                    var status = me.drivingRoute.getStatus();
                    if (status != BMAP_STATUS_SUCCESS) {
                        me.showTipBox(status);
                    }
                }
            });
        }

        /**
         * 绑定事件
         */
        , _bind: function () {
            var eventName = "click"
                , me  = this;
            baidu.on(this.dom.nSearchBtn, eventName, function(e) {
                preventDefault(e);
                me.localSearchAction();
            });
            baidu.on(this.dom.changeBtn, eventName, function(e) {
                preventDefault(e);
                me.changeStartAndEnd();
            });
            this.dom.formPoi.onsubmit =function(){
                //通过手机键盘GO发起的POI检索
                me.localSearchAction();
                return false;
            }
            baidu.on(this.dom.cityTab, eventName, function(e){
                me.showCityBox();
            });
            this.autoCompleteIni();
        }

        /**
         * 触发localsearch事件
         */
        , localSearchAction: function () {
            this.reset();
            //失去焦点收起手机上的键盘
            this.dom.searchText.blur();
            //隐藏autocomplete
            this.searchAC.hide();
            var keyword = this.dom.searchText.value;
            this.localSearch.search(keyword);
        }

        /**
         * 公交换乘查询
         */
        , transitRouteAction: function () {
            this.reset();
            var startKeyword    = this.dom.startText.value
                , endKeyword    = this.dom.endText.value
                , me            = this
                ;
            me._geocodeAndSearch(startKeyword, endKeyword, function (startPoint, endPoint) {
                me.transitRoute.search(startPoint, endPoint);
            });
        }

        /**
         * 驾车路径检索
         */
        , drivingRouteAction : function () {
            this.reset();
            var startKeyword    = this.dom.startText.value
                , endKeyword    = this.dom.endText.value
                , me            = this
                ;
            me._geocodeAndSearch(startKeyword, endKeyword, function (startPoint, endPoint) {
                me.drivingRoute.search(startPoint, endPoint);
            });
        }

        /**
         * 将起终点关键字地理编码为坐标后执行回调
         */
        , _geocodeAndSearch: function (startKeyword, endKeyword, callback) {
            var geocoder = this._geocoder || (this._geocoder = new BMap.Geocoder());
            var me = this;
            var city = me.dom.cityTab.innerHTML || "";
            geocoder.getPoint(startKeyword, function (startPoint) {
                if (!startPoint) {
                    me.showTipBox(BMAP_STATUS_UNKNOWN_LOCATION);
                    return;
                }
                geocoder.getPoint(endKeyword, function (endPoint) {
                    if (!endPoint) {
                        me.showTipBox(BMAP_STATUS_UNKNOWN_LOCATION);
                        return;
                    }
                    callback(startPoint, endPoint);
                }, city);
            }, city);
        }

        /**
         * 显示提示信息
         */
        , showTipBox: function(status) {
            var message = "未搜索到准确的结果";
            switch (status) {
                case BMAP_STATUS_UNKNOWN_LOCATION:
                    message = "位置结果未知";
                    break;
                case BMAP_STATUS_UNKNOWN_ROUTE:
                    message = "导航结果未知";
                    break;
            }
            var tipBox = this.dom.tipBox;
            tipBox.innerHTML = message;
            tipBox.style.display = "block";
            window.setTimeout(function(){
                tipBox.style.display = "none";
            }, 4000);
        }

        /**
         * 修改起终点的文本信息
         */
        , changeStartAndEnd: function () {
            var temp = this.dom.startText.value;
            this.dom.startText.value = this.dom.endText.value;
            this.dom.endText.value = temp;
        }

        /**
         * 绑定自动完成事件
         */
        , autoCompleteIni: function () {
            this.searchAC= new BMap.Autocomplete({
                "input"      : this.dom.searchText
                , "location" : this.map
                , "baseDom"  : this.dom.searchBoxContent
            });
            this.startAC = new BMap.Autocomplete({
                "input"      : this.dom.startText
                , "location" : this.map
                , "baseDom"  : this.dom.searchBoxContent
            });
            this.endAC = new BMap.Autocomplete({
                "input"      : this.dom.endText
                , "location" : this.map
                , "baseDom"  : this.dom.searchBoxContent
            });
        }

        /**
         * 设置当前的检索类型
         */
        , setType : function (searchType) {
            var me = this;
            switch (searchType) {
                case LOCAL_SEARCH  :
                    this.showBox(0);
                    break;
                case TRANSIT_ROUTE :
                    this.showBox(1);
                    this.dom.hSearchBtn.onclick = function (e) {
                        preventDefault(e);
                        me.transitRouteAction();
                    }
                    break;
                case DRIVING_ROUTE :
                    this.showBox(1);
                    this.dom.hSearchBtn.onclick = function (e) {
                        preventDefault(e);
                        me.drivingRouteAction();
                    };
                    break;
            }
        }

        /**
         * 清除最近的结果
         */
        , reset : function () {
            this.localSearch.clearResults();
            this.transitRoute.clearResults();
            this.drivingRoute.clearResults();
        }

        /**
         * 显示面板
         * 0 ：普通检索
         * 1 : 公交检索或驾车检索
         */
        , showBox : function (type) {
            this.dom.sc0.style.display = type ? "none"  : "block";
            this.dom.sc1.style.display = type ? "block" : "none";
        }

        /**
         * 显示城市信息
         */
        , _initCityTab : function () {
            var citySelectDom = this.citySelectDom = document.createElement("div");
            citySelectDom.style.cssText = "position:absolute;left:0px;width:80%;background:#FAFAFA;left:10%;overflow:hidden;border:1px solid #8C8C8C;display:none;top:50%;";
            var areaUID = "北京|131,上海|289,天津|332,重庆|132,安徽|23,福建|16,甘肃|6,广东|7,广西|17,贵州|24,海南|21,河北|25,黑龙江|2,河南|30,湖北|15,湖南|26,江苏|18,江西|31,吉林省|9,辽宁|19,内蒙古|22,宁夏|20,青海|11,山东|8,山西|10,陕西|27,四川|32,新疆|12,西藏|13,云南|28,浙江|29".split(",");
            var AID = [];
	        for(var i=0; i<areaUID.length; i++){
		        var a = areaUID[i].split("|");
                AID.push({
                    name : a[0]
                    , code : a[1]
                });
	        }
            var html = '<div style="height:40px;line-height:40px;background:#8C8C8C;color:#fff;padding-left:10px;font-size:12px;"><span style="float:left;">请选择具体城市</span><span style="float:right;padding:0 10px;" onclick="this.parentNode.parentNode.style.display=\'none\'">关闭</span></div>' +
                    '<div style="overflow:hidden;width:100%;height:200px;position:relative;" id="BMapLib_scroll">' +
                    '<ul id = "BMapLib_cityList" style="list-style:none;padding:0px;margin:0px;">'
            ;
            for (var i = 0, l = AID.length; i < l; i++) {
                html += '<li style="height:40px;line-height:40px;border-bottom:1px solid #999;font-size:14px;padding-left:20px;" type= "1" cityCode="' + AID[i]["code"] + '" id="BMapLib_cityItem' + AID[i]["code"] + '">' + AID[i]["name"] + '</li>';
            }
            html += '</ul>' + 
                    '</div>';
            var me = this;
            citySelectDom.innerHTML = html;
            document.body.appendChild(citySelectDom);
            var enableRequest = true;
            
            this.cityList = baidu.g("BMapLib_cityList");
            this.myScroll = new iScroll('BMapLib_scroll', {
                desktopCompatibility:true,
                hScroll: false,
                hScrollbar: false,
                vScroll: true,
                vScrollbar: true
            });
            baidu.on(this.cityList, "click", function(e){
                preventDefault(e);
                if (!enableRequest) {
                    return;
                }
                enableRequest = false;
                window.setTimeout(function(){
                    enableRequest = true;
                }, 500);
                var t = e.target;
                var type = t.getAttribute("type");
                if (type == 1) { 
                    //点击了一级城市
                    var cityCode = t.getAttribute("cityCode");
                    if (me.cityListSub[cityCode] && me.cityListSub[cityCode].style.display != "none") {
                        me.cityListSub[cityCode].style.display = "none";
                    } else {
                        if (window.localStorage && window.localStorage.getItem("BMapLib_city" + cityCode)) {
                            var cityJson = window.localStorage.getItem("BMapLib_city" + cityCode);
                            me.selectCityCallback(JSON.parse(cityJson));
                        } else {
                            me.request(cityCode)
                        }
                    }
                    me.myScroll.refresh();
                    me.myScroll.scrollToElement(t, 600);
                } else if (type == 2) {
                    //点击了二级城市
                    me.setCityTabName(t.innerHTML);
                    var geo = t.getAttribute("geo");
                    var geoArr = geo.split(",");
                    var px = new BMap.Pixel(geoArr[0], geoArr[1]);
                    var point = me.projection.pointToLngLat(px);
                    me.map.centerAndZoom(point, 13);
                    me.hideCitySelect();
                } else if (type == 3) {
                    //点击了全市
                    var cityName = t.getAttribute("cityname");
                    me.map.centerAndZoom(cityName, 12);
                    me.setCityTabName(cityName);
                    me.hideCitySelect();
                }
            });
        }

        /**
         * 设置citytab的城市名
         */
        , setCityTabName : function (cityName) {
            this.dom.cityTab.innerHTML = cityName;
        }

        /**
         * 请求函数
         */
        , request: function (cityId) {
            var me = this;
            // 生成随机数
            var timeStamp = (Math.random() * 100000).toFixed(0);

            //创建callback函数
            window.baidu = window.baidu || {};
            window.baidu["_cbk" + timeStamp] = function (json) {
                //本地存储
                if (window.localStorage && window.localStorage != null) {
                    window.localStorage.setItem("BMapLib_city" + cityId, JSON.stringify(json));
                }
                me.selectCityCallback(json);
                delete window.baidu["_cbk" + timeStamp];
            }
            var url = "http://map.baidu.com/?qt=sub_area_list&areacode=" + cityId + "&level=1&from=mapapi&ie=utf-8&l=12&callback=" + "baidu._cbk" + timeStamp;
            var script = document.createElement('script');
            script.setAttribute("src", url);
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", "utf-8");
            // 脚本加载完成后进行移除
            if (script.addEventListener) {
                script.addEventListener('load', function(e) {
                    var t = e.target;
                    t.parentNode.removeChild(t);
                }, false);
            } else if (script.attachEvent) {
                script.attachEvent('onreadystatechange', function(e) {
                    var t = window.event.srcElement;
                    if (t && (t.readyState == 'loaded' || t.readyState == 'complete')) {
                        t.parentNode.removeChild(t);
                    }
                });
            }
            setTimeout(function() {
                document.getElementsByTagName('head')[0].appendChild(script);
                script = null;
            }, 1);
        }

        /**
         * 请求城市返回的callback
         */
        , selectCityCallback: function (json) {
            if (json.result.error !=0 ) {
                return;
            }
            var sub = json.content.sub
                , parentCode = json.content.area_code
                , cityName   = json.content.area_name
                ;
            for (var j in this.cityListSub) {
                this.cityListSub[j].style.display = "none";
            }
            if (!this.cityListSub[parentCode]) {
                var li = this.cityListSub[parentCode]= document.createElement("li")
                var html = "<ul style='list-style:none;margin:0;padding:0;'>";
                var regex=/北京|上海|天津|重庆/g;
                if (cityName.match(regex)) {
                    html += "<li style='padding-left:30px;height:30px;line-height:30px;font-size:14px;border-bottom:1px solid #ccc;background:#f3f3f3;' type='3' cityname='" + cityName + "'>全市</li>";
                }
                for (var i = 0,l = sub.length; i <l; i++) {
                    var geo = sub[i].geo.split("|")[2];
                    html += "<li style='padding-left:30px;height:30px;line-height:30px;font-size:14px;border-bottom:1px solid #ccc;background:#f3f3f3;' type='2' geo='" + geo.substr(0, geo.length-1) + "'>" + sub[i].area_name + "</li>";
                }
                html += "</ul>";
                li.innerHTML = html;
                this.cityList.insertBefore(li, baidu.g("BMapLib_cityItem" + parentCode).nextSibling);
            } else {
                this.cityListSub[parentCode].style.display = "block";
            }
        }

        /**
         * 关闭城市选择弹层
         */
        , showCityBox : function () {
            this.citySelectDom.style.display = "block";
            this.citySelectDom.style.top = parseInt(document.body.scrollTop, 10) + 20 + "px";
            this.myScroll.refresh();
        }

        /**
         * 关闭城市选择弹层 
         */
        , hideCitySelect : function () {
            this.citySelectDom.style.display = "none";
        }
    }

    /**
     * @exports SearchControl as BMapLib.SearchControl
     */
    BMapLib.SearchControl = SearchControl;

})();
