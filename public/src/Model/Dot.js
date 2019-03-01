/****************************************/
/*********** Dot Model class ************/
/****************************************/

function Dot() {
	this.position 	= null;			//dot position
	this.sprite 	= null;			//dot sprite
	this.collecter	= USER_NONE;	//user that collect dot
	this.row		= null;
	this.col 		= null;

	this.setPosition = function (position) {
		this.position = position;
	};

	this.setSprite = function(sprite) {
		this.sprite = sprite;
	};

	this.setCollecter = function(collecter) {
		this.collecter = collecter;
	};

	this.setRow = function(row) {
		this.row = row;
	};

	this.setCol = function(col) {
		this.col = col;
	};

	this.getPosition = function() {
		return this.position;
	};

	this.getSprite = function() {
		return this.sprite;
	};

	this.getCollecter = function() {
		return this.collecter;
	};

	this.getRow = function() {
		return this.row;
	};

	this.getCol = function() {
		return this.col;
	}
}