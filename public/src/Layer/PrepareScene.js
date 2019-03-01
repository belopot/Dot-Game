/****************************************/
/************* Prepare Layer ************/
/****************************************/

var PrepareLayer = BaseLayer.extend({

    dot_string : "",
    countdown : 0,

    //override init() callback from BaseLayer
    //when call construnctor
	init:function () {

        this._super();
		this.initSprites();
        this.initLabels();

        this.schedule(this.onTime, 0.5); //update dot animation time per 0.5second
        this.schedule(this.updateTimer, 1)
        this.sendGameRequest();
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
        this.line_top.setPosition(size.width / 2, size.height / 2 + 140.0 * this.m_fScale);
        this.line_top.setScale(this.m_fScale);
        this.addChild(this.line_top);

        this.line_bottom = new cc.Sprite(s_line);
        this.line_bottom.setAnchorPoint(0.5, 0.5);
        this.line_bottom.setPosition(size.width / 2, size.height / 2 - 130.0 * this.m_fScale);
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

        this.lbl_title = new cc.LabelTTF("Finding Match", "Arial", 75.0 * this.m_fScale);
        this.lbl_title.setAnchorPoint(0.5, 0.5);
        this.lbl_title.setColor(cc.color(179, 179, 179, 255));
        this.lbl_title.setPosition(size.width / 2, size.height / 2 + 190.0 * this.m_fScale);
        this.addChild(this.lbl_title);

        this.lbl_message = new cc.LabelTTF("Connecting you\nto available players", "Arial", 65.0 * this.m_fScale);
        this.lbl_message.setAnchorPoint(0.5, 0.5);
        this.lbl_message.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.lbl_message.setColor(cc.color(179, 179, 179, 255));
        this.lbl_message.setPosition(size.width / 2, size.height / 2 + 10.0 * this.m_fScale);
        this.addChild(this.lbl_message);

        this.lbl_dot = new cc.LabelTTF(this.dot_string, "Arial", 75.0 * this.m_fScale);
        this.lbl_dot.setAnchorPoint(0.0, 0.5);
        this.lbl_dot.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.lbl_dot.setColor(cc.color(179, 179, 179, 255));
        this.lbl_dot.setPosition(size.width / 2 - /*+ 130.0*/25 * this.m_fScale, size.height / 2 - 75.0 * this.m_fScale);
        this.addChild(this.lbl_dot);

        this.lbl_timer = new cc.LabelTTF(this.countdown, "Arial", 75.0 * this.m_fScale);
        this.lbl_timer.setAnchorPoint(0.0, 0.5);
        this.lbl_timer.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.lbl_timer.setColor(cc.color(179, 179, 179, 255));
        this.lbl_timer.setPosition(size.width / 2 - /*+ 130.0*/25 * this.m_fScale, size.height / 2 - 175.0 * this.m_fScale);
        this.addChild(this.lbl_timer);
    },

    //find game opp
    sendGameRequest: function () {
        GameConnect.sendRequest("game_request", {
            id: g_me.firebaseid,

            //type: BOARD_3
            type: g_board_type,
            fb_id: FBInstant.player.getID(),
            fb_name: FBInstant.player.getName(),
            fb_photo: FBInstant.player.getPhoto()

        });
    },

    updateTimer: function () {
      this.countdown += 1;
      this.lbl_timer.setString(this.countdown);
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

        this.lbl_dot.setString(this.dot_string);
    },

    OnReceivedPacket: function(packet_name, data) {
        switch(packet_name) {
            case PACKET_RES_GAMESTARTED:
                this.unschedule(this.onTime);

                g_roomid = data.roomid;

                //g_turn = data.turn;
                g_turn = data.create_id;

                g_board = data.board;



                g_creater_id = data.create_id;
                if(g_me.userid === data.create_id)
                    g_slave_id = data.opp_id;
                else
                    g_slave_id = g_me.userid;


                // g_opp.firebaseid = data.opp_firebaseid;
                // g_opp.username = data.opp_data.username;
                // g_opp.password = data.opp_data.password;
                // g_opp.level = data.opp_data.level;
                // g_opp.winCount = data.opp_data.winCount;
                // g_opp.loseCount = data.opp_data.loseCount;
                // g_opp.point = data.opp_data.point;
                // g_opp.userid = data.opp_id;
                // g_opp.online = data.opp_data.online;
                // g_opp.state = data.opp_data.state;
                // g_opp.socketid = data.opp_data.socketid;

                if(data.type === BOARD_3) {
                    g_board_row = 3;
                    g_board_col = 3;
                }
                else if(data.type === BOARD_5) {
                    g_board_row = 5;
                    g_board_col = 5;
                }

                else if(data.type === BOARD_7) {
                    g_board_row = 7;
                    g_board_col = 7;
                }

                g_me.time_taken = this.countdown;
                cc.director.runScene(new GameScene());
                break;
        }
    }
});

//create Scene with PrepareLayer
var PrepareScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var prepare_layer = new PrepareLayer();
		prepare_layer.init();
        g_layers.push(prepare_layer);
		this.addChild(prepare_layer);
    }
});
