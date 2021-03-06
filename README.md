# gDBox.js

### 背景-功能

> 1. 解决图片浏览（无极缩放、平移）
> 2. 矢量数据、文本、标注展示
> 3. 矢量数据绘制、编辑（目前支持矩形，后续会不断拓展补充）

### 版本更新记录
1.0.0 首次发布<br>
1.0.1 示例添加、参数释疑<br>
1.0.4 hover样式修改<br>
1.0.5 相关事件今天修改及矩形编辑功能添加<br>

### 示例
[图片缩放](https://dev.ccgis.cn/gdbox/demo/img/)<br/>
[矢量图形](https://dev.ccgis.cn/gdbox/demo/feature/)<br/>
[文本数据](https://dev.ccgis.cn/gdbox/demo/text/)<br/>
[标注对象](https://dev.ccgis.cn/gdbox/demo/marker/)

### get started（Demo/img文件夹）

html\css\js部分
```
    // 样式声明
    <style>
        #hello-map {
            width: 500px;         // 必须
            height: 400px;        // 必须
            position: relative;   // 必须
            border: 1px solid red;
            cursor: pointer;
        }
    </style>

    // 容器声明
    <div id="hello-map"></div>

    // js声明-容器声明（参数：zoom: 缩放比; {cx: cy:}：初始中心点位置；zoomMax、zoomMin：缩放的比例限制）
    let gMap = new gDBox.Map('hello-map', {zoom: 650, cx: 0, cy: 0, zoomMax: 650 * 10, zoomMin: 650 / 10});
    // 图片层实例\添加（参数：img: 图片路径，支持base64; {w: 650, h: 445}：图片大小）
    let gImageLayer = new gDBox.Layer.Image('img', 'http://pic2.ooopic.com/12/29/07/36b1OOOPICa1.jpg', {w: 650, h: 445}, {zIndex: 1});
    gMap.addLayer(gImageLayer);

    ***至此、已完成首个简单的hello-map的使用***
```

### 矢量数据(Feture)展示（Demo/feature文件夹）
```
    // 常用样式声明
    const gFetureStyle = new gDBox.Style({strokeColor: '#0000FF'});

    // 矢量层实例\添加
    let gFeatureLayer = new gDBox.Layer.Feature('featureLayer', {zIndex: 2, transparent: true});
    gMap.addLayer(gFeatureLayer);

    // 矢量要素实例\添加
    const fea = new gDBox.Feature.Polygon('id', [
        {x: 10, y: 10},
        {x: 50, y: 10},
        {x: 40, y: 50},
        {x: 20, y: 60},
        {x: 10, y: 10}
    ], {name: '中国'}, gFetureStyle);
    gFeatureLayer.addFeature(fea);
```

### 文本数据(Text)展示（Demo/text文件夹）
```
    // 常用样式声明
    const gTextStyle = new gDBox.Style({strokeColor: '#0000FF'});

    // 文本层实例\添加
    let gTextLayer = new gDBox.Layer.Text('textLayer', {zIndex: 2});
    gMap.addLayer(gTextLayer);

    // 文本要素实例\添加
    const text = new gDBox.Text('id', {
        pos: {x: 100, y: 100},
        offset: {x: 0, y: 0},
        width: 100, // maxwidth
        text: '中国'
    }, gTextStyle);
    gTextLayer.addText(text);
```

### 标注数据(Marker)展示（Demo/marker文件夹）
```
    // 不需要声明markerLayer标注图层，有且只有一个markerLayer，可通过gMap.mLayer来获取

    // marker对象实例\添加
    const marker = new gDBox.Marker('name-中国', {
        src: './marker.png',
        x: 0,
        y: 0,
        offset: {x: -32, y: -32}
    });
    // 注册监听事件删除标注
    marker.regEvent('click', function () {
        gMap.mLayer.removeMarker(this);
    });
    gMap.mLayer.addMarker(marker);
```

### hover事件监听（Demo/hover文件夹）
```
    矢量图形默认自带hover效果（在原图形基础之上加宽边框显示）
```

### 矢量数据绘制、编辑——矩形（Demo/drawRect文件夹）
```
    // 常用样式声明
    const gFetureStyle = new gDBox.Style({strokeColor: '#0000FF'});

    // 设置当前操作模式为‘drawRect’, 浏览状态对应mode为'pan'
    gMap.setMode('drawRect', gFetureStyle);

    // 矢量层实例\添加
    let gFeatureLayer = new gDBox.Layer.Feature('featureLayer', {zIndex: 2, transparent: true});
    gMap.addLayer(gFeatureLayer);

    // 绘制完成事件监听
    gMap.events.on('geometryDrawDone', function (type, points) {
        // 生成元素唯一标志（时间戳）
        const timestamp = new Date().getTime();
        // 元素添加展示
        let fea = new gDBox.Feature.Polygon(`feature-${timestamp}`, points, {
            name: '中国'
        }, gFetureStyle);
        gFeatureLayer.addFeature(fea);
    });
    // 因为自带编辑功能，故需要以下代码
    gMap.events.on('geometryEditDone', (type, activeFeature, points) => {
        activeFeature.update({points});
        activeFeature.show();
    });
```

### 矢量数据编辑——矩形（Demo/editRect文件夹）
```
    // 示例同drawRect，但此处添加‘编辑中’事件监听，供开发者在图形编辑过程中进行自定义事件
    gMap.events.on('geometryEditing', function (type, feature, points) {
        if (!gMap.mLayer) return;
        const marker = gMap.mLayer.getMarkerById(`marker-${feature.id}`);
        if (!marker) return;
        const bounds = gDBox.Util.getBounds(points);
        const leftTopPoint = bounds[0]; // 边界坐上角坐标
        marker.update({x: leftTopPoint.x, y: leftTopPoint.y});
    });
```


如有其他需要，请联系我dingyang9642@126.com
