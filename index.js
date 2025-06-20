
const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
const events = require('./events.js');
require('./monitor');

// SERVER HTTP

app.use(cors());
app.use(express.json());

app.get('/players', (req, res) => {

	res.send(events.data.players);
});

// SERVER WEB SOCKET

const http = require('http');
const ws = require('ws');
const httpServer = http.createServer(app);
const wsServer = new ws.Server({ server: httpServer });

wsServer.on('connection', (wsClient) => {

	wsClient.on('message', (msg) => {

		const event = JSON.parse(msg);

		event.id = ++events.data.count;
		events.data.events.push(event);

		let result = events.eventEnter(event) || events.eventMove(event) ||
			events.eventStopMove(event) || events.eventMsg(event);

		event.data = result;

		if (event.data === undefined) {

			return;
		}

		for (const client of wsServer.clients) {

			client.send(JSON.stringify(event));
		}

	});
});


httpServer.listen(port, () => {

	console.log(`http://localhost:${port}`);
});