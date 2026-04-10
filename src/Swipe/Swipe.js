/**
 * @fileoverview Swipe卷帘对比
 * 支持两张 BMap.Map 叠加显示，通过拖拽中线裁剪左右显示区域，并同步两张地图的中心与缩放。
 */
let BMapLib = window.BMapLib || {};

const prefix = 'BMapLib';

class Swipe {
    /**
     * @param {BMap.Map} mapA - 左侧地图
     * @param {BMap.Map} mapB - 右侧地图
     * @param {HTMLElement} wrapper - 外层容器（需包含两张地图的容器节点）
     * @param {Object} [options]
     * @param {number} [options.initialX] - 初始分割线位置（px，相对于 wrapper 左侧）；默认居中
     */
    constructor(mapA, mapB, wrapper, options = {}) {
        if (!mapA || !mapB || !wrapper) {
            throw new Error('BMapLib.Swipe: mapA, mapB, wrapper are required');
        }
        this._mapA = mapA;
        this._mapB = mapB;
        this._wrapper = wrapper;
        this._options = options || {};

        this._wrapperRect = null;
        this._centerX = 0;
        this._wrapperWidth = 0;

        this._dragging = false;
        this._lastX = 0;

        // 同步保护与节流
        this._isSyncingFrom = null;
        this._rafSyncId = 0;
        this._pendingSync = null;

        this._initDom();

        this._syncMapA = this._syncMapA.bind(this);
        this._syncMapB = this._syncMapB.bind(this);
        this._onSync();
    }

    _initDom() {
        this._swipeControlDiv = document.createElement('div');
        this._swipeControlDiv.className = `${prefix}-swipe`;

        this._swipeBtn = document.createElement('div');
        this._swipeBtn.className = `${prefix}-swipe-btn`;
        this._swipeControlDiv.appendChild(this._swipeBtn);

        this._onSwipeStart = this._onSwipeStart.bind(this);
        this._onSwipeMove = this._onSwipeMove.bind(this);
        this._onSwipeEnd = this._onSwipeEnd.bind(this);

        this._swipeBtn.addEventListener('mousedown', this._onSwipeStart);

        this._wrapper.appendChild(this._swipeControlDiv);

        this._recalcWrapper();
        const initX =
            typeof this._options.initialX === 'number'
                ? this._options.initialX
                : Math.floor(this._wrapperWidth / 2);
        this._setX(initX);
    }

    _recalcWrapper() {
        this._wrapperRect = this._wrapper.getBoundingClientRect();
        this._centerX = this._wrapperRect.left;
        this._wrapperWidth = this._wrapperRect.width;
    }

    _onSwipeStart(e) {
        this._dragging = true;
        this._recalcWrapper();
        document.addEventListener('mousemove', this._onSwipeMove);
        document.addEventListener('mouseup', this._onSwipeEnd);
        if (e && e.preventDefault) e.preventDefault();
    }

    _onSwipeMove(e) {
        if (!this._dragging) return;
        const x = e.clientX - this._centerX;
        this._setX(x);
    }

    _onSwipeEnd() {
        this._dragging = false;
        document.removeEventListener('mousemove', this._onSwipeMove);
        document.removeEventListener('mouseup', this._onSwipeEnd);
    }

    _setX(x) {
        this._recalcWrapper();
        const clamped = Math.max(0, Math.min(this._wrapperWidth, x));
        this._lastX = clamped;

        // 控制线位置：left:50% + translateX(...)
        const offset = clamped - this._wrapperWidth / 2;
        this._swipeControlDiv.style.transform = `translateX(${offset}px)`;

        this._updateClip(clamped);
    }

    _supportsClipPath() {
        const style = document.createElement('div').style;
        return 'clipPath' in style || 'webkitClipPath' in style;
    }

    _updateClip(x) {
        const containerA = this._mapA.getContainer();
        const containerB = this._mapB.getContainer();

        if (!containerA || !containerB) return;

        // 优先clip-path（现代浏览器），不支持则回退到clip:rect()
        if (this._supportsClipPath()) {
            const clipA = `polygon(0 0, ${x}px 0, ${x}px 100%, 0 100%)`;
            const clipB = `polygon(${x}px 0, 100% 0, 100% 100%, ${x}px 100%)`;
            containerA.style.clipPath = clipA;
            containerB.style.clipPath = clipB;
            containerA.style.webkitClipPath = clipA;
            containerB.style.webkitClipPath = clipB;
        } else {
            // clip只对position:absolute生效
            const w = this._wrapperWidth;
            containerA.style.clip = `rect(0px, ${x}px, auto, 0px)`;
            containerB.style.clip = `rect(0px, ${w}px, auto, ${x}px)`;
        }
    }

