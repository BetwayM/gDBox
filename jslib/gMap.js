/**
*@name gDBox.Map
*@class
*@param {String} containerId 容器ID
*@property {String} name 地图对象名称
*@property {String} mapTool 地图工具
*@gDBox.Map类
*@example 
*var gMap = new gDBox.Map('map');
*/

gDBox.Map = gClass.extend(
	/**
	* @lends gDBox.Map.prototype
	*/
{
	 /**
	 * 地图配置信息初始化_私有函数
	 * @param {String} containerId 容器ID
	 * @public
	 */
	init: function (containerId, options) {
		this._options = options || {}; 
		this._initContainer(containerId);
		this._initProp();
		this._initEvent();

		this.overLayer = new gDBox.Layer.Overlay('overlay');
		this.mLayer = new gDBox.Layer.Marker('markerLayer');
		this.addLayer(this.overLayer);
		this.addLayer(this.mLayer);
	},

	/**
	 * 地图容器初始化_私有函数
	 * @param {String} containerId 容器ID
	 * @public 
	 */
	_initContainer: function (containerId) {
		this._container = document.getElementById(containerId);
		this._container.innerHTML = '';
		this.w = this._options.w || this._container.clientWidth;
		this.h = this._options.h || this._container.clientHeight;
		this._container.style.overflow = 'hidden';
	},
	/**
	 * 获取地图容器
	 * @returns {*|jQuery|HTMLElement|_container}
	 */
	getContainer: function () {
		return this._container;
	},
	/**
	 * 获取地图宽高
	 * @returns {{w: *, h: *}}
	 */
	getSize: function () {
		return {
			w: this.w,
			h: this.h
		};
	},

	/**
	 * 为map对象注册监听事件
	 * @example
	 * map.events.on('boundsChanged',callback);
	 */
    events: {
        on: function(eventType, callback) {
           switch (eventType){
           	    case 'mouseDown':
           	        gDBox.Map.prototype._mouseDown_EX = function (pos) {
                  	    callback(pos);
                    }
           	    break;
           	    // 图形绘制完成执行回调
           	    case 'geometryDone':
           	        gDBox.Map.prototype._geometryDone_EX = function (type, result) {
                  	    callback(type, result);
                    }
           	    break;
           	    // 矢量图层数据选择完成回调函数
           	    case 'selected':
           	        gDBox.Map.prototype._fetureSelected_EX = function (result) {
                  	    callback(result);
                    }
           	    break;
           }
        }
    },
    _mouseDown_EX: function() {},
    _geometryDone_EX: function() {},
    _fetureSelected_EX: function() {},

	/**
	 * 地图对象属性初始化_私有函数
	 * @public
	 */
	_initProp: function () {
        this.mode = 'pan'; // 标记当前状态‘pan’,'drawRect'，‘select’  默认‘pan’地图浏览状态
        this.selectMode = 'up'; // 标记select在up事件结果还是在down时之行，默认在up
        this.dragging = false; // 标记当前状态是否处于平移状态

        this.oLayers = [];
        this.zoom = this._options.zoom || parseInt(1 * this.w); // 设置初始化zoom值

        this.cx = this._options.cx || 0; // 设置中心点坐标
		this.cy = this._options.cy || 0;

		this.startX = 0;
		this.startY = 0;
		this.startScrX = 0;
		this.startSrcY = 0;

		this.zoomScale = 1 / 40;
        this.zoomMax = this._options.zoomMax || 1000000000;
        this.zoomMin = this._options.zoomMin || 0;

		this.draw_rect_points = []; // 用来临时存储绘制矩形框geometry.point对象结合

	},

	_initEvent: function () {
		var gSelf = this;
		var doc = document.documentElement;
		var ctn = this._container;
		gDBox.Util.addEvtHandler(ctn, 'mousedown', mapMouseDownStart);
		gDBox.Util.addEvtHandler(ctn, 'mousemove', mapMouseMoveEvt);
		gDBox.Util.addEvtHandler(ctn, 'mouseup', mapMouseUpEvt);
		gDBox.Util.addEvtHandler(ctn, 'mousewheel', mapMouseWheelEvt);

        function mapMouseDownStart(e) {
        	var e = e ? e : window.event;
            if(!window.event) {e.preventDefault();}
            // 保存初始化坐标数据，不管平移还是绘制，都会需要
		    var mxy = gDBox.Util.getMouseXY(gSelf._container, e);
		    var wxy = gDBox.Util.screenToWorld(gSelf, mxy.x, mxy.y);
			var scrxy = gDBox.Util.getMousePos(e); // 为了计算dltx  dlty使用
			gSelf.startX = mxy.x;
			gSelf.startY = mxy.y;
			gSelf.startScrX = scrxy.x;
			gSelf.startScrY = scrxy.y;

            gSelf._mouseDown_EX && gSelf._mouseDown_EX(wxy);

            if(gSelf.mode == 'pan') {  // 说明地图浏览状态
                mapMouseDown_pan(e);
                document.onmousemove = function(e) {
                    mapMouseMove_pan(e);
                }
                document.onmouseup = function(e) {
                	document.onmousemove = null;
                    document.onmouseup = null;
                	mapMouseUp_pan(e);  
                }
            } else {  //非浏览模式（选择、绘制状态）
                mapMouseDownEvt(e);
            }
            
        }

        // 平移事件绑定
        function mapMouseDown_pan(e) {
		    gSelf.dragging = true;
			var oLayers = gSelf.getAllLayers();
			for (var i = 0; i < oLayers.length; i++) {
                oLayers[i].startLeft = gDBox.Util.delpx(oLayers[i]._layerContainer.style.left);
				oLayers[i].startTop = gDBox.Util.delpx(oLayers[i]._layerContainer.style.top);
			}
        }
        function mapMouseMove_pan(e) {
        	var mxy = gDBox.Util.getMouseXY(gSelf._container,e);
			var scrxy = gDBox.Util.getMousePos(e);
			if (gSelf.dragging) {
				var dltx = scrxy.x - gSelf.startScrX;
				var dlty = scrxy.y - gSelf.startScrY;
				var oLayers = gSelf.getAllLayers();
				if (Math.abs(dltx) > 0 || Math.abs(dlty) > 0) {
				    for (var i = 0; i < oLayers.length; i++) {
				    	oLayers[i].onDrag(dltx, dlty);
				    }
			    }
			}
        }
        function mapMouseUp_pan(e) {
        	var mxy = gDBox.Util.getMouseXY(gSelf._container, e);
			var scrxy = gDBox.Util.getMousePos(e);
            var dltx = scrxy.x - gSelf.startScrX;
			var dlty = scrxy.y - gSelf.startScrY;
			if (Math.abs(dltx) > 0 || Math.abs(dlty) > 0) {
				var scxy = gSelf.getScreenCenter();
			    var nscx = scxy.x - dltx; // 计算新的中心点坐标
			    var nscy = scxy.y - dlty;

			    var wxy = gDBox.Util.screenToWorld(gSelf, nscx, nscy);
			    gSelf.setCenter(wxy.x, wxy.y); // 重设中心点坐标
			    var oLayers = gSelf.getAllLayers();
			    var lyrs_len = oLayers.length;
			    for (var i = 0; i < lyrs_len; i++) { 
			    	oLayers[i].renew();
			    }
			}
            gSelf.dragging = false;
        }

        // 绘制事件绑定
        function mapMouseDownEvt(e) {
        	// 绘制或者编辑
        	var mxy = gDBox.Util.getMouseXY(gSelf._container, e);
			var wxy = gDBox.Util.screenToWorld(gSelf, mxy.x, mxy.y);
            switch(gSelf.mode) {
            	case "drawRect":
		            var startPoint = new gDBox.Geometry.Point(wxy.x, wxy.y);
		            gSelf.draw_rect_points.push(startPoint);
		        break;
		        case "select":
		            if (gSelf.selectMode === 'up') return; // 此时直接返回
                    selectEvent(wxy);
		        break;
            }
        }

        function selectEvent(wxy) {
        	var oLayers = gSelf.getAllLayers();
            var result = []; // 最终的选中要素
	        for (var i = 0; i < oLayers.length; i++) {
				result = result.concat(oLayers[i].getSelectTarget({x: wxy.x, y: wxy.y}));
			}
			gSelf._fetureSelected_EX && gSelf._fetureSelected_EX(result);
			return result;
        }

		function mapMouseMoveEvt(e) {
			// 绘制或者编辑
        	var mxy = gDBox.Util.getMouseXY(gSelf._container, e);
			var wxy = gDBox.Util.screenToWorld(gSelf, mxy.x, mxy.y);
            switch(gSelf.mode) {
            	case "drawRect":
				    if(gSelf.draw_rect_points.length > 0) {
					    gSelf.overLayer.clear();
					    var ctx = gSelf.overLayer.getCtx();
					    gDBox.Util.setStyle(ctx, gSelf.globalStyle);
					    var w = mxy.x - gSelf.startX;
					    var h = mxy.y - gSelf.startY;
					    ctx.strokeRect(gSelf.startX, gSelf.startY, w, h);
				    }
		        break;
            }
		}

		function mapMouseUpEvt(e) {
			var mxy = gDBox.Util.getMouseXY(gSelf._container, e);
			var wxy = gDBox.Util.screenToWorld(gSelf, mxy.x, mxy.y);
            switch(gSelf.mode) {
            	case "drawRect":
            	    var startPoint = gSelf.draw_rect_points[0];
            	    gSelf.draw_rect_points = [];
		            var endPoint = new gDBox.Geometry.Point(wxy.x, wxy.y);
		            var rectPoints = gDBox.Util.getRectPointsWithSAndE(startPoint, endPoint);
				    gSelf.overLayer.clear();
				    if (Math.abs(rectPoints[0].x - rectPoints[2].x) > 10 && Math.abs(rectPoints[0].y - rectPoints[2].y) > 10) {
                        gSelf._geometryDone_EX && gSelf._geometryDone_EX('rect', rectPoints);
				    } else {
                        if (gSelf.selectMode === 'down') return; //
                        var selectResult = selectEvent(wxy);
                        if (!selectResult.length) {
                            console.log('invalid points data: 不是有效矩形框...');
                        }
				    }
		        break;
            }
		}

		// var mousewheelTimer = null;
		function mapMouseWheelEvt(e) {
            gDBox.Util.preventDefault(e);
            // clearTimeout(mousewheelTimer);
			var mxy = gDBox.Util.getMouseXY(gSelf._container, e);
			var wxy = gDBox.Util.screenToWorld(gSelf, mxy.x, mxy.y);
            // mousewheelTimer = setTimeout(function () {
                if (gSelf.mode === 'pan') {
					var delta = e.wheelDelta || -e.detail; // 滑轮滑动距离
                    if (delta > 0) {
                        if (gSelf.zoom <= this.zoomMin) {
                            return;
						}
						// 说明用户执行zoomIn放大操作，执行中心点坐标计算
                        var halfwdltx = (wxy.x - gSelf.cx) * (1 - gSelf.zoomScale);
						var halfwdlty = (wxy.y - gSelf.cy) * (1 - gSelf.zoomScale);
                        var newcx = wxy.x - halfwdltx;
                        var newcy = wxy.y - halfwdlty;
						gSelf.setCenter(newcx, newcy);
                        gSelf.zoomIn(1);
                    }
					else {
                        if (gSelf.zoom >= this.zoomMax) {
                            return;
                        }
                        var halfwdltx = (wxy.x - gSelf.cx) / (1 - gSelf.zoomScale);
                        var halfwdlty = (wxy.y - gSelf.cy) / (1 - gSelf.zoomScale);
                        var newcx = wxy.x - halfwdltx;
                        var newcy = wxy.y - halfwdlty;
                        gSelf.setCenter(newcx, newcy);
                        gSelf.zoomOut(1);
                    }
                }
            // }, 1000);
        }
    },

	/**
	 * 添加图层
	 * @param {Object} layer
	 */
	addLayer: function (layer) {
		var oLayers = this.oLayers;
		if (!gDBox.Util.isObjInArray(oLayers, layer)) {
			layer.onAdd(this);
			oLayers.push(layer);
		}
	},

	/**
	 * 移除图层
	 * @param layer
	 */
	removeLayer: function (layer) {

	},

    // 设置可编辑图层
	setActiveLayer: function (layer) {
        var oLayers = this.getAllLayers();
        for (var i = 0; i < oLayers.length; i++) {
			if (oLayers[i] == layer) {
				oLayers[i].active();
			} else {
				oLayers[i].deActive();
			}
		}
	},

	/**
	 * 获取全部图层
	 * @returns {Array}
	 */
	getAllLayers: function () {
		return this.oLayers;
	},

	getNewZoom: function (type, num) {
        var i = num ? num : 6;
        var newZoom = this.zoom;
        while (i > 0) {
            if (type === 'zoomIn') {
                newZoom = newZoom - (newZoom * this.zoomScale);
            }
			else {
                newZoom = newZoom / (1 - this.zoomScale);
			}
            i--;
		}
		return newZoom;
    },

	/**
	 * 视野放大操作
	 */
	zoomIn: function (num) {
		if (this.zoom <= this.zoomMin) {
			return;
		}
        var oLayers = this.getAllLayers();
		var newZoom = this.getNewZoom('zoomIn', num);
        this.zoom = newZoom;
        for (var i = 0; i < oLayers.length; i++) {
            oLayers[i].zoomIn();
        }
    },

	/**
	 * 视野缩小操作
	 */
	zoomOut: function (num) {
		if (this.zoom >= this.zoomMax) {
			return;
		}
        var oLayers = this.getAllLayers();
        var newZoom = this.getNewZoom('zoomOut', num);
        this.zoom = newZoom;
        for (var i = 0; i < oLayers.length; i++) {
            oLayers[i].zoomOut();
        }
    },
	/**
	 * 设置地图状态_私有函数
	 *  @param mode
	 */
	setMode: function (mode, style) {
		this.mode = mode;
		this.globalStyle = style || new gDBox.Style({});
	},

	getMode: function () {
        return this.mode;
	},

    deSelect: function () {
    	// 首先清空矢量层上选中态数据
    	var oLayers = this.getAllLayers();
        for (var i = 0; i < oLayers.length; i++) {
			oLayers[i].deSelect();
		}
		// 其次清空overlay 和 markerLayer
		this.overLayer.clear();
		// 清空临时矩形数组
		this.draw_rect_points = [];

    },

	/**
	 * 设定中心点
	 * @param cx
	 * @param cy
	 */
	setCenter: function (cx, cy) {
		this.cx = cx;
		this.cy = cy;
	},
	getCenter: function () {
		return {
			x: this.cx,
			y: this.cy
		}
	},
	getScreenCenter: function () {
		return {
			x: this.w / 2,
			y: this.h / 2
		}
	},
	setCenter: function (cx, cy) {
		this.cx = cx;
		this.cy = cy;
	},
	destroy: function() {
		this._container.innerHTML = '';
		// 然后解除事件绑定
		var ctn = this._container;
		gDBox.Util.removeEvtHandler(ctn, 'mousedown');
		gDBox.Util.removeEvtHandler(ctn, 'mousemove');
		gDBox.Util.removeEvtHandler(ctn, 'mouseup');
		gDBox.Util.removeEvtHandler(ctn, 'mousewheel');
	}
});