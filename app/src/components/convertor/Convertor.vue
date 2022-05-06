<template>
    <div class="surface-card p-4 border-round">
        <p class="text-sm text-gray-500">From</p>
        <div
            class="flex justify-content-between align-items-center border-1 border-round border-gray-800"
        >
            <Input
                v-model="from.amount"
                :currency="from.currency"
                :currency-type="from.type"
                class="w-7"
            >
                Crypto
            </Input>
            <Selector
                v-model="from.currency"
                :currencies="from.type === CurrencyType.fiat ? fiats : cryptos"
                :currency-type="from.type"
                class="w-5"
            />
        </div>

        <div
            class="flex align-items-center justify-content-center my-2"
            style="height: 60px"
        >
            <ProgressSpinner
                v-if="loading"
                strokeWidth="5"
                style="width: 50px; height: 50px"
            />
            <Button
                v-else
                class="p-button-rounded p-button-secondary p-button-text p-button-lg"
                icon="pi pi-arrows-v"
                @click="handleSwap"
            />
        </div>

        <p class="text-sm text-gray-500">To</p>
        <div
            class="flex justify-content-between align-items-center border-1 border-round border-gray-800 mb-5"
        >
            <Input
                v-model="to.amount"
                :currency="to.currency"
                :currency-type="to.type"
                class="w-7"
                disable
            >
                Crypto
            </Input>
            <Selector
                v-model="to.currency"
                :currencies="to.type === CurrencyType.fiat ? fiats : cryptos"
                :currency-type="to.type"
                class="w-5"
            />
        </div>

        <Button class="w-full" label="Convert" @click="handleConvert" />
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import {
    Crypto,
    Currency,
    CurrencyType,
    Fiat,
    ConvertInput,
} from 'shared/types'

// components
import ProgressSpinner from 'primevue/progressspinner/ProgressSpinner.vue'
import Input from './Input.vue'
import Selector from './Selector.vue'
import { convert } from '@/api/convertor'

const props = defineProps<{
    initializing: boolean
    cryptos: Crypto[]
    fiats: Fiat[]
}>()

const loading = ref(false)

let from = ref<ConvertInput>({
    amount: 0,
    type: CurrencyType.crypto,
    currency: props.cryptos[0],
})

let to = ref<ConvertInput>({
    amount: 0,
    type: CurrencyType.fiat,
    currency: props.fiats[0],
})

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
