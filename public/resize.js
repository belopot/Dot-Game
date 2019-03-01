/****************************************/
/********* window resize event **********/
/****************************************/

window.addEventListener("resize", doResize, false);

var surface = null;
var container = null;

//window resize function
function doResize() {

    var minRatio = 0.1;

    if(!surface)
        surface = document.getElementById("gameCanvas");

    if(!container)
        container = document.getElementById("Cocos2dGameContainer");

	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0];

    surface.width = w.innerWidth || e.clientWidth || g.clientWidth;
    surface.height = w.innerHeight|| e.clientHeight|| g.clientHeight;
    //window.top.scrollTo(0, 1);
}
