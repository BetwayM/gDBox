/********gDBox的绘制对象*************/
gDBox.Graph = {};
  /**
   * 绘制点
   * @param ctx
   * @param pt
   */
  gDBox.Graph.drawPoint = function (ctx, pt) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  };
  gDBox.Graph.drawPoint_geo = function (gMap, ctx, pt) {
    var sxy = gDBox.Util.worldToScreen(gMap, pt.x, pt.y);
    ctx.beginPath();
    ctx.arc(sxy.x, sxy.y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  };
      /**
   * 绘制多个点
   * @param ctx
   * @param ptArr
   */
  gDBox.Graph.drawPoints = function (ctx, ptArr) {
    for (var i = 0; i < ptArr.length; i++) {
      var sxy = {x:ptArr[i].x, y:ptArr[i].y};
      this.drawPoint(ctx, sxy);
    }
  };
    /**
   * 绘制多个点
   * @param ctx
   * @param ptArr
   */
  gDBox.Graph.drawPoints_geo = function (gMap, ctx, ptArr) {
    for (var i = 0; i < ptArr.length; i++) {
      var sxy = gDBox.Util.worldToScreen(gMap, ptArr[i].x, ptArr[i].y);
      this.drawPoint(ctx, sxy);
    }
  };