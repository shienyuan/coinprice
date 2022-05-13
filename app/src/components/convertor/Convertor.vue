<template>
    <BlockUI class="w-full" :blocked="loading">
        <Card>
            <template #title>
                <div class="flex align-items-center justify-content-between">
                    <div class="w-8">
                        <h1 class="text-2xl m-0 mb-2">Convert</h1>
                        <p class="text-base m-0 font-normal p-text-secondary">
                            <span v-if="to.currency && from.currency">
                                {{ from.currency.name }} to
                                {{ to.currency.name }}
                            </span>
                            <span v-else>loading...</span>
                        </p>
                    </div>

                    <SelectButton
                        id="convertorMode"
                        v-model="mode"
                        :options="[
                            ConvertorMode.cryptoToFiat,
                            ConvertorMode.cryptoToCrypto,
                        ]"
                        @change="handleChangeMode"
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
                <div
                    class="flex justify-content-between align-items-center surface-ground border-round p-3"
                >
                    <InputText
                        class="w-8 p-inputtext-lg p-0 border-none py-2 bg-transparent"
                        placeholder="enter amount"
                        type="number"
                        v-model="from.amount"
                        @keyup.enter="handleConvert"
                    />
                    <Selector
                        v-model="from.currency"
                        :type="from.type"
                        :options="
                            from.type === CurrencyType.crypto ? cryptos : fiats
                        "
                    />
                </div>

                <Switcher :loading="loading" @swap="handleSwap" />

                <div
                    class="flex justify-content-between align-items-center surface-ground border-round p-3"
                >
                    <p class="text-xl m-0 py-2">
                        <span v-if="to.amount">{{
                            to.type === CurrencyType.crypto
                                ? Number(to.amount).toFixed(6)
                                : Number(to.amount).toFixed(2)
                        }}</span>
                        <span v-else>0</span>
                    </p>
                    <Selector
                        v-model="to.currency"
                        :type="to.type"
                        :options="
                            to.type === CurrencyType.crypto ? cryptos : fiats
                        "
                    />
                </div>
            </template>

            <template #footer>
                <Button class="w-full" label="Convert" @click="handleConvert" />
            </template>
        </Card>
    </BlockUI>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
    ConvertInput,
    ConvertorMode,
    Crypto,
    CurrencyType,
    Fiat,
} from 'shared/types'
import SelectButton from 'primevue/selectbutton/SelectButton.vue'
import BlockUI from 'primevue/blockui/BlockUI.vue'
import InputText from 'primevue/inputtext/InputText.vue'
import Selector from './Selector.vue'
import Switcher from './Switcher.vue'
import { convert, getCryptos, getFiats } from '@/api/convertor'

const loading = ref(true)
const mode = ref<ConvertorMode>(ConvertorMode.cryptoToFiat)
const cryptos = ref<Crypto[]>([])
const fiats = ref<Fiat[]>([])
const from = ref<ConvertInput>({ type: CurrencyType.crypto })
const to = ref<ConvertInput>({ type: CurrencyType.fiat })
const lastUpdated = ref<Date | null>(null)

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

const handleChangeMode = () => {
    setDefaultValues()
}

const setDefaultValues = () => {
    if (mode.value === ConvertorMode.cryptoToFiat) {
        from.value.currency = cryptos.value[0]
        to.value.currency = fiats.value[0]
        from.value.type = CurrencyType.crypto
        to.value.type = CurrencyType.fiat
    } else {
        from.value.currency = cryptos.value[0]
        to.value.currency = cryptos.value[1]
        from.value.type = CurrencyType.crypto
        to.value.type = CurrencyType.crypto
    }
    from.value.amount = undefined
    to.value.amount = 0
}

onMounted(async () => {
    fiats.value = getFiats()
    cryptos.value = await getCryptos()
    setDefaultValues()
    loading.value = false
})
</script>

<style lang="scss" scoped>
#convertorMode:deep .p-button {
    padding: 0.5rem;
}
</style>
