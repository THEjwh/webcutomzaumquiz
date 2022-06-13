<script></script>

<template>
    <div class="container mx-auto w-10/12 h-5/6 bg-blue-500 my-4">
        <div class="w-full h-full grid grid-rows-6 grid-cols-10 gap-0">
            <div class="bg-gray-100 row-span-full col-span-2 overflow-y-scroll">
                <div class="w-full h-full flex flex-col">
                    <div class="bg-slate-200">
                        <div class="w-full h-full grid gap-0 grid-rows-2 grid-cols-4">
                            <div class="row-span-2 col-span-1 mx-auto my-auto">
                                <div class="text-2xl font-bold text-black p-1 text-center rounded-2xl">
                                    #1
                                </div>
                            </div>
                            <div class="row-span-1 col-span-2 my-auto text-lg">김치맨</div>
                            <div class="row-span-1 col-span-2 my-auto">점수:1000</div>
                            <div class="row-span-2 col-span-1">아이콘칸</div>
                        </div>
                    </div>

                    <div class="bg-slate-400">
                        <div class="w-full h-full grid gap-0 grid-rows-2 grid-cols-4">
                            <div class="row-span-2 col-span-1 mx-auto my-auto">
                                <div class="text-2xl font-bold text-black p-1 text-center rounded-2xl">
                                    #2
                                </div>
                            </div>
                            <div class="row-span-1 col-span-2 my-auto text-lg">감자맨</div>
                            <div class="row-span-1 col-span-2 my-auto">점수:500</div>
                            <div class="row-span-2 col-span-1">아이콘칸</div>
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
            <div class="row-span-1 col-span-2 bg-emerald-100">타이머 드갈곳</div>
            <div class="row-span-4 col-span-2 bg-gradient-to-b from-gray-900 to-gray-700 overflow-y-auto">
                <div class="bg-gradient-to-b from-gray-200 to-gray-300 min-h-[90%] p-4 text-lg m-4 rounded-lg break-all font-semibold text-justify">
                    태어날 때부터 꼬리의 불꽃이 타오르고 있다. 불꽃이 꺼지면 그 생명이 다하고 만다.
                </div>
            </div>
            <div class="row-span-1 col-span-2 bg-purple-500"> 나가기버튼 드갈곳</div>
        </div>
    </div>
</template>

<style scoped>
</style>
