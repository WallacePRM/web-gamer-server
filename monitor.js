
const { data, EventType, EventStatus } =  require("./events.js");

function monitorPlayers(wsClient) {

	const currentTime = new Date();

	for (const player of data.players) {

		const minutesInactive = ((currentTime - new Date(player.time)) / 1000) / 60;
		if (minutesInactive <= 1)
			continue;

		const event = {
			id: crypto.randomUUID(),
			status: EventStatus.ok,
			type: EventType.inactivity,
			data: {
				playerId: player.id
			}
		};

		wsClient.send(JSON.stringify(event));
	}
}

module.exports = {
  monitorPlayers
}