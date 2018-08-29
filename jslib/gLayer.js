 /**********gDBox的Control——Layer图层  信息****************/
gDBox.Layer = gClass.extend({
	init: function (id, options) {
		this.id = id;
		this.visible = true;
		this.options = {
			opacity: 1.0,
			zIndex: 0
		};
	},
	/**
	 * 添加图层时触发
	 * @param map 地图对象
	 */
	onAdd: function (map) {
		var self = this;
		this._map = map;
		this._container = map.getContainer();
		var size = map.getSize();
		this._initLayerContainer(this.id, size.w, size.h);
		this._initProp(map);
		this._initParams(map);
		this._container.appendChild(this._layerContainer);
		this.setzIndex();
		this.setOpacity(this.options.opacity);
	},
	/**
	 * 移除图层时触发
	 * @param map 地图对象
	 */
	onRemove: function (map) {

	},
	/**
	 * 属性初始化
	 * @param map
	 * @private
	 */
	_initProp: function (map) {
        this.deActive(); // 默认图层为非激活状态
	},
	/**
	 * 参数初始化
	 * @param map
	 * @private
	 */
	_initParams: function (map) {

	},
	/**
	 * 拖动地图时触发
	 * @param dltx x方向变化量
	 * @param dlty y方向变化量
	 */
	onDrag: function (dltx, dlty) {
		this._layerContainer.style.left = this.startLeft + dltx + 'px';
		this._layerContainer.style.top = this.startTop + dlty + 'px';
	},
	zoomIn: function () {
		this.renew();
	},
	zoomOut: function () {
		this.renew();
	},
	zoomTo: function () {
		this.renew();
	},
	/**
	 * 刷新地图时触发
	 */
	renew: function () {
    	this._layerContainer.style.left = 0 + 'px';
    	this._layerContainer.style.top = 0 + 'px';
	},

	/**
	 * 获取容器宽高
	 * @returns {{w: *, h: *}}
	 */
	getSize: function () {
		return {
			w: this._layerContainer.clientWidth,
			h: this._layerContainer.clientHeight
		};
	},
	/**
	 * 获取屏幕中心点
	 * @returns {{x: Number, h: Number}}
	 */
	getScreenCenter: function () {
		return {
			x: parseInt(this._layerContainer.clientWidth / 2),
			y: parseInt(this._layerContainer.clientHeight / 2)
		};
	},
	getMap: function () {
		return this._map;
	},
	/**
	 * 获取图层容器
	 * @returns {*}
	 */
	getLayerContainer: function () {
		return this._layerContainer;
	},
	/**
	 * 设置zIndex值
	 */
	setzIndex: function () {
		if (!isNaN(this.options.zIndex)) {
			this._layerContainer.style.zIndex = this.options.zIndex;
		}
	},
	setOpacity: function (val) {
		this.getLayerContainer().style.opacity = val;
	},
	/**
	 * 图层resize操作
	 */
	resize: function () {
		this._layerContainer.style.width = this._map.w + 'px';
		this._layerContainer.style.height = this._map.h + 'px';
	},
	// 设置激活图层（目前只针对矢量图层）
	active: function () {
        if (this.oClass !== 'featureLayer') return;
        this.activeStatus = true;
	},
    // 取消当前图层的激活状态
	deActive: function () {
        this.activeStatus = false;
	},
    // 获取选中的目标元素
	getSelectTarget: function () {
		return [];
	},
	// 针对矢量层所有元素选中态取消
	deSelect: function () {

	}

});

