/**
 * @fileoverview 百度地图的轨迹播放类，对外开放。
 * 实现折线轨迹的“逐段增长”动画，并提供播放控制与变速能力。
 *
 * @author Baidu Map Api Group
 */

/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

(function () {
    var DEFAULT_DURATION = 10000;
    var DEFAULT_DELAY = 0;
    var DEFAULT_OVERALLVIEW = false;
    var DEFAULT_FOLLOWVIEW = true;
    var DEFAULT_FOLLOWVIEW_SMOOTHING = 0.18;
    // 视口跟随触发阈值（0~1）
    var DEFAULT_FOLLOWVIEW_EDGE_PADDING = 0.28;

    var PLAY = 1;
    var CANCEL = 2;
    var PAUSE = 3;

    function now() {
        return (window.performance && performance.now) ? performance.now() : Date.now();
    }

    /**
     * @exports TrackAnimation as BMapLib.TrackAnimation
     * @constructor
     * @param {BMap.Map} map 地图实例
     * @param {BMap.Polyline} polyline 折线实例
     * @param {Object} opts 配置
     * {
     *   duration: Number 动画时长(ms)
     *   delay: Number 延迟开始(ms)
     *   overallView: Boolean 是否在结束时 setViewport 展示整条轨迹（默认false）
     *   followView: Boolean 播放中是否跟随当前点移动视口（默认true）
     *   followViewSmoothing: Number 跟随平滑系数(0~1)
     *   followViewEdgePadding: Number 触发跟随的边缘留白比例(0~1)，越大越容易触发跟随（默认0.28）
     *   followViewPadding: Number（兼容）同 followViewEdgePadding
     *   onAnimateEnd: Function 动画结束回调
     * }
     */
    BMapLib.TrackAnimation = function (map, polyline, opts) {
        if (!map || !polyline) {
            return;
        }
        this._map = map;
        this._polyline = polyline;
        this._opts = {
            duration: DEFAULT_DURATION,
            delay: DEFAULT_DELAY,
            overallView: DEFAULT_OVERALLVIEW,
            followView: DEFAULT_FOLLOWVIEW,
            followViewSmoothing: DEFAULT_FOLLOWVIEW_SMOOTHING,
            followViewEdgePadding: DEFAULT_FOLLOWVIEW_EDGE_PADDING,
            onAnimateEnd: null
        };
        this._initOpts(opts);

        this._status = CANCEL;
        this._timer = null;
        this._delayTimer = null;
        this._startSeq = 0;

        this._startTime = 0;     // 动画起点（基准时间）
        this._pauseTime = 0;     // 暂停累计
        this._pauseAt = 0;       // 暂停时刻
        this._speedFactor = 1;   // 1为基准
        this._smoothCenterPx = null; // 平滑跟随：像素坐标中心

        this._totalPath = this._polyline.getPath() || [];
        this._expandPath = [];
        this._last2Points = [];
        this._buildExpandedPath();
    };

    BMapLib.TrackAnimation.prototype._initOpts = function (opts) {
        if (!opts) return;
        for (var p in opts) {
            if (opts.hasOwnProperty(p)) {
                this._opts[p] = opts[p];
            }
        }
        if (typeof this._opts.duration !== "number" || this._opts.duration <= 0) {
            this._opts.duration = DEFAULT_DURATION;
        }
        if (typeof this._opts.delay !== "number" || this._opts.delay < 0) {
            this._opts.delay = DEFAULT_DELAY;
        }
        if (typeof this._opts.followView !== "boolean") {
            this._opts.followView = DEFAULT_FOLLOWVIEW;
        }
        if (typeof this._opts.followViewSmoothing !== "number" || this._opts.followViewSmoothing <= 0 || this._opts.followViewSmoothing > 1) {
            this._opts.followViewSmoothing = DEFAULT_FOLLOWVIEW_SMOOTHING;
        }
        // 兼容旧字段 followViewPadding
        if (typeof this._opts.followViewEdgePadding === "undefined" && typeof this._opts.followViewPadding !== "undefined") {
            this._opts.followViewEdgePadding = this._opts.followViewPadding;
        }
        if (typeof this._opts.followViewEdgePadding !== "number" || this._opts.followViewEdgePadding < 0 || this._opts.followViewEdgePadding > 1) {
            this._opts.followViewEdgePadding = DEFAULT_FOLLOWVIEW_EDGE_PADDING;
        }
    };

    /**
     * 根据时长扩充路径：按段距离分配插值点，保证总点数接近duration/10
     */
    BMapLib.TrackAnimation.prototype._buildExpandedPath = function () {
        var path = this._totalPath || [];
        if (!path || path.length < 2) {
            this._expandPath = path ? path.slice(0) : [];
            return;
        }

        var totalNum = Math.max(2, Math.floor(this._opts.duration / 10));
        var length = path.length;

        var distances = [];
        var totalDistance = 0;
        for (var i = 1; i < length; i++) {
            var d = this._map.getDistance(path[i - 1], path[i]);
            distances.push(d);
            totalDistance += d;
        }

        // 极端情况：所有点重合
        if (!totalDistance || !isFinite(totalDistance)) {
            this._expandPath = path.slice(0);
            return;
        }

        var remaining = totalNum;
        var expand = [path[0]];
        for (var j = 1; j < length; j++) {
            // 最后一段吃掉剩余，减少误差
            var num;
            if (j === length - 1) {
                num = Math.max(1, remaining);
            } else {
                num = Math.max(1, Math.round(distances[j - 1] / totalDistance * totalNum));
            }
            remaining -= num;
            expand = expand.concat(this._interpolate(path[j - 1], path[j], num));
        }
        this._expandPath = expand;
    };

    /**
     * 线性插值
     * @param {BMap.Point} start
     * @param {BMap.Point} end
     * @param {number} num 插值点数量（>=1）
     */
    BMapLib.TrackAnimation.prototype._interpolate = function (start, end, num) {
        var result = [];
        if (!num || num <= 0) return result;
        for (var i = 1; i <= num; i++) {
            var p = new BMap.Point(
                (end.lng - start.lng) / num * i + start.lng,
                (end.lat - start.lat) / num * i + start.lat
            );
            result.push(p);
        }
        return result;
    };

    /**
     * 启动动画
     */
    BMapLib.TrackAnimation.prototype.start = function () {
        var me = this;
        if (!this._polyline || !this._map) return;

        // 刷新路径与插值（允许外部先setPolyline再start）
        this._totalPath = this._polyline.getPath() || [];
        this._buildExpandedPath();
        this.cancel(); // 保证幂等：清理旧状态
        var seq = ++this._startSeq;
        this._delayTimer = setTimeout(function () {
            // 若delay期间被cancel/再次start，则忽略这次启动
            if (seq !== me._startSeq) {
                return;
            }
            // 轨迹线从第一个点开始
            me._polyline.setPath(me._expandPath.slice(0, 1));
            me._status = PLAY;
            me._startTime = 0;
            me._pauseTime = 0;
            me._pauseAt = 0;
            me._smoothCenterPx = null;
            me._step(now());
        }, this._opts.delay);
    };

    /**
     * 终止动画并清理
     */
    BMapLib.TrackAnimation.prototype.cancel = function () {
        this._clearRAF();
        if (this._delayTimer) {
            clearTimeout(this._delayTimer);
            this._delayTimer = null;
        }
        this._startSeq++;
        this._status = CANCEL;
        this._startTime = 0;
        this._pauseTime = 0;
        this._pauseAt = 0;
        this._smoothCenterPx = null;
    };

    /**
     * 暂停动画
     */
    BMapLib.TrackAnimation.prototype.pause = function () {
        if (this._status !== PLAY) return;
        this._clearRAF();
        this._status = PAUSE;
        this._pauseAt = now();
    };

    /**
     * 继续动画
     */
    BMapLib.TrackAnimation.prototype.continue = function () {
        if (this._status !== PAUSE) return;
        var t = now();
        this._pauseTime += (t - this._pauseAt);
        this._pauseAt = 0;
        this._status = PLAY;
        this._step(t);
    };

    /**
     * rAF 驱动的逐步绘制
     */
    BMapLib.TrackAnimation.prototype._step = function (timestamp) {
        if (this._status === CANCEL) {
            this._startTime = 0;
            return;
        }
        if (!this._startTime) {
            this._startTime = timestamp;
        }
        var t = timestamp - this._pauseTime;
        var percent = (t - this._startTime) / this._opts.duration;

        if (percent < 0) percent = 0;
        if (percent > 1) percent = 1;

        var end = Math.max(1, Math.round(this._expandPath.length * percent));
        var currentPath = this._expandPath.slice(0, end);
        this._last2Points = currentPath.slice(-2);
        this._polyline.setPath(currentPath);

        // 播放中视口跟随：采用“安全区 + 像素空间平滑”避免抖动
        if (this._opts.followView && this._map && this._expandPath.length && typeof this._map.pointToPixel === "function" && typeof this._map.pixelToPoint === "function") {
            var last = currentPath[currentPath.length - 1];
            if (last) {
                var size = this._map.getSize && this._map.getSize();
                if (size && size.width && size.height) {
                    var trackPx = this._map.pointToPixel(last);
                    // 当前视口中心（像素）
                    var centerPt = this._map.getCenter && this._map.getCenter();
                    var centerPx = centerPt ? this._map.pointToPixel(centerPt) : null;
                    if (trackPx && centerPx) {
                        // 安全区：点在中心一定范围内不触发跟随，减少微抖
                        var pad = this._opts.followViewEdgePadding;
                        var halfW = size.width / 2;
                        var halfH = size.height / 2;
                        var safeW = halfW * (1 - pad);
                        var safeH = halfH * (1 - pad);
                        var dx = trackPx.x - centerPx.x;
                        var dy = trackPx.y - centerPx.y;

                        if (Math.abs(dx) > safeW || Math.abs(dy) > safeH) {
                            if (!this._smoothCenterPx) {
                                this._smoothCenterPx = {x: centerPx.x, y: centerPx.y};
                            }
                            // 目标中心：把点拉回到安全区边缘（而不是直接居中），更稳
                            var targetCx = centerPx.x;
                            var targetCy = centerPx.y;
                            if (dx > safeW) targetCx += (dx - safeW);
                            if (dx < -safeW) targetCx += (dx + safeW);
                            if (dy > safeH) targetCy += (dy - safeH);
                            if (dy < -safeH) targetCy += (dy + safeH);

                            var a = this._opts.followViewSmoothing;
                            this._smoothCenterPx.x += (targetCx - this._smoothCenterPx.x) * a;
                            this._smoothCenterPx.y += (targetCy - this._smoothCenterPx.y) * a;

                            var newCenter = this._map.pixelToPoint(new BMap.Pixel(this._smoothCenterPx.x, this._smoothCenterPx.y));
                            if (newCenter && typeof this._map.setCenter === "function") {
                                this._map.setCenter(newCenter);
                            }
                        } else {
                            // 回到安全区内，释放平滑状态，避免拖尾
                            this._smoothCenterPx = null;
                        }
                    }
                }
            }
        }

        if (percent < 1) {
            this._timer = this._requestFrame(this._step.bind(this));
        } else {
            this._startTime = 0;
            this._pauseTime = 0;
            this._pauseAt = 0;
            this._status = CANCEL;
            // 结束后展示全量轨迹
            if (this._opts.overallView && this._map && this._totalPath && this._totalPath.length >= 2 && this._map.setViewport) {
                this._map.setViewport(this._totalPath);
            }
            typeof this._opts.onAnimateEnd === "function" && this._opts.onAnimateEnd();
        }
    };

    BMapLib.TrackAnimation.prototype._requestFrame = function (cb) {
        if (window.requestAnimationFrame) {
            return window.requestAnimationFrame(cb);
        }
        return window.setTimeout(function () { cb(now()); }, 16);
    };

    BMapLib.TrackAnimation.prototype._cancelFrame = function (id) {
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(id);
            return;
        }
        window.clearTimeout(id);
    };

    BMapLib.TrackAnimation.prototype._clearRAF = function () {
        if (this._timer) {
            this._cancelFrame(this._timer);
            this._timer = null;
        }
    };

    /**
     * 设置持续时间(ms)
     */
    BMapLib.TrackAnimation.prototype.setDuration = function (duration) {
        if (typeof duration !== "number" || duration <= 0) return;
        this._opts.duration = duration;
        this._buildExpandedPath();
    };

    BMapLib.TrackAnimation.prototype.getDuration = function () {
        return this._opts.duration;
    };

    /**
     * 设置速度因子（1为基准，>1加速，<1减速）
     * 通过调整duration，并修正当前进度对应的起点时间，保证不断档
     */
    BMapLib.TrackAnimation.prototype.setSpeed = function (speedFactor) {
        if (typeof speedFactor !== "number" || speedFactor <= 0) return;
        var oldDuration = this._opts.duration;
        var newDuration = oldDuration * (1 / speedFactor);

        // 播放中/暂停中需要保持当前进度不跳变
        if ((this._status === PLAY || this._status === PAUSE) && this._startTime) {
            var t = (this._status === PAUSE && this._pauseAt) ? this._pauseAt : now();
            var effective = t - this._pauseTime;
            var percent = (effective - this._startTime) / oldDuration;
            if (percent < 0) percent = 0;
            if (percent > 1) percent = 1;
            this._startTime = effective - percent * newDuration;
        }

        this._speedFactor = speedFactor;
        this.setDuration(newDuration);
    };

    BMapLib.TrackAnimation.prototype.getSpeed = function () {
        return this._speedFactor || 1;
    };

    /**
     * 更新折线（不自动start）
     */
    BMapLib.TrackAnimation.prototype.setPolyline = function (polyline) {
        if (!polyline) return;
        this._polyline = polyline;
        this._totalPath = polyline.getPath() || [];
        this._buildExpandedPath();
    };

    BMapLib.TrackAnimation.prototype.getPolyline = function () {
        return this._polyline;
    };

    /**
     * 获取最后两个点（用于外部定位/跟随）
     */
    BMapLib.TrackAnimation.prototype.getLastPoint = function () {
        return this._last2Points.slice(0);
    };
})();

