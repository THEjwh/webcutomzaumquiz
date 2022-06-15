<script>
import { inject, nextTick, onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
export default {

    setup() {
        const col = inject('$coly');
        const client = inject('client');
        const Room = inject("room")
        const router = useRouter()

        
        const words = ref('')
        const hint = ref(new Array())
        const h_desc = ref('')
        const h_desc_use = ref(false)

        const time = ref(0)
        const maxtime = ref(999)
        const round = ref(0)
        const round_m = ref(20)

        const game_end = ref(false)

        const users = ref(undefined)
        const users_r = ref(undefined)

        onBeforeMount(() => {
            if (Room.value != undefined) {
                Room.value.removeAllListeners()
                Room.value.onMessage('players', (message) => {
                    users.value = message
                    users_r.value = Object.entries(users.value).sort((a, b) => {
                        if (a[1].score < b[1].score) {
                            return 1;
                        }

                        if (a[1].score > b[1].score) {
                            return -1;
                        }

                        return 0
                    })
                    
                })
                Room.value.onMessage('game_option', (msg) => {
                    round_m.value = msg.maxround
                    maxtime.value = msg.maxtime
                    h_desc_use.value = msg.desc
                })
                Room.value.onMessage('round_start', (msg) => {
                    time.value = maxtime.value
                    round.value += 1
                    words.value = msg.quest
                })
                Room.value.onMessage('clock_tick', (msg) => {
                    time.value -= 1
                })
                Room.value.send("join_game")


            }
        })


        const getPlayer = () => {
            if(users.value == undefined) return new Array()
            return Object.entries(users.value)
        }

        const getRank = (ck) => {
            const a = users_r.value.findIndex((ele, i, arr) => {
                if(ele[0] == ck){
                    return true
                }
            })

            if(a == -1) return 0
            return a + 1
        }

        const checker = (ck) => {
            if(Room.value != undefined && Room.value.sessionId == ck) return true;
            return false
        }

        const exit = () => {
            if(Room.value != undefined){
                Room.value.leave()
                Room.value = undefined
            }
            router.replace({ name: 'home' })
        }
        return {
            time,
            words,
            hint,
            h_desc,
            h_desc_use,
            round,
            round_m,
            

            getPlayer,
            getRank,
            checker,
            exit
        }
    }
}
</script>

<template>
    <div class="container mx-auto w-10/12 h-5/6 my-4">
        <div class="w-full h-full grid grid-rows-6 grid-cols-10 gap-0">
            <div class="bg-gray-100 row-span-full col-span-2 overflow-y-scroll">
                <div class="w-full h-full flex flex-col">
                    <div v-for="(item, index) in getPlayer()" class="w-full grid gap-0 grid-rows-2 grid-cols-4" 
                    v-bind:class="{'bg-zinc-100': index % 2 == 1, 'bg-stone-200': index % 2 == 0, 'font-bold': checker(item[0])}">
                        <div class="row-span-2 col-span-1 mx-auto my-auto">
                            <div class="text-2xl font-bold text-black p-1 text-center rounded-2xl">
                                {{'#'+ getRank(item[0])}}
                            </div>
                        </div>
                        <div class="row-span-1 col-span-3 my-auto text-lg" v-bind:class="{'italic' : item[1].Iscorrect}">{{item[1].nickname}}</div>
                        <div class="row-span-1 col-span-3 my-auto">{{'점수: ' + item[1].score}}</div>
                        <!-- <div class="row-span-2 col-span-1">아이콘칸</div> -->
                    </div>
                </div>
            </div>

            <div class="row-span-full col-span-6">
                <div class="w-full h-1/6">
                    <div class="w-full h-2/5 overflow-auto bg-white">
                        <div class=" text-center text-4xl font-bold h-full">
                            {{words}}
                        </div>
                    </div>
                    <div class="w-full h-3/5 bg-gray-200 flex text-xl font-semibold overflow-x-auto">
                        <div v-for="item in hint" class="bg-gray-400 my-auto text-white p-2 m-2 align-middle text-center rounded-md">
                            {{item}}
                        </div>
                    </div>

                </div>
                <div class="w-full h-5/6 flex flex-col">
                    <div ref="chatsquare"
                        class="w-full basis-11/12 text-black bg-gray-100 grow text-xl scroll-smooth overflow-y-scroll">
                    </div>
                    <input type="text" id="message"
                        class="self-end block basis-1/12 p-2.5 w-full text-2xl text-gray-900 resize-none bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="할말 (최대 500자)" maxlength="500" />
                </div>
            </div>
            <div class="row-span-1 col-span-2 flex flex-col items-center overflow-y-auto ">
                <div class="text-lg font-semibold">
                    {{'라운드: ' + round + '/' + round_m}}
                </div>
                <div class="text-lg font-semibold">
                    남은 시간
                </div>
                <div class="bg-slate-50 border-4 border-black w-full text-center rounded-full">
                    <span class="inline-block h-full align-bottom text-3xl">{{ time }}</span>
                </div>
            </div>
            <div v-show="h_desc_use" class="row-span-4 col-span-2 bg-gradient-to-b from-gray-900 to-gray-700 overflow-y-auto">
                <div
                    class="bg-gradient-to-b from-gray-200 to-gray-300 min-h-[90%] p-4 text-lg m-4 rounded-lg break-all font-semibold text-justify">
                    {{h_desc}}
                </div>
            </div>
            <div class="row-span-1 col-span-2 relative">
                <div
                    class="bg-white border-4 border-black rounded-2xl text-center font-bold text-2xl w-1/2 absolute bottom-0 right-0">
                    <button @click="exit" class="w-full h-full">EXIT</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
