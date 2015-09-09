var main = {};
main.menuData = [
{
        className: 'BMapLib.HeatmapOverlay',
        classFunc: true,
        classEvent: false
    },
    {
        className: 'BMapLib.CurveLine',
        classFunc: false,
        classEvent: false
    },
    {
        className: 'BMapLib.DrawingManager',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.InfoBox',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.MarkerManager',
        classFunc: true,
        classEvent: false
    },
    {
        className: 'BMapLib.RichMarker',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.LuShu',
        classFunc: true,
        classEvent: false
    },
    {
        className: 'BMapLib.DistanceTool',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.MarkerClusterer',
        classFunc: true,
        classEvent: false
    },
    {
        className: 'BMapLib.MarkerTool',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.TextIconOverlay',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.RectangleZoom',
        classFunc: true,
        classEvent: true
    },
    {
        className: 'BMapLib.AreaRestriction',
        classFunc: true,
        classEvent: false
    },
    {
        className: 'BMapLib.GeoUtils',
        classFunc: true,
        classEvent: false
    }
];

main.classData = [
    {
        className: 'BMapLib.HeatmapOverlay',
        classDis: '热力图的覆盖物 实例化该类后，使用map.addOverlay即可以添加热力图',
        classCon: 'BMapLib.HeatmapOverlay(opts)',
        classConDis: '热力图的覆盖物',
        functions: [
            {
                funName: 'addDataPoint(lng, lat, count)',
                funBack: '无',
                funDis: '添加热力图的详细坐标点'

            },
            {
                funName: 'setDataSet(data)',
                funBack: '无',
                funDis: '设置热力图展现的详细数据, 实现之后,即可以立刻展现'

            },
            {
                funName: 'setOptions(options)',
                funBack: '无',
                funDis: '设置热力图展现的配置'

            },
            {
                funName: 'toggle()',
                funBack: '无',
                funDis: '更改热力图的展现或者关闭'

            }
        ],
        events: [
        ],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);\n',
            '/* 参数:\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"radius" : {String} 热力图的半径,\n',
            ' *\t"visible" : {Number} 热力图是否显示 \n',
            ' *\t"gradient" : {JSON} 热力图的渐变区间 \n',
            ' *\t"opacity" : {Number} 热力的透明度\n',
            ' * }\n',
            ' * /\n',
            'var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":10, "visible":true, "opacity":70});\n',
            '// data是热力图的详细数据\n',
            'heatmapOverlay.setDataSet(data);\n'
        ],
        funcDet:[
            '/* 添加热力图的详细坐标点\n',
            ' * @param {Number} lng 经度坐标\n',
            ' * @param {Number} lat 纬度坐标\n',
            ' * @param {Number} count 权重\n',
            ' */\n',
            'addDataPoint(lng, lat, count);\n',
            ' \n',
            '/* 设置热力图展现的详细数据, 实现之后,即可以立刻展现\n',
            ' * @param {Json Object} data 经度坐标\n',
            ' * {\n',
            ' *\t"max" : {Number} 权重的最大值, \n',
            ' *\t"data" : {Array} 坐标详细数据,格式如下\n', 
            ' *\t{"lng":116.421969,"lat":39.913527,"count":3}, 其中lng lat分别为经纬度, count权重值\n',
            ' * }\n',
            ' */\n',
            'setDataSet(data);\n',
            ' \n',
            '/* 设置热力图展现的配置\n',
            ' * \n',
            ' * @param {Json Object} options 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"radius" : {String} 热力图的半径, \n',
            ' *\t"visible" : {Number} 热力图是否显示, \n',
            ' *\t"gradient" : {JSON} 热力图的渐变区间, \n',
            ' *\t"opacity" : {Number} 热力的透明度\n',
            ' * }\n',
            ' */\n',
            'setOptions(options);\n',
        ],
        eveDet:[            
        ]
    },
    {
        className: 'BMapLib.CurveLine',
        classDis: '弧线类，实现效果的入口。 实例化该类后，即可返回一个弧线的Polyline对象，使用方法同Polyline 即可调用map.addOverlay方法添加到地图当中 ',
        classCon: 'BMapLib.CurveLine(Array, opts)',
        classConDis: 'CurveLine类的构造函数',
        functions: [],
        events: [],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);\n',
            'var points = [\n',
            '\tnew BMap.Point(116.432045,39.910683),\n', 
            '\tnew BMap.Point(116.388522,39.985964),\n',
            '\tnew BMap.Point(117.218862,39.141468),\n',
            '\tnew BMap.Point(121.485947,31.510083)\n',
            '];\n',
            '// 新建弧线覆盖物对象\n',
            '/* 参数:\n',
            ' * {Array} Array Point数组对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项参考<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB/PolylineOptions" target="_blank">PolylineOptions</a> \n',
            ' * /\n',
            'var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});\n',
            '// 添加到地图\n',
            'map.addOverlay(curve);\n',
            '// 开启编辑功能\n',
            'curve.enableEditing();\n'
        ],
        funcDet:[],
        eveDet:[]
    },
    {
        className: 'BMapLib.DrawingManager',
        classDis: '鼠标绘制管理类，实现鼠标绘制管理的入口。 实例化该类后，即可调用该类提供的open 方法开启绘制模式状态。 也可加入工具栏进行选择操作。 ',
        classCon: 'BMapLib.DrawingManager(map, opts)',
        classConDis: 'DrawingManager类的构造函数',
        functions: [
            {
                funName: 'close()',
                funBack: '无',
                funDis: '关闭地图的绘制状态'

            },
            {
                funName: 'disableCalculate()',
                funBack: '无',
                funDis: '关闭距离或面积计算'

            },
            {
                funName: 'enableCalculate()',
                funBack: '无',
                funDis: '打开距离或面积计算'

            },
            {
                funName: 'getDrawingMode()',
                funBack: 'DrawingType',
                funDis: '获取当前的绘制模式'

            },
            {
                funName: 'open()',
                funBack: '无',
                funDis: '开启地图的绘制模式'

            },
            {
                funName: 'setDrawingMode(DrawingType)',
                funBack: 'Boolean',
                funDis: '设置当前的绘制模式，参数DrawingType，为5个可选常量:\nBMAP_DRAWING_MARKER 画点\nBMAP_DRAWING_CIRCLE 画圆 \nBMAP_DRAWING_POLYLINE 画线 \nBMAP_DRAWING_POLYGON 画多边形 \nBMAP_DRAWING_RECTANGLE 画矩形'
            }
        ],
        events: [
            {
                eveName: 'circlecomplete(overlay)',
                evePara: '{Circle}',
                eveDis: '绘制圆完成后，派发的事件接口'
            },
            {
                eveName: 'markercomplete(overlay)',
                evePara: '{Marker}',
                eveDis: '绘制点完成后，派发的事件接口'
            },
            {
                eveName: 'overlaycomplete(e)',
                evePara: '{Event Object}',
                eveDis: '鼠标绘制完成后，派发总事件的接口'
            },
            {
                eveName: 'polygoncomplete(overlay)',
                evePara: '{Polygon}',
                eveDis: '绘制多边形完成后，派发的事件接口'
            },
            {
                eveName: 'polylinecomplete(overlay)',
                evePara: '{Polyline}',
                eveDis: '绘制线完成后，派发的事件接口'
            },
            {
                eveName: 'rectanglecomplete(overlay)',
                evePara: '{Polygon}',
                eveDis: '绘制矩形完成后，派发的事件接口'
            }
        ],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);\n',
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"isOpen" : {Boolean} 是否开启绘制模式 \n',
            ' *\t"enableDrawingTool" : {Boolean} 是否添加绘制工具栏控件，默认不添加 \n',
            ' *\t"drawingToolOptions" : {Json Object} 可选的输入参数，非必填项。可输入选项包括 \n',
            ' *\t{\n',
            ' *\t\t"anchor" : {ControlAnchor} 停靠位置、默认左上角 \n',
            ' *\t\t"offset" : {Size} 偏移值 \n',
            ' *\t\t"scale" : {Number} 工具栏的缩放比例,默认为1 \n',
            ' *\t\t"drawingModes" : {DrawingType} 工具栏上可以选择出现的绘制模式,将需要显示的DrawingType以数组型形式传入\n',
            ' *\t\t如[BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE] 将只显示画点和画圆的选项\n',
            ' *\t}\n',
            ' *\t"enableCalculate" : {Boolean} 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形) \n',
            ' *\t"markerOptions" : {CircleOptions} 所画的点的可选参数，参考api中的对应类 \n',
            ' *\t"circleOptions" : {CircleOptions} 所画的圆的可选参数，参考api中的对应类 \n',
            ' *\t"polylineOptions" : {CircleOptions} 所画的线的可选参数，参考api中的对应类 \n',
            ' *\t"polygonOptions" : {PolygonOptions} 所画的多边形的可选参数，参考api中的对应类 \n',
            ' *\t"rectangleOptions" : {PolygonOptions} 所画的矩形的可选参数，参考api中的对应类\n',
            ' * }\n',
            ' */\n',
            'var myDrawingManagerObject = new BMapLib.DrawingManager(map, {\n',
            '\tisOpen: true, \n',
            '\tdrawingType: BMAP_DRAWING_MARKER, \n',
            '\tenableDrawingTool: true, \n',
            '\tenableCalculate: false, \n',
            '\tdrawingToolOptions: {\n',
            '\t\tanchor: BMAP_ANCHOR_TOP_LEFT,\n',
            '\t\toffset: new BMap.Size(5, 5),\n',
            '\t\tdrawingTypes : [\n',
            '\t\t\tBMAP_DRAWING_MARKER,\n',
            '\t\t\tBMAP_DRAWING_CIRCLE,\n',
            '\t\t\tBMAP_DRAWING_POLYLINE,\n',
            '\t\t\tBMAP_DRAWING_POLYGON,\n',
            '\t\t\tBMAP_DRAWING_RECTANGLE\n',
            '\t\t]\n',
            '\t},\n',
            '\tpolylineOptions: {\n',
            '\t\tstrokeColor: "#333"\n',
            '\t}\n',
            ');\n'
        ],
        funcDet:[
            '/* 关闭地图的绘制状态\n',
            ' */\n',
            'myDrawingManagerObject.close();\n',
            ' \n',
            '/* 关闭距离或面积计算\n',
            ' */\n',
            'myDrawingManagerObject.disableCalculate();\n',
            ' \n',
            '/* 打开距离或面积计算\n',
            ' */\n',
            'myDrawingManagerObject.enableCalculate();\n',
            ' \n',
            '/* 获取当前的绘制模式\n',
            ' * @return {DrawingType} 绘制的模式',
            ' */\n',
            'alert(myDrawingManagerObject.getDrawingMode());\n',
            ' \n',
            '/* 开启地图的绘制模式\n',
            ' */\n',
            'myDrawingManagerObject.open();\n',
            ' \n',
            '/* 设置当前的绘制模式\n',
            ' * @param {DrawingType} DrawingType 为5个可选常量:\n',
            ' * \tBMAP_DRAWING_MARKER 画点 \n',
            ' * \tBMAP_DRAWING_CIRCLE 画圆\n',
            ' * \tBMAP_DRAWING_POLYLINE 画线\n',
            ' * \tBMAP_DRAWING_POLYGON 画多边形\n',
            ' * \tBMAP_DRAWING_RECTANGLE 画矩形\n',
            ' * @return {Boolean} 是否设置成功',
            ' */\n',
            'myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYLINE);\n',
            ' \n'
        ],
        eveDet:[
            '/* 绘制圆完成后，派发的事件接口\n',
            ' * @param {Circle} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("circlecomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 绘制点完成后，派发的事件接口\n',
            ' * @param {Marker} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("markercomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 鼠标绘制完成后，派发总事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：\n',
            ' * {\n',
            ' *\t"drawingMode : {DrawingType} 当前的绘制模式 \n',
            ' *\t"overlay：{Marker||Polyline||Polygon||Circle} 对应的绘制模式返回对应的覆盖物 \n',
            ' *\t"calculate：{Number} 需要开启计算模式才会返回这个值，\n',
            ' *\t当绘制线的时候返回距离、绘制多边形、圆、矩形时候返回面积，单位为米\n',
            ' *\t"label：{Label} 计算面积时候出现在Map上的Label对象\n',
            ' * }\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("overlaycomplete", function(e) {\n',
            '\talert(e.drawingMode);\n',
            '\talert(e.overlay);\n',
            '\talert(e.calculate);\n',
            '\talert(e.label);\n',
            '});\n',
            ' \n',
            '/* 绘制多边形完成后，派发的事件接口\n',
            ' * @param {Polygon} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("polygoncomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 绘制线完成后，派发的事件接口\n',
            ' * @param {Polyline} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("polylinecomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 绘制矩形完成后，派发的事件接口\n',
            ' * @param {Polygon} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("rectanglecomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
        ]
    },
    {
        className: 'BMapLib.InfoBox',
        classDis: 'InfoBox 入口。 可以自定义border,margin,padding,关闭按钮等等。  ',
        classCon: 'BMapLib.InfoBox(map, content, opts)',
        classConDis: 'InfoBox类的构造函数',
        functions: [
            {
                funName: 'close()',
                funBack: '无',
                funDis: '关闭infoBox'

            },
            {
                funName: 'disableAutoPan()',
                funBack: '无',
                funDis: '禁用自动平移'

            },
            {
                funName: 'enableAutoPan()',
                funBack: '无',
                funDis: '启用自动平移'

            },
            {
                funName: 'getOffset()',
                funBack: 'Size',
                funDis: '返回信息窗口的箭头距离信息窗口在地图 上所锚定的地理坐标点的像素偏移量。'

            },
            {
                funName: 'getPosition(none)',
                funBack: 'Point',
                funDis: '获得信息窗的地理位置'

            },
            {
                funName: 'open(anchor)',
                funBack: '无',
                funDis: '打开infoBox'
            },
            {
                funName: 'setContent(content)',
                funBack: '无',
                funDis: '设置infoBox的内容'

            },
            {
                funName: 'setPosition(point)',
                funBack: '无',
                funDis: '设置信息窗的地理位置'
            }
        ],
        events: [
            {
                eveName: 'Close(e)',
                evePara: '{Event Object}',
                eveDis: '关闭infoBox时，派发事件的接口'
            },
            {
                eveName: 'Open(e)',
                evePara: '{Event Object}',
                eveDis: '打开infoBox时，派发事件的接口'
            }
        ],
        example:[
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {String} content infoBox中的内容\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"offset" : {Size} infoBox的偏移量 \n',
            ' *\t"boxClass" : {String} 定义infoBox的class, \n',
            ' *\t"boxStyle" : {Json} 定义infoBox的style,此项会覆盖boxClass\n',
            ' *\t"closeIconMargin" : {String} 关闭按钮的margin \n',
            ' *\t"closeIconUrl" : {String} 关闭按钮的url地址 \n',
            ' *\t"enableAutoPan" : {Boolean} 是否启动自动平移功能 \n',
            ' *\t"align" : {Number} 基于哪个位置进行定位，取值为[INFOBOX_AT_TOP,INFOBOX_AT_BOTTOM]\n',
            ' * }\n',
            ' */\n',
            'var infoBox = new BMapLib.InfoBox(map,"百度地图api",{\n',
            '\tboxStyle:{background:"url(\'tipbox.gif\') no-repeat center top",width: "200px"},\n',
            '\tcloseIconMargin: "10px 2px 0 0", \n',
            '\tenableAutoPan: true, \n',
            '\talignBottom: false\n',
            '});\n'
        ],
        funcDet:[
            '/* 关闭infoBox\n',
            ' */\n',
            'infoBox.close();\n',
            ' \n',
            '/* 禁用自动平移\n',
            ' */\n',
            'infoBox.disableAutoPan();\n',
            ' \n',
            '/* 启用自动平移\n',
            ' */\n',
            'infoBox.enableAutoPan();\n',
            ' \n',
            '/* 返回信息窗口的箭头距离信息窗口在地图 上所锚定的地理坐标点的像素偏移量。\n',
            ' * @return {Size} 偏移量',
            ' */\n',
            'infoBox.getOffset();\n',
            ' \n',
            '/* 获得信息窗的地理位置\n',
            ' * @return {Point} 信息窗的地理坐标\n',
            ' */\n',
            'infoBox.getPosition();\n',
            ' \n',
            '/* 打开infoBox\n',
            ' * @param {Marker|Point} anchor 要在哪个marker或者point上打开infobox\n',
            ' */\n',
            'infoBox.open();\n',
            ' \n',
            '/* 设置infoBox的内容\n',
            ' * @param {String|HTMLElement} content 弹出气泡中的内容\n',
            ' */\n',
            'infoBox.setContent("百度地图API");\n',
            ' \n',
            '/* 设置信息窗的地理位置\n',
            ' * @param {Point} point 设置position\n',
            ' */\n',
            'infoBox.setPosition(new BMap.Point(116.35,39.911));\n',
            ' \n'
        ],
        eveDet:[
            '/* 关闭infoBox时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{Point} infoBox的关闭位置\n',
            ' * }\n',
            ' */\n',
            'infoBox.addEventListener("close", function(e) {\n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 打开infoBox时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{Point} infoBox的关闭位置\n',
            ' * }\n',
            ' */\n',
            'infoBox.addEventListener("open", function(e) {\n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
        ]
    },
    {
        className: 'BMapLib.MarkerManager',
        classDis: 'MarkerManager 入口。 实例化该类后，可调用addMarkers,show,hide等方法，控制marker。 请注意，此类比较适用于以下情况： 大量marker分布到不同的zoom级别中，比如：18级的时候显示100个marker，15级的时候显示另外的100个marker ',
        classCon: 'BMapLib.MarkerManager(map, opts)',
        classConDis: 'MarkerManger类的构造函数',
        functions: [
            {
                funName: 'addMarker(marker, minZoom, maxZoom)',
                funBack: '无',
                funDis: '添加单个marker'

            },
            {
                funName: 'addMarkers(markers, minZoom, maxZoom)',
                funBack: '无',
                funDis: '批量添加marker'

            },
            {
                funName: 'clearMarkers(none)',
                funBack: '无',
                funDis: '移除在manager中的所有marker,并清空'

            },
            {
                funName: 'getMarkerCount(zoom)',
                funBack: '无',
                funDis: '返回此zoom下可见marker的数量'

            },
            {
                funName: 'hide()',
                funBack: '无',
                funDis: '隐藏marker，此方法只是控制css样式中的display的值'

            },
            {
                funName: 'removeMarker(marker)',
                funBack: '无',
                funDis: '从manager跟地图中，移除marker（如果它现在可见）'

            },
            {
                funName: 'show()',
                funBack: '无',
                funDis: '显示marker,此方法只是控制css样式中的display的值'

            },
            {
                funName: 'showMarkers()',
                funBack: '无',
                funDis: '显示地图上的marker'

            },
            {
                funName: 'toggle()',
                funBack: '无',
                funDis: '显示或者隐藏marker'

            }
        ],
        events: [
        ],
        example:[
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"borderPadding" : {Number} 当前viewport额外的padding，落在这个padding中\n',
            ' *\t的marker会被添加到地图上，即使他们不是完全可见的。 \n',
            ' *\t"maxZoom" : {Number} 设置需要marker manager需要监视的最大的zoom，如果没有给出，默认为地图的最大的zoom。. \n',
            ' * }\n',
            ' */\n',
            'var mgr = new BMapLib.MarkerManager(map,{borderPadding: padding,maxZoom: 18,trackMarkers: true});\n',
        ],
        funcDet:[
            '/* 添加单个marker\n',
            ' * @param {Marker} marker 要添加的marker\n',
            ' * @param {Number} minZoom 当地图缩放到小于此zoom的时候，marker不会加载到地图上\n',
            ' * @param {Number} maxZoom 当地图缩放到大于此zoom的时候，marker不会加载到地图上\n',
            ' */\n',
            'mgr.addMarker(marker, 4, 15);\n',
            ' \n',
            '/* 批量添加marker\n',
            ' * @param {Array} markers 要添加的marker数组\n',
            ' * @param {Number} minZoom 当地图缩放到小于此zoom的时候，marker不会加载到地图上\n',
            ' * @param {Number} maxZoom 当地图缩放到大于此zoom的时候，marker不会加载到地图上\n',
            ' */\n',
            'mgr.addMarker(markers, 4, 15);\n',
            ' \n',
            '/* 移除在manager中的所有marker,并清空\n',
            ' */\n',
            'mgr.clearMarkers();\n',
            ' \n',
            '/* 返回此zoom下可见marker的数量\n',
            ' * @param {Number} zoom 地图缩放级别\n',
            ' * @return {Number} marker数量\n',
            ' */\n',
            'mgr.getMarkerCount(15);\n',
            ' \n',
            '/* 隐藏marker，此方法只是控制css样式中的display的值\n',
            ' */\n',
            'mgr.hide();\n',
            ' \n',
            '/* 从manager跟地图中，移除marker（如果它现在可见）\n',
            ' * @param {Marker} marker 要删除的marker\n',
            ' */\n',
            'mgr.removeMarker(Marker);\n',
            ' \n',
            '/* 显示marker,此方法只是控制css样式中的display的值\n',
            ' */\n',
            'mgr.show();\n',
            ' \n',
            '/* 显示地图上的marker\n',
            ' */\n',
            'mgr.showMarkers();\n',
            ' \n',
            '/* 显示或者隐藏marker\n',
            ' */\n',
            'mgr.toggle();\n',
            ' \n'
        ],
        eveDet:[            
        ]
    },
    {
        className: 'BMapLib.DrawingManager',
        classDis: '鼠标绘制管理类，实现鼠标绘制管理的入口。 实例化该类后，即可调用该类提供的open 方法开启绘制模式状态。 也可加入工具栏进行选择操作。 ',
        classCon: 'BMapLib.DrawingManager(map, opts)',
        classConDis: 'DrawingManager类的构造函数',
        functions: [
            {
                funName: 'close()',
                funBack: '无',
                funDis: '关闭地图的绘制状态'

            },
            {
                funName: 'disableCalculate()',
                funBack: '无',
                funDis: '关闭距离或面积计算'

            },
            {
                funName: 'enableCalculate()',
                funBack: '无',
                funDis: '打开距离或面积计算'

            },
            {
                funName: 'getDrawingMode()',
                funBack: 'DrawingType',
                funDis: '获取当前的绘制模式'

            },
            {
                funName: 'open()',
                funBack: '无',
                funDis: '开启地图的绘制模式'

            },
            {
                funName: 'setDrawingMode(DrawingType)',
                funBack: 'Boolean',
                funDis: '设置当前的绘制模式，参数DrawingType，为5个可选常量:\nBMAP_DRAWING_MARKER 画点\nBMAP_DRAWING_CIRCLE 画圆 \nBMAP_DRAWING_POLYLINE 画线 \nBMAP_DRAWING_POLYGON 画多边形 \nBMAP_DRAWING_RECTANGLE 画矩形'
            }
        ],
        events: [
            {
                eveName: 'circlecomplete(overlay)',
                evePara: '{Circle}',
                eveDis: '绘制圆完成后，派发的事件接口'
            },
            {
                eveName: 'markercomplete(overlay)',
                evePara: '{Marker}',
                eveDis: '绘制点完成后，派发的事件接口'
            },
            {
                eveName: 'overlaycomplete(e)',
                evePara: '{Event Object}',
                eveDis: '鼠标绘制完成后，派发总事件的接口'
            },
            {
                eveName: 'polygoncomplete(overlay)',
                evePara: '{Polygon}',
                eveDis: '绘制多边形完成后，派发的事件接口'
            },
            {
                eveName: 'polylinecomplete(overlay)',
                evePara: '{Polyline}',
                eveDis: '绘制线完成后，派发的事件接口'
            },
            {
                eveName: 'rectanglecomplete(overlay)',
                evePara: '{Polygon}',
                eveDis: '绘制矩形完成后，派发的事件接口'
            }
        ],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);\n',
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"isOpen" : {Boolean} 是否开启绘制模式 \n',
            ' *\t"enableDrawingTool" : {Boolean} 是否添加绘制工具栏控件，默认不添加 \n',
            ' *\t"drawingToolOptions" : {Json Object} 可选的输入参数，非必填项。可输入选项包括 \n',
            ' *\t{\n',
            ' *\t\t"anchor" : {ControlAnchor} 停靠位置、默认左上角 \n',
            ' *\t\t"offset" : {Size} 偏移值 \n',
            ' *\t\t"scale" : {Number} 工具栏的缩放比例,默认为1 \n',
            ' *\t\t"drawingModes" : {DrawingType} 工具栏上可以选择出现的绘制模式,将需要显示的DrawingType以数组型形式传入\n',
            ' *\t\t如[BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE] 将只显示画点和画圆的选项\n',
            ' *\t}\n',
            ' *\t"enableCalculate" : {Boolean} 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形) \n',
            ' *\t"markerOptions" : {CircleOptions} 所画的点的可选参数，参考api中的对应类 \n',
            ' *\t"circleOptions" : {CircleOptions} 所画的圆的可选参数，参考api中的对应类 \n',
            ' *\t"polylineOptions" : {CircleOptions} 所画的线的可选参数，参考api中的对应类 \n',
            ' *\t"polygonOptions" : {PolygonOptions} 所画的多边形的可选参数，参考api中的对应类 \n',
            ' *\t"rectangleOptions" : {PolygonOptions} 所画的矩形的可选参数，参考api中的对应类\n',
            ' * }\n',
            ' */\n',
            'var myDrawingManagerObject = new BMapLib.DrawingManager(map, {\n',
            '\tisOpen: true, \n',
            '\tdrawingType: BMAP_DRAWING_MARKER, \n',
            '\tenableDrawingTool: true, \n',
            '\tenableCalculate: false, \n',
            '\tdrawingToolOptions: {\n',
            '\t\tanchor: BMAP_ANCHOR_TOP_LEFT,\n',
            '\t\toffset: new BMap.Size(5, 5),\n',
            '\t\tdrawingTypes : [\n',
            '\t\t\tBMAP_DRAWING_MARKER,\n',
            '\t\t\tBMAP_DRAWING_CIRCLE,\n',
            '\t\t\tBMAP_DRAWING_POLYLINE,\n',
            '\t\t\tBMAP_DRAWING_POLYGON,\n',
            '\t\t\tBMAP_DRAWING_RECTANGLE\n',
            '\t\t]\n',
            '\t},\n',
            '\tpolylineOptions: {\n',
            '\t\tstrokeColor: "#333"\n',
            '\t}\n',
            ');\n'
        ],
        funcDet:[
            '/* 关闭地图的绘制状态\n',
            ' */\n',
            'myDrawingManagerObject.close();\n',
            ' \n',
            '/* 关闭距离或面积计算\n',
            ' */\n',
            'myDrawingManagerObject.disableCalculate();\n',
            ' \n',
            '/* 打开距离或面积计算\n',
            ' */\n',
            'myDrawingManagerObject.enableCalculate();\n',
            ' \n',
            '/* 获取当前的绘制模式\n',
            ' * @return {DrawingType} 绘制的模式',
            ' */\n',
            'alert(myDrawingManagerObject.getDrawingMode());\n',
            ' \n',
            '/* 开启地图的绘制模式\n',
            ' */\n',
            'myDrawingManagerObject.open();\n',
            ' \n',
            '/* 设置当前的绘制模式\n',
            ' * @param {DrawingType} DrawingType 为5个可选常量:\n',
            ' * \tBMAP_DRAWING_MARKER 画点 \n',
            ' * \tBMAP_DRAWING_CIRCLE 画圆\n',
            ' * \tBMAP_DRAWING_POLYLINE 画线\n',
            ' * \tBMAP_DRAWING_POLYGON 画多边形\n',
            ' * \tBMAP_DRAWING_RECTANGLE 画矩形\n',
            ' * @return {Boolean} 是否设置成功',
            ' */\n',
            'myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYLINE);\n',
            ' \n'
        ],
        eveDet:[
            '/* 绘制圆完成后，派发的事件接口\n',
            ' * @param {Circle} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("circlecomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 绘制点完成后，派发的事件接口\n',
            ' * @param {Marker} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("markercomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 鼠标绘制完成后，派发总事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：\n',
            ' * {\n',
            ' *\t"drawingMode : {DrawingType} 当前的绘制模式 \n',
            ' *\t"overlay：{Marker||Polyline||Polygon||Circle} 对应的绘制模式返回对应的覆盖物 \n',
            ' *\t"calculate：{Number} 需要开启计算模式才会返回这个值，\n',
            ' *\t当绘制线的时候返回距离、绘制多边形、圆、矩形时候返回面积，单位为米\n',
            ' *\t"label：{Label} 计算面积时候出现在Map上的Label对象\n',
            ' * }\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("overlaycomplete", function(e) {\n',
            '\talert(e.drawingMode);\n',
            '\talert(e.overlay);\n',
            '\talert(e.calculate);\n',
            '\talert(e.label);\n',
            '});\n',
            ' \n',
            '/* 绘制多边形完成后，派发的事件接口\n',
            ' * @param {Polygon} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("polygoncomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 绘制线完成后，派发的事件接口\n',
            ' * @param {Polyline} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("polylinecomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
            '/* 绘制矩形完成后，派发的事件接口\n',
            ' * @param {Polygon} overlay 回调函数会返回相应的覆盖物:\n',
            ' */\n',
            'myDrawingManagerObject.addEventListener("rectanglecomplete", function(overlay) {\n',
            '\talert(overlay);\n',
            '});\n',
            ' \n',
        ]
    },
    {
        className: 'BMapLib.RichMarker',
        classDis: '富Marker定义类，实现丰富的Marker展现效果。',
        classCon: 'BMapLib.RichMarker(content, position, RichMarkerOptions)',
        classConDis: 'RichMarker类的构造函数',
        functions: [
            {
                funName: 'disableDragging()',
                funBack: '无',
                funDis: '设置Marker不能拖拽'

            },
            {
                funName: 'enableDragging()',
                funBack: '无',
                funDis: '设置Marker可以拖拽'

            },
            {
                funName: 'getAnchor()',
                funBack: 'BMap.Size',
                funDis: '获取Marker的偏移量'

            },
            {
                funName: 'getContent()',
                funBack: 'String | HTMLElement',
                funDis: '获取Marker的内容'

            },
            {
                funName: 'getHeight()',
                funBack: 'Number',
                funDis: '获取Marker的高度'

            },
            {
                funName: 'getPosition()',
                funBack: 'BMap.Point',
                funDis: '获取Marker的显示位置'
            },
            {
                funName: 'getWidth()',
                funBack: 'Number',
                funDis: '获取Marker的宽度'

            },
            {
                funName: 'isDraggable()',
                funBack: 'Boolean',
                funDis: '获取Marker是否能被拖拽的状态'
            },
            {
                funName: 'setAnchor(anchor)',
                funBack: '无',
                funDis: '设置Marker的偏移量'

            },
            {
                funName: 'setContent(content)',
                funBack: '无',
                funDis: '设置Marker的内容'

            },
            {
                funName: 'setHeight(height)',
                funBack: '无',
                funDis: '设置Marker的高度'
            },
            {
                funName: 'setPosition(position)',
                funBack: '无',
                funDis: '设置Marker的显示位置'

            },
            {
                funName: 'setWidth(width)',
                funBack: '无',
                funDis: '设置Marker的宽度'
            }
        ],
        events: [
            {
                eveName: 'onclick(e)',
                evePara: '{Event Object}',
                eveDis: '点击Marker时，派发事件的接口'
            },
            {
                eveName: 'ondblclick(e)',
                evePara: '{Event Object}',
                eveDis: '双击Marker时，派发事件的接口'
            },
            {
                eveName: 'ondragend(e)',
                evePara: '{Event Object}',
                eveDis: '拖拽Marker结束时，派发事件的接口'
            },
            {
                eveName: 'ondragging(e)',
                evePara: '{Event Object}',
                eveDis: '拖拽Marker的过程中，派发事件的接口'
            },
            {
                eveName: 'ondragstart(e)',
                evePara: '{Event Object}',
                eveDis: '开始拖拽Marker时，派发事件的接口'
            },
            {
                eveName: 'onmousedown(e)',
                evePara: '{Event Object}',
                eveDis: '在Marker上按下鼠标时，派发事件的接口'
            },
            {
                eveName: 'onmouseout(e)',
                evePara: '{Event Object}',
                eveDis: '鼠标移出Marker时，派发事件的接口'
            },
            {
                eveName: 'onmouseover(e)',
                evePara: '{Event Object}',
                eveDis: '鼠标移到Marker上时，派发事件的接口'
            },
            {
                eveName: 'onmouseup(e)',
                evePara: '{Event Object}',
                eveDis: '在Marker上弹起鼠标时，派发事件的接口'
            }
        ],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);\n',
            'var htm = "&ltdiv style=\'background:#E7F0F5;color:#0082CB;border:1px solid #333\'&gt"\n',
            '\t+     "欢迎使用百度地图！"\n',
            '\t+ "&lt/div&gt";\n',
            'var point = new BMap.Point(116.30816, 40.056863);\n',
            '/* 参数:\n',
            ' * {String | HTMLElement} content 用户自定义的Marker内容，\n',
            ' * 可以是字符串，也可以是dom节点\n',
            ' * {BMap.Point} position marker的位置\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"anchor" : {BMap.Size} Marker的的位置偏移值 \n',
            ' *\t"enableDragging" : {Boolean} 是否启用拖拽，默认为false\n',
            ' * }\n',
            ' */\n',
            'var myRichMarkerObject = new BMapLib.RichMarker(htm, point, {\n',
            '\t"anchor": new BMap.Size(-72, -84),\n',
            '\t"enableDragging": truen',
            '});\n',
            'map.addOverlay(myRichMarkerObject);\n',
        ],
        funcDet:[
            '/* 设置Marker不能拖拽\n',
            ' */\n',
            'myRichMarkerObject.disableDragging();\n',
            ' \n',
            '/* 设置Marker可以拖拽\n',
            ' */\n',
            'myRichMarkerObject.enableDragging();\n',
            ' \n',
            '/* 获取Marker的偏移量\n',
            ' * @return {BMap.Size} Marker的偏移量\n',
            ' */\n',
            'myRichMarkerObject.getAnchor();\n',
            ' \n',
            '/* 获取Marker的内容\n',
            ' * @return {String | HTMLElement} 当前内容\n',
            ' */\n',
            'myRichMarkerObject.getContent();\n',
            ' \n',
            '/* 获取Marker的高度\n',
            ' * @return {Number} 当前高度\n',
            ' */\n',
            'myRichMarkerObject.getHeight();\n',
            ' \n',
            '/* 获取Marker的显示位置\n',
            ' * @return {BMap.Point} 显示的位置\n',
            ' */\n',
            'myRichMarkerObject.getPosition();\n',
            ' \n',
            '/* 获取Marker的宽度\n',
            ' * @return {Number} 当前宽度\n',
            ' */\n',
            'myRichMarkerObject.getWidth();\n',
            ' \n',
            '/* 获取Marker是否能被拖拽的状态\n',
            ' * @return {Boolean} true为可以拖拽，false为不能被拖拽\n',
            ' */\n',
            'myRichMarkerObject.isDraggable();\n',
            ' \n',
            '/* 设置Marker的偏移量\n',
            ' * @param {BMap.Size} anchor 需要设置的偏移量\n',
            ' */\n',
            'myRichMarkerObject.setAnchor(new BMap.Size(-72, -84));\n',
            ' \n',
            '/* 设置Marker的内容\n',
            ' * @param {String | HTMLElement} content 需要设置的内容\n',
            ' */\n',
            'var htm = "&ltdiv style=\'background:#E7F0F5;color:#0082CB;border:1px solid #333\'&gt"\n',
            '\t+     "欢迎使用百度地图API！"\n',
            '\t+     "&ltimg src=\'http://map.baidu.com/img/logo-map.gif\' border=\'0\' /&gt"\n',
            '\t+ "&lt/div&gt";\n',
            'myRichMarkerObject.setContent(htm);\n',
            ' \n',
            '/* 设置Marker的高度\n',
            ' * @param {Number} height 需要设置的高度\n',
            ' */\n',
            'myRichMarkerObject.setHeight(200);\n',
            ' \n',
            '/* 设置Marker的显示位置\n',
            ' * @param {BMap.Point} position 需要设置的位置\n',
            ' */\n',
            'myRichMarkerObject.setPosition(new BMap.Point(116.30816, 40.056863));\n',
            ' \n',
            '/* {Number} width 需要设置的宽度\n',
            ' * @param {Number} width 需要设置的宽度\n',
            ' */\n',
            'myRichMarkerObject.setWidth(300);\n',
            ' \n'
        ],
        eveDet:[
            '/* 点击Marker时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("onclick", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 双击Marker时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("ondblclick", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 拖拽Marker结束时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("ondragend", function(e) {  \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 拖拽Marker的过程中，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("ondragging", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 开始拖拽Marker时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("ondragstart", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 在Marker上按下鼠标时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("onmousedown", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 鼠标移出Marker时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("onmouseout", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 鼠标移到Marker上时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("onmouseover", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n',
            '/* 在Marker上弹起鼠标时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"target : {BMap.Overlay} 触发事件的元素, \n',
            ' *\t"type：{String} 事件类型, \n',
            ' *\t"point：{BMap.Point} 鼠标的物理坐标,  \n',
            ' *\t"pixel：{BMap.Pixel} 鼠标的像素坐标 \n',
            ' * }\n',
            ' */\n',
            'myRichMarkerObject.addEventListener("onmouseup", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n'
        ]
    },
    {
        className: 'BMapLib.LuShu',
        classDis: 'LuShu 入口。 实例化该类后，可调用,start,end,pause等方法控制覆盖物的运动。',
        classCon: 'BMapLib.LuShu(map, path, opts)',
        classConDis: 'LuShu类的构造函数',
        functions: [
            {
                funName: 'hideInfoWindow()',
                funBack: '无',
                funDis: '隐藏上方overlay'

            },
            {
                funName: 'pause()',
                funBack: '无',
                funDis: '暂停运动'

            },
            {
                funName: 'showInfoWindow()',
                funBack: '无',
                funDis: '显示上方overlay'

            },
            {
                funName: 'start()',
                funBack: '无',
                funDis: '开始运动'

            },
            {
                funName: 'stop()',
                funBack: '无',
                funDis: '结束运动'

            }
        ],
        events: [
        ],
        example:[
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {Array} path 构成路线的point的数组\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"landmarkPois" : {Array} 要在覆盖物移动过程中，显示的特殊点。格式如下：\n',
            ' *\t[\n',
            ' *\t\t{lng:116.314782,lat:39.913508,html:\'加油站\',pauseTime:2},\n',
            ' *\t\t{lng:116.315391,lat:39.964429,html:\'高速公路收费站\',pauseTime:3}\n',
            ' *\t]\n',
            ' *\t"icon" : {Icon} 覆盖物的icon\n',
            ' *\t"speed" : {Number} 覆盖物移动速度，单位米/秒 \n',
            ' *\t"defaultContent" : {String} 覆盖物中的内容\n',
            ' *\t"autoView" : {Boolean} 是否自动调整路线视野，默认不调整 \n',
            ' *\t"enableRotation" : {Boolean} 是否开启marker随路走向旋转，默认为false，即不随路走向旋转 \n',
            ' * }\n',
            ' */\n',
            'var lushu = new BMapLib.LuShu(map,arrPois,{defaultContent:"从北京到天津",landmarkPois:[]});\n',
        ],
        funcDet:[
            '/* 隐藏上方overlay\n',
            ' */\n',
            'lushu.hideInfoWindow();\n',
            ' \n',
            '/* 暂停运动\n',
            ' */\n',
            'lushu.pause();\n',
            ' \n',
            '/* 显示上方overlay\n',
            ' */\n',
            'lushu.showInfoWindow();\n',
            ' \n',
            '/* 开始运动\n',
            ' */\n',
            'lushu.start();\n',
            ' \n',
            '/* 结束运动\n',
            ' */\n',
            'lushu.stop();\n',
            ' \n'
        ],
        eveDet:[            
        ]
    },
    {
        className: 'BMapLib.DistanceTool',
        classDis: '距离测算类，实现测距效果的入口。 实例化该类后，即可调用该类提供的open 方法开启测距状态。 ',
        classCon: 'BMapLib.DistanceTool(map, opts)',
        classConDis: 'DistanceTool类的构造函数',
        functions: [
            {
                funName: 'close()',
                funBack: '无',
                funDis: '关闭测距状态'

            },
            {
                funName: 'open()',
                funBack: 'Boolean',
                funDis: '开启地图的测距状态'

            }
        ],
        events: [
            {
                eveName: 'onaddpoint(e)',
                evePara: '{Event Object}',
                eveDis: '测距过程中，每次点击底图添加节点时，派发事件的接口'
            },
            {
                eveName: 'ondrawend(e)',
                evePara: '{Event Object}',
                eveDis: '测距时，每次双击底图结束当前测距折线时，派发事件的接口'
            }
        ],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);\n',
            '/* 参数:\n',
            ' * {Map} mapBaidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"followText" : {String} 测距过程中，提示框文字 \n',
            ' *\t"unit" : {String} 测距结果所用的单位制，可接受的属性为"metric"表示米制和"us"表示美国传统单位, \n',
            ' *\t"lineColor" : {String} 折线颜色, \n',
            ' *\t"lineStroke" : {Number} 折线宽度, \n',
            ' *\t"opacity" : {Number} 透明度, \n',
            ' *\t"lineStyle" : {String} 折线的样式，只可设置solid和dashed, \n',
            ' *\t"secIcon" : {BMap.Icon} 转折点的Icon, \n',
            ' *\t"closeIcon" : {BMap.Icon} 关闭按钮的Icon, \n',
            ' *\t"cursor" : {String} 跟随的鼠标样式\n',
            ' * }\n',
            ' */\n',
            'var myDistanceToolObject = new BMapLib.DistanceTool(map, {lineStroke : 2});\n',
        ],
        funcDet:[
            '/* 关闭测距状态\n',
            ' */\n',
            'myDistanceToolObject.close();\n',
            ' \n',
            '/* 开启地图的测距状态\n',
            ' * @return {Boolean} ，开启测距状态成功，返回true；否则返回false。\n',
            ' */\n',
            'myDistanceToolObject.open();\n',
            ' \n'
        ],
        eveDet:[
            '/* 测距过程中，每次点击底图添加节点时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"point : {BMap.Point} 最新添加上的节点BMap.Point对象\n',
            ' *\t"pixel：{BMap.pixel} 最新添加上的节点BMap.Pixel对象\n',
            ' *\t"index：{Number} 最新添加的节点的索引  \n',
            ' *\t"distance：{Number} 截止最新添加的节点的总距离 \n',
            ' * }\n',
            ' */\n',
            'myDistanceToolObject.addEventListener("addpoint", function(e) { \n',
            '\talert(e.distance);\n',
            '});\n',
            ' \n',
            '/* 测距时，每次双击底图结束当前测距折线时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"points : {BMap.Point} 所有测量时，打下的节点BMap.Point对象,  \n',
            ' *\t"overlays：{Array} 所有测量时，生成的线段BMap.Overlay对象 \n',
            ' *\t"distance：{Number} 测量解释时的最终距离 \n',
            ' * }\n',
            ' */\n',
            'myDistanceToolObject.addEventListener("drawend", function(e) {  \n',
            '\talert(e.distance);\n',
            '});\n',
            ' \n'
        ]
    },
    {
        className: 'BMapLib.MarkerClusterer',
        classDis: '用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能  ',
        classCon: 'BMapLib.MarkerClusterer(map, options)',
        classConDis: 'MarkerClusterer类的构造函数',
        functions: [
            {
                funName: 'addMarker(marker)',
                funBack: '无',
                funDis: '添加一个聚合的标记'

            },
            {
                funName: 'addMarkers(markers)',
                funBack: '无',
                funDis: '添加要聚合的标记数组'

            },
            {
                funName: 'clearMarkers()',
                funBack: '无',
                funDis: '从地图上彻底清除所有的标记'

            },
            {
                funName: 'getClustersCount()',
                funBack: 'Number',
                funDis: '获取聚合的总数量'

            },
            {
                funName: 'getGridSize()',
                funBack: 'Number',
                funDis: '获取网格大小'

            },
            {
                funName: 'getMap()',
                funBack: 'Map',
                funDis: '获取聚合的Map实例'

            },
            {
                funName: 'getMarkers()',
                funBack: 'Array',
                funDis: '获取所有的标记数组'

            },
            {
                funName: 'getMaxZoom()',
                funBack: 'Number',
                funDis: '获取聚合的最大缩放级别'

            },
            {
                funName: 'getMinClusterSize()',
                funBack: 'Number',
                funDis: '获取单个聚合的最小数量'

            },
            {
                funName: 'getStyles()',
                funBack: 'Array',
                funDis: '获取聚合的样式风格集合'

            },
            {
                funName: 'isAverageCenter()',
                funBack: 'Boolean',
                funDis: '获取单个聚合的落脚点是否是聚合内所有标记的平均中心'

            },
            {
                funName: 'removeMarker(marker)',
                funBack: 'Boolean',
                funDis: '删除单个标记'

            },
            {
                funName: 'removeMarkers(markers)',
                funBack: 'Boolean',
                funDis: '删除一组标记'

            },
            {
                funName: 'setGridSize(size)',
                funBack: '无',
                funDis: '设置网格大小'

            },
            {
                funName: 'setMaxZoom(maxZoom)',
                funBack: '无',
                funDis: '设置聚合的最大缩放级别'

            },
            {
                funName: 'setMinClusterSize(size)',
                funBack: '无',
                funDis: '设置单个聚合的最小数量'

            },
            {
                funName: 'setStyles(styles)',
                funBack: '无',
                funDis: '设置聚合的样式风格集合'

            }
        ],
        events: [],
        example:[
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"markers" : {Array} 要聚合的标记数组\n',
            ' *\t"girdSize" : {Number} 聚合计算时网格的像素大小，默认60\n',
            ' *\t"maxZoom" : {Number} 最大的聚合级别，大于该级别就不进行相应的聚合\n',
            ' *\t"minClusterSize" : {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2\n',
            ' *\t"isAverangeCenter" : {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，\n',
            ' *\t默认为否，落脚在聚合内的第一个点\n',
            ' *\t"styles" : {Array} 自定义聚合后的图标风格，请参考TextIconOverlay类\n',
            ' * }\n',
            ' */\n',
            'var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});\n',
        ],
        funcDet:[
            '/* 添加一个聚合的标记\n',
            ' * @param {BMap.Marker} marker 要聚合的单个标记\n',
            ' */\n',
            'markerClusterer.addMarker(marker);\n',
            ' \n',
            '/* 添加要聚合的标记数组\n',
            ' * @param {Array} markers 要聚合的标记数组\n',
            ' */\n',
            'markerClusterer.addMarkers(markers);\n',
            ' \n',
            '/* 从地图上彻底清除所有的标记\n',
            ' */\n',
            'markerClusterer.clearMarkers();\n',
            ' \n',
            '/* 获取聚合的总数量\n',
            ' * @return {Number} 聚合的总数量\n',
            ' */\n',
            'markerClusterer.getClustersCount();\n',
            ' \n',
            '/* 获取网格大小\n',
            ' * @return {Number} 网格大小\n',
            ' */\n',
            'markerClusterer.getGridSize();\n',
            ' \n',
            '/* 获取聚合的Map实例\n',
             ' * @return {Map} Map的示例\n',
            ' */\n',
            'markerClusterer.getMap();\n',
            ' \n',
            '/* 获取所有的标记数组\n',
            ' * @return {Array} 标记数组\n',
            ' */\n',
            'markerClusterer.getMarkers();\n',
            ' \n',
            '/* 获取聚合的最大缩放级别\n',
            ' * @return {Number} 聚合的最大缩放级别\n',
            ' */\n',
            'markerClusterer.getMaxZoom();\n',
            ' \n',
            '/* 获取单个聚合的最小数量\n',
            ' * @return {Number} 单个聚合的最小数量\n',
            ' */\n',
            'markerClusterer.getMinClusterSize();\n',
            ' \n',
            '/* 获取聚合的样式风格集合\n',
            ' * @return {Array} 聚合的样式风格集合\n',
            ' */\n',
            'markerClusterer.getStyles();\n',
            ' \n',
            '/* 获取单个聚合的落脚点是否是聚合内所有标记的平均中心\n',
            ' * @return {Boolean} true或false\n',
            ' */\n',
            'markerClusterer.isAverageCenter();\n',
            ' \n',
            '/* 删除单个标记\n',
            ' * @param {BMap.Marker} marker 需要被删除的marker\n',
            ' * @return {Boolean} 删除成功返回true，否则返回false\n',
            ' */\n',
            'markerClusterer.removeMarker(marker);\n',
            ' \n',
            '/* 删除一组标记\n',
            ' * @param {Array} markers 需要被删除的marker数组\n',
            ' * @return {Boolean} 删除成功返回true，否则返回false\n',
            ' */\n',
            'markerClusterer.removeMarkers(markers);\n',
            ' \n',
            '/* 设置网格大小\n',
            ' * @param {Number} size 网格大小\n',
            ' */\n',
            'markerClusterer.setGridSize(size);\n',
            ' \n',
            '/* 设置聚合的最大缩放级别\n',
            ' * @param {Number} maxZoom 聚合的最大缩放级别\n',
            ' */\n',
            'markerClusterer.setMaxZoom(maxZoom);\n',
            ' \n',
            '/* 设置单个聚合的最小数量\n',
            ' * @param {Number} size 单个聚合的最小数量\n',
            ' */\n',
            'markerClusterer.setMinClusterSize(size);\n',
            ' \n',
            '/* 设置聚合的样式风格集合\n',
            ' * @param {Array} styles 样式风格数组\n',
            ' */\n',
            'markerClusterer.setStyles(styles);\n',
            ' \n'
        ],
        eveDet:[]
    },
    {
        className: 'BMapLib.MarkerTool',
        classDis: '地图上添加标注类，实现点击地图添加点标注入口。 实例化该类后，即可调用该类提供的open 方法开启添加点标注状态',
        classCon: 'BMapLib.MarkerTool(map, opts)',
        classConDis: 'MarkerTool类的构造函数',
        functions: [
            {
                funName: 'close()',
                funBack: '无',
                funDis: '关闭工具'
            },
            {
                funName: 'open()',
                funBack: 'Boolean',
                funDis: '开启工具'
            },
            {
                funName: 'getIcon()',
                funBack: 'Icon',
                funDis: '获取标注图标及鼠标跟随样式'
            },
            {
                funName: 'setIcon(icon)',
                funBack: '无',
                funDis: '设置标注的图标及鼠标跟随样式'
            }
        ],
        events: [
            {
                eveName: 'onmarkend(e)',
                evePara: '{Event Object}',
                eveDis: '添加标注过程中，每次点击地图添加完标注时，派发事件的接口'
            }
        ],
        example:[
            'var map = new BMap.Map("container");\n',
            'map.centerAndZoom(new BMap.Point(116.309965, 40.058333), 17);\n',
            '/* 参数:\n',
            ' * {Map} mapBaidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"icon" : {Icon} 标注使用到的图标，标注时候鼠标跟随样式也通过此属性设置  \n',
            ' *\t"followText" : {String} 跟随鼠标移动的说明文字，默认为空\n',
            ' *\t"autoClose" : {Boolean} 是否在每次添加完Marker后自动关闭工具\n',
            ' * }\n',
            ' */\n',
            'var mkrTool = new BMapLib.MarkerTool(map, {followText: "添加一个点"});\n',
        ],
        funcDet:[
            '/* 关闭工具\n',
            ' */\n',
            'mkrTool.close();\n',
            ' \n',
            '/* 开启工具\n',
            ' * @return {Boolean} true表示开启成功，false表示开启失败\n',
            ' */\n',
            'mkrTool.open();\n',
            ' \n',
            '/* 获取标注图标及鼠标跟随样式\n',
            ' * @return {Icon} 当前标注及鼠标跟随样式\n',
            ' */\n',
            'mkrTool.getIcon();\n',
            ' \n',
            '/* 设置标注的图标及鼠标跟随样式\n',
            ' * @param {Icon} icon 标注样式及鼠标跟随样式,系统提供了 24种默认的图标\n',
            ' * 分别是：BMapLib.MarkerTool.SYS_ICON[0] -- BMapLib.MarkerTool.SYS_ICON[23]\n',
            ' */\n',
            'mkrTool.setIcon(icon);\n',
            ' \n',
        ],
        eveDet:[
            '/* 添加标注过程中，每次点击地图添加完标注时，派发事件的接口\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"type : {String} 事件类型 \n',
            ' *\t"target：{MarkerTool} 当前MarkerTool对象 \n',
            ' *\t"marker：{Marker} 当前添加的Marker标注 \n',
            ' * }\n',
            ' */\n',
            'mkrTool.addEventListener("markend", function(e) { \n',
            '\talert(e.type);\n',
            '});\n',
            ' \n'
        ]
    },
    {
        className: 'BMapLib.TextIconOverlay',
        classDis: '此类表示地图上的一个覆盖物，该覆盖物由文字和图标组成，从Overlay继承。文字通常是数字（0-9）或字母（A-Z ），而文字与图标之间有一定的映射关系。 该覆盖物适用于以下类似的场景：需要在地图上添加一系列覆盖物，这些覆盖物之间用不同的图标和文字来区分，文字可能表示了该覆盖物的某一属性值，根据该文字和一定的映射关系，自动匹配相应颜色和大小的图标。',
        classCon: 'BMapLib.TextIconOverlay(position, text, options)',
        classConDis: 'TextIconOverlay类的构造函数',
        functions: [
            {
                funName: 'draw()',
                funBack: '无',
                funDis: '继承Overlay的draw方法，自定义覆盖物时必须'
            },
            {
                funName: 'getPosition()',
                funBack: 'Point',
                funDis: '获取该覆盖物的位置'
            },
            {
                funName: 'getStyleByText(text, styles)',
                funBack: 'Number',
                funDis: '由文字信息获取风格数组的对应索引值。 内部默认的对应函数为文字转换为数字除以10的结果，比如文字8返回索引0，文字25返回索引2'
            },
            {
                funName: 'getText()',
                funBack: 'String',
                funDis: '获取该覆盖物上的文字'
            },
            {
                funName: 'initialize(map)',
                funBack: 'HTMLElement',
                funDis: '继承Overlay的intialize方法，自定义覆盖物时必须'
            },
            {
                funName: 'setPosition(position)',
                funBack: '无',
                funDis: '设置该覆盖物的位置'
            },
            {
                funName: 'setText(text)',
                funBack: '无',
                funDis: '设置该覆盖物上的文字'
            }
        ],
        events: [
            {
                eveName: 'click(e)',
                evePara: '{Event Object}',
                eveDis: '当鼠标点击该覆盖物时会触发该事件'
            },
            {
                eveName: 'mouseout(e)',
                evePara: '{Event Object}',
                eveDis: '当鼠标离开该覆盖物区域时会触发该事件'
            },
            {
                eveName: 'mouseover(e)',
                evePara: '{Event Object}',
                eveDis: '当鼠标进入该覆盖物区域时会触发该事件'
            }
        ],
        example:[
            '/* 参数:\n',
            ' * {Point} position 表示一个经纬度坐标位置\n',
            ' * {String} text 表示该覆盖物显示的文字信息\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"styles":{Array} 一组图标风格。单个图表风格包括以下几个属性：\n',
            ' *\t{\n',
            ' *\t\t"url"  {String}    图片的url地址。(必选)\n',
            ' *\t\t"size" {Size}  图片的大小。（必选）\n',
            ' *\t\t"anchor" {Size} 图标定位在地图上的位置相对于图标左上角的偏移值，默认偏移值为图标的中心位置。（可选）\n',
            ' *\t\t"offset" {Size} 图片相对于可视区域的偏移值，此功能的作用等同于CSS中的background-position属性。（可选）\n',
            ' *\t\t"textSize" {Number} 文字的大小。（可选，默认10）\n',
            ' *\t\t"textColor" {String} 文字的颜色。（可选，默认black）\n',
            ' *\t}\n',
            ' * }\n',
            ' */\n',
            'var rm = new BMapLib.TextIconOverlay(point, 7);\n',
            'map.addOverlay(rm);\n'
        ],
        funcDet:[
            '/* 继承Overlay的draw方法，自定义覆盖物时必须\n',
            ' */\n',
            'textIcon.draw();\n',
            ' \n',
            '/* 获取该覆盖物的位置\n',
            ' * @return {Point} 该覆盖物的经纬度坐标\n',
            ' */\n',
            'textIcon.getPosition();\n',
            ' \n',
            '/* 获取该覆盖物上的文字\n',
            ' * @return {String} 该覆盖物上的文字\n',
            ' */\n',
            'textIcon.getText();\n',
            ' \n',
            '/* 由文字信息获取风格数组的对应索引值。 内部默认的对应函数为文字转换为数字除以10的结果，\n',
            ' * 比如文字8返回索引0，文字25返回索引2. 如果需要自定义映射关系，请覆盖该函数。\n',
            ' * @param {String} text 文字\n',
            ' * @param {Array} styles 一组图标风格\n',
            ' * @return {Number} 对应的索引值\n',
            ' */\n',
            'textIcon.getStyleByText(text, styles)\n',
            ' \n',
            '/* 继承Overlay的intialize方法，自定义覆盖物时必须\n',
            ' * @param {Map} map BMap.Map的实例化对象\n',
            ' * @return {HTMLElement} 返回覆盖物对应的HTML元素\n',
            ' */\n',
            'textIcon.initialize(map)\n',
            ' \n',
            '/* 设置该覆盖物的位置\n',
            ' * @param {Point} position 要设置的经纬度坐标\n',
            ' */\n',
            'textIcon.setPosition(position)\n',
            ' \n',
            '/* 设置该覆盖物上的文字\n',
            ' * @param {String} text 要设置的文字，通常是字母A-Z或数字0-9\n',
            ' */\n',
            'textIcon.setText(text)\n',
            ' \n',
        ],
        eveDet:[
            '/* 当鼠标点击该覆盖物时会触发该事件\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"type : {String} 事件类型 \n',
            ' *\t"target：{BMapLib.TextIconOverlay} 事件目标\n',
            ' * }\n',
            ' */\n',
            'myTextIconOverlay.addEventListener("click", function(e) { \n',
            '\talert(e.target);\n',
            '});\n',
            ' \n',
            '/* 当鼠标进入该覆盖物区域时会触发该事件\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"type : {String} 事件类型 \n',
            ' *\t"target：{BMapLib.TextIconOverlay} 事件目标 \n',
            ' *\t"point : {BMap.Point} 最新添加上的节点BMap.Point对象\n',
            ' *\t"pixel：{BMap.pixel} 最新添加上的节点BMap.Pixel对象\n',
            ' * }\n',
            ' */\n',
            'myTextIconOverlay.addEventListener("mouseout", function(e) { \n',
            '\talert(e.point);\n',
            '});\n',
            ' \n',
            '/* 当鼠标进入该覆盖物区域时会触发该事件\n',
            ' * @param {Event Object} e 回调函数会返回event参数，包括以下返回值:\n',
            ' * {\n',
            ' *\t"type : {String} 事件类型 \n',
            ' *\t"target：{BMapLib.TextIconOverlay} 事件目标 \n',
            ' *\t"point : {BMap.Point} 最新添加上的节点BMap.Point对象\n',
            ' *\t"pixel：{BMap.pixel} 最新添加上的节点BMap.Pixel对象\n',
            ' * }\n',
            ' */\n',
            'mkrTool.addEventListener("mouseover", function(e) { \n',
            '\talert(e.point);\n',
            '});\n',
            ' \n'
        ]
    },
    {
        className: 'BMapLib.RectangleZoom',
        classDis: '拉框缩放类，实现拉框缩放效果的入口。 实例化该类后，即可调用该类提供的open 方法开启拉框缩放状态。 ',
        classCon: 'BMapLib.RectangleZoom(map, opts)',
        classConDis: 'RectangleZoom类的构造函数',
        functions: [
            {
                funName: 'close()',
                funBack: '无',
                funDis: '结束拉框放大状态'
            },
            {
                funName: 'getCursor()',
                funBack: '无',
                funDis: '获取鼠标样式'
            },
            {
                funName: 'open()',
                funBack: '无',
                funDis: '开启拉框缩放状态。 在缩放效果结束的时候，会调用Animation库(见源文件，闭包，不对外开放) 来实现一些小动画'
            },
            {
                funName: 'setCursor(cursor)',
                funBack: '无',
                funDis: '设置鼠标样式'
            },
            {
                funName: 'setFillColor(color)',
                funBack: '无',
                funDis: '设置填充色'
            },
            {
                funName: 'setLineStroke(width)',
                funBack: '无',
                funDis: '设置线粗细'
            },
            {
                funName: 'setLineStyle(style)',
                funBack: '无',
                funDis: '设置线样式'
            },
            {
                funName: 'setOpacity(opacity)',
                funBack: '无',
                funDis: '设置透明度'
            },
            {
                funName: 'setStrokeColor(color)',
                funBack: '无',
                funDis: '设置线颜色'
            }
        ],
        events: [],
        example:[
            '/* 参数:\n',
            ' * {Map} map Baidu map的实例对象\n',
            ' * {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：\n',
            ' * {\n',
            ' *\t"zoomType" : {Number} 拉框后放大还是缩小的设置\n',
            ' *\t"followText" : {String} 开启拉框缩放状态后，鼠标跟随的文字\n',
            ' *\t"strokeWeight" : {Number} 遮盖层外框的线宽\n',
            ' *\t"strokeColor" : {String} 遮盖层外框的颜色\n',
            ' *\t"opacity" : {Number} 遮盖层的透明度\n',
            ' *\t"cursor" : {String} 鼠标样式\n',
            ' *\t"autoClose" : {Boolean} 是否在每次操作后，自动关闭拉框缩放状态}\n',
            ' * }\n',
            ' */\n',
            'var myRectangleZoomObject = new BMapLib.RectangleZoom(map, {strokeWeight : 2});\n'
        ],
        funcDet:[
            '/* 结束拉框放大状态\n',
            ' */\n',
            'myRectangleZoomObject.close();\n',
            ' \n',
            '/* 获取鼠标样式\n',
            ' * @return {String} 鼠标样式\n',
            ' */\n',
            'myRectangleZoomObject.getCursor();\n',
            ' \n',
            '/* 开启拉框缩放状态\n',
            ' * @return {Boolean} 成功开启拉框缩放状态时，返回true；否则无返回值\n',
            ' */\n',
            'myRectangleZoomObject.open();\n',
            ' \n',
            '/* 设置鼠标样式\n',
            ' * @param {String} cursor 设置的鼠标样式\n',
            ' */\n',
            'myRectangleZoomObject.setCursor("crosshair");\n',
            ' \n',
            '/* 设置填充色\n',
            ' * @param {String} color 设置的遮盖层填充色\n',
            ' */\n',
            'myRectangleZoomObject.setFillColor("#F0F");\n',
            ' \n',
            '/* 设置线粗细\n',
            ' * @param {Number} width 设置的遮盖层外框线宽\n',
            ' */\n',
            'myRectangleZoomObject.setLineStroke(3);\n',
            ' \n',
            '/* 设置线样式\n',
            ' * @param {String} style 设置的遮盖层外框样式\n',
            ' */\n',
            'myRectangleZoomObject.setLineStyle("dashed");\n',
            ' \n',
            '/* 设置透明度\n',
            ' * @param {Number} opacity 设置的遮盖层透明度\n',
            ' */\n',
            'myRectangleZoomObject.setOpacity(0.5);\n',
            ' \n',
            '/* 设置线颜色\n',
            ' * @param {String} color 设置的遮盖层外框线色\n',
            ' */\n',
            'myRectangleZoomObject.setStrokeColor("#fff")\n',
            ' \n'
        ],
        eveDet:[]
    },
    {
        className: 'BMapLib.AreaRestriction',
        classDis: 'AreaRestriction类提供的都是静态方法，勿需实例化即可使用',
        classCon: 'BMapLib.AreaRestriction()',
        classConDis: 'AreaRestriction类，静态类，不用实例化',
        functions: [
            {
                funName: 'BMapLib.AreaRestriction.clearBounds()',
                funBack: '无',
                funDis: '清除对地图浏览区域限定的状态'
            },
            {
                funName: 'BMapLib.AreaRestriction.setBounds(map, bounds)',
                funBack: 'Boolean',
                funDis: '对可浏览地图区域的限定方法'
            }
        ],
        events: [],
        example:[
            '/*\n',
            ' * AreaRestriction类，静态类，不用实例化\n',
            ' */\n',
            'BMapLib.AreaRestriction()\n'
        ],
        funcDet:[
            '/* 清除对地图浏览区域限定的状态\n',
            ' */\n',
            '<static> BMapLib.AreaRestriction.clearBounds()\n',
            ' \n',
            '/* 对可浏览地图区域的限定方法\n',
            ' * @param {BMap} map map对象\n',
            ' * @param {BMap.Bounds} bounds 开发者需要限定的区域\n',
            ' * @return {Boolean} 完成了对区域的限制即返回true，否则为false\n',
            ' */\n',
            '<static> {Boolean} BMapLib.AreaRestriction.setBounds(map, bounds)\n'
        ],
        eveDet:[]
    },
    {
        className: 'BMapLib.GeoUtils',
        classDis: 'GeoUtils类的入口。 该类提供的都是静态方法，勿需实例化即可使用',
        classCon: 'BMapLib.GeoUtils()',
        classConDis: 'GeoUtils类，静态类，勿需实例化即可使用',
        functions: [
            {
                funName: 'BMapLib.GeoUtils.degreeToRad(Number)',
                funBack: 'Number',
                funDis: '将度转化为弧度'
            },
            {
                funName: 'BMapLib.GeoUtils.getDistance(Point, Point)',
                funBack: 'Number',
                funDis: '计算两点之间的距离,两点坐标必须为经纬度'
            },
            {
                funName: 'BMapLib.GeoUtils.getPolygonArea(polygon)',
                funBack: 'Number',
                funDis: '计算多边形面或点数组构建图形的面积,注意：坐标类型只能是经纬度，且不适合计算自相交多边形的面积'
            },
            {
                funName: 'BMapLib.GeoUtils.getPolylineDistance(polyline)',
                funBack: 'Number',
                funDis: '计算折线或者点数组的长度'
            },
            {
                funName: 'BMapLib.GeoUtils.isPointInCircle(point, circle)',
                funBack: 'Boolean',
                funDis: '判断点是否在圆形内'
            },
            {
                funName: 'BMapLib.GeoUtils.isPointInPolygon(point, polygon)',
                funBack: 'Boolean',
                funDis: '判断点是否多边形内'
            },
            {
                funName: 'BMapLib.GeoUtils.isPointInRect(point, bounds)',
                funBack: 'Boolean',
                funDis: '判断点是否在矩形内'
            },
            {
                funName: 'BMapLib.GeoUtils.isPointOnPolyline(point, polyline)',
                funBack: 'Boolean',
                funDis: '判断点是否在折线上'
            },
            {
                funName: 'BMapLib.GeoUtils.radToDegree(Number)',
                funBack: 'Number',
                funDis: '将弧度转化为度'
            }
        ],
        events: [],
        example:[
            '/*\n',
            ' * GeoUtils类，静态类，勿需实例化即可使用\n',
            ' */\n',
            'BMapLib.GeoUtils()\n'
        ],
        funcDet:[
            '/* 将度转化为弧度\n',
            ' * @param {Number} number 度\n',
            ' * @return {Number} 弧度\n',
            ' */\n',
            '<static>BMapLib.GeoUtils.degreeToRad(number)\n',
            ' \n',
            '/* 计算两点之间的距离,两点坐标必须为经纬度\n',
            ' * @param {Point} point1 点对象1\n',
            ' * @param {Point} point2 点对象1\n',
            ' * @return {Number} 两点之间距离，单位为米\n',
            ' */\n',
            '<static>BMapLib.GeoUtils.getDistance(point1, point2)\n',
            ' \n',
            '/* 计算多边形面或点数组构建图形的面积,注意：坐标类型只能是经纬度，且不适合计算自相交多边形的面积\n',
            ' * @{Polygon|Array} polygon 多边形面对象或者点数组\n',
            ' * @return {Number} 多边形面或点数组构成图形的面积\n',
            ' */\n',
            '<static>BMapLib.GeoUtils.getPolygonArea(polygon)\n',
            ' \n',
            '/* 计算折线或者点数组的长度\n',
            ' * @param {Polyline|Array} polyline 折线对象或者点数组\n',
            ' * @return {Number} 折线或点数组对应的长度\n',
            ' */\n',
            '<static>BMapLib.GeoUtils.getPolylineDistance(polyline)\n',
            ' \n',
            '/* 判断点是否在圆形内\n',
            ' * @param {Point} point 点对象\n',
            ' * @param {Circle} circle 圆形对象\n',
            ' * @return {Boolean} 点在圆形内返回true,否则返回false\n',
            ' */\n',
            '<static>BMapLib.GeoUtils.isPointInCircle(point, circle)\n',
            ' \n',
            '/* 判断点是否多边形内\n',
            ' * @param {Point} point 点对象\n',
            ' * @param {Polyline} polygon 多边形对象\n',
            ' * @return {Boolean} 点在多边形内返回true,否则返回false\n',
            ' */\n',
            ' <static>BMapLib.GeoUtils.isPointInPolygon(point, polygon)\n',
            ' \n',
            '/* 判断点是否在矩形内\n',
            ' * @param {Point} point 点对象\n',
            ' * @param {Bounds} bounds 矩形边界对象\n',
            ' * @return {Boolean} 点在矩形内返回true,否则返回false\n',
            ' */\n',
            ' <static>BMapLib.GeoUtils.isPointInRect(point, bounds)\n',
            ' \n',
            '/* 判断点是否在折线上\n',
            ' * @param {Point} point 点对象\n',
            ' * @param {Polyline} polygon 多边形对象\n',
            ' * @return {Boolean} 点在多边形内返回true,否则返回false\n',
            ' */\n',
            ' <static>BMapLib.GeoUtils.isPointOnPolyline(point, polyline)\n',
            ' \n',
            '/* 将弧度转化为度\n',
            ' * @param {Number} number 弧度\n',
            ' * @return {Number} 度\n',
            ' */\n',
            ' <static>BMapLib.GeoUtils.radToDegree(nubmer)\n',
            ' \n'
        ],
        eveDet:[]
    }
];
//上一个选择项
main.lastMenu = '';
$(function(){
    renderMenu();
    initEvent();
    initContent();
});

