<script>
</script>

<template>
    <div class="container mx-auto bg-cyan-100 grid grid-rows-6 grid-flow-col gap-0 h-max m-10">
        <div class="bg-emerald-300 row-span-6 col-span-2">
           접속중 유저목록창
        </div>
        <div class="row-span-6 col-span-12 bg-orange-300">
            <div class="h-full flex flex-col">
                <div class="bg-cyan-300 grow">
                    (대충채팅창)
                </div>
                <textarea id="message" rows="1"
                    class="self-end block p-2.5 w-full text-sm text-gray-900 resize-none bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="대충입력창"></textarea>
            </div>
        </div>
        <div class="row-span-3 col-span-1 bg-amber-400">
            대충버튼창
            <p>
                <button type="button" class="text-black bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-medium text-xl
        focus:outline-none">start</button>
            </p>
            <p>
                <button type="button" class="text-black bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-medium text-xl
        focus:outline-none">exit</button>
            </p>
        </div>
        <div class="row-span-3 col-span-1 bg-blue-800">
            <p>
                option
            </p>
            <p>
                see chat
            </p>
        </div>
    </div>

</template>

<style scoped>
.container {
    min-height: 700px;
}

</style>