    _onSync() {
        // moving/zooming用于实时同步；zoomend/moveend作兜底
        this._mapA.addEventListener('moving', this._syncMapA);
        this._mapA.addEventListener('zooming', this._syncMapA);
        this._mapA.addEventListener('moveend', this._syncMapA);
        this._mapA.addEventListener('zoomend', this._syncMapA);

        this._mapB.addEventListener('moving', this._syncMapB);
        this._mapB.addEventListener('zooming', this._syncMapB);
        this._mapB.addEventListener('moveend', this._syncMapB);
        this._mapB.addEventListener('zoomend', this._syncMapB);
    }

    _offSync() {
        this._mapA.removeEventListener('moving', this._syncMapA);
        this._mapA.removeEventListener('zooming', this._syncMapA);
        this._mapA.removeEventListener('moveend', this._syncMapA);
        this._mapA.removeEventListener('zoomend', this._syncMapA);

        this._mapB.removeEventListener('moving', this._syncMapB);
        this._mapB.removeEventListener('zooming', this._syncMapB);
        this._mapB.removeEventListener('moveend', this._syncMapB);
        this._mapB.removeEventListener('zoomend', this._syncMapB);
    }

    _getEventMode() {
        const ev = window.event;
        const type = ev && ev.type;
        if (type === 'moving') return 'move';
        if (type === 'zooming') return 'zoom';
        if (type === 'moveend' || type === 'zoomend') return 'end';
        return 'end';
    }

    _scheduleSync(from, center, zoom, mode) {
        this._pendingSync = { from, center, zoom, mode };
        if (this._rafSyncId) return;
        const that = this;
        this._rafSyncId = requestAnimationFrame(function () {
            that._rafSyncId = 0;
            const p = that._pendingSync;
            that._pendingSync = null;
            if (!p) return;
            that._applySync(p.from, p.center, p.zoom, p.mode);
        });
    }

    _applySync(from, center, zoom, mode) {
        if (this._isSyncingFrom && this._isSyncingFrom !== from) {
            // 另一侧正在同步，丢弃本次（避免抖动/互相抢控）
            return;
        }

        this._isSyncingFrom = from;
        const target = from === 'A' ? this._mapB : this._mapA;

        try {
            // 关键：移动时只同步中心，避免centerAndZoom带来的动画/重算误差
            if (mode === 'move') {
                target.setCenter(center);
            } else if (mode === 'zoom') {
                // zooming阶段只同步zoom，减少“拖影”
                target.setZoom(zoom);
                target.setCenter(center);
            } else {
                // end：确保center/zoom全对齐
                target.setZoom(zoom);
                target.setCenter(center);
            }
        } finally {
            // 释放同步锁：下一帧再释放，避免同一事件循环内回调互相触发
            const that = this;
            setTimeout(function () {
                that._isSyncingFrom = null;
            }, 0);
        }
    }

    _syncMapA() {
        if (this._isSyncingFrom && this._isSyncingFrom !== 'A') return;
        const zoom = this._mapA.getZoom();
        const center = this._mapA.getCenter();
        const mode = this._getEventMode();
        this._scheduleSync('A', center, zoom, mode);
    }

    _syncMapB() {
        if (this._isSyncingFrom && this._isSyncingFrom !== 'B') return;
        const zoom = this._mapB.getZoom();
        const center = this._mapB.getCenter();
        const mode = this._getEventMode();
        this._scheduleSync('B', center, zoom, mode);
    }

    /**
     * 主动设置分割线位置（0~wrapper宽度 px）
     * @param {number} x
     */
    setPosition(x) {
        this._setX(x);
    }

    /**
     * 获取当前分割线位置
     * @returns {number}
     */
    getPosition() {
        return this._lastX;
    }

    destroy() {
        this._offSync();
        if (this._rafSyncId) {
            cancelAnimationFrame(this._rafSyncId);
            this._rafSyncId = 0;
        }
        if (this._swipeBtn) {
            this._swipeBtn.removeEventListener('mousedown', this._onSwipeStart);
        }
        this._onSwipeEnd();
        if (this._swipeControlDiv && this._swipeControlDiv.parentNode) {
            this._swipeControlDiv.parentNode.removeChild(this._swipeControlDiv);
        }
        // 清理裁剪
        const containerA = this._mapA && this._mapA.getContainer && this._mapA.getContainer();
        const containerB = this._mapB && this._mapB.getContainer && this._mapB.getContainer();
        if (containerA) {
            containerA.style.clipPath = '';
            containerA.style.webkitClipPath = '';
            containerA.style.clip = '';
        }
        if (containerB) {
            containerB.style.clipPath = '';
            containerB.style.webkitClipPath = '';
            containerB.style.clip = '';
        }
    }
}

BMapLib.Swipe = Swipe;

