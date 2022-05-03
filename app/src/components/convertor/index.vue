<template>
    <div class="flex flex-column justify-content-center align-items-center">
        <BlockUI id="convertor" :blocked="initializing">
            <Card class="w-full">
                <template #content>
                    <ConvertorInput
                        v-model:amount="from.amount"
                        v-model:currency="from.currency"
                        :currency-options="cryptoOptions"
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
                        :currency-options="fiatsOptions"
                        input-mode="currency"
                        disable
                    >
                        Fiat
                    </ConvertorInput>

                    <Button
                        class="w-full mt-5"
                        label="Convert"
                        @click="handleConvert"
                    />
                </template>
            </Card>
        </BlockUI>

        <ProgressSpinner
            v-if="initializing"
            class="absolute"
            strokeWidth="3"
            style="width: 80px; height: 80px"
        />
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'

import { convertCurrency } from '@/api/convertor'
import { IConvertorCurrency, IConvertorInput } from 'shared/convertor.model'

import ConvertorInput from '@/components/convertor/Input.vue'
import ProgressSpinner from 'primevue/progressspinner'
import BlockUI from 'primevue/blockui'

const props = defineProps<{
    initializing: boolean
    cryptoOptions: IConvertorCurrency[]
    fiatsOptions: IConvertorCurrency[]
}>()

const loading = ref(false)

const from = ref<IConvertorInput>({
    amount: 0,
    currency: props.cryptoOptions[0],
})
const to = ref<IConvertorInput>({
    amount: 0,
    currency: props.fiatsOptions[0],
})
const updatedAt = ref('')

watch(
    () => props.cryptoOptions,
    (value) => {
        if (value.length > 0) from.value.currency = value[0]
    }
)

watch(
    () => props.fiatsOptions,
    (value) => {
        if (value.length > 0) to.value.currency = value[0]
    }
)

const handleConvert = async () => {
    try {
        loading.value = true
        const resp = await convertCurrency({
            from: from.value,
            to: to.value,
        })
        to.value.amount = resp.price
        updatedAt.value = resp.updatedAt
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}
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
