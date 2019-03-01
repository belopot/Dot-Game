/****************************************/
/******** Loading Scene(splash) *********/
/*this scene is called from cc.Boot
/****************************************/

var LoadingScene = cc.Scene.extend({

    //override init() callback from cc.Scene
    //when call construnctor
    init : function(){

        var scaleX = cc.visibleRect.width / RESOLUTION_WIDTH;
        var scaleY = cc.visibleRect.height / RESOLUTION_HEIGHT;

        this.m_fScale = 1.0;
        if(scaleX < scaleY)
            this.m_fScale = scaleX;
        else
            this.m_fScale = scaleY;

        this.m_fLeftInterval = (cc.visibleRect.width - Math.floor(RESOLUTION_WIDTH * this.m_fScale)) / 2.0;
        this.m_fTopInterval = (cc.visibleRect.height - Math.floor(RESOLUTION_HEIGHT * this.m_fScale)) / 2.0;

        //background layer (white color)
        this.bg_layer = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(this.bg_layer);

        //splash logo
        this.logo = new cc.Sprite(s_logo);
        this.logo.setAnchorPoint(0.5, 0.5);
        this.logo.setPosition(this.m_fLeftInterval + RESOLUTION_WIDTH / 2 * this.m_fScale, this.m_fTopInterval + RESOLUTION_HEIGHT / 2 * this.m_fScale);
        this.logo.setScale(this.m_fScale);
        this.bg_layer.addChild(this.logo);

        //loading text
        this.lbl_percent = new cc.LabelTTF("Loading... 0%", "Arial", 30 * this.m_fScale);
        this.lbl_percent.setPosition(this.m_fLeftInterval + RESOLUTION_WIDTH / 2 * this.m_fScale, this.m_fTopInterval + RESOLUTION_HEIGHT / 2 * this.m_fScale - 90 * this.m_fScale);
        this.lbl_percent.setColor(cc.color(0, 0, 0));
        this.bg_layer.addChild(this.lbl_percent);

        return true;
    },

    //override scene enter callback
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.schedule(this._startLoading, 0.3);
    },

    //override scene exit callback
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        FBInstant.setLoadingProgress(100);
        this.lbl_percent.setString(tmpStr);
    },

    //init resource file list will be preload
    initWithResources: function (resources, cb, target) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    //loading resource files using cc.loader
    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self.lbl_percent.setString("Loading... " + percent + "%");
                FBInstant.setLoadingProgress(percent);
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
            });
    },

    //set transform target
    _updateTransform: function(){
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this.bg_layer._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this.lbl_percent._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
});

//preload resource files
LoadingScene.preload = function(resources, cb, target){

    var loadingScene = null;
    if(!loadingScene) {
        loadingScene = new LoadingScene();
        loadingScene.init();
        cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function(){
            loadingScene._updateTransform();
        });
    }
    loadingScene.initWithResources(resources, cb, target);

    cc.director.runScene(loadingScene);
    return loadingScene;
};
