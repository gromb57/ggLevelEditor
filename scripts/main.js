function GgLEMain(){
	var self=this,
	obj_list={
		0:{
			type:"spawn",
			img:"",
			desc:"",
			style:"background:lime;border:1px solid green;height:50px;width:50px;"
		},
		1:{
			type:"ennemies",
			img:"",
			desc:"",
			style:"background:#ffaaaa;border:1px solid red;height:50px;width:50px;"
		},
		2:{
			type:"item",
			img:"",
			desc:"",
			style:"background:lightblue;border:1px solid blue;height:50px;width:50px;"
		},
		3:{
			type:"solid",
			img:"",
			desc:"",
			style:"background:grey;border:1px solid black;height:50px;width:50px;"
		},
		4:{
			type:"sprites",
			img:"",
			desc:"",
			style:"background:lightgrey;border:1px solid grey;height:50px;width:50px;"
		},
		5:{
			type:"light",
			img:"",
			desc:"",
			style:"background:white;border:1px solid yellow;height:50px;width:50px;"
		},
		6:{
			type:"particules",
			img:"",
			desc:"",
			style:"background:purple;border:1px solid orange;height:50px;width:50px;"
		}
	},
	view=document.getElementById("view"),
	obj_id=0;
	/*Properties*/
	this.mainDim={
		h:0,
		w:0
	};
	this.ruler={
		h:50,
		w:50
	};
	this.fileSystem;

	/*Functions*/
	this.dimSet=function(){
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
		var h1;
		//level events
		document.getElementById("tl_h").addEventListener("change", self.view.setHeight);
		document.getElementById("tl_w").addEventListener("change", self.view.setWidth);
		document.getElementById("tl_ruler_on").addEventListener("change", self.view.ruler.change);
		document.getElementById("tl_ruler_btn").addEventListener("click", self.view.ruler.set);
		//objects events
		view.addEventListener("drop", self.view.drop);
		view.addEventListener("dragover", self.view.dragOver);
		//objects properties events
		document.getElementById("top_x").addEventListener("change", self.objProp.changeX);
		document.getElementById("top_y").addEventListener("change", self.objProp.changeY);
		document.getElementById("top_dup_btn").addEventListener("click", self.objProp.duplicate);
		document.getElementById("top_rm_btn").addEventListener("click", self.objProp.remove);
		//function events
		document.getElementById("import").addEventListener("click", self.func.LEImp);
		document.getElementById("export").addEventListener("click", self.func.LEExp);
		//misc events
		h1=document.getElementsByTagName("h1");
		for(var i=0;i<h1.length;i++){
			h1[i].addEventListener("click", self.fn.toggleNext);
		}
	};

	this.view={
		h:0,
		w:0,
		dragOver:function(e){
			e.preventDefault();
		},
		drop:function(e){
			e.preventDefault();
			var new_id=e.dataTransfer.getData("new_id"), newElm;

			if(e.dataTransfer.getData("isMoved")){
				newElm=document.getElementById(e.dataTransfer.getData("id"));
			}else{
				newElm=document.getElementById(e.dataTransfer.getData("id")).cloneNode();
				e.target.appendChild(newElm);
			}

			newElm.setAttribute("id", new_id);
			newElm.style.left=e.offsetX+'px';
			newElm.style.top=e.offsetY+'px';
			newElm.addEventListener("dragstart", self.obj.drag);
			newElm.addEventListener("click", self.obj.getProperties);

			if(e.dataTransfer.getData("isMoved")){
			}else{
				newElm.click();
			}
		},
		ruler:{
			change:function(e){
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
			view.style.height=self.view.h+'px';
		},
		setWidth:function(){
			self.view.w=document.getElementById("tl_w").value;
			view.style.width=self.view.w+'px';
		}
	};

	this.obj={
		clone:function(e){
			e.dataTransfer.setData("id",e.target.id);
			e.dataTransfer.setData("new_id",e.target.id+obj_id++);
		},
		drag:function(e){
			obj_id++;
			e.dataTransfer.setData("id",e.target.id);
			e.dataTransfer.setData("new_id",e.target.id+obj_id);
			e.dataTransfer.setData("isMoved", true);
		},
		getProperties:function(e){
			self.objProp.vars.sel=e.currentTarget;
			document.getElementById("top_id").innerText=e.currentTarget.id;
			document.getElementById("top_type").innerText=obj_list[e.currentTarget.getAttribute("olid")].type;
			document.getElementById("top_x").value=e.currentTarget.offsetLeft;
			document.getElementById("top_y").value=e.currentTarget.offsetTop;
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
					html+='</td><td title="'+obj_list[x].desc+'">'+obj_list[x].type+'</td>';
					html+='</tr>';
				}
			}

			document.getElementById("t_obj").innerHTML='<table id="t_obj_list">'+html+'</table>';
			tr=document.getElementsByClassName("t_obj_ui");
			for(var i=0;i<tr.length;i++){
				if(tr.hasOwnProperty(i)){
					tr[i].addEventListener("dragstart", self.obj.clone);
				}
			}
		}
	};

	this.objProp={
		vars:{
			sel:null
		},
		changeX:function(){
			self.objProp.vars.sel.style.left=document.getElementById("top_x").value+'px';
		},
		changeY:function(){
			self.objProp.vars.sel.style.top=document.getElementById("top_y").value+'px';
		},
		duplicate:function(){
			var newElm=self.objProp.vars.sel.cloneNode();
			view.appendChild(newElm);

			obj_id++;
			newElm.setAttribute("id", "olid"+newElm.getAttribute("olid")+obj_id);
			newElm.style.left=newElm.offsetLeft+newElm.offsetHeight+'px';
			newElm.addEventListener("dragstart", self.obj.drag);
			newElm.addEventListener("click", self.obj.getProperties);

			newElm.click();
		},
		remove:function(){
			self.objProp.vars.sel.parentNode.removeChild(document.getElementById(document.getElementById("top_id").innerText));
		}
	};

	this.fn={
		errorHandler:function(e){
		    var msg = '';

		    switch (e.code) {
		      case FileError.QUOTA_EXCEEDED_ERR:
		        msg = 'QUOTA_EXCEEDED_ERR';
		        break;
		      case FileError.NOT_FOUND_ERR:
		        msg = 'NOT_FOUND_ERR';
		        break;
		      case FileError.SECURITY_ERR:
		        msg = 'SECURITY_ERR';
		        break;
		      case FileError.INVALID_MODIFICATION_ERR:
		        msg = 'INVALID_MODIFICATION_ERR';
		        break;
		      case FileError.INVALID_STATE_ERR:
		        msg = 'INVALID_STATE_ERR';
		        break;
		      default:
		        msg = 'Unknown Error';
		        break;
		    };

		    console.error('Error: ' + msg);
		},
		initFS:function(){
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
				self.fileSystem=fs;
			}, self.fn.errorHandler);
		},
		toggleNext:function(e){
			var ns=e.currentTarget.nextElementSibling;
			if(ns.style.display == "none"){
				ns.style.display="";
			}else{
				ns.style.display="none";
			}
		}
	};

	this.ui={
		dialog:{
			vars:{
				overlay:null,
				dialog:null
			},
			close:function(){
				if(self.ui.dialog.vars.overlay){
					document.body.removeChild(self.ui.dialog.vars.overlay);
					self.ui.dialog.vars.overlay=null;
				}
			},
			open:function(message, buttons){
				var dialog, overlay, dialogT, dialogB, dialogC, dialogTBtn, button;
				self.ui.dialog.close();
				overlay=self.ui.dialog.vars.overlay=document.createElement("div");
				dialog=self.ui.dialog.vars.dialog=document.createElement("div");

				document.body.appendChild(overlay);
				overlay.style.position='absolute';
				overlay.style.left=0;
				overlay.style.top=0;
				overlay.style.height=document.body.clientHeight+'px';
				overlay.style.width=document.body.clientWidth+'px';
				overlay.style.background='rgba(200,200,200,.5)';
				overlay.style["z-index"]=3;

				overlay.appendChild(dialog);
				dialog.style.width="40%";
				dialog.style.margin="auto";
				dialog.style["margin-top"]=(document.body.clientHeight/2-(document.body.clientHeight*0.4))+'px';
				dialog.style.background='rgba(200,150,100,1)';
				dialog.style.color='rgba(0,0,0,1)';

				//top
				dialogT=document.createElement("div");
				dialog.appendChild(dialogT);
				dialogT.style["min-height"]="2em";
				//top close btn
				dialogTBtn=document.createElement("div");
				dialogT.appendChild(dialogTBtn);
				dialogTBtn.style.cssFloat="right";
				dialogTBtn.style.cursor="pointer";
				dialogTBtn.innerText="x";
				dialogTBtn.addEventListener("click", self.ui.dialog.close);

				//center
				dialogC=document.createElement("div");
				dialog.appendChild(dialogC);
				dialogC.style.padding="1em";
				if(message) dialogC.innerHTML=message;

				//bottom
				dialogB=document.createElement("div");
				dialog.appendChild(dialogB);
				if(buttons){
					for(var x in buttons){
						if( buttons.hasOwnProperty(x) && buttons[x].hasOwnProperty("function") ){
							button=document.createElement("button");
							button.setAttribute("type", "button");
							button.innerText=x;
							dialogB.appendChild(button);
							button.addEventListener("click", buttons[x]["function"]);
						}
					}
				}

				button=dialogTBtn=dialogT=dialogB=dialogC=overlay=dialog=null;
			}
		}
	};

	this.func={
		LEExp:function(){
			var scene={
				name:document.getElementById("tl_name").value,
				type:"",
				height:document.getElementById("tl_h").value,
				width:document.getElementById("tl_w").value,
				bg:{},
				fb:{},
				objects:{}
			}, sceneStringified, html="";

			for(var x=0;x<view.childNodes.length;x++){
				scene.objects[x]={
					id:view.childNodes[x].id,
					type:obj_list[view.childNodes[x].getAttribute("olid")].type,
					x:view.childNodes[x].offsetLeft,
					y:view.childNodes[x].offsetTop,
					h:view.childNodes[x].clientHeight,
					w:view.childNodes[x].clientWidth
				};
			}

			sceneStringified=JSON.stringify(scene);

			html+='<p>Ci-dessous le code a sauvegarder dans fichier qui pourra être chargé pour votre jeu :</p>';
			html+='<div>'+sceneStringified+'</div>';

			self.ui.dialog.open(html, {
				"Save in local":{
					"function":function(){
						if(window.requestFileSystem){
							window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs){
								//init
								fs.root.getFile('log.json', {create: true, exclusive: true}, function(fileEntry) {
									// Create a FileWriter object for our FileEntry (log.txt).
									fileEntry.createWriter(function(fileWriter) {

										fileWriter.onwriteend = function(e) {
											console.log('Write completed.');
										};

										fileWriter.onerror = function(e) {
											console.log('Write failed: ' + e.toString());
										};

										// Create a new Blob and write it to log.txt.
										var blob = new Blob([JSON.stringify(scene)], {type: 'text/json'});

										fileWriter.write(blob);

									}, self.fn.errorHandler);
								}, self.fn.errorHandler);
							}, self.fn.errorHandler);
						}
					}
				},
				"Dowload":{
					"function":function(){
						uriContent = "data:application/octet-stream," + encodeURIComponent(sceneStringified);
						newWindow=window.open(uriContent, scene.name+'.json');
					}
				}
			});

			/*
			var dirReader = self.fileSystem.root.createReader();
			dirReader.readEntries(function(entries){
				if (!entries.length) {
					filelist.innerHTML = 'Filesystem is empty.';
				} else {
					filelist.innerHTML = '';
				}

				var fragment = document.createDocumentFragment();
				for (var i = 0, entry; entry = entries[i]; ++i) {
					var img = entry.isDirectory ? '<img src="http://www.html5rocks.com/static/images/tutorials/icon-folder.gif">' :
					'<img src="http://www.html5rocks.com/static/images/tutorials/icon-file.gif">';
					var li = document.createElement('li');
					li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
					fragment.appendChild(li);
				}
				filelist.appendChild(fragment);
			}, self.fn.errorHandler);*/

		},
		LEImp:function(){
			
		}
	};

	this.init=function(){
		self.dimSet();
		self.eventsBind();
		self.fn.initFS();
	};

	/*Init*/
	self.init();
}