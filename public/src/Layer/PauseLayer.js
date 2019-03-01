/****************************************/
/************** Pause Layer *************/
/****************************************/

var PauseLayer = BaseLayer.extend({

    //init function that call after added to parent layer
    init:function () {
        this._super();
        this.initBackground();
        this.initSprites();
        this.initLabels();
        this.initButtons();
    },

    //init white background
    initBackground: function () {
        this.bg_layer = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(this.bg_layer);
    },

    //init sprites
    initSprites: function () {
        var size = cc.director.getWinSize();

        this.popup = new cc.Sprite(s_pause_popup);
        this.popup.setAnchorPoint(0.5, 0.5);
        this.popup.setPosition(size.width / 2, size.height / 2 - 50.0 * this.m_fScale);
        this.popup.setScale(this.m_fScale);
        this.addChild(this.popup);

        this.line_top = new cc.Sprite(s_pause_line);
        this.line_top.setAnchorPoint(0.5, 0.5);
        this.line_top.setPosition(size.width / 2, size.height / 2 + 115.0 * this.m_fScale);
        this.line_top.setScale(this.m_fScale);
        this.addChild(this.line_top);
    },

    //init labels
    initLabels: function() {
        var size = cc.director.getWinSize();

        this.lbl_title = new cc.LabelTTF("Paused", "Arial", 75.0 * this.m_fScale);
        this.lbl_title.setAnchorPoint(0.5, 0.5);
        this.lbl_title.setColor(cc.color(179, 179, 179, 255));
        this.lbl_title.setPosition(size.width / 2, size.height / 2 + 160.0 * this.m_fScale);
        this.addChild(this.lbl_title);
    },

    //init buttons
    initButtons: function () {
        var size = cc.director.getWinSize();

        this.btn_close = new Dots.Button(s_btn_close, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_close.setAnchorPoint(0.5, 0.5);
        this.btn_close.setPosition(size.width - this.m_fLeftInterval - 120.0 * this.m_fScale, size.height / 2 + 220.0 * this.m_fScale);
        this.addChild(this.btn_close);

        this.btn_connect = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_connect.setAnchorPoint(0.5, 0.5);
        this.btn_connect.setPosition(size.width / 2, size.height / 2 + 20.0 * this.m_fScale);
        this.btn_connect.setLabel("Connect", "Arial", 40, cc.color(255, 255, 255, 255));
        this.btn_connect.setLabelPosition(this.btn_connect.getContentSize().width / 2, this.btn_connect.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_connect);

        this.btn_help = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_help.setAnchorPoint(0.5, 0.5);
        this.btn_help.setPosition(size.width / 2, size.height / 2 - 90.0 * this.m_fScale);
        this.btn_help.setLabel("Help", "Arial", 40, cc.color(255, 255, 255, 255));
        this.btn_help.setLabelPosition(this.btn_help.getContentSize().width / 2, this.btn_help.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_help);

        this.btn_feedback = new Dots.Button(s_btn_blue, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_feedback.setAnchorPoint(0.5, 0.5);
        this.btn_feedback.setPosition(size.width / 2, size.height / 2 - 200.0 * this.m_fScale);
        this.btn_feedback.setLabel("Feedback", "Arial", 40, cc.color(255, 255, 255, 255));
        this.btn_feedback.setLabelPosition(this.btn_feedback.getContentSize().width / 2, this.btn_feedback.getContentSize().height / 2 + 4.0);
        this.addChild(this.btn_feedback);

        this.btn_music_on = new Dots.Button(s_btn_music_on, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_music_on.setAnchorPoint(0.5, 0.5);
        this.btn_music_on.setPosition(this.m_fLeftInterval + 145.0 * this.m_fScale, size.height / 2 - 315.0 * this.m_fScale);
        this.addChild(this.btn_music_on);

        this.btn_music_off = new Dots.Button(s_btn_music_off, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_music_off.setAnchorPoint(0.5, 0.5);
        this.btn_music_off.setPosition(this.m_fLeftInterval + 145.0 * this.m_fScale, size.height / 2 - 315.0 * this.m_fScale);
        this.addChild(this.btn_music_off);

        this.btn_sound_on = new Dots.Button(s_btn_sound_on, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_sound_on.setAnchorPoint(0.5, 0.5);
        this.btn_sound_on.setPosition(size.width - this.m_fLeftInterval - 145.0 * this.m_fScale, size.height / 2 - 315.0 * this.m_fScale);
        this.addChild(this.btn_sound_on);

        this.btn_sound_off = new Dots.Button(s_btn_sound_off, this.m_fScale, this, this.onHover, this.onClick);
        this.btn_sound_off.setAnchorPoint(0.5, 0.5);
        this.btn_sound_off.setPosition(size.width - this.m_fLeftInterval - 145.0 * this.m_fScale, size.height / 2 - 315.0 * this.m_fScale);
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
        if(target === this.btn_close) {
            this.getParent().hidePauseLayer();
        }
        else if(target === this.btn_connect) {

        }
        else if(target === this.btn_help) {

        }
        else if(target === this.btn_feedback) {
            
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
