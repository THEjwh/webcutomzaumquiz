<script>
import {provide, inject, onMounted, ref } from 'vue'
import Nav from './components/nav.vue'
import Footer from './components/footer.vue';
export default {
    setup() {
        const client = ref();
        const room = ref();
        provide("client", client);
        provide("room", room);
    },
    components: { Nav, Footer }
}
</script>

<template>
  <div class="asdf bg-slate-50">
    <Nav></Nav>
    <router-view></router-view>
  </div>
</template>

<style>
</style>
