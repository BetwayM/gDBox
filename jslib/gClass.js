(function() {
  // 当前是否处于创建类的阶段
  var initializing = false;
  gClass = function() { };
  gClass.extend = function(prop) {
    // 如果调用当前函数的对象（这里是函数）不是Class，则是父类
    var baseClass = null;
    if (this !== gClass) {
      baseClass = this;
    }
    // 本次调用所创建的类（构造函数）
    function F() {
      // 如果当前处于实例化类的阶段，则调用init原型函数
      if (!initializing) {
        // 如果父类存在，则实例对象的baseprototype指向父类的原型
        // 这就提供了在实例对象中调用父类方法的途径
        if (baseClass) {
          this._superprototype = baseClass.prototype;
        }
        this.init.apply(this, arguments);
      }
    }
    // 如果此类需要从其它类扩展
    if (baseClass) {
      initializing = true;
      F.prototype = new baseClass();
      F.prototype.constructor = F;
      initializing = false;
    }
    // 新创建的类自动附加extend函数
    F.extend = arguments.callee;

    // 覆盖父类的同名函数
    for (var name in prop) {
      if (prop.hasOwnProperty(name)) {
        // 如果此类继承自父类baseClass并且父类原型中存在同名函数name
        if (baseClass &&
            typeof (prop[name]) === "function" &&
            typeof (F.prototype[name]) === "function" &&
            /\b_super\b/.test(prop[name])) {
          // 重定义函数name -
          // 首先在函数上下文设置this._super指向父类原型中的同名函数
          // 然后调用函数prop[name]，返回函数结果
          // 注意：这里的自执行函数创建了一个上下文，这个上下文返回另一个函数，
          // 此函数中可以应用此上下文中的变量，这就是闭包（Closure）。
          // 这是JavaScript框架开发中常用的技巧。
          F.prototype[name] = (function(name, fn) {
            return function() {
              this._super = baseClass.prototype[name];
              return fn.apply(this, arguments);
            };
          })(name, prop[name]);
        } else {
          F.prototype[name] = prop[name];
        }
      }
    }
    return F;
  };
})();