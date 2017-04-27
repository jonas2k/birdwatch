var Twit = require('twit');

var twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

const twitter_screen_name = process.env.TWITTER_SCREEN_NAME;
const basePath = "./public";
const predefindedMessages = ["Nom nom nom", "B-b-b-bird is the word", "Yet another happy customer"];
const hashTags = " #BirdWatch";

class TwitterClient {

    tweet(image, message, socket) {

        twitter.get('account/verify_credentials', { skip_status: true })
            .catch((err) => {
                console.log('caught error', err.stack)
            })
            .then((result) => {
                if (result.data.hasOwnProperty('screen_name') && result.data.screen_name == twitter_screen_name) {
                    if (!message) {
                        message = predefindedMessages[Math.floor(Math.random() * predefindedMessages.length)];
                    }

                    if (message.length <= 140 && image) {

                        image = basePath + image;
                        message += hashTags;
                        console.log("Posting tweet using image " + image + " and text " + message);

                        twitter.postMediaChunked({ file_path: image }, function (err, data, response) {
                            var mediaIdStr = data.media_id_string
                            var meta_params = { media_id: mediaIdStr };

                            twitter.post('media/metadata/create', meta_params, function (err, data, response) {
                                if (!err) {
                                    var params = { status: message, media_ids: [mediaIdStr] };

                                    twitter.post('statuses/update', params, function (err, data, response) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        var returnValue = data.id_str ? "http://twitter.com/" + data.user.screen_name + "/status/" + data.id_str : null;
                                        socket.emit("TweetReturn", returnValue);
                                    })
                                }
                            })
                        });
                    }
                }
            });
    };
}

module.exports = TwitterClient;