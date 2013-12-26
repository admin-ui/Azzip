(function(d,w,$){
//
// private:
//
var 
	ie=!!w.ActiveXObject,
	ie6=ie&&!w.XMLHttpRequest,
	lessIe9=true,
	modals=[],
	menus=[],
	config={
		tipsyDelayIn:168,
		effectSpeed:"fast",
		debug:false
	};
	
if(ie&&(navigator.userAgent.indexOf("MSIE 9.")>0
	||navigator.userAgent.indexOf("MSIE 10.")>0
	||navigator.userAgent.indexOf("MSIE 11.")>0)){
	lessIe9=false;
}

// Check if value [v] is a [type]
function is(v,type){
	return typeof v==type;
}

// Check if value [v] is a function
function isfn(v){
	return is(v, "function");
}

// Get element [k] DOM object
function e(k){
	return is(k,"string")?d.getElementById(k):k;
}

// Get element name DOM objects from DOM ob
function en(k,ob){
	return e(ob||d).getElementsByName(k);
}

// Get element tag name DOM objects from DOM ob
function et(k,ob){
	return e(ob||d).getElementsByTagName(k);
}

// Get tag name if [k] starts with "name="
function nameof(k){
	return (k.toLowerCase().indexOf('name=')>-1?k.substr(5):null);
}

// get client and scroll position
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

function init(){
	initObject(d);
	if(!ie) $(w).scroll(function(){
		var p=scrollPos();
		if(p.top>6){
			$(e("pz-shader")).css("opacity","1");
		}else{
			$(e("pz-shader")).css("opacity","0");
		}
	});
    $("a[rel*=section-toggle]").click(function(){
        var h=this.href.split("#").pop();
        setTimeout(function(){
			$("html, body").animate({ scrollTop: ($("#"+h).offset().top-62) });
            // w.scroll(0,$("#"+h).offset().top-62);
        },60);
        return false;
    });
}

function hideAllMenu(){
	var ob;
	while(ob=menus.pop()){
		ob.hide();
	}
}

function initObject(ob){
	ob=ob||d;
	initTab(ob);
	initTable(ob);
	initForm(ob);

	$("a[rel*='menu-down']").click(function(){
		var me=$(this),menu=me.next();
		if(menu.is(":visible")){
			menu.hide();
		}else{
			hideAllMenu();
			menu.show().css({
				top:me.offset().top+me.outerHeight()+3,
				left:me.offset().left
			});
			menus.push(menu);
		}
	});

	$("a[rel*='menu-up']").click(function(){
		var me=$(this),menu=me.next();
		if(menu.is(":visible")){
			menu.hide();
		}else{
			hideAllMenu();
			menu.show().css({
				top:me.offset().top-menu.outerHeight()-3,
				left:me.offset().left
			});
			menus.push(menu);
		}
	});
	
	$(e(ob)).find("a.pz-alert-close").click(function(){
		$(this).parent().slideUp(config.effectSpeed);
	});
	
	$(e(ob)).find(".pz-datetime").calendar({
		showTimeSelect:true
	});
	$(e(ob)).find(".pz-date").calendar({
		showTimeSelect:false
	});
    
    // jquery tools tooltips
    $(".pz-tooltip").each(function(){
        if(this.nodeName && this.nodeName.toUpperCase() == 'DIV') {
            $(this).find("select,input:text,input:password,textarea").tooltip({
                tipClass: 'pz-form-tooltip',
                // effect: 'fade',
                position: "center right",
                offset: [0, 10],
                opacity: 0.7
            });
        } else {
            $(this).tooltip({
                tipClass: 'pz-show-tooltip',
                // effect: 'fade',
                // fadeOutSpeed: 100,
                position: "bottom center",
                offset: [-22, 0],
                predelay: 200
            });
        }
    });
    
    // jquery tools dialog
    $(".pz-dialog-trigger").overlay({
        mask: {
            color: '#fff',
            loadSpeed: 200,
            opacity: 0.5
        },
              
        closeOnClick: true
    });
    
    // jquery tools popshow
    $(".pz-popshow-trigger").overlay();
}

function initTab(ob){
	$(e(ob)).find("div .pz-tab-header").each(function(){
		var act=0;
		$(this).find("a").each(function(idx){
			if($(this).hasClass("link-on"))act=idx;
			$(this).click(function(){
				var i=$(this).index();
				$(this).parent().find("a").removeClass("link-on").eq(i).addClass("link-on");
				$(this).parent().parent().find(".pz-tab").hide().eq(i).show();
			})
		});
		$(this).parent().find(".pz-tab").hide().eq(act).show();
	});
}

function initTable(ob){
	$(e(ob)).find("table.pz-table,table.pz-table > tbody").each(function(){
		$(this).find("> tr:even").addClass("even");
	});
	if(lessIe9){
		$(e(ob)).find("table.pz-border-table > tr,table.pz-border-table > tbody > tr").each(function(){
			$(this).find("td:last,th:last").css("border-right","0");
		});
	}
}

function initForm(ob){
	// $(e(ob)).find("div.pz-form").each(function(){
	// 	$(this).find("div.pz-form-row:odd").addClass("odd");
	// });
}

//
// public:
//

var fn={
	
	_assertInFrame:function(){
		if(typeof top=="undefined"||typeof top.vindex=="undefined"){
			// console.log("not in a frame, can not call top frame javascript function!");
			return false;
		}
		return true;
	},
	
	// Collection form data from DOMs
	formData:function(a){
		var s={},i,j,t,ob,fm=[];
		if(a.constructor == String){
			if(t=nameof(a)){
				ob=en(t);
				for(i=0;i<ob.length;i++){
					fm.push(et('input',ob[i]));
					fm.push(et('textarea',ob[i]));
					fm.push(et('select',ob[i]));
				}
			}else if(ob=e(a)){
				fm.push(et('input',ob));
				fm.push(et('textarea',ob));
				fm.push(et('select',ob));
			}
			if(fm.length<1){
				return s;
			}
			a=[];
			for(i=0;i<fm.length;i++){
				for(j=0;j<fm[i].length;j++){
					a.push(fm[i][j]);
				}
			}
			fm=[];
		}
		for(j=0;j<a.length;j++){
			if(typeof a[j]=="string"){
				if(t=nameof(a[j])){
					ob=en(t);
					for(i=0;i<ob.length;i++){
						fm.push(ob[i]);
					}
				}else{
					fm.push(e(a[j]));
				}
			}else{
				fm.push(a[j]);
			}
		}
		a=[];
		for(j=0;j<fm.length;j++){
			ob=fm[j];
			if(typeof ob.name!="string"){
				continue;
			}
			if(typeof ob.nodeName=='string'){
				switch(ob.nodeName.toLowerCase()){
				case 'select':case 'textarea':
					break;
				case 'input':
					if(typeof ob.type!="string"){
						continue;
					}
					t=ob.type.toLowerCase();
					if('text'==t||'password'==t||'hidden'==t){
						break;
					}
					if(('radio'==t||'checkbox'==t)&&ob.checked){
						break;
					}
					continue;
				}
			}
			t=typeof s[ob.name];
            switch(t.toLowerCase()){
            case "undefined":
                s[ob.name]=ob.value;
                break;
            case "array":
				s[ob.name].push(ob.value);
                break;
            default:
				s[ob.name]=[s[ob.name],ob.value];
            }
		}
		return s;
	},
	
	haltEvent:function(e){
	    if(!e)e=w.event;
	    if(e.stopPropagation)e.stopPropagation();
	    else e.cancelBubble=true;
	    if(e.preventDefault)e.preventDefault();
	    else e.returnValue=false;
		return false;
	},
	
	eventForChange:function(e){
	    if(!e)e=w.event;
		var code = (e.keyCode ? e.keyCode : e.which);
	    if(code!=13&&code!=9)return false;
		return true;
	},
	
	lessThanIe9:function(){
		return lessIe9;
	}
};

w.pzframe=fn;

// frame init
$(init);

})(document,window,jQuery);
