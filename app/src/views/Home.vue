<template>
    <main class="flex flex-column justify-content-center align-items-center">
        <Convertor id="convertor" />
    </main>
</template>

<script lang="ts" setup>
import Convertor from '@/components/convertor/Convertor.vue'
</script>

<style scoped>
#convertor {
    max-width: 450px;
}
</style>
