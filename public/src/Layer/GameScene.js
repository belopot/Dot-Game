/****************************************/
/************** Game Layer **************/
/****************************************/

var GameLayer = BaseLayer.extend({

    layer_pause         : null,         //pause layer
    current_gametime    : null,         //current game time

    //override init() callback from BaseLayer
    //when call construnctor
	init:function () {

		this._super();
		this.initSprites();
        this.initLabels();
        this.initBoardLayer();
        this.initButtons();
        this.updateTurn();
	},

    //init sprites
	initSprites: function () {
    	var size = cc.director.getWinSize();


        // this.dot_pink = new cc.Sprite(s_dot_pink);
        // this.dot_pink.setAnchorPoint(0.5, 0.5);
        // this.dot_pink.setPosition(size.width / 2 - 130.0 * this.m_fScale, size.height - this.m_fTopInterval + 25.0 * this.m_fScale);
        // this.dot_pink.setScale(this.m_fScale);
        // this.addChild(this.dot_pink);

        // this.dot_blue = new cc.Sprite(s_dot_blue);
        // this.dot_blue.setAnchorPoint(0.5, 0.5);
        // this.dot_blue.setPosition(this.m_fLeftInterval - 30.0 * this.m_fScale, size.height - this.m_fTopInterval + 110.0 * this.m_fScale);
        // this.dot_blue.setScale(this.m_fScale);
        // this.addChild(this.dot_blue);

        // this.dot_purple = new cc.Sprite(s_dot_purple);
        // this.dot_purple.setAnchorPoint(0.5, 0.5);
        // this.dot_purple.setPosition(size.width - this.m_fLeftInterval + 70.0 * this.m_fScale, size.height - this.m_fTopInterval - 135.0 * this.m_fScale);
        // this.dot_purple.setScale(this.m_fScale);
        // this.addChild(this.dot_purple);

        // this.dot_light_blue = new cc.Sprite(s_dot_light_blue);
        // this.dot_light_blue.setAnchorPoint(0.5, 0.5);
        // this.dot_light_blue.setPosition(size.width / 2 + 100.0 * this.m_fScale, this.m_fTopInterval - 135.0 * this.m_fScale);
        // this.dot_light_blue.setScale(this.m_fScale);
        // this.addChild(this.dot_light_blue);
        this.spriteAnim();


        this.profile1 = new cc.Sprite(s_game_profile_frame);
        this.profile1.setAnchorPoint(0.5, 0.5);
        this.profile1.setPosition(this.m_fLeftInterval + 75.0 * this.m_fScale, size.height - this.m_fTopInterval - 170.0 * this.m_fScale);
        this.profile1.setScale(this.m_fScale);
        this.LoadImgFromUrl(this, g_me.fb_photo, cc.p(this.m_fLeftInterval + 75.0 * this.m_fScale, size.height - this.m_fTopInterval - 170.0 * this.m_fScale), this.profile1);
        // this.addChild(this.profile1);

        this.profile2 = new cc.Sprite(s_game_profile_frame);
        this.profile2.setAnchorPoint(0.5, 0.5);
        this.profile2.setPosition(this.m_fLeftInterval + 75.0 * this.m_fScale, this.m_fTopInterval + 65.0 * this.m_fScale);
        this.profile2.setScale(this.m_fScale);
        this.LoadImgFromUrl(this, g_opp.fb_photo, cc.p(this.m_fLeftInterval + 75.0 * this.m_fScale, this.m_fTopInterval + 65.0 * this.m_fScale), this.profile2);
        // this.addChild(this.profile2);

        this.time_box1 = new cc.Sprite(s_game_timebox);
        this.time_box1.setAnchorPoint(0.5, 0.5);
        this.time_box1.setPosition(size.width - this.m_fLeftInterval - 100.0 * this.m_fScale, size.height - this.m_fTopInterval - 165.0 * this.m_fScale);
        this.time_box1.setScale(this.m_fScale);
        this.addChild(this.time_box1);

        this.time_box2 = new cc.Sprite(s_game_timebox);
        this.time_box2.setAnchorPoint(0.5, 0.5);
        this.time_box2.setPosition(size.width - this.m_fLeftInterval - 100.0 * this.m_fScale, this.m_fTopInterval + 70.0 * this.m_fScale);
        this.time_box2.setScale(this.m_fScale);
        this.addChild(this.time_box2);
    },

    LoadImgFromUrl: function (target, imgUrl, pos, stencil){
        if(!imgUrl) return;
        var Self = target;
        var loadCb = function(err, IMG){
            cc.textureCache.addImage (imgUrl);
            var texture2d = new cc.Texture2D ();
            texture2d.initWithElement (IMG);
            texture2d.handleLoadedTexture ();
            var sp = new cc.Sprite ();
            sp.initWithTexture(texture2d);
            sp.x = pos.x;
            sp.y = pos.y;
            var clip = cc.ClippingNode.create(stencil);
            clip.setAlphaThreshold(0.1);
            var scale_x = stencil.getContentSize().width / sp.getContentSize().width;
            var scale_y = stencil.getContentSize().height / sp.getContentSize().height;
            sp.setScaleX(scale_x);
            sp.setScaleY(scale_y);
            clip.addChild(sp);
            Self.addChild (clip);
        };
        cc.loader.loadImg (imgUrl, {isCrossOrigin: true }, loadCb);
    },

    spriteAnim: function(){

        var size = cc.director.getWinSize();

        var dot_pink = new cc.Sprite(s_dot_pink);
        dot_pink.setAnchorPoint(0.5, 0.6);
        dot_pink.setPosition(size.width / 2 - 130.0 * this.m_fScale, size.height - this.m_fTopInterval + 25.0 * this.m_fScale);
        dot_pink.setScale(this.m_fScale);
        this.addChild(dot_pink);

        var rotationAmount_pink = 50;
        var sizeOrigin_pink = dot_pink.getScale();
        var sizeMin_pink = sizeOrigin_pink / 1.2;
        var sizeMax_pink = sizeOrigin_pink * 1.2;
        var sizeVelocity_pink = 0.0012;
        var sizeAmount_pink = sizeOrigin_pink;
        var isInc_pink = false;
        dot_pink.schedule(function()
        {
                //Control Rotation
                //this.setRotation(rotationAmount_pink++);
                if(rotationAmount_pink > 360)
                    rotationAmount_pink = 0;

                //Control Scale
                if(isInc_pink){
                    sizeAmount_pink += sizeVelocity_pink;
                    if(sizeAmount_pink >= sizeMax_pink)
                        isInc_pink = false;
                }
                else{
                    sizeAmount_pink -= sizeVelocity_pink;
                    if(sizeAmount_pink <= sizeMin_pink)
                        isInc_pink = true;
                }
                this.setScale(sizeAmount_pink);
        });

        var dot_blue = new cc.Sprite(s_dot_blue);
        dot_blue.setAnchorPoint(0.4, 0.5);
        dot_blue.setPosition(this.m_fLeftInterval - 30.0 * this.m_fScale, size.height - this.m_fTopInterval + 110.0 * this.m_fScale);
        dot_blue.setScale(this.m_fScale);
        this.addChild(dot_blue);

        var rotationAmount_blue = 50;
        var sizeOrigin_blue = dot_blue.getScale();
        var sizeMin_blue = sizeOrigin_blue / 1.3;
        var sizeMax_blue = sizeOrigin_blue * 1.2;
        var sizeVelocity_blue = 0.001;
        var sizeAmount_blue = sizeOrigin_blue;
        var isInc_blue = true;
        dot_blue.schedule(function()
        {
                //Control Rotation
                //this.setRotation(rotationAmount_blue++);
                if(rotationAmount_blue > 360)
                    rotationAmount_blue = 0;

                //Control Scale
                if(isInc_blue){
                    sizeAmount_blue += sizeVelocity_blue;
                    if(sizeAmount_blue >= sizeMax_blue)
                        isInc_blue = false;
                }
                else{
                    sizeAmount_blue -= sizeVelocity_blue;
                    if(sizeAmount_blue <= sizeMin_blue)
                        isInc_blue = true;
                }
                this.setScale(sizeAmount_blue);
        });

        var dot_purple = new cc.Sprite(s_dot_purple);
        dot_purple.setAnchorPoint(0.5, 0.5);
        dot_purple.setPosition(size.width - this.m_fLeftInterval + 70.0 * this.m_fScale, size.height - this.m_fTopInterval - 135.0 * this.m_fScale);
        dot_purple.setScale(this.m_fScale);
        this.addChild(dot_purple);

        var rotationAmount_purple = 50;
        var sizeOrigin_purple = dot_purple.getScale();
        var sizeMin_purple = sizeOrigin_purple / 1.3;
        var sizeMax_purple = sizeOrigin_purple * 1.4;
        var sizeVelocity_purple = 0.002;
        var sizeAmount_purple = sizeOrigin_purple;
        var isInc_purple = false;
        dot_purple.schedule(function()
        {
                //Control Rotation
                //this.setRotation(rotationAmount_purple++);
                if(rotationAmount_purple > 360)
                    rotationAmount_purple = 0;

                //Control Scale
                if(isInc_purple){
                    sizeAmount_purple += sizeVelocity_purple;
                    if(sizeAmount_purple >= sizeMax_purple)
                        isInc_purple = false;
                }
                else{
                    sizeAmount_purple -= sizeVelocity_purple;
                    if(sizeAmount_purple <= sizeMin_purple)
                        isInc_purple = true;
                }
                this.setScale(sizeAmount_purple);
        });

        var dot_light_blue = new cc.Sprite(s_dot_light_blue);
        dot_light_blue.setAnchorPoint(0.5, 0.5);
        dot_light_blue.setPosition(size.width / 2 + 100.0 * this.m_fScale, this.m_fTopInterval - 135.0 * this.m_fScale);
        dot_light_blue.setScale(this.m_fScale);
        this.addChild(dot_light_blue);

        var rotationAmount_light_blue = 50;
        var sizeOrigin_light_blue = dot_light_blue.getScale();
        var sizeMin_light_blue = sizeOrigin_light_blue / 1.5;
        var sizeMax_light_blue = sizeOrigin_light_blue * 1.2;
        var sizeVelocity_light_blue = 0.0019;
        var sizeAmount_light_blue = sizeOrigin_light_blue;
        var isInc_light_blue = false;
        dot_light_blue.schedule(function()
        {
                //Control Rotation
                //this.setRotation(rotationAmount_light_blue++);
                if(rotationAmount_light_blue > 360)
                    rotationAmount_light_blue = 0;

                //Control Scale
                if(isInc_light_blue){
                    sizeAmount_light_blue += sizeVelocity_light_blue;
                    if(sizeAmount_light_blue >= sizeMax_light_blue)
                        isInc_light_blue = false;
                }
                else{
                    sizeAmount_light_blue -= sizeVelocity_light_blue;
                    if(sizeAmount_light_blue <= sizeMin_light_blue)
                        isInc_light_blue = true;
                }
                this.setScale(sizeAmount_light_blue);
        });
    },


    //init labels
    initLabels: function() {
        var size = cc.director.getWinSize();

        this.lbl_timetaken = new cc.LabelTTF("Connected In " + g_me.time_taken + " seconds", "Arial", 16.0 * this.m_fScale);
        this.lbl_timetaken.setAnchorPoint(0.0, 0.5);
        this.lbl_timetaken.setColor(cc.color(68, 211, 130, 255));
        this.lbl_timetaken.setPosition(this.m_fLeftInterval + 240.0 * this.m_fScale, this.m_fTopInterval + 30.0 * this.m_fScale);
        this.addChild(this.lbl_timetaken);

        //this.lbl_profile1 = new cc.LabelTTF(g_me.username + "(Level:" + g_me.level + ")", "Arial", 36.0 * this.m_fScale);
        this.lbl_profile1 = new cc.LabelTTF(g_me.fb_name, "Arial", 36.0 * this.m_fScale);
        this.lbl_profile1.setAnchorPoint(0.0, 0.5);
        this.lbl_profile1.setPosition(this.m_fLeftInterval + 140.0 * this.m_fScale, size.height - this.m_fTopInterval - 170.0 * this.m_fScale);
        this.addChild(this.lbl_profile1);

        // this.lbl_profile2 = new cc.LabelTTF(g_opp.username + "(Level:" + g_opp.level + ")", "Arial", 36.0 * this.m_fScale);
        this.lbl_profile2 = new cc.LabelTTF(g_opp.fb_name, "Arial", 36.0 * this.m_fScale);
        this.lbl_profile2.setAnchorPoint(0.0, 0.5);
        this.lbl_profile2.setPosition(this.m_fLeftInterval + 140.0 * this.m_fScale, this.m_fTopInterval + 65.0 * this.m_fScale);
        this.addChild(this.lbl_profile2);

        if (g_me.userid === g_creater_id) {
            this.lbl_profile1.setColor(cc.color(68, 211, 130, 255));
            this.lbl_profile2.setColor(cc.color(255, 177, 2, 255));
        } else {
            this.lbl_profile1.setColor(cc.color(255, 177, 2, 255));
            this.lbl_profile2.setColor(cc.color(68, 211, 130, 255));
        }

        this.lbl_time1 = new cc.LabelTTF("", "Arial", 27.0 * this.m_fScale);
        this.lbl_time1.setAnchorPoint(0.5, 0.5);
        this.lbl_time1.setColor(cc.color(102, 96, 88, 255));
        this.lbl_time1.setPosition(size.width - this.m_fLeftInterval - 102.0 * this.m_fScale, size.height - this.m_fTopInterval - 168.0 * this.m_fScale);
        this.addChild(this.lbl_time1);

        this.lbl_time2 = new cc.LabelTTF("", "Arial", 27.0 * this.m_fScale);
        this.lbl_time2.setAnchorPoint(0.5, 0.5);
        this.lbl_time2.setColor(cc.color(102, 96, 88, 255));
        this.lbl_time2.setPosition(size.width - this.m_fLeftInterval - 102.0 * this.m_fScale, this.m_fTopInterval + 68.0 * this.m_fScale);
        this.addChild(this.lbl_time2);
    },

    //init board layer
    initBoardLayer: function () {

        this.layer_board = new BoardLayer();
        this.addChild(this.layer_board);
        this.layer_board.init();
    },

    //init buttons
	initButtons: function () {
		var size = cc.director.getWinSize();

        this.btn_close = new Dots.Button(s_btn_close, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_close.setAnchorPoint(0.5, 0.5);
        this.btn_close.setPosition(this.m_fLeftInterval + 40.0 * this.m_fScale, size.height - this.m_fTopInterval - 45.0 * this.m_fScale);
        this.addChild(this.btn_close);

		// this.btn_pause = new Dots.Button(s_btn_pause, this.m_fScale, this, this.onHover, this.onClick);
        // this.btn_pause.setAnchorPoint(0.5, 0.5);
        // this.btn_pause.setPosition(size.width - this.m_fLeftInterval - 40.0 * this.m_fScale, size.height - this.m_fTopInterval - 45.0 * this.m_fScale);
        // this.addChild(this.btn_pause);
	},

    updateTurn: function() {
        this.current_gametime = g_game_time;
        this.updateTimeString();
        this.schedule(this.onTime, 1.0); //update game time per 1second
    },

    //update current timebox
    updateTimeString: function () {

        var min = this.current_gametime / 60;
        var sec = this.current_gametime % 60;


        if(g_turn === g_me.userid) {
        //if(g_turn === g_creater_id){

            this.lbl_time1.setVisible(true);
            this.lbl_time2.setVisible(false);
            this.lbl_time1.setString(sprintf("%02d:%02d", min, sec));
        }
        else {
            this.lbl_time2.setVisible(true);
            this.lbl_time1.setVisible(false);
            this.lbl_time2.setString(sprintf("%02d:%02d", min, sec));
        }
    },

    //add pause layer
    showPauseLayer: function () {
        if(this.layer_pause !== null)
            return;

        this.layer_pause = new PauseLayer();
        this.addChild(this.layer_pause);
        this.layer_pause.init();
    },

    //remove pause layer
    hidePauseLayer: function () {
        if(this.layer_pause === null)
            return;

        this.removeChild(this.layer_pause);
        this.layer_pause = null;
    },

    //return pause layer
    getPauseLayer: function () {
        return this.layer_pause;
    },

    //custom callback function for mouse hover
	onHover: function (target, state) {
        if(this.layer_pause !== null)
            return;
	},

    //custom callback function for button click
	onClick: function (target) {
        if(this.layer_pause !== null)
            return;

		if(target === this.btn_close) {
            GameConnect.sendRequest("throw_actual", {
                id: g_me.firebaseid,
                roomid : g_roomid
            });
		}
		// else if(target === this.btn_pause) {
        //     this.showPauseLayer();
		// }
	},

    //custom schedule function
    onTime: function () {
        if(this.current_gametime <= 0) {

            this.unschedule(this.onTime);
            if(g_turn === g_me.userid) {
                GameConnect.sendRequest("throw_timeout", {
                    id: g_me.firebaseid,
                    roomid : g_roomid
                });
                this.current_gametime = g_game_time;
            }
            if(g_turn === g_creater_id)
                this.lbl_time1.setString("Bot...");
            else
                this.lbl_time2.setString("Bot...");

            return;
        }
        this.current_gametime --;
        this.updateTimeString();
    },

    OnReceivedPacket: function(packet_name, data) {
        switch(packet_name) {
            case PACKET_RES_GAMEUPDATE:
                this.layer_board.updateBoard(data);
                this.unschedule(this.onTime);
                this.updateTurn();
                break;
            case PACKET_RES_GAMEOVER:
                if(data.create_id === g_me.userid) {
                    if(data.create_point > data.opp_point)
                        g_result = "You Win!";
                    else if(data.create_point < data.opp_point)
                        g_result = "You Lose!";
                    else
                        g_result = "You Draw!";
                }
                else if(data.opp_id === g_me.userid) {
                    if(data.create_point > data.opp_point)
                        g_result = "You Lose!";
                    else if(data.create_point < data.opp_point)
                        g_result = "You Win!";
                    else
                        g_result = "You Draw!";
                }
                g_roomid = 0;
                g_opp = {};
                g_board = {};

                g_layers = [];
                g_board_type = BOARD_3;


                cc.director.runScene(new GameOverScene());
                break;
            case PAKCET_RES_GAMEWIN_DISCON:
                g_result = "You Win!";
                g_roomid = 0;
                g_opp = {};
                g_board = {};

                g_layers = [];
                g_board_type = BOARD_3;

                cc.director.runScene(new GameOverScene());
                break;
            case PACKET_RES_GAMEOVER_THROW:
                if(data.winner === g_me.userid)
                    g_result = "You Win!";
                else if(data.loser === g_me.userid)
                    g_result = "You Lose!";

                g_roomid = 0;
                g_opp = {};
                g_board = {};

                g_layers = [];
                g_board_type = BOARD_3;

                if(data.winner === g_me.userid)
                       cc.director.runScene(new GameOverScene());
                    else if(data.loser === g_me.userid)
                        cc.director.runScene(new StartScene());
                break;

            case PACKET_RES_TIMEOUT:
                if(data.turn === g_me.userid) {
                    this.layer_board.actionBot(data);
                    this.unschedule(this.onTime);
                    this.updateTurn();
                }
                break;

        }
    }
});

//create Scene with GameLayer
var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var game_layer = new GameLayer();
		game_layer.init();
        g_layers.push(game_layer);
		this.addChild(game_layer);
	}
});
