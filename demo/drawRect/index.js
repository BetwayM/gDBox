/**
 * @file ...
 * @author dingyang
 */
/* globals gDBox */

// 常用样式声明
const gFetureStyle = new gDBox.Style({strokeColor: '#0000FF'});

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

gMap.events.on('geometryDone', function (type, points) {
    // 生成元素唯一标志（时间戳）
    const timestamp = new Date().getTime(); // 保持feature 与 label-text标注的一致性
    // 元素添加展示
    let fea = new gDBox.Feature.Polygon(`feature-${timestamp}`, points, {
        key: timestamp
    }, gFetureStyle);
    gFeatureLayer.addFeature(fea);
});


