const data = {
  count: 0,
  players: [],
  events: []
};

const EventType = {
  enter: "ENTER",
  leave: "LEAVE",
  move: "MOVE",
  stopMove: "STOP_MOVE",
  msg: "MSG"
};

exports.data = data;

exports.eventEnter = function (event) {
  if (event.type !== EventType.enter) return;

  const player = data.players.find(player => player.id === event.data.id);

  if (player)
    return player;

  const newPlayer = {
    id: crypto.randomUUID(),
    name: event.data.name,
    skin: event.data.skin,
    position: event.data.position
  };

  data.players.push(newPlayer);
  return newPlayer;
};

exports.eventMove = function (event) {
  if (event.type !== EventType.move) return;

  const player = data.players.find(
    (player) => event.data.playerId === player.id
  );

  if (player) {
    player.position = event.data.position;
    player.time = new Date();
  }

  return event.data;
};

exports.eventStopMove = function (event) {
  if (event.type !== EventType.stopMove) return;

  return event.data;
};

exports.eventMsg = function (event) {
  if (event.type !== EventType.msg) return;

  return event.data;
};

exports.eventLeave = function (event) {
  if (event.type !== EventType.leave) return;

  const playerIndex = data.players.findIndex((player) => {
    return player.id === event.data.id;
  });

  if (playerIndex === -1) return;

  data.players.splice(playerIndex, 1);
};
