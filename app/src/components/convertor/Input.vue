<template>
    <div class="surface-ground border-round p-3">
        <p class="text-sm text-gray-500 m-0"><slot></slot></p>

        <div class="flex justify-content-between align-items-center">
            <div class="w-8">
                <InputNumber
                    class="w-full p-inputtext-lg"
                    :input-class="
                        (disable ? 'pointer-events-none' : '') +
                        ' p-0 border-none py-2'
                    "
                    :placeholder="disable ? 0 : 'enter amount'"
                    :maxFractionDigits="isFiat ? 2 : 6"
                    :minFractionDigits="isFiat ? 2 : 0"
                    :model-value="props.amount"
                    @input="handleInput"
                />
            </div>

            <Button
                @click="handleShow"
                class="p-button-text text-white text-right inline"
            >
                <span>{{ currency.symbol }}</span>
            </Button>
        </div>

        <Dialog
            :header="`Select a ${isFiat ? 'Fiat' : 'Token'}`"
            v-model:visible="show"
            style="width: 400px"
            modal
            dismissable-mask
            close-on-escape
            :draggable="false"
            keep-in-viewport
            content-class="p-0"
        >
            <Listbox
                :filter="true"
                :filterFields="['name', 'symbol']"
                :options="currencies"
                :model-value="props.currency"
                :virtualScrollerOptions="{ itemSize: 10 }"
                listStyle="height:600px"
                class="border-0"
                @change="$emit('update:modelValue', $event.value)"
            >
                <template #option="data">
                    <p class="m-0 py-2">
                        {{ data.option?.sign }}{{ data.option.symbol }}
                        <span class="text-gray-300">
                            {{ data.option.name }}
                        </span>
                    </p>
                </template>
            </Listbox>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { Currency, CurrencyType } from 'shared/types'

import InputNumber from 'primevue/inputnumber/InputNumber.vue'
import Dialog from 'primevue/dialog/Dialog.vue'
import Listbox from 'primevue/listbox/Listbox.vue'
import { InputNumberInputEvent } from 'primevue/inputnumber'

const props = defineProps<{
    currencyType: CurrencyType
    currencies: Currency[]
    currency: Currency | null
    amount: number | null
    disable?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:currency', value: string | number | undefined): void
    (e: 'update:amount', value: string | number | undefined): void
}>()

const show = ref(false)
const isFiat = computed(() => props.currencyType === CurrencyType.fiat)

const handleInput = (event: InputNumberInputEvent) => {
    if (props.disable) {
        return
    } else {
        emit('update:amount', event.value)
    }
}

const handleShow = () => (show.value = true)
</script>

<style>
.p-inputtext:enabled:focus {
    box-shadow: none !important;
}
</style>
