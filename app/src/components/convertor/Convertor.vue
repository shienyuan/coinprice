<template>
    <div>
        <Card>
            <template #title>
                <div class="flex align-items-center justify-content-between">
                    <div class="w-8">
                        <h1 class="text-2xl m-0 mb-2">Convert</h1>
                        <p class="text-base m-0 font-normal p-text-secondary">
                            {{ from.currency?.name || 'None' }}
                            to
                            {{ to.currency?.name || 'None' }}
                        </p>
                    </div>

                    <SelectButton
                        id="convertorMode"
                        v-model="mode"
                        :options="[
                            ConvertorMode.cryptoToFiat,
                            ConvertorMode.cryptoToCrypto,
                        ]"
                        @change="handleSetDefaults"
                    >
                        <template #option="data">
                            {{
                                data.option === ConvertorMode.cryptoToFiat
                                    ? 'Fiat'
                                    : 'Crypto'
                            }}
                        </template>
                    </SelectButton>
                </div>
            </template>

            <template #content>
                <Input
                    v-model:amount="from.amount"
                    v-model:currency="from.currency"
                    :currencies="getCurrencies(from.type)"
                    :currency-type="from.type"
                    @enter="handleConvert"
                    >From</Input
                >

                <Switcher :loading="loading" @swap="handleSwap" />

                <Input
                    v-model:amount="to.amount"
                    v-model:currency="to.currency"
                    :currencies="getCurrencies(to.type)"
                    :currency-type="to.type"
                    disable
                    >To
                    <template #footer>
                        <hr
                            class="border-bottom-none border-left-none border-right-none border-gray-300"
                        />
                        <span class="text-sm text-gray-500"
                            >converted at
                            {{
                                lastUpdated
                                    ? dayjs(lastUpdated).format('lll')
                                    : 'none'
                            }}</span
                        >
                    </template>
                </Input>
            </template>

            <template #footer>
                <Button
                    :class="ready ? '' : 'p-button-secondary'"
                    :disabled="!ready"
                    class="w-full"
                    label="Convert"
                    @click="handleConvert"
                />
            </template>
        </Card>
    </div>
</template>

<script lang="ts" setup>
enum ConvertorMode {
    cryptoToFiat = 0,
    cryptoToCrypto = 1,
}

import { computed, defineProps, onMounted, ref, watch } from 'vue'
import { ConvertInput, Crypto, CurrencyType, Fiat } from 'shared/types'
import { convert } from '@/api/convertor'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Input from './Input.vue'
import Switcher from './Switcher.vue'
import SelectButton from 'primevue/selectbutton/SelectButton.vue'

dayjs.extend(localizedFormat)

const props = defineProps<{
    cryptos: Crypto[]
    fiats: Fiat[]
}>()

const loading = ref(false)
const ready = computed(() => props.cryptos.length > 0 && props.fiats.length > 0)
const mode = ref<ConvertorMode>(ConvertorMode.cryptoToFiat)
const from = ref<ConvertInput>({ type: CurrencyType.crypto })
const to = ref<ConvertInput>({ type: CurrencyType.fiat })

watch(ready, (val) => {
    if (val) {
        from.value.currency = props.cryptos[0]
        to.value.currency = props.fiats[0]
    }
})

const lastUpdated = ref<Date | null>(null)

const getCurrencies = (type: CurrencyType) =>
    type === CurrencyType.fiat ? props.fiats : props.cryptos

const handleConvert = async () => {
    try {
        loading.value = true
        const resp = await convert({
            from: from.value,
            to: to.value,
        })
        to.value.amount = resp.amount
        lastUpdated.value = resp.lastUpdated
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

const handleSetDefaults = () => {
    if (mode.value === ConvertorMode.cryptoToFiat) {
        from.value.currency = props.cryptos[0]
        from.value.amount = undefined
        to.value.currency = props.fiats[0]
        to.value.amount = 0
    } else {
        from.value.currency = props.cryptos[0]
        from.value.amount = undefined
        to.value.currency = props.cryptos[0]
        to.value.type = CurrencyType.crypto
        to.value.amount = 0
    }
}

onMounted(() => {
    handleSetDefaults()
})
</script>

<style lang="scss">
#convertorMode {
    .p-button {
        padding: 0.5rem;
    }
}
</style>
