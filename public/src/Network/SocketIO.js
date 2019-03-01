/****************************************/
/*********** Client SOCKET IO ***********/
/****************************************/

function SocketIO() {
	this.host = "127.0.0.1";
	this.port = 8888;
	this.socket;
}

SocketIO.prototype.connectServer = function() {

	//console.log("===socket.io init===");
	
	var server='http://' + this.host + ':' + this.port;

	this.socket = io.connect(server);
	
	this.socket.on('connect', function() {
	    for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_CONNECTED, null);
    });
	
	this.socket.on('disconnect', function() { 
		for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_DISCONNECTED, null);
    });

    this.socket.on("register_res", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_REGISTER, data);
    });

    this.socket.on("login_res", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_LOGIN, data);
    });

    this.socket.on("game_started", function(data) {
    	for(var i = 0; i < g_layers.length; i++) {
	    	g_layers[i].OnReceivedPacket(PACKET_RES_GAMESTARTED, data);
	    }
    });

    this.socket.on("game_update", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_GAMEUPDATE, data);
    });

    this.socket.on("game_over", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_GAMEOVER, data);
    });

    this.socket.on("gameover_disconnect_opp", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PAKCET_RES_GAMEWIN_DISCON, null);
    });

    this.socket.on("gameover_throw", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_GAMEOVER_THROW, data);
	});
	
	
	this.socket.on("game_timeout", function(data) {
    	for(var i = 0; i < g_layers.length; i++)
	    	g_layers[i].OnReceivedPacket(PACKET_RES_TIMEOUT, data);
	});
	
};

SocketIO.prototype.sendRequest = function(req, data) {
	this.socket.emit(req, data);
};