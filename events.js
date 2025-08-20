/** event = {
  * id: number,
  * data: any,
  * type: EventType,
  * status: EventStatus
} */

const data = {
  players: [],
  events: []
};
const EventType = {
  enter: "ENTER",
  move: "MOVE",
  stopMove: "STOP_MOVE",
  msg: "MSG",
  leave: "LEAVE",
  inactivity: "INACTIVITY"
};
const EventStatus = {
  ok: 200,
  error: 404
};

function ok(data) {
  return {
    status: EventStatus.ok,
    data: data ?? {}
  }
}

function error(msg) {
  return {
    status: EventStatus.error,
    data: msg ?? "Falha ao realizar evento"
  }
}

function triggerEvent(event) {

  data.events.push(event);

  let result;
  switch (event.type) {
    case EventType.enter:
      result = eventEnter(event);
      break;
    case EventType.move:
      result = eventMove(event);
      break;
    case EventType.stopMove:
      result = eventStopMove(event);
      break;
    case EventType.msg:
      result = eventMsg(event);
      break;
    case EventType.leave:
      result = eventLeave(event);
      break;
    case EventType.inactivity:
      result = eventStopInactivity(event);
      break;
  }

  return {
    id: event.id,
    status: event.status,
    type: event.type,
    ...result
  }
}

function eventEnter(event) {

  const player = event.data;
  const currentPlayer = data.players.find(p => p.id === player.id);

  if (currentPlayer) {
    currentPlayer.time = new Date();
    return ok(currentPlayer);
  }

  if (player.id) {
    player.time = new Date();
    data.players.push(player);
    return ok(player);
  }

  const nameHasExist = data.players.some(p => p.name === player.name);
  if (nameHasExist)
    return error('Nome em uso');

  const newPlayer = {
    id: crypto.randomUUID(),
    name: player.name,
    skin: player.skin,
    position: player.position
  };

  data.players.push(newPlayer);
  return ok(newPlayer);
}

function eventMove(event) {

  const player = data.players.find(p => event.data.playerId === p.id);
  if (!player)
    return null;

  player.position = event.data.position;
  player.time = new Date();

  return ok(event.data);
}

function eventStopMove(event) {

  const player = data.players.find(p => event.data.playerId === p.id);
  if (!player)
    return null;

  return ok(event.data);
}

function eventMsg(event) {

  const player = data.players.find(p => event.data.playerId === p.id);
  if (!player)
    return null;

  return ok(event.data);
}

function eventLeave(event) {

  const playerIndex = data.players.findIndex((player) => player.id === event.data.playerId);
  if (playerIndex === -1)
    return null;

  data.players.splice(playerIndex, 1);

  return ok(event.data);
}

function eventStopInactivity(event) {

  const player = data.players.find((player) => player.id === event.data.playerId);
  if (!player)
    return null;

  player.time = event.data.time;

  return ok(event.data);
}

module.exports = {
  data,
  EventType,
  EventStatus,
  triggerEvent
}