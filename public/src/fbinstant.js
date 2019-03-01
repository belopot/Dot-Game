/****************************************/
/***********     fbinstant    ***********/
/****************************************/

function console_log(Message) {
  console.log(Message);
}

var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
var text_style = "";

const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

function toDataURL_profile(src, profile_src, callback, outputFormat) {
	var canvas = document.createElement('CANVAS');
	var ctx = canvas.getContext('2d');
	var dataURL;
	canvas.width = 360;
	canvas.height = 188;
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	var profile = new Image();
	profile.crossOrigin = 'Anonymous';
	profile.src = profile_src;
	profile.onload = function() {
		ctx.drawImage(this, 0, 0, this.naturalWidth, this.naturalHeight, 131, 77, 99, 99);
		
		img.src = src;
		if (img.complete || img.complete === undefined) {
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src = src;
		}
	};
	img.onload = function() {
		ctx.drawImage(this, 0, 0, this.naturalWidth, this.naturalHeight, 0, 0, 360, 188);
		dataURL = canvas.toDataURL(outputFormat);
		callback(dataURL);
	};
	if (img.complete || img.complete === undefined) {
		img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		img.src = src;
	}
}

function FBInstantGames_setSessionData(jsonData) {
	FBInstant.setSessionData(JSON.parse(jsonData));	
}

function FBInstantGames_setSessionData_profile(profile_url, jsonData) {
	var data = JSON.parse(jsonData);
	data.img = profile_url;
	FBInstant.setSessionData(data);	
}

function FBInstantGames_getDataAsync(jsonStr,callbackfunction) {
	FBInstant.player
	  .getDataAsync(JSON.parse(jsonStr))
	  .then(function(data) {
		  var ret = JSON.stringify(data);
		  console_log('getDataAsync: '+ret);
		  //var achievements = data['achievement'];
		  //var currentLife = data['games'];
		  eval("gml_Script_"+callbackfunction+"(null,null,'"+ret+"')");
	  }).catch(function(err){
		  console_log('getDataAsync error: ' + err.message);
		  console.error('getDataAsync error: ' + err.message);
		  eval("gml_Script_"+callbackfunction+"(null,null,'{}')");
	  });
}

function FBInstantGames_setDataAsync(jsonData) {
	var data = JSON.parse(jsonData);
	FBInstant.player
	  .setDataAsync(data)
	  .then(function() {
		//console_log('data is set: ' + jsonData);
	  }).catch(function(err) {
		  //console_log('getDataAsync error: ' + err.message);
		  console.error('getDataAsync error: ' + err.message);
	  });
}

function FBInstantGames_GetContextID() {
	return FBInstant.context.getID();
}

function FBInstantGames_GetContextType() {
	return FBInstant.context.getType();
}

function FBInstantGames_Context_chooseAsync(minSize, maxSize, filters, callbackfunction) {
		var options = {};
		if(minSize>1)
			options["minSize"] = minSize;
		if(maxSize>1)
			options["maxSize"] = maxSize;
		if(filters!="")
			options["filters"] = filters;
		FBInstant.context.chooseAsync(options)
		  .then(function() {
			var done = 1;
			var contextID = FBInstant.context.getID();
			var error = "none";
			eval("gml_Script_"+callbackfunction+"('"+done+"','"+contextID+"','"+error+"')");
		  })
		.catch(function(error) {
			var done =0;
			var contextID = "none";
			var error = error.code;
			eval("gml_Script_"+callbackfunction+"('"+done+"','"+contextID+"','"+error+"')");
		});
}

function FBInstantGames_inviteAsync(_template) {
	toDataURL_profile("res/img/messenger_profile_frame.png", FBInstantGames_GetPlayerPic(), function(dataUrl) {
		var image64 = dataUrl;
		
		switch(_template) {
			default:
				txt_default = 'Come and play Dot Game with me!';
				txt_es = '\u00A1Ven a jugar Dot Game conmigo!';
				txt_de = 'Komm und spiel Käsekästchen mit mir!';
				txt_fr = 'Venez à jouer points & boîtes avec moi !';
				txt_it = 'Vieni a giocare a Dot Game con me!';
				txt_pt = 'Venha e jogue Dot Game comigo!';
				txt_vi = 'Hãy đến và chơi Dot Game với tôi nào!';
				break;
		}
		FBInstant.updateAsync({
		  action: 'CUSTOM',
		  //cta: 'Join The Fight',
		  image: image64,
		  text: {
			default: txt_default,
			localizations: {
			  es_LA: txt_es,
			  es_ES: txt_es,
			  es_MX: txt_es,
			  de_DE: txt_de,
			  fr_FR: txt_fr,
			  fr_CA: txt_fr,
			  it_IT: txt_it,
			  pt_PT: txt_pt,
			  pt_BR: txt_pt,
			  vi_VN: txt_vi,
			}
		  },
		  template: _template,
		  data: {
			  type : 'INVITE',
		  },
		  strategy: 'IMMEDIATE',
		  notification: 'PUSH',
		}).then(function() {
		  console_log('inviteAsync success');
		}).catch(function(error) {
			console_log('inviteAsync error: '+error.message);
		});
	})
}

function FBInstantGames_GetPlayerName() {
	return FBInstant.player.getName();
}

function FBInstantGames_GetPlayerPic() {
	return FBInstant.player.getPhoto();
}

function FBInstantGames_GetPlayerID() {
	return FBInstant.player.getID();
}

function FBInstantGames_Quit() {
	FBInstant.quit();
}

function FBInstantGames_GetPlatform() {
	return FBInstant.getPlatform();
}

function FBInstantGames_GetLocale() {
	return FBInstant.getLocale();
}

function FBInstantGames_GetEntryPointData() {
	return JSON.stringify(FBInstant.getEntryPointData());
}

function FBInstantGames_getConnectedPlayers(callbackfunction) {
		var ret = '{"players":[';
		var n_players = 0;
		var connectedPlayers = FBInstant.player.getConnectedPlayersAsync()
		  .then(function(players) {
			if(n_players>0)
				ret += ',';
			n_players++;
			ret += players.map(function(player) {
			  return '{"id":"'+player.getID()+'","name":"'+player.getName()+'","url":"'+player.getPhoto()+'"}';
			});
		  })
	    .then(() => {
			ret += ']}';
			eval("gml_Script_"+callbackfunction+"(null,null,'"+ret+"')");
		})
		.catch(function(error) {
		    var ret = '{"error":"'+error.code+'"}';
			eval("gml_Script_"+callbackfunction+"(null,null,'"+ret+"')");
		});
}

function FBInstantGames_getPlayersAsync(callbackfunction) {
		var n_players = 0;
		var playerIDs = [];
		var playerNames = [];
		var playerPhotos = [];
		var contextPlayers = FBInstant.context.getPlayersAsync()
		  .then(function(players) {
			n_players++;
			players.map(function(player) {
				playerIDs.push(player.getID());
				playerNames.push(player.getName());
				playerPhotos.push(player.getPhoto());
			});
		  })
	    .then(() => {
			eval("gml_Script_"+callbackfunction+"('"+playerIDs+"','"+playerNames+"','"+playerPhotos+"')");
		})
		.catch(function(error) {
		    var ret = '{"error":"'+error.code+'"}';
		});
}