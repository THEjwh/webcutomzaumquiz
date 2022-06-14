<script>
import { inject, nextTick, onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
export default {

    setup() {
        const col = inject('$coly');
        const client = inject('client');
        const Room = inject("room")
        const router = useRouter()

        const time = ref(0)

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
                Room.value.send("join_game")


            }
        })


        const exit = () => {
            router.replace({ name: 'home' })
        }
        return {
            time,

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
                    <div class="bg-slate-200">
                        <div class="w-full grid gap-0 grid-rows-2 grid-cols-4">
                            <div class="row-span-2 col-span-1 mx-auto my-auto">
                                <div class="text-2xl font-bold text-black p-1 text-center rounded-2xl">
                                    #1
                                </div>
                            </div>
                            <div class="row-span-1 col-span-2 my-auto text-lg">김치맨</div>
                            <div class="row-span-1 col-span-2 my-auto">점수:1000</div>
                            <div class="row-span-2 col-span-1"></div>
                        </div>
                    </div>

                    <div class="bg-slate-400">
                        <div class="w-full grid gap-0 grid-rows-2 grid-cols-4">
                            <div class="row-span-2 col-span-1 mx-auto my-auto">
                                <div class="text-2xl font-bold text-black p-1 text-center rounded-2xl">
                                    #2
                                </div>
                            </div>
                            <div class="row-span-1 col-span-2 my-auto text-lg">감자맨</div>
                            <div class="row-span-1 col-span-2 my-auto">점수:500</div>
                            <!-- <div class="row-span-2 col-span-1">아이콘칸</div> -->
                        </div>
                    </div>

                </div>
            </div>

            <div class="row-span-full col-span-6">
                <div class="w-full h-1/6">
                    <div class="w-full h-2/5 overflow-auto bg-white">
                        <div class=" text-center text-4xl font-bold h-full">
                            ㅍㅇㄹ
                        </div>
                    </div>
                    <div class="w-full h-3/5 bg-gray-200 flex text-xl font-semibold overflow-x-auto">
                        <div class="bg-gray-400 my-auto text-white p-2 m-2 align-middle text-center rounded-md">
                            1번째 글자: 파
                        </div>
                        <div class="bg-gray-400 my-auto text-white p-2 m-2 align-middle text-center rounded-md">
                            2번째 글자: 이
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
                    라운드: 1/20
                </div>
                <div class="text-lg font-semibold">
                    남은 시간
                </div>
                <div class="bg-slate-50 border-4 border-black w-full text-center rounded-full">
                    <span class="inline-block h-full align-bottom text-3xl">{{ time }}</span>
                </div>
            </div>
            <div class="row-span-4 col-span-2 bg-gradient-to-b from-gray-900 to-gray-700 overflow-y-auto">
                <div
                    class="bg-gradient-to-b from-gray-200 to-gray-300 min-h-[90%] p-4 text-lg m-4 rounded-lg break-all font-semibold text-justify">
                    태어날 때부터 꼬리의 불꽃이 타오르고 있다. 불꽃이 꺼지면 그 생명이 다하고 만다.
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
