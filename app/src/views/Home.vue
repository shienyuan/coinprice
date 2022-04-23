<template>
    <main class="flex justify-content-center align-items-center flex-column">
        <Card id="convertor" class="w-full">
            <template #content>
                <div class="py-2">
                    <small class="block text-gray-300 m-0 mb-2">Crypto</small>
                    <div class="p-inputgroup p-inputtext-lg">
                        <InputNumber
                            v-model="from.amount"
                            :maxFractionDigits="6"
                            mode="decimal"
                            placeholder="0"
                        />

                        <Dropdown
                            :virtualScrollerOptions="{ itemSize: 50 }"
                            optionLabel="name"
                            :filterFields="['name', 'symbol']"
                            v-model="from.currency"
                            :filter="true"
                            :options="cryptos"
                        >
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <span>
                                        {{ slotProps.option.name }} ({{
                                            slotProps.option.symbol
                                        }})</span
                                    >
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>

                <div class="text-center my-4">
                    <i
                        class="pi pi-arrows-v border-1 border-circle p-2 text-xl"
                    ></i>
                </div>

                <div class="py-2">
                    <small class="block text-gray-300 m-0 mb-2">Fiat</small>
                    <div class="p-inputgroup p-inputtext-lg">
                        <InputNumber
                            v-if="to.currency.symbol"
                            v-model="to.amount"
                            class="pointer-events-none surface-card"
                            mode="currency"
                            placeholder="0"
                            optionLabel="name"
                            :currency="to.currency.symbol"
                        />
                        <Dropdown
                            :virtualScrollerOptions="{ itemSize: 50 }"
                            optionLabel="name"
                            :filterFields="['name', 'symbol']"
                            v-model="to.currency"
                            :filter="true"
                            :options="fiats"
                        >
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <span>
                                        {{ slotProps.option.name }} ({{
                                            slotProps.option.symbol
                                        }})</span
                                    >
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>

                <Button
                    class="w-full mt-5"
                    label="Convert"
                    @click="handleConvert"
                />
            </template>
        </Card>

        <Card id="result" class="w-full">
            <template #content>test</template>
        </Card>
    </main>
</template>

<script lang="ts" async setup>
import { ref } from 'vue'
import { convert, Currency, listCrypto, listFiat } from '@/api/convert'

import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Cryptoicon from 'vue-cryptoicon/src/components/Cryptoicon'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import icons from 'vue-cryptoicon/src/icons'

Cryptoicon.add(icons)

const from = ref({
    currency: {},
    amount: 0,
})

const to = ref({
    currency: {},
    amount: 0.0,
})

const cryptos = ref<Currency[]>()
const getCryptos = async () => {
    cryptos.value = await listCrypto()
    from.value.currency = cryptos.value[0]
}

const fiats = ref<Currency[]>()
const getFiats = async () => {
    fiats.value = await listFiat()
    to.value.currency = fiats.value[0]
}
const handleConvert = async () => {
    to.value.amount = await convert({
        from: from.value.currency,
        to: to.value.currency,
        amount: from.value.amount,
    })
}

Promise.all([getCryptos(), getFiats()])
</script>

<style lang="scss" scoped>
#convertor {
    max-width: 520px;
}
#result {
    max-width: 500px;
    background-color: rgba(7, 20, 38, 0.5);
}

::v-deep(.p-card .p-card-content) {
    padding: 0;
}
</style>
