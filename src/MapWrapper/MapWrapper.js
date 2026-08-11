/**
 * @fileoverview MapWrapper类提供了将Google或GPS坐标形式的Marker添加到地图上的功能。
 * 用户可以直接通过该类提供的addOverlay方法,添加Google或GPS坐标形式的Marker到地图上,
 * 不再需要先将Google或GPS坐标转化为百度坐标，然后再添加的操作。
 * 主入口类是<a href="symbols/BMapLib.MapWrapper.html">MapWrapper</a>，
 * 基于Baidu Map API 1.2。
 *
 * @author Baidu Map Api Group 
 * @version 1.2
 */

/** 
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

(function() { 

    /**
     * GPS坐标系类型
     */
    BMapLib.COORD_TYPE_GPS  = 0;
    
    /**
     * Google 坐标系类型
     */
    BMapLib.COORD_TYPE_GOOGLE = 2;

    /**
     * Baidu 坐标系类型
     */
    var COORD_TYPE_BAIDU = 4;
    
    /**
     * 每次最大可以转化的坐标点数量
     */
    var CONVERT_NUM_ONCE = 20;
    
    
    /** 
     * @exports MapWrapper as BMapLib.MapWrapper 
     */
    var MapWrapper =    

    /**
     * MapWrapper类的构造函数
     * @class 将Google或GPS坐标形式的Marker添加到地图上,
     * 实例化该类后，即可调用该类提供的addOverlay方法添加GPS或Google坐标形式的Marker。
     * 
     * @constructor
     * @param {Map} map BMap.Map的实例对象
     * @param {Number} coordType 需要转化的坐标类型，如：GPS坐标类型 | Google坐标类型
     *     
     */
    BMapLib.MapWrapper = function(map, coordType){
        this._map = map;
        this._coordType = coordType;

        //临时对象，转化前的mkr都挂载到此对象上，转化完毕后再删除掉
        this._hashObject = {};

        //缓存数组，用来累计每次20个坐标点，然后一同发送请求
        this._arrCache = [];
    }

    /*
     * 计数器，用来唯一标识每个发送的坐标点序列号
     */
    MapWrapper.prototype._uiqueNum = 0;

    /**
     * 是否可以发送请求,用来处理累计发送请求的标识
     */
    MapWrapper.prototype._canSendRequest = true;

    /**
     * 将覆盖物添加到地图上。此函数首先将其他坐标转化为百度坐标，然后再将覆盖物添加到地图上。
     * @param {Overlay} overlay 覆盖物对象，目前只支持Marker类对象 
     * @return 无返回值
     */
    MapWrapper.prototype.addOverlay = function(overlay){
        //目前仅支持Marker类型
        if(!overlay || !(overlay instanceof BMap.Marker)){
            return;
        }

        var data = {
            'overlay'    : overlay,        
            'uiqueNum'   : this._uiqueNum //唯一标识该坐标点
        };
        
        this._arrCache.push(data);
        this._hashObject['guid' + this._uiqueNum] = overlay; //记录在hash对象中，回调后使用

        this._uiqueNum++;
        
        var me = this;    
        if(me._canSendRequest){
            me._canSendRequest = false;

            window.setTimeout(function(){
                me._canSendRequest = true;
                me._delayRequest();            
            }, 50);
        }
    }

    /**
     * 延迟发送请求
     */
    MapWrapper.prototype._delayRequest = function(){
        var arrCache = this._arrCache;
        var group = Math.ceil(arrCache.length / CONVERT_NUM_ONCE); //分组个数            
        
        for(var i = 0; i < group; i++){
            var arrX = [], arrY = [], arrGuid = [];
            
            var minIndex = i * CONVERT_NUM_ONCE;
            var maxIndex = -1;
            if(arrCache.length - (i + 1) * CONVERT_NUM_ONCE > 0){
                maxIndex = (i + 1) * CONVERT_NUM_ONCE;
            } else {
                maxIndex = arrCache.length;
            }
            
            for(var j = minIndex; j < maxIndex; j++){            
                var data = arrCache[j];            
                var x = data.overlay.getPosition().lng;
                var y = data.overlay.getPosition().lat;
                
                arrX.push(x);
                arrY.push(y);            
                arrGuid.push('guid' + data.uiqueNum);
            }

            var strX = arrX.join(",");
            var strY = arrY.join(",");
            
            //坐标点参数
            var jsonParam = {
                x:      strX,
                y:      strY,
                from:   this._coordType,
                to:     COORD_TYPE_BAIDU,
                mode:   1
            };
            
            //用户自定义参数
            var userData = {
                'guids': arrGuid 
            };
            
            var me = this;
            MapWrapper._SearchRequestMgr.request(function(json, userData){
                me._requestCbk(json, userData);
            }, jsonParam, userData);        
        }    

        this._arrCache.length = 0; //将数组归0
    }

    /**
     * 坐标转化后的回调函数
     * @param {Json} json 转化后的json数据
     * @param {Json} userData 请求发送前一些参数，在回调函数中使用
     * 
     */
    MapWrapper.prototype._requestCbk = function(json, userData){
        if(json && json instanceof Array){
            var guids = userData.guids;
            for(var i = 0; i < json.length; i++){
                var item = json[i];
                if(item && item.error == 0){
                    var newX = item.x, newY = item.y;
                    var newPt = new BMap.Point(newX, newY);
                    
                    var guid = guids[i];
                    if(this._hashObject[guid]){
                        var mkr = this._hashObject[guid];
                        mkr.setPosition(newPt);

                        this._map.addOverlay(mkr);

                        delete this._hashObject[guid];
                    }

                }
            }
        }
    }

    /**
     * json对象转化为url字串
     * @param {Json} json 需要转化的json对象
     * @param {Function} encode 编码函数
     */
    MapWrapper._jsonToQuery = function(json, encode){
      var s = [];
      encode = encode || function(v){return v};
      for (var n in json){
        s.push(n + "=" + encode(json[n]));
      }
      return s.join("&");
    }

    /**
     * 请求管理模块 
     */
    MapWrapper._SearchRequestMgr = {
      /**
       * 请求地址
       */
      COORD_CONVERT_URL: "http://api.map.baidu.com/ag/coord/convert",  
      /**
       * 请求函数
       * @param {Function} cbk 回调函数
       * @param {Object} params 附加请求参数, 在回调调用时传递给回调函数
       * @param {Object} userData 用户自定义数据, 在回调调用时传递给回调函数
       * @param {String} path 附加请求路径，可选
       */
      request: function(cbk, params, userData, path){    
        var timeStamp = (Math.random() * 100000).toFixed(0);// 生成随机数
        
        MapWrapper._cbkMount["_cbk" + timeStamp] = function(json){// 全局回调函数
          userData = userData || {};
          cbk && cbk(json, userData);
          delete MapWrapper._cbkMount["_cbk" + timeStamp];
        };

        path = path || "";    
        
        var reqParam = MapWrapper._jsonToQuery(params, encodeURIComponent);    

        var me = this,
            url = me.COORD_CONVERT_URL + path + "?" + reqParam + 
                        "&ie=utf-8&oue=1&res=api&callback=BMapLib.MapWrapper._cbkMount._cbk" + timeStamp;
            
        me.createScript(url);
      },
      /**
       * 动态创建script标签，发送请求
       * @param {String} url script标签对应的url
       */
      createScript: function(url) {    
        var script = document.createElement("script");
        script.src = url;
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'utf-8');

        // 脚本加载完成后进行移除
        if (script.addEventListener) {
          script.addEventListener('load', function(e) {
            var t = e.target;
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
    };

    /*
     * 全局回调函数挂载点
     */
    MapWrapper._cbkMount = {};    

    // 统计方法
    window._BMapLibStatImg = "http://api.map.baidu.com/images/";
    window._addStat = function (code, opts) {
        if (!code) {
            return;
        }
        // 组装参数
        opts = opts || {};
        var extq = '';
        for (var i in opts) {
            extq = extq + '&' + i + '=' + encodeURIComponent(opts[i]);
        }
        // 内部函数定义 - 发送统计请求
        var sendStat = function (q) {
                if (!q) {
                    return;
                }
                _addStat._sending = true;
                setTimeout(function () {
                    _addStat._img.src = window._BMapLibStatImg + 'blank.gif?' + q.src
                }, 50);
            }
            // 内部函数定义 - 发送队列中下一个统计请求
        var reqNext = function () {
                var nq = _addStat._reqQueue.shift();
                if (nq) {
                    sendStat(nq);
                }
            }
        var ts = (Math.random() * 100000000).toFixed(0);
        if (_addStat._sending) {
            // 将本次请求加入队列
            _addStat._reqQueue.push({
                src: 't=' + ts + '&code=' + code + extq
            });
        } else {
            // 直接发送请求
            sendStat({
                src: 't=' + ts + '&code=' + code + extq
            });
        }
        // 绑定事件
        if (!_addStat._binded) {
            _addStat._img.onload = function(){
                _addStat._sending = false;
                reqNext();
            }

            _addStat._img.onerror = function(){
                _addStat._sending = false;
                reqNext();
            }

            _addStat._binded = true;
        }
    };

    // 初始化请求队列
    window._addStat._reqQueue = [];
    window._addStat._img = new Image();

    window._addStat(5015);

})();//闭包结束