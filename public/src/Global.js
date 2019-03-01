/****************************************/
/******* global define varaibles ********/
/****************************************/

RESOLUTION_WIDTH = 640;			//design resolution width
RESOLUTION_HEIGHT = 960;		//design resolution height

USER_NONE					= 0;
USER_ME						= 1;
USER_OPP					= 2;

BOARD_3						= 1; //board 3x3
BOARD_5						= 2; //board 5x5

BOARD_7                     = 3; //board 7x7

PACKET_RES_CONNECTED 		= 1;
PACKET_RES_DISCONNECTED 	= 2;
PACKET_RES_REGISTER			= 3;
PACKET_RES_LOGIN			= 4;
PACKET_RES_GAMESTARTED		= 5;
PACKET_RES_GAMEUPDATE		= 6;
PACKET_RES_GAMEOVER			= 7;
PAKCET_RES_GAMEWIN_DISCON	= 8;
PACKET_RES_GAMEOVER_THROW	= 9;

PACKET_RES_TIMEOUT          =10;


var g_setting_music = true;		//bgm on/off setting
var g_setting_sound = true;		//effect on/off setting

var g_board_row = 3;			//board matrix row
var g_board_col = 3;			//board matrix col

var g_game_time = 30;			//game default time

var GameConnect = null;
var g_layers = [];
var g_me = {};
var g_opp = {};
var g_roomid = 0;
var g_turn;
var g_board;

var g_board_type = BOARD_3;
var g_board_name = ["3X3", "5X5", "7X7"];
var g_creater_id = {};
var g_slave_id = {};
var g_fb_invited_friend_id = null;
var g_fb_invited_friend_name = null;
var g_fb_invited_friend_photo = null;
var g_fb_player_id = null;
var g_fb_player_name = null;
var g_fb_player_photo = null;
var g_fb_invite_friend = false;
var g_invite_friend = false;

var g_result = null;