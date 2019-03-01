const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Since this code will be running in the Cloud Functions enviornment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

//This function adds the completed game rooms to completed_rooms
//collection.
exports.onRoomCompleted = functions.firestore.document("rooms/{roomId}").onUpdate((change, context) => {
  const data = change.after.data();
  if (data.winner) {
    firestore.collection("completed_rooms").add(data)
    .then(() => {
      change.after.ref.delete().then(() => {
      });
    }).catch((err) => {
      console.log(err);
    });
  }
  return true;
});
// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChanged = functions.database.ref('/status/{uid}').onUpdate(
    (change, context) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();
      const start_time = new Date();

      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = firestore.doc(`status/${context.params.uid}`);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      return change.after.ref.once('value').then((statusSnapshot) => {
        const status = statusSnapshot.val();
        // console.log(status, eventStatus);
        if (eventStatus.online === "offline") {
          // Remove lobby
          // console.log("userid: ", context.params.uid);
      firestore.collection("lobby").where("userid", "==", context.params.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc){
            var player_data = doc.data();

            player_data.timestamp = new Date();

            // console.log("remove cadidates", doc.data());
            firestore.collection("lobby").doc(doc.id).delete();
            player_data.exec_time = parseInt(new Date() - start_time);
            firestore.collection("completed_lobby").add(player_data);
          });
        });

      // send gameover to rooms

      firestore.collection("rooms").where("create_id", "==", context.params.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc){

            // console.log("update room", doc.data());
            var roomData = doc.data();
            if (typeof roomData.opp_id === 'undefined') {
                  firestore.collection("rooms").doc(roomData.roomid).delete();
                }else{
              roomData.state = "throw";
              roomData.winner = roomData.opp_id;
                        roomData.loser = roomData.create_id;
                        firestore.collection("rooms").doc(roomData.roomid).update(roomData);
                      }
          });
        });

      firestore.collection("rooms").where("opp_id", "==", context.params.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc){
            // console.log("update room", doc.data());
            var roomData = doc.data();
            roomData.state = "throw";
            roomData.winner = roomData.create_id;
                      roomData.loser = roomData.opp_id;
                      firestore.collection("rooms").doc(roomData.roomid).update(roomData);
          });
        });
        }
        return userStatusFirestoreRef.set(eventStatus);
      });
    });

var findFreeRoom = function(trs, gametype, userid, playerName, invite, fb_id) {
  console.log("entering findFreeRoom", playerName);
  if(invite){
    return trs.get(firestore.collection("lobby")
    .where("fb_friend_id", "==", fb_id))
    .then(function(snapshots) {
      console.log("FOUND_SAME_GAME_TYPE", playerName);
      return snapshots.docs.find(function(doc) {
        console.log("RETURN_FOUND_USER", playerName, doc);
        return doc.data().userid !== userid;
      });
    })
  }
  else{
    return trs.get(firestore.collection("lobby")
    .where("gametype", "==", gametype))
    .then(function(snapshots) {
      console.log("FOUND_SAME_GAME_TYPE", playerName);
      return snapshots.docs.find(function(doc) {
        console.log("RETURN_FOUND_USER", playerName, doc);
        return doc.data().userid !== userid;
      });
    })
  }
}

var isUserInLobby = function (trs, userid, playerName) {
  console.log("entering isUserInLobby", playerName);
  return trs.get(firestore.collection("lobby"))
    .then(function(snapshots) {
      console.log("isUserInLobby find users from the lobby collection", playerName);
      return snapshots.docs.find(function(doc) {
        if (doc.data().userid === userid) {
          console.log("user found in lobby while checking", playerName);
        }
        return doc.data().userid === userid;
      });
    });
}

