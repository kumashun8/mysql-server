//>>built
define("dojox/layout/GridContainer",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/array","dojo/_base/connect","dojo/_base/sniff","dojo/dom-class","dojo/dom-style","dojo/dom-geometry","dojo/dom-construct","dojo/_base/lang","dojo/_base/window","dojo/ready","dojox/layout/GridContainerLite"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){
return _2("dojox.layout.GridContainer",_d,{hasResizableColumns:true,liveResizeColumns:false,minColWidth:20,minChildWidth:150,mode:"right",isRightFixed:false,isLeftFixed:false,startup:function(){
this.inherited(arguments);
if(this.hasResizableColumns){
for(var i=0;i<this._grid.length-1;i++){
this._createGrip(i);
}
if(!this.getParent()){
_c(_a.hitch(this,"_placeGrips"));
}
}
},resizeChildAfterDrop:function(_e,_f,_10){
if(this.inherited(arguments)){
this._placeGrips();
}
},onShow:function(){
this.inherited(arguments);
this._placeGrips();
},resize:function(){
this.inherited(arguments);
if(this._isShown()&&this.hasResizableColumns){
this._placeGrips();
}
},_createGrip:function(_11){
var _12=this._grid[_11],_13=_9.create("div",{"class":"gridContainerGrip"},this.domNode);
_12.grip=_13;
_12.gripHandler=[this.connect(_13,"onmouseover",function(e){
var _14=false;
for(var i=0;i<this._grid.length-1;i++){
if(_6.contains(this._grid[i].grip,"gridContainerGripShow")){
_14=true;
break;
}
}
if(!_14){
_6.replace(e.target,"gridContainerGripShow","gridContainerGrip");
}
})[0],this.connect(_13,"onmouseout",function(e){
if(!this._isResized){
_6.replace(e.target,"gridContainerGrip","gridContainerGripShow");
}
})[0],this.connect(_13,"onmousedown","_resizeColumnOn")[0],this.connect(_13,"ondblclick","_onGripDbClick")[0]];
},_placeGrips:function(){
var _15,_16,_17=0,_18;
_3.forEach(this._grid,function(_19){
if(_19.grip){
_18=_19.grip;
if(!_15){
_15=_18.offsetWidth/2;
}
_17+=_8.getMarginBox(_19.node).w;
_7.set(_18,"left",(_17-_15)+"px");
if(!_16){
_16=_8.getContentBox(this.gridNode).h;
}
if(_16>0){
_7.set(_18,"height",_16+"px");
}
}
},this);
},_onGripDbClick:function(){
this._updateColumnsWidth(this._dragManager);
this.resize();
},_resizeColumnOn:function(e){
this._activeGrip=e.target;
this._initX=e.pageX;
e.preventDefault();
_b.body().style.cursor="ew-resize";
this._isResized=true;
var _1a=[];
var _1b;
var i;
for(i=0;i<this._grid.length;i++){
_1a[i]=_8.getContentBox(this._grid[i].node).w;
}
this._oldTabSize=_1a;
for(i=0;i<this._grid.length;i++){
_1b=this._grid[i];
if(this._activeGrip==_1b.grip){
this._currentColumn=_1b.node;
this._currentColumnWidth=_1a[i];
this._nextColumn=this._grid[i+1].node;
this._nextColumnWidth=_1a[i+1];
}
_1b.node.style.width=_1a[i]+"px";
}
var _1c=function(_1d,_1e){
var _1f=0;
var _20=0;
_3.forEach(_1d,function(_21){
if(_21.nodeType==1){
var _22=_7.getComputedStyle(_21);
var _23=(_5("ie"))?_1e:parseInt(_22.minWidth);
_20=_23+parseInt(_22.marginLeft)+parseInt(_22.marginRight);
if(_1f<_20){
_1f=_20;
}
}
});
return _1f;
};
var _24=_1c(this._currentColumn.childNodes,this.minChildWidth);
var _25=_1c(this._nextColumn.childNodes,this.minChildWidth);
var _26=Math.round((_8.getMarginBox(this.gridContainerTable).w*this.minColWidth)/100);
this._currentMinCol=_24;
this._nextMinCol=_25;
if(_26>this._currentMinCol){
this._currentMinCol=_26;
}
if(_26>this._nextMinCol){
this._nextMinCol=_26;
}
this._connectResizeColumnMove=_4.connect(_b.doc,"onmousemove",this,"_resizeColumnMove");
this._connectOnGripMouseUp=_4.connect(_b.doc,"onmouseup",this,"_onGripMouseUp");
},_onGripMouseUp:function(){
_b.body().style.cursor="default";
_4.disconnect(this._connectResizeColumnMove);
_4.disconnect(this._connectOnGripMouseUp);
this._connectOnGripMouseUp=this._connectResizeColumnMove=null;
if(this._activeGrip){
_6.replace(this._activeGrip,"gridContainerGrip","gridContainerGripShow");
}
this._isResized=false;
},_resizeColumnMove:function(e){
e.preventDefault();
if(!this._connectResizeColumnOff){
_4.disconnect(this._connectOnGripMouseUp);
this._connectOnGripMouseUp=null;
this._connectResizeColumnOff=_4.connect(_b.doc,"onmouseup",this,"_resizeColumnOff");
}
var d=e.pageX-this._initX;
if(d==0){
return;
}
if(!(this._currentColumnWidth+d<this._currentMinCol||this._nextColumnWidth-d<this._nextMinCol)){
this._currentColumnWidth+=d;
this._nextColumnWidth-=d;
this._initX=e.pageX;
this._activeGrip.style.left=parseInt(this._activeGrip.style.left)+d+"px";
if(this.liveResizeColumns){
this._currentColumn.style["width"]=this._currentColumnWidth+"px";
this._nextColumn.style["width"]=this._nextColumnWidth+"px";
this.resize();
}
}
},_resizeColumnOff:function(e){
_b.body().style.cursor="default";
_4.disconnect(this._connectResizeColumnMove);
_4.disconnect(this._connectResizeColumnOff);
this._connectResizeColumnOff=this._connectResizeColumnMove=null;
if(!this.liveResizeColumns){
this._currentColumn.style["width"]=this._currentColumnWidth+"px";
this._nextColumn.style["width"]=this._nextColumnWidth+"px";
}
var _27=[],_28=[],_29=this.gridContainerTable.clientWidth,_2a,_2b=false,i;
for(i=0;i<this._grid.length;i++){
_2a=this._grid[i].node;
if(_5("ie")){
_27[i]=_8.getMarginBox(_2a).w;
_28[i]=_8.getContentBox(_2a).w;
}else{
_27[i]=_8.getContentBox(_2a).w;
_28=_27;
}
}
for(i=0;i<_28.length;i++){
if(_28[i]!=this._oldTabSize[i]){
_2b=true;
break;
}
}
if(_2b){
var mul=_5("ie")?100:10000;
for(i=0;i<this._grid.length;i++){
this._grid[i].node.style.width=Math.round((100*mul*_27[i])/_29)/mul+"%";
}
this.resize();
}
if(this._activeGrip){
_6.replace(this._activeGrip,"gridContainerGrip","gridContainerGripShow");
}
this._isResized=false;
},setColumns:function(_2c){
var z,j;
if(_2c>0){
var _2d=this._grid.length,_2e=_2d-_2c;
if(_2e>0){
var _2f=[],_30,_31,end,_32;
if(this.mode=="right"){
end=(this.isLeftFixed&&_2d>0)?1:0;
_31=(this.isRightFixed)?_2d-2:_2d-1;
for(z=_31;z>=end;z--){
_32=0;
_30=this._grid[z].node;
for(j=0;j<_30.childNodes.length;j++){
if(_30.childNodes[j].nodeType==1&&!(_30.childNodes[j].id=="")){
_32++;
break;
}
}
if(_32==0){
_2f[_2f.length]=z;
}
if(_2f.length>=_2e){
this._deleteColumn(_2f);
break;
}
}
if(_2f.length<_2e){
_4.publish("/dojox/layout/gridContainer/noEmptyColumn",[this]);
}
}else{
_31=(this.isLeftFixed&&_2d>0)?1:0;
end=(this.isRightFixed)?_2d-1:_2d;
for(z=_31;z<end;z++){
_32=0;
_30=this._grid[z].node;
for(j=0;j<_30.childNodes.length;j++){
if(_30.childNodes[j].nodeType==1&&!(_30.childNodes[j].id=="")){
_32++;
break;
}
}
if(_32==0){
_2f[_2f.length]=z;
}
if(_2f.length>=_2e){
this._deleteColumn(_2f);
break;
}
}
if(_2f.length<_2e){
_4.publish("/dojox/layout/gridContainer/noEmptyColumn",[this]);
}
}
}else{
if(_2e<0){
this._addColumn(Math.abs(_2e));
}
}
if(this.hasResizableColumns){
this._placeGrips();
}
}
},_addColumn:function(_33){
var _34=this._grid,_35,_36,_37,_38,_39=(this.mode=="right"),_3a=this.acceptTypes.join(","),m=this._dragManager;
if(this.hasResizableColumns&&((!this.isRightFixed&&_39)||(this.isLeftFixed&&!_39&&this.nbZones==1))){
this._createGrip(_34.length-1);
}
for(var i=0;i<_33;i++){
_36=_9.create("td",{"class":"gridContainerZone dojoxDndArea","accept":_3a,"id":this.id+"_dz"+this.nbZones});
_38=_34.length;
if(_39){
if(this.isRightFixed){
_37=_38-1;
_34.splice(_37,0,{"node":_34[_37].node.parentNode.insertBefore(_36,_34[_37].node)});
}else{
_37=_38;
_34.push({"node":this.gridNode.appendChild(_36)});
}
}else{
if(this.isLeftFixed){
_37=(_38==1)?0:1;
this._grid.splice(1,0,{"node":this._grid[_37].node.parentNode.appendChild(_36,this._grid[_37].node)});
_37=1;
}else{
_37=_38-this.nbZones;
this._grid.splice(_37,0,{"node":_34[_37].node.parentNode.insertBefore(_36,_34[_37].node)});
}
}
if(this.hasResizableColumns){
if((!_39&&this.nbZones!=1)||(!_39&&this.nbZones==1&&!this.isLeftFixed)||(_39&&i<_33-1)||(_39&&i==_33-1&&this.isRightFixed)){
this._createGrip(_37);
}
}
m.registerByNode(_34[_37].node);
this.nbZones++;
}
this._updateColumnsWidth(m);
},_deleteColumn:function(_3b){
var _3c,_3d,_3e,_3f=0,_40=_3b.length,m=this._dragManager;
for(var i=0;i<_40;i++){
_3e=(this.mode=="right")?_3b[i]:_3b[i]-_3f;
_3d=this._grid[_3e];
if(this.hasResizableColumns&&_3d.grip){
_3.forEach(_3d.gripHandler,function(_41){
_4.disconnect(_41);
});
_9.destroy(this.domNode.removeChild(_3d.grip));
_3d.grip=null;
}
m.unregister(_3d.node);
_9.destroy(this.gridNode.removeChild(_3d.node));
this._grid.splice(_3e,1);
this.nbZones--;
_3f++;
}
var _42=this._grid[this.nbZones-1];
if(_42.grip){
_3.forEach(_42.gripHandler,_4.disconnect);
_9.destroy(this.domNode.removeChild(_42.grip));
_42.grip=null;
}
this._updateColumnsWidth(m);
},_updateColumnsWidth:function(_43){
this.inherited(arguments);
if(_43===null){
_43=this._dragManager;
}
_43._dropMode.updateAreas(_43._areaList);
},destroy:function(){
_4.unsubscribe(this._dropHandler);
this.inherited(arguments);
}});
});
