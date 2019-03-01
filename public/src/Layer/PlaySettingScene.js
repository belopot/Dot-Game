/****************************************/
/*********** PlaySetting Layer **********/
/****************************************/
var PlaySettingLayer = BaseLayer.extend({

    //override init() callback from BaseLayer
    //when call construnctor
	init:function () {
		this._super();
		this.initSprites();
        this.initLabels();
        this.initButtons();

	},

    //init sprites
	initSprites: function () {
    	var size = cc.director.getWinSize();

        // this.dot_blue = new cc.Sprite(s_dot_blue);
        // this.dot_blue.setAnchorPoint(0.5, 0.5);
        // this.dot_blue.setPosition(this.m_fLeftInterval, size.height - this.m_fTopInterval);
        // this.dot_blue.setScale(this.m_fScale);
        // this.addChild(this.dot_blue);

        // this.dot_pink = new cc.Sprite(s_dot_pink);
        // this.dot_pink.setAnchorPoint(0.5, 0.5);
        // this.dot_pink.setPosition(size.width / 2 - 40.0 * this.m_fScale, size.height - this.m_fTopInterval);
        // this.dot_pink.setScale(this.m_fScale);
        // this.addChild(this.dot_pink);

        // this.dot_purple = new cc.Sprite(s_dot_purple);
        // this.dot_purple.setAnchorPoint(0.5, 0.5);
        // this.dot_purple.setPosition(size.width - this.m_fLeftInterval, size.height - this.m_fTopInterval - 70.0 * this.m_fScale);
        // this.dot_purple.setScale(this.m_fScale);
        // this.addChild(this.dot_purple);

        // this.dot_light_blue = new cc.Sprite(s_dot_light_blue);
        // this.dot_light_blue.setAnchorPoint(0.5, 0.5);
        // this.dot_light_blue.setPosition(size.width / 2 + 150.0 * this.m_fScale, this.m_fTopInterval - 85.0 * this.m_fScale);
        // this.dot_light_blue.setScale(this.m_fScale);
        // this.addChild(this.dot_light_blue);
        this.spriteAnim();


        this.line_top = new cc.Sprite(s_line);
        this.line_top.setAnchorPoint(0.5, 0.5);
        this.line_top.setPosition(size.width / 2, size.height - this.m_fTopInterval - 245.0 * this.m_fScale);
        this.line_top.setScale(this.m_fScale);
        this.addChild(this.line_top);

        this.line_bottom = new cc.Sprite(s_line);
        this.line_bottom.setAnchorPoint(0.5, 0.5);
        this.line_bottom.setPosition(size.width / 2, this.m_fTopInterval + 175.0 * this.m_fScale);
        this.line_bottom.setScale(this.m_fScale);
        this.addChild(this.line_bottom);

    },


    spriteAnim: function(){

        var size = cc.director.getWinSize();

        var dot_pink = new cc.Sprite(s_dot_pink);
        dot_pink.setAnchorPoint(0.3, 0.6);
        dot_pink.setPosition(size.width / 2 - 20.0 * this.m_fScale, size.height - this.m_fTopInterval - 40.0 * this.m_fScale);
        dot_pink.setScale(this.m_fScale);
        this.addChild(dot_pink);

        var rotationAmount_pink = 50;
        var sizeOrigin_pink = dot_pink.getScale();
        var sizeMin_pink = sizeOrigin_pink / 1.5;
        var sizeMax_pink = sizeOrigin_pink * 1.5;
        var sizeVelocity_pink = 0.0016;
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
        dot_blue.setAnchorPoint(0.4, 0.6);
        dot_blue.setPosition(this.m_fLeftInterval + 40.0 * this.m_fScale, size.height - this.m_fTopInterval - 40.0 * this.m_fScale);
        dot_blue.setScale(this.m_fScale);
        this.addChild(dot_blue);

        var rotationAmount_blue = 50;
        var sizeOrigin_blue = dot_blue.getScale();
        var sizeMin_blue = sizeOrigin_blue / 1.8;
        var sizeMax_blue = sizeOrigin_blue * 1;
        var sizeVelocity_blue = 0.0014;
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
        dot_purple.setAnchorPoint(0.7, 0.7);
        dot_purple.setPosition(size.width - this.m_fLeftInterval, size.height - this.m_fTopInterval - 180.0 * this.m_fScale);
        dot_purple.setScale(this.m_fScale);
        this.addChild(dot_purple);

        var rotationAmount_purple = 50;
        var sizeOrigin_purple = dot_purple.getScale();
        var sizeMin_purple = sizeOrigin_purple / 1.3;
        var sizeMax_purple = sizeOrigin_purple * 1.7;
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
        dot_light_blue.setPosition(size.width / 2 + 150.0 * this.m_fScale, this.m_fTopInterval - 85.0 * this.m_fScale);
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

        this.lbl_title = new cc.LabelTTF("Play", "Arial", 80.0 * this.m_fScale);
        this.lbl_title.setAnchorPoint(0.5, 0.5);
        this.lbl_title.setColor(cc.color(179, 179, 179, 255));
        this.lbl_title.setPosition(size.width / 2, size.height - this.m_fTopInterval - 190.0 * this.m_fScale);
        this.addChild(this.lbl_title);

        this.lbl_board_size = new cc.LabelTTF("3X3", "Arial", 80.0 * this.m_fScale);
        this.lbl_board_size.setAnchorPoint(0.5, 0.5);
        this.lbl_board_size.setColor(cc.color(179, 179, 179, 255));
        this.lbl_board_size.setPosition(size.width / 2 - 115.0 * this.m_fScale, size.height - this.m_fTopInterval - 325.0 * this.m_fScale);
        this.addChild(this.lbl_board_size);

        this.lbl_board_description = new cc.LabelTTF("Puzzle Board", "Arial", 30.0 * this.m_fScale);
        this.lbl_board_description.setAnchorPoint(0.0, 0.5);
        this.lbl_board_description.setColor(cc.color(179, 179, 179, 255));
        this.lbl_board_description.setPosition(size.width / 2 + 30.0 * this.m_fScale, size.height - this.m_fTopInterval - 325.0 * this.m_fScale);
        this.addChild(this.lbl_board_description);
    },

    //init buttons
	initButtons: function () {
		var size = cc.director.getWinSize();

		this.btn_play_friend = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_play_friend.setAnchorPoint(0.5, 0.5);
        this.btn_play_friend.setPosition(size.width / 2, size.height / 2 + 15.0 * this.m_fScale);
        this.btn_play_friend.setLabel("Play with a\nFriend", "Arial", 30, cc.color(255, 255, 255, 255));
        this.btn_play_friend.setLabelPosition(this.btn_play_friend.getContentSize().width / 2, this.btn_play_friend.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_play_friend);

		this.btn_play_random = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_play_random.setAnchorPoint(0.5, 0.5);
        this.btn_play_random.setPosition(size.width / 2, size.height / 2 - 95.0 * this.m_fScale);
        this.btn_play_random.setLabel("Start\nA Game", "Arial", 30, cc.color(255, 255, 255, 255));
        this.btn_play_random.setLabelPosition(this.btn_play_random.getContentSize().width / 2, this.btn_play_random.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_play_random);

        this.btn_back = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_back.setAnchorPoint(0.5, 0.5);
        this.btn_back.setPosition(size.width / 2, size.height / 2 - 205.0 * this.m_fScale);//205.0
        this.btn_back.setLabel("Back", "Arial", 46, cc.color(255, 255, 255, 255));
        this.btn_back.setLabelPosition(this.btn_back.getContentSize().width / 2, this.btn_back.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_back);


        // this.btn_levelup = new Dots.Button(s_btn_levelup, this.m_fScale * 0.5, this, this.onHover, this.onClick);
        // this.btn_levelup.setAnchorPoint(0.5, 0.5);
        // this.btn_levelup.setPosition(size.width / 2 - 10.0 * this.m_fScale, size.height - this.m_fTopInterval - 325.0 * this.m_fScale);
        // this.addChild(this.btn_levelup);
				//
        // this.btn_leveldown = new Dots.Button(s_btn_leveldown, this.m_fScale * 0.5, this, this.onHover, this.onClick);
        // this.btn_leveldown.setAnchorPoint(0.5, 0.5);
        // this.btn_leveldown.setPosition(size.width / 2 - 220.0 * this.m_fScale, size.height - this.m_fTopInterval - 325.0 * this.m_fScale);
        // this.addChild(this.btn_leveldown);

    },

    //custom callback function for mouse hover
	onHover: function (target, state) {
    },

    //custom callback function for button click
	onClick: function (target) {
		if(target === this.btn_play_friend) {
            FBInstantGames_Context_chooseAsync(2, 2, "", "gmcallback_Invite_and_play");
		}
		else if(target === this.btn_play_random) {
            cc.director.runScene(new PrepareScene());
		}
		else if(target === this.btn_back) {
            cc.director.runScene(new StartScene());
        }

        else if(target === this.btn_levelup){
            if(g_board_type < BOARD_7){
                g_board_type++;
                this.lbl_board_size.setString(g_board_name[g_board_type-1]);
            }
        }
        else if(target === this.btn_leveldown){
            if(g_board_type > BOARD_3){
                g_board_type--;
                this.lbl_board_size.setString(g_board_name[g_board_type-1]);
            }
        }

	}
});

