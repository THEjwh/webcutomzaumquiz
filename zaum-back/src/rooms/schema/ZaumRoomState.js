const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class Player extends Schema {

}
schema.defineTypes(Player, {
    nickname: "string",
    score: 'number',
    Isadmin: 'boolean',
    Iscorrect: 'boolean',
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
  useHint: 'boolean',
  useInvade : 'boolean',
  useCooltime : 'boolean',
  coolTime : 'number',
  Rules: [GameRules],
  nowRule: 'number',
})

class ZaumState extends Schema {
  constructor(){
    super();
    this.players = new MapSchema();
    this.NeedAdmin = false;
    this.IsPlaying = false;
    this.IsRound = false;
    this.Answers = new ArraySchema()
    this.Answers_index = 0
    this.NowRound = 0
    this.NowTime = 0
    this.Option = new GameOptions()

    //룰을 Mysql같은거 써서 좀 이쁘게 등록하고싶은데...
    this.Option.Rules.push(new GameRules(false,false, '갯수경쟁', '맞춘 사람은 1점을 얻습니다.'))
    this.Option.Rules.push(new GameRules(true,false, '승자독식', '1등만 점수를 1점 얻고 바로 라운드가 끝납니다.'))
    this.Option.Rules.push(new GameRules(false,true, '스피드런', '맞춘 등수와 남은 시간에 따라 보정된 점수를 얻습니다.'))
    
  }
}

schema.defineTypes(ZaumState, {
    players: {map: Player},
    NeedAdmin: 'boolean',
    IsPlaying: 'boolean',
    IsRound:'boolean',
    Answers: [Zaums],
    Answers_index: 'number', 
    Isdesc : 'boolean',
    NowRound: 'number',
    NowTime: 'number',
    Option: GameOptions
});

exports.ZaumState = ZaumState;
exports.Player = Player;