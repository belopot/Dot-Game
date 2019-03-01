/****************************************/
/************** Start Layer *************/
/****************************************/

var StartLayer = BaseLayer.extend({

    //override init() callback from BaseLayer
    //when call construnctor
	init:function () {
		this._super();
        this.initSprites();
        if(!g_invite_friend){
            this.initButtons();
        }
        else
            g_invite_friend = false;
    },

    //init sprites
	initSprites: function () {
		var size = cc.director.getWinSize();


        // this.dot_pink = new cc.Sprite(s_dot_pink);
        // this.dot_pink.setAnchorPoint(0.5, 0.5);
        // this.dot_pink.setPosition(size.width / 2 - 20.0 * this.m_fScale, size.height - this.m_fTopInterval - 40.0 * this.m_fScale);
        // this.dot_pink.setScale(this.m_fScale);
        // this.addChild(this.dot_pink);

		// this.dot_blue = new cc.Sprite(s_dot_blue);
        // this.dot_blue.setAnchorPoint(0.5, 0.5);
        // this.dot_blue.setPosition(this.m_fLeftInterval + 40.0 * this.m_fScale, size.height - this.m_fTopInterval - 40.0 * this.m_fScale);
        // this.dot_blue.setScale(this.m_fScale);
        // this.addChild(this.dot_blue);

        // this.dot_purple = new cc.Sprite(s_dot_purple);
        // this.dot_purple.setAnchorPoint(0.5, 0.5);
        // this.dot_purple.setPosition(size.width - this.m_fLeftInterval, size.height - this.m_fTopInterval - 180.0 * this.m_fScale);
        // this.dot_purple.setScale(this.m_fScale);
        // this.addChild(this.dot_purple);
        this.spriteAnim();

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
    },


    //init buttons
	initButtons: function () {
		var size = cc.director.getWinSize();

		this.btn_play = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_play.setAnchorPoint(0.5, 0.5);
        this.btn_play.setPosition(size.width / 2, size.height / 2);// + 165.0 * this.m_fScale);
        this.btn_play.setLabel("Play", "Arial", 46, cc.color(255, 255, 255, 255));
        this.btn_play.setLabelPosition(this.btn_play.getContentSize().width / 2, this.btn_play.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_play);

		// this.btn_setting = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
    //     this.btn_setting.setAnchorPoint(0.5, 0.5);
    //     this.btn_setting.setPosition(size.width / 2, size.height / 2 + 55.0 * this.m_fScale);
    //     this.btn_setting.setLabel("Settings", "Arial", 46, cc.color(255, 255, 255, 255));
    //     this.btn_setting.setLabelPosition(this.btn_setting.getContentSize().width / 2, this.btn_setting.getContentSize().height / 2 + 4.0);
    //     this.addChild(this.btn_setting);
		//
    //     this.btn_help = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
    //     this.btn_help.setAnchorPoint(0.5, 0.5);
    //     this.btn_help.setPosition(size.width / 2, size.height / 2 - 55.0 * this.m_fScale);
    //     this.btn_help.setLabel("Help", "Arial", 46, cc.color(255, 255, 255, 255));
    //     this.btn_help.setLabelPosition(this.btn_help.getContentSize().width / 2, this.btn_help.getContentSize().height / 2 + 4.0);
    //     this.addChild(this.btn_help);
		//
    //     this.btn_leaderboard = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
    //     this.btn_leaderboard.setAnchorPoint(0.5, 0.5);
    //     this.btn_leaderboard.setPosition(size.width / 2, size.height / 2 - 165.0 * this.m_fScale);
    //     this.btn_leaderboard.setLabel("Leaderboards", "Arial", 36, cc.color(255, 255, 255, 255));
    //     this.btn_leaderboard.setLabelPosition(this.btn_leaderboard.getContentSize().width / 2, this.btn_leaderboard.getContentSize().height / 2 + 4.0);
    //     this.addChild(this.btn_leaderboard);
		//
    //     this.btn_login = new Dots.Button(s_btn_yellow, this.m_fScale, this, this.onHover, this.onClick);
    //     this.btn_login.setAnchorPoint(0.5, 0.5);
    //     this.btn_login.setPosition(size.width / 2, this.m_fTopInterval + 45.0 * this.m_fScale);
    //     this.btn_login.setLabel("Login/Signup", "Arial", 40, cc.color(255, 255, 255, 255));
    //     this.btn_login.setLabelPosition(this.btn_login.getContentSize().width / 2, this.btn_login.getContentSize().height / 2 + 4.0);
    //     this.addChild(this.btn_login);
	},

    //custom callback function for mouse hover
	onHover: function (target, state) {
	},

    //custom callback function for button click
	onClick: function (target) {
		if(target === this.btn_play) {
            cc.director.runScene(new PlaySettingScene());
		}
		else if(target === this.btn_setting) {
			cc.director.runScene(new GlobalSettingScene());
		}
		else if(target === this.btn_help) {

		}
		else if(target === this.btn_leaderboard) {

		}
		else if(target === this.btn_login) {

		}
	}
});

//create Scene with StartLayer
var StartScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var start_layer = new StartLayer();
		start_layer.init();
        g_layers.push(start_layer);
		this.addChild(start_layer);
	}
});
