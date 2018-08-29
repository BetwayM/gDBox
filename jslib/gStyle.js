 /**
   * 样式对象
   * @type {*|void}
   */
gDBox.Style = gClass.extend({
  init:function(options){
    this.oStyle='singleStyle';
    if(options.fillColor==undefined){
      this.fillColor='#00DD00';
    }else{this.fillColor=options.fillColor;}
    if(options.strokeColor==undefined){
      this.strokeColor='#00DD00';
    }else{this.strokeColor=options.strokeColor;}
    if(options.lineWeight==undefined){
       this.lineWeight=1;
    }else{this.lineWeight=options.lineWeight;}
    if(options.borderStatus==undefined){
      this.borderStatus= true;
    }else{this.borderStatus=false;}
    if(options.cirRadius==undefined){
      this.cirRadius=3;
    }else{this.cirRadius=options.cirRadius};
    if(options.fillStatus==undefined){
      this.fillStatus=true;
    }else{this.fillStatus=false;}
    if(options.vtxStatus==undefined){
      this.vtxStatus= false;
    }else{this.vtxStatus=true;}
    if(options.vtxRadius==undefined){
      this.vtxRadius=3;
    }else{this.vtxRadius=options.vtxRadius};
    if(options.tlr==undefined){
      this.tlr=5;
    }else{this.tlr=options.tlr;}
    if(options.opacity==undefined){
      this.opacity=1;
    }else{this.opacity=options.opacity;}
    if(options.mappingValue==undefined){
      this.mappingValue="default";
    }else{this.mappingValue=options.mappingValue;}
    if(options.fontSize==undefined){
      this.fontSize=13;
    }else{this.fontSize=options.fontSize;}
    if(options.fontFamily==undefined){
      this.fontFamily="KaiTi";
    }else{this.fontFamily=options.fontFamily;}
    if(options.fontColor==undefined){
      this.fontColor="#333333";
    }else{this.fontColor=options.fontColor;}
    if(options.bgColor==undefined){
      this.bgColor="#ffffff";
    }else{this.bgColor=options.bgColor;}
  }
});
 /**
   * 样式对象
   * @type {*|void}
   */
gDBox.Style_Ex = gClass.extend({
  init:function(styleArr,field){
    this.oStyle='multiStyles';
    this.styles=styleArr;
    this.mappingField=field;
  }
});