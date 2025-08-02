
const express = require('express');
const cors = require('cors');
const { data, triggerEvent } = require('./events');
const { monitorPlayers } = require('./monitor');
require('./monitor');

// SERVER HTTP

const app = express();
const port = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

app.get('/players', (req, res) => {

	res.send(data.players);
});

// SERVER WEB SOCKET

const http = require('http');
const ws = require('ws');
const httpServer = http.createServer(app);
const wsServer = new ws.Server({ server: httpServer });

wsServer.on('connection', (wsClient) => {

	wsClient.on('message', (msg) => {

		const event = JSON.parse(msg);
		const response = triggerEvent(event);
		if (!response)
			return;

		if (event.id) {
			response.id = event.id;
			wsClient.send(JSON.stringify(response));
		}

		const broadcast = { ...event };
		delete broadcast.id;

		for (const client of wsServer.clients)
			if (client.readyState === WebSocket.OPEN)
				client.send(JSON.stringify(broadcast));
	});

	setInterval(() => monitorPlayers(wsClient), 1000 * 11);
});

httpServer.listen(port, () => {

	console.log(`http://localhost:${port}`);
});