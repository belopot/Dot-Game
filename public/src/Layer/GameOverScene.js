/****************************************/
/************ GameOver Layer ************/
/****************************************/

var GameOverLayer = BaseLayer.extend({

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

        this.dot_blue = new cc.Sprite(s_dot_blue);
        this.dot_blue.setAnchorPoint(0.5, 0.5);
        this.dot_blue.setPosition(this.m_fLeftInterval, size.height - this.m_fTopInterval);
        this.dot_blue.setScale(this.m_fScale);
        this.addChild(this.dot_blue);

        this.dot_pink = new cc.Sprite(s_dot_pink);
        this.dot_pink.setAnchorPoint(0.5, 0.5);
        this.dot_pink.setPosition(size.width / 2 - 40.0 * this.m_fScale, size.height - this.m_fTopInterval);
        this.dot_pink.setScale(this.m_fScale);
        this.addChild(this.dot_pink);

        this.dot_purple = new cc.Sprite(s_dot_purple);
        this.dot_purple.setAnchorPoint(0.5, 0.5);
        this.dot_purple.setPosition(size.width - this.m_fLeftInterval, size.height - this.m_fTopInterval - 70.0 * this.m_fScale);
        this.dot_purple.setScale(this.m_fScale);
        this.addChild(this.dot_purple);

        this.line_top = new cc.Sprite(s_line);
        this.line_top.setAnchorPoint(0.5, 0.5);
        this.line_top.setPosition(size.width / 2, size.height / 2 + 140.0 * this.m_fScale);
        this.line_top.setScale(this.m_fScale);
        this.addChild(this.line_top);

        this.line_bottom = new cc.Sprite(s_line);
        this.line_bottom.setAnchorPoint(0.5, 0.5);
        this.line_bottom.setPosition(size.width / 2, size.height / 2 - 130.0 * this.m_fScale);
        this.line_bottom.setScale(this.m_fScale);
        this.addChild(this.line_bottom);

        this.dot_light_blue = new cc.Sprite(s_dot_light_blue);
        this.dot_light_blue.setAnchorPoint(0.5, 0.5);
        this.dot_light_blue.setPosition(size.width / 2 + 150.0 * this.m_fScale, this.m_fTopInterval - 85.0 * this.m_fScale);
        this.dot_light_blue.setScale(this.m_fScale);
        this.addChild(this.dot_light_blue);
	},

    //init labels
    initLabels: function() {
        var size = cc.director.getWinSize();

        this.lbl_title = new cc.LabelTTF(g_result, "Arial", 75.0 * this.m_fScale);
        this.lbl_title.setAnchorPoint(0.5, 0.5);
        this.lbl_title.setColor(cc.color(179, 179, 179, 255));
        this.lbl_title.setPosition(size.width / 2, size.height / 2 + 190.0 * this.m_fScale);
        this.addChild(this.lbl_title);
    },

    //init buttons
	initButtons: function () {
		var size = cc.director.getWinSize();

		this.btn_playagain = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_playagain.setAnchorPoint(0.5, 0.5);
        this.btn_playagain.setPosition(size.width / 2, size.height / 2 + 55.0 * this.m_fScale);
        this.btn_playagain.setLabel("Play Again", "Arial", 40, cc.color(255, 255, 255, 255));
        this.btn_playagain.setLabelPosition(this.btn_playagain.getContentSize().width / 2, this.btn_playagain.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_playagain);

		this.btn_mainmenu = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_mainmenu.setAnchorPoint(0.5, 0.5);
        this.btn_mainmenu.setPosition(size.width / 2, size.height / 2 - 55.0 * this.m_fScale);
        this.btn_mainmenu.setLabel("Main Menu", "Arial", 40, cc.color(255, 255, 255, 255));
        this.btn_mainmenu.setLabelPosition(this.btn_mainmenu.getContentSize().width / 2, this.btn_mainmenu.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_mainmenu);
	},

    //custom callback function for mouse hover
	onHover: function (target, state) {
	},

    //custom callback function for button click
	onClick: function (target) {
		if(target === this.btn_playagain) {
            cc.director.runScene(new PlaySettingScene());
		}
		else if(target === this.btn_mainmenu) {
            cc.director.runScene(new StartScene());
		}
	}
});

//create Scene with GameOverLayer
var GameOverScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var gameover_layer = new GameOverLayer();
		gameover_layer.init();
        g_layers.push(gameover_layer);
		this.addChild(gameover_layer);
	}
});
