<template>
    <div
        class="flex align-items-center justify-content-center my-2"
        style="height: 60px"
    >
        <ProgressSpinner
            v-if="props.loading"
            strokeWidth="5"
            style="width: 50px; height: 50px"
        />
        <Button
            v-else
            class="p-button-rounded p-button-secondary p-button-text p-button-lg"
            icon="pi pi-arrows-v"
            @click="$emit('swap')"
        />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import ProgressSpinner from 'primevue/progressspinner/ProgressSpinner.vue'

const props = defineProps<{
    loading: boolean
}>()
</script>

<style scoped></style>
