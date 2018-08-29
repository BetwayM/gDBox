/**
 * @file ...
 * @author dingyang
 */
/* globals gDBox */

// 常用样式声明
const gTextStyle = new gDBox.Style({strokeColor: '#0000FF'});

// 容器对象声明
let gMap = new gDBox.Map('map', {zoom: 650, cx: 0, cy: 0, zoomMax: 650 * 10, zoomMin: 650 / 10});

// 图片层实例\添加
let gImageLayer = new gDBox.Layer.Image('img', 'http://pic2.ooopic.com/12/29/07/36b1OOOPICa1.jpg', {w: 650, h: 445}, {zIndex: 1});
gMap.addLayer(gImageLayer);

// 文本层实例\添加
let gTextLayer = new gDBox.Layer.Text('textLayer', {zIndex: 2});
gMap.addLayer(gTextLayer);

// 文本实例\添加
const text = new gDBox.Text('id', {
    pos: {x: 100, y: 100},
    offset: {x: 0, y: 0},
    width: 100, // maxwidth
    text: '中国'
}, gTextStyle);
gTextLayer.addText(text);
