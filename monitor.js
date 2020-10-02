
var {data} = require('./events');

function monitorPlayers() {

    const currentTime = new Date();

    for (let i = 0; i < data.players.length; i++) {

        const result = ((currentTime - data.players[i].time) / 1000) / 60;

        if (result > 1) {

            data.events.push({
                type: 'LEAVE',
                data: {
                    playerId: data.players[i].id
                }
            });

            data.players.splice(i, 1);
        }
    }
}

setInterval(monitorPlayers, 1000 * 20);