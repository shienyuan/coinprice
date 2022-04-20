<template>
    <main class="flex justify-content-center align-items-center">
        <Card id="convertor" class="w-full">
            <template #content>
                <div class="py-2">
                    <small class="block text-gray-300 m-0 mb-2">From</small>
                    <div class="p-inputgroup p-inputtext-lg">
                        <InputNumber
                            v-model="from.value"
                            mode="decimal"
                            :maxFractionDigits="6"
                            placeholder="0"
                        />

                        <Dropdown
                            v-model="from.id"
                            :options="cryptos"
                            :filter="true"
                            :showClear="true"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="BTC"
                        />
                    </div>
                </div>

                <div class="text-center my-4">
                    <i
                        class="pi pi-arrows-v border-1 border-circle p-2 text-xl"
                    ></i>
                </div>

                <div class="py-2">
                    <small class="block text-gray-300 m-0 mb-2">To</small>
                    <div class="p-inputgroup p-inputtext-lg">
                        <InputNumber
                            v-model="to.value"
                            mode="decimal"
                            :maxFractionDigits="6"
                            placeholder="0"
                            class="border-0"
                        />

                        <Dropdown
                            v-model="to.id"
                            :options="cryptos"
                            :filter="true"
                            :showClear="true"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="USD"
                        />
                    </div>
                </div>

                <Button class="w-full mt-5" label="Convert" />
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Crypto, listCrypto } from '@/api/convert'

import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const from = reactive({
    id: null,
    value: null,
})

const to = reactive({
    id: null,
    value: null,
})

const cryptos = ref<Crypto[]>()
const getCryptos = async () => {
    cryptos.value = await listCrypto()
}

onMounted(async () => {
    await getCryptos()
})
</script>

<style lang="scss" scoped>
#convertor {
    max-width: 420px;
}
::v-deep(.p-card .p-card-content) {
    padding: 0;
}
</style>
