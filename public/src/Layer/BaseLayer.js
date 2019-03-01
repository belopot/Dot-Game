/****************************************/
/************** Base Layer **************/
/****************************************/

var BaseLayer = cc.Layer.extend({

    m_fScale : 1.0,
	m_fLargeScale : 1.0,
    m_fLeftInterval : 0,
    m_fTopInterval : 0,

    //override init() callback from cc.Layer
    //when call construnctor
    init:function () {

        this._super();

        var m_winSize = cc.director.getWinSize();

        this.initScale();
        this.initEdgeNodes();
    },
    
    //init layer scale and edge values
    initScale: function () {

		var m_winSize = cc.director.getWinSize();

		var scaleX = m_winSize.width / RESOLUTION_WIDTH;
		var scaleY = m_winSize.height / RESOLUTION_HEIGHT;

		if(scaleX < scaleY) {
			this.m_fScale = scaleX;
			this.m_fLargeScale = scaleY;
		}
		else {
			this.m_fScale = scaleY;
			this.m_fLargeScale = scaleX;
		}

		this.m_fLeftInterval = (m_winSize.width - Math.floor(RESOLUTION_WIDTH * this.m_fScale)) / 2.0;
		this.m_fTopInterval = (m_winSize.height - Math.floor(RESOLUTION_HEIGHT * this.m_fScale)) / 2.0;
	},

	//over with black color layers that
	//will not use in game 
	initEdgeNodes: function() {

		var winSize = cc.director.getWinSize();

		this.layer_left = new cc.LayerColor(cc.color(0, 0, 0, 255));
		this.layer_left.setContentSize(this.m_fLeftInterval, winSize.height);
		this.layer_left.setPosition(0, 0);
		this.addChild(this.layer_left, 100);

		this.layer_right = new cc.LayerColor(cc.color(0, 0, 0, 255));
		this.layer_right.setContentSize(this.m_fLeftInterval, winSize.height);
		this.layer_right.setPosition(winSize.width - this.m_fLeftInterval, 0);
		this.addChild(this.layer_right, 100);
	},

	OnReceivedPacket: function(packet_name, data) {
        
    }
});
