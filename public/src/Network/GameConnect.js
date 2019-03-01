/****************************************/
/***********    GameConnect   ***********/
/****************************************/



// var config = {
//     apiKey: "AIzaSyDc3BSjS3aBY_cJHyYOt_uOOJDY3hKcRrw",
//     authDomain: "dotgame-test-82f22.firebaseapp.com",
//     databaseURL: "https://dotgame-test-82f22.firebaseio.com",
//     projectId: "dotgame-test-82f22",
//     storageBucket: "dotgame-test-82f22.appspot.com",
//     messagingSenderId: "559465539010"
// };

// var config = {
//     apiKey: "AIzaSyD5e4MyBca382rbmrNM_-whk_gjlf3ZQok",
//     authDomain: "dotgame2-e553d.firebaseapp.com",
//     databaseURL: "https://dotgame2-e553d.firebaseio.com",
//     projectId: "dotgame2-e553d",
//     storageBucket: "dotgame2-e553d.appspot.com",
//     messagingSenderId: "109131278903"
// };

var config = {
    apiKey: "AIzaSyCPB9yH_yQemNVK2GTLhinoLpCV46lC08c",
    authDomain: "dotsandboxes-d557d.firebaseapp.com",
    databaseURL: "https://dotsandboxes-d557d.firebaseio.com",
    projectId: "dotsandboxes-d557d",
    storageBucket: "dotsandboxes-d557d.appspot.com",
    messagingSenderId: "771057528641"
};

firebase.initializeApp(config);

function GameConnect() {
    this.room;
    this.db;
    this.rooms;
    this.lobby;
}

GameConnect.prototype.connectServer = function () {
    console.log("===GameConnect init===");

    this.db = firebase.firestore();
    this.db.settings({ timestampsInSnapshots: true })
    this.rooms = this.db.collection("rooms");
    this.lobby = this.db.collection("lobby");

    // Broadcast connection state of fb, to all layers
    for (var i = 0; i < g_layers.length; i++)
        g_layers[i].OnReceivedPacket(PACKET_RES_CONNECTED, null);
};


GameConnect.prototype.startGame = function() {
    this.room.get().then(function(doc) {
        var data = doc.data();
        for (var i = 0; i < g_layers.length; i++)
            g_layers[i].OnReceivedPacket(PACKET_RES_GAMESTARTED, data);
        // set listners for gaming

        GameConnect.room.onSnapshot((doc) => {
            const afterData = doc.data();
            if(afterData === undefined)
                return;
            if (afterData.state === "update") {
                for (var i = 0; i < g_layers.length; i++)
                        g_layers[i].OnReceivedPacket(PACKET_RES_GAMEUPDATE, afterData);
            }else if(afterData.state === "gameover") {
                for (var i = 0; i < g_layers.length; i++)
                    g_layers[i].OnReceivedPacket(PACKET_RES_GAMEOVER, afterData);
            }else if(afterData.state === "throw") {
                for (var i = 0; i < g_layers.length; i++)
                    g_layers[i].OnReceivedPacket(PACKET_RES_GAMEOVER_THROW, afterData);
            }else if(afterData.state === "timeout") {
                for (var i = 0; i < g_layers.length; i++)
                    g_layers[i].OnReceivedPacket(PACKET_RES_TIMEOUT, afterData);
            }
        });
    });
}

