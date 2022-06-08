<script>
import { Room } from 'colyseus.js';
import { inject, onMounted, ref } from 'vue'
export default {
	created() {
		
	},
	setup(props) {
    const col = inject('$coly');
    let client = new col.Client("ws://localhost:2567");
    const abc = ref("")
    let ttt = undefined;
    let tttt = undefined;
    const goConnect = () => {
      client.joinOrCreate("my_room").then(room => {
        abc.value = "방에 접속됨!"
        ttt = room
        console.log(ttt)
      }).catch(e => {
        abc.value = "접속실패!"
      });
      
    }
    const disConnect = () => {
      if(ttt == undefined){
        abc.value="아직 방에 접속 안됨!"
      } else {
        ttt.leave()
        ttt = undefined
        abc.value="방 나감!"
      }
    }
    return {
      abc,
      goConnect,
      disConnect
    }
    },
  methods() {

  }
}
</script>

<template>
  <div class="container my-10 mx-auto w-11/12 h-11/12 text-center p-20 bg-indigo-100">
    <p class="m-10 font-bold subpixel-antialiased text-6xl font-sans text-black">특이점이 온 접속테스트</p>
    <p class="m-6 font-bold subpixel-antialiased text-3xl font-sans text-black">{{abc}}</p>
    <div class="container mx-auto w-1/2 space-x-1 bg-cyan-50">
      <button @click="goConnect" class="border-1 border-black shadow-2xl rounded-lg text-2xl bg-cyan-500 hover:bg-cyan-700  p-3 m-10 pl-10 pr-10 text-white" >ㄱㄱ</button>
    <button @click="disConnect" class="border-1 border-black shadow-2xl rounded-lg text-2xl bg-cyan-500 hover:bg-cyan-700 p-3 m-10 pl-10 pr-10 text-white" >ㄴㄴ</button>
    </div>
  </div>
  
</template>

<style>
</style>
