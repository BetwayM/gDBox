/**
 * @file ...
 * @author dingyang
 */
/* globals gDBox */

// 常用样式声明
const gFetureStyle = new gDBox.Style({strokeColor: '#0000FF', lineWeight: 2});

// 容器对象声明
let gMap = new gDBox.Map('map', {zoom: 650, cx: 0, cy: 0, zoomMax: 650 * 10, zoomMin: 650 / 10});

// 设置当前操作模式为‘drawRect’
gMap.setMode('drawRect', gFetureStyle);

// 图片层实例\添加
let gImageLayer = new gDBox.Layer.Image('img', 'http://pic2.ooopic.com/12/29/07/36b1OOOPICa1.jpg', {w: 650, h: 445}, {zIndex: 1});
gMap.addLayer(gImageLayer);

// 矢量层实例\添加
let gFeatureLayer = new gDBox.Layer.Feature('featureLayer', {zIndex: 2, transparent: true});
gMap.addLayer(gFeatureLayer);

gMap.events.on('geometryDrawDone', function (type, points) {
    // 生成元素唯一标志（时间戳）
    const timestamp = new Date().getTime();
    // 元素添加展示
    let fea = new gDBox.Feature.Polygon(`feature-${timestamp}`, points, {
        name: '中国'
    }, gFetureStyle);
    gFeatureLayer.addFeature(fea);
});
gMap.events.on('geometryEditDone', function (type, activeFeature, points) {
    activeFeature.update({points});
    activeFeature.show();
});
// feature-reset监听
gMap.events.on('featureStatusReset', function () {
    gMap.mLayer.removeAllMarkers();
});

gMap.events.on('geometryEditing', function (type, feature, points) {
    if (!gMap.mLayer) return;
    const marker = gMap.mLayer.getMarkerById(`marker-${feature.id}`);
    if (!marker) return;
    const bounds = gDBox.Util.getBounds(points);
    const leftTopPoint = bounds[0]; // 边界坐上角坐标
    marker.update({x: leftTopPoint.x, y: leftTopPoint.y});
});

gMap.events.on('featureSelected', function (feature) {
    let cFeature = feature;
    // 删除按钮添加
    const featureBounds = cFeature.getBounds();
    const leftTopPoint = featureBounds[0]; // 边界坐上角坐标
    let deleteMarker = new gDBox.Marker(`marker-${cFeature.id}`,
        {
            src: './delete.png',
            x: leftTopPoint.x,
            y: leftTopPoint.y,
            offset: {
                x: 0,
                y: 0
            },
            featureId: cFeature.id
        });
    gMap.mLayer.addMarker(deleteMarker);

    deleteMarker.regEvent('click', function () {
        // 执行选中元素删除
        gFeatureLayer.removeFeatureById(this.info.featureId);
        // 对应删除标注层中删除（x）icon
        gMap.mLayer.removeAllMarkers();
    });
});

window.onresize = function () {
    gMap && gMap.resize();
};