GameConnect.prototype.sendRequest = function (req, data) {
    switch (req) {
        case "register":
            // Only for Quest
            for (var i = 0; i < g_layers.length; i++)
                g_layers[i].OnReceivedPacket(PACKET_RES_REGISTER, { status: "success" });
            break;
        case "login":
            var user = firebase.auth().currentUser;
            if (user) {
                for (var i = 0; i < g_layers.length; i++)
                g_layers[i].OnReceivedPacket(PACKET_RES_LOGIN, { status: "fail" });
                return;
            }

            firebase.auth().signInAnonymously().catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                for (var i = 0; i < g_layers.length; i++)
                    g_layers[i].OnReceivedPacket(PACKET_RES_LOGIN, { status: "fail" });
            });
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                // User is signed in.
                    var isAnonymous = user.isAnonymous;
                    var uid = user.uid;
                    var userData = {
                        state: "online",
                        userid: uid,
                        roomid: "",
                        playername: "",
                        playerphoto: ""
                    };

                    // check offline
                    const oldRealTimeDb = firebase.database();
                    const onlineRef = oldRealTimeDb.ref('.info/connected');
                    onlineRef.on('value', snapshot => {

                        oldRealTimeDb
                          .ref(`/status/${uid}`)
                          .onDisconnect() // Set up the disconnect hook
                          .set({online:'offline'}) // The value to be set for this key when the client disconnects
                          .then(() => {

                              // Let's also create a key in our real-time database
                              // The value is set to 'online'
                              oldRealTimeDb.ref(`/status/${uid}`).set({online:'online'});
                          });

                      });

                    GameConnect.db.collection("users").doc(uid).set(userData)
                    .then(function () {
                        for (var i = 0; i < g_layers.length; i++)
                            g_layers[i].OnReceivedPacket(PACKET_RES_LOGIN,
                                {
                                    status: "success",
                                    userInfo: userData
                                });
                    }, { merge: true})
                    .catch(function (error) {

                    });

                    GameConnect.db.collection("users").doc(uid).onSnapshot((doc) => {
                        const afterData = doc.data();
                        if (afterData.roomid !== "") {
                            GameConnect.room = GameConnect.db.collection("rooms").doc(afterData.roomid);
                            GameConnect.db.collection("users").where("roomid", "==", afterData.roomid)
                            .get()
                            .then(function(querySnapshot){
                              querySnapshot.forEach(function(doc){
                                if (doc.data().userid !== uid) {
                                  g_opp.fb_name = doc.data().playername;
                                  g_opp.fb_photo = doc.data().playerphoto;
                                  GameConnect.startGame();
                                }
                              });
                            });
                            //GameConnect.startGame();
                        }
                    });
                } else {
                // User is signed out.
                // ...
                }
                // ...
            });
            break;
        case "game_request":
            var userid = data.id;
            if(userid==undefined){
                userid = firebase.auth().currentUser.uid;
                //console.log("firebase id " + userid);
            }
            var gametype = data.type;
            g_me.fb_id = data.fb_id;
            g_me.fb_name = data.fb_name;
            g_me.fb_photo = data.fb_photo;
            var newLobbyData = {
                userid: userid,
                gametype: gametype,
                fb_id: g_me.fb_id,
                fb_name : g_me.fb_name,
                fb_photo : g_me.fb_photo,
                invite_friend : g_fb_invite_friend,
                fb_friend_id: g_fb_invited_friend_id,
                fb_friend_name: g_fb_invited_friend_name,
                fb_friend_photo: g_fb_invited_friend_photo
            };
            GameConnect.lobby.doc(userid).set(newLobbyData)
            .then(function() {
                console.log('succeed to insert new lobby: ');
            })
            .catch(function(error) {
                console.error('failed to insert new lobby: ', error);
            });
            break;
        case "game_cancel":
            console.log("Room Canceled!");
            break;

        case "game_line":
            this.room.get().then(function(roomRef) {
                var roomData = roomRef.data();
                if(roomRef.data().turn !== data.userid)
                    return;

                for(var box_index = 0; box_index < roomData.board.length; box_index++) {
                    for(var line_index = 0; line_index < roomData.board[box_index].lines.length; line_index++) {
                        if(roomData.board[box_index].lines[line_index].row === data.line.row && roomData.board[box_index].lines[line_index].col === data.line.col) {
                            if(roomData.board[box_index].lines[line_index].state !== 0)
                                return;

                            roomData.board[box_index].lines[line_index].state = 1;
                            break;
                        }
                    }
                }

                if(GameConnect.updateBox(roomData, data.userid))
                    roomData.turn = data.userid;
                else
                    roomData.turn = (data.userid === roomData.create_id) ? roomData.opp_id : roomData.create_id;

                // Check GameOver
                if(GameConnect.checkGameOver(roomData)) {
                    roomData.state = "gameover";
                    GameConnect.room.update(roomData).then(function(roomRef) {
                    })
                }
                else {
                    roomData.state = "update";
                    GameConnect.room.update(roomData).then(function(roomRef) {
                        // auto call update packet in snapshot
                    })
                }
            })
            break;
        case "throw_actual":
            GameConnect.room.get().then(function(roomRef) {
                var roomData = roomRef.data();
                roomData.state = "throw";
                if (roomData.create_id === data.id) {
                    roomData.winner = roomData.opp_id;
                    roomData.loser = roomData.create_id;
                }else{
                    roomData.winner = roomData.create_id;
                    roomData.loser = roomData.opp_id;
                }
                GameConnect.room.update(roomData).then(function(roomRef){
                });
            });
            break;
        case "throw_timeout":
            GameConnect.room.get().then(function(roomRef) {
                var roomData = roomRef.data();
                roomData.state = "timeout";
                GameConnect.room.update(roomData).then(function(roomRef){
                });
            });
            break;

        case "check_invited":
            GameConnect.lobby.where("invite_friend", "==", true).where("fb_friend_id", "==", data.fb_player_id)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc){
                g_board_type = doc.data().gametype;
                g_fb_invite_friend = true;
                g_invite_friend = true;
                g_fb_invited_friend_id = doc.data().fb_id;
                g_fb_invited_friend_name = doc.data().fb_name;
                g_fb_invited_friend_photo = doc.data().fb_photo;
                console.log("Succeed to finding friend");
                cc.director.runScene(new PrepareScene());
              });
            }).catch(function(error) {
                g_fb_invite_friend = false;
                g_invite_friend = false;
                g_fb_invited_friend_id = null;
                g_fb_invited_friend_name = null;
                g_fb_invited_friend_photo = null;
                console.log("Failed to finding friend");
            });
            break;
    }
};

