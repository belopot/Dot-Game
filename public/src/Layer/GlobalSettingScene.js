/****************************************/
/********** GlobalSetting Layer *********/
/****************************************/

var GlobalSettingLayer = BaseLayer.extend({

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
        this.line_top.setPosition(size.width / 2, size.height - this.m_fTopInterval - 245.0 * this.m_fScale);
        this.line_top.setScale(this.m_fScale);
        this.addChild(this.line_top);

        this.line_bottom = new cc.Sprite(s_line);
        this.line_bottom.setAnchorPoint(0.5, 0.5);
        this.line_bottom.setPosition(size.width / 2, this.m_fTopInterval + 175.0 * this.m_fScale);
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

        this.lbl_title = new cc.LabelTTF("Settings", "Arial", 80.0 * this.m_fScale);
        this.lbl_title.setAnchorPoint(0.5, 0.5);
        this.lbl_title.setColor(cc.color(179, 179, 179, 255));
        this.lbl_title.setPosition(size.width / 2, size.height - this.m_fTopInterval - 190.0 * this.m_fScale);
        this.addChild(this.lbl_title);
    },

    //init buttons
	initButtons: function () {
		var size = cc.director.getWinSize();

		this.btn_feedback = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_feedback.setAnchorPoint(0.5, 0.5);
        this.btn_feedback.setPosition(size.width / 2, size.height / 2 + 125.0 * this.m_fScale);
        this.btn_feedback.setLabel("Feedback", "Arial", 46, cc.color(255, 255, 255, 255));
        this.btn_feedback.setLabelPosition(this.btn_feedback.getContentSize().width / 2, this.btn_feedback.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_feedback);

		this.btn_connect = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_connect.setAnchorPoint(0.5, 0.5);
        this.btn_connect.setPosition(size.width / 2, size.height / 2 + 15.0 * this.m_fScale);
        this.btn_connect.setLabel("Connect", "Arial", 46, cc.color(255, 255, 255, 255));
        this.btn_connect.setLabelPosition(this.btn_connect.getContentSize().width / 2, this.btn_connect.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_connect);

        this.btn_button1 = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_button1.setAnchorPoint(0.5, 0.5);
        this.btn_button1.setPosition(size.width / 2, size.height / 2 - 95.0 * this.m_fScale);
        this.btn_button1.setLabel("Button - 1", "Arial", 46, cc.color(255, 255, 255, 255));
        this.btn_button1.setLabelPosition(this.btn_button1.getContentSize().width / 2, this.btn_button1.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_button1);

        this.btn_back = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_back.setAnchorPoint(0.5, 0.5);
        this.btn_back.setPosition(size.width / 2, size.height / 2 - 205.0 * this.m_fScale);
        this.btn_back.setLabel("Back", "Arial", 46, cc.color(255, 255, 255, 255));
        this.btn_back.setLabelPosition(this.btn_back.getContentSize().width / 2, this.btn_back.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_back);

        this.btn_music_on = new Dots.Button(s_btn_music_on, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_music_on.setAnchorPoint(0.5, 0.5);
        this.btn_music_on.setPosition(this.m_fLeftInterval + 65.0 * this.m_fScale, this.m_fTopInterval + 60.0 * this.m_fScale);
        this.addChild(this.btn_music_on);

        this.btn_music_off = new Dots.Button(s_btn_music_off, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_music_off.setAnchorPoint(0.5, 0.5);
        this.btn_music_off.setPosition(this.m_fLeftInterval + 65.0 * this.m_fScale, this.m_fTopInterval + 60.0 * this.m_fScale);
        this.addChild(this.btn_music_off);

        this.btn_sound_on = new Dots.Button(s_btn_sound_on, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_sound_on.setAnchorPoint(0.5, 0.5);
        this.btn_sound_on.setPosition(size.width - this.m_fLeftInterval - 65.0 * this.m_fScale, this.m_fTopInterval + 60.0 * this.m_fScale);
        this.addChild(this.btn_sound_on);

        this.btn_sound_off = new Dots.Button(s_btn_sound_off, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_sound_off.setAnchorPoint(0.5, 0.5);
        this.btn_sound_off.setPosition(size.width - this.m_fLeftInterval - 65.0 * this.m_fScale, this.m_fTopInterval + 60.0 * this.m_fScale);
        this.addChild(this.btn_sound_off);

        this.updateButtons();
	},

    //update toggle buttons (music, sound)
    updateButtons: function() {

        this.btn_music_on.setEnabled(g_setting_music);
        this.btn_music_on.setVisible(g_setting_music);
        this.btn_music_off.setEnabled(!g_setting_music);
        this.btn_music_off.setVisible(!g_setting_music);

        this.btn_sound_on.setEnabled(g_setting_sound);
        this.btn_sound_on.setVisible(g_setting_sound);
        this.btn_sound_off.setEnabled(!g_setting_sound);
        this.btn_sound_off.setVisible(!g_setting_sound);
    },

    //custom callback function for mouse hover
	onHover: function (target, state) {
	},

    //custom callback function for button click
	onClick: function (target) {
		if(target === this.btn_feedback) {

		}
		else if(target === this.btn_connect) {

		}
		else if(target === this.btn_button1) {

		}
		else if(target === this.btn_back) {
            cc.director.runScene(new StartScene());
		}
        else if(target === this.btn_music_on || target === this.btn_music_off) {
            g_setting_music = !g_setting_music;
            this.updateButtons();
        }
        else if(target === this.btn_sound_on || target === this.btn_sound_off) {
            g_setting_sound = !g_setting_sound;
            this.updateButtons();
        }
	}
});

//create Scene with GlobalSettingLayer
var GlobalSettingScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var global_setting_layer = new GlobalSettingLayer();
		global_setting_layer.init();
        g_layers.push(global_setting_layer);
		this.addChild(global_setting_layer);
	}
});