//构建菜单
function renderMenu() {
    var menuContent = '';
    $.each(main.menuData, function(i,n){
        menuContent += ' <div class="accordion-group">' 
                    + '<div class="accordion-heading">'
                    + '<a class="accordion-toggle" data-toggle="collapse" href="#collapse'+i+'">'
                    + n.className
                    + '</a>'
                    + '</div>'
                    + '<div id="collapse'+i+'" class="accordion-body collapse">'
                    + (n.classFunc ? '<div class="accordion-inner"><a href="#'+n.className+'">方法</a></div>':'')
                    + (n.classEvent ? '<div class="accordion-inner"><a href="#'+n.className+'">事件</a></div>':'')
                    + '</div>'
                    + '</div>';
    });
    $("#menu").append(menuContent);
    setTimeout(' $("#menu").affix({offset: {top:50, bottom: 20}});',10);

}

// 设置事件响应
function initEvent() {
    $(".accordion-toggle").click(function () {
        var me = this;
        changeClass(me);
    });
}

// 处理class改变
function changeClass(me) {
    $(".accordion-toggle").removeClass('activeCla');
    $(me).addClass('activeCla');
    $(main.lastMenu).collapse('hide');
    main.lastMenu = $(me.parentNode.parentNode.lastChild);
    window.location.href='#'+me.innerHTML;
}

