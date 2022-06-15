const colyseus = require('colyseus')
const { ZaumState, Player, Zaums } = require('./schema/ZaumRoomState')

exports.ZaumRoom = class extends colyseus.Room {
    // When room is initialized
    onCreate(options) {
        this.setState(new ZaumState())
        this.state.NeedAdmin = true
        this.maxClients = 10

        //this.setPrivate(true)

        this.onMessage('join_completed', (client, message) => {
            if(message){
                this.broadcast(
                    'alarm',
                    this.state.players.get(client.sessionId).nickname + '님이 접속했습니다!'
                )
            }
            this.broadcast('players', this.state.players)
        })

        this.onMessage('i_am_admin', (client, message) => {
            client.send('Options', {
                Rules: this.state.Option.Rules,
                Max: this.maxClients,
            })
        })

        this.onMessage('change_max', (client, message) => {
            this.maxClients = message
            console.log(this.maxClients)
        })

        this.onMessage('join_game', (client, message) => {
            client.send('players', this.state.players)
            client.send('game_option', {
                maxround: this.state.Option.MaxRound,
                maxtime: this.state.Option.MaxTime,
                desc: this.state.Option.Isdesc,
            })
        })

        this.onMessage('join_invade', (client, message) => {
            this.broadcast(
                'alarm',
                this.state.players.get(client.sessionId).nickname + '님이 접속했습니다!'
            )
            this.broadcast('players', this.state.players)
            client.send('game_option', {
                maxround: this.state.Option.MaxRound,
                maxtime: this.state.Option.MaxTime,
                desc: this.state.Option.Isdesc,
            })
            if (this.state.IsRound) {
            } else {
            }
        })

        this.onMessage('send_message', (client, message) => {
            if (this.state.IsPlaying && this.state.IsRound) {
                if(this.state.players.get(client.sessionId).Iscorrect){
                    this.broadcast('chat_message_c', this.state.players.get(client.sessionId).nickname + ': ' + message.msg)
                } else if(this.state.players.get(client.sessionId).Iscooltime) {
                    client.send('alarm_s', '아직 쿨타임 입니다.')
                } else {
                    if(this.state.Option.Answer.Original == message.msg){
                        this.state.players.get(client.sessionId).Iscorrect = true
                        this.state.Option.corrector += 1
                        if(this.state.Option.Rule.score_adv){
                            this.state.players.get(client.sessionId).score += 100 + (100 - Math.floor(100 * this.state.Option.corrector / this.state.players.size )) + (100 - Math.floor(100 * this.state.Option.nowTime / this.state.Option.MaxTime))
                        } else {
                            this.state.players.get(client.sessionId).score += 1
                        }
                        client.send('correct', this.state.Option.Answer.Original)
                        this.broadcast('alarm_c', this.state.players.get(client.sessionId).nickname + '님이 정답을 맞췄습니다!')
                        if(this.state.Option.Rule.FCFS){
                            this.roundend()
                        }
                    } else {
                        this.broadcast(
                            'chat_message',
                            this.state.players.get(client.sessionId).nickname + ': ' + message.msg
                        )
                        if(this.state.Option.useCooltime){
                            this.state.players.get(client.sessionId).Iscooltime = true
                            this.clock.setInterval(() => {
                                this.state.players.get(client.sessionId).Iscooltime = false
                            }, this.state.Option.coolTime * 1000)
                        }
                    }   
                }
            } else {
                this.broadcast(
                    'chat_message',
                    this.state.players.get(client.sessionId).nickname + ': ' + message.msg
                )
            }
        })

        this.onMessage('get_players', (client, message) => {
            client.send('players', this.state.players)
        })

        this.onMessage('start_game', (client, message) => {
            if (this.state.IsPlaying == false) {
                this.state.IsPlaying = true
                this.state.Option.setter(message)
                this.broadcast('start_ok')

                this.clock.clear()
                this.clock.start()
                this.broadcast('alarm', '5초후 게임이 시작됩니다!')
                this.clock.setTimeout(() => {
                    this.gamestart()
                }, 5000)
            }
        })

        this.onMessage('change_Admin', (client, message) => {
            if (this.state.players.get(message.sessionId) != undefined) {
                this.state.players.get(client.sessionId).Isadmin = false
                this.state.players.get(message.sessionId).Isadmin = true
                this.broadcast('players', this.state.players)
            }
        })

        this.onMessage('kick_Player', (client, message) => {
            if (this.state.players.get(message.sessionId) != undefined) {
                const a = this.clients.find((ele) => {
                    if (ele.sessionId == message.sessionId) {
                        ele.send('you_kicked', {})
                    }
                })
            }
        })
    }

    // Authorize client based on provided options before WebSocket handshake is complete

    // When client successfully join the room
    onJoin(client, options) {
        console.log(client.sessionId, 'joined!')

        if (this.state.players.get(client.sessionId) == undefined) {
            let a = new Player()
            if (options.Nickname != undefined && options.Nickname != '') {
                a.nickname = options.Nickname
            } else a.nickname = '무명_' + client.sessionId

            a.score = 0
            a.Isadmin = false
            a.Iscorrect = false
            a.Iscooltime = false
            if (this.state.NeedAdmin) {
                this.state.NeedAdmin = false
                a.Isadmin = true
            }
            this.state.players.set(client.sessionId, a)
        }
    }

    // When a client leaves the room
    onLeave(client, consented) {
        console.log(client.sessionId, 'leaved!')
        if (this.state.players.get(client.sessionId)) {
            let b = false
            if (this.state.players.get(client.sessionId).Isadmin == true) b = true

            this.broadcast(
                'alarm',
                this.state.players.get(client.sessionId).nickname + '님이 나갔습니다!'
            )
            this.state.players.delete(client.sessionId)
            if (b && this.state.players.size >= 1) {
                console.log('다음어드민지정')
                console.log(this.state.players.entries().next())
                console.log(this.state.players.entries().next().value)
                this.state.players.entries().next().value[1].Isadmin = true
            }
            this.broadcast('players', this.state.players)
        }
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() { }

    gamestart() {
        if (!this.state.Option.useInvade) {
            this.lock()
        }
        console.log('겜 시작됨')
        //console.log(this.state.Option)
        this.state.IsPlaying = true
        this.state.IsRound = false
        this.state.IsEnding = false
        this.state.Option.nowRound = 0
        this.state.players.forEach((v, k) => {
            v.score = 0
        })
        this.broadcast('game_started')
        this.clock.setTimeout(() => {
            this.roundready()
        }, 2000)
    }

    roundready() {
        //console.log(this.state)
        if (this.state.Option.nowRound >= this.state.Option.MaxRound) {
            this.gameend()
            return
        }
        console.log('다음 라운드 준비중')
        this.broadcast('alarm', '곧 다음 라운드가 시작됩니다!')

        this.state.Option.Answers_index = Math.floor(
            Math.random() * this.state.Option.Answers.length
        )

        this.state.Option.Answer = this.state.Option.Answers[this.state.Option.Answers_index]

        if (this.state.Option.useHint) {
            console.log('힌트 켜짐')
            this.state.Option.Hintarray_opend = 0
            const l = this.state.Option.Answer.Zaum.length
            const ll = Math.floor(l / 2)
            this.state.Option.Hintarray_l = ll
            console.log(ll)
            for (let i = 0; i < ll;) {
                let n = Math.floor(Math.random() * l)
                if (this.state.Option.Hintarray.indexOf(n) == -1) {
                    this.state.Option.Hintarray.push(n)
                    console.log(n)
                    i++
                }
            }
        }

        this.state.Option.nowTime = this.state.Option.MaxTime
        this.clock.setTimeout(() => {
            this.roundstart()
        }, 3000)
    }

    roundstart() {
        console.log('라운드 시작됨')
        
        this.state.Option.nowRound += 1
        this.state.IsRound = true
        this.broadcast('round_start', {
            quest: this.state.Option.Answer.Zaum,
        })
        this.clock.setInterval(() => {
            this.gamecount(this)
        }, 1000)
        console.log('시간: ' + this.state.Option.MaxTime)
        console.log(
            '현재문제: ' +
            this.state.Option.Answer.Zaum
        )
    }

    gamecount(t) {
        if (t.state.IsRound) {
            console.log(t.state.Option.nowTime)
            t.broadcast('clock_tick')
            t.state.Option.nowTime -= 1
            if (t.state.Option.nowTime <= 0) {
                t.roundend()
                return
            }

            if(this.state.Option.useHint){
                if (t.state.Option.nowTime == Math.floor(t.state.Option.MaxTime * 0.7)) {
                    t.sendhint()
                } else if (
                    t.state.Option.nowTime == Math.floor(t.state.Option.MaxTime * 0.4)
                ) {
                    t.sendhint()
                } else if (
                    t.state.Option.nowTime == Math.floor(t.state.Option.MaxTime * 0.1)
                ) {
                    t.sendhint(true)
                }
            }
        }
    }

    sendhint(m = false) {
        if(this.state.Option.Hintarray_l == this.state.Option.Hintarray_opend) return

        console.log('sendhint 진입됨')

        if (m) {
            for (let i =  this.state.Option.Hintarray_opend; i < this.state.Option.Hintarray_l; i++){
                this.broadcast('hint', {index : this.state.Option.Hintarray[this.state.Option.Hintarray_opend] + 1, word : this.state.Option.Answer.Original[this.state.Option.Hintarray[this.state.Option.Hintarray_opend]]})
                this.state.Option.Hintarray_opend += 1   
            }
            return
        }


        let l = Math.floor(this.state.Option.Hintarray_l / 3)
        //console.log(this.state.Option.Hintarray_l)
        if(l==0) l = 1

        for(let i = 0; i < l; i++){
            this.broadcast('hint', {index : this.state.Option.Hintarray[this.state.Option.Hintarray_opend] + 1, word : this.state.Option.Answer.Original[this.state.Option.Hintarray[this.state.Option.Hintarray_opend]]})
            this.state.Option.Hintarray_opend += 1
            if(this.state.Option.Hintarray_l == this.state.Option.Hintarray_opend) break
        }
    }

    roundend() {
        console.log('라운드 종료됨')
        this.state.IsRound = false
        this.clock.clear()
        this.state.players.forEach((v, k) => {
            v.Iscorrect = false
            v.Iscooltime = false
        })
        this.state.Option.corrector = 0
        this.broadcast('round_ended', {
            answer:
            this.state.Option.Answer.Original,
        })
        this.clock.setTimeout(() => {
            this.roundready()
        }, 3000)
    }

    gameend() {
        this.clock.clear()
        console.log('게임 종료됨')
        this.state.IsPlaying = false
        this.state.IsEnding = true
        this.broadcast('game_ended')
        this.clock.setInterval(() => {
            this.broadcast('goto_lobby')
            this.clock.clear()
            this.clock.stop()
            if (!this.state.Option.useInvade) {
                this.unlock()
            }
            console.log('다시로비로')
        }, 5000)
    }
}
