<script>
import { inject, nextTick, onBeforeMount ,onMounted, onUpdated, ref } from 'vue'
import { useRouter } from 'vue-router';
export default{
    
    setup(props) {
        const col = inject('$coly');
        const client = inject('client');
        const Room = inject("room")
        const users = ref('undefined')
        const router = useRouter()
        const chats = ref(new Array())
        const chat = ref('')
        const chatsquare = ref(null)

        onBeforeMount(() => {
            console.log("lobby BEFOREMOUNT")
            if(Room.value != undefined){
                Room.value.removeAllListeners()
                Room.value.onMessage('alarm', (message) => {
                    inputMsg(message)
                })
                Room.value.onMessage('players', (message) => {
                    console.log(message)
                    console.log(typeof message)
                    users.value = message
                    console.log(Object.entries(users.value))
                })
                Room.value.onMessage('chat_message', (message) => {
                    inputMsg(message)
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
            nextTick(() => {
                chatsquare.value.scrollTop = chatsquare.value.scrollHeight;
            })
        }

        const sendChat = () => {
            console.log("sended!")
            Room.value.send("send_message", {msg: chat.value})
            chat.value = ""
        }

        const ttest = () => {
            if(users.value == undefined) return new Array()
            return Object.entries(users.value)
        }
        
        return {
            users,
            chats,
            chat,
            ttest,
            sendChat,
            chatsquare,
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
                    <div v-for="(item, index) in ttest()" class="text-xl w-full p-4"
                        v-bind:class="{'bg-zinc-100': index % 2 == 1, 'bg-stone-200': index % 2 == 0}">
                        {{item[1].nickname}}
                    </div>
                </div>
            </div>
            <div class="bg-emerald-600 row-span-full col-span-7">
                <div class="w-full h-full flex flex-col">
                    <div ref='chatsquare' class="w-full basis-11/12 bg-blue-100 border-white border-2 grow text-xl scroll-smooth overflow-y-scroll">
                        <p v-for="(item, index) in chats" class="w-full break-all" v-bind:class="{'bg-cyan-50' : index % 2 == 0, 'bg-cyan-100' : index % 2 == 1}">
                            {{item}}
                        </p>
                    </div>
                    <input v-model="chat" @keydown.enter="sendChat" type="text" id="message"
                        class="self-end block basis-1/12 p-2.5 w-full text-2xl text-gray-900 resize-none bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="대충입력창">
                </div>
            </div>
            <div class="bg-slate-200 row-span-3 col-span-1">
                <div class="h-full flex flex-col">
                    <button type="button" class="text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-500 font-medium text-xl
        focus:outline-none m-2 my-10 rounded-full basis-1/2 border-black border-4">start</button>
                    <button @click="tes" type="button" class="text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-500 font-medium text-xl
        focus:outline-none m-2 my-10 rounded-full basis-1/2 border-black border-4 ">exit</button>
                </div>
            </div>
            <div class="bg-slate-100 row-span-3 col-span-1">
                
            </div>
        </div>
    </div>

</template>

<style scoped>
.container {
}

</style>