// 初始化内容
function initContent() {
    var allContent = '';
    var contentItemArray = [];
    for(var i = 0; i < main.classData.length; i++) {
        var conItem = main.classData[i];
        contentItemArray.push(
            '<section id = "' + conItem.className + '">'
            + '<h1>' + conItem.className + '</h1>'
            + '<hr/>'
            + '<p>' + conItem.classDis + '</p>'
            + '<table class="table table-hover table-bordered">'
            + '<tr class="info">'
            + '<td class="cla">类</td>'              
            + '<td>描述</td>'
            + '</tr>'
            + '<tr>'
            + '<td>' + conItem.classCon + '</td>'
            + '<td>' + conItem.classConDis + '</td>'
            + '</tr>'
            + '</table>'
        );
        if (conItem.functions.length !==0 ) {
            contentItemArray.push(
                '<table class="table table-hover table-bordered">'
                + '<tr class="success" id="'+conItem.className+'.func">'
                + '<td class="func">方法</td>'
                + '<td class="ret">返回值</td>'
                + '<td>描述</td>'
                + '</tr>'
            );
            for(var j = 0; j < conItem.functions.length; j++) {
                var funItem = conItem.functions[j];
                contentItemArray.push(
                    '<tr>'
                    + '<td>' + funItem.funName + '</td>'
                    + '<td>' + funItem.funBack + '</td>'
                    + '<td>' + funItem.funDis + '</td>'
                    + '</tr>'
                );
            }
            contentItemArray.push(
                '</table>'
            );
        }
        if (conItem.events.length !==0 ) {
            contentItemArray.push(
                '<table class="table table-hover table-bordered">'
                + '<tr class="warning">'
                + '<td class="func">事件</td>'
                + '<td class="ret">参数</td>'
                + '<td>描述</td>'
                + '</tr>'
            );
            for(var j = 0; j < conItem.events.length; j++) {
                var eventItem = conItem.events[j];
                contentItemArray.push(
                    '<tr>'
                    + '<td>' + eventItem.eveName + '</td>'
                    + '<td>' + eventItem.evePara + '</td>'
                    + '<td>' + eventItem.eveDis + '</td>'
                    + '</tr>'
                );
            }
            contentItemArray.push(
                '</table>'
            );
        }
        contentItemArray.push(
            '<h4>参考示例</h4>'
            + '<pre class="prettyprint linenums">'
        );
        for (j = 0; j < conItem.example.length; j++) {
            contentItemArray.push(conItem.example[j]);
        }
        contentItemArray.push(
            '</pre>'
        );
        if (conItem.funcDet.length !== 0) {
            contentItemArray.push(
                '<h4>方法详述</h4>'
                + '<pre class="prettyprint linenums">'
            );
            for (j = 0; j < conItem.funcDet.length; j++) {
                contentItemArray.push(conItem.funcDet[j]);
            }
            contentItemArray.push(
                '</pre>'
            );
        }
        if (conItem.eveDet.length !== 0) {
            contentItemArray.push(
                '<h4>事件详述</h4>'
                + '<pre class="prettyprint linenums">'
            );
            for (j = 0; j < conItem.eveDet.length; j++) {
                contentItemArray.push(conItem.eveDet[j]);
            }
            contentItemArray.push(
                '</pre>'
            );
        }
    }
    allContent = contentItemArray.join(" ");
    $("#mainContent").append(allContent);
}