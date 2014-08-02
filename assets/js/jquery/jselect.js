(function($,d,w){
var 
ie=!!w.ActiveXObject,
ie6=ie&&!w.XMLHttpRequest,

config={
	speed:"fast"
},

defaultOptions={
	defaultValue:null,
	defaultCaption:null,
	grouplessLabel:'others',
	width:null,
	maxHeight:320,
	maxTop:1,
	maxColumn:5
},

declickInit=false,

autoIndex=1,

activePanel=[];

// Check if value [v] is undefined
function no(v){
	return typeof v=="undefined";
}

// Check if value [v] is a function
function isfn(v){
	return typeof v=="function";
}

function scrollPos(){
	var p={left:0,top:0,width:0,height:0};
	if(self.innerHeight){
		p.height=self.innerHeight;
		p.width=self.innerWidth;
		p.left=self.pageXOffset;
		p.top=self.pageYOffset;
	}else if(ie6){
		p.height=d.documentElement.clientHeight;
		p.width=d.documentElement.clientWidth;
		p.top=d.documentElement.scrollTop;
		p.left=d.documentElement.scrollLeft;
	}else if(d.body){
		p.height=d.body.clientHeight;
		p.width=d.body.clientWidth;
		p.left=d.body.scrollLeft;
		p.top=d.body.scrollTop;
	}
	return p;
}

var fn={
	init:function(options){
        if(!declickInit){
            declickInit=true;
			$(w).resize(function(){
				if(activePanel.length>0){
					var i,that,panel,pos;
					for(i=0;i<activePanel.length;i++){
						that=activePanel[i];
						panel=that._panel;
						pos=fn.panelPosition(that,panel,fn.options(that));
						panel.css({left:pos.x,top:pos.y});
					}
				}
			});
            $(d).click(function(e){
            	var ob=$(e.srcElement?e.srcElement:e.target),papa,tmp;
                if(ob.hasClass("jselect-panel")||ob.hasClass("jselect")
					||ob.hasClass("jselect-panel-tab")){
                    return;
                }
				papa=ob.parent();
                if(papa.hasClass("jselect")||papa.hasClass("jselect-panel-tab")){
					return;
				}
				papa=papa.parent().parent();
				if(papa.hasClass("jselect-panel")){
					if(tmp=papa.attr("id")){
						tmp=$("a[rel='"+tmp+"']:first")[0];
						if(tmp&&typeof tmp._multiple!="undefined"&&tmp._multiple){
							return;
						}
					}
				}
            	fn.panelClean();
            });
        }
		return this.each(function(){
			if(no(this.nodeName)){
				return;
			}
			var k;
			options=options||{};
			for(k in defaultOptions){
				if(typeof options[k]=="undefined"){
					options[k]=defaultOptions[k];
				}
			}
			
			k=this.nodeName.toLowerCase()+'Init';
			if(isfn(fn[k])){
				fn[k].call(this,options);
			}
		});
	},
	stopDeclick:function(e){
        e=e||w.event;
        if(e.stopPropagation)e.stopPropagation();
        else e.cancelBubble=true;
	},
	_selectCreateBlockHtml:function(that){
		var htm='';
		$(that).find("> option").each(function(){
			if(no(this.text)){
				this.text=this.value;
			}
			htm+='<li><a href="javascript:;" rel="'+this.value+'">'+this.text+'</a></li>';
		});
		return '<ul>'+htm+'</ul>';
	},
	_selectCreateHtml:function(id,name,that,options){
		var htm,idText,nameText,autoId=autoIndex;
		autoIndex++;
		
		htm=fn._selectCreateBlockHtml(that);

		idText   = (id?' id="'+id+'" ':'');
		nameText = (name?' name="'+name+'" ':'');
		
		$(that).after('<a href="javascript:;" class="jselect" rel="__jselect'+autoId+'">'
			+'<input type="hidden" '+idText+nameText+' value="" />'
			+'<em></em><i>&#9660;</i></a>');
		$("body:first").append('<div class="jselect-panel" id="__jselect'
			+autoId+'" style="display:none">'+htm+'</div>');
		return autoId;
	},
	_selectCreateHtmlWithOptgroup:function(id,name,that,options){
		var htm='',ob,i,idText,nameText,tab='',index=0,autoId=autoIndex;
		autoIndex++;
		
		// find options inside optgroup
		$(that).find("optgroup").each(function(){
			index++;
			tab+='<em>'+(this.label||index)+'</em>';
			htm+=fn._selectCreateBlockHtml(this);
		});
		
		// find options without optgroup
		ob=$(that).find("> option");
		if(ob.size()>0){
			index++;
			tab+='<em>'+options.grouplessLabel+'</em>';
			htm+=fn._selectCreateBlockHtml(that);
		}
		
		idText   = (id?' id="'+id+'" ':'');
		nameText = (name?' name="'+name+'" ':'');
		
		$(that).after('<a href="javascript:;" class="jselect" rel="__jselect'+autoId+'">'
			+'<input type="hidden" '+idText+nameText+' value="" />'
			+'<em></em><i>&#9660;</i></a>');
		$("body:first").append('<div class="jselect-panel" id="__jselect'
			+autoId+'" style="display:none">'
			+'<div class="jselect-panel-tab">'+tab+'</div>'+htm+'</div>');
		return autoId;
	},
	selectInit:function(options){
		var that=this,me=$(that),ob,id=that.id,name=that.name,selected,group,autoId;

		// 在ipad下面，要继承options.change事件到me

		if(!name&&!id){
			return;
		}
		
		// make jform element
		if($(that).find("optgroup").size()<1){
			autoId=fn._selectCreateHtml(id,name,that,options);
			group=false;
		}else{ // with optgroup
			autoId=fn._selectCreateHtmlWithOptgroup(id,name,that,options);
			group=true;
		}
		ob   = me.next();
		that = ob[0];
		
		// init vars
		that._options = options;
		that._panel   = $("#__jselect"+autoId);
		that._value   = ob.find("input:first");
		that._caption = ob.find("em:first");
		if(options.width>0){
			ob.css("width",options.width);
		}
		that._selectWidth       = ob.width();
		that._group             = group;
		that._multiple          = this.multiple;
		that._initSelectedIndex = this.options.selectedIndex;
		
		// init panel
		if(!group){
			fn.panelInit(that,that._panel,options);
			fn.panelArrange(that,that._panel,options);
		}else{ // with optgroup
			that._tab = that._panel.find("div.jselect-panel-tab:first");
			fn.panelInitWithOptgroup(that,that._panel,options);
			fn.panelArrangeWithOptgroup(that,that._panel,options);
		}
		
		// init event
		ob.click(fn.selectClick);
		if(isfn(options.change)){
			that._value.change(options.change);
		}
		
		// cleanup
		me.remove();
	},
	_panelBlockInit:function(that,ul){
		$(ul).find("a").each(function(){
	        if(this.rel){
	            var ob=this;
    	        $(this).click(function(e){
    	            fn.panelItemClick.apply(that,[e,ob.rel,$(ob).text()]);
    	        });
	        }
	    });
	},
	_panelValueInit:function(that,panel,options){
		var val='',caption='';
		
		if(that._initSelectedIndex>-1){
			var ob=panel.find("a:eq("+that._initSelectedIndex+")");
			val=ob.attr("rel");
			caption=ob.text();
		}
		
		if(null!==options.defaultValue){
			val=options.defaultValue;
			caption=(null===options.defaultCaption?val:options.defaultCaption);
		}

		fn.selectSetValue.call(that,val,caption,options);
	},
	panelInit:function(that,panel,options){
		fn._panelBlockInit(that,panel);
		fn._panelValueInit(that,panel,options);
	},
	panelArrange:function(that,panel,options){
		var border=fn.borderSize(panel),
			gridWidth=$(that).outerWidth()-border.width,
			// gridWidth=that._selectWidth-border.width,
			n=1;
			
		panel.css({width:gridWidth,height:"auto"}).find("li").css("width",gridWidth);
		while((that._panelHeight=panel.height())>options.maxHeight){
			if(++n<=options.maxColumn){
				panel.css("width",gridWidth*n);
			}else{
				options.maxHeight=panel.height();
				break;
			}
		}
	},
	panelInitWithOptgroup:function(that,panel,options){
		// init tab
		that._panel.find("div.jselect-panel-tab em").hover(function(){
			$(this).addClass('jselect-panel-tab-hover');
		},function(){
			$(this).removeClass('jselect-panel-tab-hover');
		}).each(function(idx){
			$(this).click(function(){
				fn._panelTabSwitch(that,idx);
			})
		});
		
		// init tab block content
		panel.find("> ul").each(function(idx){
			fn._panelBlockInit(that,this);
		});
		
		fn._panelValueInit(that,panel,options);
	},
	panelArrangeWithOptgroup:function(that,panel,options){
		var border=fn.borderSize(panel),
			gridWidth=$(that).outerWidth()-border.width,
			n=1,blocks;
			
		that._panelWidth=0;
		that._panelHeight=0;
		
		that._panelTabWidth=0;
		that._panelTabHeight=0;
		
		if(panel.find("> ul").size()<1){
			return;
		}
		
		gridHeight=panel.find("li:first").height();
		
		blocks=panel.find("> ul");
		
		// find max width firset
		blocks.each(function(idx){
			var ul=$(this),rows=0,n=1,tempHeight,qty=0;
			
			// when calc tab block size, we must hide other blocks temporary
			blocks.hide();
			ul.css("display","block");
			
			panel.css({width:gridWidth,height:"auto"})
			ul.find("li").css("width",gridWidth);
			while((tempHeight=panel.height())>options.maxHeight){
				if(++n<=options.maxColumn){
					panel.css("width",gridWidth*n);
				}else{
					break;
				}
			}
			
			that._panelWidth=Math.max(panel.width(),that._panelWidth);
		});
		
		// then find max height
		blocks.each(function(idx){
			var ul=$(this),rows=0,n=1,tempHeight,qty=0;
			
			// when calc tab block size, we must hide other blocks temporary
			blocks.hide();
			ul.css("display","block");
			
			panel.css({width:that._panelWidth,height:"auto"})
			ul.find("li").css("width",gridWidth);
			while((tempHeight=panel.height())>options.maxHeight){
				if(++n<=options.maxColumn){
					panel.css("width",gridWidth*n);
				}else{
					options.maxHeight=panel.height();
					break;
				}
			}

			that._panelHeight=Math.max(panel.height(),that._panelHeight);
		});
		
		// active first tab
		that._tab.find("em:eq(0)").addClass("jselect-panel-tab-on");
		that._panel.find("> ul").each(function(idx){
			if(idx>0){
				$(this).hide();
			}else{
				$(this).show();
			}
		});
	},
	_panelTabSwitch:function(that,index){
		var tab=that._panel.find("div.jselect-panel-tab");
		tab.find("em").removeClass("jselect-panel-tab-on").eq(index).addClass("jselect-panel-tab-on");
		that._panel.find("> ul").hide().eq(index).show();
		that._panel.css({width:that._panelWidth,height:that._panelHeight});
	},
	panelPosition:function(that,panel,options,usePanelLeft){
		var p=scrollPos(),me=$(that),options=fn.options(that),border,px,py,pw,ph;
		border=fn.borderSize(panel);
		pw=(that._group?that._panelWidth:panel.width());
		ph=Math.min(that._panelHeight,options.maxHeight);
		px=(usePanelLeft?panel.offset().left:me.offset().left);
		py=me.offset().top+parseInt(me.outerHeight()/2)-parseInt(ph/2)-parseInt(border.height/2);
		
		// console.log('calc px=',px);
		if(py<p.top+options.maxTop){
			// top aligned
			py=me.offset().top;
		}
		if(py+ph>p.top+p.height){
			// bottom aligned
			py=me.offset().top+me.outerHeight()-ph-border.height;
		}
		if(py+ph>p.top+p.height){
			py=p.top+p.height-ph-border.height;
		}
		if(px+pw>p.left+p.width){
			px=p.left+p.width-pw-border.width;
		}
		if(px<0){
			px=0;
		}
		if(py<0){
			py=options.maxTop;
		}
		
		return {x:px,y:py,w:pw,h:ph};
	},
	selectClick:function(e){
		var that=this,me=$(that),options=fn.options(that),border,panel,pos;
		panel=that._panel;
		fn.stopDeclick(e);
        fn.panelClean();
		me.blur();
		if(panel.is(":visible")){
	        return;
	    }
	    
		border=fn.borderSize(panel);
		panel.show().css({
			// opacity:1,
			height:(me.outerHeight()-border.height),
			left:me.offset().left,
			top:me.offset().top
		});
		if(that._group){
			panel.css("width",that._panelWidth);
		}
		pos=fn.panelPosition(that,panel,options,true);
		that._panel.animate({height:pos.h,left:pos.x,top:pos.y},config.speed);
		activePanel.push(that);
	},
	panelReset:function(newData,selectedValue){
		var that=this,panel=that._panel,options=fn.options(that),htm='',i,k;
		
		that._initSelectedIndex=0;

		i=0;
		for(k in newData){
			if(selectedValue==k){
				that._initSelectedIndex=i;
			}
			htm+='<li><a href="javascript:;" rel="'+k+'">'+newData[k]+'</a></li>';
			i++;
		}

		// should check optgroup later..
		
		panel.css("height","auto");
		panel.find("ul:first").html(htm);
		
		fn.panelInit(that,panel,options);
		fn.panelArrange(that,panel,options);
	},
	panelHide:function(){
		var me=$(this),panel=this._panel,border=fn.borderSize(panel),z;
		z=panel.css('z-index');
		panel.css('z-index',z-1);
		panel.animate({
			// opacity:0.3,
			height:(me.outerHeight()-border.height),
			left:me.offset().left,
			top:me.offset().top
		},config.speed,function(){
			panel.hide();
			panel.css('z-index',z);
		});
	},
	panelClean:function(){
	    var ob;
	    while(ob=activePanel.pop()){
            fn.panelHide.apply(ob);
	    }
	},
	_setValue:function(that,val,caption){
		that._caption.html(caption);
	    that._value.val(val).attr("rel",caption);
	},
	selectSetValue:function(val,caption,options){
		var that=this,me=$(that),options=fn.options(that);
		if(!that._multiple){
			that._panel.find("a").removeClass("jselect-link-on");
			that._panel.find("a[rel='"+val+"']").addClass("jselect-link-on");
		}else{
			var tc=[],tv=[];
			that._panel.find("a").each(function(){
				var ob=$(this);
				if(!no(this.rel)&&this.rel==val){
					ob.toggleClass("jselect-link-on");
				}
				if(ob.hasClass("jselect-link-on")){
					tc.push(ob.text());
					tv.push(this.rel);
				}
			});
			if(tv.length>0||options.defaultValue===null){
				caption=tc.join(",");
				val=tv.join("|^|");
			}else{ // use default value when non selected
				val=options.defaultValue;
				caption=options.defaultCaption||options.defaultValue;
			}
		}
		
		fn._setValue(this,val,caption);

		if(this._caption.width()+26>that._selectWidth){
			me.width(this._caption.width()+26);
		}
		if(this._caption.width()+26<that._selectWidth){
			me.width(that._selectWidth);
		}
		
		// use text underline to mark up selected optgroup tabs
		if(that._group){
			var i,eqs={};
			that._tab.find("em").css("text-decoration","none");
			that._panel.find("a.jselect-link-on").each(function(){
				eqs[$(this).parent().parent().index()-1]=1;
			});
			for(i in eqs){
				that._tab.find("em:eq("+i+")").css("text-decoration","underline");
			}
		}
	},
	panelItemClick:function(e,val,caption){
		var that=this,me=$(that),options=fn.options(that);
		
		if(!that._multiple){
			fn.panelClean();
		}
		
		fn.selectSetValue.call(that,val,caption,options);
		
	    that._value.trigger("change");
	},
	_castByType:function(type){
		var k,t;
		if(typeof this.nodeName=="string"){
			k=this.nodeName.toLowerCase()+type;
			if(isfn(fn[k])){
				fn[k].call(this);
			}
		}
	},
	showItem:function(){
		this.each(function(){
			fn._castByType.call(this,"Show");
		});
	},
	hideItem:function(){
		this.each(function(){
			fn._castByType.call(this,"Hide");
		});
	},
	hideAll:function(){
		fn.panelClean();
	},
	borderSize:function(ob){
		var tmp=$(ob);
		return {
			width:(parseInt(tmp.css("border-left-width"))+parseInt(tmp.css("border-right-width"))),
			height:(parseInt(tmp.css("border-top-width"))+parseInt(tmp.css("border-bottom-width")))
		}
	},
	options:function(ob){
		return(ob._options?ob._options:{});
	},
	value:function(){
		if(this._value){
			return this._value.val();
		}
		return this.value;
	},
	caption:function(){
		if(this._value){
			return this._value.attr("rel");
		}
		return this.rel;
	}
};

// Publish jform static
$.jselect={
	// Get config [key] value
	config:function(key){
		return(typeof config[key]=="undefined"?u:config[key]);
	},
	
	// Set config [key] to [val]
	setConfig:function(key,val){
		if(typeof key=="object"){
			for(var k in key){
				config[k]=key[k];
			}
		}else{
			config[key]=val;
		}
	},
	
	hide:fn.hideAll
};

// Publish jselect object
$.fn.extend({
    // Object entry
	jselect:function(){
	    fn.init.apply(this,arguments);
	},
	jselectShow:function(){
	    fn.showItem.apply(this,arguments);
	},
	jselectHide:function(){
	    fn.hideItem.apply(this,arguments);
	},
	jselectValue:function(){
		if(this.size()<1){
			return null;
		}
		return fn.value.apply(this[0]);
	},
	jselectCaption:function(){
		if(this.size()<1){
			return null;
		}
		return fn.caption.apply(this[0]);
	},
	jselectReset:function(){
		var arg=arguments;
		return this.each(function(){
			if($(this).is("input:hidden")){
				fn.panelReset.apply($(this).parent()[0],arg);
				return;
			}
			if(this._panel){
				fn.panelReset.apply(this,arg);
				return;
			}
		});
	}
});
})(jQuery,document,window);
