const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class Player extends Schema {

}
schema.defineTypes(Player, {
    nickname: "string",
    score: 'number',
    Isadmin: 'boolean'
})

class Zaums extends Schema {
}
schema.defineTypes(Zaums, {
  Original: 'string',
  Zaum: 'string'
})

class GameOptions extends Schema { 
}

schema.defineTypes(GameOptions, {
  MaxRound: 'number',
  MaxTime: 'number',
  FCFS: 'boolean',
})

class ZaumState extends Schema {
  constructor(){
    super();
    this.players = new MapSchema();
    this.NeedAdmin = false;
    this.IsPlaying = false;
    this.Answers = new ArraySchema()
    this.Answers_index = 0
    this.NowRound = 0
    this.NowTime = 0
    this.Options = new GameOptions()
  }
}

schema.defineTypes(ZaumState, {
    players: {map: Player},
    NeedAdmin: 'boolean',
    IsPlaying: 'boolean',
    Answers: [Zaums],
    Answers_index: 'number', 
    NowRound: 'number',
    NowTime: 'number',
    Options: GameOptions
});

exports.ZaumState = ZaumState;
exports.Player = Player;