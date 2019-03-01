/****************************************/
/********** ButtonLabel widget **********/
/*one TTFLabel (normal, active, disable)
/****************************************/

Dots.ButtonLabel = cc.LabelTTF.extend({

	_state: Dots.BUTTON_STATE_NORMAL,
	_touchListener: null,			//touch listener (mobile, desktop)
	_mouseListener: null,			//mouse listener (desktop)
	_scale: 1.0,					//normal scale
	_hoverScale: 1.05,				//hover scale
	_target: null,					//event callback target
	_hoverCallback: null,			//hover callback
	_activeCallback: null,			//active callback
	_enabled: false,				//button enable/disable
	_normalColor: null,				//normal text color
	_activeColor: null,				//active text color

	//constructor
	ctor: function (text, fontface, fontsize, nor_color, act_color, scale, target, hoverCallback, activeCallback) {

		this._scale = scale;
		this._hoverScale = 1.05;
		this._state = Dots.BUTTON_STATE_NORMAL;
		this._target = target;
		this._hoverCallback = hoverCallback;
		this._activeCallback = activeCallback;
		this._enabled = true;
		this._normalColor = nor_color;
		this._activeColor = act_color;

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

		cc.LabelTTF.prototype.ctor.call(this, text, fontface, fontsize);
		this.setColor(nor_color);
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

	//override touch cancel callback(mobile, desktop)
	_onTouchCancelled: function (touch, event) {

		var target = event.getCurrentTarget();
		target._procTouchEnd(touch);
	},

	//override touch move callback(mobile)
	_onTouchMoved: function (touch, event) {

		var target = event.getCurrentTarget();
		target._procTouchMoved(touch);
	},

	//override mouse move callback(desktop)
	_onMouseMoved: function (event) {

		var target = event.getCurrentTarget();
		target._procHover(event);
	},

	//process mouse hover event
	_procHover: function (event) {

		if(!this._enabled)
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
					document.body.style.cursor = "pointer";
					this._hoverCallback.call(this._target, this, Dots.BUTTON_STATE_HOVER_BEGAN);
				}
			}
		}
		else {
			if(this._state === Dots.BUTTON_STATE_HOVER_BEGAN) {
				this.setScale(this._scale);
				this._state = Dots.BUTTON_STATE_NORMAL;
				if(this._target !== null && this._hoverCallback !== null) {
					document.body.style.cursor = "initial";
					this._hoverCallback.call(this._target, this, Dots.BUTTON_STATE_HOVER_END);
				}
			}
		}
	},

	//process touch begin event
	_procTouchBegan: function (touch) {

		if(!this._enabled)
			return false;

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
			}
			else {
				this.setColor(this._activeColor);
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

		if(this._state !== Dots.BUTTON_STATE_HOVER_ACTIVE)
			return;

		var touchLocation = touch.getLocation();
		var locationInNode = this.convertToNodeSpace(touchLocation);

		var size = this.getContentSize();
		var rect = cc.rect(0, 0, size.width, size.height);

		if (!cc.rectContainsPoint(rect, locationInNode)) {
			this.setScale(this._scale);
			this.setColor(this._normalColor);
			document.body.style.cursor = "initial";

			this._state = Dots.BUTTON_STATE_ACTIVE;
		}
	},

	//process touch end event
	_procTouchEnd: function (touch) {

		if(!this._enabled)
			return;

		if(this._state !== Dots.BUTTON_STATE_HOVER_ACTIVE && this._state !== Dots.BUTTON_STATE_ACTIVE)
			return;

		var touchLocation = touch.getLocation();
		var locationInNode = this.convertToNodeSpace(touchLocation);

		var size = this.getContentSize();
		var rect = cc.rect(0, 0, size.width, size.height);

		if (cc.rectContainsPoint(rect, locationInNode)) {
			this.setScale(this._scale);
			this.setColor(this._normalColor);

			if(this._target !== null && this._activeCallback !== null) {
				document.body.style.cursor = "initial";
				this._activeCallback.call(this._target, this);
			}
		}

		this._state = Dots.BUTTON_STATE_NORMAL;
	}
});
