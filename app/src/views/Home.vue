<template>
    <main class="grid">
        <div id="convertor" class="col-fixed lg:mr-5">
            <Convertor id="convertor" />
        </div>

        <div class="lg:col">
            <Recommend />
        </div>
    </main>
</template>

<script lang="ts" setup>
import Convertor from '@/components/convertor/Convertor.vue'
import Recommend from '@/components/recommend/Recommend.vue'
</script>

<style scoped>
#convertor {
    width: 450px;
}
</style>
