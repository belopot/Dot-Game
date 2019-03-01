/****************************************/
/************ Button widget *************/
/*background sprite (normal, active, disable)
/*sub TTFLabel (normal, active, disable)
/*sub sprite (normal, active, disable)
/****************************************/

var Dots = Dots || {};

//Button click, touch states
Dots.BUTTON_STATE_NORMAL = 0;
Dots.BUTTON_STATE_ACTIVE = 1;
Dots.BUTTON_STATE_HOVER_BEGAN = 2;
Dots.BUTTON_STATE_HOVER_END = 3;
Dots.BUTTON_STATE_HOVER_ACTIVE = 4;

//Button class
Dots.Button = cc.Sprite.extend({

    _state: Dots.BUTTON_STATE_NORMAL,
    _touchListener: null,   //touch listener (mobile, desktop)
    _mouseListener: null,   //mouse listener (desktop)
    _scale: 1.0,            //normal scale
    _hoverScale: 1.05,      //hover scale
    _target: null,          //event callback target
    _hoverCallback: null,   //hover callback
    _activeCallback: null,  //active callback
    _enabled: false,        //button enable/disable
    _activeColor: null,     //tint color in active
    _label: null,           //sub label
    _icon: null,            //sub icon
	_icon1: null,           //sub icon1

    //constructor
    ctor: function (img, scale, target, hoverCallback, activeCallback) {

        this._scale = scale;
        this._hoverScale = 1.05;
        this._state = Dots.BUTTON_STATE_NORMAL;
        this._target = target;
        this._hoverCallback = hoverCallback;
        this._activeCallback = activeCallback;
        this._enabled = true;
        this._activeColor = cc.color(150, 150, 150, 255);
        this._label = null;
        this._icon = null;
        this._icon1 = null;

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

        cc.Sprite.prototype.ctor.call(this, img);
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
    },

    //set sub label
    setLabel: function (text, fontface, fontsize, color) {

        this._label = new cc.LabelTTF(text, fontface, fontsize);
        this._label.setColor(color);
        this._label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this._label, 2);
    },

    //set sub label position
    setLabelPosition: function (positionX, positionY) {
        if(this._label === null)
            return;

        this._label.setPosition(positionX, positionY);
    },

    //set sub icon
    setIcon: function (img, scale) {

        this._icon = new cc.Sprite(img);
        this._icon.setAnchorPoint(0.5, 0.5);
        this._icon.setScale(scale);
        this.addChild(this._icon, 1);
    },

    //set sub icon1
	setIcon1: function (img, scale) {

		this._icon1 = new cc.Sprite(img);
		this._icon1.setAnchorPoint(0.5, 0.5);
		this._icon1.setScale(scale);
		this.addChild(this._icon1, 1);
	},

    //set sub icon position
    setIconPosition: function (positionX, positionY) {
        if(this._icon === null)
            return;

        this._icon.setPosition(positionX, positionY);
    },

    //set sub icon1 position
	setIconPosition1: function (positionX, positionY) {
		if(this._icon1 === null)
			return;

		this._icon1.setPosition(positionX, positionY);
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

    //override touch cancelled callback (mobile, desktop)
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

    //process mouse hover
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

            if(this._state === Dots.BUTTON_STATE_NORMAL) {

                this.setScale(this._scale * this._hoverScale);
                this.setColor(this._activeColor);
                if(this._icon)
                    this._icon.setColor(this._activeColor);
				if(this._icon1)
					this._icon1.setColor(this._activeColor);
            }
            else {
                this.setColor(this._activeColor);
                if(this._icon)
                    this._icon.setColor(this._activeColor);
				if(this._icon1)
					this._icon1.setColor(this._activeColor);
            }

            this._state = Dots.BUTTON_STATE_HOVER_ACTIVE;
            return true;
        }
        else {
          //  this._state = Dots.BUTTON_STATE_ACTIVE;
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
            this.setColor(cc.color(255, 255, 255, 255));
            if(this._icon)
                this._icon.setColor(cc.color(255, 255, 255, 255));
			if(this._icon1)
				this._icon1.setColor(cc.color(255, 255, 255, 255));
            document.body.style.cursor = "initial";

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
            this.setColor(cc.color(255, 255, 255, 255));
            if(this._icon)
                this._icon.setColor(cc.color(255, 255, 255, 255));
			if(this._icon1)
				this._icon1.setColor(cc.color(255, 255, 255, 255));

            if(this._target !== null && this._activeCallback !== null) {
                document.body.style.cursor = "initial";
                this._activeCallback.call(this._target, this);
            }
        }

        this._state = Dots.BUTTON_STATE_NORMAL;
    }
});
