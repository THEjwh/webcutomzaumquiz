<script>
import { inject } from 'vue'
export default{
    setup(){
        const abc = inject('text')

        return{
            abc
        }
    }
}
</script>

<template>
<div>{{abc}}</div>
</template>

<style scoped>
</style>