//create Scene with PlaySettingLayer
var PlaySettingScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var play_setting_layer = new PlaySettingLayer();
		play_setting_layer.init();
        g_layers.push(play_setting_layer);
        this.addChild(play_setting_layer);
	}
});

function gml_Script_gmcallback_Invite_and_play(done, contextID, error) {
    if(error == "none"){
        FBInstantGames_inviteAsync("invite");
        FBInstantGames_getPlayersAsync("gmcallback_getPlayersAsync_new_game");
        console_log("Invite success");
    }
    else if(error == "SAME_CONTEXT"){
        //FBInstantGames_inviteAsync("invite");
        FBInstantGames_getPlayersAsync("gmcallback_getPlayersAsync_new_game");
    }
    else{
        console_log("Invite error");
    }
}

function gml_Script_gmcallback_getPlayersAsync_new_game(_playerIDs, _playerNames, _playerPhotos){
    var playerIDs = _playerIDs.split(",");
    var playerNames = _playerNames.split(",");
    var playerPhotos = _playerPhotos.split(",");
    if(playerIDs.length === 2){
        //success to connect with friend
        g_fb_invite_friend = true;
        var playerIndex = playerIDs.indexOf(FBInstant.player.getID());
        g_fb_player_id = playerIDs[playerIndex === 0 ? 0 : 1];
        g_fb_player_name = playerNames[playerIndex === 0 ? 0 : 1];
        g_fb_player_photo = playerPhotos[playerIndex === 0 ? 0 : 1];
        g_fb_invited_friend_id = playerIDs[playerIndex === 0 ? 1 : 0];
        g_fb_invited_friend_name = playerNames[playerIndex === 0 ? 1 : 0];
        g_fb_invited_friend_photo = playerPhotos[playerIndex === 0 ? 1 : 0];
        cc.director.runScene(new PrepareScene());
    }
    else{
        g_fb_invite_friend = false;
        g_fb_invited_friend_id = null;
        g_fb_invited_friend_name = null;
        g_fb_invited_friend_photo = null;
        g_fb_player_id = null;
        g_fb_player_name = null;
        g_fb_player_photo = null;
    }
}