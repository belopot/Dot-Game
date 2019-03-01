/****************************************/
/********** ImageButton widget **********/
/*one sprite (normal, active, disable)
/****************************************/

Dots.ImageButton = cc.Sprite.extend({

    _state: Dots.BUTTON_STATE_NORMAL,
    _touchListener: null,       //touch listener (mobile, desktop)
    _mouseListener: null,       //mouse listener (desktop)
    _scale: 1.0,                //normal scale
    _hoverScale: 1.05,          //hover scale
    _activeScale: 0.95,         //acive scale
    _target: null,              //event callback target
    _hoverCallback: null,       //hover callback
    _activeCallback: null,      //active callback
    _enabled: false,            //button enable/disable
    _norImg: null,              //normal button sprite
    _disImg: null,              //active button sprite

    //constructor
    ctor: function (nor_img, dis_img, scale, target, hoverCallback, activeCallback) {

        this._state = Dots.BUTTON_STATE_NORMAL;
        this._scale = scale;
        this._hoverScale = 1.05;
        this._activeScale = 0.95;
        this._target = target;
        this._hoverCallback = hoverCallback;
        this._activeCallback = activeCallback;
        this._enabled = true;
        this._norImg = nor_img;
        this._disImg = dis_img;

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

        cc.Sprite.prototype.ctor.call(this, this._norImg);
        this.setScale(this._scale);
    },

    //override enter callback
    onEnter: function () {

        if (!this._touchListener._isRegistered()) {
            cc.eventManager.addListener(this._touchListener, this);
        }

        if (!this._mouseListener._isRegistered()) {
            cc.eventManager.addListener(this._mouseListener, this);
        }

        cc.Sprite.prototype.onEnter.call(this);
    },

    isEnabled: function () {
        return this._enabled;
    },
    
    setEnabled: function (enabled) {
        this._enabled = enabled;
        if(this._enabled)
            this.initWithFile(this._norImg);
        else
            this.initWithFile(this._disImg);
    },

    //override touch begin callback (mobile, desktop)
    _onTouchBegan: function (touch, event) {

        var target = event.getCurrentTarget();
        return target._procTouchBegan(touch);
    },

    //override touch end callback (mobile, desktop)
    _onTouchEnded: function (touch, event) {

        var target = event.getCurrentTarget();
        target._procTouchEnd(touch);
    },

    //override touch cancel callback (mobile, desktop)
    _onTouchCancelled: function (touch, event) {

        var target = event.getCurrentTarget();
        target._procTouchEnd(touch);
    },

    //override touch move callback (mobile)
    _onTouchMoved: function (touch, event) {

        var target = event.getCurrentTarget();
        target._procTouchMoved(touch);
    },
    
    //override mouse move callback (desktop)
    _onMouseMoved: function (event) {

        var target = event.getCurrentTarget();
        target._procHover(event);
    },

    //process mouse hover event
    _procHover: function (event) {

        if(!this._enabled)
            return;

        if(!this._visible)
        	return;

        if(this._state !== Dots.BUTTON_STATE_NORMAL && this._state !== Dots.BUTTON_STATE_HOVER_BEGAN)
            return;

        var locationInNode = this.convertToNodeSpace(event.getLocation());

        var size = this.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            if(this._state === Dots.BUTTON_STATE_NORMAL) {
                this.setScale(this._scale * this._hoverScale);
                this._state = Dots.BUTTON_STATE_HOVER_BEGAN;
                if(this._target !== null && this._hoverCallback !== null) {                    
                    this._hoverCallback.call(this._target, this, Dots.BUTTON_STATE_HOVER_BEGAN);
                }
            }
        }
        else {
            if(this._state === Dots.BUTTON_STATE_HOVER_BEGAN) {
                this.setScale(this._scale);
                this._state = Dots.BUTTON_STATE_NORMAL;
                if(this._target !== null && this._hoverCallback !== null) {
                    this._hoverCallback.call(this._target, this, Dots.BUTTON_STATE_HOVER_END);
                }
            }
        }
    },
    
    //process touch begin event
    _procTouchBegan: function (touch) {

        if(!this._enabled)
            return false;

		if(!this._visible)
			return;

        if(this._state !== Dots.BUTTON_STATE_NORMAL && this._state !== Dots.BUTTON_STATE_HOVER_BEGAN)
            return false;

        var touchLocation = touch.getLocation();
        var locationInNode = this.convertToNodeSpace(touchLocation);

        var size = this.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {

            if(this._state === Dots.BUTTON_STATE_NORMAL)
                this.setScale(this._scale * this._activeScale);
            else
                this.setScale(this._scale * this._activeScale);

            this._state = Dots.BUTTON_STATE_HOVER_ACTIVE;
            return true;
        }
        else {
            return false;
        }
    },
    
    //process touch move event
    _procTouchMoved: function (touch) {

        if(!this._enabled)
            return;

		if(!this._visible)
			return;

        if(this._state !== Dots.BUTTON_STATE_HOVER_ACTIVE)
            return;

        var touchLocation = touch.getLocation();
        var locationInNode = this.convertToNodeSpace(touchLocation);

        var size = this.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (!cc.rectContainsPoint(rect, locationInNode)) {
            this.setScale(this._scale);
            this._state = Dots.BUTTON_STATE_ACTIVE;
        }
    },

    //process touch end event
    _procTouchEnd: function (touch) {

        if(!this._enabled)
            return;

		if(!this._visible)
			return;

        if(this._state !== Dots.BUTTON_STATE_HOVER_ACTIVE && this._state !== Dots.BUTTON_STATE_ACTIVE)
            return;

        var touchLocation = touch.getLocation();
        var locationInNode = this.convertToNodeSpace(touchLocation);

        var size = this.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            this.setScale(this._scale);

            if(this._target !== null && this._activeCallback !== null)
                this._activeCallback.call(this._target, this);
        }

        this._state = Dots.BUTTON_STATE_NORMAL;
    }
});
