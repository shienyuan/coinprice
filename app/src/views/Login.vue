<template>
    <div>
        <Input
            :currencies="[]"
            :currency-type="from.type"
            v-model:amount="from.amount"
            v-model:currency="from.currency"
            >From</Input
        >
        {{ from }}
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/convertor/Input.vue'
import { ConvertInput, CurrencyType } from 'shared/types'
const from = ref<ConvertInput>({
    amount: 0,
    type: CurrencyType.crypto,
    currency: [],
})
</script>

<style scoped></style>