GameConnect.prototype.updateBox = function(room, userid) {
    var updated = false;

	for(var box_index = 0; box_index < room.board.length; box_index++) {

		if(room.board[box_index].owner !== 0)
			continue;

		var box_matched = true;
		for(var line_index = 0; line_index < room.board[box_index].lines.length; line_index++) {
			if(room.board[box_index].lines[line_index].state === 0) {
				box_matched = false;
				break;
			}
		}

		if(box_matched) {
			room.board[box_index].owner = userid;
			if(userid === room.create_id)
				room.create_point++;
			else if(userid === room.opp_id)
				room.opp_point++;
			updated = true;
		}
	}

	return updated;
}

GameConnect.prototype.checkGameOver = function(room) {
	for(var box_index = 0; box_index < room.board.length; box_index++) {
		if(room.board[box_index].owner === 0)
			return false;
	}

	return true;
}

GameConnect.prototype.makeBoard = function(type) {

	var board_size = 0;
	if(type === BOARD_3)
		board_size = 3;
	else if(type === BOARD_5)
        board_size = 5;

    else if(type === BOARD_7)
        board_size = 7;

	else
		return;

	var board = [];
	for(var box_index = 0; box_index < board_size * board_size; box_index++) {
		var x = Math.floor(box_index / board_size);
		var y = box_index % board_size;
		board.push(
			{
				row : x,
				col : y,
				owner : 0,
				lines : []
			}
		);

		board[box_index].lines.push(
			{
				row : x * 2 + 1,
				col : y,
				state : 0
			}
		);
		board[box_index].lines.push(
			{
				row : x * 2,
				col : y,
				state : 0
			}
		);
		board[box_index].lines.push(
			{
				row : x * 2 + 1,
				col : y + 1,
				state : 0
			}
		);
		board[box_index].lines.push(
			{
				row : x * 2 + 2,
				col : y,
				state : 0
			}
		);
	}

	return board;
}
GameConnect.prototype.sendFBMessage = function(type) {
    var addMessage = firebase.functions().httpsCallable('addMessage');
    addMessage({text: messageText}).then(function(result) {
      // Read result of the Cloud Function.
      var sanitizedMessage = result.data.text;
    }).catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // ...
    });
}

