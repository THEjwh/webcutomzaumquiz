<script>
import { inject, onMounted, ref } from 'vue'
export default{
    
    setup(props) {
        const col = inject('$coly');
        const client = inject('client');
        const Room = inject("room")
        const users = ref(new Map())
        
        for (let i = 1; i <= 20; i++){
            users.value.set(i,  '유저' + i)
        }
        return {
            users
        }
    }
}
</script>

<template>
    <div class="container mx-auto p-5 w-4/5 h-4/5 my-4">
        <div class="grid grid-rows-6 grid-cols-10 gap-0 w-full h-full">
            <div class="bg-emerald-300 row-span-full col-span-2">
                <div class="w-full h-full flex flex-col flex-nowrap overflow-y-scroll">
                    <div v-for="item in users.entries()" class="text-xl w-full p-4"
                        v-bind:class="{'bg-zinc-100': item[0] % 2 == 1, 'bg-stone-200': item[0] % 2 == 0}">
                        {{item[1]}}
                    </div>
                </div>
            </div>
            <div class="bg-emerald-600 row-span-full col-span-7">
                <div class="w-full h-full flex flex-col">
                    <div class="w-full bg-blue-100 border-white border-2 grow text-xl ">
                        <p class="w-full break-all">
                            유저1: 줄바꿈ㅇ테스트용견본테스트 록타르오가르와 신비한 css 줄바꿈ㅇ테스트용견본테스트줄바꿈ㅇ테스트용견본테스트줄바꿈ㅇ테스트용견본테스트줄바꿈ㅇ테스트용견본테스트
                        </p>
                        <p class="w-full break-all bg-cyan-50">
                            유저2: ㅁㄴㅇㅁㄴㅇㄴㅁㅇㅁㄴㅇㄴㅁㅇㅁㄴㅇ?
                        </p>
                    </div>
                    <textarea id="message" rows="1"
                        class="self-end block p-2.5 w-full text-sm text-gray-900 resize-none bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="대충입력창"></textarea>
                </div>
            </div>
            <div class="bg-slate-200 row-span-3 col-span-1">
                <div class="h-full flex flex-col">
                    <button type="button" class="text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-500 font-medium text-xl
        focus:outline-none m-2 my-10 rounded-full basis-1/2 border-black border-4">start</button>
                    <button type="button" class="text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:ring-red-500 font-medium text-xl
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