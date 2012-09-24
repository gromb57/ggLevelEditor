function GgLEMain(){
	var self=this,
	obj_list={
		0:{
			name:"spawn",
			img:"",
			desc:"",
			style:"background:lime;border:1px solid green;height:50px;width:50px;"
		},
		1:{
			name:"ennemies",
			img:"",
			desc:"",
			style:"background:#ffaaaa;border:1px solid red;height:50px;width:50px;"
		},
		2:{
			name:"item",
			img:"",
			desc:"",
			style:"background:lightblue;border:1px solid blue;height:50px;width:50px;"
		},
		3:{
			name:"solid",
			img:"",
			desc:"",
			style:"background:grey;border:1px solid black;height:50px;width:50px;"
		},
		4:{
			name:"sprites",
			img:"",
			desc:"",
			style:"background:lightgrey;border:1px solid grey;height:50px;width:50px;"
		},
		5:{
			name:"light",
			img:"",
			desc:"",
			style:"background:white;border:1px solid yellow;height:50px;width:50px;"
		},
		6:{
			name:"particules",
			img:"",
			desc:"",
			style:"background:purple;border:1px solid orange;height:50px;width:50px;"
		}
	};
	/*Properties*/
	this.mainDim={
		h:0,
		w:0
	};
	this.ruler={
		h:50,
		w:50
	};

	/*Functions*/
	this.dimSet=function(){
		var view=document.getElementById("view");
		self.mainDim.h=window.screen.availHeight-document.getElementById("header").offsetHeight-document.getElementById("footer").offsetHeight;
		self.mainDim.w=window.screen.availWidth;

		//set main height
		document.getElementById("main").style.height=self.mainDim.h+'px';
		//set level properties
		self.view.h=document.getElementById("tl_h").value=self.mainDim.h;view.style.height=self.view.h+'px';
		self.view.w=document.getElementById("tl_w").value=self.mainDim.w-document.getElementById("tools").offsetWidth;view.style.width=self.view.w+'px';
		document.getElementById("tl_ruler_h").value=self.ruler.h;
		document.getElementById("tl_ruler_w").value=self.ruler.w;
		self.view.ruler.set();
		//set objects
		self.obj.init();
	};

	this.eventsBind=function(){
		//level events
		document.getElementById("tl_h").addEventListener("change", self.view.setHeight);
		document.getElementById("tl_w").addEventListener("change", self.view.setWidth);
		document.getElementById("tl_ruler_on").addEventListener("change", self.view.ruler.change);
		document.getElementById("tl_ruler_btn").addEventListener("click", self.view.ruler.set);
		//objects events
		document.getElementById("view").addEventListener("drop", self.view.drop);
		document.getElementById("view").addEventListener("dragover", self.view.dragOver);
		document.getElementById("view").addEventListener("click", function(){alert("click");});
	};

	this.view={
		h:0,
		w:0,
		dragOver:function(e){
			e.preventDefault();
		},
		drop:function(e){
			e.preventDefault();
			var data=e.dataTransfer.getData("Text");
			e.target.appendChild(document.getElementById(data).cloneNode());
		},
		ruler:{
			change:function(e){
				debugger;
				if(e.currentTarget.value=="on"){
					self.view.ruler.show();
				}else{
					self.view.ruler.hide();
				}
			},
			hide:function(){
				document.getElementById("ruler").style.visibility="hidden";
			},
			set:function(){
				var ruler=document.getElementById("ruler"), nbR, nbC, html='';

				self.ruler.h=document.getElementById("tl_ruler_h").value;
				self.ruler.w=document.getElementById("tl_ruler_w").value;

				nbR=Math.floor(self.view.h/self.ruler.h);
				nbC=Math.floor(self.view.w/self.ruler.w);
				ruler.style.height=self.view.h+'px';
				ruler.style.width=self.view.w+'px';

				for(var i=0;i<=nbR;i++){
					html+='<tr>';
					for(var j=0;j<nbC;j++){
						html+='<td class="case" style="height:'+self.ruler.h+'px;width:'+self.ruler.w+'px;"></td>';
					}
					html+='</tr>';
				}
				ruler.innerHTML='<table>'+html+'</table>';
			},
			show:function(){
				document.getElementById("ruler").style.visibility="visible";
			}
		},
		setHeight:function(){
			self.view.h=document.getElementById("tl_h").value;
			document.getElementById("view").style.height=self.view.h+'px';
		},
		setWidth:function(){
			self.view.w=document.getElementById("tl_w").value;
			document.getElementById("view").style.width=self.view.w+'px';
		}
	};

	this.obj={
		drag:function(e){
			e.dataTransfer.setData("Text",e.target.id);
		},
		init:function(){
			var html='', tr;

			for(var x in obj_list){
				if(obj_list.hasOwnProperty(x)){
					html+='<tr class="tr_ol" olid="'+x+'"><td class="td_ol_first">';
					if(obj_list[x].img){
						html+='<img id="olid'+x+'" olid="'+x+'" draggable="true" class="t_obj_ui" src="'+obj_list[x].img+'" />';
					}else{
						html+='<div id="olid'+x+'" olid="'+x+'" draggable="true" class="t_obj_ui" style="'+obj_list[x].style+'"></div>';
					}
					html+='</td><td title="'+obj_list[x].desc+'">'+obj_list[x].name+'</td>';
					html+='</tr>';
				}
			}

			document.getElementById("t_obj").innerHTML='<table id="t_obj_list">'+html+'</table>';
			tr=document.getElementsByClassName("t_obj_ui");
			for(var i=0;i<tr.length;i++){
				if(tr.hasOwnProperty(i)){
					tr[i].addEventListener("dragstart", self.obj.drag);
				}
			}
		}
	};

	this.init=function(){
		self.dimSet();
		self.eventsBind();
	};

	/*Init*/
	self.init();
}