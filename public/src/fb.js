/****************************************/
/***********        fb        ***********/
/****************************************/
const { MessengerClient } = require('messaging-api-messenger');
// get accessToken from facebook developers website

function sendWellcomeMessage(){
    const ACCESS_TOKEN = "EAAaYEqIq5kkBADlE6uTXZBKxd5qHmxwEmot4pfhwa4iZBEMcfZAroRxJox6s8PwtwsswGAN3l0jsNftFZAgORJao3BZAbhdDQvRnatjqO9NQRME84nsbQcmVaiLovXpDzRFWOHUvdlZBFdF0N6RQw3ZCGuiCNIcJFwl7ELwSiYuQI0waAHNTGL714FZBgBvTjjYZD";
    const client = MessengerClient.connect({
    accessToken: ACCESS_TOKEN,
    version: '3.1',
    });
    const wellcomeMessageID = 10101010101;
    // create broadcast message
    client
    .createMessageCreative([
        MessengerClient.createGenericTemplate([
        {
          title: 'Welcome!',
          subtitle: 'Please play game with friends',
          buttons: [
            {
              type: 'web_url',
              url: 'https://www.facebook.com/instantgames/1856055657817673/',
              title: 'Play game',
            },
          ],
        },
      ]),
    ])
    .then(result => {
      console.log(result);
      // {
      //   message_creative_id: wellcomeMessageID,
      // }
    });
    
    client.sendBroadcastMessage(wellcomeMessageID).then(result => {
        console.log(result);
        // {
        //   broadcast_id:
        // }
    });
}


