/**
 * @file ...
 * @author dingyang
 */
/* globals gDBox */

// 常用样式声明
const gFetureStyle = new gDBox.Style({strokeColor: '#0000FF'});

// 容器对象声明
let gMap = new gDBox.Map('map', {zoom: 650, cx: 0, cy: 0, zoomMax: 650 * 10, zoomMin: 650 / 10});

// 图片层实例\添加
let gImageLayer = new gDBox.Layer.Image('img', 'http://pic2.ooopic.com/12/29/07/36b1OOOPICa1.jpg', {w: 650, h: 445}, {zIndex: 1});
gMap.addLayer(gImageLayer);

// 矢量层实例\添加
let gFeatureLayer = new gDBox.Layer.Feature('featureLayer', {zIndex: 2, transparent: true});
gMap.addLayer(gFeatureLayer);

// 矢量要素实例\添加
const fea = new gDBox.Feature.Polygon('id-name', [
    {x: 10, y: 10},
    {x: 50, y: 10},
    {x: 40, y: 50},
    {x: 20, y: 60},
    {x: 10, y: 10}
], {name: '中国'}, gFetureStyle);
gFeatureLayer.addFeature(fea);