gDBox.Layer.Image = gDBox.Layer.extend({
	init: function (id, src, size, options) {
		this._super(id, options);
		this._src = src;
		this._size = size;
		this.oClass = "imgLayer";
	},
	/**
	 * 请求参数初始化
	 * @private
	 */
	_initParams: function (map) {

	},
	/**
	 * 对象属性初始化
	 * @private
	 */
	_initProp: function (map) {
		this._super();
		if (!this._mapImg) {
			this._mapImg = new Image();
		}
		this._mapImg.style.position = 'absolute';
		this._mapImg.src = this._src;
		this._mapImg.onmousedown = function(e){
		    e.preventDefault()
		};
		this._layerContainer.appendChild(this._mapImg);
        this.renew();
	},
	/**
	 * 图层容器初始化
	 * @param id 图层id
	 * @param w 地图容器宽
	 * @param h 地图容器高
	 * @private
	 */
	_initLayerContainer: function (id, w, h) {
		var div = gDBox.Util.createDiv(id, w, h, true);
		div.style.zIndex = 2;
		this._layerContainer = div;
	},
	/**
	 * 添加图层时触发
	 * @param map 地图对象
	 */
	onAdd: function (map) {
        this._super(map);
	},

	zoomTo: function () {
		
	},



	/**
	 * 刷新地图
	 */
	renew: function () {
		this._super();
		var size = this._map.getSize();
		// 根据zoom值计算图片大小，因为涉及图片缩放
		var scale = this._map.zoom / size.w; // 计算缩放比例
		this._mapImg.width = this._size.w / scale;
		// this._mapImg.height = size.h / scale;
		// 计算_mapImg的left\top值
		var sxyLeftTop = gDBox.Util.worldToScreen(this._map, -1 * this._size.w / 2, this._size.h / 2);
		this._mapImg.style.left = sxyLeftTop.x + 'px';
		this._mapImg.style.top = sxyLeftTop.y + 'px';
	},
	resize: function () {
		
	},

	refresh:function (){ //重读数据库 
		
	}
});
gDBox.Layer.Feature = gDBox.Layer.extend({
	init: function (id, options) {
		this._super(id, options);
		// 设置layer全局样式
		var defaultStyle = new gDBox.Style({});
		this.style = defaultStyle;
		this._opacity = (options && options.transparent) ? options.transparent : false;
		this.oClass = 'featureLayer';
	},
	/**
	 * 图层容器初始化
	 * @param id
	 * @param w
	 * @param h
	 * @private
	 */
	_initLayerContainer: function (id, w, h) {
		var canvas = gDBox.Util.createCanvas(id, w, h, true);
		this._layerContainer = canvas;
		this._ctx = canvas.getContext('2d');
		this._layerContainer.style.left="0px";
		this._layerContainer.style.top="0px";
	},

	_initProp: function (map) {
		this._super();
	},

	/**
	 * 添加图层时触发（重写父类onAdd函数）
	 * @param map
	 */
	onAdd: function (map) {
		this._map = map;
		var size = map.getSize();
		var container = this._map.getContainer();
		this._initLayerContainer(this.id, size.w, size.h);
		container.appendChild(this._layerContainer);
		this.setzIndex();
		this.oFeatures = [];
	},

	/**
	 * 添加要素
	 * @param feature
	 */
	addFeature: function (feature) {
		var oFeatures = this.getAllFeatures();
		if (!gDBox.Util.isInArray(oFeatures, feature)) {
			oFeatures.push(feature);
			feature.onAdd(this);
		}
	},

    // 获取选中的目标元素
    getSelectTarget: function (point) {
    	var result = [];
    	if (!this.activeStatus) return result;
        var isFeatureSelected = false;
        var oFeatures = this.getAllFeatures();
		for (var i = (oFeatures.length - 1); i >= 0; i--) {
        	oFeatures[i].select = false; // 为每个元素添加是否选中标示
			if (gDBox.Util.pointInPoly(point, oFeatures[i].points) && !isFeatureSelected) {
				isFeatureSelected = true;
				oFeatures[i].select = true;
                result.push(oFeatures[i]);
			}
		}
		this.renew(); // 执行本图层数据重绘制
		return result.length ? [result[0]] : result;
    },

    deSelect: function () {
        var oFeatures = this.getAllFeatures();
        for (var i = 0; i < oFeatures.length; i++) {
        	oFeatures[i].select = false; // 为每个元素添加是否选中标示
		}
		this.renew(); // 执行本图层数据重绘制
	},
	
	/**
	 * 要素置空
	 */
	removeAllFeatures: function () {
		this.oFeatures = [];
		this.renew();
	},

	/**
	 * 移除要素
	 * @param feature
	 */
	removeFeature: function (feature) {
		var oFeature = [];
		for (var i = 0, a = 0; i < this.oFeatures.length; i++) {
			if (this.oFeatures[i] != feature) {
				oFeature[a] = this.oFeatures[i];
				a++;
			} else {
				feature.onRemove(this);
			}
		}
		this.oFeatures = oFeature;
		var map = this.getMap();
		this.renew();
	},

	/**
	 * 绘制要素
	 */
	draw: function () {
		var oFeatures = this.getAllFeatures();
		for (var i = 0; i < oFeatures.length; i++) {
			oFeatures[i].onDraw(this);
		}
	},

	/**
	 * 刷新图层
	 */
	renew: function () {
		this._super();
		this.clear();
		this.draw();
	},

	resize: function () {
		this._super();
		this._layerContainer.width = this._map.w;
		this._layerContainer.height = this._map.h;
		this.renew();
	},

	/**
	 * 清空画布
	 */
	clear: function () {
		var canvas = this.getLayerContainer();
		this._ctx.clearRect(0, 0, canvas.width, canvas.height);
	},

	/**
	 * 获取要素
	 * @returns {Array}
	 */
	getAllFeatures: function () {
		return this.oFeatures;
	},

	/**
	 * 获取画布上下文
	 * @returns {*}
	 */
	getCtx: function () {
		return this._ctx;
	}
});

 /**
 * 覆盖层
 * @type {*|void}
 */
