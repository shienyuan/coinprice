<template>
    <div class="p-input-filled">
        <InputNumber
            class="w-full p-inputtext-lg"
            placeholder="0"
            :maxFractionDigits="isFiat ? 2 : 6"
            :minFractionDigits="isFiat ? 2 : 0"
            :model-value="props.modelValue"
            :prefix="props.currency?.sign"
            input-class="surface-card border-none"
            @input="$emit('update:modelValue', $event.value)"
        >
        </InputNumber>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { CurrencyType, Currency } from 'shared/types'

import InputNumber from 'primevue/inputnumber/InputNumber.vue'

const props = defineProps<{
    modelValue: number | null
    currency: Currency
    currencyType: CurrencyType
    disable?: boolean
}>()

const isFiat = computed(() => props.currencyType === CurrencyType.fiat)
</script>
