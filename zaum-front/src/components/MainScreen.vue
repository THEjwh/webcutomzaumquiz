<script>
import { Room } from 'colyseus.js';
import { inject, onMounted, ref } from 'vue'
export default {
	created() {
		
	},
	setup(props) {
    const col = inject('$coly');
    const client = inject('client');
    const Room = inject("room")
    client.value =  new col.Client("ws://localhost:2567")
    //let cl = new col.client("ws://localhost:2567")
    const abc = ref("")
    const nickname = ref('')
    const toroomid = ref('')
    const serverlog = ref('')
    const players = ref(0)
    const roomid = ref('')



    const goConnect = () => {
      console.log('trying...')
      client.value.joinOrCreate("zaum", {Nickname : nickname}).then(room => {
        abc.value = "방에 접속됨!"
        room.onMessage('alarm', (message) => {
          serverlog.value += message + '\n'
        })

        room.onMessage('client_number', (message) => {
          players.value = message
        })
        roomid.value = room.id
        Room.value = room
        console.log(roomid.value)
        console.log(Room.value)
      }).catch(e => {
        abc.value = "접속실패!"
      });
    }
    const thisConnect = () => {
      client.value.joinById(toroomid.value, {Nickname : nickname}).then(room => {
        abc.value = "방에 접속됨!"
        room.onMessage('alarm', (message) => {
          serverlog.value += message + '\n'
        })

        room.onMessage('client_number', (message) => {
          players.value = message
        })
        roomid.value = room.id
        Room.value = room
        console.log(roomid.value)
        console.log(Room.value)
      }).catch(e => {
        abc.value = "접속실패!"
      });
    }
    return {
      abc,
      nickname,
      serverlog,
      players,
      goConnect,
      thisConnect,
      roomid,
      toroomid
    }
    },
  methods() {

  }
}
</script>

<template>

  <div class="container mx-auto border-2 m-4 bg-slate-300 rounded-lg my-10">
      <p class="align-middle text-center font-sans font-semibold antialiased text-6xl text-black m-20">
        대충 사이트
      </p>
      <div class=" mx-auto grid grid-cols-2 gap-10 m-20">
        <div class="mx-auto text-2xl bg-slate-100 p-2 px-5 rounded-lg">
          닉네임
        </div>
        <div class="mx-auto text-2xl bg-slate-100 p-2 px-5 rounded-lg">
          방 코드 입력
        </div>
        <input v-model="nickname" type="text" class="m-4 mx-auto rounded-lg bg-gray-50 text-lg p-4" placeholder="swag">
        <input v-model="toroomid" type="text" class="m-4 mx-auto rounded-lg bg-gray-50 text-sm p-4">
        <button @click="goConnect" class="bg-cyan-100 mx-auto p-3 rounded-lg text-xl font-extrabold">새방파기</button>
        <button @click="thisConnect" class="bg-cyan-100 mx-auto p-3 rounded-lg text-xl font-extrabold">방드가기</button>
        <p v-html="serverlog" class="container align-middle text-center font-sans font-bold antialiased text-xl text-red-500 mx-auto">
      </p>
      <p class="container align-middle text-center font-sans font-bold antialiased text-2xl text-red-600 mx-auto">
        서버인원수:{{players}}<br>
        현재방ID:{{roomid}}
      </p>
      </div>
    </div>
</template>

<style scoped>
</style>