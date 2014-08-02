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
		debug:false
	};
	
if(navigator.userAgent.indexOf("MSIE 9.")>0
	||navigator.userAgent.indexOf("MSIE 10.")>0
	||navigator.userAgent.indexOf("MSIE 11.")>0){
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
	fn.initSideMenu();
}

function initObject(ob){
	ob=ob||d;
	
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
}

//
// public:
//

var fn={
	initSideMenu:function(){
		var menua=$(e("pz-side")).find("div.pz-menu ul li a");
		menua.click(function(){
			menua.removeClass("link-on");
			$(this).addClass("link-on");
		});
		$(e("pz-side")).find("div.pz-menu > a").each(function(){
			var me=$(this),sub=me.parent().find("ul");
			if(sub.size()>0)me.click(function(){
				if(sub.is(":visible")){
					sub.slideUp("fast");
					me.blur().find("i").html("&#xf078;");
				}else{
					sub.slideDown("fast");
					me.blur().find("i").html("&#xf077;");
				}
			});
		});
    
        $("#pz-dock-item dd a").click(function(){
            if ($(this).hasClass("link-on")) return;
            $("#pz-dock-item dd a").removeClass("link-on");
            $("#pz-side div.pz-side-package").hide();
            $(this).addClass("link-on");
            $("#pz-side div.pz-side-package").eq($(this).parent().index()).show();
        });
	},
	
	haltEvent:function(e){
	    if(!e)e=w.event;
	    if(e.stopPropagation)e.stopPropagation();
	    else e.cancelBubble=true;
	    if(e.preventDefault)e.preventDefault();
	    else e.returnValue=false;
		return false;
	}
};

w.pztop=fn;

// top init
$(init);

})(document,window,jQuery);
