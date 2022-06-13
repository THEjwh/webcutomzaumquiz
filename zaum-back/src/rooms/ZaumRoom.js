const colyseus = require('colyseus');
const { ZaumState, Player, Zaums } = require('./schema/ZaumRoomState');

exports.ZaumRoom =  class extends colyseus.Room {
    // When room is initialized
    onCreate (options) {
        this.setState(new ZaumState())
        this.state.NeedAdmin = true;
        //this.setPrivate(true)

        this.onMessage('join_completed', (client, message) => {
            this.broadcast("alarm", this.state.players.get(client.sessionId).nickname + "님이 접속했습니다!")
            this.broadcast("players", this.state.players)
            client.send('Mods', this.state.Option.Rules)
            if(this.state.IsPlaying){

            }else {
                
            }
        })

        this.onMessage('join_game', (client, message) => {

        })

        this.onMessage('join_invade', (client, message) => {

        })

        this.onMessage('send_message', (client, message) => {
            if(this.state.IsPlaying){
                
            } else {
                this.broadcast("chat_message", this.state.players.get(client.sessionId).nickname + ":" + message.msg)
            }
        })

        this.onMessage('get_players', (client, message) => {
            client.send("players", {players: this.state.players})
        })

        this.onMessage('start_game', (client, message) => {
            this.state.Option.setter(message)
        })

        this.onMessage('change_Admin', (client, message) => {
            if(this.state.players.get(message.sessionId) != undefined) {
                this.state.players.get(client.sessionId).Isadmin = false
                this.state.players.get(message.sessionId).Isadmin = true
                this.broadcast("players", this.state.players)
            }
        })

        this.onMessage('kick_Player', (client, message) => {
            if(this.state.players.get(message.sessionId) != undefined) {
                const a = this.clients.find( (ele) => {
                    if (ele.sessionId == message.sessionId) {
                        ele.send('you_kicked', {})
                    }
                })
            }
        })
     }

    // Authorize client based on provided options before WebSocket handshake is complete

    // When client successfully join the room
    onJoin (client, options) {
        console.log(client.sessionId, "joined!");

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
    onLeave (client, consented) {
        console.log(client.sessionId, "leaved!");
        if(this.state.players.get(client.sessionId)){
            let b = false
            if(this.state.players.get(client.sessionId).Isadmin == true) b = true;

            this.broadcast("alarm", this.state.players.get(client.sessionId).nickname + "님이 나갔습니다!")
            this.state.players.delete(client.sessionId)
            if(b && this.state.players.size >= 1){
                console.log("다음어드민지정")
                console.log(this.state.players.entries().next())
                console.log(this.state.players.entries().next().value)
                this.state.players.entries().next().value[1].Isadmin = true;
            }
            this.broadcast("players", this.state.players)
        }
     }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}