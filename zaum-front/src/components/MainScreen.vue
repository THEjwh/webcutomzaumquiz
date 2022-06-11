<script>
import { Room } from 'colyseus.js';
import { inject, onBeforeMount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
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
    const router = useRouter()
    const rt = useRoute()
    const kicked = ref('false')

    onBeforeMount(() => {
      console.log("mainscrrenvue BEFOREMOUNT")
      if(Room.value != undefined){
        Room.value.leave()
        Room.value = undefined
      }
      if(rt.query.by != undefined){
        if(rt.query.by == 'kick'){
          kicked.value = true
        }
      }
      console.log(kicked.value)
    })
 

    const goConnect = () => {
      console.log('trying...')
      client.value.joinOrCreate("zaum", {Nickname : nickname}).then(room => {
        abc.value = "방에 접속됨!"
        /* room.onMessage('alarm', (message) => {
          serverlog.value += message + '\n'
        })

        room.onMessage('client_number', (message) => {
          players.value = message
        }) */
        Room.value = room
        console.log(Room.value)
        router.push('/lobby')
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

    const test = () => {
      router.push({name: 'lobby'})
    }
    return {
      abc,
      nickname,
      serverlog,
      players,
      kicked,
      roomid,
      toroomid,
      goConnect,
      thisConnect,
      test
    }
    },
  methods() {

  }
}
</script>

<template>

  <div class="container mx-auto w-3/5 border-2 m-4 bg-slate-300 rounded-lg my-10">
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
    </div>
    <div v-if="kicked == true" class="p-4 mb-4 w-3/5 mx-auto text-md text-red-700 bg-red-100 rounded-lg text-center" role="alert">
      <span class="font-bold">방에서 강퇴당하셨습니다!</span> 
    </div>
    <button @click="test" class="bg-cyan-500 mx-auto p-3 rounded-lg text-xl font-extrabold">test</button>
  </div>
</template>

<style scoped>
</style>