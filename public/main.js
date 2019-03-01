/****************************************/
/*********** main game file *************/
/****************************************/
window.addEventListener("load", startGame, false);

var surface = null;
var container = null;

//window resize function
function startGame() {

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

    //game start callback
    cc.game.onStart = function(){
        if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
            document.body.removeChild(document.getElementById("cocosLoading"));

        FBInstant.initializeAsync()
        .then(function() {
            // Start loading game assets here
            cc.loader.resPath = "res";
            LoadingScene.preload(g_resource, function () {
            cc.director.setClearColor(cc.color(255, 255, 255));
            FBInstant.startGameAsync()
            .then(function() {
                cc.director.runScene(new SplashScene());
            });
            FBInstant.onPause(function() {
                console.log('Pause event was triggered!');
            });
            }, this);
        });
    };
    cc.game.run();
}
