/**
 * @fileoverview 百度地图的画弧线类，对外开放。
 * 允许用户在地图上完成画弧线的功能。
 * 使用者可以自定义弧线的相关样式，例如线宽、颜色等等。
 * 主入口类是<a href="symbols/BMapLib.CurveLine.html">CurveLine</a>，
 * 具体类参考同：<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB/Polyline" target="_blank">Polyline</a>
 * 基于Baidu Map API 1.5。
 *
 * @author Baidu Map Api Group 
 * @version 1.5
 */

/** 
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

(function() {
  /**
   * CurveLine类的构造函数
   * @class 弧线类，实现效果的<b>入口</b>。
   * 实例化该类后，即可返回一个弧线的Polyline对象，使用方法同<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB/Polyline" target="_blank">Polyline</a>
   * 即可调用map.addOverlay方法添加到地图当中
   * 
   * @constructor
   * @param {Array<Point>} Array<Point> Point数组对象
   * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项参考<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB/PolylineOptions" target="_blank">PolylineOptions</a><br />
   *
   * @example <b>参考示例：</b><br />
   * var map = new BMap.Map("container");<br />map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);<br/>var points = [new BMap.Point(116.432045,39.910683), new BMap.Point(116.388522,39.985964), <br/>new BMap.Point(117.218862,39.141468), new BMap.Point(121.485947,31.510083)];
   * <br />var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //新建弧线覆盖物对象
   * <br />map.addOverlay(curve); //添加到地图
   * <br/>curve.enableEditing(); //开启编辑功能
   */
  BMapLib.CurveLine = CurveLine;

  function CurveLine(points, opts) {
    var self = this;
    var curvePoints = getCurvePoints(points);
    var polyline = new BMap.Polyline(curvePoints, opts);

    polyline.addEventListener('lineupdate', function(){
      if (this.isEditing) {
        this.enableEditing();
      }
    });

    polyline.cornerPoints = points;
    polyline.editMarkers = []; //编辑功能的顶点

    /**
     * 重写弧线的编辑功能
     */
    polyline.enableEditing = function () {
      var self = this;

      if (self.map) {
        self.disableEditing();
        for (var i = 0; i < self.cornerPoints.length; i++) {
          var marker = new BMap.Marker(self.cornerPoints[i], {
            icon: new BMap.Icon('http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png', new BMap.Size(16,16)),
            enableDragging: true,
            raiseOnDrag: true
          });
          marker.addEventListener('dragend', function(){
            self.cornerPoints.length = 0;
            for (var i = 0; i < self.editMarkers.length; i++) {
              self.cornerPoints.push(self.editMarkers[i].getPosition());
            }
            var curvePoints = getCurvePoints(self.cornerPoints)
            self.setPath(curvePoints);
          });
          marker.index = i;
          self.editMarkers.push(marker);
          self.map.addOverlay(marker);
        }
      }
      self.isEditing = true;
    }

    /**
     * 重写弧线的编辑功能
     */
    polyline.disableEditing = function() {
      this.isEditing = false;
      //清空之前的编辑点
      for (var i = 0; i < this.editMarkers.length; i++) {
        this.map.removeOverlay(this.editMarkers[i]);
        this.editMarkers[i] = null;
      }
      this.editMarkers.length = 0;
    }

    /**
     * 获取弧线的坐标点
     */
    polyline.getPath = function() {
      return curvePoints;
    }

    // polyline.points = points; //弧线的坐标顶点
    // polyline.enableEditing = enableEditing;
    // polyline.disableEditing = disableEditing;
    // polyline.getPath = getPath;
    return polyline;
  }

  function extend(child, parent) {
    for (var p in parent) {
      if (parent.hasOwnProperty(p)) {
        child[p] = parent[p];
      }
    }
    
    return child;
  };


  /**
   * 根据弧线的坐标节点数组
   */
  function getCurvePoints(points) {
    var curvePoints = [];
    for (var i = 0; i < points.length - 1; i++) {
      var p = getCurveByTwoPoints(points[i], points[i + 1]);
      if (p && p.length > 0) {
        curvePoints = curvePoints.concat(p);
      }
    }
    return curvePoints;
  }

  /**
   * 根据两点获取曲线坐标点数组
   * @param Point 起点
   * @param Point 终点
   */
  function getCurveByTwoPoints(obj1, obj2) {
    if (!obj1 || !obj2 || !(obj1 instanceof BMap.Point) || !(obj2 instanceof BMap.Point)) {
      return null;
    }

    var B1 = function(x) {
      return 1 - 2 * x + x * x;
    };
    var B2 = function(x) {
      return 2 * x - 2 * x * x;
    };
    var B3 = function(x) {
      return x * x;
    };

    curveCoordinates = [];

    var count=30; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
    var isFuture=false;
    var t, h, h2, lat3, lng3, j, t2;
    var LnArray = [];
    var i = 0;
    var inc = 0;

    if (typeof(obj2) == "undefined") {
      if (typeof(curveCoordinates) != "undefined") {
        curveCoordinates = [];
      }
      return;
    }

    var lat1 = parseFloat(obj1.lat);
    var lat2 = parseFloat(obj2.lat);
    var lng1 = parseFloat(obj1.lng);
    var lng2 = parseFloat(obj2.lng);
      
    // 计算曲线角度的方法
    if (lng2 > lng1) {
      if (parseFloat(lng2-lng1) > 180) {
        if (lng1 < 0) {
          lng1 = parseFloat(180 + 180 + lng1);
        }
      }
    }
    
    if (lng1 > lng2) {
      if (parseFloat(lng1-lng2) > 180) {
        if (lng2 < 0) {
          lng2 = parseFloat(180 + 180 + lng2);
        }
      }
    }
    j = 0;
    t2 = 0;
    if (lat2 == lat1) {
      t = 0;
      h = lng1 - lng2;
    } else if (lng2 == lng1) {
      t = Math.PI / 2;
      h = lat1 - lat2;
    } else {
      t = Math.atan((lat2 - lat1) / (lng2 - lng1));
      h = (lat2 - lat1) / Math.sin(t);
    }
    if (t2 == 0) {
      t2 = (t + (Math.PI / 5));
    }
    h2 = h / 2;
    lng3 = h2 * Math.cos(t2) + lng1;
    lat3 = h2 * Math.sin(t2) + lat1;

    for (i = 0; i < count + 1; i++) {
      curveCoordinates.push(new BMap.Point(
        (lng1 * B1(inc) + lng3 * B2(inc)) + lng2 * B3(inc),
        (lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc))
      ));
      inc = inc + (1 / count);
    }
    return curveCoordinates;
  }

})();