exports.requestRoom = functions.firestore
    .document('lobby/{user}')
    .onCreate((snap, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const start_time = new Date();
      const newValue = snap.data();
      const newSnapid = snap.id;

      // access a particular field as you would any JS property
      const userid = newValue.userid;
      const gametype = newValue.gametype;
      const playerName = newValue.fb_name;
      const playerPhoto = newValue.fb_photo;
      const roomDocRef = firestore.collection("rooms").doc();

      const fb_invite_friend = newValue.invite_friend;
      const fb_id = newValue.fb_id;
      
      console.log("requestRoom running for", playerName);
      return firestore.runTransaction((trs) => {
        return isUserInLobby(trs, userid, playerName)
        .then(function(in_lobby) {
          if(!in_lobby) {
            console.log("not in lobby", in_lobby, playerName);
            return false;
          } else {
            console.log("user in lobby", in_lobby, playerName);
            return findFreeRoom(trs, gametype, userid, playerName, fb_invite_friend, fb_id)
          }
        }).then(function(doc) {
          if(!doc) {
            return false;
          }
          console.log("findFreeRoom returned", playerName);
          // Create room with these two users
          // Create Board
          var board_size = 0;
          if (gametype === 1) {
            board_size = 3;
          } else if(gametype === 2) {
            board_size = 5;
          } else{
            board_size = 7;
          }
          var board = [];
          for (var box_index = 0; box_index < board_size * board_size; box_index++) {
            var x = Math.floor(box_index / board_size);
            var y = box_index % board_size;
            board.push({row : x, col : y, owner : 0, lines : []});

            board[box_index].lines.push({row : x * 2 + 1, col : y, state : 0});
            board[box_index].lines.push({row : x * 2, col : y, state : 0});
            board[box_index].lines.push({row : x * 2 + 1, col : y + 1, state : 0});
            board[box_index].lines.push({row : x * 2 + 2, col : y, state : 0});
          }

          var roomData = {
                    create_id: userid,
                    create_name: playerName,
                    create_online: true,
                    roomid: roomDocRef.id,
                    type: gametype,
                    turn: userid,
                    state: "started",
                    opp_id: doc.data().userid,
                    opp_name: doc.data().fb_name,
                    opp_online: true,
                    board: board,
                    create_point: 0,
                    opp_point: 0
                }

              // Add Room
              trs.set(roomDocRef, roomData);
              console.log("room added successfully", playerName, "against", doc.data().fb_name);

              var exec_time = parseInt(new Date() - start_time);
              var creator_ref = firestore.collection("users").doc(userid);
              var opponent_ref = firestore.collection("users").doc(doc.data().userid);
              var creator_data = {roomid: roomData.roomid, playername: playerName, playerphoto: playerPhoto};
              var opponent_data = {roomid: roomData.roomid, playername: doc.data().fb_name, playerphoto: doc.data().fb_photo};

              trs.update(creator_ref, creator_data);
              trs.update(opponent_ref, opponent_data);

              // remove lobby
              trs.delete(firestore.collection("lobby").doc(newSnapid));
              trs.delete(firestore.collection("lobby").doc(doc.id));
              console.log("lobby deleted successfully", playerName);

              creator_data.exec_time = opponent_data.exec_time = parseInt(new Date() - start_time);
              firestore.collection("completed_lobby").add(creator_data);
              firestore.collection("completed_lobby").add(opponent_data);
            });
        }).catch((reason) => {
          console.error("ERROR::" + reason, playerName);
        });
      });

/****************************************/
/***********        fb        ***********/
/****************************************/
exports.SendFacebookMessage = functions.https.onCall((data, context) => {
  // ...
       // Page-scoped ID of the bot user
       var senderId = event.sender.id; 

       // FBInstant player ID
       var playerId = event.game_play.player_id; 

       // FBInstant context ID 
       var contextId = event.game_play.context_id;

       // Check for payload
       if (event.game_play.payload) {
           //
           // The variable payload here contains data set by
           // FBInstant.setSessionData()
           //
           var payload = JSON.parse(event.game_play.payload);

           // In this example, the bot is just "echoing" the message received
           // immediately. In your game, you'll want to delay the bot messages
           // to remind the user to play 1, 3, 7 days after game play, for example.
           sendMessage(senderId, null, "Message to game client: '" + payload.message + "'", "Play now!", payload);
       }
});
    //
    // Send bot message
    //
    // player (string) : Page-scoped ID of the message recipient
    // context (string): FBInstant context ID. Opens the bot message in a specific context
    // message (string): Message text
    // cta (string): Button text
    // payload (object): Custom data that will be sent to game session
    // 
    function sendMessage(player, context, message, cta, payload) {
      var button = {
          type: "game_play",
          title: cta
      };

      if (context) {
          button.context = context;
      }
      if (payload) {
          button.payload = JSON.stringify(payload)
      }
      var messageData = {
          recipient: {
              id: player
          },
          message: {
              attachment: {
                  type: "template",
                  payload: {
                      template_type: "generic",
                      elements: [
                      {
                          title: message,
                          buttons: [button]
                      }
                      ]
                  }
              }
          }
      };

      callSendAPI(messageData);

  }

  function callSendAPI(messageData) {
      var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token='+process.env.PAGE_ACCESS_TOKEN
      request({
          url: graphApiUrl,
          method: "POST",
          json: true,  
          body: messageData
      }, function (error, response, body){
          console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
      });
  }
