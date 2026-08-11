/**
 * @fileoverview 百度地图API事件包装器
 * 此代码可使用closure compiler的advanced模式进行压缩
 * @author Baidu Map Api Group 
 * @version 1.2
 */
/** 
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
window['BMapLib'] = window['BMapLib'] || {};
window['BMapLib']['EventWrapper'] = window['BMapLib']['EventWrapper'] || {};
(function(){
/**
 * 事件封装器的静态类
 * @class EventWrapper
 */
var EventWrapper = window['BMapLib']['EventWrapper'];
/**
 * 添加DOM事件监听函数
 * @param {HTMLElement} DOM元素
 * @param {String} 事件名称
 * @param {Function} 事件处理函数
 * @returns {MapsEventListener} 事件监听对象
 */
EventWrapper['addDomListener'] = function(instance, eventName, handler) {
    if (instance.addEventListener) {
        instance.addEventListener(eventName, handler, false);
    }
    else if (instance.attachEvent) {
        instance.attachEvent('on' + eventName, handler);
    }
    else {
        instance['on' + eventName] = handler;
    }
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.DOM_EVENT);
};
/**
 * 添加DOM事件监听函数，函数仅执行一次
 * @param {HTMLElement} DOM元素
 * @param {String} 事件名称
 * @param {Function} 事件处理函数
 * @returns {MapsEventListener} 事件监听对象
 */
EventWrapper['addDomListenerOnce'] = function(instance, eventName, handler) {
    var eventListener = EventWrapper['addDomListener'](instance, eventName, function(){
        // 移除
        EventWrapper['removeListener'](eventListener);
        return handler.apply(this, arguments);
    });
    return eventListener;
};
/**
 * 添加地图事件监听函数
 * @param {Object} 实例
 * @param {String} 事件名称
 * @param {Function} 事件处理函数
 * @returns {MapsEventListener} 事件监听对象
 */
EventWrapper['addListener'] = function(instance, eventName, handler) {
    instance.addEventListener(eventName, handler);
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.MAP_EVENT);
};
/**
 * 添加地图事件监听函数，函数仅执行一次
 * @param {Object} 需要监听的实例
 * @param {String} 事件名称
 * @param {Function} 事件处理函数
 * @returns {MapsEventListener} 事件监听对象
 */
EventWrapper['addListenerOnce'] = function(instance, eventName, handler){
    var eventListener = EventWrapper['addListener'](instance, eventName, function(){
        // 移除
        EventWrapper['removeListener'](eventListener);
        return handler.apply(this, arguments);
    });
    return eventListener;
};
/**
 * 移除特定实例的所有事件的所有监听函数
 * @param {Object} 需要移除所有事件监听的实例
 * @returns {None}
 */
EventWrapper['clearInstanceListeners'] = function(instance) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        EventWrapper['removeListener'](listeners[i]);
    }
    instance._e_ = {};
};
/**
 * 移除特定实例特定事件的所有监听函数
 * @param {Object} 需要移除特定事件监听的实例
 * @param {String} 需要移除的事件名
 * @returns {None}
 */
EventWrapper['clearListeners'] = function(instance, eventName) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            EventWrapper['removeListener'](listeners[i]);
        }
    }
};
/**
 * 移除特定的事件监听函数
 * @param {MapsEventListener} 需要移除的事件监听对象
 * @returns {None}
 */
EventWrapper['removeListener'] = function(listener) {
    var instance = listener._instance;
    var eventName = listener._eventName;
    var handler = listener._handler;
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._guid == listener._guid) {
            if (listener._eventType == MapsEventListener.DOM_EVENT) {
                // DOM事件
                if (instance.removeEventListener) {
                    instance.removeEventListener(eventName, handler, false);
                }
                else if (instance.detachEvent) {
                    instance.detachEvent('on' + eventName, handler);
                }
                else {
                    instance['on' + eventName] = null;
                }
            }
            else if (listener._eventType == MapsEventListener.MAP_EVENT) {
                // 地图事件
                instance.removeEventListener(eventName, handler);
            }
            delete listeners[i];
        }
    }
};
/**
 * 触发特定事件
 * @param {Object} 触发事件的实例对象
 * @param {String} 触发事件的名称
 * @param {Object} 自定义事件参数，可选
 * @returns {None}
 */
EventWrapper['trigger'] = function(instance, eventName) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            var args = Array.prototype.slice.call(arguments, 2);
            listeners[i]._handler.apply(instance, args);
        }
    }
};

/**
 * 事件监听类
 * @constructor
 * @ignore
 * @private
 * @param {Object} 对象实例
 * @param {string} 事件名称
 * @param {Function} 事件监听函数
 * @param {EventTypes} 事件类型
 */
function MapsEventListener(instance, eventName, handler, eventType){
    this._instance = instance;
    this._eventName = eventName;
    this._handler = handler;
    this._eventType = eventType;
    this._guid = MapsEventListener._guid ++;
    this._instance._e_ = this._instance._e_ || {};
    this._instance._e_[this._guid] = this;
}
MapsEventListener._guid = 1;

MapsEventListener.DOM_EVENT = 1;
MapsEventListener.MAP_EVENT = 2;

})();