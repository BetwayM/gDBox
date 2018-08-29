//gDBox.Feature = {};
gDBox.Feature = gClass.extend({
  init:function(){

  },
  getVertices: function(){
    return this.points;
  },
  getBounds: function(){
    var points = this.getVertices();
    var minX = points[0].x, minY = points[0].y, maxX = points[0].x, maxY = points[0].y;
    for (var i = 1; i < points.length; i++) {
      if(minX > points[i].x) {
        minX = points[i].x;
      }
      if(maxX < points[i].x) {
        maxX = points[i].x;
      }
      if(minY > points[i].y) {
        minY = points[i].y;
      }
      if(maxY < points[i].y) {
        maxY = points[i].y;
      }
    }
    return [{x: minX, y: maxY}, {x: maxX, y: maxY}, {x: maxX, y: minY}, {x: minX, y: minY}];
  },
  calcBounds: function(){
    
  }
  
});

gDBox.Feature.Polygon =gDBox.Feature.extend({
  init:function(points, data, gStyle){
      this.points = points; // 坐标点数据
      this.data = data || {}; // 属性数据绑定
      this.style = gStyle || new gDBox.Style({});
  },
  onAdd: function (layer) {
      this._layerID = layer.id;
      this._layer = layer
      this.onDraw(layer);
  },
  onRemove: function (layer) {

  },
  // 空间信息、属性信息、样式数据修改
  update: function (options) {
      this.points = options.points || this.points;
      this.data = options.data || this.data;
      this.style = options.style || this.style;
      this._layer.renew();
  },
  onDraw: function (layer) {
    var ctx = layer.getCtx();
    var opt = gDBox.Util.setStyle(ctx, this.style);
    if (this.select) {
        ctx.strokeStyle = '#FF0000';  
        ctx.lineWidth = 2;
    }
    var map = layer.getMap();
    ctx.globalAlpha = 1;
    var len = this.points.length;
    if (len >= 2) {
      ctx.beginPath();
      var sxy = gDBox.Util.worldToScreen(layer._map, this.points[0].x, this.points[0].y);
      ctx.moveTo(sxy.x, sxy.y); //设置起点
      for (var i = 1; i < len; i++) {
        sxy = gDBox.Util.worldToScreen(layer._map, this.points[i].x, this.points[i].y);
        ctx.lineTo(sxy.x, sxy.y);
      }
      ctx.closePath();
    }
    ctx.stroke();
    if(layer._opacity){
      ctx.globalAlpha = 0;
    }else{
      ctx.globalAlpha = this.style.opacity;
    }
    ctx.fill();
    if (this.select) {
      // 绘制点顶点
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#FF0000';
      gDBox.Graph.drawPoints_geo(map, ctx, this.points);
    }
  } 
});


  /**
   * Marker要素
   * @type {*}
   */
 gDBox.Marker = gClass.extend({
    init: function (name, info) {
      this.name = name;
      this._img = new Image();
      this._img.src = info.src;
      this.src=info.src;
      this._img.style.position = 'absolute';
      this._img.style.zIndex = 100;
      this.info = info;
    },
    onAdd: function (layer) {
      this._layer = layer;
      var map = layer.getMap();
      var container = this._container = layer.getLayerContainer();
      this.x=this.info.x;
      this.y=this.info.y;
      var sxy = gDBox.Util.worldToScreen(map, this.info.x, this.info.y);
      this._img.style.left = sxy.x+this.info.offset.x+ 'px';
      this._img.style.top = sxy.y+this.info.offset.y + 'px';
      this._img.style.cursor="pointer";
      container.appendChild(this._img);
    },
    onRemove: function () {
      this._container.removeChild(this._img);
    },
    regEvent:function(evt, callback){
          if(evt == "click"){
              var self=this;
              gDBox.Util.addEvtHandler(this._img, 'mousedown', function(e){ 
                  gDBox.Util.preventDefault(e);
                  gDBox.Util.stopPropagation(e);  
              });

              gDBox.Util.addEvtHandler(this._img, 'mouseup', function(e){ 
                  if(gDBox.Util.getButton(e)==0) {
                      callback.apply(self,arguments);
                  }
                  gDBox.Util.preventDefault(e);
                  gDBox.Util.stopPropagation(e);  
              });
              gDBox.Util.addEvtHandler(this._img, 'click', function(e){ 
                  gDBox.Util.preventDefault(e);
                  gDBox.Util.stopPropagation(e);  
              });

          }else if(evt=="Rclick") {
              // todo
          }
     },
    renew: function () {
      var map = this._layer.getMap();
      var sxy = gDBox.Util.worldToScreen(map, this.info.x, this.info.y);
      this._img.style.left = sxy.x +this.info.offset.x+ 'px';
      this._img.style.top = sxy.y +this.info.offset.y+ 'px';
    },
    showInfo: function () {
        console.log("Hello ...");
    }
  });
  

/**
 * Text要素
 * @type {*}
 */
 gDBox.Text = gClass.extend({
    init: function (id, info, gStyle) {
      this.id = id;
      this.startPoint = info.pos;
      this.offset = info.offset || {x: 0, y: 0};
      this.boxMaxWidth=info.width;
      this.wrap = info.wrap || false; // 默认不换行
      this.text = info.text;
      this.style = gStyle || new gDBox.Style({});
    },
    onAdd: function (layer) {
      var id=this.id;
      this._w=this.boxMaxWidth;
      // this._h=14; // 一行初始高度
      var div = gDBox.Util.createDiv(id, this._w, this._h, true);
      div.style.borderWidth=0;
      div.style.width = 'initial'; // 恢复初始宽度
      div.style.maxWidth = this._w + 'px';
      if (!this.wrap) {
        div.style.overflow = 'hidden';
        div.style.textOverflow = 'ellipsis';
        div.style.whiteSpace = 'nowrap';
      }
      this._textContainer = div;
      var container = this._container = layer.getLayerContainer();
      container.appendChild(this._textContainer);
      this._layer = layer;
      this.onDraw(layer);
    },

    onDraw:function(layer){
      var left_top = gDBox.Util.worldToScreen(layer._map, this.startPoint.x, this.startPoint.y);
      left_top.x = left_top.x + this.offset.x;
      left_top.y= left_top.y + this.offset.y;

      this._textContainer.style.fontSize = this.style.fontSize + "px";
      this._textContainer.style.lineHeight = this.style.fontSize + "px";
      this._textContainer.style.fontFamily = this.style.fontFamily + ",SimSun";//避免字体不支持
      this._textContainer.style.color = this.style.fontColor;
      this._textContainer.style.borderRadius = "1px";
      this._textContainer.style.boxSizing = "border-box";
      this._textContainer.style.padding = "1px";

      var rgba=gDBox.Util.colorRgb(this.style.bgColor, this.style.opacity || 1);
      this._textContainer.style.background=rgba;
      this._textContainer.textContent = this.text;
      this._textContainer.style.left=left_top.x+"px";
      this._textContainer.style.top=left_top.y+"px";
      layer._layerContainer.appendChild(this._textContainer); 
    },
    setText:function(newText){
      this.text = newText;
      this.refresh();
    },
    setPosition:function(wx,wy){
        this.startPoint.x = wx;
        this.startPoint.y = wy;
    },
    setSize:function(width){
       this._w=this.boxMaxWidth=width;
    },
    onRemove: function () {
      this._container.removeChild(this._textContainer);
    },
    getContainer: function () {
      return this._textContainer;
    },
    renew:function(){
      var layer=this._layer;
      this.onDraw(layer);
    },
    refresh:function(){
       this.renew();
    }
  });