gDBox.Layer.Overlay = gDBox.Layer.Feature.extend({
	init: function (id, options) {
		this._super(id, options);
		this.options = options || {
			opacity: 1.0,
			zIndex: 10
		};
		this.oClass = 'overlayLayer';
	},

	setStyle:function (style) {
        this.style = style;
	},

	/**
	 * 样式初始化
	 */
	initStyle: function () {
		var ctx = this.getCtx();
		ctx.strokeStyle = 'green';
		ctx.fillStyle = 'green';
		this._layerContainer.style.left="0px";
		this._layerContainer.style.top="0px";
		ctx.gloablAlpha = 0.7;
	},
	onAdd: function (map) {
		this._super(map);
		this.initStyle();
	},
	resize: function () {
		this._super();
		this._layerContainer.width = this._map.w;
		this._layerContainer.height = this._map.h;
		this.renew();
	}
});

/**
 * 标记层
 * @type {*|void}
 */
gDBox.Layer.Marker = gDBox.Layer.extend({
	init: function (id, options) {
		this._super(id, options);
		this.options = options || {
			opacity: 1.0,
			zIndex: 20
		};
		this.id = id;
		this.oClass = 'markerLayer';
		this.oMarkers = [];
	},
	_initLayerContainer: function (id, w, h) {
		var div = gDBox.Util.createDiv(id, w, h, true);
		this._layerContainer = div;
	},
	addMarker: function (marker) {
		if (!gDBox.Util.isInArray(this.oMarkers, marker)) {
			this.oMarkers.push(marker);
			marker.onAdd(this);
		}
	},
	removeMarker: function (marker) {
		var oMarker = [];
		for (var i = 0, a = 0; i < this.oMarkers.length; i++) {
			if (this.oMarkers[i] != marker) {
				oMarker[a] = this.oMarkers[i];
				a++;
			} else {
				this.oMarkers[i].onRemove(this);
			}
		}
		this.oMarkers = oMarker;
		this.renew();
	},
	getAllMarkers: function () {
		return this.oMarkers;	
	},
	addMarkers: function (markers) {
		var oMarkers = this.oMarkers;
		for (var i = 0; i < markers.length; i++) {
			this.addMarker(markers[i]);
		}
	},
	removeMarkers: function (markers) {
		var removeMarkers = markers;
		var len_removeMarkers=removeMarkers.length;
		for (var i = 0; i < len_removeMarkers; i++) {
			var tmpremoveMark=removeMarkers[i];
			this.removeMarker(tmpremoveMark);
		}
	},
	removeAllMarkers:function(){
		var oMarkers = this.oMarkers;
        this.removeMarkers(oMarkers);
	},
	renew: function () {
		this._super();
		for (var i = 0; i < this.oMarkers.length; i++) {
			this.oMarkers[i].renew();
		}
	},
	resize: function () {
		this._super();
		this.renew();
	}
});


 /**
 * 文本层
 * @type {*|void}
 */
gDBox.Layer.Text = gDBox.Layer.extend({
	init: function (id, options) {
		this._super(id, options);
		this.options = options || {
			opacity: 1.0,
			zIndex: 19
		}
		this.id = id;
		this.oClass = 'textLayer';
		this.oTexts = [];
	},
	_initLayerContainer: function (id, w, h) {
		var div = gDBox.Util.createDiv(id, w, h, true);
		this._layerContainer = div;
	},
	addText: function (textObj) {
		if (!gDBox.Util.isInArray(this.oTexts, textObj)) {
			this.oTexts.push(textObj);
			textObj.onAdd(this);
		}
	},
	removeText: function (textObj) {
		var oText = [];
		for (var i = 0, a = 0; i < this.oTexts.length; i++) {
			if (this.oTexts[i] != textObj) {
				oText[a] = this.oTexts[i];
				a++;
			} else {
				this.oTexts[i].onRemove(this);
			}
		}
		this.oTexts = oText;
		this.renew();
	},
	getTextById: function (id) {
       for (var i = 0, a = 0; i < this.oTexts.length; i++) {
			if (this.oTexts[i].id === id) {
				return this.oTexts[i];
			}
		}
		return null;
	},
	removeTextById: function (id) {
		var oText = [];
		for (var i = 0, a = 0; i < this.oTexts.length; i++) {
			if (this.oTexts[i].id != id) {
				oText[a] = this.oTexts[i];
				a++;
			} else {
				this.oTexts[i].onRemove(this);
			}
		}
		this.oTexts = oText;
		this.renew();
	},
	addTexts: function (textObjs) {
		var oTexts = this.oTexts;
		for (var i = 0; i < textObjs.length; i++) {
			this.addText(textObjs[i]);
		}
	},
	removeTexts: function (textObjs) {
		var removeTexts = textObjs;
		var len_removeTexts=removeTexts.length;
		for (var i = 0; i < len_removeTexts; i++) {
			var tmpremoveText=removeTexts[i];
			this.removeText(tmpremoveText);
		}
	},

	getAllTexts: function () {
		//需要清空
		return this.oTexts;
	},
	
	removeAllTexts: function () {
		//需要清空
		this._layerContainer.innerHTML = "";
        this.oTexts=[];
        this.renew();
	},

	renew: function () {
		this._super();
		for (var i = 0; i < this.oTexts.length; i++) {
			this.oTexts[i].renew();
		}
	},
	resize: function () {
		this._super();
		this.renew();
	}
});
