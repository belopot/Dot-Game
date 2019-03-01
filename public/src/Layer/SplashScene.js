/****************************************/
/************* Splash Layer *************/
/****************************************/

var SplashLayer = BaseLayer.extend({

	dot_string : "",

    //override init() callback from BaseLayer
    //when call construnctor
	init:function () {
		this._super();
		this.initSprites();
        this.initLabels();

        this.schedule(this.onTime, 0.5); //update dot animation time per 0.5second

        this.initNetwork();
	},

    //init sprites
	initSprites: function () {
		var size = cc.director.getWinSize();

        this.logo = new cc.Sprite(s_logo);
        this.logo.setAnchorPoint(0.5, 0.5);
        this.logo.setPosition(size.width / 2, size.height / 2);
        this.logo.setScale(this.m_fScale);
        this.addChild(this.logo);
	},

    //init labels
    initLabels: function () {
        var size = cc.director.getWinSize();

        this.lbl_state = new cc.LabelTTF("Connecting", "Arial", 30 * this.m_fScale);
        this.lbl_state.setPosition(size.width / 2 - 17.0 * this.m_fScale, this.m_fTopInterval + 100.0 * this.m_fScale);
        this.lbl_state.setColor(cc.color(0, 0, 0));
        this.addChild(this.lbl_state);

        this.lbl_dot = new cc.LabelTTF("", "Arial", 30 * this.m_fScale);
        this.lbl_dot.setAnchorPoint(0.0, 0.5);
        this.lbl_dot.setPosition(size.width / 2 + 67.0 * this.m_fScale, this.m_fTopInterval + 100.0 * this.m_fScale);
        this.lbl_dot.setColor(cc.color(0, 0, 0));
        this.addChild(this.lbl_dot);
    },

    //init client socket and connect to server
    initNetwork: function () {
        GameConnect = new GameConnect();  
    },

    //update animation dot string
    updateDotString: function () {
    	this.lbl_dot.setString(this.dot_string);
    },

	//custom schedule function
    onTime: function () {

    	if(this.dot_string === "")
    		this.dot_string = ".";
    	else if(this.dot_string === ".")
    		this.dot_string = "..";
    	else if(this.dot_string === "..")
    		this.dot_string = "...";
    	else if(this.dot_string === "...")
    		this.dot_string = "";
        
        this.updateDotString();
    },

    OnReceivedPacket: function(packet_name, data) {
        switch(packet_name) {
            case PACKET_RES_CONNECTED:
                var firebaseid = cc.sys.localStorage.getItem("firebaseid");
                if(firebaseid === null) {
                    GameConnect.sendRequest("register", {
                        id: ""
                    });
                }
                else {
                    g_me.firebaseid = firebaseid;
                    GameConnect.sendRequest("login", {
                        id: firebaseid
                    });
                }
                break;
            case PACKET_RES_REGISTER:
                if(data.status === "success") {
                    GameConnect.sendRequest("login", {});
                }
                else {
                    this.unschedule(this.onTime);
                    this.lbl_state.setString("User register was failed.");
                    this.dot_string = "";
                    this.updateDotString();
                }
                break;
            case PACKET_RES_LOGIN:
                if(data.status === "success") {
                    // TODO: some fields are disable for v1
                    // g_me.username = data.userInfo.username;
                    // g_me.password = data.userInfo.password;
                    // g_me.level = data.userInfo.level;
                    // g_me.winCount = data.userInfo.winCount;
                    // g_me.loseCount = data.userInfo.loseCount;
                    // g_me.point = data.userInfo.point;
                    // g_me.online = data.userInfo.online;
                    g_me.userid = data.userInfo.userid;
                    g_me.firebaseid = data.userInfo.userid;
                    g_me.state = data.userInfo.state;

                    this.unschedule(this.onTime);
                    cc.director.runScene(new StartScene());
                }
                else {
                    this.unschedule(this.onTime);
                    this.lbl_state.setString("User login was failed.");
                    this.dot_string = "";
                    this.updateDotString();
                }
                break;
        }
    }
});

//create Scene with SplashLayer
var SplashScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var splash_layer = new SplashLayer();
		splash_layer.init();
        g_layers.push(splash_layer);
        this.addChild(splash_layer);
        GameConnect.connectServer();
        GameConnect.sendRequest("check_invited", { fb_player_id: FBInstant.player.getID()});
	}
});
