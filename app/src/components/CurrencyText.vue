<template>
    <div
        class="flex align-items-center justify-content-center"
        style="height: 25px"
    >
        <img
            v-if="type === CurrencyType.crypto && icon"
            class="mr-2"
            :src="icon"
            :alt="icon"
            style="height: 20px; width: 20px"
        />
        <span v-if="type === CurrencyType.fiat && icon" class="mr-2 text-1xl">{{
            icon
        }}</span>

        <span class="text-lg">{{ symbol || 'loading...' }}</span>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { CurrencyType } from 'shared/types'

defineProps<{
    type: CurrencyType
    icon?: string
    symbol?: string
}>()
</script>
