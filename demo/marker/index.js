/**
 * @file ...
 * @author dingyang
 */
/* globals gDBox */

// 容器对象声明
let gMap = new gDBox.Map('map', {zoom: 650, cx: 0, cy: 0, zoomMax: 650 * 10, zoomMin: 650 / 10});

// 图片层实例\添加
let gImageLayer = new gDBox.Layer.Image('img', 'http://pic2.ooopic.com/12/29/07/36b1OOOPICa1.jpg', {w: 650, h: 445}, {zIndex: 1});
gMap.addLayer(gImageLayer);

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
