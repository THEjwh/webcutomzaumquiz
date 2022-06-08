const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
}

schema.defineTypes(Player, {
    nickname: "string",
    score: 'number',
    Isadmin: 'boolean'
})


class ZaumState extends Schema {
  constructor(){
    super();
    this.players = new MapSchema();
    this.NeedAdmin = false;
  }
}

schema.defineTypes(ZaumState, {
    players: {map: Player},
    NeedAdmin: 'boolean'
});

exports.ZaumState = ZaumState;
exports.Player = Player;