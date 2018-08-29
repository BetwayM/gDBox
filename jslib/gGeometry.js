gDBox.Geometry = gClass.extend({
	init: function (name) {
		this.name = name;
	},
	getVertices: function () {

	},
	getBounds: function () {

	},
	calcBounds: function () {

	}
});

gDBox.Geometry.Point = gClass.extend({
	init: function (x, y) {
		this.x = x;
		this.y = y;
		this.className="point";
/*		var r = /^\d+$/;
		if (r.test(ID)) {
			this.ID = ID;
		}*/
	}
});

gDBox.Geometry.LineString = gDBox.Geometry.extend({
	init: function (points) {  
		this.className="line";
		this.points = [];
		for (var i = 0; i < points.length; i++) {
			var pt=points[i];
			if(pt instanceof gDBox.Geometry.Point){
		    	this.points.push(pt);
		    }else{
		    	alert('初始化节点失败！');
		    }
		}
	},
	addPoint: function (pt, index){
		var r = /^\d+$/;
		if (r.test(index)) {
			this.points.splice(index, 0, pt);
		} else {
			this.points.push(pt);
		}
	},
	delPoint:function(index){
		this.points.splice(index,1);   
	},
	removePoint: function (pt) {
		for (var i = 0; i < this.points.length; i++) {
			if (this.points[i] == pt) {
				this.points.splice(i, 1);
				break;
			}
		}
	},
	getLength: function () {
		var len = this.points.length;
		var totalDis = 0;
		for (var j = 0; j < (len - 1); j++) {
			var mdis = Math.sqrt((this.points[j].x - this.points[j + 1].x) * (this.points[j].x - this.points[j + 1].x) + (this.points[j].y - this.points[j + 1].y) * (this.points[j].y - this.points[j + 1].y));
			totalDis = totalDis + mdis;
		}
		return totalDis;
	}
});



gDBox.Geometry.LinearRing = gDBox.Geometry.LineString.extend({
	init:function(points){
         var points_len=points.length;
         if(points_len<=2){alert('组成多边形节点个数不足！'); return;}
         this._super(points);
         this.className="polygon";  //应该是多边形
         var lastPoint=points[0];
         this.points.push(lastPoint);
	},
	addPoint: function (pt, index){
		//var r = /^\d+$/;
		//if (r.test(index)) {
			this.points.splice(index, 0, pt);
		//} else {
		//	this.points.push(pt);
		//}
	},
	delPoint:function(index){    
		if(this.points.length==4){alert('节点数低于3个，不能删除！');return;};
		this.points.splice(index,1);
		if(index==0){
           this.points.pop();
           var firstPoint=this.points[0];
           this.points.push(firstPoint);
		}else{		
		}
        
	},
	getCenterPoint:function(){
        var tmppoints=this.points;
        var points_len=tmppoints.length;
        var totalX=0;var totalY=0;
        for(var i=0;i<points_len;i++){
            totalX=totalX+tmppoints[i].x;
            totalY=totalY+tmppoints[i].y;
        }
        var x=totalX/points_len;
        var y=totalY/points_len;
        var point=new gDBox.Geometry.Point(x,y);
        return point;
    },
	getArea: function () {
		var ta = 0;
		var ax = this.points;
		for (var i = 0; i < ax.length; i++) {   //i<ax.length-1
			ta = ta + (ax[i].x * ax[(i + 1) % ax.length].y - ax[(i + 1) % ax.length].x * ax[i].y);
		}
		var meter2 = parseInt(Math.abs(0.5 * ta));
		return meter2;
	}
});

gDBox.Geometry.RectRing = gDBox.Geometry.LineString.extend({
	init:function(points){
         var points_len=points.length;
       //  if(points_len<=4){alert('组成多边形节点个数不足！');}
         if(points_len<4){alert('组成矩形节点个数不足！'); return;}
         this._super(points);
         this.className="rect";
         // var lastPoint=points[0];    // 传入的参数就是四个节点 8.16删除
         // this.points.push(lastPoint);
	},
	addPoint: function (pt, index){
		//var r = /^\d+$/;
		//if (r.test(index)) {
			this.points.splice(index, 0, pt);
		//} else {
		//	this.points.push(pt);
		//}
	},
	delPoint:function(index){
		if(this.points.length==4){alert('节点数低于3个，不能删除！');return;};
		this.points.splice(index,1);
		if(index==0){
           this.points.pop();
           var firstPoint=this.points[0];
           this.points.push(firstPoint);
		}else{		
		}  
	},
	getArea: function () {
		var ta = 0;
		var ax = this.points;
		for (var i = 0; i < ax.length; i++) {
			ta = ta + (ax[i].x * ax[(i + 1) % ax.length].y - ax[(i + 1) % ax.length].x * ax[i].y);
		}
		var meter2 = parseInt(Math.abs(0.5 * ta));
		return meter2;
	}
});
gDBox.Geometry.RadiusRing = gDBox.Geometry.extend({
	init:function(point,radius){
        this.radius=radius;
        this.centerPoint=point;
        this.className="radius";
	},
	getArea: function () {
        return 2*3.14159*(this.radius)*(this.radius);
	}
});