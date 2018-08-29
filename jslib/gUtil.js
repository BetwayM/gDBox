/**
 * 创建div
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */
gDBox.Util = {};
gDBox.Util.createDiv = function (id, w, h, pos) {
	var div = document.createElement('div');
	div.id = id;
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	if (pos) {
		div.style.position = "absolute";
	}
	div.style.zIndex = 1;
	return div;
};

/**
 * 创建canvas
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */
gDBox.Util.createCanvas = function (id, w, h, pos) {
	var canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.width = w;
	canvas.height = h;
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';
	if (pos) {
		canvas.style.position = "absolute";
	}
	return canvas;
};

/**
 * 判断元素是否在数组中
 * @returns {boolean}
 */
gDBox.Util.isInArray = function (arr, val) {
	for (var i in arr) {
		if (arr[i] == val) {
			return true;
		}
	}
	return false;
};
/**
 * 判断对象是否在数组中
 * @param arr 数组
 * @param obj 对象
 * @returns {boolean}
 */
gDBox.Util.isObjInArray = function (arr, obj) {
	for (var i in arr) {
		/*if (arr[i].id == obj.id && arr[i] == obj) {*/
		if (arr[i].id == obj.id){
			alert('已被添加，请更换图层id'+obj.id);
			return true;
		}
	}
	return false;
};

gDBox.Util.setStyle = function (ctx,style) {  
	ctx.fillStyle = style.fillColor;  
	ctx.strokeStyle = style.strokeColor;  
	ctx.lineWidth = style.lineWeight;
	ctx.globalAlpha = style.opacity;
	return true; 
};

/**
 * 地理坐标转屏幕坐标
 * @param map 地图对象
 * @param wx 地理坐标x
 * @param wy 地理坐标y
 * @returns {{x: number, y: number}}
 */
gDBox.Util.worldToScreen = function (gMap, wx, wy) {
	var cxy = gMap.getCenter();  
	var wcx = cxy.x;
	var wcy = cxy.y;
	var scx = parseInt(gMap.w) / 2;
	var scy = parseInt(gMap.h) / 2;
	var scale = gMap.zoom / parseInt(gMap.w);
	
	var sx = parseFloat(scx) + parseFloat((wx - wcx) / scale) + 0;
	var sy = parseFloat(scy) - parseFloat((wy - wcy) / scale) + 0;   
	return {
		x: sx,
		y: sy
	};
};
/**
 * 屏幕坐标转地理坐标
 * @param map 地图对象
 * @param sx 屏幕坐标x
 * @param sy 屏幕坐标y
 * @returns {{x: number, y: number}}
 */
gDBox.Util.screenToWorld = function (gMap, sx, sy) {
	var cxy = gMap.getCenter();
	var wcx = cxy.x;
	var wcy = cxy.y;
	var scx = parseInt(gMap.w) / 2;
	var scy = parseInt(gMap.h) / 2;
	//要加载过动态图层或切片图层，才能直接获取正确的zoom值，若只有第三方地图图层，则需在前端换算坐标...
	var scale = gMap.zoom / parseInt(gMap.w);
	var wx = parseFloat(wcx) + parseFloat((sx - scx) * scale);
	var wy = parseFloat(wcy)- parseFloat((sy - scy) * scale);
	return {
		x: wx,
		y: wy
	};
};

gDBox.Util.addEvtHandler = function (element, evt, func) {
	element['on' + evt] = func;
	// if (element.attachEvent) {
	//	  element.attachEvent("on" + evt, func);
	// } else {
	//	  element['on' + evt] = func;
	// }
	// if (element.addEventListener) {
	// 	element.addEventListener(evt, func, false);
	// }
	if (evt == 'mousewheel' && gDBox.Util.getIEVersion() ==0) { //对于mousewheel事件单独处理
		element.addEventListener("DOMMouseScroll", func, false);
	}
};

gDBox.Util.removeEvtHandler = function (element, evt) {
	element['on' + evt] = null;
}

/**
 * 获取鼠标位置坐标
 * @param e 鼠标事件
 * @returns {{x: number, y: number}}
 */
