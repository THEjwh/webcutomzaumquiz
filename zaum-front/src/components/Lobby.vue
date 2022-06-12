<script>
import { inject, nextTick, onBeforeMount ,onMounted, onUpdated, ref } from 'vue'
import { useRouter } from 'vue-router';
import useClipboard from 'vue-clipboard3'

export default{
    data(){
    },
    setup(props) {
        const {toClipboard} = useClipboard()
        const col = inject('$coly');
        const client = inject('client');
        const Room = inject("room")
        const users = ref('undefined')
        const router = useRouter()
        const chats = ref(new Array())
        const chat = ref('')
        const chatsquare = ref(null)
        const ImAdmin = ref(false)
        const Seechat = ref(true)
        const audio = new Audio('http://localhost:2567/res/sound/chat.mp3')
        const words = ref('')
        const Person = ref(1)
        const Rounds = ref(1)
        const Times = ref(30)
        const codetext = ref('방 코드 복사')
        const gameMods = ref(undefined)
        const selected_Mod = ref(0)
        
        const Isdesc = ref('false')
        const Iscooltime = ref('false')
        const cooltime = ref(1)
        const Ishint = ref('false')
        const Isinvade = ref('false')

        onBeforeMount(() => {
            console.log("lobby BEFOREMOUNT")
            if(Room.value != undefined){
                Room.value.removeAllListeners()
                Room.value.onMessage('alarm', (message) => {
                    inputMsg(message)
                })
                Room.value.onMessage('Mods', (message) => {
                    console.log(message)
                    gameMods.value = message
                    selected_Mod.value = 0
                    console.log('asdf')
                    console.log(selected_Mod.value)
                })
                Room.value.onMessage('players', (message) => {
                    users.value = message
                    if(users.value[Room.value.sessionId].Isadmin == true) {
                        ImAdmin.value = true
                    } else ImAdmin.value = false

                    if(ImAdmin.value == Seechat.value){
                        Seechat.value = true
                    }
                })
                Room.value.onMessage('chat_message', (message) => {
                    inputMsg(message)
                })

                Room.value.onMessage('you_kicked', (message) => {
                    exit('kick')
                })
                Room.value.send("join_completed")
            }
        })

        onUpdated(()=>{
            //const ddd = chatsquare.value as HTMLDivElement;
            //console.log(chatsquare.value)
            //chatsquare.value.scrollTop = chatsquare.value.scrollHeight;
        })

        const inputMsg = (msg) => {
            chats.value.push(msg)
            
            if(audio){
                audio.currentTime = 0
                audio.play()
            }
            nextTick(() => {
                if(chatsquare.value) {
                    if(chatsquare.value.scrollHeight) {
                    chatsquare.value.scrollTop = chatsquare.value.scrollHeight;
                }
                }
                
            })
        }

        const sendChat = () => {
            console.log("sended!")
            Room.value.send("send_message", {msg: chat.value})
            chat.value = ""
        }

        const ttest = () => {
            if(users.value == undefined) return new Array()
            console.log(users.value)
            return Object.entries(users.value)
        }

        const exit = (reason = 'normal') => {
            if(Room.value != undefined){
                Room.value.leave()
                Room.value = undefined
            }
            router.push({name:'home', query:{by:reason}})
        }

        const checker = (ck) => {
            if(Room.value != undefined && Room.value.sessionId == ck) return true;
            return false
        }

        const changeAdmin = (id) => {
            Room.value.send("change_Admin", {sessionId:id  })
        }

        const kickPlayer = (id) => {
            Room.value.send("kick_Player", { sessionId: id })
        }

        const copyclick = async () => {
            if(Room.value) {
                try{
                    await toClipboard(Room.value.sessionId)
                    codetext.value = "복사됨!"
                } catch (e) {

                }
            }
        }
        const copyout = () => {codetext.value = "방 코드 복사"}
        const mod_desc = (a) => {
            if(gameMods.value != undefined){
                if(gameMods.value[a].description != undefined ? true : false) return gameMods.value[a].description
                
            }
        }

        const cho_hangul = (str) => {
            const cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
            let result = "";
            for (let i = 0; i < str.length; i++) {
                let code = str.charCodeAt(i) - 44032;
                if (code > -1 && code < 11172) result += cho[Math.floor(code / 588)];
                else result += str.charAt(i);
            }
            return result;
        }
        
        const game_start = () => {
            if(Isdesc){
                const a = words.value.split(',')
                const ori = new Array()
                const za = new Array()
                const de = new Array()
                a.forEach((ele) => {
                    let t = ele.split('.')
                    ori.push(t[0])
                    de.push(t[1])
                    za.push(cho_hangul(t[0]))
                })
                const tl = {original : ori, zaum : za, desc : de}
                console.log(tl)
            }else {
                const a = cho_hangul(words.value).split(',')
                const b = words.value.split(',')
                const c = {original : b, zaum : a }
                console.log(c)
            }


            /* Room.value.send("game_start", {
                MaxRound: Rounds.value,
                MaxTime: Times.value,
                useHint: Ishint.value,
                useInvade: Isinvade.value,
                useCooltime: Iscooltime.value,
                coolTime: cooltime.value,
                ruleIndex: selected_Mod,
                useDesc : Isdesc,
                
            }) */
        }

        const getIsAdmin = () => ImAdmin.value
        const getSeechat = () => Seechat.value
        const changeSeechat = (b) => { Seechat.value = b; }
        const cnad = () => ImAdmin.value = !ImAdmin.value

        return {
            users,
            chats,
            chat,
            chatsquare,
            words,
            Person,
            Rounds,
            Times,
            codetext,
            gameMods,
            selected_Mod,
            Isdesc,
            Iscooltime,
            cooltime,
            Ishint,
            Isinvade,
            mod_desc,
            copyclick,
            copyout,
            ttest,
            sendChat,
            exit,
            checker,
            changeAdmin,
            kickPlayer,
            getIsAdmin,
            getSeechat,
            changeSeechat,
            cnad,
            game_start,
        }
    },
    methods: {

    }
}
</script>

