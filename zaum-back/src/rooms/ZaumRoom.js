const colyseus = require('colyseus');
const { ZaumState, Player } = require('./schema/ZaumRoomState');

exports.ZaumRoom =  class extends colyseus.Room {
    // When room is initialized
    onCreate (options) {
        this.setState(new ZaumState())
        this.state.NeedAdmin = true;
        this.setPrivate(true)
     }

    // Authorize client based on provided options before WebSocket handshake is complete

    // When client successfully join the room
    onJoin (client, options) {
        console.log(client.sessionId, "joined!");
        let a = new Player();
        if(options.Nickname._value != undefined && options.Nickname._value != ''){
            console.log(options)
            a.nickname = options.Nickname._value
        }
        else a.nickname = '무명_' + client.sessionId
        
        a.score = 0
        a.Isadmin = false
        if(this.state.NeedAdmin) {
            this.state.NeedAdmin = false;
            a.Isadmin = true
        }
        this.state.players.set(client.sessionId, a);
        this.broadcast("alarm", this.state.players.get(client.sessionId).nickname + "님이 접속했습니다!")
        this.broadcast("client_number", this.state.players.size)
     }

    // When a client leaves the room
    onLeave (client, consented) {
        if(this.state.players.get(client.sessionId)){
            this.state.players.delete(client.sessionId)
        }
     }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}