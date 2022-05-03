<template>
    <main class="mt-8">
        <Convertor
            :crypto-options="cryptosOptions"
            :fiats-options="fiatsOptions"
            :initializing="initializing"
        />
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { listCryptos, listFiats } from '@/api/convertor'
import { IConvertorCurrency } from 'shared/convertor.model'

import Convertor from '@/components/convertor/index.vue'

const initializing = ref(true)
const cryptosOptions = ref<IConvertorCurrency[]>([])
const fiatsOptions = ref<IConvertorCurrency[]>([])

const loadCurrencies = async () => {
    const [cryptos, fiats] = await Promise.all([listCryptos(), listFiats()])
    cryptosOptions.value = cryptos
    fiatsOptions.value = fiats
}

onMounted(async () => {
    try {
        await loadCurrencies()
    } catch (e) {
        console.error(e)
    } finally {
        initializing.value = false
    }
})
</script>