<template>
    <div class="container mx-auto p-5 w-4/5 h-4/5 my-4">
        <div class="grid grid-rows-6 grid-cols-10 gap-0 w-full h-full">
            <div class="bg-zinc-100 row-span-full col-span-2">
                <div class="w-full h-full flex flex-col flex-nowrap overflow-y-scroll">
                    <div v-for="(item, index) in ttest()" class="text-xl w-full p-4 basis-1/12 align-middle"
                        v-bind:class="{'bg-zinc-100': index % 2 == 1, 'bg-stone-200': index % 2 == 0, 'font-bold': checker(item[0])}">
                        {{item[1].nickname}}
                        <svg v-show="item[1].Isadmin" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <button @click="kickPlayer(item[0])" v-show="getIsAdmin() && !item[1].Isadmin">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button @click="changeAdmin(item[0])" v-show="getIsAdmin() && !item[1].Isadmin">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="row-span-full col-span-7">
                <div v-show="!getSeechat()" class="w-full h-full bg-gray-200 grid grid-rows-2 grid-cols-2 gap-1 p-4">
                    <div class="bg-gray-100 rounded-lg p-4 flex flex-col overflow-auto">
                        <p class="p-2 text-2xl font-bold text-center">
                            단어장
                        </p>
                        <p class="text-md font-sans text-center pb-2 tt">
                            설명이 포함됨
                            <span class="ttext">힌트로 단어의 설명이 나옵니다.</span>
                        <input v-model="Isdesc" type="checkbox" class="">
                        </p>
                        <textarea v-model="words" rows="1"
                            class="w-full grow block bg-gray-50 rounded-lg border border-gray-300" maxlength="40000"
                            placeholder="단어1,단어2,단어3 ... OR 단어1.설명1,단어2.설명2,단어3.설명3 ... ">
                        </textarea>
                    </div>
                    <div class="bg-gray-100 rounded-lg flex flex-col overflow-auto">
                        <p class="basis-1/3 text-center p-2 text-lg">
                            라운드 수 (1-20)
                            <input v-model="Rounds"
                                class="block w-full mt-2 rounded-lg bg-gray-50 border border-gray-300 shadow-md"
                                type="number" min="1" max="20">
                        </p>
                        <p class=" basis-1/3 text-center p-2 text-lg ">
                            시간제한 (30-120)
                            <input v-model="Times"
                                class="block w-full mt-2 rounded-lg bg-gray-50 border border-gray-300 shadow-md"
                                type="number" min="30" max="120">
                        </p>
                        <p class=" basis-1/3 text-center p-2 text-lg ">
                            게임 인원수 (1-20)
                            <input v-model="Person"
                                class="block w-full mt-2 rounded-lg bg-gray-50 border border-gray-300 shadow-md"
                                type="number" min="1" max="20">
                        </p>
                    </div>

                    <div class="bg-gray-100 rounded-lg p-4 flex flex-col overflow-auto">
                        <div class="p-2 text-2xl font-bold text-center">
                            옵션
                        </div>
                        <div class="p-4">
                            힌트 켜기
                            <input v-model="Ishint" type="checkbox" class="mx-2">
                        </div>
                        <div class="p-4 ">
                            게임 진행중 참여 허용
                            <input v-model="Isinvade" type="checkbox" class="mx-2">
                        </div>
                        <div class="p-4 ">
                            채팅 쿨타임
                            <input v-model="Iscooltime" type="checkbox" class="mx-2">
                            <input type="range" v-model="cooltime" min="1" max="5">
                            <span class="">
                                {{cooltime}}
                            </span>
                        </div>
                    </div>

                    <div class="bg-gray-100 rounded-lg p-4 flex flex-col overflow-auto">
                        <div class="p-2 text-2xl font-bold text-center">
                            게임 모드
                        </div>
                        <select v-model="selected_Mod" class="bg-gray-50 border border-gray-300 shadow-md rounded-md">
                            <option v-for="(item, index) in gameMods" :value="index">
                                {{item.name}}
                            </option>
                        </select>
                        <div class="bg-gray-300 mt-2 p-4 rounded-md grow text-xl font-semibold">
                            {{mod_desc(selected_Mod)}}
                        </div>
                    </div>
                </div>
                <div v-show="getSeechat()" class="w-full h-full flex flex-col">
                    <div ref='chatsquare'
                        class="w-full basis-11/12 text-black bg-gray-100 grow text-xl scroll-smooth overflow-y-scroll">
                        <p v-for="(item, index) in chats" class="w-full py-2 break-all"
                            v-bind:class="{'bg-gray-50' : index % 2 == 0, 'bg-gray-100' : index % 2 == 1}">
                            {{item}}
                        </p>
                    </div>
                    <input v-model="chat" @keydown.enter="sendChat" type="text" id="message"
                        class="self-end block basis-1/12 p-2.5 w-full text-2xl text-gray-900 resize-none bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="할말">
                </div>
            </div>
            <div class="row-span-1 col-span-1 overflow-auto">
                <button @mouseout="copyout"
                    class="w-full p-4 bg-gradient-to-r text-sm bg-white border-2 border-black rounded-lg text-center hover:bg-black hover:text-white"
                    @click="copyclick">
                    {{codetext}}
                </button>
            </div>
            <div class=" row-span-2 col-span-1">
                <div class="h-full flex flex-col overflow-auto">
                    <button @click="game_start()" v-show="getIsAdmin()" type="button" class="text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-500 font-medium text-xl
        focus:outline-none m-2 rounded-full basis-1/4 border-black border-4">시작</button>
                    <button @click="exit()" type="button" class="text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-500 font-medium text-xl
        focus:outline-none m-2 rounded-full basis-1/4 border-black border-4 ">나가기</button>
                </div>
            </div>
            <div class="row-span-3 col-span-1" v-show="getIsAdmin()">
                <button id="optionmark" @click="changeSeechat(false)"
                    class="border-black border-r-4 border-y-4 my-4 block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <button id="chatmark" @click="changeSeechat(true)"
                    class="border-black border-r-4 border-y-4 my-4 block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <button @click="cnad()">테스트버튼</button>
</template>

<style scoped>
textarea{
    resize: none;   
}

.tt {
  display: inline-block;
}

.ttext {
  display: none;
  position: absolute;
  max-width: 200px;
  border: 1px solid;
  border-radius: 5px;
  padding: 5px;
  font-size: 0.8em;
  color: white;
  background: rgb(75, 75, 255);
}

.tt:hover .ttext {
  display: block;
}
</style>