/****************************************/
/************** Board Layer *************/
/****************************************/

var BoardLayer = BaseLayer.extend({

    _touchListener  : null,         //touch listener
    _mouseListener  : null,         //mouse listener
    _dotMatrix      : null,         //dot matrix

    board_padding: 25.0,            //board edge padding (x axes)
    board_margin: 50.0,             //board center margin (y axes)
    border_width: 5.0,              //border line width
    dot_padding: 5.0,               //dot padding from border
    dot_diameter: 5.0,              //dot diameter

    //constructor (create touch and mouse listeners)
    ctor: function () {
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan,
            onTouchMoved: this._onTouchMoved,
            onTouchEnded: this._onTouchEnded,
            onTouchCancelled: this._onTouchCancelled
        });

        this._mouseListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this._onMouseMoved
        });

        BaseLayer.prototype.ctor.call(this);
    },

    //override enter callback (register touch and mouse listeners)
    onEnter: function () {
        if (!this._touchListener._isRegistered())
            cc.eventManager.addListener(this._touchListener, this);

        if (!this._mouseListener._isRegistered())
            cc.eventManager.addListener(this._mouseListener, this);
        
        BaseLayer.prototype.onEnter.call(this);
    },

    //init function that call after added to parent layer
	init:function () {
		this._super();
		this.initBoardLines();
        this.initBoardDots();
	},

    //init board edge lines
	initBoardLines: function () {
    	var size = cc.director.getWinSize();
        var line_width = RESOLUTION_WIDTH * this.m_fScale - this.board_padding * 2 * this.m_fScale;

        this.board = new cc.DrawNode();
        this.addChild(this.board);

        this.board.drawSegment(cc.p(this.m_fLeftInterval + this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale - line_width / 2), 
                               cc.p(size.width - this.m_fLeftInterval - this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale - line_width / 2), 
                               this.border_width * this.m_fScale, cc.color(235, 235, 235, 255));
        this.board.drawSegment(cc.p(this.m_fLeftInterval + this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale + line_width / 2), 
                               cc.p(size.width - this.m_fLeftInterval - this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale + line_width / 2), 
                               this.border_width * this.m_fScale, cc.color(235, 235, 235, 255));

        this.board.drawSegment(cc.p(this.m_fLeftInterval + this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale - line_width / 2), 
                               cc.p(this.m_fLeftInterval + this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale + line_width / 2), 
                               this.border_width * this.m_fScale, cc.color(235, 235, 235, 255));
        this.board.drawSegment(cc.p(size.width - this.m_fLeftInterval - this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale - line_width / 2), 
                               cc.p(size.width - this.m_fLeftInterval - this.board_padding * this.m_fScale, size.height / 2 - this.board_margin * this.m_fScale + line_width / 2), 
                               this.border_width * this.m_fScale, cc.color(235, 235, 235, 255));
	},

    //init board dots
    initBoardDots: function() {
        var size = cc.director.getWinSize();
        var total_dot_space = RESOLUTION_WIDTH - this.board_padding * 2 - this.border_width * 2;
        var dot_distance = (total_dot_space - this.dot_padding * 2 - this.dot_diameter * 2) * this.m_fScale / g_board_col;
        var dot_start_x = this.m_fLeftInterval + (this.board_padding + this.border_width + this.dot_padding + this.dot_diameter) * this.m_fScale;
        var dot_start_y = size.height / 2 + (total_dot_space / 2 - this.board_margin - this.dot_padding - this.dot_diameter) * this.m_fScale;

        this._dotMatrix = new Array(g_board_row + 1);
        for(var row = 0; row < g_board_row + 1; row++) {
            this._dotMatrix[row] = new Array(g_board_col + 1);
            for(var col = 0; col < g_board_col + 1; col++) {
                
                var dot_sprite = new cc.Sprite(s_game_dot);
                dot_sprite.setAnchorPoint(0.5, 0.5);
                dot_sprite.setPosition(cc.p(dot_start_x + row * dot_distance, dot_start_y - col * dot_distance));
                dot_sprite.setScale(this.m_fScale);
                this.board.addChild(dot_sprite);

                this._dotMatrix[row][col] = new Dot();
                this._dotMatrix[row][col].setPosition(cc.p(dot_start_x + row * dot_distance, dot_start_y - col * dot_distance));
                this._dotMatrix[row][col].setSprite(dot_sprite);
            }
        }
    },

    //override touch begin event callback (mobile, desktop)
    _onTouchBegan: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return false;

        return true;
    },

    //override touch end event callback (mobile, desktop)
    _onTouchEnded: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;
    },

    //override touch cancel event callback (mobile, desktop)
    _onTouchCancelled: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;
    },

    //override touch move event callback (mobile)
    _onTouchMoved: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;
    },

    //override mouse event callback (desktop)
    _onMouseMoved: function (event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;
    }
});
