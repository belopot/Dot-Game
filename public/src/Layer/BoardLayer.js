/****************************************/
/************** Board Layer *************/
/****************************************/

var BoardLayer = BaseLayer.extend({

    touchListener  : null,          //touch listener
    mouseListener  : null,          //mouse listener
    dot_sprites : null,             //dot sprite array
    touched_row : -1,               //touched row index
    touched_col : -1,               //touched col index

    newBoxIndex : -1,          //box index of new added line
    newLineIndex : -1,          //line index of new added line
    clickableAreaSize : 60,      //size of clickable area

    //constructor (create touch and mouse listeners)
    ctor: function () {
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled: this.onTouchCancelled
        });

        this.mouseListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMoved
        });

        BaseLayer.prototype.ctor.call(this);
    },

    //override enter callback (register touch and mouse listeners)
    onEnter: function () {
        if (!this.touchListener._isRegistered())
            cc.eventManager.addListener(this.touchListener, this);

        if (!this.mouseListener._isRegistered())
            cc.eventManager.addListener(this.mouseListener, this);

        BaseLayer.prototype.onEnter.call(this);
    },

    //init function that call after added to parent layer
	init:function () {
		this._super();
		this.initBoard();
        this.initBoardDots();
        this.initBoardLines();
	},

    //init board edge lines
	initBoard: function () {
    	var size = cc.director.getWinSize();
        var line_width = RESOLUTION_WIDTH * this.m_fScale - this.board_padding * 2 * this.m_fScale;

        this.board = new cc.DrawNode();
        this.addChild(this.board);

        this.board.drawRect(cc.p(size.width / 2 - 295.0 * this.m_fScale, size.height / 2 + 295.0 * this.m_fScale - 50.0 * this.m_fScale),
                            cc.p(size.width / 2 + 295.0 * this.m_fScale, size.height / 2 - 295.0 * this.m_fScale - 50.0 * this.m_fScale),
                            null, 10.0 * this.m_fScale, cc.color(235, 235, 235, 255));
	},

    //init board dots
    initBoardDots: function() {

        var size = cc.director.getWinSize();
        var dot_distance = 550.0 / g_board_row;
        var start_x = size.width / 2 - 275.0 * this.m_fScale;
        var start_y = size.height / 2 + 275.0 * this.m_fScale;

        this.dot_sprites = new Array(g_board_row + 1);
        for(var row = 0; row < g_board_row + 1; row++) {
            this.dot_sprites[row] = new Array(g_board_col + 1);
            for(var col = 0; col < g_board_col + 1; col++) {
                this.dot_sprites[row][col] = new cc.Sprite(s_game_dot);
                this.dot_sprites[row][col].setAnchorPoint(0.5, 0.5);
                this.dot_sprites[row][col].setPosition(start_x + dot_distance * col * this.m_fScale, start_y - dot_distance * row * this.m_fScale - 50.0 * this.m_fScale);
                this.dot_sprites[row][col].setScale(this.m_fScale);
                this.board.addChild(this.dot_sprites[row][col]);
            }
        }
    },

    //init board dots
    initBoardLines: function() {

        for(var box_index = 0; box_index < g_board.length; box_index++) {
            var board = g_board[box_index];

            board.lines[0]["width"] = 4.5 * this.m_fScale;
            board.lines[0]["start_x"] = this.dot_sprites[board.row][board.col].getPosition().x;
            board.lines[0]["start_y"] = this.dot_sprites[board.row][board.col].getPosition().y - 12.0 * this.m_fScale;
            board.lines[0]["end_x"] = this.dot_sprites[board.row + 1][board.col].getPosition().x;
            board.lines[0]["end_y"] = this.dot_sprites[board.row + 1][board.col].getPosition().y + 12.0 * this.m_fScale;

            board.lines[1]["width"] = 4.5 * this.m_fScale;
            board.lines[1]["start_x"] = this.dot_sprites[board.row][board.col].getPosition().x + 12.0 * this.m_fScale;
            board.lines[1]["start_y"] = this.dot_sprites[board.row][board.col].getPosition().y;
            board.lines[1]["end_x"] = this.dot_sprites[board.row][board.col + 1].getPosition().x - 12.0 * this.m_fScale;
            board.lines[1]["end_y"] = this.dot_sprites[board.row][board.col + 1].getPosition().y;

            board.lines[2]["width"] = 4.5 * this.m_fScale;
            board.lines[2]["start_x"] = this.dot_sprites[board.row][board.col + 1].getPosition().x;
            board.lines[2]["start_y"] = this.dot_sprites[board.row][board.col + 1].getPosition().y - 12.0 *  this.m_fScale;
            board.lines[2]["end_x"] = this.dot_sprites[board.row + 1][board.col + 1].getPosition().x;
            board.lines[2]["end_y"] = this.dot_sprites[board.row + 1][board.col + 1].getPosition().y + 12.0 * this.m_fScale;

            board.lines[3]["width"] = 4.5 * this.m_fScale;
            board.lines[3]["start_x"] = this.dot_sprites[board.row + 1][board.col].getPosition().x + 12.0 * this.m_fScale;
            board.lines[3]["start_y"] = this.dot_sprites[board.row + 1][board.col].getPosition().y;
            board.lines[3]["end_x"] = this.dot_sprites[board.row + 1][board.col + 1].getPosition().x - 12.0 * this.m_fScale;
            board.lines[3]["end_y"] = this.dot_sprites[board.row + 1][board.col + 1].getPosition().y;

            g_board[box_index] = board;
        }

        this.drawBoardLines();
    },

    drawBoardLines: function() {

        this.board.clear();

        for(var box_index = 0; box_index < g_board.length; box_index++) {

            //if(g_board[box_index].owner === g_me.userid) {
            if(g_board[box_index].owner === g_creater_id) {

                this.board.drawRect(cc.p(g_board[box_index].lines[0].end_x, g_board[box_index].lines[0].end_y - 12.0 * this.m_fScale),
                            cc.p(g_board[box_index].lines[1].end_x + 12.0 * this.m_fScale, g_board[box_index].lines[1].end_y),

                            //cc.color(228, 234, 181), 0, cc.color(228, 234, 181));
                            cc.color(78, 240, 148), 0, cc.color(78, 240, 148));

            }

            //else if(g_board[box_index].owner === g_opp.userid) {
            else if(g_board[box_index].owner === g_slave_id) {

                this.board.drawRect(cc.p(g_board[box_index].lines[0].end_x, g_board[box_index].lines[0].end_y - 12.0 * this.m_fScale),
                            cc.p(g_board[box_index].lines[1].end_x + 12.0 * this.m_fScale, g_board[box_index].lines[1].end_y),

                            //cc.color(255, 207, 168), 0, cc.color(255, 207, 168));
                            cc.color(255, 186, 32), 0, cc.color(255, 186, 32));

            }

            for(var line_index = 0; line_index < g_board[box_index].lines.length; line_index++) {
                this.board.drawSegment(cc.p(g_board[box_index].lines[line_index].start_x, g_board[box_index].lines[line_index].start_y),
                                        cc.p(g_board[box_index].lines[line_index].end_x, g_board[box_index].lines[line_index].end_y),
                                        g_board[box_index].lines[line_index].width,
                                        (g_board[box_index].lines[line_index].state === 1) ? cc.color(102, 96, 88, 255) : cc.color(235, 235, 235, 255));
            }
        }

        //because Edge
        for(var box_index = 0; box_index < g_board.length; box_index++) {
            for(var line_index = 0; line_index < g_board[box_index].lines.length; line_index++) {
                this.board.drawSegment(cc.p(g_board[box_index].lines[line_index].start_x, g_board[box_index].lines[line_index].start_y),
                                        cc.p(g_board[box_index].lines[line_index].end_x, g_board[box_index].lines[line_index].end_y),
                                        g_board[box_index].lines[line_index].width,
                                        (g_board[box_index].lines[line_index].state === 1) ? cc.color(102, 96, 88, 255) : cc.color(235, 235, 235, 255));
            }
        }
        //


        //Painting color(226,55,52) on the new added line
        if(this.newBoxIndex != -1){
            this.board.drawSegment(cc.p(g_board[this.newBoxIndex].lines[this.newLineIndex].start_x, g_board[this.newBoxIndex].lines[this.newLineIndex].start_y),
            cc.p(g_board[this.newBoxIndex].lines[this.newLineIndex].end_x, g_board[this.newBoxIndex].lines[this.newLineIndex].end_y),
            g_board[this.newBoxIndex].lines[this.newLineIndex].width,
            cc.color(226, 55, 52, 255));
        }
        if(this.newBoxIndex != -1){
            this.board.drawSegment(cc.p(g_board[this.newBoxIndex].lines[this.newLineIndex].start_x, g_board[this.newBoxIndex].lines[this.newLineIndex].start_y),
            cc.p(g_board[this.newBoxIndex].lines[this.newLineIndex].end_x, g_board[this.newBoxIndex].lines[this.newLineIndex].end_y),
            g_board[this.newBoxIndex].lines[this.newLineIndex].width,
            cc.color(226, 55, 52, 255));
        }
        //console.log(g_me.userid +" ,  " + g_opp.userid);

    },

    updateBoard: function(data) {

        g_turn = data.turn;

        for(var box_index = 0; box_index < data.board.length; box_index++) {
            g_board[box_index].owner = data.board[box_index].owner;
            for(var line_index = 0; line_index < data.board[box_index].lines.length; line_index++) {

                if(g_board[box_index].lines[line_index].state != data.board[box_index].lines[line_index].state){
                    this.newBoxIndex = box_index;
                    this.newLineIndex = line_index;
                }

                g_board[box_index].lines[line_index].state = data.board[box_index].lines[line_index].state;
            }
        }

        this.drawBoardLines();
    },


    //Bot Function
    actionBot: function(data){
        //find empty line
        var lineCol = [];
        var lineRow = [];

        for(var box_index = 0; box_index < data.board.length; box_index++) {
            for(var line_index = 0; line_index < data.board[box_index].lines.length; line_index++) {
                if(data.board[box_index].lines[line_index].state === 0)
                {
                    lineCol.push(data.board[box_index].lines[line_index].col);
                    lineRow.push(data.board[box_index].lines[line_index].row);

                }
            }
        }

        //Set row and col as random
        var index = this.getRandomInt(0, lineCol.length - 1);
        var botLineCol = lineCol[index];
        var botLineRow = lineRow[index];
        console.log("Col_ ",botLineCol, "Row_", botLineRow);

        if(botLineCol == undefined || botLineRow == undefined){
            return;
        }


        GameConnect.sendRequest("game_line", {
            roomid: g_roomid,
            firebaseid: g_me.firebaseid,
            userid: g_me.userid,
            line: {
                row: botLineRow,
                col: botLineCol
            }
        });

    },

    getRandomInt: function(min, max) { return Math.min( max, Math.floor(Math.random() * (max - min + 1) + min) ); },



    //override touch begin event callback (mobile, desktop)
    onTouchBegan: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return false;

        if(target.procTouchBegan(touch))
            return true;

        return false;
    },

    //override touch end event callback (mobile, desktop)
    onTouchEnded: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;

        target.procTouchEnd(touch);
    },

    //override touch cancel event callback (mobile, desktop)
    onTouchCancelled: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;

        target.procTouchEnd(touch);
    },

    //override touch move event callback (mobile)
    onTouchMoved: function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;
    },

    //override mouse event callback (desktop)
    onMouseMoved: function (event) {

        var target = event.getCurrentTarget();
        if(target.getParent().getPauseLayer() !== null)
            return;
    },

    //process touch begin event
    procTouchBegan: function (touch) {

        var touchLocation = touch.getLocation();
        var locationInNode = this.convertToNodeSpace(touchLocation);

        for(var box_index = 0; box_index < g_board.length; box_index++) {

            var rect1 = cc.rect(g_board[box_index].lines[0].end_x - this.clickableAreaSize/2 * this.m_fScale, g_board[box_index].lines[0].end_y, this.clickableAreaSize * this.m_fScale,
                                g_board[box_index].lines[0].start_y - g_board[box_index].lines[0].end_y);

            var rect2 = cc.rect(g_board[box_index].lines[1].start_x, g_board[box_index].lines[1].start_y - this.clickableAreaSize/2 * this.m_fScale,
                                g_board[box_index].lines[1].end_x - g_board[box_index].lines[1].start_x, this.clickableAreaSize * this.m_fScale);

            var rect3 = cc.rect(g_board[box_index].lines[2].end_x - this.clickableAreaSize/2 * this.m_fScale, g_board[box_index].lines[2].end_y, this.clickableAreaSize * this.m_fScale,
                                g_board[box_index].lines[2].start_y - g_board[box_index].lines[2].end_y);

            var rect4 = cc.rect(g_board[box_index].lines[3].start_x, g_board[box_index].lines[3].start_y - this.clickableAreaSize/2 * this.m_fScale,
                                g_board[box_index].lines[3].end_x - g_board[box_index].lines[3].start_x, this.clickableAreaSize * this.m_fScale);

            if (cc.rectContainsPoint(rect1, locationInNode)) {
                this.touched_row = g_board[box_index].lines[0].row;
                this.touched_col = g_board[box_index].lines[0].col;
                return true;
            }
            else if (cc.rectContainsPoint(rect2, locationInNode)) {
                this.touched_row = g_board[box_index].lines[1].row;
                this.touched_col = g_board[box_index].lines[1].col;
                return true;
            }
            else if (cc.rectContainsPoint(rect3, locationInNode)) {
                this.touched_row = g_board[box_index].lines[2].row;
                this.touched_col = g_board[box_index].lines[2].col;
                return true;
            }
            else if (cc.rectContainsPoint(rect4, locationInNode)) {
                this.touched_row = g_board[box_index].lines[3].row;
                this.touched_col = g_board[box_index].lines[3].col;
                return true;
            }
        }

        return false;
    },

    //process touch end event
    procTouchEnd: function (touch) {

        var touchLocation = touch.getLocation();
        var locationInNode = this.convertToNodeSpace(touchLocation);
        var end_row = -1;
        var end_col = -1;

        for(var box_index = 0; box_index < g_board.length; box_index++) {

            var rect1 = cc.rect(g_board[box_index].lines[0].end_x - this.clickableAreaSize/2 * this.m_fScale, g_board[box_index].lines[0].end_y, this.clickableAreaSize * this.m_fScale,
                                g_board[box_index].lines[0].start_y - g_board[box_index].lines[0].end_y);

            var rect2 = cc.rect(g_board[box_index].lines[1].start_x, g_board[box_index].lines[1].start_y - this.clickableAreaSize/2 * this.m_fScale,
                                g_board[box_index].lines[1].end_x - g_board[box_index].lines[1].start_x, this.clickableAreaSize * this.m_fScale);

            var rect3 = cc.rect(g_board[box_index].lines[2].end_x - this.clickableAreaSize/2 * this.m_fScale, g_board[box_index].lines[2].end_y, this.clickableAreaSize * this.m_fScale,
                                g_board[box_index].lines[2].start_y - g_board[box_index].lines[2].end_y);

            var rect4 = cc.rect(g_board[box_index].lines[3].start_x, g_board[box_index].lines[3].start_y - this.clickableAreaSize/2 * this.m_fScale,
                                g_board[box_index].lines[3].end_x - g_board[box_index].lines[3].start_x, this.clickableAreaSize * this.m_fScale);

            if (cc.rectContainsPoint(rect1, locationInNode)) {
                end_row = g_board[box_index].lines[0].row;
                end_col = g_board[box_index].lines[0].col;
                break;
            }
            else if (cc.rectContainsPoint(rect2, locationInNode)) {
                end_row = g_board[box_index].lines[1].row;
                end_col = g_board[box_index].lines[1].col;
                break;
            }
            else if (cc.rectContainsPoint(rect3, locationInNode)) {
                end_row = g_board[box_index].lines[2].row;
                end_col = g_board[box_index].lines[2].col;
                break;
            }
            else if (cc.rectContainsPoint(rect4, locationInNode)) {
                end_row = g_board[box_index].lines[3].row;
                end_col = g_board[box_index].lines[3].col;
                break;
            }
        }

        if(end_row === -1 && end_col === -1) {
            this.touched_row = -1;
            this.touched_col = -1;
            return;
        }

        if(this.touched_row !== end_row || this.touched_col !== end_col) {
            this.touched_row = -1;
            this.touched_col = -1;
            return;
        }

        GameConnect.sendRequest("game_line", {
            roomid: g_roomid,
            firebaseid: g_me.firebaseid,
            userid: g_me.userid,
            line: {
                row: this.touched_row,
                col: this.touched_col
            }
        });

        this.touched_row = -1;
        this.touched_col = -1;
    }
});
