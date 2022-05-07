<template>
    <div class="surface-card p-4 border-round">
        <Input
            :currencies="getCurrencies(from.type)"
            :currency-type="from.type"
            v-model:amount="from.amount"
            v-model:currency="from.currency"
            >From</Input
        >

        <Switcher :loading="loading" @swap="handleSwap" />

        <Input
            class="mb-5"
            :currencies="getCurrencies(to.type)"
            :currency-type="to.type"
            v-model:amount="to.amount"
            v-model:currency="to.currency"
            disable
            >To</Input
        >

        <Button class="w-full" label="Convert" @click="handleConvert" />
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import { Crypto, CurrencyType, Fiat, ConvertInput } from 'shared/types'
import { convert } from '@/api/convertor'

// components
import Input from './Input.vue'
import Switcher from './Switcher.vue'

const props = defineProps<{
    initializing: boolean
    cryptos: Crypto[]
    fiats: Fiat[]
}>()

const loading = ref(false)

let from = ref<ConvertInput>({
    amount: null,
    type: CurrencyType.crypto,
    currency: props.cryptos[0],
})

let to = ref<ConvertInput>({
    amount: null,
    type: CurrencyType.fiat,
    currency: props.fiats[0],
})

const getCurrencies = (type: CurrencyType) =>
    type === CurrencyType.fiat ? props.fiats : props.cryptos

const handleConvert = async () => {
    try {
        loading.value = true
        const resp = await convert({
            from: from.value,
            to: to.value,
        })
        console.log(resp)
        to.value.amount = resp.amount
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const handleSwap = () => {
    const swapping = { ...from.value }
    from.value = to.value
    to.value = swapping
}
</script>
