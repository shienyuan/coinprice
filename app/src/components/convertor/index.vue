<template>
    <div class="flex flex-column justify-content-center align-items-center">
        <Card id="convertor" class="w-full">
            <template #content>
                <ConvertorInput
                    v-model:amount="from.amount"
                    v-model:currency="from.currency"
                    :currency-options="cryptos"
                >
                    Crypto
                </ConvertorInput>

                <div
                    class="flex align-items-center justify-content-center my-1"
                    style="height: 60px"
                >
                    <ProgressSpinner
                        v-if="loading"
                        strokeWidth="5"
                        style="width: 50px; height: 50px"
                    />
                    <i
                        v-else
                        class="pi pi-arrow-down text-gray-300"
                        style="font-size: 25px"
                    />
                </div>

                <ConvertorInput
                    v-model:amount="to.amount"
                    v-model:currency="to.currency"
                    :currency-options="fiats"
                    disable
                >
                    To
                </ConvertorInput>

                <Button
                    class="w-full mt-5"
                    label="Convert"
                    @click="handleConvert"
                />

                <p class="text-center text-gray-500 text-sm mt-3 mb-0">
                    data provided by
                    <a href="https://coinmarketcap.com/">CoinMarketCap</a>
                </p>
            </template>
        </Card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

import { convertCurrency, listCryptos, listFiats } from '@/api/convert'
import { IConvertorCurrency, IConvertorInput } from 'shared/convertor.model'

import ConvertorInput from '@/components/convertor/Input.vue'
import ProgressSpinner from 'primevue/progressspinner'

const loading = ref(false)

const from = reactive<IConvertorInput>({
    amount: 0,
    currency: {} as IConvertorCurrency,
})
const to = reactive<IConvertorInput>({
    amount: 0,
    currency: {} as IConvertorCurrency,
})

const cryptos = ref<IConvertorCurrency[]>([])
const fiats = ref<IConvertorCurrency[]>([])

const loadCryptoOptions = async () => {
    cryptos.value = await listCryptos()
    from.currency = cryptos.value[0]
}

const loadFiatOptions = async () => {
    fiats.value = await listFiats()
    to.currency = fiats.value[0]
}

const handleConvert = async () => {
    const resp = await convertCurrency({ from, to })
    console.log(resp)
}

onMounted(async () => {
    await Promise.all([loadCryptoOptions(), loadFiatOptions()])
})
</script>

<style scoped>
#convertor {
    max-width: 420px;
}

#result {
    max-width: 400px;
    background-color: rgba(7, 20, 38, 0.5);
}

::v-deep(.p-card .p-card-content) {
    padding: 0;
}
</style>
