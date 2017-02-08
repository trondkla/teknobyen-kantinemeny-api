var graph = require('fbgraph');
var _ = require('lodash');
var moment = require('moment');
var env = require('node-env-file');

env(__dirname + '/.env');

graph.setAccessToken(process.env.ACCESS_TOKEN);
graph.setVersion("2.8");

var options = {
	limit: 20
};


function getKantine() {
	return new Promise((resolve, reject) => {
		graph
		   .setOptions(options)
		   .get('teknobyen.kantine/feed', (err, res) => {
				if(err) {
					reject(err);
				}
				let lastMenyMessage = _.find(res.data, (msg) => {
					return msg.message.toLowerCase().startsWith('meny uke')
				});

				var msg = lastMenyMessage.message.split('\n');
				var meny = {};

				var uke = msg[0].toLowerCase().split('meny uke ')[1];

				for(let i = 1; i < msg.length-1; i++) {
					if (msg[i].indexOf('dag - ') >= 0) {
						let day = msg[i].split(' - ');

						meny[day[0]] = {
							food: day[1].trim()
						};
					}
				}

				resolve({
					hvor: "Teknobyen kantine",
					url: "https://www.facebook.com/teknobyen.kantine/",
					uke: uke,
					meny: meny
				});
			});
	});
}

function getAndreSiden() {
	return new Promise((resolve, reject) => {
		graph
			.setOptions(options)
		    .get('kantineteknobyen/feed', (err, res) => {
				if(err) {
					reject(err);	
				}
				let lastMenyMessage = _.find(res.data, (msg) => {
					return msg.message.toLowerCase().startsWith('dagens varmlunsj uke')
				});

				var msg = lastMenyMessage.message.split('\n');
				var meny = {};

				var uke = msg[0].replace('Dagens varmlunsj uke ', '').replace(' - Teknobyen Innovasjonsenter', '');

				for(let i = 1; i < msg.length-1; i++) {
					if (msg[i].indexOf('dag:') >= 0) {
						let day = msg[i].split(':');

						meny[day[0]] = {
							food: day[1].trim()
						};

						let allergies = msg[i+1].split(':');
						if (allergies.length == 2) {
							allergies = allergies[1].replace(')', '').trim();

							meny[day[0]].allergies = allergies;
						}
					}
				}

				resolve({
					hvor: "Hegstad & Blakstad - Teknobyen",
					url: "https://www.facebook.com/kantineteknobyen/",
					uke: uke,
					meny: meny
				});
			});
	});
}

module.exports = {
	kantine: getKantine,
	andre: getAndreSiden
};
