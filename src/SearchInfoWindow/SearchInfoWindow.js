/**
 * @fileoverview 百度地图的可根据当前poi点来进行周边检索、公交、驾车查询的信息窗口，对外开放。
 * 主入口类是<a href="symbols/BMapLib.SearchInfoWindow.html">SearchInfoWindow</a>，
 * 基于Baidu Map API 1.4。
 *
 * @author Baidu Map Api Group
 * @version 1.4
 */
/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};
//常量，searchInfoWindow可选择的检索类型
var BMAPLIB_TAB_SEARCH   = 0, BMAPLIB_TAB_TO_HERE  = 1, BMAPLIB_TAB_FROM_HERE  = 2;
(function() {
    //声明baidu包
    var T, baidu = T = baidu || {version: '1.5.0'};
    baidu.guid = '$BAIDU$';
    //以下方法为百度Tangram框架中的方法，请到http://tangram.baidu.com 查看文档
    (function() {
        window[baidu.guid] = window[baidu.guid] || {};

        baidu.lang = baidu.lang || {};
        baidu.lang.isString = function (source) {
            return '[object String]' == Object.prototype.toString.call(source);
        };
        baidu.lang.Event = function (type, target) {
            this.type = type;
            this.returnValue = true;
            this.target = target || null;
            this.currentTarget = null;
        };


        baidu.object = baidu.object || {};
        baidu.extend =
        baidu.object.extend = function (target, source) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }

            return target;
        };
        baidu.event = baidu.event || {};
        baidu.event._listeners = baidu.event._listeners || [];
        baidu.dom = baidu.dom || {};

        baidu.dom._g = function (id) {
            if (baidu.lang.isString(id)) {
                return document.getElementById(id);
            }
            return id;
        };
        baidu._g = baidu.dom._g;
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
                afterFilter,
                realType = type;
            type = type.toLowerCase();
            // filter过滤
            if(filter && filter[type]){
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

        baidu.on = baidu.event.on;
        baidu.event.un = function (element, type, listener) {
            element = baidu.dom._g(element);
            type = type.replace(/^on/i, '').toLowerCase();

            var lis = baidu.event._listeners,
                len = lis.length,
                isRemoveAll = !listener,
                item,
                realType, realListener;
            while (len--) {
                item = lis[len];

                if (item[1] === type
                    && item[0] === element
                    && (isRemoveAll || item[2] === listener)) {
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
        baidu.un = baidu.event.un;
        baidu.dom.g = function (id) {
            if ('string' == typeof id || id instanceof String) {
                return document.getElementById(id);
            } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
                return id;
            }
            return null;
        };
        baidu.g = baidu.G = baidu.dom.g;
        baidu.string = baidu.string || {};

        baidu.browser = baidu.browser || {};
        baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
        baidu.dom._NAME_ATTRS = (function () {
            var result = {
                'cellpadding': 'cellPadding',
                'cellspacing': 'cellSpacing',
                'colspan': 'colSpan',
                'rowspan': 'rowSpan',
                'valign': 'vAlign',
                'usemap': 'useMap',
                'frameborder': 'frameBorder'
            };

            if (baidu.browser.ie < 8) {
                result['for'] = 'htmlFor';
                result['class'] = 'className';
            } else {
                result['htmlFor'] = 'for';
                result['className'] = 'class';
            }

            return result;
        })();
        baidu.dom.setAttr = function (element, key, value) {
            element = baidu.dom.g(element);
            if ('style' == key){
                element.style.cssText = value;
            } else {
                key = baidu.dom._NAME_ATTRS[key] || key;
                element.setAttribute(key, value);
            }
            return element;
        };
         baidu.setAttr = baidu.dom.setAttr;
        baidu.dom.setAttrs = function (element, attributes) {
            element = baidu.dom.g(element);
            for (var key in attributes) {
                baidu.dom.setAttr(element, key, attributes[key]);
            }
            return element;
        };
        baidu.setAttrs = baidu.dom.setAttrs;
        baidu.dom.create = function(tagName, opt_attributes) {
            var el = document.createElement(tagName),
                attributes = opt_attributes || {};
            return baidu.dom.setAttrs(el, attributes);
        };

        baidu.cookie = baidu.cookie || {};


        baidu.cookie._isValidKey = function (key) {
            // http://www.w3.org/Protocols/rfc2109/rfc2109
            // Syntax:  General
            // The two state management headers, Set-Cookie and Cookie, have common
            // syntactic properties involving attribute-value pairs.  The following
            // grammar uses the notation, and tokens DIGIT (decimal digits) and
            // token (informally, a sequence of non-special, non-white space
            // characters) from the HTTP/1.1 specification [RFC 2068] to describe
            // their syntax.
            // av-pairs   = av-pair *(";" av-pair)
            // av-pair    = attr ["=" value] ; optional value
            // attr       = token
            // value      = word
            // word       = token | quoted-string
            
            // http://www.ietf.org/rfc/rfc2068.txt
            // token      = 1*<any CHAR except CTLs or tspecials>
            // CHAR       = <any US-ASCII character (octets 0 - 127)>
            // CTL        = <any US-ASCII control character
            //              (octets 0 - 31) and DEL (127)>
            // tspecials  = "(" | ")" | "<" | ">" | "@"
            //              | "," | ";" | ":" | "\" | <">
            //              | "/" | "[" | "]" | "?" | "="
            //              | "{" | "}" | SP | HT
            // SP         = <US-ASCII SP, space (32)>
            // HT         = <US-ASCII HT, horizontal-tab (9)>
                
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        };

        baidu.cookie.getRaw = function (key) {
            if (baidu.cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                    
                if (result) {
                    return result[2] || null;
                }
            }

            return null;
        };

        baidu.cookie.get = function (key) {
            var value = baidu.cookie.getRaw(key);
            if ('string' == typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        };

        baidu.cookie.setRaw = function (key, value, options) {
            if (!baidu.cookie._isValidKey(key)) {
                return;
            }
            
            options = options || {};
            //options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
            //berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的
            
            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' == typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
            
            document.cookie =
                key + "=" + value
                + (options.path ? "; path=" + options.path : "")
                + (expires ? "; expires=" + expires.toGMTString() : "")
                + (options.domain ? "; domain=" + options.domain : "")
                + (options.secure ? "; secure" : ''); 
        };

        baidu.cookie.set = function (key, value, options) {
            baidu.cookie.setRaw(key, encodeURIComponent(value), options);
        };

        baidu.cookie.remove = function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            baidu.cookie.setRaw(key, '', options);
        };// 声明快捷

        //检验是否是正确的手机号
        baidu.isPhone =  function(phone) {
            return /\d{11}/.test(phone);
        }

        //检验是否是正确的激活码
        baidu.isActivateCode =  function(vcode) {
            return /\d{4}/.test(vcode);
        }


        T.undope=true;
    })();

    /**
     * @exports SearchInfoWindow as BMapLib.SearchInfoWindow
     */

    var SearchInfoWindow =
        /**
         * SearchInfoWindow类的构造函数
         * @class SearchInfoWindow <b>入口</b>。
         * 可以定义检索模版。
         * @constructor
         * @param {Map} map Baidu map的实例对象.
         * @param {String} content searchInfoWindow中的内容,支持HTML内容.
         * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
         * {<br />"<b>title</b>" : {String} searchInfoWindow的标题内容，支持HTML内容<br/>
         * {<br />"<b>width</b>" : {Number} searchInfoWindow的内容宽度<br/>
         * {<br />"<b>height</b>" : {Number} searchInfoWindow的内容高度 <br/>
         * {<br />"<b>offset</b>" : {Size} searchInfoWindow的偏移量<br/>
         * <br />"<b>enableAutoPan</b>" : {Boolean} 是否启动自动平移功能,默认开启    <br />
         * <br />"<b>panel</b>" : {String} 用来展现检索信息的面板,可以是dom元素或元素的ID值 <br />
         * <br />"<b>searchTypes</b>" : {Array} 通过传入数组设置检索面板的Tab选项共有三个选项卡可选择，选项卡顺序也按照数组的顺序来排序，传入空数组则不显示检索模版，不设置此参数则默认所有选项卡都显示。数组可传入的值为常量：BMAPLIB_TAB_SEARCH<周边检索>, BMAPLIB_TAB_TO_HERE<到去这里>, BMAPLIB_TAB_FROM_HERE<从这里出发>  <br />
         * <br />"<b>enableSendToPhone</b>" : {Boolean} 是否启动发送到手机功能,默认开启    <br />
         * }<br />.
         * @example <b>参考示例：</b><br />
         * var searchInfoWindow = new BMapLib.SearchInfoWindow(map,"百度地图api",{
         *     title "百度大厦",
         *     width  : 280,
         *     height : 50,
         *     panel  : "panel", //检索结果面板
         *     enableAutoPan : true, //自动平移
         *     enableSendToPhone : true, //是否启动发送到手机功能
         *     searchTypes :[
         *         BMAPLIB_TAB_SEARCH,   //周边检索
         *         BMAPLIB_TAB_TO_HERE,  //到这里去
         *         BMAPLIB_TAB_FROM_HERE //从这里出发
         *     ]
         * });
         */
        BMapLib.SearchInfoWindow = function(map, content, opts) {

        //存储当前实例
        this.guid = guid++;
        BMapLib.SearchInfoWindow.instance[this.guid] = this;

        this._isOpen = false;
        this._map = map;

        this._opts = opts   = opts || {};
        this._content = content || "";
        this._opts.width          = opts.width;
        this._opts.height         = opts.height;
        this._opts._title         = opts.title || "";
        this._opts.offset         = opts.offset || new BMap.Size(0,0);
        this._opts.enableAutoPan  = opts.enableAutoPan === false? false : true;
        this._opts._panel         = opts.panel || null;
        this._opts._searchTypes   = opts.searchTypes; //传入数组形式
        this._opts.enableSendToPhone = opts.enableSendToPhone; //是否开启发送到手机
    }
    SearchInfoWindow.prototype = new BMap.Overlay();
    SearchInfoWindow.prototype.initialize = function(map) {
        this._closeOtherSearchInfo();
        var me = this;

        var div = this._createSearchTemplate();

        var floatPane = map.getPanes().floatPane;
        floatPane.style.width = "auto";
        floatPane.appendChild(div);
        this._initSearchTemplate();
        //设置完内容后，获取div的宽度,高度
        this._getSearchInfoWindowSize();
        this._boxWidth = parseInt(this.container.offsetWidth,10);
        this._boxHeight = parseInt(this.container.offsetHeight,10);
        //阻止各种冒泡事件
        baidu.event.on(div,"onmousedown",function(e){
            me._stopBubble(e);
        });
        baidu.event.on(div,"ontouchstart",function(e){
            me._stopBubble(e);
        });
        baidu.event.on(div,"touchmove",function(e){
            me._stopBubble(e);
        });
        baidu.event.on(div,"touchend",function(e){
            me._stopBubble(e);
        });
        baidu.event.on(div,"onmouseover",function(e){
            me._stopBubble(e);
        });
        baidu.event.on(div,"click",function(e){
            me._stopBubble(e);
        });
        baidu.event.on(div,"dblclick",function(e){
            me._stopBubble(e);
        });
        return div;
    }
    SearchInfoWindow.prototype.draw = function() {
        this._isOpen && this._adjustPosition(this._point);
    }
    /**
     * 打开searchInfoWindow
     * @param {Marker|Point} location 要在哪个marker或者point上打开searchInfoWindow
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.open();
     */
    SearchInfoWindow.prototype.open = function(anchor){
        this._map.closeInfoWindow();
        var me = this,poi;
        if(!this._isOpen) {
            this._map.addOverlay(this);
            this._isOpen = true;
            //延迟10ms派发open事件，使后绑定的事件可以触发。
            setTimeout(function(){
                me._dispatchEvent(me,"open",{"point" : me._point});
            },10);
        }
        if(anchor instanceof BMap.Point){
            poi = anchor;
            //清除之前存在的marker事件绑定，如果存在的话
            this._removeMarkerEvt();
            this._marker = null;
        }else if(anchor instanceof BMap.Marker){
          //如果当前marker不为空，说明是第二个marker，或者第二次点open按钮,先移除掉之前绑定的事件
          if(this._marker){
            this._removeMarkerEvt();
          }
            poi = anchor.getPosition();
            this._marker = anchor;
            !this._markerDragend && this._marker.addEventListener("dragend",this._markerDragend = function(e){
              me._point = e.point;
              me._adjustPosition(me._point);
              me._panBox();
              me.show();
            });
             //给marker绑定dragging事件，拖动marker的时候，searchInfoWindow也跟随移动
            !this._markerDragging && this._marker.addEventListener("dragging",this._markerDragging = function(){
              me.hide();
              me._point = me._marker.getPosition();
                me._adjustPosition(me._point);
            });
        }
        //打开的时候，将infowindow显示
        this.show();
        this._point = poi;
        this._panBox();
        this._adjustPosition(this._point);
    }
    /**
     * 关闭searchInfoWindow
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.close();
     */
    SearchInfoWindow.prototype.close = function(){
        if(this._isOpen){
            this._map.removeOverlay(this);
            this._disposeAutoComplete();
            this._isOpen = false;
            this._dispatchEvent(this,"close",{"point" : this._point});
        }
    }

  /**
     * 打开searchInfoWindow时，派发事件的接口
     * @name SearchInfoWindow#Open
     * @event
     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
     * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
     * <br />"<b>type</b>：{String} 事件类型,
     * <br />"<b>point</b>：{Point} searchInfoWindow的打开位置}
     *
     * @example <b>参考示例：</b>
     * searchInfoWindow.addEventListener("open", function(e) {
     *     alert(e.type);
     * });
     */
   /**
     * 关闭searchInfoWindow时，派发事件的接口
     * @name SearchInfoWindow#Close
     * @event
     * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
     * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
     * <br />"<b>type</b>：{String} 事件类型,
     * <br />"<b>point</b>：{Point} searchInfoWindow的关闭位置}
     *
     * @example <b>参考示例：</b>
     * searchInfoWindow.addEventListener("close", function(e) {
     *     alert(e.type);
     * });
     */
  /**
     * 启用自动平移
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.enableAutoPan();
     */
    SearchInfoWindow.prototype.enableAutoPan = function(){
        this._opts.enableAutoPan = true;
    }
    /**
     * 禁用自动平移
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.disableAutoPan();
     */
    SearchInfoWindow.prototype.disableAutoPan = function(){
        this._opts.enableAutoPan = false;
    }
    /**
     * 设置searchInfoWindow的内容
     * @param {String|HTMLElement} content 弹出气泡中的内容，支持HTML格式
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.setContent("百度地图API");
     */
    SearchInfoWindow.prototype.setContent = function(content){
        this._setContent(content);
        this._getSearchInfoWindowSize();
        this._adjustPosition(this._point);
    },
    /**
     * 设置searchInfoWindow的内容
     * @param {String|HTMLElement} title 弹出气泡中的内容，支持HTML格式
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.setTitle("百度地图API");
     */
    SearchInfoWindow.prototype.setTitle = function(title){
        this.dom.title.innerHTML = title;
        this._opts._title = title;
    }
    /**
     * 获取searchInfoWindow的内容
     * @return {String} String
     *
     * @example <b>参考示例：</b><br />
     * alret(searchInfoWindow.getContent());
     */
    SearchInfoWindow.prototype.getContent = function(){
        return this.dom.content.innerHTML;
    },
    /**
     * 获取searchInfoWindow的标题
     * @return {String} String
     *
     * @example <b>参考示例：</b><br />
     * alert(searchInfoWindow.getTitle());
     */
    SearchInfoWindow.prototype.getTitle = function(){
        return this.dom.title.innerHTML;
    }
    /**
     * 设置信息窗的地理位置
     * @param {Point} point 设置position
     * @return none
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.setPosition(new BMap.Point(116.35,39.911));
     */
    SearchInfoWindow.prototype.setPosition = function(poi){
        this._point = poi;
        this._adjustPosition(poi);
        this._panBox();
        this._removeMarkerEvt();
    }
    /**
     * 获得信息窗的地理位置
     * @return {Point} 信息窗的地理坐标
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.getPosition();
     */
    SearchInfoWindow.prototype.getPosition = function(){
        return this._point;
    }
    /**
     * 返回信息窗口的箭头距离信息窗口在地图
     * 上所锚定的地理坐标点的像素偏移量。
     * @return {Size} Size
     *
     * @example <b>参考示例：</b><br />
     * searchInfoWindow.getOffset();
     */
    SearchInfoWindow.prototype.getOffset = function(){
        return this._opts.offset;
    },

    baidu.object.extend(SearchInfoWindow.prototype,{
        /**
         * 保持屏幕只有一个searchInfoWindow,关闭现在已打开的searchInfoWindow
         */
        _closeOtherSearchInfo: function () {
            var instance = BMapLib.SearchInfoWindow.instance,
                len      = instance.length;
            while (len--) {
                if (instance[len]._isOpen) {
                    instance[len].close();
                }
            }
        },

        /**
       * 设置searchInfoWindow的内容
       * @param {String|HTMLElement} content 弹出气泡中的内容
       * @return none
       *
       * @example <b>参考示例：</b><br />
       * searchInfoWindow.setContent("百度地图API");
       */
        _setContent: function(content){
          if(!this.dom || !this.dom.content){
              return;
          }
          //string类型的content
          if(typeof content.nodeType === "undefined"){
              this.dom.content.innerHTML = content;
          }else{
              this.dom.content.appendChild(content);
          }

            var me = this;
            me._adjustContainerWidth();

          this._content = content;
        },
        /**
         * 调整searchInfoWindow的position
         * @return none
         */
        _adjustPosition: function(poi){
            var pixel = this._getPointPosition(poi);
            var icon = this._marker && this._marker.getIcon();
            if(this._marker){
                var iconAnchor = (icon && icon.anchor) || {width: 0, height: 0};
                var iconInfoWindowAnchor = (icon && icon.infoWindowAnchor) || {width: 0, height: 0};
                var markerOffset = this._marker.getOffset() || {width: 0, height: 0};
                this.container.style.bottom = -(pixel.y - this._opts.offset.height - iconAnchor.height + iconInfoWindowAnchor.height) - markerOffset.height + 2 + 30 + "px";
                this.container.style.left = pixel.x - iconAnchor.width + markerOffset.width + iconInfoWindowAnchor.width - this._boxWidth / 2 + 28 + "px";
            }else{
                this.container.style.bottom = -(pixel.y - this._opts.offset.height) + 30 + "px";
                this.container.style.left = pixel.x - this._boxWidth / 2 + 25 + "px";
            }
        },
        /**
         * 得到searchInfoWindow的position
         * @return Point  searchInfoWindow当前的position
         */
        _getPointPosition: function(poi){
            this._pointPosition = this._map.pointToOverlayPixel(poi);
            return this._pointPosition;
        },
        /**
         * 得到searchInfoWindow的高度跟宽度
         * @return none
         */
        _getSearchInfoWindowSize: function(){
          this._boxWidth = parseInt(this.container.offsetWidth,10);
          this._boxHeight = parseInt(this.container.offsetHeight,10);
        },
        /**
         * 阻止事件冒泡
         * @return none
         */
        _stopBubble: function(e){
            if(e && e.stopPropagation){
                e.stopPropagation();
            }else{
                window.event.cancelBubble = true;
            }
        },
        /**
         * 自动平移searchInfoWindow，使其在视野中全部显示
         * @return none
         */
        _panBox: function(){
            if(!this._opts.enableAutoPan){
                return;
            }
            var mapH = parseInt(this._map.getContainer().offsetHeight,10),
                mapW = parseInt(this._map.getContainer().offsetWidth,10),
                boxH = this._boxHeight,
                boxW = this._boxWidth;
            //searchInfoWindow窗口本身的宽度或者高度超过map container
            if(boxH >= mapH || boxW >= mapW){
                return;
            }
            //如果point不在可视区域内
            if(!this._map.getBounds().containsPoint(this._point)){
                this._map.setCenter(this._point);
            }
            var anchorPos = this._map.pointToPixel(this._point),
                panTop,panY,
                //左侧超出
                panLeft  = boxW / 2 - 28 - anchorPos.x + 10,
                //右侧超出
                panRight = boxW / 2 + 28 + anchorPos.x - mapW + 10;
            if(this._marker){
                var icon = this._marker.getIcon();
            }

            //上侧超出
            var iconAnchor2 = (icon && icon.anchor) || {width: 0, height: 0};
            var iconInfoWindowAnchor2 = (icon && icon.infoWindowAnchor) || {width: 0, height: 0};
            var markerOffset2 = (this._marker && this._marker.getOffset()) || {width: 0, height: 0};
            var h = this._marker ? iconAnchor2.height + markerOffset2.height - iconInfoWindowAnchor2.height : 0;
            panTop = boxH - anchorPos.y + this._opts.offset.height + h + 31 + 10;

            panX = panLeft > 0 ? panLeft : (panRight > 0 ? -panRight : 0);
            panY = panTop > 0 ? panTop : 0;
            this._map.panBy(panX,panY);
        },
        _removeMarkerEvt: function(){
      this._markerDragend && this._marker.removeEventListener("dragend", this._markerDragend);
            this._markerDragging && this._marker.removeEventListener("dragging", this._markerDragging);
            this._markerDragend = this._markerDragging = null;
        },
        /**
       * 集中派发事件函数
       *
       * @private
       * @param {Object} instance 派发事件的实例
       * @param {String} type 派发的事件名
       * @param {Json} opts 派发事件里添加的参数，可选
       */
      _dispatchEvent: function(instance, type, opts) {
          type.indexOf("on") != 0 && (type = "on" + type);
          var event = new baidu.lang.Event(type);
          if (!!opts) {
              for (var p in opts) {
                  event[p] = opts[p];
              }
          }
          instance.dispatchEvent(event);
      },

        /**
         * 检索infowindow模板的初始化操作
         */
        _initSearchTemplate: function() {
            this._initDom();
            this._initPanelTemplate();
            this.setTitle(this._opts._title);
            if (this._opts.height) {
                this.dom.content.style.height = parseInt(this._opts.height, 10) + "px";
            }
            this._setContent(this._content);
            this._initService();
            this._bind();
            if (this._opts._searchTypes) {
                this._setSearchTypes();
            }
            this._mendIE6();
        },

        /**
         * 创建检索模板
         * @return dom
         */
        _createSearchTemplate: function() {
            if (!this._div) {
                var div = baidu.dom.create('div', {
                    "class" : "BMapLib_SearchInfoWindow",
                    "id"    : "BMapLib_SearchInfoWindow" + this.guid
                });
                var template = [
                    '<div class="BMapLib_bubble_top">',
                        '<div class="BMapLib_bubble_title" id="BMapLib_bubble_title' + this.guid + '"></div>',
                        '<div class="BMapLib_bubble_tools">',
                            '<div class="BMapLib_bubble_close" title="关闭" id="BMapLib_bubble_close' + this.guid + '">',
                            '</div>',
                            '<div class="BMapLib_sendToPhone" title="发送到手机" id="BMapLib_sendToPhone' + this.guid + '">',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="BMapLib_bubble_center">',
                        '<div class="BMapLib_bubble_content" id="BMapLib_bubble_content' + this.guid + '">',
                        '</div>',
                        '<div class="BMapLib_nav" id="BMapLib_nav' + this.guid + '">',
                            '<ul class="BMapLib_nav_tab" id="BMapLib_nav_tab' + this.guid + '">', //tab选项卡
                                '<li class="BMapLib_first BMapLib_current" id="BMapLib_tab_search' + this.guid + '" style="display:block;">',
                                    '<span class="BMapLib_icon BMapLib_icon_nbs"></span>在附近找',
                                '</li>',
                                '<li class="" id="BMapLib_tab_tohere' + this.guid + '" style="display:block;">',
                                    '<span class="BMapLib_icon BMapLib_icon_tohere"></span>到这里去',
                                '</li>',
                                '<li class="" id="BMapLib_tab_fromhere' + this.guid + '" style="display:block;">',
                                    '<span class="BMapLib_icon BMapLib_icon_fromhere"></span>从这里出发',
                                '</li>',
                            '</ul>',
                            '<ul class="BMapLib_nav_tab_content">', //tab内容
                                '<li id="BMapLib_searchBox' + this.guid + '">',
                                    '<table width="100%" align="center" border=0 cellpadding=0 cellspacing=0>',
                                        '<tr><td style="padding-left:8px;"><input id="BMapLib_search_text' + this.guid + '" class="BMapLib_search_text" type="text" maxlength="100" autocomplete="off"></td><td width="55" style="padding-left:7px;"><input id="BMapLib_search_nb_btn' + this.guid + '" type="submit" value="搜索" class="iw_bt"></td></tr>',
                                    '</table>',
                                '</li>',
                                '<li id="BMapLib_transBox' + this.guid + '" style="display:none">',
                                    '<table width="100%" align="center" border=0 cellpadding=0 cellspacing=0>',
                                        '<tr><td width="30" style="padding-left:8px;"><div id="BMapLib_stationText' + this.guid + '">起点</div></td><td><input id="BMapLib_trans_text' + this.guid + '" class="BMapLib_trans_text" type="text" maxlength="100" autocomplete="off"></td><td width="106" style="padding-left:7px;"><input id="BMapLib_search_bus_btn' + this.guid + '" type="button" value="公交" class="iw_bt" style="margin-right:5px;"><input id="BMapLib_search_drive_btn' + this.guid + '" type="button" class="iw_bt" value="驾车"></td></tr>',
                                    '</table>',
                                '</li>',
                            '</ul>',
                        '</div>',
                    '</div>',
                    '<div class="BMapLib_bubble_bottom"></div>',
                    '<img src="//api.map.baidu.com/library/SearchInfoWindow/1.4/src/iw_tail.png" width="58" height="31" alt="" class="BMapLib_trans" id="BMapLib_trans' + this.guid + '" style="left:144px;"/>'
                ];
                div.innerHTML = template.join("");
                this._div = div;
            }
            return this._div;
        },

        /**
         * 创建面板
         */
        _initPanelTemplate: function() {
            var panel = baidu.g(this._opts._panel);
            if (!this.dom.panel && panel) {
                panel.innerHTML = "";
                this.dom.panel = panel;
                //供地址选择页用的提示文字
                var address = baidu.dom.create('div');
                address.style.cssText = "display:none;background:#FD9;height:30px;line-height:30px;text-align:center;font-size:12px;color:#994C00;";
                panel.appendChild(address);
                this.dom.panel.address = address;
                //供地址检索面板用
                var localSearch = baidu.dom.create('div');
                panel.appendChild(localSearch);
                this.dom.panel.localSearch = localSearch;
            }
        },

        /**
         * 获取相关的DOM元素
         */
        _initDom: function () {
            if (!this.dom) {
                this.dom = {
                    container     : baidu.g("BMapLib_SearchInfoWindow" + this.guid) //容器
                    , content     : baidu.g("BMapLib_bubble_content" + this.guid)   //主内容
                    , title       : baidu.g("BMapLib_bubble_title" + this.guid)     //标题
                    , closeBtn    : baidu.g("BMapLib_bubble_close" + this.guid)     //关闭按钮
                    , transIco    : baidu.g("BMapLib_trans" + this.guid)            //infowindow底下三角形
                    , navBox      : baidu.g("BMapLib_nav" + this.guid)              //检索容器
                    , navTab      : baidu.g("BMapLib_nav_tab" + this.guid)          //tab容器
                    , seartTab    : baidu.g("BMapLib_tab_search" + this.guid)       //在附近找tab
                    , tohereTab   : baidu.g("BMapLib_tab_tohere" + this.guid)       //到这里去tab
                    , fromhereTab : baidu.g("BMapLib_tab_fromhere" + this.guid)     //从这里出发tab
                    , searchBox   : baidu.g("BMapLib_searchBox" + this.guid)        //普通检索容器
                    , transBox    : baidu.g("BMapLib_transBox" + this.guid)         //公交驾车检索容器，从这里出发和到这里去公用一个容器
                    , stationText : baidu.g("BMapLib_stationText" + this.guid)      //起点或终点文本
                    , nbBtn       : baidu.g("BMapLib_search_nb_btn" + this.guid)    //普通检索按钮
                    , busBtn      : baidu.g("BMapLib_search_bus_btn" + this.guid)   //公交驾车检索按钮
                    , driveBtn    : baidu.g("BMapLib_search_drive_btn" + this.guid) //驾车检索按钮
                    , searchText  : baidu.g("BMapLib_search_text" + this.guid)      //普通检索文本框
                    , transText   : baidu.g("BMapLib_trans_text" + this.guid)       //公交驾车检索文本框
                    , sendToPhoneBtn : baidu.g("BMapLib_sendToPhone" + this.guid)      //发送到手机
                }
                this.container = this.dom.container;
            }
        },

        /**
         * 设置infowindow内容的宽度
         */
        _adjustContainerWidth: function() {
            var width = 250,
                height = 0;
            if (this._opts.width) {
                width = parseInt(this._opts.width, 10);
                width += 10;
            } else {
                width = parseInt(this.dom.content.offsetWidth, 10);
            }
            if (width < 250) {
                width = 250;
            }

            this._width = width;
            //设置container的宽度
            this.container.style.width = this._width + "px";
            this._adjustTransPosition();
        },

        /**
         * 调整infowindow下三角形的位置
         */
        _adjustTransPosition: function() {
            //调整三角形的位置
            this.dom.transIco.style.left = this.container.offsetWidth / 2 - 2 - 29 + "px";
            this.dom.transIco.style.top = this.container.offsetHeight - 2 + "px";
        },

        /**
         * 初始化各检索服务
         */
        _initService: function () {
            var map  = this._map;
            var me = this;
            var renderOptions = {}
            renderOptions.map = map;

            if (this.dom.panel) {
                renderOptions.panel = this.dom.panel.localSearch;
            }

            if (!this.localSearch) {
                this.localSearch = new BMap.LocalSearch(map, {
                    renderOptions: renderOptions
                    , onSearchComplete : function (result) {
                        me._clearAddress();
                        me._drawCircleBound();
                    }
                });
            }

            if (!this.transitRoute) {
                this.transitRoute = new BMap.TransitRoute(map, {
                    renderOptions: renderOptions
                    , onSearchComplete : function (results) {
                        me._transitRouteComplete(me.transitRoute, results);
                    }
                });
            }

            if (!this.drivingRoute) {
                this.drivingRoute  = new BMap.DrivingRoute(map, {
                    renderOptions: renderOptions
                    , onSearchComplete : function (results) {
                        me._transitRouteComplete(me.drivingRoute, results);
                    }
                });
            }
        },

        /**
         * 绑定事件
         */
        _bind: function () {
            var me  = this;

            //关闭按钮
            baidu.on(this.dom.closeBtn, "click", function(e) {
                me.close();
            });

            baidu.on(this.dom.closeBtn, "touchstart", function(e) {
                me.close();
            });

            //发送到手机按钮
            baidu.on(this.dom.sendToPhoneBtn, "click", function(e) {
                me._sendToPhone();
            });

            baidu.on(this.dom.sendToPhoneBtn, "touchstart", function(e) {
                me._sendToPhone();
            });

            //周边检索tab键
            baidu.on(this.dom.seartTab, "click", function(e) {
                me._showTabContent(BMAPLIB_TAB_SEARCH);
            });

            baidu.on(this.dom.seartTab, "touchstart", function(e) {
                me._showTabContent(BMAPLIB_TAB_SEARCH);
            });

            //到这里去tab
            baidu.on(this.dom.tohereTab, "click", function(e) {
                me._showTabContent(BMAPLIB_TAB_TO_HERE);
            });

            baidu.on(this.dom.tohereTab, "touchstart", function(e) {
                me._showTabContent(BMAPLIB_TAB_TO_HERE);
            });

            //从这里出发tab
            baidu.on(this.dom.fromhereTab, "click", function(e) {
                me._showTabContent(BMAPLIB_TAB_FROM_HERE);
            });

            baidu.on(this.dom.fromhereTab, "touchstart", function(e) {
                me._showTabContent(BMAPLIB_TAB_FROM_HERE);
            });

            //周边检索输入框
            baidu.on(this.dom.searchText, "click", function(e) {
                me._localSearchAction();
            });

            baidu.on(this.dom.searchText, "touchstart", function(e) {
                me._localSearchAction();
            });

            //周边检索按钮
            baidu.on(this.dom.nbBtn, "click", function(e) {
                me._localSearchAction();
            });

            baidu.on(this.dom.nbBtn, "touchstart", function(e) {
                me._localSearchAction();
            });

            //公交检索按钮
            baidu.on(this.dom.busBtn, "click", function(e) {
                me._transitRouteAction(me.transitRoute);
            });

            baidu.on(this.dom.busBtn, "touchstart", function(e) {
                me._transitRouteAction(me.transitRoute);
            });

            //驾车检索按钮
            baidu.on(this.dom.driveBtn, "click", function(e) {
                me._transitRouteAction(me.drivingRoute);
            });

            baidu.on(this.dom.driveBtn, "touchstart", function(e) {
                me._transitRouteAction(me.drivingRoute);
            });

            //文本框自动完成提示
            this._autoCompleteIni();

            if (this._opts.enableSendToPhone === false) {
                this.dom.sendToPhoneBtn.style.display = 'none';
            }
        },

        /**
         * 显示tab内容
         */
        _showTabContent: function(type) {
            this._hideAutoComplete();
            var tabs = this.dom.navTab.getElementsByTagName("li"),
                len = tabs.length;
            
            for (var i = 0, len = tabs.length; i < len; i++) {
                tabs[i].className = "";
            }

            //显示当前tab content并高亮tab
            switch (type) {
                case BMAPLIB_TAB_SEARCH:
                    this.dom.seartTab.className      = "BMapLib_current";
                    this.dom.searchBox.style.display = "block";
                    this.dom.transBox.style.display  = "none";
                    break;
                case BMAPLIB_TAB_TO_HERE:
                    this.dom.tohereTab.className     = "BMapLib_current";
                    this.dom.searchBox.style.display = "none";
                    this.dom.transBox.style.display  = "block";
                    this.dom.stationText.innerHTML   = "起点";
                    this._pointType = "endPoint";
                    break;
                case BMAPLIB_TAB_FROM_HERE:
                    this.dom.fromhereTab.className   = "BMapLib_current";
                    this.dom.searchBox.style.display = "none";
                    this.dom.transBox.style.display  = "block";
                    this.dom.stationText.innerHTML   = "终点";
                    this._pointType = "startPoint";
                    break;
            }

            this._firstTab.className += " BMapLib_first";
        },

        /**
         * 绑定自动完成事件
         */
        _autoCompleteIni: function () {
            this.searchAC= new BMap.Autocomplete({
                "input"      : this.dom.searchText
                , "location" : this._map
            });
            this.transAC = new BMap.Autocomplete({
                "input"      : this.dom.transText
                , "location" : this._map
            });
        },

        /**
         * 关闭autocomplete
         */
        _hideAutoComplete: function () {
            this.searchAC.hide();
            this.transAC.hide();
        },

        /**
         * 销毁autoComplete对象
         */
        _disposeAutoComplete: function() {
            this.searchAC.dispose();
            this.transAC.dispose();
        },

        /**
         * 触发localsearch事件
         */
        _localSearchAction: function() {
            var kw = this._kw = this.dom.searchText.value;
            if (kw == "") {
                //检测是否为空
                this.dom.searchText.focus();
            } else{
                this._reset();
                this.close();
                var radius  = this._radius = 1000;
                this.localSearch.searchNearby(kw, this._point, radius);
            }
        },

        /**
         * 画周边检索的圆形圈
         */
        _drawCircleBound: function() {
            this._closeCircleBound();
            var circle = this._searchCircle = new BMap.Circle(this._point, this._radius, {
                strokeWeight: 3,
                strokeOpacity: 0.4,
                strokeColor: "#e00",
                filColor: "#00e",
                fillOpacity:0.4
            });

            var label = this._searchLabel = new RadiusToolBar(this._point, this.guid);

            this._map.addOverlay(circle);
            this._map.addOverlay(label);
            this._hasCircle = true;
        },

        /**
         * 修改周边检索的半径
         */
        _changeSearchRadius: function() {
            var radius = parseInt(baidu.g("BMapLib_search_radius" + this.guid).value, 10);
            if (radius > 0 && radius != this._radius) {
                this._radius = radius;
                this.localSearch.searchNearby(this._kw, this._point, radius);
                this._closeCircleBound();
            }
        },

        /**
         * 关闭周边检索的圆形圈
         */
        _closeCircleBound: function(radius) {
            if (this._searchCircle) {
                this._map.removeOverlay(this._searchCircle);
            }
            if (this._searchLabel) {
                this._map.removeOverlay(this._searchLabel);
            }
            this._hasCircle = false;
        },

        /**
         * 公交驾车检索查询
         */
        _transitRouteAction: function (transitDrive) {
            var kw = this.dom.transText.value;
            if (kw == "") {
                //检测是否为空
                this.dom.transText.focus();
            } else {
                this._reset();
                this.close();
                var me = this;
                var geocoder = this._geocoder || (this._geocoder = new BMap.Geocoder());
                geocoder.getPoint(kw, function (kwPoint) {
                    if (!kwPoint) {
                        return;
                    }
                    var start, end;
                    if (me._pointType == "startPoint") {
                        start = me._point;
                        end   = kwPoint;
                    } else {
                        start = kwPoint;
                        end   = me._point;
                    }
                    transitDrive.search(start, end);
                }, "");
            }
        },

        /**
         * 公交驾车查询结束操作
         */
        _transitRouteComplete: function(transitDrive, results) {
            this._clearAddress();
            var status = transitDrive.getStatus();
            //导航结果未知的情况
            if (status == BMAP_STATUS_UNKNOWN_ROUTE) {
                var startStatus = results.getStartStatus(),
                    endStatus   = results.getEndStatus(),
                    tip         = "";
                tip = "找不到相关的线路";
                if (startStatus == BMAP_ROUTE_STATUS_EMPTY && endStatus == BMAP_ROUTE_STATUS_EMPTY) {
                    tip = "找不到相关的起点和终点";
                } else {
                    if (startStatus == BMAP_ROUTE_STATUS_EMPTY) {
                        tip = "找不到相关的起点";
                    }
                    if (endStatus == BMAP_ROUTE_STATUS_EMPTY) {
                        tip = "找不到相关的终点";
                    }
                }
                //当前搜索的点找不到明确的路线，但是可以检索到poi点
                if (this._pointType == "startPoint" && endStatus == BMAP_ROUTE_STATUS_ADDRESS || this._pointType == "endPoint" && startStatus == BMAP_ROUTE_STATUS_ADDRESS) {
                    this._searchAddress(transitDrive);
                } else {
                    this.dom.panel.address.style.display = "block";
                    this.dom.panel.address.innerHTML = tip;
                }
            }

        },

        /**
         * 检索起点或终点的可选地址
         */
        _searchAddress: function(transitDrive) {
            var me = this;
            var panel = this.dom.panel;
            if (!this.lsAddress) {
                var renderOptions = {map: this._map};
                if (panel) {
                    renderOptions.panel = this.dom.panel.localSearch;
                }
                this.lsAddress = new BMap.LocalSearch(this._map, {renderOptions: renderOptions});
            }
            var station = me._pointType == "startPoint" ? "终点" : "起点";
            if (panel) {
                this.dom.panel.address.style.display = "block";
                this.dom.panel.address.innerHTML = "请选择准确的" + station;
            }
            this.lsAddress.setInfoHtmlSetCallback(function(poi,html){
                var button = document.createElement('div'); 
                button.style.cssText="position:relative;left:50%;margin:5px 0 0 -30px;width:60px;height:27px;line-height:27px;border:1px solid #E0C3A6;text-align:center;color:#B35900;cursor:pointer;background-color:#FFEECC;border-radius:2px; background-image: -webkit-gradient(linear, left top, left bottom, from(#FFFDF8), to(#FFEECC))";
                button.innerHTML = '设为' + station;
                html.appendChild(button);
                baidu.on(button, "click", function(){
                    me._clearAddress();
                    var nowPoint = poi.marker.getPosition();
                    if (station  == "起点") {
                        transitDrive.search(nowPoint, me._point);
                    } else {
                        transitDrive.search(me._point, nowPoint);
                    }
                });
            });
            this._reset();
            this.lsAddress.search(this.dom.transText.value);
        },

        /**
         * 获取公交驾车的起终点
         */
        _getTransPoi: function(kw) {
            var start, end;

            if (this._pointType == "startPoint") {
                start = this._point;
                end   = kw;
            } else {
                start = kw;
                end   = this._point;
            }

            return {
                "start" : start,
                "end"   : end
            }
        },

        /**
         * 设置当前可提供的检索类型
         */
        _setSearchTypes: function () {
            var searchTypes = this._unique(this._opts._searchTypes),
                navTab      = this.dom.navTab,
                tabs        = [this.dom.seartTab, this.dom.tohereTab, this.dom.fromhereTab],
                i           = 0,
                len         = 0,
                curIndex    = 0,
                tab;

            this.tabLength = searchTypes.length;
            tabWidth = Math.floor((this._width - this.tabLength + 1) / this.tabLength);
            if (searchTypes.length == 0) {
                //若为空则不显示检索面板
                this.dom.navBox.style.display = "none";
            } else {
                for (i = 0, len = tabs.length; i < len; i++) {
                    tabs[i].className = "";
                    tabs[i].style.display = "none";
                }

                for (i = 0; i < this.tabLength; i++) {
                    tab = tabs[searchTypes[i]];
                    if (i == 0) {
                        tab.className = "BMapLib_first BMapLib_current";
                        this._firstTab = tab;
                        curIndex = searchTypes[i];
                    } 
                    if (i == this.tabLength - 1) {
                        //最后一个tab的宽度
                        var lastWidth  = this._width - (this.tabLength - 1) * (tabWidth + 1);
                        if (baidu.browser.ie == 6) {
                            tab.style.width = lastWidth - 3 + "px";
                        } else {
                            tab.style.width = lastWidth + "px";
                        }
                    } else {
                        tab.style.width = tabWidth + "px";
                    }
                    tab.style.display = "block";
                }

                //按照数组顺序排序tab
                if (searchTypes[1] != undefined) {
                    navTab.appendChild(tabs[searchTypes[1]])
                }
                if (searchTypes[2] != undefined) {
                    navTab.appendChild(tabs[searchTypes[2]])
                }
                this._showTabContent(curIndex);
            }
            this._adjustTransPosition();
        },

        /**
         * 对用户提供的检索类型去重，并剔除无效的结果
         */
        _unique : function (arr) {
            var len = arr.length, 
                result = arr.slice(0), 
                i, 
                datum;
            // 从后往前双重循环比较
            // 如果两个元素相同，删除后一个
            while (--len >= 0) { 
                datum = result[len]; 
                if (datum < 0 || datum > 2) {
                    result.splice(len, 1); 
                    continue;
                }
                i = len;
                while (i--) {
                    if (datum == result[i]) { 
                        result.splice(len, 1); 
                        break; 
                    } 
                } 
            }
            return result;
        },

        /**
         * 清除最近的结果
         */
        _reset : function () {
            this.localSearch.clearResults();
            this.transitRoute.clearResults();
            this.drivingRoute.clearResults();
            this._closeCircleBound();
            this._hideAutoComplete();
        },

        /**
         * 清除地址选择页结果
         */
        _clearAddress: function() {
            if (this.lsAddress) {
                this.lsAddress.clearResults();
            }
            if (this.dom.panel) {
                this.dom.panel.address.style.display = "none";
            }
        },

        /**
          * IE6下处理PNG半透明
          * @param {Object} infoWin
          */
        _mendIE6 : function(infoWin){
            if(!baidu.browser.ie || baidu.browser.ie > 6){
                return;
            }
            var popImg = this.container.getElementsByTagName("IMG");
            for(var i = 0; i < popImg.length; i++) {
                if (popImg[i].src.indexOf('.png') < 0) {
                    continue;
                }
                popImg[i].style.cssText += ';FILTER: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+ popImg[i].src +',sizingMethod=crop)'
                popImg[i].src = "http://api.map.baidu.com/images/blank.gif";
            }
        },

        /**
          * 发送到手机
          */
        _sendToPhone : function(){
            this.showPopup();
        },
        
        /**
         * 弹出信息框
         */
        showPopup: function() {
            if (!this.pop) {
                this.pop = new Popup(this);
            }
            this._map.addOverlay(this.pop);
        }
    });

    // 显示半径的自定义label
    function RadiusToolBar(point, guid){
        this._point = point;
        this.guid = guid;
    }
    RadiusToolBar.prototype = new BMap.Overlay();
    RadiusToolBar.prototype.initialize = function(map){
        this._map = map;
        var div = this._div = document.createElement("div");

        function stopBubble(e){
            if(e && e.stopPropagation){
                e.stopPropagation();
            }else{
                window.event.cancelBubble = true;
            }
        }
        baidu.on(div, 'mousedown', stopBubble);
        baidu.on(div, 'touchstart', stopBubble);
        baidu.on(div, 'click', stopBubble);
        baidu.on(div, 'dblclick', stopBubble);
        var searchInfoWindow = BMapLib.SearchInfoWindow.instance[this.guid];
        div.style.cssText = 'position:absolute;white-space:nowrap;background:#fff;padding:1px;border:1px solid red;z-index:99;';
        div.innerHTML = '<input type="text" value="' + searchInfoWindow._radius + '" style="width:30px;" id="BMapLib_search_radius' + this.guid + '"/>m <a href="javascript:void(0)" title="修改" onclick="BMapLib.SearchInfoWindow.instance[' + this.guid + ']._changeSearchRadius()" style="font-size:12px;text-decoration:none;color:blue;">修改</a><img src="http://api.map.baidu.com/images/iw_close1d3.gif" alt="关闭" title="关闭" style="cursor:pointer;padding:0 5px;" onclick="BMapLib.SearchInfoWindow.instance[' + this.guid + ']._closeCircleBound()"/>';
        map.getPanes().labelPane.appendChild(div);
        return div;
    }
    RadiusToolBar.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x + 10 + "px";
        this._div.style.top  = pixel.y - 25 + "px";
    }
    

    //后端服务地址
    var serviceHost = "http://api.map.baidu.com";

    /**
     * 创建弹层对象
     */
    function Popup(iw){
        this.iw = iw;
    }

    Popup.prototype = new BMap.Overlay();

    baidu.extend(Popup.prototype, {
        initialize : function(map){
            var me = this;
            this._map = map;
            this.container = this.generalDom();
            this._map.getContainer().appendChild(this.container);
            this.initDom();
            this.bind();
            this.getAddressByPoint();
            this.getRememberPhone();
            this.addPhoneNum = 0;
            return this.container; 
        },
        draw : function() {
        },
        generalDom: function() {
            var dom  = document.createElement('div'),
                size = this._map.getSize(),
                top  = 0,
                left = 0;
            if (size.width > 450) {
                left = (size.width - 450) / 2;
            }
            if (size.height > 260) {
                top = (size.height - 260) / 2;
            }
            dom.style.cssText = "position:absolute;background:#fff;width:480px;height:260px;top:" + top + "px;left:" + left + "px;ovflow:hidden;";
            var html = [
                '<div class="BMapLib_sms_tab_container">',
                    '<span>发送到手机</span>',
                    '<span id="BMapLib_sms_tip" style="display:none;">',
                    '</span>',
                '</div>',
                '<div id="BMapLib_sms_pnl_phone" class="BMapLib_sms_pnl_phone" style="display: block;">',
                    '<div class="BMapLib_ap" id="pnl_phone_left" style="display: block;">',
                        '<table>',
                          '<tr>',
                            '<th>发送方手机号</th>',
                            '<td><input type="text" bid="" id="BMapLib_phone_0" maxlength="11" class="BMapLib_sms_input BMapLib_sms_input_l" /><span id="BMapLib_activateTip"></span></td>',
                          '</tr>',
                          '<tr id="BMapLib_activateBox" style="display:none;">',
                            '<th>激活码</th>',
                            '<td><input type="text" id="BMapLib_activate" class="BMapLib_sms_input BMapLib_sms_input_s" maxlength="4"/><input type="button" value="获取" id="BMapLib_activate_btn" bid="activate" />',
                          '</tr>',
                            '<tr>',
                                '<th></th>',
                                '<td>',
                                '</td>',
                            '</tr>',
                          '<tr>',
                            '<th style="vertical-align:top;padding-top:7px;">接收方手机号</th>',
                            '<td><div><input type="text" id="BMapLib_phone_1" class="BMapLib_sms_input BMapLib_sms_input_l" maxlength="11"/><input type="checkbox" id="BMapLib_is_remember_phone"/>记住此号</div>',
                                    '<div id="BMapLib_add_phone_con"></div>',
                                    '<div><a href="javascript:void(0)" id="BMapLib_add_phone_btn" bid="addPhone">新增</a></div>',
                                '</td>',
                          '</tr>',
                            '<tr>',
                            '<th></th>',
                            '<td ><input type="text" id="BMapLib_ver_input"  maxlength="4" style="width:67px;border: 1px solid #a5acb2;vertical-align: middle;height:18px;" tabindex="5" placeholder="验证码"><img width="69" height="20" id="BMapLib_ver_image" bid="BMapLib_ver_image" style="border: 1px solid #d5d5d5;vertical-align:middle;margin-left: 5px;" alt="点击更换数字" title="点击更换数字"></td>',
                            '</tr>',
                          '<tr>',
                            '<th></th>',
                            '<td><input type="button" value="免费发送到手机" bid="sendToPhoneBtn"/></td>',
                          '</tr>',
                        '</table>',
                    '</div>',
                  '<div class="BMapLib_mp" id="pnl_phone_right" style="display: block;">',
                          '<div class="BMapLib_mp_title">短信内容：</div>',
                          '<div id="BMapLib_msgContent" class="BMapLib_msgContent"></div>',
                  '</div>',
                  '<div style="clear:both;"></div>',
                  '<p id="BMapLib_sms_declare_phone" class="BMapLib_sms_declare_phone">百度保证不向任何第三方提供输入的手机号码</p>',
                  '<div id="tipError" class="tip fail" style="display:none;">',
                    '<span id="tipText"></span>',
                    '<a href="javascript:void(0)" id="tipClose" class="cut"></a>',
                  '</div>',
                  '<div id="sms_lack_tip" style="display:none;">已达每日5次短信上限</div>',
                  '<div id="sms_unlogin_tip" style="display:none;">',
                        '<div style="padding-left:40px;">',
                            '<ul class="login_ul"><li id="normal_login-2" class="login_hover"><a href="javascript:void(0)">手机登录</a></li></ul>',
                            '<div id="loginBox_02" class="loginBox">',
                                '<div id="pass_error_info-2" class="pass_error_style"></div>',
                                '<div id="passports-2"></div>',
                                '<div id="loginIframe_iph-2" style="display:none"></div>',
                            '</div>',
                        '</div>',
                      '<div class="nopass" style="padding-left:128px;">没有百度帐号？<a href="https://passport.baidu.com/v2/?reg&amp;regType=1&amp;tpl=ma" target="_blank">立即注册</a></div>',
                  '</div>',
                '</div>',
                '<button class="BMapLib_popup_close" bid="close"></button>',
                '<div id="BMapLib_success_tip" style="display:none;">您的短信已经发送到您的手机，请注意查收!</div>',

            ].join('');
            dom.innerHTML = html;
            return dom;
        },
        initDom: function() {
            this.dom = {
                sms_tip         : baidu.g('BMapLib_sms_tip'),  //提示框
                activate_btn    : baidu.g('BMapLib_activate_btn'), //获取激活码按钮
                fromphone       : baidu.g("BMapLib_phone_0"),  
                tophone         : baidu.g("BMapLib_phone_1"),
                isRememberPhone : baidu.g("BMapLib_is_remember_phone"),
                sms_container   : baidu.g('BMapLib_sms_pnl_phone'),
                success_tip     : baidu.g('BMapLib_success_tip'), // 发送成功提示框
                add_phone_con   : baidu.g('BMapLib_add_phone_con'),
                add_phone_btn   : baidu.g('BMapLib_add_phone_btn'),
                activateBox     : baidu.g('BMapLib_activateBox'),
                activateTip     : baidu.g('BMapLib_activateTip'),
                activate_input  : baidu.g("BMapLib_activate"),
                ver_image       : baidu.g("BMapLib_ver_image"),
                ver_input       : baidu.g("BMapLib_ver_input")

            }
        },
        showTip: function(result) {
            var error = result.error;
            var tipObj = {
                'PHONE_NUM_INVALID'      : '手机号码无效',
                'SMS_SEND_SUCCESS'       : '发送到手机成功',
                'AK_INVALID'             : '你所使用的key无效',
                'INTERNAL_ERROR'         : '服务器错误',
                'OVER_MAX_ACTIVATE_TIME' : '今天已超过发送激活码最大次数',
                'SMS_ACTIVATE_SUCCESS'   : '激活码已发送到您的手机，请注意查收！',
                'ACTIVATE_FAIL'          : '手机激活码无效',
                'SMS_LACK'               : '今天您还能往5个手机发送短信',
                'PARAM_INVALID'          : '请填完所有选项',
                'SEND_ACTIVATE_FAIL'     : '激活码发送失败',
                'VCODE_VERITY_FAIL'      :  '验证码校验失败'
            }
            var tip = tipObj[error];
            if (error == 'SMS_LACK') {
                var res_sms = result.res_sms;
                tip = "今天您还能往" + res_sms + "个手机发送短信";
                this.addPhoneNum = res_sms - 1;
            }
            this.renderImageVer();
            if (tip) {
                this.dom.sms_tip.innerHTML = tip;
                this.dom.sms_tip.style.display = "inline";
            }
            if (error == 'SMS_SEND_SUCCESS') {
                this.rememberPhone();
                this.sendSuccess();
            }
        },
        //绑定事件
        bind: function() {
            var me = this;
            me.renderImageVer();
            baidu.on(this.container, 'click', function(e) {
                var target = e.target || e.srcElement,
                    bid = target.getAttribute('bid');
                switch (bid) {
                    case 'close':
                        me.closeActon();
                        break;
                    case 'sendToPhoneBtn':
                        me.sendAction();
                        break;
                    case 'activate':
                        me.activateAction();
                        break;
                    case 'addPhone':
                        me.addPhoneAction();
                        break;
                    case 'deletePhone':
                        me.deletePhoneAction(target);
                        break;
                    case 'BMapLib_ver_image':
                        me.renderImageVer();
                }
            });

            var phone0 = baidu.g('BMapLib_phone_0');
            var phone1 = baidu.g('BMapLib_phone_1');
            //限制输入的字符，只能输数字和逗号
            this.container.onkeypress = function (e) {

                var event = e || window.e,
                    keyCode = event.which || event.keyCode,
                    result = false;
                if (keyCode >= 48 && keyCode <= 57 || keyCode == 44 || keyCode == 8) {
                    result = true;
                }
                return result;
            };
            this.dom.ver_input.onkeypress = function(e){
                me._stopBubble(e);
                var event = e || window.e,
                    keyCode = event.which || event.keyCode,
                    result = false;
                if (keyCode >= 48 && keyCode <= 57 ||keyCode >= 65 && keyCode <= 90||keyCode >= 97 && keyCode <= 122) {
                    result = true;
                }
                return result;

            };

            baidu.on(this.dom.fromphone, 'blur', function(){
                if (baidu.isPhone(this.value)) {
                    me.checkActivateAction();
                } else {
                    me.dom.activateTip.innerHTML = "";
                    me.dom.activateBox.style.display = "none";
                }
            });

            baidu.on(this.dom.activate_input, 'blur', function(){
                if (baidu.isActivateCode(this.value)) {
                    me.checkActivateAction();
                } 
            });
        },
        /**
         * 阻止事件冒泡
         * @return none
         */
        _stopBubble: function(e){
            if(e && e.stopPropagation){
                e.stopPropagation();
            }else{
                window.event.cancelBubble = true;
            }
        },
        //请求验证码.
        renderImageVer:function(){
            var me = this;
            //验证码想着绑定
            this.request("http://map.baidu.com/maps/services/captcha?",{"cbName":"cb"},function(data){
                me.vcode = data['content']['vcode'];
                me.dom.ver_image.src = 'http://map.baidu.com/maps/services/captcha/image?vcode=' + me.vcode;
            });
        },
        //验证手机号是否已经激活
        checkActivateAction: function() {
            var param = {
                phone    : this.dom.fromphone.value,
                activate : this.dom.activate_input.value,
                cbName   : 'callback'
            }
            var me = this;
            this.request(this.config.ckActivateURL, param, function(res){
                if (!res || res.isactivate == false) {
                    //未激活
                    me.dom.activateBox.style.display = "table-row";
                    me.dom.activateTip.style.color = "red";
                    me.dom.activateTip.innerHTML = "未激活";
                } else {
                    //已激活
                    me.dom.activateBox.style.display = "none";
                    me.dom.activateTip.style.color = "green";
                    me.dom.activateTip.innerHTML = "已激活";
                }
            });
        },
        //点击激活按钮事件
        activateAction: function() {
            var me = this;
            var ak = this._map.getKey();
            var params = {
                phone: this.dom.fromphone.value,
                ak  : ak,
                cbName: "callback"
            }
            if (baidu.isPhone(params.phone)) {
                this.request(this.config.activateURL, params, function(result){
                    if (result) {
                        me.showTip(result);
                    }
                });
            } else {
                this.showTip({
                    error: 'PHONE_NUM_INVALID'
                });
            }
        },
        //点击关闭按钮事件
        closeActon: function() {
            this._map.removeOverlay(this);
        },
        // 获取短信的内容
        getMessage: function() {
        },
        // 免费发送到手机点击事件
        sendAction: function() {
            var me = this;
            if (this.validate()) {
                tophoneStr = baidu.g("BMapLib_phone_1").value;
                var addPhones = this.dom.add_phone_con.getElementsByTagName('input');
                for (var i = 0, len = addPhones.length; i < len; i++) {
                    if (baidu.isPhone(addPhones[i].value)) {
                        tophoneStr += ',' + addPhones[i].value;
                    } else {
                        this.showTip({
                            error: 'PHONE_NUM_INVALID'
                        });
                        return;
                    }
                }
                var ak = this._map.getKey();
                var params = {
                    fromphone   : baidu.g("BMapLib_phone_0").value,  //发送方手机
                    tophone     : tophoneStr,                        //发送到手机
                    ak          : ak,                               //用户ak
                    activate    : this.dom.activate_input.value,     //激活码
                    code_input  : this.dom.ver_input.value,  
                    vcode       : this.vcode,  
                    content     : baidu.g("BMapLib_phone_0").value + "分享一个位置给您，" + this.messageContent,
                    cbName      : 'callback'
                };
                this.request(this.config.sendURL, params, function(result){
                    if (result) {
                        me.showTip(result);
                    }
                });
            }
        },
        //检验数据格式是否正确
        validate: function() {
            var flag = true;
            if (!(baidu.isPhone(this.dom.fromphone.value) && baidu.isPhone(this.dom.tophone.value))) {
                flag = false;
                this.showTip({
                    error: 'PHONE_NUM_INVALID'
                });
            };
            return flag;
        },
        getAddressByPoint: function() {
            var pt = this.iw._point,
                me = this,
                gc = new BMap.Geocoder();
            gc.getLocation(pt, function(rs){
                if (rs && rs.addressComponents) {
                    var addComp = rs.addressComponents;
                    me.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                    me.generalMessage();
                }
            });   
        },
        generalMessage: function() {
            var msgContent = baidu.g('BMapLib_msgContent');
            var msg = "";
            var iw = this.iw;
            var point = iw.getPosition();
            if (this.userPhone) {
                msg += this.userPhone + "分享一个位置给您，";
            }
            if (iw.getTitle) {
                msg += "名称为：" + iw.getTitle() + "，";
            }
            if (this.address) {
                msg += "大致位置在" + this.address + "，";
            }
            var uri = "http://api.map.baidu.com/marker?location=" + point.lat + "," + point.lng + "&title=" + encodeURIComponent(iw.getTitle()) + "&content=" + encodeURIComponent(iw.getContent()) + "&output=html";
            var params = {
                url : encodeURIComponent(uri),
                t   : new Date().getTime(),
                cbName : 'callback'
            };
            var me = this;
            this.request(this.config.shortURL, params, function(result){
                msg += "查看地图：" + result.url ? result.url : uri;
                me.messageContent = msg;
                msgContent.innerHTML = msg;
            });
        },
        //记住手机号码
        rememberPhone: function() {
            if (this.dom.isRememberPhone.checked) {
                var phone = this.dom.tophone.value;
                baidu.cookie.set('BMapLib_phone', phone, {
                    path: '/',
                    expires: 30 * 24 * 60 * 60 * 1000
                });
            }
        },
        //获取记住的手机号码
        getRememberPhone: function() {
            var phone = baidu.cookie.get('BMapLib_phone');
            if (phone) {
                this.dom.tophone.value = phone;
                this.dom.isRememberPhone.checked = true;
            }
        },
        //发送成功后执行
        sendSuccess: function() {
            this.dom.sms_container.style.display = "none";
            this.dom.success_tip.style.display = "block";
            var me = this;
            setTimeout(function(){
                me._map.removeOverlay(me);
            }, 1500);
        },
        //新增手机号事件
        addPhoneAction: function() {
            if (this.addPhoneNum >= 4) {
            } else {
                var div = document.createElement('div');
                div.innerHTML = '<input type="text" class="BMapLib_sms_input BMapLib_sms_input_l" maxlength="11"/><a href="javascript:void(0);" style="margin-left:5px;" bid="deletePhone">删除</a>';
                this.dom.add_phone_con.appendChild(div);
                this.addPhoneNum++;
            }
        },
        //删除一个手机号事件
        deletePhoneAction: function(target){
            target.parentNode.parentNode.removeChild(target.parentNode);
            this.addPhoneNum--;
        },
        //jsonp 请求
        request: function(url, params, cbk) {
            // 生成随机数
            var timeStamp = (Math.random() * 100000).toFixed(0);
            // 全局回调函数
            BMapLib["BMapLib_cbk" + timeStamp] = function(json){
                cbk && cbk(json);
                delete BMapLib["BMapLib_cbk" + timeStamp];
            };

            for (var item in params) {
                if (item != "cbName") {
                    url += '&' + item + "=" + params[item];
                }
            }

            var me = this;
            url += "&" + params.cbName + "=BMapLib.BMapLib_cbk" + timeStamp;
        
            scriptRequest(url);
        },
        config: {
            sendURL       : serviceHost + "/ws/message?method=send",
            activateURL   : serviceHost + "/ws/message?method=activate",
            ckActivateURL : serviceHost + "/ws/message?method=ckActivate",
            shortURL      : "http://j.map.baidu.com/?"
        }
        
    });

    /**
     * script标签请求
     * @param {String} url      请求脚本url 
     */
    function scriptRequest(url){    
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        // 脚本加载完成后进行移除
        if (script.addEventListener) {
          script.addEventListener('load', function(e) {
            var t = e.target || e.srcElement;
            t.parentNode.removeChild(t);
          }, false);
        }
        else if (script.attachEvent) {
          script.attachEvent('onreadystatechange', function(e) {
            var t = window.event.srcElement;
            if (t && (t.readyState == 'loaded' || t.readyState == 'complete')) {
              t.parentNode.removeChild(t);
            }
          });
        }
        // 使用setTimeout解决ie6无法发送问题
        setTimeout(function() {
          document.getElementsByTagName('head')[0].appendChild(script);
          script = null;
        }, 1);
    }



    //用来存储创建出来的实例
    var guid = 0;
    BMapLib.SearchInfoWindow.instance = [];
})();
