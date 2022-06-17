<script>
import {provide, inject, onMounted, ref } from 'vue'
import Nav from './components/nav.vue'
import Footer from './components/footer.vue';
export default {
    setup() {
        const client = ref();
        const room = ref(undefined);
        const url = ref("localhost:2567")
        provide("client", client);
        provide("room", room);
        provide('url', url)
    },
    components: { Nav, Footer }
}
</script>

<template>
  <div class="w-scrren h-screen bg-slate-50">
    <Nav></Nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>
