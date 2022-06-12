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

class GameRules extends Schema {

  constructor(fcfs = false, advscore = false, name = '', desc = '' ){
    super();
    this.FCFS = fcfs
    this.score_Advenced = advscore
    this.name = name
    this.description = desc
  }
}
schema.defineTypes(GameRules, {
  FCFS: 'boolean',
  score_Advenced: 'boolean',
  name : 'string',
  description: 'string',
})

class GameOptions extends Schema { 
  constructor(){
    super();
    this.MaxRound = 1
    this.MaxTime = 30
    this.Rules = new ArraySchema()
  }
}
schema.defineTypes(GameOptions, {
  MaxRound: 'number',
  MaxTime: 'number',
  Rules: [GameRules],
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
    this.Option = new GameOptions()

    //룰을 Mysql같은거 써서 좀 이쁘게 등록하고싶은데 좀 귀찮다
    this.Option.Rules.push(new GameRules(true,false, '선착순', '선착으로 들어온 1명만 점수를 얻습니다. 맞추고 바로 라운드가 끝납니다.'))
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
    Option: GameOptions
});

exports.ZaumState = ZaumState;
exports.Player = Player;