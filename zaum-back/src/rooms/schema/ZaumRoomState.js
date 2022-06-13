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
    Iscooltime: 'boolean',
})

class Zaums extends Schema {
  constructor(w){
    super();
    this.Original = w.original
    this.Zaum = w.zaum
    this.Desc = w.desc
  }
}
schema.defineTypes(Zaums, {
  Original: 'string',
  Zaum: 'string',
  Desc: 'string',
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
    this.Rules = new ArraySchema()
    this.Answers = new ArraySchema()
  }

  setter(v){
    this.MaxRound = v.MaxRound
    this.MaxTime = v.MaxTime
    this.useHint = v.useHint
    this.useInvade = v.useInvade
    this.useCooltime = v.useCooltime
    this.coolTime = v.coolTime
    this.nowRule = v.nowRule
    this.Isdesc = v.useDesc
    this.Answers = new ArraySchema()

    for(let i = 0; i < v.words.length; i++){
      this.Answers.push(new Zaums(v.words[i]))
      console.log(this.Answers[i].Zaum)
      
    }
    console.log(this.Answers.length)
    //v.words.forEach(ele => {
    //  this.Answers.push(new Zaums(ele.origianl, ele.zaum, ele.desc))
   // });
  }

}
schema.defineTypes(GameOptions, {
  Rules: [GameRules],
  nowRule: 'number',

  MaxRound: 'number',
  MaxTime: 'number',
  NowRound: 'number',
  NowTime: 'number',

  useHint: 'boolean',
  useInvade : 'boolean',
  useCooltime : 'boolean',
  coolTime : 'number',

  Answers: [Zaums],
  Answers_index: 'number', 
  Isdesc : 'boolean',
})

class ZaumState extends Schema {
  constructor(){
    super();
    this.players = new MapSchema();
    this.NeedAdmin = false;
    this.IsPlaying = false;
    this.IsRound = false;
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
    Option: GameOptions
});

exports.ZaumState = ZaumState;
exports.Player = Player;
exports.Zaums = Zaums;