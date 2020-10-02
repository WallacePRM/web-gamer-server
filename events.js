
/* 

event = {
    type: 'TYPE',
    data: {
        ...
    }
}

*/

const data = {
    count: 0,
    players: [],
    events: []
};

exports.data = data;

exports.eventEnter = function(event) {

    if (event.type !== 'ENTER') return;

    const hasPlayer = data.players.some((player) => {

        return player.name === event.data.name;
    });

    if (hasPlayer) {

        return;
    }

    const player = {
        id: ++data.count,
        name: event.data.name,
        skin: event.data.skin
    };

    data.players.push(player);
    return player;
}

exports.eventMove = function (event) {

    if (event.type !== 'MOVE') return; 

    const player = data.players.find((player) => event.data.playerId === player.id);
    
    if (player) {

        player.position = event.data.position;
        player.time = new Date();
    }

    return event.data;
}

exports.eventStopMove = function (event) {

    if (event.type !== 'STOP_MOVE') return; 

    return event.data;
}

exports.eventMsg = function(event) {

    if (event.type !== 'MSG') return;
    
    return event.data;
}