gDBox.Util.getMouseXY = function (ele,e) {
	var x = 0,
		y = 0;
	var obj = e.srcElement ? e.srcElement : e.target;
	if(obj.nodeType!=1){
		return {
			x: x,
			y: y
		};
	}
	if (!document.attachEvent) {
		//获取事件源
		while (obj && obj != ele) {
			var btw = gDBox.Util.getEleStyle(obj, 'border-top-width') == 'medium' ? 0 : gDBox.Util.delpx(gDBox.Util.getEleStyle(obj, 'border-top-width'));
			var blw = gDBox.Util.getEleStyle(obj, 'border-left-width') == 'medium' ? 0 : gDBox.Util.delpx(gDBox.Util.getEleStyle(obj, 'border-left-width'));
			x += obj.offsetLeft + blw;
			y += obj.offsetTop + btw;
			obj = obj.offsetParent;
		}
		x = e.offsetX + x + document.body.scrollLeft;
		y = e.offsetY + y + document.body.scrollTop;
	} else {	
		var btw = gDBox.Util.getEleStyle(obj, 'border-top-width') == 'medium' ? 0 : gDBox.Util.delpx(gDBox.Util.getEleStyle(obj, 'border-top-width'));
		var blw = gDBox.Util.getEleStyle(obj, 'border-left-width') == 'medium' ? 0 : gDBox.Util.delpx(gDBox.Util.getEleStyle(obj, 'border-left-width'));
		x = e.layerX - blw;
		y = e.layerY - btw;
	}
	return {
		x: x,
		y: y
	};
};

/**
 * 获取鼠标屏幕坐标
 * @returns {{x: Number, y: Number}}
 */
gDBox.Util.getMousePos = function (event) {
	var e = event || window.event;
	return {
		'x': e.screenX,
		'y': e.screenY
	};
}

/**
 * 获取元素样式计算值
 * @param obj
 * @param attribute
 * @returns {*}
 */
gDBox.Util.getEleStyle = function (obj, attribute) {
	// 返回最终样式函数，兼容IE和DOM，设置参数：元素对象、样式特性
	var arr = attribute.split('-');
	var attr = arr[0];
	if (attr.length > 1) {
		for (var i = 1; i < arr.length; i++) {
			attr += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1);
			//除第一个单词外，其余单词首字母转为大写，并拼接起来
		}
	} else {
		attr = attribute;
	}
	return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr];
}

/**
 * 去除px字样
 * @param value
 * @returns {*}
 */
gDBox.Util.delpx = function (value) {
	if (value == "")
		return 0;
	return parseInt(value.substring(0, value.length - 2));
};

gDBox.Util.getRectPointsWithSAndE = function (startPoint, endPoint) {
	var pt1x = endPoint.x;
	var pt1y = startPoint.y;
	var pt3x = startPoint.x;
	var pt3y = endPoint.y;
	return [{x: startPoint.x, y: startPoint.y}, {x: pt1x, y: pt1y}, {x: endPoint.x, y: endPoint.y}, {x: pt3x, y: pt3y}]
};

//判断点在多边形内:转角和法的改进 假设点P 与任意多边形poly （1）做一条水平射线，判断P在各边的左边还是右边；（2）左边+1，右边-1，积累求和，如果最后结果为0 则在多边形外部，否在在多边形内部
gDBox.Util.pointInPoly = function (pt, poly) {  
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
    return c;
 }


gDBox.Util.preventDefault = function(event)
{
    if (event.preventDefault)
        {event.preventDefault();}
     else
      { window.event.returnValue=false;}
};

gDBox.Util.stopPropagation = function(event)
{
    if (event.stopPropagation)
    {
        event.stopPropagation();
    }else
    {
        window.event.cancelBubble=true;
    }
};

gDBox.Util.getButton=function (event){
    event= event || window.event;
    if(!+[1,]){
      switch(event.button)
      {
        case 0:
        case 1:
        case 3:
        case 5:
        case 7:
          return 0;
        case 2:
        case 6:
          return 2;
        case 4:
          return 1;
      }
    }
    else
    {
      return event.button;
    }
}


gDBox.Util.createTextArea = function (id, w, h, pos) {
	var div = document.createElement('textarea');
	div.id = id;
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	div.style.resize = 'none';
	if (pos) {
		div.style.position = "absolute";
	}
	div.style.zIndex = 1;
	return div;
};

//十六进制颜色值的正则表达式  

gDBox.Util.colorRgb = function(strColor,opacity){  
	var gcolor_reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 
    var sColor = strColor.toLowerCase();  
    if(sColor && gcolor_reg.test(sColor)){  
        if(sColor.length === 4){  
            var sColorNew = "#";  
            for(var i=1; i<4; i+=1){  
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
            }  
            sColor = sColorNew;  
        }  
        //处理六位的颜色值  
        var sColorChange = [];  
        for(var i=1; i<7; i+=2){  
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
        }  
        return "RGBA(" + sColorChange.join(",") +","+opacity+")";  
    }else{  
        return sColor;    
    }  
};

gDBox.Util.getIEVersion = function(){
	var userAgent = window.navigator.userAgent.toLowerCase();
    //if(/msie 10\.0/i.test(userAgent)) return 10;
    //if(/msie 9\.0/i.test(userAgent)) return 9;
    if(/msie 8\.0/i.test(userAgent)) return 8;
    if(/msie 7\.0/i.test(userAgent)) return 7;
    if(/msie 6\.0/i.test(userAgent)) return 6;
    return 0;
};
